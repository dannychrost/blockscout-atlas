# Frontend Project

This project is a web application frontend utilizing React for building the UI, Sendbird for chat functionalities, react-router-dom for routing, crypto-js for encryption, axios for HTTP requests, and react-spring for animations.

## Getting Started

### Prerequisites

Before running this project, make sure you have Node.js and npm installed. You can check by running:

node -v
npm -v

### Installation

Clone the repository

git clone [repository URL]
cd [local repository]

### Install Dependencies

Run the following command to install the required libraries and dependencies:

npm install

This command installs dependencies including React, Sendbird UIKit, react-router-dom, crypto-js, axios, and react-spring.

### Environment Variables

Create a .env file in the root directory of the project to store your environment variables. You can start by copying the .env.example file provided:

cp .env.example .env

Then, fill in the values in .env for:

REACT_APP_SENDBIRD_APP_ID: Your Sendbird application ID.
REACT_APP_BACKEND_URL: The URL to your backend service.

Example:

REACT_APP_SENDBIRD_APP_ID=your_sendbird_application_id
REACT_APP_BACKEND_URL=http://localhost:3000

### Running the Application

After setting up the environment variables, you can start the application by running:

npm start
This command runs the app in development mode. Open http://localhost:3001 to view it in the browser in the default case where the backend is already running on port 3000.

## Features

Chat Integration: Utilizes Sendbird UIKit for seamless real-time chat functionalities.
Secure Data Handling: Uses crypto-js for secure encryption of data.
Dynamic Routing: Implements react-router-dom for managing routes and navigation within the application.
Smooth Animations: Incorporates react-spring for fluid and natural animations.
Efficient Server Communication: Leverages axios for optimized HTTP requests to the backend.
Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or improvements.

## Lead Developer

- **Daniel Chrostowski** - Spearheaded the frontend development of the project, masterfully weaving together React components, Sendbird for chat functionalities, and engaging UI animations with react-spring. Played a pivotal role in ensuring seamless integration with the OpenAI-powered backend. [GitHub Profile](https://github.com/dannychrost)

## Acknowledgments

- Special thanks to the Queens College Tech Incubator and Lendvest for their collaboration and support in realizing this project.
