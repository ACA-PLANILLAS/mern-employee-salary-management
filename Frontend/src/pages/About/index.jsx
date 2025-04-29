import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./About.css";
import aboutImg from '../../assets/images/aboutSipeka.svg'
import '../../shared/Shared.css'
import { BottomLine } from "../../components/atoms";
import { Footer, Navbar } from "../../components";

import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation('home');

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>
            <Navbar />
            <div className="dark:bg-boxdark">
                <div className="parent pt-16 my-16">
                    <div>
                        <motion.div
                            className="mb-10"
                            initial={{ y: -200, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { duration: 1, type: "spring" },
                            }}
                        >
                            <h3 className="text-neutral text-center dark:text-white">{t('about.heading')}</h3>
                            <h1 className="text-4xl font-semibold drop-shadow-md text-center text-accent dark:text-white">
                                {t('about.titleLine1')} <span className="text-primary">{t('about.titleLine2')}</span>
                            </h1>
                            <BottomLine />
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            <motion.div
                                initial={{ x: -200, opacity: 0 }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { duration: 1, delay: 1.25 },
                                }}
                            >
                                <img
                                    src={aboutImg}
                                    alt="About SiPeKa"
                                    className="w-100 h-100 transform translate-y-[-12%]"
                                    title="About SiPeKa"
                                />

                            </motion.div>
                            <motion.div
                                initial={{ x: 200, opacity: 0 }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { duration: 1, delay: 1.25 },
                                }}
                            >
                                <p className="font-medium text-center translate-y-[-60%] sm:translate-y-[-0%] sm:mb-2 md:text-left dark:text-white">
                                    {t('about.text1')}
                                </p>
                                <br />
                                <p className="font-medium text-center translate-y-[-50%] sm:translate-y-[-0%] sm:mb-2 md:text-left dark:text-white">
                                    {t('about.text2')}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
                {!isHomePage && <Footer />}
            </div>
        </>
    );
};

export default About;
