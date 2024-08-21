import React from "react";
import { Link } from "react-router-dom";


import servicebg from "../../img/services.png";
import projectsbg from "../../img/projects.png";
import portfoliobg from "../../img/portfoliocover.png";
import teambg from "../../img/team.png";
import aboutbg from "../../img/aboutus.png";
import gettouchbg from "../../img/gettouch.png";

import "./style.css";
import { useLocation } from 'react-router-dom';

const PageTitle = (props) => {
  const location = useLocation ()
  return (
    <section
      className="breadcrumb-area"
      style={{ backgroundImage: `url(${location.pathname === '/service' ? servicebg : location.pathname === '/projects' ? projectsbg : location.pathname === '/portfolio' ? portfoliobg : location.pathname === '/team' ? teambg : location.pathname === '/about' ? aboutbg : location.pathname === '/contact' ? gettouchbg : ''})` }}
    >
      <div className="hero-social">
        <ul>
          <li>
            <Link to="/">
              <i className="fab fa-pinterest-p" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <i className="fab fa-facebook-f" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <i className="fab fa-instagram" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <i className="fab fa-twitter" />
            </Link>
          </li>
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
