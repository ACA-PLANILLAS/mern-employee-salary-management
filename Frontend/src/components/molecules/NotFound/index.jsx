import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ButtonThree } from "../../atoms";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation("notFound");

    return (
        <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center">
            <h1 className="text-[8rem] font-bold text-primary">404</h1>
            <div className="w-24 h-1 md:w-1 md:h-24 bg-primary my-6 md:my-0 md:mx-8"></div>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl text-center mb-4">
                    {t('sorryMessage')}
                </h2>
                <Link to="/">
                    <ButtonThree>
                        <span>{t('backToHome')}</span>
                        <span>
                            <FaHome />
                        </span>
                    </ButtonThree>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
