
<div align="center">

> ~
> <h1 align="center">📌 Todo el codigo esta en la rama llamada "develop📌 </h1>
> <h3 align="center">Crear ramas "feat/< funcionalidad >" a partir de develop </h3>
> <h3 align="center">No subir nada a "main" que se nos complica</h3>
> ~
</div>



# Prerrequisitos

- Tener instalado **MySQL**.

# Pasos para configurar la base de datos

- Ingresar a la instancia de MySQL
- Ejecutar el script de la base de datos
    - Crear la base de datos: `CREATE DATABASE IF NOT EXISTS db_penggajian3;`
   - Seleccionar la base de datos en la misma instancia del sql: `USE db_penggajian3;`
   - CopiaR y pegar en consola el script del archivo en `/Backend/db/db_penggajian3.sql`
- Insertar dos usuarios en la base de datos:

### Primer usuario ADMINISTRADOR

```
INSERT INTO data_pegawai (
  id_pegawai,
  nik,
  nama_pegawai,
  username,
  password,
  jenis_kelamin,
  jabatan,
  tanggal_masuk,
  status,
  photo,
  url,
  hak_akses,
  createdAt,
  updatedAt
) VALUES (
  'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh12',  -- id_pegawai (UUID)
  '334455',                               -- NIK
  'Administrator',                         -- Nombre
  'user',                               -- Username
  '$argon2i$v=19$m=16,t=2,p=1$S2xtQ0xkOU16ckt5enZvWFNtcTI5cEZtSDdHb0ZrXzM$sQch0yEbQ0L5/oY7+hzwHQ',   -- Password (hash Argon2id)
  'Laki-Laki',                            -- Género
  'Operator Produksi',                    -- Jabatan
  '01-07-23',                             -- Fecha de ingreso
  'karyawan tetap',                       -- Estado
  'carlos.jpg',                           -- Nombre de archivo foto
  'http://localhost:5000/images/carlos.jpg', -- URL foto
  'admin',                              -- Rol/hak_akses
  NOW(),                                  -- createdAt
  NOW()                                   -- updatedAt
);
```

### Segundo usuario EMPLEADO

```
INSERT INTO data_pegawai (
  id_pegawai,
  nik,
  nama_pegawai,
  username,
  password,
  jenis_kelamin,
  jabatan,
  tanggal_masuk,
  status,
  photo,
  url,
  hak_akses,
  createdAt,
  updatedAt
) VALUES (
  'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh88',  -- id_pegawai (UUID)
  '334455',                               -- NIK
  'Carlos López',                         -- Nombre
  'julian',                               -- Username
  '$argon2i$v=19$m=16,t=2,p=1$S2xtQ0xkOU16ckt5enZvWFNtcTI5cEZtSDdHb0ZrXzM$sQch0yEbQ0L5/oY7+hzwHQ',   -- Password (hash Argon2id)
  'Laki-Laki',                            -- Género
  'Operator Produksi',                    -- Jabatan
  '01-07-23',                             -- Fecha de ingreso
  'karyawan tetap',                       -- Estado
  'carlos.jpg',                           -- Nombre de archivo foto
  'http://localhost:5000/images/carlos.jpg', -- URL foto
  'pegawai',                              -- Rol/hak_akses
  NOW(),                                  -- createdAt
  NOW()                                   -- updatedAt
);
```

# Credenciales para login

Con los usuarios creados ya pueden acceder al frontend, correrlo y en login poner:

| Usuario | Contraseña | Rol           |
| ------- | ---------- | ------------- |
| user    | pass       | ADMINISTRADOR |
| julian  | pass       | EMPLEADO      |

# Configurar proyecto Backend

- Crear un archivo `.env` dentro de la carpeta `/Backend`
- copiar, pegar y AJUSTAR las configuración dependiendo de como configuraron la datos de MySQL:
  - Los que probablemente deban tocar sean DB_PASSWORD, DB_USER y talvez DB_PORT, DB_HOST

```
# Puerto donde correrá Express
APP_PORT=5000

# Semilla para las sesiones
SESS_SECRET=OUMENTHATSCRAZY

# Credenciales de tu base de datos MySQL
DB_HOST=127.0.0.1
DB_PORT=33060
DB_USER=root
DB_PASSWORD=secret
DB_NAME=db_penggajian3
DB_DIALECT=mysql
```


- Correr proyecto
  - Ingresar a la carpeta: `cd ./Backend`
  - Instalar dependencias: `npm install`
  - Correr proyecto: `npm run start`


# Configurar proyecto Frontend

- Crear un archivo `.env` dentro de la carpeta `/Frontend`
- copiar, pegar y AJUSTAR las configuración 

```
VITE_API_URL=http://localhost:5000
```


# OJO   del http://localhost:5000 debe terminar en el mismo puerto que la base de datos en APP_PORT=5000

## Si colocaron APP_PORT=3000, el frontend debe tener: VITE_API_URL=http://localhost:3000

- Correr proyecto
  - Ingresar a la carpeta: `cd ./Frontend`
  - Instalar dependencias: `npm install`
  - Correr proyecto: `npm run dev`