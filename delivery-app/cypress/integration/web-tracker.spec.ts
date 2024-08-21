import { App } from '../locators/locators';

describe('Web Tracker Page', () => {
  const packageId = '2069b276-2680-4c85-b08c-a15ab8f22de8';
  const deliveryId = '06e1e5cf-ec16-476f-8191-d324d84ff95f';
  before(() => {
    cy.restoreData();
  });

  beforeEach(() => {
    cy.visit('/tracker');
  });

  it('should display the package form and allow user to input package ID', () => {
    cy.getByTestId(App.packageId).should('be.visible');
    cy.getByTestId(App.packageId).type(packageId);
    cy.getByTestId(App.submitButton).click();
  });

  it('should fetch and display package details', () => {
    cy.getByTestId(App.packageId).type(packageId);
    cy.intercept('GET', `/api/package/${packageId}`).as('fetchPackage');
    cy.getByTestId(App.submitButton).click();
    cy.wait('@fetchPackage');
    cy.getByTestId(App.packageDetails).should('be.visible');
    cy.getByTestId(App.packageDescription).should('contain', 'Description:');
    cy.getByTestId(App.packageFrom).should('contain', 'From:');
    cy.getByTestId(App.packageTo).should('contain', 'To:');
  });
  it('should establish a WebSocket connection and update the delivery location', () => {
    cy.getByTestId(App.packageId).type(packageId);
    cy.getByTestId(App.submitButton).click();
    cy.window().then((win) => {
      const ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: 'location_changed',
            delivery_id: deliveryId,
            location: { lat: 37.7749, lng: -122.4194 },
          })
        );
      };

      ws.onmessage = (event) => {
        ws.close();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    });

    cy.getByTestId(App.currentLocation).should(
      'contain.text',
      'Location: 37.7749, -122.4194'
    );
  });

  it('should handle invalid package IDs gracefully', () => {
    cy.getByTestId(App.packageId).type('invalid-id');
    cy.getByTestId(App.submitButton).click();
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Package not found');
  });
});
