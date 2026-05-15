import React, { useRef } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import OptimizedBackground from "../../utils/OptimizedBackground";
import useSettings from "../../hooks/useSettings";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./style.css";
import { sliderServices } from "../../Dashboard/dashboard";

const Hero = () => {
  const { settings } = useSettings();
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };
  const previous = () => {
    sliderRef.current.slickPrev();
  };

  const sliderSettings = {
    dots: false,
    arrows: false,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: (sliderServices?.length || 0) > 1,
    autoplaySpeed: 2500,
    fade: true,
    infinite: (sliderServices?.length || 0) > 1,
  };

  return (
    <section className="hero-area">
      <div className="hero-social">
        <ul>
          {settings?.pinterest && (
            <li>
              <a href={settings.pinterest} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-pinterest-p" />
              </a>
            </li>
          )}
          {settings?.facebook && (
            <li>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f" />
              </a>
            </li>
          )}
          {settings?.instagram && (
            <li>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram" />
              </a>
            </li>
          )}
          {settings?.twitter && (
            <li>
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter" />
              </a>
            </li>
          )}
          {settings?.linkedin && (
            <li>
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in" />
              </a>
            </li>
          )}
          {!settings?.facebook && !settings?.twitter && !settings?.instagram && !settings?.pinterest && !settings?.linkedin && (
            <>
              <li>
                <Link to="/"><i className="fab fa-pinterest-p" /></Link>
              </li>
              <li>
                <Link to="/"><i className="fab fa-facebook-f" /></Link>
              </li>
              <li>
                <Link to="/"><i className="fab fa-instagram" /></Link>
              </li>
              <li>
                <Link to="/"><i className="fab fa-twitter" /></Link>
              </li>
              <li>
                <Link to="/"><i className="fab fa-linkedin-in" /></Link>
              </li>
            </>
          )}
        </ul>
        <p>Follow Us</p>
      </div>

      <div className="hero-slider">
        <div className="hero_arrows">
          <button className="button text-white border-white" onClick={previous}>
            <i className="fas fa-angle-left"></i>
          </button>
          <button className="button text-white border-white" onClick={next}>
            <i className="fas fa-angle-right"></i>
          </button>
        </div>
        <Slider ref={sliderRef} {...sliderSettings}>
          {
            sliderServices?.map((service) => {
              const imagePath = service?.sliderImage 
                ? `/img/${service.sliderImage}`
                : null;
              
              if (!imagePath) return null;
              
              return <div className="slide" key={service?.id || Math.random()}>
                <OptimizedBackground
                  className="hero-slide-item"
                  imageSrc={imagePath}
                  quality={0.75}
                  maxWidth={1920}
                  maxHeight={1080}
                >
                  <div className="container">
                    <div className="hero-text">
                      <h2>
                        {service.title}
                      </h2>
                      <div className="hero-action">
                        <Link to="/projects" className="cta-btn btn-fill">
                          See Projects
                        </Link>
                        <Link to="/contact" className="cta-btn btn-border">
                          Get Contact
                        </Link>
                      </div>
                    </div>
                  </div>
                </OptimizedBackground>
              </div>
            })
          }
        </Slider>
      </div>
    </section>
  );
};

export default React.memo(Hero);
