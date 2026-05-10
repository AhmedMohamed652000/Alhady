import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";
import api, { getImageUrl } from "../../utils/api";

import "./style.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const ProjectSingle = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.getWithCache(`/projects/${id}`);
        if (response.data.success) {
          setProject(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center py-5">Project not found</div>;
  }

  return (
    <section className="project-details-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="project-details-top">
              <div className="project-details-top-img">
                <OptimizedImage src={getImageUrl(project?.projectImage)} alt="img" />
              </div>
              <div className="project-details-top-box">
                <h3>Project Details</h3>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="project-details-top-box-text">
                      <h5>Project</h5>
                      <p>{project?.title}</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="project-details-top-box-text">
                      <h5>Location</h5>
                      <p>{project?.projectDetails?.location}</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="project-details-top-box-text">
                      <h5>Year</h5>
                      <p>{project?.projectDetails?.year}</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="project-details-top-box-text">
                      <h5>Clients</h5>
                      <p>{project?.projectDetails?.client}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="project-details-top-text">
              <h2>{project?.header}</h2>
              <p>
                {project?.description}
              </p>
            </div>
            <div className="project-overview">
              <div className="row">
                <div className="col-lg-3 col-6">
                  <div className="project-overview-box">
                    <i className="fa fa-layer-group"></i>
                    <h5>Project size</h5>
                    <p>{project?.projectDetails?.projectSize}</p>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="project-overview-box">
                    <i className="fa fa-clock"></i>
                    <h5>Project time</h5>
                    <p>{project?.projectDetails?.projectTime}</p>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="project-overview-box">
                    <i className="fa fa-users"></i>
                    <h5>People worked</h5>
                    <p>{project?.projectDetails?.peopleWorked}</p>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="project-overview-box">
                    <i className="fa fa-dollar-sign"></i>
                    <h5>Project cost</h5>
                    <p>{project?.projectDetails?.projectCost}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="project-details-type">
              <div className="row">
                {
                  project.projectSamples?.map((sample, index) => (
                    <div key={index} className="col-md-4">
                      <div className="details-box">
                        <div className="project-box project-details-box">
                          <img src={getImageUrl(sample?.image)} alt="img" />
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
        </div>
      </div>
    </section>
  );
};
export default ProjectSingle;
