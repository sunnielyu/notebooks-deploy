RUN pip install --upgrade pip

RUN pip install jupyter
COPY entrypoint.sh /home/jovyan/

RUN conda install pandas matplotlib jupyter notebook scipy scikit-learn

# Configure container startup
ENTRYPOINT ["tini", "-g", "--"]
CMD ["entrypoint.sh"]
