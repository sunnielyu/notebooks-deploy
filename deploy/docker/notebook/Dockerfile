ARG BASE_CONTAINER=ubuntu:bionic-20190612@sha256:9b1702dcfe32c873a770a32cfd306dd7fc1c4fd134adfb783db68defc8894b3c
FROM $BASE_CONTAINER

COPY VERSION /

LABEL maintainer="Konstantin Taletskiy <konstantin.taletskiy@labshare.org>"
ARG NB_USER="jovyan"
ARG NB_UID="1000"
ARG NB_GID="100"

USER root

# Install all OS dependencies
ADD apt_list .
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
    apt-get -y install software-properties-common && \
    add-apt-repository ppa:apt-fast/stable && \
    apt-get update && \
    apt-get -y install apt-fast && \
    apt-fast update && \
    apt-fast install -yq --no-install-recommends $(cat apt_list) && \
    rm -rf /var/lib/apt/lists/*

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen

# Configure environment
ENV CONDA_DIR=/opt/conda \
    SHELL=/bin/bash \
    NB_USER=$NB_USER \
    NB_UID=$NB_UID \
    NB_GID=$NB_GID \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8
ENV PATH=$CONDA_DIR/bin:$PATH \
    HOME=/home/$NB_USER \
    MINICONDA_VERSION=4.7.12 \
    CONDA_VERSION=4.7.12 \
    JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 \
    MAVEN_HOME=/usr/share/maven \
    MAVEN_CONFIG="$USER_HOME_DIR/.m2" \
    JULIA_DEPOT_PATH=/opt/julia \
    JULIA_PKGDIR=/opt/julia \
    JULIA_VERSION=1.1.1 \
    XDG_CACHE_HOME=/home/$NB_USER/.cache/ \
    SCALA_VERSION=2.12.8 \
    ALMOND_VERSION=0.6.0

# Add a script that we will use to correct permissions after running certain commands
ADD fix-permissions /usr/local/bin/fix-permissions

# Enable prompt color in the skeleton .bashrc before creating the default NB_USER
RUN sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' /etc/skel/.bashrc

# Create NB_USER wtih name jovyan user with UID=1000 and in the 'users' group
# and make sure these dirs are writable by the `users` group.
RUN echo "auth requisite pam_deny.so" >> /etc/pam.d/su && \
    sed -i.bak -e 's/^%admin/#%admin/' /etc/sudoers && \
    sed -i.bak -e 's/^%sudo/#%sudo/' /etc/sudoers && \
    useradd -m -s /bin/bash -N -u $NB_UID $NB_USER && \
    mkdir -p $CONDA_DIR && \
    chown $NB_USER:$NB_GID $CONDA_DIR && \
    chmod g+w /etc/passwd && \
    fix-permissions $HOME && \
    fix-permissions "$(dirname $CONDA_DIR)"

USER $NB_UID
WORKDIR $HOME

# Setup work directory for backward-compatibility
RUN mkdir /home/$NB_USER/work && \
    fix-permissions /home/$NB_USER

# Install conda as jovyan and check the md5 sum provided on the download site
# ADD conda_environment.yaml .
ADD conda_list .
ADD pip_list .
RUN cd /tmp && \
    wget --quiet https://repo.continuum.io/miniconda/Miniconda3-${MINICONDA_VERSION}-Linux-x86_64.sh && \
    echo "0dba759b8ecfc8948f626fa18785e3d8 *Miniconda3-${MINICONDA_VERSION}-Linux-x86_64.sh" | md5sum -c - && \
    /bin/bash Miniconda3-${MINICONDA_VERSION}-Linux-x86_64.sh -f -b -p $CONDA_DIR && \
    rm Miniconda3-${MINICONDA_VERSION}-Linux-x86_64.sh && \
    echo "conda ${CONDA_VERSION}" >> $CONDA_DIR/conda-meta/pinned && \
    $CONDA_DIR/bin/conda config --system --prepend channels bioconda && \
    $CONDA_DIR/bin/conda config --system --prepend channels conda-forge && \
    $CONDA_DIR/bin/conda config --system --set auto_update_conda false && \
    $CONDA_DIR/bin/conda config --system --set show_channel_urls true && \
    $CONDA_DIR/bin/conda config --system --set channel_priority strict && \
    $CONDA_DIR/bin/conda install pycryptosat && \
    $CONDA_DIR/bin/conda config --system --set sat_solver pycryptosat && \
    $CONDA_DIR/bin/conda install -y --file  $HOME/conda_list && \
    pip install -r $HOME/pip_list && \
    # $CONDA_DIR/bin/conda env update --file $HOME/conda_environment.yaml && \
    $CONDA_DIR/bin/conda list python | grep '^python ' | tr -s ' ' | cut -d '.' -f 1,2 | sed 's/$/.*/' >> $CONDA_DIR/conda-meta/pinned && \
    $CONDA_DIR/bin/conda list tini | grep tini | tr -s ' ' | cut -d ' ' -f 1,2 >> $CONDA_DIR/conda-meta/pinned && \
    npm cache clean --force && \
    jupyter notebook --generate-config && \
    rm -rf $CONDA_DIR/share/jupyter/lab/staging && \
    conda clean --all -f -y && \
    rm -rf /home/$NB_USER/.cache/yarn && \
    find /opt/conda/ -follow -type f -name '*.a' -delete && \
    find /opt/conda/ -follow -type f -name '*.pyc' -delete && \
    find /opt/conda/ -follow -type f -name '*.js.map' -delete && \
    find /opt/conda/lib/python*/site-packages/bokeh/server/static -follow -type f -name '*.js' && \
    fix-permissions $CONDA_DIR && \
    fix-permissions /home/$NB_USER

