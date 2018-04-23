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