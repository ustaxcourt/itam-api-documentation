# itam-api-documentation
Welcome to the USTC Automation Team API Documentation Repository for the IT Asset Management Project
This repository will be utilized to document, test, develop, and ultimately deliver our final API documentation for the Zendesk - IT Asset API solution.

This API documentation and the respective implementation of these files is set in JavaScript as of right now. With there are a few pre-requisite installations that must take place so that authentication and each of the calls can run smoothly. (In development as of right now)

The approach to the authentication and API script structure is a modular approach. OAuth files are stored separately from the API data operation files but called upon and referenced within each of the API documentation files for proper authentication and organization. 

## Directory of our repo layout:
+ src - finalized / ready to use versions of our api scripts documentation will exist here
+ sandbox - experimental / testing / in progress / development work will exist here

Each of these folders will include general sets of documentation for additional information and navigation as to what each file is and what it does. Additional navigation will be included as needed.

## Here are instructions on how to get set-up and use our developed API tools:

### 1. Set up your .env variable in your local instance of the repo
Please use the `.env.example` file as reference. Create a local `.env` file with the Client, Tenant, Secret, and Environment ID/URL information filled in. 
### 2. Install Node.js version 20.6.0 or higher
So we can load our env variables and handle authentications across our different API calls / scripts. We include handling within package.json and will within all API files as well. 
You can run any script (using src/index.js as an example here) using the following command as well: 

`node --env-file=.env src/index.js`

### 3. If cloning or forking... if using through (insert packaging solution here)
You do this! -...