# Node.js Backend for The Node Project

This project, a Node.js backend application, is the result of a collaboration between the Queens College Tech Incubator and Lendvest, with me serving as the lead developer. It is meticulously crafted to integrate Sendbird for comprehensive user management and messaging, alongside OpenAI for sophisticated natural language processing and response generation. This endeavor not only represents a synergy of organizational efforts but also my commitment to delivering a robust and scalable solution.

## Getting Started

These instructions will guide you through getting a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com))
- [Git](https://git-scm.com)
- [ngrok](download and install from [ngrok website](https://ngrok.com/))

### Installation

1. Clone the repository:

   git clone [repository URL]

2. Navigate to the project directory:

   cd [project directory]

3. Install NPM packages:

   npm install

### Environment Variables

Create a .env file in the root directory of your project. Add the following environment variables:

    SENDBIRD_APPLICATION_ID=your_sendbird_application_id
    SENDBIRD_API_TOKEN=your_sendbird_api_token
    OPENAI_API_KEY=your_openai_api_key
    CORS_ORIGIN=http://localhost:3001

Replace your_sendbird_application_id, your_sendbird_api_token, and your_openai_api_key with your actual Sendbird Application ID, API Token, and OpenAI API key respectively.
The CORS_ORIGIN variable is set to allow requests from your frontend running at http://localhost:3001. Adjust it as per your frontend application's URL.

### Running the Application

1. Start the Server:

   npm start

The server should now be running and listening for requests on port 3000.

2. Tunneling with ngrok:

If you need to expose your local server to the internet (for example, for webhook testing), you can use ngrok.

Start ngrok to tunnel requests to your local server (port 3000 by default, must be the same as the one set in the .env file):

    ngrok http 3000

Once ngrok is running, it will display a public URL (e.g., https://<subdomain>.ngrok.io) that forwards to your local server. Use this URL for external services (like in the ReactJS frontend) that need to send requests to your backend.

Note: Remember that each time you restart ngrok, it will give you a new URL. If you're using this URL for webhooks or other similar services, you'll need to update the URL in those services.

### Functionality

The application includes several routes:

    /generate-phrase: Generates a unique mnemonic phrase.
    /addUser: Adds a new user to the Sendbird application.
    /handleNewMessage: Handles new incoming messages and interacts with the OpenAI API.
    /create-user, /create-channel, /create-thread: Utility endpoints for user, channel, and thread management.

## Lead Developer

- **Daniel Chrostowski** - Responsible for the core development of the project, integrating Sendbird and OpenAI to create a intricate backend solution. [GitHub Profile](https://github.com/dannychrost)

## Acknowledgments

- Special thanks to the Queens College Tech Incubator and Lendvest for their collaboration and support in realizing this project.
