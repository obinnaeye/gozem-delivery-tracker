# Package Tracking Web Application

## Overview

This application is a package tracking system built with the MEAN stack (MongoDB, Express, Angular, Node.js). It includes:

-   **Web Tracker**: Customer client web application (SPA)
-   **Web Driver**: Driver client web application (SPA)
-   **Web Admin**: Admin back-office client web application (SPA)
-   **REST API**: Business process back-end services
-   **WebSocket Events**: Real-time updates and communication

## Prerequisites

-   Docker and Docker Compose
-   Node.js (for development purposes)
-   Angular CLI (for development purposes)

## Getting Started

### Setting Up the Environment

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-repository/package-tracking-app.git
    cd package-tracking-app
    ```

## Set Up Environment Variables

Before running the application, you need to set up environment variables for MongoDB credentials.

1. **Create a `.env` File**

    In the root directory of your project, create a file named `.env`. Use the `.env.example` as template.

2. **Start All Services**

    Use Docker Compose to start MongoDB, Express server, and Angular frontend:

    ```bash
    ./start.sh
    ```

    This script will start the services and wait for MongoDB to become healthy.

3. **Access the Application**

    Frontend: Open your browser and navigate to http://localhost:4200 to access the Angular frontend.
    Express Server: The backend API will be available at http://localhost:5000.

4. **Running Component Tests**

    Navigate to the Frontend Directory

    ```bash
    cd delivery-app
    ```

    Run Angular Component Tests

    ```
    bash
    ng test
    ```

    This command will run the unit tests for the Angular components.

5. **Running End-to-End (E2E) Tests**
   Navigate to the End-to-End Test Directory

    ```bash
    cd delivery-app
    ```

    Run Cypress Tests

    ```
    bash
    npx cypress open
    ```

    This command will open the Cypress Test Runner. You can select and run tests interactively. To run tests headlessly, use:

    ```
    bash
    npx cypress run
    ```

6. **Restoring Database for Tests**
   Restore Test Data

    Ensure the MongoDB service is running, and then use the /restore-data endpoint to seed the database with test data:

    ```
    bash
    curl -X POST http://localhost:5000/api/restore-data
    ```
