import React, { useState } from "react";
import useSettings from "../../hooks/useSettings";

const ContactForm = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    lastname: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Please enter your name";
    if (!formData.lastname) tempErrors.lastname = "Please enter your lastname";
    if (!formData.email) tempErrors.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    if (!formData.subject) tempErrors.subject = "Please enter your subject";
    if (!formData.message) tempErrors.message = "Please enter your message";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (validate()) {
      const recipientEmail = settings?.email || "info@alhady-eg.com";
      const mailtoSubject = encodeURIComponent(formData.subject);
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name} ${formData.lastname}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}`
      );

      window.location.href = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Optionally clear the form
      setFormData({
        name: "",
        email: "",
        subject: "",
        lastname: "",
        message: "",
      });
    }
  };

  return (
    <form onSubmit={submitHandler} className="form">
      <div className="row">
        <div className="col-lg-6 col-sm-6">
          <div className="form-field">
            <input
              value={formData.name}
              onChange={changeHandler}
              type="text"
              name="name"
              placeholder="Name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-field">
            <input
              value={formData.lastname}
              onChange={changeHandler}
              type="text"
              name="lastname"
              placeholder="Lastname"
            />
            {errors.lastname && <p className="error-text">{errors.lastname}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-field">
            <input
              onChange={changeHandler}
              value={formData.email}
              type="email"
              name="email"
              placeholder="Email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-field">
            <input
              onChange={changeHandler}
              value={formData.subject}
              type="text"
              name="subject"
              placeholder="Subject"
            />
            {errors.subject && <p className="error-text">{errors.subject}</p>}
          </div>
        </div>
        <div className="col-lg-12 col-sm-12">
          <div className="form-field">
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={changeHandler}
            ></textarea>
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>
        </div>
        <div className="col-lg-12">
          <div className="contact-form-action">
            <button className="form-button btn-fill" type="submit">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
