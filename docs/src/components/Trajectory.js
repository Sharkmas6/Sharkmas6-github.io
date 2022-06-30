import Header from "./Header";
import React from "react";
import './Trajectory.css';
//import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { MathJax, MathJaxContext} from 'better-react-mathjax';


const Plot = createPlotlyComponent(Plotly);



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
  var xi, yi, vxi, vyi, vi, axi, ayi, ai;
  var x = [x0];
  var y = [y0];
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
    x.push(xi);
    y.push(yi);
  };
  return {x:x, y:y, vx:vx, vy:vy, v:v, ax:ax, ay:ay, a:a, t:t};
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
    plotData: [],
    plotLayout: {
      title: "Trajectory",
      height: 5*window.innerHeight/3,
      grid: {
        rows: 5,
        columns: 1,
        subplots: [["xy"], ["x2y2"], ["x2y3"], ["x2y4"], ["x2y5"]]
      },
      xaxis: {
        title: "X (m)",
      },
      yaxis: {
        title: "Y (m)",
      },
      xaxis2: {
        title: "Time (s)",
      },
      yaxis2: {
        title: "Position (m)",
      },
      yaxis3: {
        title: "Velocity (m/s)",
      },
      yaxis4: {
        title: "Acceleration (m/s^2)",
      },
      yaxis5: {
        title: "Energy (J)",
      },
    },
    plotConfig: {
      responsive: true
    },
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
        this.setState({y0: val})
        break;
      case "slider-v0":
        this.setState({v0: val})
        break;
      case "slider-v0ang":
        this.setState({v0ang: val})
        break;
      case "slider-num":
        this.setState({num: val})
        break;
      case "slider-g":
        this.setState({g: val})
        break;
      case "slider-k":
        this.setState({k: val})
        break;
      case "slider-m":
        this.setState({m: val})
        break;
      default: break;
    }
  }

  handleSubmit = (e) => {
    try {
      e.preventDefault();
    } catch (error) {}
    const path = trajectory(this.state.tMax, this.state.num, this.state.x0, this.state.y0, this.state.v0, this.state.v0ang, this.state.g, this.state.k, this.state.m);
    const energy = trajectoryToEnergy(path, this.state.m, this.state.g);
    this.updatePlotData(path, energy);
  }

  updatePlotData = (pathObj, energyObj) => {
    let x, y, vx, vy, v, ax, ay, a, KE, PE, TE, t;
    // position
    x = pathObj.x;
    y = pathObj.y;
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
      plotData: [
        {
          x: x,
          y: y,
          mode: "lines",
          name: "Trajectory",
        },
        {
          x: t,
          y: x,
          xaxis: "x2",
          yaxis: "y2",
          mode: "lines",
          name: "Horizontal Position",
        },
        {
          x: t,
          y: y,
          xaxis: "x2",
          yaxis: "y2",
          mode: "lines",
          name: "Vertical Position",
        },
        {
          x: t,
          y: vx,
          xaxis: "x2",
          yaxis: "y3",
          mode: "lines",
          name: "Horizontal Velocity",
        },
        {
          x: t,
          y: vy,
          xaxis: "x2",
          yaxis: "y3",
          mode: "lines",
          name: "Vertical Velocity",
        },
        {
          x: t,
          y: v,
          xaxis: "x2",
          yaxis: "y3",
          mode: "lines",
          name: "Modulus Velocity",
        },
        {
          x: t,
          y: ax,
          xaxis: "x2",
          yaxis: "y4",
          mode: "lines",
          name: "Horizontal Acceleration",
        },
        {
          x: t,
          y: ay,
          xaxis: "x2",
          yaxis: "y4",
          mode: "lines",
          name: "Vertical Acceleration",
        },
        {
          x: t,
          y: a,
          xaxis: "x2",
          yaxis: "y4",
          mode: "lines",
          name: "Modulus Acceleration",
        },
        {
          x: t,
          y: KE,
          xaxis: "x2",
          yaxis: "y5",
          mode: "lines",
          name: "Kinetic Energy",
        },
        {
          x: t,
          y: PE,
          xaxis: "x2",
          yaxis: "y5",
          mode: "lines",
          name: "Potential Energy",
        },
        {
          x: t,
          y: TE,
          xaxis: "x2",
          yaxis: "y5",
          mode: "lines",
          name: "Total Energy",
        },
      ]
    })
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
            <Plot style={{position:"relative"}} data={this.state.plotData} layout={this.state.plotLayout} config={this.state.plotConfig}/>
          </div>
          {/* Show plot */}
        </div>
        {/* /Main text */}
      </div>
    )
  }
}


export default TrajectoryApp