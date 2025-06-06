import React from "react";
import LogoSipeka from "../../assets/images/logo/logo-sipeka.png";
import LoginImg from "../../assets/images/LoginImg/login.svg";
import { Footer, LoginInput, Navbar } from "../../components";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation('login');

  return (
    <div className="min-h-screen rounded-sm border border-stroke pt-10 shadow-default dark:border-strokedark dark:bg-boxdark">
      <Navbar />
      <div className="flex min-h-screen flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-18.5 text-center ">
            <span className="mb-5.5 inline-block ">
              <img
                className="w-80"
                src={LogoSipeka}
                alt={t('logoAlt')}
                title={t('logoAlt')}
              />
            </span>
            <p className="text-black dark:text-white 2xl:px-20">
            {t('titleLine1')}
              <br /> {t('titleLine2')}
            </p>
            <img className="mt-15 inline-block" src={LoginImg} alt={t('loginImageAlt')} />
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <LoginInput />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
