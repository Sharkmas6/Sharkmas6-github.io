import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Anim from './components/Anim';
import Test from './components/Test';
import Navbar from './components/Navbar';
import TrajectoryApp from './components/Trajectory';
import { MathJaxContext } from 'better-react-mathjax';


function App() {
  return <div>
    <MathJaxContext>
      <Navbar />
      <Main />
    </MathJaxContext>
  </div>
}

function Main () {
  return (
    <Routes> { /* The Switch decides which component to show based on the current URL. */ }
      <Route path='/' element={<Home />}></Route>
      <Route path='/index' element={<Home />}></Route>
      <Route path='/test' element={<Test />}></Route>
      <Route path='/animation' element={<Anim />}></Route>
      <Route path='/trajectory' element={<TrajectoryApp />}></Route>
    </Routes>
  );
}

export default App;
