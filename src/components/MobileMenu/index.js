import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSettings from "../../hooks/useSettings";

import "./style.css";

const menus = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },

  {
    id: 2,
    title: "Service",
    link: "/service",
  },

  {
    id: 3,
    title: "Projects",
    link: "/projects",
  },
  {
    id: 4,
    title: "Portfolio",
    link: "/portfolio",
  },
  {
    id: 7,
    title: "Team",
    link: "/team",
  },
  {
    id: 8,
    title: "Jobs",
    link: "/jobs",
  },
  {
    id: 5,
    title: "About",
    link: "/about",
  },
  {
    id: 88,
    title: "Contact",
    link: "/contact",
  },
];

const MobileMenu = () => {
  const [isMenuShow, setIsMenuShow] = useState(false);
  const [isOpen, setIsOpen] = useState(0);
  const { settings } = useSettings();

  const menuHandler = () => {
    setIsMenuShow(!isMenuShow);
  };

  const handleSetIsOpen = (id) => () => {
    setIsOpen(id === isOpen ? 0 : id);
  };

  return (
    <div className="responsiveMenu">
      <nav
        id="mobileMenu"
        className={`mobileMenu ${isMenuShow ? "active" : ""}`}
      >
        <ul className="responsivemenu">
          {menus.map((item) => {
            return (
              <li key={item.id}>
                {item.submenu ? (
                  <p
                    onClick={handleSetIsOpen(item.id)}
                    aria-expanded={isMenuShow}
                  >
                    {item.title}
                  </p>
                ) : (
                  <Link to={item.link}>{item.title}</Link>
                )}

                {item.submenu ? (
                  <Collapse in={item.id === isOpen}>
                    <ul className="sub-menu">
                      {item.submenu.map((submenu) => (
                        <li key={submenu.id}>
                          <Link className="active" to={submenu.link}>
                            {submenu.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>

        {/* Dynamic Social Links in Mobile Menu */}
        <div className="mobile-social-links mt-4 px-4 pb-4">
          <h5 className="text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>Follow Us</h5>
          <div className="d-flex gap-3">
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-facebook-f" />
              </a>
            )}
            {settings?.twitter && (
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-twitter" />
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-instagram" />
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-linkedin-in" />
              </a>
            )}
            {settings?.pinterest && (
              <a href={settings.pinterest} target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-pinterest-p" />
              </a>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`spinner-master ${isMenuShow ? "active" : ""}`}
        onClick={menuHandler}
      >
        <div id="spinner-form" className="spinner-spin">
          <div className="spinner diagonal part-1"></div>
          <div className="spinner horizontal"></div>
          <div className="spinner diagonal part-2"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
