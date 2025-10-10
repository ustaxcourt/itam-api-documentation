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
Dependancies:
Node.js v22.18.0, 
Terraform v1.13.3, 
Azure Functions v4

Local files needed:

- local.settings.json - Azure Functions, for now for appropriate IDs and secrets

- terraform.tfvars - Local information regarding subscription and existing resource identification

### Steps for deployment via GitHub actions and provisioning with Terraform
(Local deployment as of now until Authentication is finalized) 

1. Have active GitHub repo – cloned / etc.  
2. Have tested azure functions ready for use and deployment  
    - Verified by having no issues with “func start” command on console 
3. Provision terraform by running the following commands in the command line: 
    - terraform init 
    - terraform validate 
    - terraform plan 
    - terraform apply 
4. The following resources will be provisioned and created: 
    - Provisioned: Our existing storage account, resource group, and when we get to it next – an existing key vault and user assigned managed identity for key vault access 
    - Created: The Azure Function App instance, Azure Insights connected to the function app for monitoring, and the App service plan (free tier) 
    - Resources that are provisioned are pre-existing; they are allocated by terraform but will not be destroyed during tear down. Conversely, resources that are created during terraform application – will be destroyed in the tear down process.  
5. Once verified that all terraform provisioning has been completed, the code must then be deployed. Code deployment occurs via CLI for the azure function when it is pushed to the main branch – as this is the automatic trigger for our Github Actions setup. Therefore, for most recent changes conduct a Pull Request and push to main 
6. This triggers the GitHub Actions deployment of the Azure function as configured within the deploy.yml file that exists within our code base. In order to ensure that deployment runs smoothly – ensure you take the following steps (as of now as we are still developing): 
    - Configure as variables in GitHub Secrets AZURE_CREDENTIALS and AZURE_FUNCTIONAPP_NAME in which the latter has the stated name from the terraform setup for the app and the former contains the XML data from the generated function app Publish Profile from within the Function app in the Azure Portal 
    - In the Azure Portal – Under Configuration Settings -> General, set the Node.js version to v22 
    - (optional) Please configure the API -> CORS settings if you would like to conduct testing within the Azure Portal 
    - With these steps, your azure functions are officially online and ready to use. Authentication for full use will be implemented in the next task for this project.  
7. Created Azure Functions will be visible within the Azure Function in the Azure Portal UI so that you can confirm deployment ran successfully 
8. You are now able to run queries to any of the registered azure functions we have available at their designated endpoints! 
9. To tear down the function app and all created/provisioned resources please run the following command: 
    - terraform destroy 
    - *After running this command you will have to set back up the Terraform provisioning running the commands listed in step 3, and reconfigure and rerun the GitHub secret variables as well as re-run the deployment build which can just be run directly within the GitHub UI for GitHub actions within the repo online.  

For full reading on the task related to Terraform Provisioning - you can review this document [here.](https://ustaxcourt.sharepoint.com/:w:/r/sites/ITAssetManagementProject-adhoc/Shared%20Documents/main/AM6000_Deployment/6300_EnvironmentSetup/Azure%20functions%20with%20Terraform%20-%20Deployment%20and%20Configuration.docx?d=w24b54c43d78642edb23ea3666d22ec0a&csf=1&web=1&e=mBgQwZ)


Add piece on storing variables in azure portal app settings maybe
Azure App Settings: Store CLIENT_ID, TENANT_ID, DATAVERSE_URL, and SCOPE in Azure Function App Settings.

.. then also the vscode extensions for devs
