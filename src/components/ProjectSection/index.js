import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";
import api, { getImageUrl } from "../../utils/api";

import "./style.css";

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getWithCache('/projects');
        if (response.data.success) {
          setProjects(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading || projects.length === 0) {
    return null;
  }

  return (
    <section className="projects-area pt-0">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <div className="site-heading">
              <h3 className="sub-title">PROJECTS</h3>
              <h2 className="section-title">Featured Work.</h2>
            </div>
            {projects[0] && (
              <div className="project-box" data-aos="fade-up">
                <Link to={`/project-details/${projects[0]._id || projects[0].id}`}>
                  <OptimizedImage src={getImageUrl(projects[0]?.homeCardImage || projects[0]?.projectImage)} alt="img" />
                  <h3>
                    {projects[0]?.title}
                  </h3>
                  <p>{projects[0]?.serviceCagegory}</p>
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
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"
                      />
                      <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
            <div className="text-center mt-5 d-none d-lg-block">
              <Link to="/projects" className="cta-btn btn-fill">
                See Projects
              </Link>
            </div>
          </div>
          <div className="col-sm-6">
            {projects[1] && (
              <div className="project-box" data-aos="fade-up">
                <Link to={`/project-details/${projects[1]._id || projects[1].id}`}>
                  <OptimizedImage src={getImageUrl(projects[1]?.homeCardImage || projects[1]?.projectImage)} alt="img" />
                  <h3>
                    {projects[1]?.title}
                  </h3>
                  <p>{projects[1]?.serviceCagegory}</p>
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
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"
                      />
                      <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
            {projects[2] && (
              <div className="project-box" data-aos="fade-up">
                <Link to={`/project-details/${projects[2]._id || projects[2].id}`}>
                  <OptimizedImage src={getImageUrl(projects[2]?.homeCardImage || projects[2]?.projectImage)} alt="img" />
                  <h3>
                    {projects[2]?.title}
                  </h3>
                  <p>{projects[2]?.serviceCagegory}</p>
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
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"
                      />
                      <circle stroke="#ffffff" cx={12} cy={12} r={3} />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
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
