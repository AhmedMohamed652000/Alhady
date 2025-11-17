import React, {useEffect, useMemo} from 'react';
import AllRoute from '../router';
import AOS from 'aos';
import 'aos/dist/aos.css'
import './App.css';


const App = () => { 

  useEffect(() => {
    // Initialize AOS only once
    AOS.init({
      offset: 100,
      duration: 1000,
      once: true, // Animation only happens once
      disable: false
    });
  }, []); // Empty dependency array - only run once

  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => <AllRoute/>, []);

  return (
    <div className="App body_wrap">
      {routes}
    </div>
  );
}

// Memoize App component
export default React.memo(App);
