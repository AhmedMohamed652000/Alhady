import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../utils/OptimizedImage";
import api, { getImageUrl } from "../../utils/api";

import "./style.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading projects...</div>;
  }

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
                projects?.map(ourProject => (
                  <div key={ourProject._id || ourProject.id} className="col-md-5  col-sm-6">
                    <div className="project-box">
                      <Link to={`/project-details/${ourProject._id || ourProject.id}`}>
                        <OptimizedImage src={getImageUrl(ourProject?.homeCardImage || ourProject?.projectImage)} alt="img" />
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
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"
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
