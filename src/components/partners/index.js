import React from "react";

import partnerImg1 from "../../img/partner-1.png";
import partnerImg2 from "../../img/partner-2.png";
import partnerImg3 from "../../img/partner-3.png";
import partnerImg4 from "../../img/partner-4.png";
import partnerImg5 from "../../img/partner-5.png";
import partnerImg6 from "../../img/partner-6.png";
import partnerImg7 from "../../img/partner-7.png";

import "./style.css";
import { usedTools } from "../../Dashboard/dashboard";
// import { usedToolss } from "../../img";

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
                    <img width={150} height={150} style={{width:100,height:100}} src={usedTools.icon} alt={usedTools.title} />
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
