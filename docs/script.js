const dataUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

getDataset();

// Retrieve the dataset
function getDataset() {
  // Instanciate XMLHttpRequest Object
  req = new XMLHttpRequest();
  // Initialize GET request
  req.open('GET', dataUrl, true);
  // Send the request
  req.send();
  // onload event handler
  req.onload = function() {
    // Parse the returned JSON string to JavaScript object
    json = JSON.parse(req.responseText);
    // use the value of "data" only
    const dataset = json;
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
  const minX = d3.min(dataset, (d) => d['Year']);
  const maxX = d3.max(dataset, (d) => d['Year']);
  const minY = d3.min(dataset, (d) => d['Seconds']);
  const maxY = d3.max(dataset, (d) => d['Seconds']);

  console.log(minX);
  console.log(maxX);
  console.log(minY);
  console.log(maxY);

  // Scales
  // X: Year
  const xScale = d3
      .scaleTime()
      .domain(
          d3.extent(dataset, function(d) {
            return new Date(d['Year']);
          })
      )
      .range([padding, w - padding]);

  // Y: Time(Seconds)
  const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([h - padding, padding]);

  const svg = d3
      .select('#graph')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

  svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(new Date(d['Year'])))
      .attr('cy', (d) => h - yScale(d['Seconds']))
      .attr('r', r);

  // Display axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // x-axis
  svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .attr('id', 'x-axis') // required for the fcc test
      .call(xAxis);

  // y-axis
  svg
      .append('g')
      .attr('transform', 'translate(' + padding + ', 0)')
      .attr('id', 'y-axis') // required for the fcc test
      .call(yAxis);
};
