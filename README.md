[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


# Compute

## Setup

1. Clone the ls-compute repository from GitHub using `git clone https://github.com/LabShare/compute`.
1. Install package dependencies using `npm i`.

## Development
### Running JupyterHub Locally
1. Build docker images using `npm run build`.
1. Start JupyterHub on `localhost:8000` using `npm start`.
1. To create user accounts on JupyterHub, access the container shell using `docker exec -ti jupyterhub bash`.
1. Create a new user using `useradd <username>` and set a password using `passwd <username>`. 

## Deployment

### AWS
1. Change working directory to `deploy/jupyter-emr`.
1. Create a `sample.tfvars` to override variable defaults.
1. Run `terraform init -var-file=sample.tfvars` to load required Terraform modules.
1. Run `terraform apply -var-file=sample.tfvars` to create infrastructure and start application.
1. Access the JupyterHub interface using the `jupyterhub-dns` output.
    * JupyterHub uses PAM authentication. To add users, `ssh` into the EMR cluster master node (hadoop@<jupyterhub-dns>). 
    * Add users to the running JupyterHub docker container using `sudo docker exec jupyterhub useradd -m -s /bin/bash -N <username>`.
    * Change user passwords using `sudo docker exec jupyterhub bash -c "echo <user>:<pw> | chpasswd"`.
1. Destroy deployed application using `terraform destroy -var-file=sample.tfvars`.
