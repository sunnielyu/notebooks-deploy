Interactive widgets and visulizations
=====================================

Notebooks come preinstalled with multiple visualization and widget
libraries. See the list of examples below

Python
------

`Jupyter Widgets <https://github.com/jupyter-widgets/ipywidgets>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Interactive Widgets for the Jupyter Notebook
https://ipywidgets.readthedocs.io

.. code:: sos

    from __future__ import print_function
    from ipywidgets import interact, interactive, fixed, interact_manual
    import ipywidgets as widgets
    
    def f(x):
        return x
    
    interact(f, x=10);

The interactive widget will appear:

.. figure:: ../../img/interactive-1.png
   :alt: interactive-widget-1

   interactive-widget-1

`Bokeh <https://docs.bokeh.org/en/latest/index.html>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Interactive BokehJS plots controlled from Python

.. code:: sos

    from bokeh.plotting import figure, output_notebook, show
    
    # prepare some data
    x = [1, 2, 3, 4, 5]
    y = [6, 7, 2, 4, 5]
    
    output_notebook()
    
    # create a new plot with a title and axis labels
    p = figure(title="simple line example", x_axis_label='x', y_axis_label='y')
    
    # add a line renderer with legend and line thickness
    p.line(x, y, legend="Temp.", line_width=2)
    
    # show the results
    show(p)



.. raw:: html

    
    <div class="bk-root">
        <a href="https://bokeh.org" target="_blank" class="bk-logo bk-logo-small bk-logo-notebook"></a>
        <span id="1482">Loading BokehJS ...</span>
    </div>




.. parsed-literal::

    BokehDeprecationWarning: 'legend' keyword is deprecated, use explicit 'legend_label', 'legend_field', or 'legend_group' keywords instead



.. raw:: html

    
    
    
    
    
    
    <div class="bk-root" id="d92add97-c3d3-4276-bb36-db43f0e5fb32" data-root-id="1483"></div>





Holoviews
~~~~~~~~~

.. code:: sos

    !holoviews --install-examples

.. code:: sos

    import numpy as np
    import pandas as pd
    import holoviews as hv
    from holoviews import opts
    hv.extension('bokeh', 'matplotlib')

.. code:: sos

    diseases = pd.read_csv('holoviews-examples/assets/diseases.csv.gz')
    vdims = [('measles', 'Measles Incidence'), ('pertussis', 'Pertussis Incidence')]
    ds = hv.Dataset(diseases, ['Year', 'State'], vdims)
    ds = ds.aggregate(function=np.mean)
    
    layout = (ds.to(hv.Curve, 'Year', 'measles') + ds.to(hv.Curve, 'Year', 'pertussis')).cols(1)
    layout.opts(
        opts.Curve(width=600, height=250, framewise=True))

`bqplot <https://github.com/bloomberg/bqplot>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sos

    import numpy as np
    from bqplot import pyplot as plt
    
    size = 200
    scale = 100.
    np.random.seed(0)
    x_data = np.arange(size)
    y_data = np.cumsum(np.random.randn(size)  * scale)
    
    fig = plt.figure()
    axes_options = {'x': {'label': 'Date', 'tick_format': '%m/%d'},
                    'y': {'label': 'Price', 'tick_format': '0.0f'}}
    
    plt.scatter(x_data, y_data, colors=['red'], stroke='black')
    
    plt.show()

`Altair <https://altair-viz.github.io/index.html>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sos

    import altair as alt
    from vega_datasets import data
    
    iris = data.iris()
    
    alt.Chart(iris).mark_point().encode(
        x='petalLength',
        y='petalWidth',
        color='species'
    )

`pythreejs <https://github.com/jupyter-widgets/pythreejs>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Clone this repo: https://github.com/jupyter-widgets/pythreejs.git and
open ``examples`` folder for more examples.

.. code:: sos

    from pythreejs import *
    import ipywidgets
    from IPython.display import display
    
    # Reduce repo churn for examples with embedded state:
    from pythreejs._example_helper import use_example_model_ids
    use_example_model_ids()
    
    view_width = 600
    view_height = 400

.. code:: sos

    f = """
    function f(origu, origv, out) {
        // scale u and v to the ranges I want: [0, 2*pi]
        var u = 2*Math.PI*origu;
        var v = 2*Math.PI*origv;
        
        var x = Math.sin(u);
        var y = Math.cos(v);
        var z = Math.cos(u+v);
        
        out.set(x,y,z)
    }
    """
    surf_g = ParametricGeometry(func=f, slices=16, stacks=16);
    
    surf1 = Mesh(geometry=surf_g,
                 material=MeshLambertMaterial(color='green', side='FrontSide'))
    surf2 = Mesh(geometry=surf_g,
                 material=MeshLambertMaterial(color='yellow', side='BackSide'))
    surf = Group(children=[surf1, surf2])
    
    camera2 = PerspectiveCamera( position=[10, 6, 10], aspect=view_width/view_height)
    scene2 = Scene(children=[surf, camera2,
                             DirectionalLight(position=[3, 5, 1], intensity=0.6),
                             AmbientLight(intensity=0.5)])
    renderer2 = Renderer(camera=camera2, scene=scene2,
                         controls=[OrbitControls(controlling=camera2)],
                         width=view_width, height=view_height)
    display(renderer2)

`Plotly <https://plot.ly/python/getting-started/#overview>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sos

    import plotly.express as px
    iris = px.data.iris()
    fig = px.scatter(iris, x="sepal_width", y="sepal_length", color="species",
                     size='petal_length', hover_data=['petal_width'])
    fig.show()

