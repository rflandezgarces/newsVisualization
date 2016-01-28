var filter;
var val1Dimension;
var val1Grouping;
var val2Dimension;
var val2Grouping;
var charts;
var domCharts;

var latDimension;
var lngDimension;
var idDimension;
var idGrouping;

function init() {
  initCrossfilter();
  renderAll();
}


function initCrossfilter() {
  filter = crossfilter(points);

  // simple dimensions and groupings for major variables
  val2Dimension = filter.dimension(
      function(p) {
        return p.val2;
      });
  val2Grouping = val2Dimension.group(
      function(v) {
        return Math.floor(v / 25) * 25;
      });

  // initialize charts (helper function in chart.js)
  // taken directly from crossfilter's example
  charts = [
    barChart()
      .dimension(val2Dimension)
      .group(val2Grouping)
      .x(d3.scale.linear()
          .domain([0, 1000])
          .rangeRound([0, 40 * 10]))
      .filter([75, 525])
  ];

  // bind charts to dom
  domCharts = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });
}

// Renders the specified chart
function render(method) {
  d3.select(this).call(method);
}

// Renders all of the charts
function updateCharts() {
  domCharts.each(render);
}


// Whenever the brush moves, re-render charts and map markers
function renderAll() {
  updateCharts();
}

// Reset a particular histogram
window.reset = function(i) {
  charts[i].filter(null);
  renderAll();
};
