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

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db,
    tableName: "sessions"
});


dotenv.config();

// Middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
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
        app.listen(process.env.APP_PORT, () => {
            console.log('🚀 Server up and running on port', process.env.APP_PORT);
        });
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    }
}

main();