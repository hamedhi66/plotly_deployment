// We use d3 to select an HTML element
var selector = d3.select("#selDataset");
// We use d3 to retrieve data "asynchronously"
d3
    .json("samples.json").then((data) => {
        // console.log(data);
        // for name in names:
        // 
        data.names.forEach(name => {
            selector
                .append('option')
                .text(name)
                .property('value', name);
        })
        var first_sample= data.names[0]
        buildMetadata(first_sample) 
        buildCharts(first_sample)
        buildBubbleCharts(first_sample);

        
        console.log(data.metadata[1].bbtype)
        console.log(data.samples[0].otu_ids[9])

    });



// "Asynchronous"
// Javascript DEFINES the optionChanged function:
var optionChanged = (newSample) => {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
    buildBubbleCharts(newSample);
}
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var resultArray = data
            .metadata
            .filter(metadataObj => {
                return metadataObj.id == sample
            });
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        // "header" element; h1, h2, h3, h4, h5, h6
        PANEL.html('');
        // METHOD 1: 
        // PANEL.append("h6").text('ID: ' + result.id);
        // PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
        // PANEL.append("h6").text('GENDER: ' + result.gender);
        // PANEL.append("h6").text('AGE: ' + result.age);
        // PANEL.append("h6").text('LOCATION: ' + result.location);
        // PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
        // PANEL.append("h6").text('WFREQ: ' + result.wfreq);
        // METHOD 2:
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(key.toUpperCase() + ': ' + value); //result.id);
        })
    });
}
function buildCharts(sample) {
    // console.log(...);
    d3.json("samples.json").then((data) => {
        var resultArray = data
            .samples
            .filter(sampleObj => {
                return sampleObj.id == sample
            });
        var result = resultArray[0];
        // Already in sorted order; based on sample_values; DESC
        // for the BAR CHART, grab the first 10
        // 
        var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
            return 'OTU ' + numericIds;
        }).reverse();
        var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
        var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();
        // Plotly wants 3 things:
        var bar_trace = [
            {
                x: top_ten_sample_values, //top_ten_otu_labels, 
                y: top_ten_otu_ids,
                text: top_ten_otu_labels,
                type: 'bar',
                orientation: 'h'
            }
        ];
        //   [{
        //     x: [],
        //     y: [],
        //     type: 'bar',
        //     orientation: 
        // }];
        var bar_layout = {};
        Plotly.newPlot(
            'bar', // 1) Where to put the plot; the string with the value of the id where you want the plot to go (no # needed)
            bar_trace, // 2) The "trace" ; the data
            bar_layout // 3) The "layout"; the metadata / configuration / prettiness <-- optional
        )
    });
}

///////

function buildBubbleCharts(sample) {
  // console.log(...);
  d3.json("samples.json").then((data) => {
      var resultArray = data
          .samples
          .filter(sampleObj => {
              return sampleObj.id == sample
          });
      var result = resultArray[0];
      var Horizontal_values = result.otu_ids;
      var vertical_values = result.sample_values;
      var vertical_labels = result.otu_labels;

      var bubble_trace = [
          {
              x: Horizontal_values, //top_ten_otu_labels, 
              y: vertical_values,
              text:vertical_labels,
              mode: 'markers',
              marker: {
                size: vertical_values,
                color: Horizontal_values,
                colorscale: 'Earth'
                // sizemode: 'area'
              }
          }
      ];

      var bubble_layout = {
        height: "90%",
        width: "200%",
        xaxis: {title: "OTU ID"},
      };
      Plotly.newPlot(
          'bubble', // 1) Where to put the plot; the string with the value of the id where you want the plot to go (no # needed)
          bubble_trace, // 2) The "trace" ; the data
          bubble_layout // 3) The "layout"; the metadata / configuration / prettiness <-- optional
      )
  });
}