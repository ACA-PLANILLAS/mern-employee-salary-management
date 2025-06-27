   // Backend/config/swagger.js
   import swaggerJSDoc from 'swagger-jsdoc';
   import { fileURLToPath } from 'url';
   import { dirname, join } from 'path';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   const options = {
     definition: {
       openapi: '3.0.0',
       info: {
         title: 'API de Gestión de Empleados',
         version: '1.0.0',
         description: 'Documentación de la API con Swagger',
       },
       servers: [
         {
           url: 'http://localhost:5000',
           description: 'Servidor de desarrollo',
         },
       ],
       components: {
         securitySchemes: {
           sessionAuth: {
             type: 'apiKey',
             in: 'cookie',
             name: 'connect.sid',
             description: 'Autenticación por sesión'
           }
         }
       }
     },
     apis: [join(__dirname, '../routes/*.js'), join(__dirname, '../models/*.js')],
   };

   const swaggerSpec = swaggerJSDoc(options);

   export default swaggerSpec;