import React from 'react';
import './style.css';

const Preloader = ({ fadeOut }) => {
    return (
        <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loader-inner">
                <div className="logo-loader">
                    <img src="/img/logo.webp" alt="Alhady Logo" />
                </div>
                <div className="loader-bar">
                    <div className="bar-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
