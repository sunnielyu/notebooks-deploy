# Configuration file for Jupyter Hub

c = get_config()

c.JupyterHub.log_level = 10

import json
import os
import urllib

from tornado.auth import OAuth2Mixin
from tornado import gen, web

from tornado.httpclient import HTTPRequest, AsyncHTTPClient, HTTPError
from jupyterhub.auth import LocalAuthenticator
from oauthenticator.oauth2 import OAuthLoginHandler, OAuthenticator

OAUTH_CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')
OAUTH_CLIENT_SECRET = os.getenv('OAUTH_CLIENT_SECRET')
OAUTH_CALLBACK_URL = os.getenv('OAUTH_CALLBACK_URL')

ORGANIZATION = os.getenv('ORGANIZATION')  # LabShare Auth tenant
AUTH_URL = os.getenv('AUTH_URL')          # URL of the LabShare Auth instance

class LabShareAuthMixin(OAuth2Mixin):
    _OAUTH_AUTHORIZE_URL = "{0}/auth/{1}/authorize".format(AUTH_URL, ORGANIZATION)
    _OAUTH_ACCESS_TOKEN_URL = "{0}/auth/oauth/token".format(AUTH_URL)


class Auth0LoginHandler(OAuthLoginHandler, LabShareAuthMixin):
    pass

class LabShareAuthAuthenticator(OAuthenticator):

    login_service = "LabShare Auth"
    login_handler = Auth0LoginHandler

    @gen.coroutine
    def authenticate(self, handler, data=None):
        code = handler.get_argument("code")
        # TODO: Configure the curl_httpclient for tornado
        http_client = AsyncHTTPClient()

        params = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'redirect_uri': self.get_callback_url(handler)
        }

        url = "{0}/auth/oauth/token".format(AUTH_URL)

        # Get Access Token using Authorization Code
        req = HTTPRequest(url,
                          method="POST",
                          headers={"Content-Type": "application/x-www-form-urlencoded"},
                          body=urllib.parse.urlencode(params)
                          )

        try:
            resp = yield http_client.fetch(req)
            resp_json = json.loads(resp.body.decode('utf8', 'replace'))

            access_token = resp_json['access_token']

            # Determine who the logged in user is
            headers={"Accept": "application/json",
                     "User-Agent": "JupyterHub",
                     "Authorization": "Bearer {}".format(access_token)
            }

            # Get user profile
            req = HTTPRequest("{0}/auth/me".format(AUTH_URL),
                                      method="GET",
                                      headers=headers
                                      )

            resp = yield http_client.fetch(req)
            resp_json = json.loads(resp.body.decode('utf8', 'replace'))

            return {
                'name': resp_json["email"],
                'auth_state': {
                    'access_token': access_token,
                    'user': resp_json,
                }
            }
        except HTTPError as e:
            print(e.response)
            print(e.response.body)


class LocalLabShareAuthOAuthenticator(LocalAuthenticator, LabShareAuthAuthenticator):

    """A version that mixes in local system user creation"""
    pass
    

LabShareAuthAuthenticator.client_id = OAUTH_CLIENT_ID
LabShareAuthAuthenticator.client_secret = OAUTH_CLIENT_SECRET
LabShareAuthAuthenticator.oauth_callback_url = OAUTH_CALLBACK_URL

c.JupyterHub.authenticator_class = LabShareAuthAuthenticator
