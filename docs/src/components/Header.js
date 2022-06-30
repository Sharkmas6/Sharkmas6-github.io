import { Link } from "react-router-dom";


const Header = () => (
  // Header
  <header id="head">
    <div className="container">
      <div className="row">
        <h1 className="lead">CESAR FREITAS (TEST)</h1>
        <p className="tagline">A personal website and portfolio for a Warwick Physics student</p>
        <p><Link to="/" className="btn btn-default btn-lg" role="button">HOME</Link> <Link to="/trajectory" className="btn btn-action btn-lg" role="button">TRAJECTORY</Link></p>
        <noscript>Please note the page might not run as intended if JavaScript is disabled</noscript>
      </div>
    </div>
  </header>
  // /Header
)

export default Header