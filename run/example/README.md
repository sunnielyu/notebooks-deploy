# OAuthenticator

Example of running [JupyterHub](https://github.com/jupyterhub/jupyterhub)
with [LabShare Auth](https://a.labshare.org/_api/auth/docs) for authentication.

## Setup

Edit the file called `userlist` to include one user email per line.
If that user should be an admin (you!), add `admin` after a space.

For example:

```
mal@example.com admin
zoe@google.domain admin
wash@example.com
```

## build

Build the container with:

    docker build -t jupyterhub-oauth .

### ssl

To run the server on HTTPS, put your ssl key and cert in ssl/ssl.key and
ssl/ssl.cert.

## run

 - Go to the management UI of LabShare Auth and register a new `regular web` OAuth Client to a LabShare Auth Organization
 - Assign it one or more Identity Providers registered to the organization
 - Add the client id, client secret, LabShare organization, LabShare Auth URL, and callback URL to the local `env` file.

Once you have built the container, you can run it with:

    docker run -it -p 8000:8000 --env-file=env jupyterhub-oauth

Which will run the Jupyter server.
