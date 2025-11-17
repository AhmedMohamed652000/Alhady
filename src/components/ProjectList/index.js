import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";

import projectImg1 from "../../img/project-4.jpg";
import projectImg2 from "../../img/project-5.jpg";
import projectImg3 from "../../img/project-6.jpg";
import projectImg4 from "../../img/project-7.jpg";
import projectImg5 from "../../img/project-8.jpg";
import projectImg6 from "../../img/project-9.jpg";
import projectImg7 from "../../img/project-10.jpg";
import projectImg8 from "../../img/project-11.jpg";
import projectImg9 from "../../img/project-12.jpg";
import projectImg10 from "../../img/project-13.jpg";


import "./style.css";
import { ourProjects } from "../../Dashboard/dashboard";

const ProjectList = () => {
  return (
    <section className="projects-area projects-page-area">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mx-auto">
            <div className="row">
              <div className="col-md-12">
                <div className="site-heading text-center">
                  <h3 className="sub-title">PROJECTS</h3>
                  <h2 className="section-title">Featured Work.</h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center justify-content-between">
              {
                ourProjects?.map(ourProject => (
                  <div className="col-md-5  col-sm-6">
                    <div className="project-box">
                      <Link to={`/project-details/${ourProject.id}`}>
                        <OptimizedImage src={ourProject?.homeCardImage} alt="img" />
                        <h3>
                          {ourProject?.title}
                        </h3>
                        <p>{ourProject?.serviceCagegory}</p>
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
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProjectList;
