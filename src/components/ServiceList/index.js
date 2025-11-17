import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";

import serviceImg1 from "../../img/service-bg-1.png";
import serviceImg2 from "../../img/service-bg-2.jpg";
import serviceImg3 from "../../img/service-bg-3.jpg";
import serviceIcon1 from "../../img/service-icon-1.png";
import serviceIcon2 from "../../img/service-icon-2.png";
import serviceIcon3 from "../../img/service-icon-3.png";

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
                <div key={index} className="col-lg-4 col-sm-6">
                  <div
                    className="service-box"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="service-icon">
                      <OptimizedImage src={service?.icon} alt="img" />
                    </div>
                    <div className="service-text">
                      <h3>{service?.title}</h3>
                      <p>
                        {service?.description}
                      </p>
                      <Link to="/contact" className="cta-btn btn-border">
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
