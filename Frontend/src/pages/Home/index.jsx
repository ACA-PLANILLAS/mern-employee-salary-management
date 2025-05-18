import React, { useEffect } from "react";
import { Banner, Navbar } from "../../components";
import About from "../About";
import Contact from "../Contact";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../config/redux/action";
import { API_URL } from "@/config/env";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${API_URL}/me`)
      .then((res) => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("no hay sesión activa");
      });
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
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
