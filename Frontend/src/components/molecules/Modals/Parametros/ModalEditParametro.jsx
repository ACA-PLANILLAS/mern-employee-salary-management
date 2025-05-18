import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { ButtonOne, ButtonTwo } from "../../../../components";

const ModalEditParametro = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState({ id: "", name: "", value: 0 });

  useEffect(() => {
    if (data) setForm({ id: data.id, name: data.name, value: data.value });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "value" ? Number(value) : value }));
  };

  const handleSave = () => onSave(form);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-boxdark rounded-2xl shadow-lg w-full max-w-md">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <FaTimes size={20} />
        </button>

        <div className="text-center text-lg font-bold text-black dark:text-white py-4">
          Editar Parámetro
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-black dark:text-white">Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-black dark:text-white">Valor</label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <ButtonTwo onClick={onClose} className="w-full">Cancelar</ButtonTwo>
            <ButtonOne onClick={handleSave} className="w-full">Guardar</ButtonOne>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditParametro;
