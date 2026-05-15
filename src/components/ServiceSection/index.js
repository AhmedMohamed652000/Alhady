import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../../utils/api";

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

  if (!services || services.length === 0) return null;

  return (
    <section className="service-area mt-5">
      <div className="container">
        <div className="site-heading text-center mt-1">
          <h3 className="sub-title">Services</h3>
          <h2 className="section-title">Our Services </h2>
        </div>
        <div className="row">
          {services.slice(0, 6).map((service, index) => {
            return (
              <div key={service._id || index} className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="service-box" data-aos="fade-up" data-aos-delay="100">
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
              </div>
            );
          })}
        </div>
        <div className="text-center mt-4">
          <Link to="/service" className="cta-btn btn-fill">
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ServiceSection);
