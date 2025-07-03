import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../layout";
import Swal from "sweetalert2";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { TfiLock } from "react-icons/tfi";
import { changePassword, getMe } from "../../../../config/redux/action";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../hooks/useErrorMessage";

const UbahPasswordAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("ubahPasswordAdmin");

  const getErrorMessage = useErrorMessage();

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const { isError, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confPassword) {
      dispatch(changePassword(password, confPassword))
        .then((response) => {
          console.log("response", response);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: t("alert.success.title"),
              text: t("alert.success.text"),
              showConfirmButton: false,
              timer: 1500,
            });

            setPassword("");
            setConfPassword("");
          } else {
            Swal.fire({
              icon: "error",
              title: t("alert.error.title"),
              text: getErrorMessage(response?.msg),
            }).then(() => {});
          }
        })
        .catch((error) => {
          const status = error.response?.data?.msg || "desconocido";
          Swal.fire({
            icon: "error",
            title: t("alert.error.title"),
            text: getErrorMessage(status) || t("alert.error.text.general"),
            confirmButtonText: t("alert.button.ok"),
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: t("alert.error.title"),
        text: t("alert.error.text.mismatch"),
        confirmButtonText: t("alert.button.ok"),
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.hak_akses !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName={t("breadcrumb.pageName")} />

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {t("form.title")}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 ">
                  <div className="mb-4 w-full">
                    <label className="mb-4 block text-black dark:text-white">
                      {t("form.label.newPassword")}{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t("form.placeholder.newPassword")}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label className="mb-4 block text-black dark:text-white">
                      {t("form.label.repeatPassword")}{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder={t("form.placeholder.repeatPassword")}
                      value={confPassword}
                      required
                      onChange={(e) => setConfPassword(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <TfiLock className="absolute right-4 top-4 text-xl" />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 text-center md:flex-row">
                  <ButtonOne type="submit">
                    <span>{t("form.button.updatePassword")}</span>
                  </ButtonOne>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UbahPasswordAdmin;