USER $NB_UID
RUN julia -e 'import Pkg; Pkg.update()' && \
    julia -e "using Pkg; \
              pkg\"add Feather DataFrames NamedArrays RDatasets IJulia InstantiateFromURL HDF5 https://github.com/probcomp/Gen\";\
              pkg\"precompile\"" && \
    # move kernelspec out of home \
    mv $HOME/.local/share/jupyter/kernels/julia-1.0/kernel.json $CONDA_DIR/share/jupyter/kernels/julia-1.0/kernel.json && \
    rm -rf $HOME/.local && \
    fix-permissions $JULIA_PKGDIR $CONDA_DIR/share/jupyter

# Import matplotlib the first time to build the font cache.
RUN MPLBACKEND=Agg python -c "import matplotlib.pyplot" && \
    fix-permissions /home/$NB_USER

#Scala kernel
RUN curl -Lo coursier https://git.io/coursier-cli && \
    chmod +x coursier && \
    ./coursier bootstrap \
      -r jitpack \
      -i user -I user:sh.almond:scala-kernel-api_$SCALA_VERSION:$ALMOND_VERSION \
      sh.almond:scala-kernel_$SCALA_VERSION:$ALMOND_VERSION \
      -o almond && \
    ./almond --install && \
    rm almond coursier

# Java kernel
RUN curl -L https://github.com/SpencerPark/IJava/releases/download/v1.3.0/ijava-1.3.0.zip > ijava-kernel.zip && \
    unzip ijava-kernel.zip -d ijava-kernel \
    && cd ijava-kernel \
    && python install.py --sys-prefix \
    && cd .. \
    && rm ijava-kernel.zip \
    && rm -rf ijava-kernel

# Temporary disable due to npm conflict
# JavaScript and Typescript kernels
# RUN npm install -g ijavascript itypescript && \
#     ijsinstall --spec-path=full && \
#     its --install=local

# Enable language kernels
RUN python -m bash_kernel.install --user && \
    python -m octave_kernel install --user && \
    python -m sos_notebook.install

# Install WIPP integration
RUN jupyter serverextension enable --py jupyterlab_wipp

# Add missing kernel logos
COPY coffee.png /opt/conda/share/jupyter/kernels/java/logo-64x64.png
COPY bash.png /home/jovyan/.local/share/jupyter/kernels/bash/logo-64x64.png

# Install JupyterLab Extensions
ADD labextension_list .
RUN jupyter labextension install --no-build $(cat labextension_list) && \
    jupyter lab build --dev-build=False && \
    npm cache clean --force

# Add symbolic link to the shared filesystem
RUN ln -s /opt/shared shared

EXPOSE 8888

# Configure container startup
ENTRYPOINT ["tini", "-g", "--"]
CMD ["start-notebook.sh"]

# Add local files as late as possible to avoid cache busting
COPY start.sh /usr/local/bin/
COPY start-notebook.sh /usr/local/bin/
COPY start-singleuser.sh /usr/local/bin/
COPY jupyter_notebook_config.py /etc/jupyter/

# Fix permissions on /etc/jupyter as root
USER root
RUN fix-permissions /etc/jupyter/

# Switch back to jovyan to avoid accidental container runs as root
USER $NB_UID
