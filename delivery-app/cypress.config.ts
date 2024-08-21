import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL for your application
    baseUrl: 'http://localhost:4200',

    // Specify the location of your spec files
    specPattern: 'cypress/integration/**/*.spec.ts',

    // Support file (commands, setup)
    supportFile: 'cypress/support/e2e.ts',

    // Include additional options
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
