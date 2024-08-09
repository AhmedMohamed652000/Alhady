import React from "react";
import CountUp from "react-countup";

import bg from "../../img/about_background.png";
import img1 from "../../img/about-1.png";
import img2 from "../../img/about-2.png";
import signature from "../../img/signature.png";

import "./style.css";

const About = () => {
  return (
    <section className="about-area" style={{ backgroundImage: `url(${bg})` }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 col-md-6">
            <div className="about-left" data-aos="fade-right">
              <div className="site-heading">
                <h3 className="sub-title">ABOUT US</h3>
                <h2 className="section-title">
                  Partner with Al-Hady
                </h2>
              </div>
              <p>
                Digitize your building & construction
                workflow and be More Profitable in
                your Projects with a Trusted and Qualified
                BIM Partner.
              </p>

              <div className="about-signature">
                <div className="signature-left cta-btn btn-fill" style={{ cursor: 'pointer' }}>
                  <a
                    href="/El Hady Office Brochure.pdf"
                    download
                    style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  >
                    Download Brochure
                  </a>

                </div>

              </div>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1 col-md-6">
            <div className="about-counter">
              <div className="counter-box">
                <h2>
                  <span className="counter">
                    <CountUp start={0} end={15} duration={1} />
                  </span>
                  +
                </h2>
                <p>
                  Years of <br />
                  experience
                </p>
              </div>
              <div className="counter-box">
                <h2>
                  <span className="counter">
                    <CountUp start={0} end={187} duration={12.4} />
                  </span>
                  +
                </h2>
                <p>
                  Projects <br />
                  Completed
                </p>
              </div>

            </div>
            <div className="about-right" data-aos="fade-left">
              <img className="about_img_1" src={img2} alt="img" />
              <img className="about_img_2" src={img1} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
