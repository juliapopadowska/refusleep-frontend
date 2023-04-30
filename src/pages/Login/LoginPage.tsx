import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import { UserContext } from "../../context/AuthContext";
import "./LoginPage.scss";

function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", { email, password });
      if (response.data) {
        setUser({
          name: response.data.name,
          email: response.data.email,
        });
      }
      setLoading(false);
      navigate("/");
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      <Header />
      <Form className="Form-container" onSubmit={handleLogin}>
        <h1>{t("Login")}</h1>
        {error && <div className="Form-loginError">{t("LoginError")}</div>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{t("Email")}</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder={`${t("EmailPlaceholder")}`}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>{t("Password")}</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={`${t("PasswordPlaceholder")}`}
          />
        </Form.Group>
        <div className="Register-link">
          {t("DontHaveAccount")}
          <Link className="Link" to="/register">
            {t("Register")}
          </Link>
        </div>
        {loading ? (
          <Spinner className="Spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Button className="Submit-button" type="submit">
            {t("Buttons.Submit")}
          </Button>
        )}
      </Form>
    </div>
  );
}

export default LoginPage;
