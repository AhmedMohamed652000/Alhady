import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import OptimizedImage from "../../utils/OptimizedImage";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";
import { sliderServices } from "../../Dashboard/dashboard";

const ServiceSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="service-area mt-5">
      <div className="container">
        <div className="site-heading text-center mt-1">
          <h3 className="sub-title">Services</h3>
          <h2 className="section-title">Our Services </h2>
        </div>
        <Slider {...settings}>
          {[sliderServices[0], sliderServices[1], sliderServices[2]]?.map((service, index) => {
            return <div key={service?.id || index} className="service-box" data-aos="fade-up" data-aos-delay="100">
              <div className="service-icon">
                {/* <OptimizedImage style={{ margin: 'auto' }} src={service?.icon} alt={service?.title} /> */}
                <img src={service?.icon} alt="img" style={{ margin: 'auto' }} />
              </div>
              <div className="service-text">
                <h3>{service?.title}</h3>
                <p>
                  {service?.description}
                </p>
                <Link to={'/contact'} className="cta-btn btn-border mb-3">
                  Contact Us
                </Link>
              </div>
              <OptimizedImage src={service?.cardImage} alt="Interior Design" />
            </div>
          })
          }
        </Slider>
        <div className="text-center  d-block">
              <Link to="/service" className="cta-btn btn-fill">
                Explore More
              </Link>
            </div>
      </div>
    </section>
  );
};

export default ServiceSection;
