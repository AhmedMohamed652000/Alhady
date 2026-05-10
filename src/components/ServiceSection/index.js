import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import api, { getImageUrl } from "../../utils/api";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";

const ServiceSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getWithCache('/services');
        if (res.data && res.data.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  const settings = {
    dots: true,
    infinite: services.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, services.length),
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, services.length),
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

  if (services.length === 0) return null;

  return (
    <section className="service-area mt-5">
      <div className="container">
        <div className="site-heading text-center mt-1">
          <h3 className="sub-title">Services</h3>
          <h2 className="section-title">Our Services </h2>
        </div>
        <Slider {...settings}>
          {services.slice(0, 6).map((service, index) => {
            return (
              <div key={service._id || index} className="service-box" data-aos="fade-up" data-aos-delay="100">
                <div className="service-icon">
                  <img src={getImageUrl(service.icon)} alt={service.title} style={{ margin: 'auto' }} />
                </div>
                <div className="service-text">
                  <h3>{service.title}</h3>
                  <p>
                    {service.description}
                  </p>
                  <Link to={'/contact'} className="cta-btn btn-border mb-3">
                    Contact Us
                  </Link>
                </div>
                <img src={getImageUrl(service.cardImage)} alt={service.title} />
              </div>
            );
          })}
        </Slider>
        <div className="text-center d-block">
          <Link to="/service" className="cta-btn btn-fill">
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
