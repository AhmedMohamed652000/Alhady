import React, { useRef } from "react";
import Slider from "react-slick";
import OptimizedImage from "../../utils/OptimizedImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./style.css";
import useReviews from "../../hooks/useReviews";
import { getImageUrl } from "../../utils/api";

const Testimonial = () => {
  const sliderRef = useRef(null);
  const { reviews, loading } = useReviews();

  const settings = {
    dots: reviews.length > 1,
    infinite: reviews.length > 1,
    arrows: false,
    speed: 1200,
    slidesToShow: Math.min(3, reviews.length),
    slidesToScroll: 1,
    autoplay: reviews.length > 1,
    autoplaySpeed: 2500,
    fade: false,
    responsive: [
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: Math.min(2, reviews.length),
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: Math.min(2, reviews.length),
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

  if (loading || !reviews || reviews.length === 0) {
    return null;
  }

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
              <Slider ref={sliderRef} {...settings}>
                {reviews.map((review, index) => (
                  <div key={index} className="slide">
                    <div className="single-testimonial">
                      <div className="testimonial-text">
                        <i className="fas fa-quote-left quote-icon" />
                      </div>
                      <p>{review.description}</p>
                      <div className="testimonial-meta d-flex align-items-center justify-content-between">
                        <img
                          loading="lazy"
                          src={getImageUrl(review.image)}
                          alt="img"
                          width={50}
                          height={50}
                        />
                        <div className="testimonial-author">
                          <h4>{review.name}</h4>
                          <p>{review.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonial);

