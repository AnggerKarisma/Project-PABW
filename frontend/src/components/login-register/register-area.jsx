import React from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import bgLogin from "@assets/img/login/bgLogin4.jpg";
import RegisterForm from "../forms/register-form";
import GoogleSignUp from "./google-sign-up";


const RegisterArea = () => {
  return (
    <>
        <section
      className="tp-login-area pb-90 p-relative z-index-1 fix" 
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Background Image */}
      <div className="tp-login-shape-wrapper" style={{ position: "absolute", width: "100%", height: "100%" }}>
  <Image
    src={bgLogin}
    alt="bgLogin"
    fill
    style={{
      zIndex: -1,
      objectFit: "cover",
    }}
  />
</div>
      
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Sign Up Mahakam Store</h3>
                  <p>
                    Sudah punya akun?{" "}
                    <span>
                      <Link href="/login">Sign In</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <div className="tp-login-social mb-10 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="tp-login-option-item has-google">
                      <GoogleSignUp/>
                    </div>
                  </div>
                  <div className="tp-login-mail text-center mb-40">
                    <p>
                      atau Sign up dengan <a href="#">Email</a>
                    </p>
                  </div>
                  {/* form start */}
                  <RegisterForm />
                  {/* form end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterArea;
