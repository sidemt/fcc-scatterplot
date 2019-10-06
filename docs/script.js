const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

getDataset();

// Retrieve the dataset
function getDataset() {
  // Instanciate XMLHttpRequest Object
  req = new XMLHttpRequest();
  // Initialize GET request
  req.open("GET", dataUrl, true);
  // Send the request
  req.send();
  // onload event handler
  req.onload = function() {
    // Parse the returned JSON string to JavaScript object
    json = JSON.parse(req.responseText);
    // use the value of "data" only
    var dataset = json;
    drawChart(dataset);
  };
};

// Draw chart
function drawChart(dataset) {
  // Width and height of the svg area
  const w = 1000;
  const h = 600;
  const padding = 50;

  // Style of dots
  const r = 5;

  // Min and max values
  const minX = d3.min(dataset, (d) => d['Year'])
  const maxX = d3.max(dataset, (d) => d['Year'])
  const minY = d3.min(dataset, (d) => d['Seconds'])
  const maxY = d3.max(dataset, (d) => d['Seconds'])

  // Scales
  // X: Year
  const xScale = d3
    .scaleTime()
    .domain(
      d3.extent(dataset, function(d) {
        return new Date(d[0]);
      })
    )
    .range([padding, w - padding]);

  // Y: Time(Seconds)

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => d['Year'])
    .attr("cy", (d) => h - d['Seconds'])
    .attr("r", r);

  d3.select("#graph")
    .append("p")
    .text(JSON.stringify(dataset));
};
