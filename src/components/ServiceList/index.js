import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";

import { sliderServices } from './../../Dashboard/dashboard';
import "./style.css";

const ServiceList = () => {
  return (
    <section className="service-area service-page-area">
      <div className="container">
        <div className="row">
          {
            sliderServices.map((service, index) => {
              return (
                <div key={index} className="col-lg-4 col-sm-6 mb-3">
                  <div
                    className="service-box"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="service-icon">
                      {/* <OptimizedImage src={service?.icon} alt="img" /> */}
                        <img src={service?.icon} alt="img" />
                    </div>
                    <div className="service-text">
                      <h3>{service?.title}</h3>
                      <p>
                        {service?.description}
                      </p>
                      <Link to="/contact" className="cta-btn btn-border  mb-3">
                        Contact Us
                      </Link>
                    </div>
                    <OptimizedImage src={service?.cardImage} alt="img" />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </section>
  );
};
export default ServiceList;
