import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import OptimizedImage from "../../utils/OptimizedImage";

import "./style.css";

const BlogSingle = () => {
  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  const blog1 = "/img/news-1_1.webp";
  const blog2 = "/img/news-2_1.webp";
  const Img1 = "/img/blpl-1.webp";
  const Img2 = "/img/blpl-2.webp";
  const Img3 = "/img/blpl-3.webp";

  return (
    <section className="blog-page-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <div className="blog-left">
              <div className="row">
                <div className="col-lg-12">
                  <div className="news-img">
                    <OptimizedImage src={blog1} alt="img" />
                  </div>
                </div>
              </div>
              <div className="blog-left-content">
                <div className="blog-info">
                  <div className="b_info_flex">
                    <div className="blog-info-img">
                      <OptimizedImage src={Img1} alt="img" />
                    </div>
                    <div className="blog-info-date">
                      <p>
                        <i className="far fa-calendar-alt" />
                        Jan-6 2021 at 7.15pm
                      </p>
                    </div>
                  </div>
                  <div className="blog-info-comments">
                    <p>
                      <i className="far fa-comments" />
                      Comments (20)
                    </p>
                  </div>
                </div>
                <h2>Modern extension to brick house</h2>
                <p>
                  Asperiores, tenetur, blanditiis, quaerat odit ex
                  exercitationem pariatur quibusdam veritatis quisquam
                  laboriosam esse beatae hic perferendis velit deserunt soluta
                  iste repellendus officia in neque veniam debitis Consectetur,
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit
                </p>
                <p>
                  Nullam id dolor id nibh ultricies vehicula ut id elit.
                  Curabitur blandit tempus porttitor. Integer posuere erat a
                  ante venenatis dapibus posuere velit aliquet. Cras justo odio,
                  dapibus ac facilisis in, egestas eget quam.{" "}
                </p>
                <p>
                  Asperiores, tenetur, blanditiis, quaerat odit ex
                  exercitationem pariatur quibusdam veritatis quisquam
                  laboriosam esse beatae hic perferendis velit deserunt soluta
                  iste repellendus officia in neque veniam debitis Consectetur,
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit
                </p>
                <p>
                  Nullam id dolor id nibh ultricies vehicula ut id elit.
                  Curabitur blandit tempus porttitor. Integer posuere erat a
                  ante venenatis dapibus posuere velit aliquet. Cras justo odio,
                  dapibus ac facilisis in, egestas eget quam.{" "}
                </p>
                <p>
                  Asperiores, tenetur, blanditiis, quaerat odit ex
                  exercitationem pariatur quibusdam veritatis quisquam
                  laboriosam esse beatae hic perferendis velit deserunt soluta
                  iste repellendus officia in neque veniam debitis Consectetur,
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit
                </p>
                <p>
                  Nullam id dolor id nibh ultricies vehicula ut id elit.
                  Curabitur blandit tempus porttitor. Integer posuere erat a
                  ante venenatis dapibus posuere velit aliquet. Cras justo odio,
                  dapibus ac facilisis in, egestas eget quam.{" "}
                </p>
                <p>-Daniel Zones</p>
                <div className="blog-left-content-share">
                  <h3>Share this post</h3>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-youtube" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-instagram-square" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="blog-left-related-post">
                <h3>Related Blog Post</h3>
                <div className="row">
                  <div className="col-lg-6">
                    <Link to="/blog-single" className="news-box">
                      <div className="news-img">
                        <OptimizedImage src={blog1} alt="img" />
                      </div>
                      <div className="news-text">
                        <p className="news-date">Planning - 21.04.2020</p>
                        <h3>Modern Architecture Buildings</h3>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-6">
                    <Link to="/blog-single" className="news-box">
                      <div className="news-img">
                        <OptimizedImage src={blog2} alt="img" />
                      </div>
                      <div className="news-text">
                        <p className="news-date">Planning - 20.04.2020</p>
                        <h3>Modern Interior Design</h3>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="blog-comment-area">
                <h3>
                  Comments <span>03</span>
                </h3>
                <div className="blog-comment-box">
                  <div className="blog-comment-people">
                    <OptimizedImage src={Img1} alt="img" />
                  </div>
                  <div className="blog-comment-text">
                    <div className="blog-comment-date">
                      <h5>STEFFAN</h5>
                      <p>
                        <i className="far fa-calendar-alt" />
                        Jan-6 2021 at 7.15pm
                      </p>
                    </div>
                    <p>
                      Asperiores, tenetur, blanditiis, quaerat odit ex
                      exercitationem pariatur quibusdam veritatis quisquam
                      laboriosam esse beatae hic perferendis velit deserunt
                      soluta iste repellendus officia in neque veniam debitis
                    </p>
                  </div>
                </div>
                <div className="blog-comment-box blog-replay-box">
                  <div className="blog-comment-people">
                    <OptimizedImage src={Img2} alt="img" />
                  </div>
                  <div className="blog-comment-text">
                    <div className="blog-comment-date">
                      <h5>LARAFIN ZARA</h5>
                      <p>
                        <i className="far fa-calendar-alt" />
                        Jan-6 2021 at 7.20pm
                      </p>
                    </div>
                    <p>
                      Asperiores, tenetur, blanditiis, quaerat odit ex
                      exercitationem pariatur quibusdam veritatis quisquam
                      laboriosam esse beatae hic perferendis velit deserunt
                      soluta iste repellendus officia in neque veniam debitis
                    </p>
                  </div>
                </div>
                <div className="blog-comment-box">
                  <div className="blog-comment-people">
                    <OptimizedImage src={Img3} alt="img" />
                  </div>
                  <div className="blog-comment-text">
                    <div className="blog-comment-date">
                      <h5>THOMASH CLEAV</h5>
                      <p>
                        <i className="far fa-calendar-alt" />
                        Jan-8 2021 at 10.45am
                      </p>
                    </div>
                    <p>
                      Asperiores, tenetur, blanditiis, quaerat odit ex
                      exercitationem pariatur quibusdam veritatis quisquam
                      laboriosam esse beatae hic perferendis velit deserunt
                      soluta iste repellendus officia in neque veniam debitis
                    </p>
                  </div>
                </div>
              </div>
              <div className="blog-leave-comment">
                <h3>Leave A Comments</h3>
                <form onSubmit={SubmitHandler}>
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="comment-form-group">
                        <input
                          type="text"
                          placeholder="Author"
                          name="username"
                        />
                        <i className="fas fa-user" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="comment-form-group">
                        <input type="email" placeholder="Email" name="email" />
                        <i className="fas fa-envelope" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="comment-form-group">
                        <input
                          type="text"
                          placeholder="Website"
                          name="Website"
                        />
                        <i className="fas fa-globe-asia" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="comment-form-text">
                        <textarea
                          placeholder="Write your comments here"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="blog-comment-submit">
                        <button className="form-button" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
};

export default BlogSingle;
