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
  console.log(new Date(minY * 1000));
  console.log(new Date(maxY * 1000));


  // Scales
  // X: Year
  const xScale = d3
      .scaleTime()
      .domain(
          d3.extent(dataset, function(d) {
            return new Date(d['Year'].toString());
          })
      )
      .nice()
      .range([padding, w - padding]);

  // Y: Time(Seconds)
  const yScale = d3
      .scaleTime()
      .domain(
          d3.extent(dataset, function(d) {
            const time = d['Time'].split(':');
            return new Date(Date.UTC(0, 0, 0, 0, time[0], time[1], 0));
          }).reverse() // invert d3.extent
      )
      .nice()
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
      .attr('class', 'dot') // required for fcc test
      .attr('data-xvalue', (d) => new Date(d['Year'].toString()))
      .attr('data-yvalue', (d) => {
        const time = d['Time'].split(':');
        date = new Date(Date.UTC(0, 0, 0, 0, time[0], time[1], 0));
        return date;
      })
      .attr('cx', (d) => xScale(new Date(d['Year'].toString())))
      .attr('cy', (d) => {
        const time = d['Time'].split(':');
        date = new Date(Date.UTC(0, 0, 0, 0, time[0], time[1], 0));
        return yScale(date);
      })
      .attr('r', r);

  // Configure axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(d3.timeSecond.every(15)).tickFormat(d3.timeFormat('%M:%S'));

  // Draw x-axis
  svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .attr('id', 'x-axis') // required for the fcc test
      .call(xAxis);

  // Draw y-axis
  svg
      .append('g')
      .attr('transform', 'translate(' + padding + ', 0)')
      .attr('id', 'y-axis') // required for the fcc test
      .call(yAxis);
};
