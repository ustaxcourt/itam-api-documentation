# itam-api-documentation
Welcome to the USTC Automation Team API Documentation Repository for the IT Asset Management Project
This repository will be utilized to document, test, develop, and ultimately deliver our final API documentation for the Zendesk - IT Asset API solution.

This API documentation and the respective implementation of these files is set in JavaScript as of right now. With there are a few pre-requisite installations that must take place so that authentication and each of the calls can run smoothly. (In development as of right now) However our set up / approach is a serverless one that leverages Azure Functions V4 implemented via JavaScript and ESM. The function app will contain all APIs created and handle API logic and will be provisioned via Terraform and Deployed through Github actions.

The approach to the authentication and API script structure is a modular approach. OAuth files are stored separately from the API data operation files but called upon and referenced within each of the API documentation files for proper authentication and organization. This process takes place within the Azure Functions folder. 

## Directory of our repo layout:
+ azure-functions - logic handling / general location for our web apis
+ terraform - our terraform provisioning files will exist here
+ sandbox - experimental / testing / in progress / development work will exist here
+ src root - old project files from earlier dev work

This root file as well as the Azure Functions Folder will contain documentation and setup / configuration information so that users can get their environments ready for use. 

## Here are instructions on how to get set-up and use our developed API tools:

### 1. Rewrite based on deployment access and necessary dependencies. Coming soon!
