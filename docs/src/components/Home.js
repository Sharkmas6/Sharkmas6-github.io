import { Link, NavLink } from 'react-router-dom';
import Header from './Header';


const Home = () => (
  <div>
    <Header />

    {/* About */}
    <div className="container text-center">
      <h2>Who am I</h2>
      <p>
        I'm Cesar, a Physics student at the University of Warwick.
      </p>
      <p>
        My interests are mainly scientific, with an emphasis on quantum/condensed matter physics,
        and a touch of computing on the side!
      </p>
      <p>
        Other than the numerical and analytical skills needed for a Physics degree,
        I have experience with scientific-focused Python and its most essential packages
        (e.g. NumPy, Pandas, MatPlotLib/Seaborn and Scikit-Learn/Tensorflow).
        I have also some knowledge of some other languages (C, SQL, HTML, CSS, JavaScript, React) and technologies (Origin, Linux OS, CLI).
      </p>
    </div>
    {/* /About */}


    {/* Highlights */}
    <div class="jumbotron top-space">
      <div class="container">

        <h3 class="text-center thin">Projects</h3>
        <p className='mid-aligned-items'>
          I also plan to make some demos of some of my personal projects available on this site.
          So far these include:
        </p>

        <div class="row">
          <div class="col-md-3 col-sm-6 highlight">
            <div class="h-caption"><h4><i class="fa fa-cogs fa-5"></i><Link to="/trajectory">Trajectory</Link></h4></div>
            <div class="h-body text-center">
              <p>
                Fairly simplistic simulation of the trajectory of a projectile in free-fall. The interesting part is the addition of air drag, which leads to a non-linear system with more complex behaviour.
              </p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 highlight">
            <div class="h-caption"><h4><i class="fa fa-flash fa-5"></i>Coming Soon</h4></div>
            <div class="h-body text-center">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, commodi, sequi quis ad fugit omnis cumque a libero error nesciunt molestiae repellat quos perferendis numquam quibusdam rerum repellendus laboriosam reprehenderit! </p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 highlight">
            <div class="h-caption"><h4><i class="fa fa-heart fa-5"></i>Coming Soon</h4></div>
            <div class="h-body text-center">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, vitae, perferendis, perspiciatis nobis voluptate quod illum soluta minima ipsam ratione quia numquam eveniet eum reprehenderit dolorem dicta nesciunt corporis?</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 highlight">
            <div class="h-caption"><h4><i class="fa fa-smile-o fa-5"></i>Coming Soon</h4></div>
            <div class="h-body text-center">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, excepturi, maiores, dolorem quasi reprehenderit illo accusamus nulla minima repudiandae quas ducimus reiciendis odio sequi atque temporibus facere corporis eos expedita? </p>
            </div>
          </div>
        </div>

      </div>
    </div>
    {/* /Highlights */}


  </div>

);

export default Home;