`itkwidgets <https://github.com/InsightSoftwareConsortium/itkwidgets>`__
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Clone this repo:
https://github.com/InsightSoftwareConsortium/itkwidgets.git and open
``examples`` folder for more examples.

.. code:: sos

    from urllib.request import urlretrieve
    import os
    import zipfile
    
    import itk
    import dask.array.image
    
    from itkwidgets import view

.. code:: sos

    # Download data
    file_name = 'emdata_janelia_822252.zip'
    if not os.path.exists(file_name):
        url = 'https://data.kitware.com/api/v1/file/5bf232498d777f2179b18acc/download'
        urlretrieve(url, file_name)
    with zipfile.ZipFile(file_name, 'r') as zip_ref:
        zip_ref.extractall()

.. code:: sos

    sample = itk.imread('emdata_janelia_822252/3000_3100_4010.png')
    view(sample)

.. code:: sos

    stack = dask.array.image.imread('emdata_janelia_822252/*')
    stack

.. code:: sos

    view(stack, shadow=False, gradient_opacity=0.4, ui_collapsed=True)

R
-

htmlwidgets
~~~~~~~~~~~

htmlwidgets is the base library enabling JavaScript data visualization
in R.

https://www.htmlwidgets.org

Below are packages using ``htmlwidgets`` that are preinstalled in
Notebooks.

highcharter
~~~~~~~~~~~

highcharter: R interface to Highcharts

.. code:: sos

    library(magrittr)
    library(highcharter)
    highchart() %>% 
      hc_title(text = "Scatter chart with size and color") %>% 
      hc_add_series_scatter(mtcars$wt, mtcars$mpg,
                            mtcars$drat, mtcars$hp)

visnetwork
~~~~~~~~~~

visnetwork: graph data visualization with vis.js

.. code:: sos

    library(visNetwork)
    nodes <- data.frame(id = 1:6, title = paste("node", 1:6), 
                        shape = c("dot", "square"),
                        size = 10:15, color = c("blue", "red"))
    edges <- data.frame(from = 1:5, to = c(5, 4, 6, 3, 3))
    visNetwork(nodes, edges) %>%
      visOptions(highlightNearest = TRUE, nodesIdSelection = TRUE)

rbokeh
~~~~~~

rbokeh is R interface for Bokeh. Bokeh is a visualization library that
provides a flexible and powerful declarative framework for creating
web-based plots.

.. code:: sos

    library(magrittr)
    library(highcharter)
    highchart() %>% 
      hc_title(text = "Scatter chart with size and color") %>% 
      hc_add_series_scatter(mtcars$wt, mtcars$mpg,
                            mtcars$drat, mtcars$hp)

dygraphs: time series charting
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sos

    library(dygraphs)
    dygraph(nhtemp, main = "New Haven Temperatures") %>% 
      dyRangeSelector(dateWindow = c("1920-01-01", "1960-01-01"))

d3heatmap
~~~~~~~~~

Interactive heatmaps with D3

.. code:: sos

    library(d3heatmap)
    d3heatmap(mtcars, scale="column", colors="Blues")

plotly
~~~~~~

Interactive graphics with D3

.. code:: sos

    library(ggplot2)
    library(plotly)
    p <- ggplot(data = diamonds, aes(x = cut, fill = clarity)) +
                geom_bar(position = "dodge")
    ggplotly(p)

networkd3
~~~~~~~~~

Graph data visualization with D3

.. code:: sos

    library(networkD3)
    data(MisLinks, MisNodes)
    forceNetwork(Links = MisLinks, Nodes = MisNodes, Source = "source",
                 Target = "target", Value = "value", NodeID = "name",
                 Group = "group", opacity = 0.4)

Data Table
~~~~~~~~~~

Tabular data display with sorting and search

.. code:: sos

    library(DT)
    datatable(iris, options = list(pageLength = 5))

threejs
~~~~~~~

3D scatterplots and globes

.. code:: sos

    library(threejs)
    z <- seq(-10, 10, 0.01)
    x <- cos(z)
    y <- sin(z)
    scatterplot3js(x,y,z, color=rainbow(length(z)))

rglwidget
~~~~~~~~~

Render RGL scenes

.. code:: sos

    library(rgl)
    library(rglwidget)
    library(htmltools)
    
    theta <- seq(0, 6*pi, len=100)
    xyz <- cbind(sin(theta), cos(theta), theta)
    lineid <- plot3d(xyz, type="l", alpha = 1:0, 
                     lwd = 5, col = "blue")["data"]
    
    browsable(tagList(
      rglwidget(elementId = "example", width = 500, height = 400,
                controllers = "player"),
      playwidget("example", 
                 ageControl(births = theta, ages = c(0, 0, 1),
                            objids = lineid, alpha = c(0, 1, 0)),
                            start = 1, stop = 6*pi, step = 0.1, 
                            rate = 6,elementId = "player")
    ))

C++
---

xwidgets
~~~~~~~~

.. code:: sos

    #include "xwidgets/xslider.hpp"

.. code:: sos

    xw::slider<double> slider;
    slider.display();

The interactive widget will appear:

.. figure:: ../../img/xwidgets.png
   :alt: interactive-widget-1

   interactive-widget-1
