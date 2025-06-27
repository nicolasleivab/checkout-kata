/** @type {import('jest').Config} */
export default {
  testEnvironment: "jest-environment-jsdom",

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          target: "es2022",
          transform: { react: { runtime: "automatic" } },
        },
        module: { type: "es6" },
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testMatch: ["<rootDir>/frontend/**/__tests__/**/*.spec.ts?(x)"],
  moduleNameMapper: {
    "\\.(css|module\\.css)$": "identity-obj-proxy",
  },
};
