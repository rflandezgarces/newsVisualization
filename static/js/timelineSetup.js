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

var fechaIni;//fecha de inicio del grafico
var fechaFin;//fecha de termino del grafico

var ini;
var fin;

var width = 700;
var height = 400;
var padding = 100;
var format = d3.time.format("%Y-%m-%d");


function init() {
  initCrossfilter();

  idDimension = filter.dimension(function(p, i) { return i; });
  idGrouping = idDimension.group(function(id) { return id; });

  renderAll();
}

function getDates(){
  indexFinalDate=newsMap.length-1;
  fechaIni=format.parse(newsMap[0]._source.date.substr(0,10));
  fechaFin=format.parse(newsMap[indexFinalDate]._source.date.substr(0,10));

}

function initCrossfilter() {
  filter = crossfilter(newsMap);

  // simple dimensions and groupings for major variables
  dateDimension = filter.dimension(
      function(p) {return format.parse(p._source.date.substr(0,10));
      });
  dateDimensionGrouping = dateDimension.group(
      function(v) {
        return v;
      });

  getDates();
  // initialize charts (helper function in chart.js)
  // taken directly from crossfilter's example
  charts = [
    barChart()
      .dimension(dateDimension)
      .group(dateDimensionGrouping)
      .x(d3.scale.linear()
          .domain([fechaFin,fechaIni])
          .rangeRound([padding, width - padding * 2]))
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

function updateMarkers() {
  markers.clearLayers();//borro todo del mapa
  var pointIds = idGrouping.all();//obtengo ids y values(1 o 0) para ver cual mostrar o no
  for(var i=0;i<newsMap.length;i++){
    var pointId = pointIds[i];
    //console.log(pointId);
    if(pointId.value > 0){
      var latLong=getLatLong(newsMap[i]._source.countrylocation);
      marker = L.marker(new L.LatLng(latLong[0], latLong[1]));
      markers.addLayer(marker);
    }   
  }
  map.addLayer(markers);
}

// Whenever the brush moves, re-render charts and map markers
function renderAll() {
  //var pointIds = dateDimensionGrouping.all();
  //console.log(pointIds);
  updateMarkers();
  updateCharts();
}

// Reset a particular histogram
window.reset = function(i) {
  charts[i].filter(null);
  renderAll();
};
