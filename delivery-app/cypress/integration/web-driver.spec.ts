import { App } from '../locators/locators';

describe('Web Driver Component', () => {
  const deliveryId = '06e1e5cf-ec16-476f-8191-d324d84ff95f';
  const packageDescription = 'Package Description: Electronics';

  before(() => {
    cy.restoreData();
  });

  beforeEach(() => {
    cy.visit('/driver');
  });

  it('should load and display delivery details', () => {
    cy.getByTestId(App.deliveryIdInput).type(deliveryId);
    cy.getByTestId(App.submitButton).click();
    cy.getByTestId(App.deliveryDetails).should('be.visible');
    cy.getByTestId(App.packageDescription).should(
      'contain.text',
      packageDescription
    );
    cy.getByTestId(App.deliveryStatus).should('contain.text', 'Status: open');
  });

  it('should update delivery status to "picked-up"', () => {
    cy.getByTestId(App.deliveryIdInput).type(deliveryId);
    cy.getByTestId(App.submitButton).click();
    cy.getByTestId(App.pickUpButton).click();
    cy.getByTestId(App.deliveryStatus).should(
      'contain.text',
      'Status: picked-up'
    );
  });

  it('should update delivery status to "in-transit"', () => {
    cy.getByTestId(App.deliveryIdInput).type(deliveryId);
    cy.getByTestId(App.submitButton).click();
    cy.getByTestId(App.inTransitButton).click();
    cy.getByTestId(App.deliveryStatus).should(
      'contain.text',
      'Status: in-transit'
    );
  });
});
