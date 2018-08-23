# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_NOTEBOOK_IMAGE
ARG JUPYTERHUB_VERSION
ARG KERNEL_GATEWAY_VERSION

RUN pip install --no-cache-dir jupyter_kernel_gateway==$KERNEL_GATEWAY_VERSION jupyterhub==$JUPYTERHUB_VERSION

# Run kernel gateway
CMD ["jupyter", "kernelgateway", "--KernelGatewayApp.ip=0.0.0.0", "--KernelGatewayApp.log_level=DEBUG"]