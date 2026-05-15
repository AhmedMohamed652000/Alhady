import React from "react";
import { Link, useLocation } from "react-router-dom";
import useSettings from "../../hooks/useSettings";
import "./style.css";

const PageTitle = (props) => {
  const { settings } = useSettings();
  const location = useLocation();
  const servicebg = "/img/services_1.webp";
  const projectsbg = "/img/projects_1.webp";
  const portfoliobg = "/img/portfoliocover_1.webp";
  const teambg = "/img/team_1.webp";
  const aboutbg = "/img/aboutus_1.webp";
  const gettouchbg = "/img/gettouch.webp";
  return (
    <section
      className="breadcrumb-area"
      style={{ backgroundImage: `url(${location.pathname === '/service' ? servicebg : location.pathname === '/projects' ? projectsbg : location.pathname === '/portfolio' ? portfoliobg : location.pathname === '/team' ? teambg : location.pathname === '/about' ? aboutbg : location.pathname === '/contact' ? gettouchbg : ''})` }}
    >
      <div className="hero-social">
        <ul>
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
              <li>
                <Link to="/"><i className="fab fa-linkedin-in" /></Link>
              </li>
            </>
          )}
        </ul>
        <p>Follow Us</p>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="breadcrumb-inn">
              <h1>{props.pageTitle}</h1>
              <ul>
                <li className="home">
                  <Link to="/">
                    <span className="fas fa-home" />
                  </Link>
                </li>
                <li>{props.pagesub}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default PageTitle;
