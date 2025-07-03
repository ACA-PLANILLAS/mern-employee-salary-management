// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {}, // Desactiva transformación automática (deja que Babel se encargue si es necesario)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Para importar rutas relativas sin errores
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'jest-junit.xml',
    }],
  ],
};
