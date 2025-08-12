const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    pageLoadTimeout: 20000,
    responseTimeout: 20000,
    retries: 2,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
