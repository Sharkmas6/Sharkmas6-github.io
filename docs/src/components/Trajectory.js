import Header from "./Header";
import React from "react";
import './Trajectory.css';
//import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { MathJax, MathJaxContext} from 'better-react-mathjax';


const Plot = createPlotlyComponent(Plotly);

const ColorBLUE = "#1f77b4";
const ColorORANGE = "#ff7f0e";
const ColorGREEN = "#2ca02c";
const ColorRED = "#d62728";
const ColorPURPLE = "#9467bd";
const ColorBROWN = "#8c564b";
const ColorPINK = "#e377c2";
const ColorGRAY = "#7f7f7f";
const ColorYELLOW = "#bcbd22";
const ColorTEAL = "#17becf";



function linspace(start, stop, num, endpoint = true) {
  const div = endpoint ? (num - 1) : num;
  const step = (stop - start) / div;
  return Array.from({length: num}, (_, i) => start + step * i);
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
};


function trajectory(tMax, num=50, x0=0, y0=0, v0=0, v0ang=0, g=9.81, k=0, m=1) {
  // setup time array
  let t = linspace(0, tMax, num);
  let dt = t[1] - t[0];
  const v0angRad = degToRad(v0ang);

  // calculate x/y position arrays
  var xi, yi, ri, vxi, vyi, vi, axi, ayi, ai;
  var x = [x0];
  var y = [y0];
  var r = [Math.sqrt(x0**2 + y0**2)];
  var vx = [v0 * Math.cos(v0angRad)];
  var vy = [v0 * Math.sin(v0angRad)];
  var v = [Math.sqrt(vx[0]*vx[0] + vy[0]*vy[0])];
  var ax = [- k / m * v[0] * vx[0]];
  var ay = [- k / m * v[0] * vy[0] - g];
  var a = [Math.sqrt(ax[0]*ax[0] + ay[0]*ay[0])];
  for (let i = 1; i < t.length; i++) {
    vxi = vx[i-1];
    vyi = vy[i-1];
    vi = Math.sqrt(vxi*vxi + vyi*vyi);
    // calculate accelerations
    axi = - k / m * vi * vxi;
    ayi = - g - k / m * vi * vyi;
    ai = Math.sqrt(axi*axi + ayi*ayi);
    ax.push(axi);
    ay.push(ayi);
    a.push(ai);

    // update velocities
    vxi = vxi + axi * dt;
    vyi = vyi + ayi * dt;
    vi = Math.sqrt(vxi*vxi + vyi*vyi);
    vx.push(vxi);
    vy.push(vyi);
    v.push(vi);

    // update positions
    xi = x[i-1] + vxi * dt;
    yi = y[i-1] + vyi * dt;
    ri = Math.sqrt(xi**2 + yi**2);
    x.push(xi);
    y.push(yi);
    r.push(ri);
  };
  return {x:x, y:y, r:r, vx:vx, vy:vy, v:v, ax:ax, ay:ay, a:a, t:t};
}

function trajectoryToEnergy(coordsObj, m=1, g=9.81) {
  let y = coordsObj.y;
  let t = coordsObj.t;
  let vx = coordsObj.vx;
  let vy = coordsObj.vy;
  let vxi, vyi, vSqrt;
  let KE = [];
  let PE = [];
  let TE = [];
  for (let i = 0; i < t.length; i++) {
    vxi = vx[i];
    vyi = vy[i];
    vSqrt = vxi*vxi + vyi*vyi;
    KE.push(0.5 * m * vSqrt);
    PE.push(m * g * y[i]);
    TE.push(KE[i] + PE[i]);
  }
  return {KE: KE, PE: PE, TE:TE, t: t};
}


class TrajectoryApp extends React.Component {
  state = {
    // trajectory calculation variables
    tMax: 2.5,
    x0: 0,
    y0: 0,
    v0: 10,
    v0ang: 60,
    num: 250,
    g: 9.81,
    k: 0,
    m: 1,
    infoText: "",
    infoArg: "",

    // Plotly plotting stuff
    plotData1: [],
    plotData2: [],
    plotLayout1: {
      title: "Trajectory",
      height: 2 * window.innerHeight/3,
      xaxis: {
        title: "X (m)",
      },
      yaxis: {
        title: "Y (m)",
      }
    },
    plotLayout2: {
      title: "Quantities of motion",
      height: 4 * window.innerHeight/3,
      grid: {
        rows: 4,
        columns: 1,
        subplots: [["xy"], ["xy2"], ["xy3"], ["xy4"]]
      },
      colorway: [
        ColorBLUE, ColorORANGE, ColorGREEN,
        ColorBLUE, ColorORANGE, ColorGREEN,
        ColorBLUE, ColorORANGE, ColorGREEN,
        ColorYELLOW, ColorRED, ColorGREEN
      ],
      xaxis: {
        title: "Time (s)",
      },
      yaxis: {
        title: "Position (m)",
      },
      yaxis2: {
        title: "Velocity (m/s)",
      },
      yaxis3: {
        title: "Acceleration (m/s^2)",
      },
      yaxis4: {
        title: "Energy (J)"
      }
    },
    plotConfig: {
      responsive: true
    }
  }

