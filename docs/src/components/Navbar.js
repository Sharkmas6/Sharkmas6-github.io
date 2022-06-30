import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";



// Hook that alerts clicks outside of the passed ref
function useOutsideAlerter(ref, track) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        track = false;
        console.log(track);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

// Component that alerts if you click outside of it
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.track);

  return <div ref={wrapperRef}>{props.children}</div>;
}

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      // TODO - 0: not shown, 1: transitioning, 2: shown
      smallMenu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSmallMenu = this.toggleSmallMenu.bind(this);
  }

  toggleMenu(){
    this.setState({ menu: !this.state.menu });
  }

  toggleSmallMenu(){
    this.setState({ smallMenu: !this.state.smallMenu });
    /*this.setState({ smallMenu: val }, () => {
      if(val == 1){
        setTimeout(() => {
          this.setState({ menu: false });
        }, 1000);
      }
    });*/
  }

  render () {
    const show = (this.state.menu) ? "open" : "" ;
    const showSmall = (this.state.smallMenu) ? "in" : "collapse" ;
    const btnSmall = (this.state.smallMenu) ? "" : "collapsed" ;

    return <div className="navbar navbar-inverse navbar-fixed-top headroom">
      {/* Fixed navbar */}
      <div className="container">
        <div className="navbar-header">
          {/* Button for smallest screens */}
          <button type="button" className={"navbar-toggle "+btnSmall} onClick={this.toggleSmallMenu} data-toggle="collapse" data-target=".navbar-collapse"><span className="icon-bar" /> <span className="icon-bar" /> <span className="icon-bar" /> </button>
          <NavLink className="navbar-brand" to="/"><img src="logo192.png" alt="Cesar's Portfolio" id="logoImg" /></NavLink>
          {/* /Button for smallest screens */}
        </div>
        <div className={"navbar-collapse "+showSmall}>
          <ul className="nav navbar-nav pull-right">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/trajectory">Trajectory</NavLink></li>
            <li><NavLink to="/animation">Animation</NavLink></li>

            {/* Smaller dropdown */}
            <li className={"dropdown collapse " + show}>
              <NavLink to="#" className="dropdown-toggle" onClick={this.toggleMenu} data-toggle="dropdown">More Pages <b className="caret" /></NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/trajectory">Trajectory</NavLink></li>
              </ul>
            </li>
            {/* /Smaller dropdown */}

            <li><NavLink className="btn" to="/">TEST DEMO</NavLink></li>
          </ul>
        </div>{/*/.nav-collapse */}
        </div>
      {/* /.navbar */}
      </div>
  }

}



export default Navbar;