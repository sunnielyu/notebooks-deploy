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

## Build

Build the container with:

    docker build -t jupyterhub-oauth .

### SSL (optional)

To run the server on HTTPS, put your ssl key and cert in ssl/ssl.key and
ssl/ssl.cert.

## Run

 - Go to the management UI of LabShare Auth and register a new `regular web` OAuth Client to a LabShare Auth Organization
 - Assign the OAuth Client one or more Identity Providers registered to the organization and the callback URL matching the JupyterHub host and port.
 For example: "https://localhost:9000/hub/oauth_callback".
 - Add the OAuth client id, secret, organization, LabShare Auth URL, and callback URL to the local JupyterHub `env` file.

Once you have built the container, you can run it with:

    docker run -it -p 9000:8000 --env-file=env jupyterhub-oauth

Which will run the Jupyter server.
