import React, { Component } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import VideoModal from "../../components/ModalVideo";
import OptimizedBackground from "../../utils/OptimizedBackground";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import "./style.css";
import { sliderServices } from "../../Dashboard/dashboard";

class Hero extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    const settings = {
      dots: false,
      arrows: false,
      speed: 1200,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      fade: true,
    };
    return (
      <section className="hero-area">
        <div className="hero-social">
          <ul>
            <li>
              <Link to="/">
                <i className="fab fa-pinterest-p" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fab fa-facebook-f" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fab fa-instagram" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fab fa-twitter" />
              </Link>
            </li>
          </ul>
          <p>Follow Us</p>
        </div>

        <div className="hero-slider">
          <div className="hero_arrows">
            <button className="button text-white border-white" onClick={this.previous}>
              <i className="fas fa-angle-left text-white border-white" style={{color:'#FFF'}}></i>
            </button>
            <button className="button text-white" style={{border:'1px solid #FFF !important'}} onClick={this.next}>
              <i className="fas fa-angle-right text-white"></i>
            </button>
          </div>
          <Slider ref={(c) => (this.slider = c)} {...settings}>
            {
              sliderServices?.map((service) => {
                // Use public folder path for images
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
                      <div className="video-main">
                        <div className="promo-video">
                          <div className="waves-block">
                            <div className="waves wave-1" />
                            <div className="waves wave-2" />
                            <div className="waves wave-3" />
                          </div>
                        </div>
                        <VideoModal videoId="BqI0Q7e4kbk" />
                      </div>
                    </div>
                  </OptimizedBackground>
                </div>
              })
            }

            {/* <div className="slide">
              <div
                className="hero-slide-item"
                style={{ backgroundImage: `url(${hero2})` }}
              >
                <div className="container">
                  <div className="hero-text">
                    <h2>
                      Unique Architecture <br />
                      Design Ideas
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
                  <div className="video-main">
                    <div className="promo-video">
                      <div className="waves-block">
                        <div className="waves wave-1" />
                        <div className="waves wave-2" />
                        <div className="waves wave-3" />
                      </div>
                    </div>
                    <VideoModal videoId="WVPfu1yOOko" />
                  </div>
                </div>
              </div>
            </div> */}
          </Slider>
        </div>
      </section>
    );
  }
}

export default Hero;
