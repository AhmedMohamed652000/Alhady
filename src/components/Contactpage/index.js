import React from "react";
import ContactForm from "../ContactFrom";
import useSettings from "../../hooks/useSettings";
import "./style.css";

const Contactpage = () => {
  const { settings } = useSettings();

  const backgroundImage = "/img/freetocontact.webp";
  return (
    <section className="contact-page-area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="contact-form" style={{ backgroundImage: `url(${backgroundImage})` }}>
              <div className="site-heading" data-aos="fade-up">
                <h3 className="sub-title">{settings?.companyName || "AL HADY"} (BIM SERVICES)</h3>
                <h2 className="section-title">Let us know how we can add values to your Project !</h2>
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
                      {settings?.address || "EL SHROUK CITY – CAIRO – EGYPT."}
                    </p>
                  </div>
                </div>
                <div className="single-contact-info" data-aos="fade-up">
                  <div className="contact-info-icon">
                    <span className="fas fa-phone-alt" />
                  </div>
                  <div className="contact-info-text">
                    <h5>Phone</h5>
                    <p>{settings?.phone || "(+02) 0100 795 0111"}</p>
                  </div>
                </div>
                <div className="single-contact-info" data-aos="fade-up">
                  <div className="contact-info-icon">
                    <span className="fas fa-envelope" />
                  </div>
                  <div className="contact-info-text">
                    <h5>Email</h5>
                    <p>{settings?.email || "info@alhady-eg.com"}</p>
                  </div>
                </div>
              </div>
              <div className="contact-social" data-aos="fade-up">
                <h5>Follow Us</h5>
                <ul>
                  {settings?.facebook && (
                    <li>
                      <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f" />
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
                  {settings?.instagram && (
                    <li>
                      <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" />
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
                  {settings?.pinterest && (
                    <li>
                      <a href={settings.pinterest} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                  )}
                </ul>
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
