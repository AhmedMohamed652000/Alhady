import React from "react";
import OptimizedImage from "../../utils/OptimizedImage";

import "./style.css";

const Feature = () => {
  const Icon1 = "/img/vision_1_1.webp";
  const Icon2 = "/img/mission.png";
  const img1 = "/img/about-v_1.webp";
  const img2 = "/img/about-m_1.webp";
  return (
    <section className="about-page-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="site-heading text-center">
              <h3 className="sub-title">PARTNER WITH ENGISOFT</h3>
              <h2 className="section-title">
                - Digitize your building & construction workflow -
                <br/>- with a Trusted and Qualified BIM Partner -
              </h2>
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="about-left">
              <div className="single-about-listing">
                <div className="about-icon">
                  {/* <OptimizedImage src={Icon1} alt="icon" /> */}
                  <img src={Icon1} alt="icon" />
                </div>
                <div className="about-text">
                  <h3>Our Vision</h3>
                  <p>
                    AL HADY is a premier multidisciplinary BIM services provider and a leading Egypt-based firm specializing in all aspects of BIM. Our expertise spans BIM Interior, BIM Infrastructure, BIM Landscape, BIM Architecture, BIM MEP, and Scan-to-BIM modeling services, including advanced BIM 4D, BIM 5D, BIM 6D, and BIM 7D solutions.
                  </p>
                </div>
              </div>
              <div
                className="single-about-listing wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.5s"
              >
                <div className="about-icon">
                  {/* <OptimizedImage src={Icon2} alt="icon" /> */}
                  <img src={Icon2} alt="icon" />
                </div>
                <div className="about-text">
                  <h3>Our Mission</h3>
                  <p>
                    We create value for our clients worldwide by delivering BIM and engineering services. Our team of over 40 experts operates across the Middle East and India. With a dynamic approach to problem-solving, we consistently provide high-quality services on time, ensuring reliable performance for our clients.
                  </p>
                </div>
              </div>

            </div>
          </div>
          <div className="col-md-6">
            <div className="about-right">
              <div className="single-about-image">
                <OptimizedImage src={img1} alt="img" />
              </div>
              <div className="single-about-image">
                <OptimizedImage src={img2} alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Feature;
