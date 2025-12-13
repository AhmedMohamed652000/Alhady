import React from "react";
import OptimizedImage from "../../utils/OptimizedImage";

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
                  <OptimizedImage src={portfolio?.cardImage} alt="portfolio img" />
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
