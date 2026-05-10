import React, { useEffect, useState, useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import api, { getImageUrl } from "../../utils/api";
import OptimizedImage from "../../utils/OptimizedImage";
import './style.css'

const Partners = ({ 
  usedTools: propsTools = [], 
  clients: propsClients = [], 
  partners: propsPartners = [],
  showTitle = true,
  title = "Our Partners in Success"
}) => {
  const [usedTools, setUsedTools] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchPromises = [];
        
        if (propsTools.length > 0) {
          setUsedTools(propsTools);
        } else {
          fetchPromises.push(
            api.getWithCache('/tools')
              .then(res => { if (res.data.success) setUsedTools(res.data.data); })
              .catch(() => {})
          );
        }

        if (propsClients.length > 0) {
          setClients(propsClients);
        } else {
          fetchPromises.push(
            api.getWithCache('/clients')
              .then(res => { if (res.data.success) setClients(res.data.data); })
              .catch(() => {})
          );
        }

        if (propsPartners.length > 0) {
          setPartners(propsPartners);
        } else {
          fetchPromises.push(
            api.getWithCache('/partners')
              .then(res => { if (res.data.success) setPartners(res.data.data); })
              .catch(() => {})
          );
        }

        if (fetchPromises.length > 0) {
          await Promise.all(fetchPromises);
        }
      } catch (err) {
        console.error('Error fetching partners data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsTools, propsClients, propsPartners]);

  const getSettings = useMemo(() => (items) => ({
    infinite: items.length > 8,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6,
          infinite: items.length > 6
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          infinite: items.length > 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          infinite: items.length > 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          infinite: items.length > 2
        }
      }
    ]
  }), []);

  const renderSlider = (items, type) => {
    if (items.length === 0) {
      return <p className="py-4">No {type} available.</p>;
    }

    return (
      <Slider {...getSettings(items)}>
        {items.map((item, index) => (
          <div key={item._id || `${type}-${index}`} className="partner-item">
            <OptimizedImage 
              src={getImageUrl(item.icon)} 
              alt={item.title} 
              width={120}
              height={120}
              style={{ objectFit: 'contain', margin: "auto" }}
              compress={true}
            />
          </div>
        ))}
      </Slider>
    );
  };

  if (loading && usedTools.length === 0 && clients.length === 0 && partners.length === 0) {
    return <div className="container my-5 text-center"><p>Loading partners...</p></div>;
  }

  return (
    <div className="container my-5 text-center partners-component">
      {showTitle && <h2 className="section-title mb-5">{title}</h2>}
      
      <ul className="nav nav-pills mb-4 text-center m-auto d-flex justify-content-center" id="pills-tab" role="tablist">
        <li className="nav-item noActive" role="presentation">
          <button className="nav-link noActive active" id="pills-tools-tab" data-bs-toggle="pill" data-bs-target="#pills-tools" type="button" role="tab" aria-controls="pills-tools" aria-selected="true">Used Tools</button>
        </li>
        <li className="nav-item noActive" role="presentation">
          <button className="nav-link noActive" id="pills-clients-tab" data-bs-toggle="pill" data-bs-target="#pills-clients" type="button" role="tab" aria-controls="pills-clients" aria-selected="false">Clients</button>
        </li>
        <li className="nav-item noActive" role="presentation">
          <button className="nav-link noActive" id="pills-partners-tab" data-bs-toggle="pill" data-bs-target="#pills-partners" type="button" role="tab" aria-controls="pills-partners" aria-selected="false">Partners</button>
        </li>
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-tools" role="tabpanel" aria-labelledby="pills-tools-tab">
          {renderSlider(usedTools, "tools")}
        </div>
        <div className="tab-pane fade" id="pills-clients" role="tabpanel" aria-labelledby="pills-clients-tab">
          {renderSlider(clients, "clients")}
        </div>
        <div className="tab-pane fade" id="pills-partners" role="tabpanel" aria-labelledby="pills-partners-tab">
          {renderSlider(partners, "partners")}
        </div>
      </div>
    </div>
  );
};

export default Partners;

