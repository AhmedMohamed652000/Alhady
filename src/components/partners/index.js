import React from "react";


import { usedTools } from "../../Dashboard/dashboard";
import "./style.css";

const Partners = () => {
  return (
    <section className="partners-area pt-0" data-aos="fade-up">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="partner-inn">
              <ul>
                {usedTools?.map((usedTools,index) => (
                  <li key={index}>
                    <img style={{width:80,height:80}} src={usedTools.icon} alt={usedTools.title} />
                  </li>

                ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
