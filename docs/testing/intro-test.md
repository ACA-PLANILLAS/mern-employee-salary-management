# Testing y QA

El proceso de QA y Testing asegura que el sistema sea funcional, fiable y libre de errores. Se han implementado pruebas unitarias, de integración y de extremo a extremo para verificar cada parte del proyecto, tanto en frontend como en backend. Además, se utiliza Integración Continua (CI/CD) para automatizar las pruebas y asegurar que los cambios no afecten el rendimiento del sistema. Este enfoque integral garantiza que el software cumpla con los estándares de calidad en cada etapa del desarrollo.

| Prueba                        | Herramientas     | Implementación                                                                                       |
|-------------------------------|------------------|-----------------------------------------------------------------------------------------------------|
| Pruebas Unitarias              | Jest             | Se implementarán pruebas unitarias con Jest para verificar el comportamiento correcto de funciones clave. Estas pruebas se ejecutan automáticamente cada vez que se hace un commit, asegurando que los cambios no introduzcan errores. |
| Pruebas de Integración         | Postman          | Se verifica la interacción entre los diferentes componentes (API, base de datos, frontend). Postman ayuda a simular peticiones HTTP y evaluar las respuestas esperadas en tiempo real. |
| Integración Continua (CI/CD)   | GitHub Actions   | Configuración de un pipeline básico de GitHub Actions para ejecutar automáticamente las pruebas automatizadas en cada push a la rama principal. Esto garantiza que los errores se detecten en etapas tempranas del desarrollo. |

Para consultar la guía completa sobre como implementar los tests, dirigase al siguiente enlace:

[Implementación de Testing y QA](https://drive.google.com/drive/folders/1nZItduzjo1wn6ld5DxeTRyVUjG4T5mBx?usp=sharing)
