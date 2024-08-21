import { App } from '../locators/locators';

describe('Web Admin Component', () => {
  before(() => {
    cy.restoreData();
  });

  beforeEach(() => {
    cy.visit('/admin');
  });

  it('should create a new package', () => {
    cy.getByTestId(App.openPackageModal).click();
    cy.getByTestId(App.packageDescriptionInput).type('Test Package');
    cy.getByTestId(App.packageWeightInput).type('500');
    cy.getByTestId(App.packageWidthInput).type('10');
    cy.getByTestId(App.packageHeightInput).type('20');
    cy.getByTestId(App.packageDepthInput).type('30');
    cy.getByTestId(App.packageFromNameInput).type('Sender Name');
    cy.getByTestId(App.packageFromAddressInput).type('Sender Address');
    cy.getByTestId(App.packageFromLatInput).type('6.3444');
    cy.getByTestId(App.packageFromLngInput).type('2.3433');
    cy.getByTestId(App.packageToNameInput).type('Receiver Name');
    cy.getByTestId(App.packageToAddressInput).type('Receiver Address');
    cy.getByTestId(App.packageToLatInput).type('6.2311');
    cy.getByTestId(App.packageToLngInput).type('2.6474');
    cy.getByTestId(App.createPackageButton).click();
    cy.getByTestId(App.packageList).should('contain.text', 'Test Package');
  });

  it('should create a new delivery', () => {
    cy.intercept('POST', '/api/delivery').as('createDelivery');
    cy.getByTestId(App.packageSearchInput).type('Test Package');
    cy.getByTestId('package-Test Package').click();
    cy.getByTestId(App.createDeliveryButton).click();
    cy.wait('@createDelivery').then((interception) => {
      const deliveryId = interception.response?.body.delivery_id;
      expect(deliveryId).to.exist;
      cy.getByTestId(App.deliveryList).should('contain.text', deliveryId);
    });
  });
});
