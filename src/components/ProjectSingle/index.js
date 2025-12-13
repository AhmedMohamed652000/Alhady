import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";

import "./style.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { ourProjects } from "../../Dashboard/dashboard";

const ProjectSingle = () => {
  const { id } = useParams()
  return (
    <section className="project-details-area">
      <div className="container">
        <div className="row">
          {ourProjects?.map(
            ourProject => {
              if (Number(ourProject?.id) === Number(id)) {
                return <div className="col-lg-12">
                  <div className="project-details-top">
                    <div className="project-details-top-img">
                      <OptimizedImage src={ourProject?.projectImage} alt="img" />
                    </div>
                    <div className="project-details-top-box">
                      <h3>Project Details</h3>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="project-details-top-box-text">
                            <h5>Project</h5>
                            <p>{ourProject?.title}</p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="project-details-top-box-text">
                            <h5>Location</h5>
                            <p>{ourProject?.projectDetails?.location}</p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="project-details-top-box-text">
                            <h5>Year</h5>
                            <p>{ourProject?.projectDetails?.year}</p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="project-details-top-box-text">
                            <h5>Clients</h5>
                            <p>{ourProject?.projectDetails?.client}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="project-details-top-text">
                    <h2>{ourProject?.header}</h2>
                    <p>
                      {ourProject?.description}
                    </p>
                  </div>
                  <div className="project-overview">
                    <div className="row">
                      <div className="col-lg-3 col-6">
                        <div className="project-overview-box">
                          <img src={ourProject?.projectDetails?.statisticsIcon} alt="img" />
                          <h5>Project size</h5>
                          <p>{ourProject?.projectDetails?.projectSize}</p>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="project-overview-box">
                          <img src={ourProject?.projectDetails?.statisticsIcon} alt="img" />
                          <h5>Project time</h5>
                          <p>{ourProject?.projectDetails?.projectTime}</p>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="project-overview-box">
                          <img src={ourProject?.projectDetails?.statisticsIcon} alt="img" />
                          <h5>People worked</h5>
                          <p>{ourProject?.projectDetails?.pepoleWorked}</p>
                        </div>
                      </div>
                      <div className="col-lg-3 col-6">
                        <div className="project-overview-box">
                          <img src={ourProject?.projectDetails?.statisticsIcon} alt="img" />
                          <h5>Project cost</h5>
                          <p>{ourProject?.projectDetails?.projectCost}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="project-details-type">
                    <div className="row">
                      {
                        ourProject.projectSamples?.map((sample, index) => (
                          <div key={index} className="col-md-4">
                            <div className="details-box">
                              <div className="project-box project-details-box">
                                <img src={sample?.image} alt="img" />
                                <p>{sample?.title}</p>
                              </div>
                              <div className="project-details-box-meta-text">
                                <p>
                                  {sample?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                </div>
              }
            })}
        </div>
      </div>
    </section>
  );
};
export default ProjectSingle;
