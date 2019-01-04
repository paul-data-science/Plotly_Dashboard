
var maxSlices = 9;
 function buildGauge(sampleWFREQ) {
    //d3.json(`/metadata/${sample}`).then((sampleNames) => {
      // @TODO: Build Gauge Chart  
  var GAUGE = document.getElementById("gauge");
      // sampleWFREQ is between 0 and 9
      //console.log(sampleWFREQ); //WORKING!!!
      // Trig to calc meter point
      var radians = Math.PI - Math.PI*(sampleWFREQ/maxSlices);
      var x = Math.cos(radians);
      var y = Math.sin(radians);
      /***************************************************************************************************************
       * <g class="shapelayer"><path data-index="0" fill-rule="evenodd" 
       * d="M 360 238.38 L 360 231.63 L 623.11 188.82999999999998 Z"     <= DIRECTION OF NEEDLE !!!
       * clip-path="url(#clip7b1f3fxy)" style="opacity: 1; 
       * stroke: rgb(0, 0, 0); stroke-opacity: 1; fill: rgb(0, 0, 0); fill-opacity: 1; stroke-width: 2px;"></path></g>
       */
      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.03 L .0 0.03 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd); //console.log(path);
      
  var denom = 9;
  var numr = 90;
  var gaugeData = [{ type: 'scatter', x: [0], y:[0],
   marker: {size: 20, color:'000000'},
   hoverinfo: false,
   hoverttext: "Frequently Washed "+sampleWFREQ+" times",
   showlegend: false
    },
    {type: "pie",
    showlegend: false,
    hole: 0.2,
    rotation: 90,
    values: [numr / denom, numr / denom, numr / denom, numr / denom, numr / denom, numr / denom, numr / denom, numr / denom, numr / denom, 90],
    text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
    descr1: "Frequently Wash ",
    descr2: "Times",
    direction: "clockwise",
    textinfo: "text",
    textposition: "inside",
    marker: { colors: ["","","","","","","","","","white"]
    },
    labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
    hoverinfo: "label"
  }];

  var gaugeLayout = {
  shapes:[{
  type: 'path',
  path: path,
  fillcolor: '000000',
  line: {
    color: '000000'
  }
  }],
  title: 'Belly Button Washing Frequency',
  xaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]}
  };
console.log(gaugeLayout);
  Plotly.newPlot(GAUGE, gaugeData, gaugeLayout);
};

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // sample dict output-> {'sample': 940, 'ETHNICITY': 'Caucasian', 
  //                       'GENDER': 'F', 'AGE': 24.0, 'LOCATION': 'Beaufort/NC', 
  //                       'BBTYPE': 'I', 'WFREQ': 2.0}
  // Use `d3.json` to fetch the metadata for a sample: "/metadata/<sample>"
  d3.json(`/metadata/${sample}`).then((sampleNames) => {
     // console.log("meta: ", sampleNames); // WORKING !!!!
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleNames).forEach(([key, value]) => {
      var li = selector.append("li").text(`${key}: ${value}`);
    });
    //console.log(sampleNames.WFREQ); // WORKING!!!
    buildGauge(sampleNames.WFREQ);
  });
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
    //buildGauge(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  //buildGauge(newSample);
};

// Initialize the dashboard
init();
