import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../../utils/api";

import "./style.css";

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.getWithCache('/portfolio');
        if (res.data && res.data.success) {
          setPortfolioData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    };
    fetchPortfolio();
  }, []);

  if (portfolioData.length === 0) return null;

  return (
    <section className="portfolio-area portfolio-page">
      <div className="container">
        <div className="row">
          {portfolioData.map((portfolio) => (
            <div key={portfolio._id} className="col-md-4 col-sm-6 no-paading">
              <div className="portfolio-box">
                <div className="portfolio-img">
                  <img src={getImageUrl(portfolio.cardImage)} alt={portfolio.title} />
                </div>
                <div className="portfolio-text text-center">
                  <h2 className="h4">{portfolio.serviceCagegory}</h2>
                  <h3 className="h2">{portfolio.title}</h3>
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
