import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS
import OptimizedImage from "../../utils/OptimizedImage";
import './style.css'
const Partners = ({ usedTools, clients, partners }) => {
  const settings = {
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 1500,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          autoplay: true,
          autoplaySpeed: 1500,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 1500,
        }
      }
    ]
  };

  return (
    <div className="container my-5 text-center">
      <h2 className="section-title">" Our Partners in Seccess "</h2>
      <ul className="nav nav-pills mb-3 text-center m-auto d-flex justify-content-center" id="pills-tab" role="tablist">
        <li className="nav-item noActive  " role="presentation">
          <button className="nav-link noActive  active" id="pills-tools-tab" data-bs-toggle="pill" data-bs-target="#pills-tools" type="button" role="tab" aria-controls="pills-tools" aria-selected="true">Used Tools</button>
        </li>
        <li className="nav-item noActive " role="presentation">
          <button className="nav-link noActive " id="pills-clients-tab" data-bs-toggle="pill" data-bs-target="#pills-clients" type="button" role="tab" aria-controls="pills-clients" aria-selected="false">Clients</button>
        </li>
        <li className="nav-item noActive " role="presentation">
          <button className="nav-link noActive" id="pills-partners-tab" data-bs-toggle="pill" data-bs-target="#pills-partners" type="button" role="tab" aria-controls="pills-partners" aria-selected="false">Partners</button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-tools" role="tabpanel" aria-labelledby="pills-tools-tab">
          <Slider {...settings}>
            {usedTools?.map((tool, index) => (
              <div key={index}>
                <OptimizedImage src={tool.icon} alt={tool.title} style={{ width: 200, height: 200, margin: "auto" }} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="tab-pane fade" id="pills-clients" role="tabpanel" aria-labelledby="pills-clients-tab">
          <Slider {...settings}>
            {clients?.map((client, index) => (
              <div key={index}>
                <OptimizedImage src={client.icon} alt={client.title} style={{ width: 250, height: 200, margin: "auto" }} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="tab-pane fade" id="pills-partners" role="tabpanel" aria-labelledby="pills-partners-tab">
          <Slider {...{settings, slidesToShow:1}}>
            {partners?.map((partner, index) => (
              <div key={index}>
                <OptimizedImage src={partner.icon} alt={partner.title} style={{ width: 350, height: 200, margin: "auto" }} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Partners;
