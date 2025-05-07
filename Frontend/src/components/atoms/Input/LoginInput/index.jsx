import React, { useState, useEffect } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../config/redux/action";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../hooks/useErrorMessage";

function LoginInput() {
  const { t } = useTranslation("login");
  const getErrorMessage = useErrorMessage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
  }, [user, isSuccess, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: t("swal.errorTitle"),
        text: getErrorMessage(message),
      }).then(() => {});
    } else if (isSuccess && user) {
      Swal.fire({
        icon: "success",
        title: t("swal.successTitle"),
        text: getErrorMessage(message),
        timer: 1500,
      }).then(() => {});
    }
  }, [isError, isSuccess, user, message, dispatch]);

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("input.usernameLabel")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
            placeholder={t("input.usernamePlaceholder")}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <FiUser className="absolute right-4 top-4 text-xl" />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("input.passwordLabel")}
        </label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("input.passwordPlaceholder")}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <FiLock className="absolute right-4 top-4 text-xl" />
        </div>
      </div>

      <div className="mb-5">
        <input
          type="submit"
          value={isLoading ? t("input.loading") : t("input.loginButton")}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
        />
      </div>
    </form>
  );
}

export default LoginInput;
