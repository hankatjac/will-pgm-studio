import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";


const Contact = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/willpgm`, data);
      const result = response.data;
      alert(result);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <div className="text-center mb-4">
            <h1 className="fw-bold">Get in Touch</h1>
            <p className="text-muted">We'd love to hear from you!</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Input */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name..."
                {...register("name", { required: "A name is required" })}
              />
              {errors.name && (
                <Alert variant="danger">{errors.name.message}</Alert>
              )}
            </Form.Group>

            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                {...register("email", { required: "An email is required" })}
              />
              {errors.email && (
                <Alert variant="danger">{errors.email.message}</Alert>
              )}
            </Form.Group>

            {/* Phone Number Input */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="(123) 456-7890"
                {...register("phone", {
                  required: "A phone number is required",
                })}
              />
              {errors.phone && (
                <Alert variant="danger">{errors.phone.message}</Alert>
              )}
            </Form.Group>

            {/* Message Input */}
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message here..."
                {...register("message", { required: "A message is required" })}
              />
              {errors.message && (
                <Alert variant="danger">{errors.message.message}</Alert>
              )}
            </Form.Group>

            {/* Submit Button */}
            <div className="d-grid">
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
