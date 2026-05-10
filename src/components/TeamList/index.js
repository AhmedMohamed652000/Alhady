import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../../utils/api";

import "./style.css";

const Team = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.getWithCache('/team');
        if (res.data && res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="team-page-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div
              className="site-heading text-center wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0.8s"
            >
              <h3 className="sub-title">TEAM MEMBERS</h3>
              <h2 className="section-title">Our Creative Minds</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="row justify-content-center">
              {team?.map(member => {
                return (
                  <div key={member._id} className="col-md-4 col-sm-6">
                    <div className="single-team-box">
                      <div className="team-image">
                        <img 
                          src={getImageUrl(member.profileImage) || "/assets/img/team/1.jpg"} 
                          alt={member.name} 
                        />
                      </div>
                      <div className="team-meta">
                        <h4>{member.name}</h4>
                        <p>{member.position}</p>
                      </div>
                    </div>
                  </div>
                )
              })
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Team;
