import logo from '../assets/logo.svg';
import './Anim.css';
import { NavLink } from 'react-router-dom';


const Anim = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>
          Also checkout my <NavLink to="/" className="App-link">other projects</NavLink>!
        </p>
      </header>
    </div>
  );


export default Anim;