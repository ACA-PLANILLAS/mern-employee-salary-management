import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { ButtonOne, ButtonTwo } from "../../../../components";

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

const ModalEditParametro = ({ open, onClose, data, onSave }) => {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({
    id: "",
    name: "",
    value: "",
    value_type: "INT",
    type: "",
  });

  // Cuando cambia `data`, inicializamos también `type`
  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        name: data.name,
        value: data.value,
        value_type: data.value_type,
        type: data.type, // HWEK, DWEK o PMON
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si estamos ajustando `value`...
    if (name === "value") {
      if (form.value_type === "STRING") {
        return setForm((p) => ({ ...p, value }));
      }
      if (form.value_type === "INT") {
        const intVal = parseInt(value, 10);
        return setForm((p) => ({ ...p, value: isNaN(intVal) ? "" : intVal }));
      }
      if (form.value_type === "DOUBLE") {
        const floatVal = parseFloat(value);
        return setForm((p) => ({ ...p, value: isNaN(floatVal) ? "" : floatVal }));
      }
    }

    // Cambios a cualquier otro campo
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    // 1) Validación básica de tipo de dato
    if (form.value_type === "INT") {
      if (!Number.isInteger(form.value)) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.valueMustBeInteger"),
          "error"
        );
      }
      if (form.value < MIN_INT || form.value > MAX_INT) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.integerRange", { min: MIN_INT, max: MAX_INT }),
          "error"
        );
      }
    }
    if (form.value_type === "DOUBLE") {
      if (typeof form.value !== "number" || isNaN(form.value)) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.valueMustBeNumber"),
          "error"
        );
      }
    }

    // 2) Validaciones específicas por `type`
    if (form.type === "HWEK") {
      // horas en una semana: 0–168
      if (form.value < 0 || form.value > 168) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.weeklyHoursRange"),
          "error"
        );
      }
    }
    if (form.type === "DWEK") {
      // días en una semana: 0–7
      if (form.value < 0 || form.value > 7) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.weeklyDaysRange"),
          "error"
        );
      }
    }
    if (form.type === "PMON") {
      // pagos al mes permitidos: 4, 2 o 1
      if (![4, 2, 1].includes(form.value)) {
        return Swal.fire(
          t("parameter.error"),
          t("parameter.invalidPaymentScheme"),
          "error"
        );
      }
    }

    // Si todo pasa, enviamos
    onSave(form);
  };

  if (!open) return null;

  // Determinar atributos de min/max para input numérico
  const isNumeric = form.value_type !== "STRING" && form.type !== "PMON";
  const min = isNumeric ? 0 : undefined;
  const max =
    form.type === "HWEK"
      ? 168
      : form.type === "DWEK"
      ? 7
      : form.value_type === "INT"
      ? MAX_INT
      : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-boxdark rounded-2xl shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center text-lg font-bold text-black dark:text-white py-4">
          {t("parameter.editParameter")}
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label className="mb-1 block text-black dark:text-white">
                {t("parameter.name")}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="mb-1 block text-black dark:text-white">
                {form.type === "PMON"
                  ? t("parameter.paymentFrequency")
                  : t("parameter.value")}
              </label>

              {/* SELECT para pagos al mes (PMON) */}
              {form.type === "PMON" ? (
                <select
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    {t("parameter.selectPlaceholder")}
                  </option>
                  <option value={4}>{t("parameter.weekly4Payments")}</option>
                  <option value={2}>{t("parameter.biweekly2Payments")}</option>
                  <option value={1}>{t("parameter.monthly1Payment")}</option>
                </select>
              ) : (
                <input
                  type={form.value_type === "STRING" ? "text" : "number"}
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  min={min}
                  max={max}
                  step={form.value_type === "INT" ? "1" : "any"}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <ButtonTwo onClick={onClose} className="w-full">
              {t("parameter.cancel")}
            </ButtonTwo>
            <ButtonOne onClick={handleSave} className="w-full">
              {t("parameter.save")}
            </ButtonOne>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditParametro;
