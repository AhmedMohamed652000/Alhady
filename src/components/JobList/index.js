import React from 'react';
import useJobs from '../../hooks/useJobs';
import useSettings from '../../hooks/useSettings';
import './style.css';

const JobList = () => {
    const { jobs, loading, error } = useJobs();
    const { settings } = useSettings();

    const handleApply = (jobTitle) => {
        const email = settings?.email || 'hr@alhady.com';
        const subject = encodeURIComponent(`Application for ${jobTitle} - Al-Hady Engineering`);
        const body = encodeURIComponent(`Dear HR Team,\n\nI am writing to express my interest in the ${jobTitle} position at Al-Hady Engineering.\n\nPlease find my resume attached.\n\nBest regards,\n[Your Name]\n[Your Phone]`);
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    if (loading) return <div className="text-center py-5">Loading jobs...</div>;
    if (error) return <div className="text-center py-5 text-danger">{error}</div>;

    return (
        <section className="job-list-area py-5">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title text-center mb-5">
                            <h2>Current Openings</h2>
                            <p>Join our team of engineering experts and help us build the future.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div className="col-lg-12 mb-4" key={job._id}>
                                <div className="job-card p-4 shadow-sm border rounded">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="job-meta text-muted mb-2">
                                                <span className="me-3"><i className="fa fa-map-marker-alt me-1"></i> {job.location}</span>
                                                <span className="me-3"><i className="fa fa-clock me-1"></i> {job.type}</span>
                                                {job.salary && <span><i className="fa fa-money-bill-wave me-1"></i> {job.salary}</span>}
                                            </div>
                                            <p className="job-description">{job.description}</p>
                                        </div>
                                        <div className="col-md-4 text-md-end">
                                            <button 
                                                className="theme-btn btn-sm"
                                                onClick={() => handleApply(job.title)}
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                    {job.requirements && (
                                        <div className="job-requirements mt-3">
                                            <h5>Requirements:</h5>
                                            <p>{job.requirements}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="lead">No job openings at the moment. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default JobList;
