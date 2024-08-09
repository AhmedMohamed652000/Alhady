import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import serviceImg1 from "../../img/service-bg-1.png";
import serviceImg2 from "../../img/service-bg-2.jpg";
import serviceImg3 from "../../img/service-bg-3.jpg";
import serviceIcon1 from "../../img/service-icon-1.png";
import serviceIcon2 from "../../img/service-icon-2.png";
import serviceIcon3 from "../../img/service-icon-3.png";

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
    <section className="service-area">
      <div className="container">
        <Slider {...settings}>
          {sliderServices?.map((service) => {
            return <div className="service-box" data-aos="fade-up" data-aos-delay="100">
              <div className="service-icon">
                <img src={service?.icon} alt="Interior Design" />
              </div>
              <div className="service-text">
                <h3>{service?.title}</h3>
                <p>
                  {service?.description}
                </p>
                <Link to={service?.link} className="cta-btn btn-border">
                  Read More
                </Link>
              </div>
              <img src={service?.cardImage} alt="Interior Design" />
            </div>
          })
          }
        </Slider>
      </div>
    </section>
  );
};

export default ServiceSection;
