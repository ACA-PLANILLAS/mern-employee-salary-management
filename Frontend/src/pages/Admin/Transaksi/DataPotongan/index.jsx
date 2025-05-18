import { useState, useEffect } from "react";
import Layout from "../../../../layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import {
  deleteDataPotongan,
  getDataPotongan,
  getMe,
} from "../../../../config/redux/action";
import { useTranslation } from "react-i18next";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";

const DataPotongan = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { t } = useTranslation("dataPotongan");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isError, user } = useSelector((state) => state.auth);
  const { dataPotongan } = useSelector((state) => state.dataPotongan);

  const { toLocal, symbol, currency } = useCurrencyByUser();

  useEffect(() => {
    dispatch(getMe());
    dispatch(getDataPotongan());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const handleSearch = (e) => setSearchKeyword(e.target.value);

  const onDelete = (id) => {
    Swal.fire({
      title: t("confirmation"),
      text: t("deleteConfirmation"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("noText"),
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(deleteDataPotongan(id)).then(() => {
          Swal.fire({
            title: t("success"),
            text: t("deleteSuccess"),
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          dispatch(getDataPotongan());
        });
      }
    });
  };

  // filtro por búsqueda
  const filtered = dataPotongan.filter((d) =>
    d.potongan.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // separar estáticos y dinámicos
  const staticItems = filtered.filter((d) => d.type === "STA");
  const dynamicItems = filtered.filter((d) => d.type === "DIN");

  // agrupar dinámicos por deduction_group
  const grouped = dynamicItems.reduce((acc, item) => {
    const key = item.deduction_group || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // obtener keys con Others al final
  const groupKeys = Object.keys(grouped).filter((k) => k !== "Others");
  if (grouped["Others"]) groupKeys.push("Others");

  return (
    <Layout>
      <Breadcrumb pageName={t("title")} />

      <Link to="/data-potongan/form-data-potongan/add">
        <ButtonOne>
          <span>{t("addDeduction")}</span>
          <FaPlus />
        </ButtonOne>
      </Link>

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4 flex flex-col md:flex-row md:justify-between">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchKeyword}
              onChange={handleSearch}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xl">
              <BiSearch />
            </span>
          </div>
        </div>

        {/* Tabla de estáticos */}
        <h2 className="mb-2 text-lg font-medium">{t("staticDeductions")}</h2>
        <div className="mb-6 overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium">{t("no")}</th>
                <th className="px-4 py-4 font-medium">{t("deduction")}</th>
                <th className="px-4 py-4 font-medium">{t("amount")}</th>
                <th className="px-4 py-4 font-medium">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {staticItems.map((d, i) => (
                <tr key={d.id}>
                  <td className="border-b px-4 py-5">{i + 1}</td>
                  <td className="border-b px-4 py-5">{d.potongan}</td>
                  <td className="border-b px-4 py-5">
                    {(d.jml_potongan * 100).toFixed(2)}%
                  </td>
                  <td className="border-b px-4 py-5">
                    <div className="flex space-x-3.5">
                      <Link
                        to={`/data-potongan/form-data-potongan/edit/${d.id}`}
                      >
                        <FaRegEdit className="text-xl text-primary" />
                      </Link>
                      <button onClick={() => onDelete(d.id)}>
                        <BsTrash3 className="text-xl text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablas de dinámicos agrupados y ordenados por from */}
        <h2 className="mb-2 text-lg font-medium">{t("dynamicDeductions")}</h2>
        {groupKeys.map((group) => {
          // ordenar ítems dentro del grupo
          const items = grouped[group].sort(
            (a, b) => parseFloat(a.from) - parseFloat(b.from)
          );
          return (
            <div key={group} className="mb-6">
              <h3 className="text-md mb-1 font-medium">
                {group === "Others" ? t("others") : group}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="px-4 py-4 font-medium">{t("no")}</th>
                      <th className="px-4 py-4 font-medium">
                        {t("deduction")}
                      </th>
                      <th className="px-4 py-4 font-medium">{t("range")}</th>
                      <th className="px-4 py-4 font-medium">
                        {t("percentageExcess")}
                      </th>
                      <th className="px-4 py-4 font-medium">{t("fixedFee")}</th>
                      <th className="px-4 py-4 font-medium">{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d, i) => (
                      <tr key={d.id}>
                        <td className="border-b px-4 py-5">{i + 1}</td>
                        <td className="border-b px-4 py-5">{d.potongan}</td>
                        <td className="border-b px-4 py-5">
                          {symbol}
                          {toLocal(d.from)} – {" "}
                          {d.until ==+ -1 ? t("fromNowOn") :  symbol + toLocal(d.until)}
                        </td>
                        <td className="border-b px-4 py-5">
                          {(d.jml_potongan * 100).toFixed(2)}%
                        </td>
                        <td className="border-b px-4 py-5">
                          {symbol}
                          {toLocal(d.value_d)}
                        </td>
                        <td className="border-b px-4 py-5">
                          <div className="flex space-x-3.5">
                            <Link
                              to={`/data-potongan/form-data-potongan/edit/${d.id}`}
                            >
                              <FaRegEdit className="text-xl text-primary" />
                            </Link>
                            <button onClick={() => onDelete(d.id)}>
                              <BsTrash3 className="text-xl text-danger" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default DataPotongan;
