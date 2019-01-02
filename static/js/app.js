function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // sample dict output-> {'sample': 940, 'ETHNICITY': 'Caucasian', 
  //                       'GENDER': 'F', 'AGE': 24.0, 'LOCATION': 'Beaufort/NC', 
  //                       'BBTYPE': 'I', 'WFREQ': 2.0}
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
  buildGauge(sampleNames.WFREQ);
  })
};

function buildGauge(data) {
  // @TODO: Build Gauge Chart  
  var GAUGE = document.getElementById("gauge");
  // Trig to calc meter point
  // Enter WFREQ between 0 and 9
  var level = data;
  var degrees = 180 - level,
  radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var traceC = [{ type: 'scatter',
  x: [0], y:[0],
  marker: {size: 28, color:'850000'},
  showlegend: false,
  name: 'speed',
  text: level,
  hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
        'Slow', 'Super Slow', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                      'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                      'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                      'rgba(255, 255, 255, 0)']},
  labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
  }];
  var gaugeData = [traceC];
  var gaugeLayout = {
  shapes:[{
  type: 'path',
  path: path,
  fillcolor: '850000',
  line: {
    color: '850000'
  }
  }],
  title: 'Gauge Speed 0-100',
  //height: 1000,
  //width: 1000,
  xaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]}
  };

  Plotly.plot(GAUGE, gaugeData, gaugeLayout, {responsive: true});
};
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    //console.log("newdata", data); // WORKING !!!!
    var top10_values = data.sample_values.sort().slice(0,10);
    // @TODO: Build a Pie Chart
    // console.log(data.sample_values)
    var PIE = document.getElementById("pie");
    var traceB = {
      type: "pie",
      values: top10_values,
      labels: data.otu_ids,
      hovertext: data.otu_labels
    };
    var pieData = [traceB];
    var pieLayout = {
      //autosize: true,
      automargin: true,
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
    //console.log("bubble: ", data.otu_ids, data.sample_values)
    var bubbleLayout = {
      //title: 'Bubble Chart',
      xaxis: {
        title: 'otu ids'},
      showlegend: false,
      //hovermode: "closest",
      //autosize: false,
      automargin: true,
      height: 640
      //width: 1520
    };
    
    Plotly.plot(BUBBLE, bubbleData, bubbleLayout, {responsive: true});
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