  infoStore = {
    "tMax": "Time up until which to calculate trajectory",
    "x0": "Initial x position",
    "y0": "Initial y position",
    "v0": "Initial velocity modulus",
    "v0 ang": "Initial velocity angle",
    "g": "Gravitational acceleration",
    "num": "Number of points to use in  calculations",
    "k": "Air resistance constant",
    "m": "Mass of object",
  }

  handleInfoChange = (e) => {
    // fix for super/subscript text
    let target = (["SUB", "SUP"].includes(e.target.nodeName)) ? e.target.parentNode : e.target;
    let name = target.textContent.slice(0, -1);
    // console.log(e.target.textContent, name, target, target.textContent);
    this.setState({infoArg: name, infoText: this.infoStore[name]});
  }

  handleChange = (e) => {
    e.preventDefault();
    const val = Number(e.target.value);
    switch (e.target.parentNode.id) {
      case "slider-tMax":
        this.setState({tMax: val});
        break;
      case "slider-x0":
        this.setState({x0: val});
        break;
      case "slider-y0":
        this.setState({y0: val});
        break;
      case "slider-v0":
        this.setState({v0: val});
        break;
      case "slider-v0ang":
        this.setState({v0ang: val});
        break;
      case "slider-num":
        this.setState({num: val});
        break;
      case "slider-g":
        this.setState({g: val});
        break;
      case "slider-k":
        this.setState({k: val});
        break;
      case "slider-m":
        this.setState({m: val});
        break;
      default:
        console.log("No matching slider found");
        break;
    }
  }

  handleSubmit = (e) => {
    const path = trajectory(this.state.tMax, this.state.num, this.state.x0, this.state.y0, this.state.v0, this.state.v0ang, this.state.g, this.state.k, this.state.m);
    const energy = trajectoryToEnergy(path, this.state.m, this.state.g);
    this.updatePlotData(path, energy);
  }

  updatePlotData = (pathObj, energyObj) => {
    let x, y, r, vx, vy, v, ax, ay, a, KE, PE, TE, t;
    // position
    x = pathObj.x;
    y = pathObj.y;
    r = pathObj.r;
    console.log(x);
    // velocities
    vx = pathObj.vx;
    vy = pathObj.vy;
    v = pathObj.v;
    // accelerations
    ax = pathObj.ax;
    ay = pathObj.ay;
    a = pathObj.a;
    // time and energies
    t = pathObj.t;
    KE = energyObj.KE;
    PE = energyObj.PE;
    TE = energyObj.TE;
    this.setState({
      plotData1: [
        {
          x: x,
          y: y,
          mode: "lines",
          name: "Trajectory",
        }
      ],
      plotData2: [
        {
          x: t,
          y: x,
          mode: "lines",
          name: "Horizontal"
        },
        {
          x: t,
          y: y,
          mode: "lines",
          name: "Vertical"
        },
        {
          x: t,
          y: r,
          mode: "lines",
          name: "Total"
        },
        {
          x: t,
          y: vx,
          yaxis: "y2",
          mode: "lines",
          name: "Horizontal",
          showlegend: false
        },
        {
          x: t,
          y: vy,
          yaxis: "y2",
          mode: "lines",
          name: "Vertical",
          showlegend: false
        },
        {
          x: t,
          y: v,
          yaxis: "y2",
          mode: "lines",
          name: "Total",
          showlegend: false
        },
        {
          x: t,
          y: ax,
          yaxis: "y3",
          mode: "lines",
          name: "Horizontal",
          showlegend: false
        },
        {
          x: t,
          y: ay,
          yaxis: "y3",
          mode: "lines",
          name: "Vertical",
          showlegend: false
        },
        {
          x: t,
          y: a,
          yaxis: "y3",
          mode: "lines",
          name: "Total",
          showlegend: false
        },
        {
          x: t,
          y: PE,
          yaxis: "y4",
          mode: "lines",
          name: "Potential"
        },
        {
          x: t,
          y: KE,
          yaxis: "y4",
          mode: "lines",
          name: "Kinetic"
        },
        {
          x: t,
          y: TE,
          yaxis: "y4",
          mode: "lines",
          name: "Total",
          showlegend: false
        },
      ]
    });
  }

  componentDidMount() {
    this.handleSubmit(null);
  }

