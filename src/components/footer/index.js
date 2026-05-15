import React from "react";
import { Link } from "react-router-dom";
import useSettings from "../../hooks/useSettings";

import "./style.css";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-6 order-lg-1 order-1">
              <div className="single-footer">
                <h3>{settings?.companyName || "AL HADY"}</h3>
                <p>
                  {settings?.aboutDescription || "We are professionals with expertise in design, engineering, project management, and technology offer Comprehensive Building Information Modelling (BIM) services."}
                </p>
                <ul className="footer-contact">
                  <li>
                    <i className="fas fa-phone-square-alt" /> {settings?.phone || "(+02) 0100 795 0111"}
                  </li>
                  <li>
                    <i className="fas fa-envelope" /> {settings?.email || "info@Alhady-eg.com"}
                  </li>
                  <li>
                    <i className="fas fa-map" /> {settings?.address || "EL SHROUK CITY – CAIRO – EGYPT ."}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 order-lg-2 order-3">
              <div className="single-footer pl-lg-5">
                <h3>Quick Links</h3>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/projects">Our Projects</Link>
                  </li>
                  <li>
                    <Link to="/service">Our Services</Link>
                  </li>
                  <li>
                    <Link to="/team">Meet The Team</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 order-lg-4 order-2">
              <div className="single-footer text-lg-center">
                <h3>Follow Us</h3>
                <ul className="footer-social">
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
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="fade_rule" />
      </div>
      <div className="copyright">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p>&copy; Copyright 2024 by {settings?.companyName || "AL-HADY"}</p>
              <p>🗲 Developed by CodeMorning 🗲</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default React.memo(Footer);
