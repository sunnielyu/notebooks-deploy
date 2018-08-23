ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_NOTEBOOK_IMAGE
ARG JUPYTERHUB_VERSION
ARG KG_URL
ARG KG_AUTH_TOKEN

RUN pip install --upgrade pip

# Install nb2kg package to use Kernel Gateway
RUN pip install --no-cache-dir git+https://github.com/jupyter-incubator/nb2kg.git#egg=nb2kg jupyterhub==$JUPYTERHUB_VERSION
RUN jupyter serverextension enable --py nb2kg --sys-prefix

ENV KG_URL=$KG_URL
ENV KG_AUTH_TOKEN=$KG_AUTH_TOKEN

# Run with remote kernel managers
CMD ["jupyter", "notebook", \
     "--NotebookApp.ip=0.0.0.0", \
     "--NotebookApp.session_manager_class=nb2kg.managers.SessionManager", \
     "--NotebookApp.kernel_manager_class=nb2kg.managers.RemoteKernelManager", \
     "--NotebookApp.kernel_spec_manager_class=nb2kg.managers.RemoteKernelSpecManager"]