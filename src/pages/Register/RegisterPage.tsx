import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import "./RegisterPage.scss";

function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleRegisterUser = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setLoading(false);
      navigate("/login");
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      <Header />
      <Form className="Form-container" onSubmit={handleRegisterUser}>
        <h1>Register</h1>
        {error && <div className="Form-loginError">Lorem ipsum</div>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        {loading ? (
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Button className="Submit-button" type="submit">
            Submit
          </Button>
        )}
      </Form>
    </div>
  );
}

export default RegisterPage;
