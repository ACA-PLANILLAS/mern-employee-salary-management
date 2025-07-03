import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';

import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';

import "./models/index.js"
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import ParamRoute from './routes/ParamRoute.js';


dotenv.config();
const app = express();

// Confía en la cabecera X-Forwarded-Proto que añade Cloud Run
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://mern-frontend-283773467884.europe-west1.run.app'
]

const sessionStore = SequelizeStore(session.Store);

// 1️⃣ Configuración de CORS
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Permitir todas las opciones de CORS para evitar problemas con preflight requests
app.options('*', cors());

// 2️⃣ Sesiones con sameSite y secure según entorno
const store = new (SequelizeStore(session.Store))({
    db,
    tableName: 'sessions'
});

console.log('Entorno:', process.env.NODE_ENV);
console.log({ isproduction: process.env.NODE_ENV === 'production' })

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,  // no crear sesión hasta definir userId
    store,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);
app.use(ParamRoute);

const main = async () => {
    try {
        await db.authenticate();
        console.log('✅ Conectado a la base de datos');
        await db.sync();
        await store.sync();
        console.log('✅ Tablas sincronizadas');
        app.listen(process.env.PORT || 8080, () => {
            console.log('🚀 Server up and running on port', process.env.PORT);
        });
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    }
}

main();