import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ModalViewParametro = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="relative">
        {/* Botón de cerrar */}
        <IconButton
          onClick={onClose}
          className="!absolute right-2 top-2 z-10"
          size="small"
        >
          <CloseRoundedIcon className="text-gray-500 hover:text-black" />
        </IconButton>

        <DialogTitle>
          <div className="text-center text-lg font-bold text-black">
            Ver Parámetro
          </div>
        </DialogTitle>
      </div>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Nombre" value={data.name} fullWidth disabled />
          <TextField label="Valor" value={data.value} fullWidth disabled />
          <TextField
            label="Horas por Día"
            value={data.daily_hours}
            fullWidth
            disabled
          />
          <TextField
            label="Tipo de Pago"
            value={data.payment_type}
            fullWidth
            disabled
          />
        </Box>
      </DialogContent>

      <DialogActions className="justify-end">
        <div className="px-4 pb-2 pt-1">
          <Button onClick={onClose} variant="contained">
            Cerrar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewParametro;
