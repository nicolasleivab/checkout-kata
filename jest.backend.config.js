/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/backend/**/__tests__/**/*.spec.ts?(x)"],
  setupFiles: ["<rootDir>/jest.backend.setup.js"],
};
