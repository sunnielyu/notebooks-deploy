
# coding: utf-8

# In[7]:


import json
import os
import requests


# In[8]:


URL = 'http://localhost:8888'


# In[9]:


resp = requests.post(URL + '/example', data={'number': ["YOOG"], 'http': 'http://localhost:8888', 'ws': 'ws://localhost:8888','path': 'Documents/Python Scripts', 'notebookName': 'display.ipynb', 'destroyKernel':True})
resp.raise_for_status()
jsonRes = resp.json()
print(jsonRes)

