// Load the data and render the initial chart
d3.csv('data/processed_file.csv')
  .then(data => {
    // Save the data to a global variable
    window.data = data;

    // Render the initial chart
    const initialColumn = 'health';
    updateChart_H(initialColumn);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

// Function to update the bar chart based on the selected column
function updateChart_H(column) {
  // Remove the previous bar chart, if exists
  d3.select('#interactiveBar_H').selectAll('*').remove();

  // Extract the required data for the bar chart
  const healthCountsSucceed = {};
  const healthCountsFail = {};
  window.data.forEach(row => {
    const health = row[column];
    const success = row.success === 'succeed' ? 1 : 0;
    if (success) {
        healthCountsSucceed[health] = (healthCountsSucceed[health] || 0) + 1;
    } else {
        healthCountsFail[health] = (healthCountsFail[health] || 0) + 1;
    }
  });

  const healths = Object.keys(healthCountsSucceed);
  const countsSucceed = healths.map(health => healthCountsSucceed[health]);
  const countsFail = healths.map(health => healthCountsFail[health]);

  // Define the dimensions and margins for the bar chart
  const width = 600;
  const height = 400;
  const margin = { top: 50, right: 50, bottom: 70, left: 70 };

  // Create the bar chart SVG container
  const svg = d3.select('#interactiveBar_H')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create x-scale and y-scale for the bar chart
  const xScale = d3.scaleBand()
    .domain(healths)
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max([...countsSucceed, ...countsFail])])
    .range([height, 0]);

  // Create x-axis and y-axis for the bar chart
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Add x-axis to the bar chart

  svg.append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom / 2 + 20)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .text('health Level');

  // Add y-axis indicator
svg.append('text')
.attr('transform', 'rotate(-90)')
.attr('x', -height / 2)
.attr('y', -margin.left / 2 - 20)
.attr('text-anchor', 'middle')
.style('font-size', '12px')
.text('Number of students');

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dx', '-0.8em')
    .attr('dy', '0.15em');

  // Add y-axis to the bar chart
  svg.append('g')
    .call(yAxis);

  // Define colors for bars
  const colorSucceed = '#1f77b4';
  const colorFail = '#ff7f0e';

  // Create bars for the 'success = 1' data
  const barsSucceed = svg.selectAll('.bar-succeed_H')
    .data(healths)
    .enter()
    .append('rect')
    .attr('class', 'bar-succeed_H')
    .attr('x', d => xScale(d))
    .attr('y', height)
    .attr('width', xScale.bandwidth() / 2)
    .attr('height', 0)
    .attr('fill', colorSucceed)
    .attr('rx', 6)
    .attr('ry', 6);

  // Add animation to the succeed bars
  barsSucceed.transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr('y', d => yScale(healthCountsSucceed[d]))
    .attr('height', d => height - yScale(healthCountsSucceed[d]));

  // Add tooltips to the succeed bars
  barsSucceed.append('title')
    .text(d => `Succeed: ${healthCountsSucceed[d]}`);

  // Create bars for the 'success = 0' data
  const barsFail = svg.selectAll('.bar-fail_H')
    .data(healths)
    .enter()
    .append('rect')
    .attr('class', 'bar-fail_H')
    .attr('x', d => xScale(d) + xScale.bandwidth() / 2)
    .attr('y', height)
    .attr('width', xScale.bandwidth() / 2)
    .attr('height', 0)
    .attr('fill', colorFail)
    .attr('rx', 6)
    .attr('ry', 6);

  // Add animation to the fail bars
  barsFail.transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr('y', d => yScale(healthCountsFail[d]))
    .attr('height', d => height - yScale(healthCountsFail[d]));

  // Add tooltips to the fail bars
  barsFail.append('title')
    .text(d => `Fail: ${healthCountsFail[d]}`);

  // Add value labels on top of the bars
  const labelsSucceed = svg.selectAll('.value-label-succeed_H')
    .data(healths)
    .enter()
    .append('text')
    .attr('class', 'value-label-succeed_H')
    .attr('x', d => xScale(d) + xScale.bandwidth() / 4)
    .attr('y', d => yScale(healthCountsSucceed[d]) - 5)
    .attr('text-anchor', 'middle')
    .text(d => healthCountsSucceed[d])
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', 'white');

  const labelsFail = svg.selectAll('.value-label-fail_H')
    .data(healths)
    .enter()
    .append('text')
    .attr('class', 'value-label-fail_H')
    .attr('x', d => xScale(d) + 3 * xScale.bandwidth() / 4)
    .attr('y', d => yScale(healthCountsFail[d]) - 5)
    .attr('text-anchor', 'middle')
    .text(d => healthCountsFail[d])
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', 'white');

  // Add legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 100}, 30)`);

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', colorSucceed);

  legend.append('text')
    .attr('x', 30)
    .attr('y', 12)
    .text('Success = 1')
    .style('font-size', '12px');

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 30)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', colorFail);

  legend.append('text')
    .attr('x', 30)
    .attr('y', 42)
    .text('Success = 0')
    .style('font-size', '12px');
  legend.attr('transform', `translate(${width - 100}, 1à)`);

}
