import React from "react";
import OptimizedImage from "../../utils/OptimizedImage";

import "./style.css";

const Tour = () => {
  const tourBG = "/img/tour-img1_1.webp";
  return (
    <section className="tour-area" style={{ marginTop: "100px" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-6 col-md-8 offset-md-4">
            <div className="site-heading">
              <h3 className="sub-title">TAKE A TOUR!</h3>
              <h2 className="section-title">We make things better</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-11 mx-auto">
            <div className="tour-inn" data-aos="fade-up">
              <OptimizedImage src={tourBG} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Tour);
