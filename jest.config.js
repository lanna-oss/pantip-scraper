module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|ts|js)",
    "**/?(*.)+(spec|test).+(ts|ts|js)"
  ],
  transform: {
    "^.+\\.(ts)$": "ts-jest"
  }
};
