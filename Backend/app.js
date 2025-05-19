import express from 'express';
import employeesRoutes from './routes/employeesRoutes.js';

const app = express();

app.use(express.json());

// Montar las rutas con el prefijo '/employees'
app.use('/employees', employeesRoutes);

export default app;
