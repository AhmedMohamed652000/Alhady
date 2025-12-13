import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";

import "./style.css";
import { ourProjects } from "../../Dashboard/dashboard";

const ProjectSection = () => {
  return (
    <section className="projects-area pt-0">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <div className="site-heading">
              <h3 className="sub-title">PROJECTS</h3>
              <h2 className="section-title">Featured Work.</h2>
            </div>
            <div className="project-box" data-aos="fade-up">
              <Link to={`/project-details/${ourProjects[0]?.id}`}>
                <OptimizedImage src={ourProjects[0]?.homeCardImage} alt="img" />
                <h3>
                  {ourProjects[0]?.title}
                </h3>
                <p>{ourProjects[0]?.serviceCagegory}</p>
                <div className="project-zoom">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-eye"
                  >
                    <path
                      stroke="#ffffff"
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    />
                    <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                  </svg>
                </div>
              </Link>
            </div>
            <div className="text-center mt-5 d-none d-lg-block">
              <Link to="/projects" className="cta-btn btn-fill">
                See Projects
              </Link>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="project-box" data-aos="fade-up">
              <Link to={`/project-details/${ourProjects[1]?.id}`}>
                <OptimizedImage src={ourProjects[1]?.homeCardImage} alt="img" />
                <h3>
                  {ourProjects[1]?.title}
                </h3>
                <p>{ourProjects[1]?.serviceCagegory}</p>
                <div className="project-zoom">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-eye"
                  >
                    <path
                      stroke="#ffffff"
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    />
                    <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                  </svg>
                </div>
              </Link>
            </div>
            <div className="project-box" data-aos="fade-up">
              <Link to={`/project-details/${ourProjects[2]?.id}`}>
                <OptimizedImage src={ourProjects[2]?.homeCardImage} alt="img" />
                <h3>
                  {ourProjects[2]?.title}
                </h3>
                <p>{ourProjects[2]?.serviceCagegory}</p>
                <div className="project-zoom">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-eye"
                  >
                    <path
                      stroke="#ffffff"
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    />
                    <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
          <div className="text-center mt-5 d-block d-lg-none">
            <Link to="/projects" className="cta-btn btn-fill">
              See Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
