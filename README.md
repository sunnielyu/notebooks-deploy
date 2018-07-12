[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)



# Compute

## Setup

1. Clone the ls-compute repository from GitHub using `git clone https://github.com/LabShare/compute`.
2. Install package dependencies using `npm i`.

## Development
### Running JupyterHub Locally
1. Build docker images using `npm run build`.
2. Start JupyterHub on `localhost:8000` using `npm start`.
3. To create user accounts on JupyterHub, access the container shell using `docker exec -ti jupyterhub bash`.
4. Create a new user using `useradd <username>` and set a password using `passwd <username>`. 

## Deployment
### Kubernetes

### Terraform
1. Configure your environment for the Google Cloud Terraform provider
	export GOOGLE_APPLICATION_CREDENTIALS=${TF_CREDS}
	export GOOGLE_PROJECT=${TF_ADMIN}
2. Initialize backend using 'terraform init'
3. Use terraform plan to view any changes to make
4. Deploy to GCP using 'terraform apply'
5. Jupyterhub service should be viewable at the ip provided by the loadbalancer.