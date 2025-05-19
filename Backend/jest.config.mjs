export default {
  transform: {
    "^.+\\.m?[tj]sx?$": ["babel-jest", { presets: ["@babel/preset-env"] }]
  }
};
