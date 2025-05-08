import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/appContext";
import Spinner from 'react-bootstrap/Spinner';
import avatar from "../assets/img/logos/avatar_2x.png";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useContext(AppContext);

  const submitForm = async (data) => {
    console.log(data);
    setLoading(true);
    setMessage("");

    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setMessage(err.response.data);
    }

    // console.log(data);
    // console.log(JSON.stringify(data, null, 2));
    // reset();
  };

  return (
    <section id="login" className="container col col-md-5 py-5">
      <div className="text-center">
        <h1 className="fw-bolder text-capitalize">{t("login")}</h1>
        <img src={avatar} alt="profile-img" className="profile-img-card" />
      </div>

      <form
        onSubmit={handleSubmit(submitForm)}
        id="loginForm"
        name="sentMessage"
      >
        <div className="form-group">
          <label>{t("username")}</label>
          <input
            className="form-control"
            name="username"
            type="text"
            {...register("username", { required: true, maxLength: 10 })}
          />
          {errors.username && (
            <p className="help-block text-danger">
              {t("Please enter your name.")}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>{t("password")}</label>
          <input
            name="password"
            type="password"
            {...register("password", { required: true })}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && (
            <p className="help-block text-danger">Please enter your password</p>
          )}
        </div>

        <div className="clearfix"></div>
        <div className="col-lg-12 text-center">
          <div id="success">{message}</div>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button
              id="sendMessageButton"
              className="btn btn-primary btn-xl"
              type="submit"
            >
              {t("login")}{" "}
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default Login;
