import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const useSocket = !!process.env.DB_SOCKET;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        logging: false,
        ...(useSocket 
            ? {
                dialectOptions: { socketPath: process.env.DB_SOCKET },
            }
            : {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '3306', 10),
            }),
    },
);

console.log('Database connected... ');
export default db;