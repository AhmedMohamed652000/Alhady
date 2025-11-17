import React, { Component } from "react";
import Slider from "react-slick";
import OptimizedImage from "../../utils/OptimizedImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import testimonial1 from "../../img/testimonial-1.png";
import testimonial2 from "../../img/testimonial-2.png";
import testimonial3 from "../../img/testimonial-3.png";
import icon from "../../img/gridicons_quote.svg";

import "./style.css";
import { reviews } from "../../Dashboard/dashboard";

class Testimonial extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    var settings = {
      dots: true,
      arrows: false,
      speed: 1200,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      fade: false,
      responsive: [
        {
          breakpoint: 1030,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 850,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    return (
      <section className="testimonial-area" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="site-heading">
                <h3 className="sub-title">OUR TESTIMONIALS</h3>
                <h2 className="section-title">What They ‘re Saying</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="tetimonial-slider">
                <Slider ref={(c) => (this.slider = c)} {...settings}>
                  {reviews.map((review, index) => {
                    return (
                      <div key={index} className="slide">
                        <div className="single-testimonial">
                          <div className="testimonial-text">
                            <OptimizedImage src={icon} alt="icon" lazy={false} />
                            <p>{review.description}</p>
                          </div>
                          <div className="testimonial-meta">
                            <OptimizedImage src={review.image} alt="img" />
                            <div className="testimonial-author">
                              <h4>{review.name}</h4>
                              <p>{review.jobTitle}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Testimonial;
