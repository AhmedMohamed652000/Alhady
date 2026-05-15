import React, {useEffect, useMemo, useState} from 'react';
import AllRoute from '../router';
import AOS from 'aos';
import 'aos/dist/aos.css'
import './App.css';
import useSettings from '../../hooks/useSettings';
import Preloader from '../../components/Preloader';


const App = () => { 
  const { loading } = useSettings();
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Initialize AOS only once
    AOS.init({
      offset: 100,
      duration: 1000,
      once: true, // Animation only happens once
      disable: false
    });
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (!loading) {
      // Start fade out after a small delay
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        // Remove from DOM after transition completes
        const removeTimer = setTimeout(() => {
          setShowLoader(false);
        }, 500); // Matches CSS transition duration
        return () => clearTimeout(removeTimer);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [loading]);

  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => <AllRoute/>, []);

  return (
    <div className="App body_wrap">
      {showLoader && <Preloader fadeOut={fadeOut} />}
      {routes}
    </div>
  );
}

// Memoize App component
export default React.memo(App);
