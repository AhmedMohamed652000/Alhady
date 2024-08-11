import React from "react";

import Img1 from "../../img/portfolio-1.jpg";
import Img2 from "../../img/portfolio-2.jpg";
import Img3 from "../../img/portfolio-3.jpg";
import Img4 from "../../img/portfolio-4.jpg";
import Img5 from "../../img/portfolio-5.jpg";
import Img6 from "../../img/portfolio-6.jpg";

import "./style.css";
import { portfolioData } from "../../Dashboard/dashboard";

const Portfolio = () => {
  return (
    <section className="portfolio-area portfolio-page">
      <div className="container">
        <div className="row">
          {portfolioData.map((portfolio) => (
            <div className="col-md-4 col-sm-6 no-paading">
              <div className="portfolio-box">
                <div className="portfolio-img">
                  <img src={portfolio?.cardImage} alt="portfolio img" />
                </div>
                <div className="portfolio-text text-center">
                  <h2 className="h4">{portfolio?.serviceCagegory}</h2>
                  <h3 className="h2">{portfolio?.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
