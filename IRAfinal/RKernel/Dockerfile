#ARG DOCKER_NOTEBOOK_IMAGE
#FROM $DOCKER_NOTEBOOK_IMAGE
#ARG JUPYTERHUB_VERSION
#ARG KG_URL
#ARG KG_AUTH_TOKEN
#LABEL maintainer="Jupyter Project <jupyter@googlegroups.com>"

#RUN pip install --upgrade pip

# Install nb2kg package to use Kernel Gateway
#RUN pip install --no-cache-dir git+https://github.com/jupyter-incubator/nb2kg.git#egg=nb2kg jupyterhub==$JUPYTERHUB_VERSION
#RUN jupyter serverextension enable --py nb2kg --sys-prefix

#USER root
#RUN apt-get update && \
   apt-get install -y --no-install-recommends \
   fonts-dejavu \
   tzdata \
   gfortran \
   gcc && apt-get clean && \
   rm -rf /var/lib/apt/lists/*

# Used to install R kernel
#USER $NB_UID
#RUN conda install --quiet --yes \
#       'r-base=3.4.1' \
       'r-irkernel=0.8*' \
       'r-plyr=1.8*' \
       'r-devtools=1.13*' \
       'r-tidyverse=1.1*' \
       'r-shiny=1.0*' \
       'r-rmarkdown=1.8*' \
       'r-forecast=8.2*' \
       'r-rsqlite=2.0*' \
       'r-reshape2=1.4*' \
       'r-nycflights13=0.2*' \
       'r-caret=6.0*' \
       'r-rcurl=1.95*' \
       'r-crayon=1.3*' \
       'r-randomforest=4.6*' \
       'r-htmltools=0.3*' \
       'r-sparklyr=0.7*' \
       'r-htmlwidgets=1.0*' \
       'r-hexbin=1.27*' && \
       conda clean -tipsy && \
       fix-permissions $CONDA_DIR


#ENV KG_URL=$KG_URL
#ENV KG_AUTH_TOKEN=$KG_AUTH_TOKEN

# Run with remote kernel managers
#CMD ["jupyter", "notebook",\
#   "--allow-root", \
#    "--NotebookApp.session_manager_class=nb2kg.managers.SessionManager", \
#    "--NotebookApp.kernel_manager_class=nb2kg.managers.RemoteKernelManager", \
#    "--NotebookApp.kernel_spec_manager_class=nb2kg.managers.RemoteKernelSpecManager"]
