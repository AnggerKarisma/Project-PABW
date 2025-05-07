import React from "react";
import bg from '@assets/img/banner/pele.jpg';

const CommonBreadcrumb = ({
  title = "Default Title",
  subtitle = "Default Subtitle",
  center = true,
}) => {
  return (
    <section
      className="breadcrumb__area include-bg pt-150 pb-150 breadcrumb__overlay breadcrumb__style-3"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div
              className={`breadcrumb__content p-relative z-index-1 ${center ? "text-center" : ""}`}
            >
              <h3 className="breadcrumb__title">{title}</h3>
              <div className="breadcrumb__list">
                <span>
                  <a href="#">Beranda</a>
                </span>
                <span>{subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonBreadcrumb;
