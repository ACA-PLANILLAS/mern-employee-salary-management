import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ModalEditParametro = ({ open, onClose, data }) => {
  const [form, setForm] = useState({ ...data });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Guardado:", form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="relative">
        <IconButton
          onClick={onClose}
          className="!absolute right-2 top-2 z-10"
          size="small"
        >
          <CloseRoundedIcon className="text-gray-500 hover:text-black" />
        </IconButton>

        <DialogTitle>
          <div className="text-center text-lg font-bold text-black">
            Editar Parámetros
          </div>
        </DialogTitle>
      </div>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Valor"
            name="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions disableSpacing>
        <div className="w-full px-4 pb-2 pt-1 flex flex-row gap-6">
          <Button onClick={onClose} fullWidth variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSave} fullWidth variant="contained">
            Guardar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditParametro;
