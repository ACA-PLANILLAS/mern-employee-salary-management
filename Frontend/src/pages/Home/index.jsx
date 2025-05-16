import React, { useEffect } from "react";
import { Banner, Navbar } from "../../components";
import About from "../About";
import Contact from "../Contact";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../config/redux/action";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    return (
        <>
            <div className="dark:bg-boxdark">
                <Navbar />
                <Banner />
                <About />
                <Contact />
            </div>
        </>
    );
};

export default Home;