  render() {
    return (
      <div>
        <Header />
        {/* Main text */}
        <div className="container text-center" id="outputDiv">
          <h2>Simple Trajectory App</h2>
            <MathJax>
              <p>
                This is a test to show a simple trajectory app I made during my early coding days, and am now transitioning to a web app to test my newly acquired React skills.<br />
                To use, select the desired parameters and initial conditions, and click the "Calculate" button to update the graphs.<br />
              </p>
              <p>
                The graphs will show the <strong>trajectory</strong>; the horizontal and vertical <strong>positions</strong>/<strong>velocities</strong>/<strong>accelerations</strong>; and the kinetic, potential, and total <strong>energies</strong>.<br />
                So far, only simple models of gravitational and drag forces are implemented. <br/>
                A constant gravitational acceleration of {"\\( 9.81~ms^{-2} \\)"} and drag force of the form {"\\( \\underline{F_{drag}} = - k v^2 \\underline{\\hat{v}} = - k v \\underline{v} \\)"} are assumed. <br/>
                You can also click on the parameter names to see more information about them.
              </p>
            </MathJax>
          <div id="controlDiv">
            <div id="sliderDiv">
              <h4>Initial values of:</h4>
              {/* Sliders */}
              <ul className="nav">
                <li id="slider-tMax"><span className="sliderLabel" onClick={this.handleInfoChange}>t<sub>Max</sub>:</span> <span className="sliderValue">{this.state.tMax}</span> <input min="0.1" max="10" step="0.1" type="range" value={this.state.tMax} onChange={this.handleChange}/></li>
                <li id="slider-x0"><span className="sliderLabel" onClick={this.handleInfoChange}>x<sub>0</sub>:</span> <span className="sliderValue">{this.state.x0}</span> <input min="-10" max="10" type="range" value={this.state.x0} onChange={this.handleChange}/></li>
                <li id="slider-y0"><span className="sliderLabel" onClick={this.handleInfoChange}>y<sub>0</sub>:</span> <span className="sliderValue">{this.state.y0}</span> <input min="-10" max="10" type="range" value={this.state.y0} onChange={this.handleChange}/></li>
                <li id="slider-v0"><span className="sliderLabel" onClick={this.handleInfoChange}>v<sub>0</sub>:</span> <span className="sliderValue">{this.state.v0}</span> <input min="0" max="20" type="range" value={this.state.v0} onChange={this.handleChange}/></li>
                <li id="slider-v0ang"><span className="sliderLabel" onClick={this.handleInfoChange}>v<sub>0 ang</sub>:</span> <span className="sliderValue">{this.state.v0ang}º</span> <input min="-90" max="90" step="1" type="range" value={this.state.v0ang} onChange={this.handleChange}/></li>
                <li id="slider-g"><span className="sliderLabel" onClick={this.handleInfoChange}>g:</span> <span className="sliderValue">{this.state.g}</span> <input min="1" max="20" step="0.01" type="range" value={this.state.g} onChange={this.handleChange}/></li>
                <li id="slider-num"><span className="sliderLabel" onClick={this.handleInfoChange}>num:</span> <span className="sliderValue">{this.state.num}</span> <input min="5" max="500" type="range" value={this.state.num} onChange={this.handleChange}/></li>
                <li id="slider-k"><span className="sliderLabel" onClick={this.handleInfoChange}>k:</span> <span className="sliderValue">{this.state.k}</span> <input min="0" max="5" step="0.1" type="range" value={this.state.k} onChange={this.handleChange}/></li>
                <li id="slider-m"><span className="sliderLabel" onClick={this.handleInfoChange}>m:</span> <span className="sliderValue">{this.state.m}</span> <input min="1" max="10" type="range" value={this.state.m} onChange={this.handleChange}/></li>
              </ul>
              {/* /Sliders */}
              {/* Submit and calculate */}
              <input id="submitButton" type="submit" value="Calculate" onClick={this.handleSubmit} />
              {/* /Submit and calculate */}
            </div>
            {/* InfoBox */}
            <div id="infoDiv">
              <h4>Info:</h4>
              <MathJax>
                <p>
                  Equations of motion are: <br />
                  {"\\( a_x = - \\frac{k}{m}v v_x \\)"} <br />
                  {"\\( a_y = - g - \\frac{k}{m}v v_y \\)"} <br />
                </p>
                <p>
                  In practice, values are computed through discretisation of the governing equations.
                </p>
              </MathJax>
              {/* Info */}
              <MathJax>
                <h5>{this.state.infoArg}</h5>
                <p>
                  {this.state.infoText}
                </p>
              </MathJax>
              {/* /Info */}
            </div>
            {/* /InfoBox */}
          </div>
          {/* Show plot */}
          <div>
            <Plot style={{position:"relative"}} data={this.state.plotData1} layout={this.state.plotLayout1} config={this.state.plotConfig}/>
            <Plot style={{position:"relative"}} data={this.state.plotData2} layout={this.state.plotLayout2} config={this.state.plotConfig}/>
            {/* <Plot style={{position:"relative"}} data={this.state.plotData} layout={this.state.plotLayout} config={this.state.plotConfig}/> */}
          </div>
          {/* Show plot */}
        </div>
        {/* /Main text */}
      </div>
    )
  }
}


export default TrajectoryApp