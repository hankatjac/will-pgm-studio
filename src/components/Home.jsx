import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CookieConsent from "react-cookie-consent";
import blog from "../assets/img/svg/blog-svgrepo-com.svg";
import hour from "../assets/img/svg/calculator-svgrepo-com.svg";
import event from "../assets/img/svg/calendar-svgrepo-com.svg";
import contact from "../assets/img/svg/email-mail-svgrepo-com.svg";
import todo from "../assets/img/svg/gui-todo-list-svgrepo-com.svg";
import weather from "../assets/img/svg/weather-color-moon-cloud-light-svgrepo-com.svg";
import recipe from "../assets/img/svg/recipe-svgrepo-com.svg";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="masthead">
        <div className="container">
          <div className="row">
            <div className="col-md-6 intro-text">
              <div className="intro-heading text-uppercase">
                {t("programming education for kids")}
              </div>
              <div className="intro-lead-in lh-base">
                {t(
                  "Offering unique, fun, activities and learning. Discover kids' programs with everything from home activities to classes."
                )}
              </div>
              <Link
                to="/event"
                className="btn btn-danger btn-xl text-uppercase js-scroll-trigger"
              >
                {t("Learn More")}
              </Link>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/posts">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={blog}
                      alt="supermicro"
                    />
                  </Link>
                </div>
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/event">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={event}
                      alt="hammond"
                    />
                  </Link>
                </div>
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/working-hours">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={hour}
                      alt="intel"
                    />
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/todo">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={todo}
                      alt="microsoft"
                    />
                  </Link>
                </div>
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/recipe">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={recipe}
                      alt="microsoft"
                    />
                  </Link>
                </div>
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/weather">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={weather}
                      alt="microsoft"
                    />
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-6 col-lg-4 p-5">
                  <Link to="/contact">
                    <img
                      className="img-fluid d-block mx-auto"
                      src={contact}
                      alt="microsoft"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="widget-boxes">
        <div className="box">
          <div className="box-info about">
            <Link to="/about">
              <h2>About the studio</h2>
              <p>
                Enim ad minim veniam nostrud exercitation ullamco laboris nisi
                ut aliquip commodo consequat duis aute irure dolor.
              </p>
            </Link>
          </div>
        </div>
        <div className="box">
          <div className="box-info experience">
          <Link to="/posts">
            <h2>Our experience</h2>
            <p>
              Perspiciatis unde omnis iste natus voluptatem accusantium
              doloremque laudantium totam aperiam eaque dolor lorem.
            </p>
            </Link>
          </div>
        </div>
        <div className="box">
          <div className="box-info fun">
          <Link to="/event">
            <h2>Big fun for kids!</h2>
            <p>
              Accusamus et iusto dignissimos ducimus blanditiis praesentium
              voluptatum deleniti corrupti quos dolores et quas molestias.
            </p>
            </Link>
          </div>
        </div>
      </section> */}
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </>
  );
};

export default Home;
