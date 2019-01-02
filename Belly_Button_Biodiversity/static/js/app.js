function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // sample dict output-> {'sample': 940, 'ETHNICITY': 'Caucasian', 
  //                        'GENDER': 'F', 'AGE': 24.0, 'LOCATION': 'Beaufort/NC', 
  //                          'BBTYPE': 'I', 'WFREQ': 2.0}
  // Use `d3.json` to fetch the metadata for a sample: "/metadata/<sample>"
  d3.json(`/metadata/${sample}`).then((sampleNames) => {
      console.log("meta: ", sampleNames); // WORKING !!!!
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleNames).forEach(([key, value]) => {
      var li = selector.append("li").text(`${key}: ${value}`);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    console.log("newdata", data); // WORKING !!!!

    // @TODO: Build a Pie Chart
    console.log(data.sample_values)
    var PIE = document.getElementById("pie");
    var traceB = {
      type: "pie",
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels
    };
    var pieData = [traceB];
    var pieLayout = {
      autosize: true,
      showlegend: true,
      annotations: false,
      //hovermode: "closest"
    };
    
    Plotly.plot(PIE, pieData, pieLayout, {responsive: true});

    var BUBBLE = document.getElementById("bubble");
    var traceA = {
      type: "scatter",
      mode: "markers",
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      marker: {
        //labels: data.otu_labels,
        //colorscale: "default",
        //color: ['rgb(93, 164, 214)']
        size: data.sample_values,
        sizemode: 'diameter'
      }
    };
    var bubbleData = [traceA];
    console.log("bubble: ", data.otu_ids, data.sample_values)
    var bubbleLayout = {
      title: 'Bubble Chart',
      showlegend: false,
      //hovermode: "closest",
      //autosize: false,
      automargin: true,
      height: 640
      //width: 1520
    };
    
    Plotly.plot(BUBBLE, bubbleData, bubbleLayout, {responsive: true});
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
