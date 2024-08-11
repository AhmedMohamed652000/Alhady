import React from "react";
import ContactForm from "../ContactFrom";
import "./style.css";

const Contactpage = () => {
  return (
    <section className="contact-page-area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="contact-form">
              <div className="site-heading" data-aos="fade-up">
                <h3 className="sub-title">Get Quote</h3>
                <h2 className="section-title">Free Consultancy</h2>
              </div>
              <ContactForm />
            </div>
          </div>
          <div className="col-lg-5 col-sm-6">
            <div className="contact-page-left">
              <h3>Contact info</h3>
              <div className="contact-info">
                <div className="single-contact-info" data-aos="fade-up">
                  <div className="contact-info-icon">
                    <span className="fas fa-map-marker-alt" />
                  </div>
                  <div className="contact-info-text">
                    <h5>Head office</h5>
                    <p>
                      EL SHROUK CITY – CAIRO 
                      <br />
                      EGYPT.
                    </p>
                  </div>
                </div>
                <div className="single-contact-info" data-aos="fade-up">
                  <div className="contact-info-icon">
                    <span className="fas fa-phone-alt" />
                  </div>
                  <div className="contact-info-text">
                    <h5>Phone</h5>
                    <p>(+02) 2030 3909</p>
                    <p>(+02) 0100 795 0111</p>
                  </div>
                </div>
                <div className="single-contact-info" data-aos="fade-up">
                  <div className="contact-info-icon">
                    <span className="fas fa-envelope" />
                  </div>
                  <div className="contact-info-text">
                    <h5>Email</h5>
                    <p>info@alhady-eg.com</p>
                    <p>support@alhady-eg.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-sm-6">
            <div className="contact-page-right">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d6315.536912898343!2d31.606720753997802!3d30.158891151409797!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sar!2seg!4v1723402184763!5m2!1sar!2seg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactpage;
