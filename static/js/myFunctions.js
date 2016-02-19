/*------------------create Map----------------------------------------------------------------*/
var getLatLong=function(countryLoc){
    var l=countryLoc.length;
    var index=countryLoc.indexOf(",");
    var sLat=countryLoc.substr(0,index);
    var sLong=countryLoc.substr(index+1,l-1);
    var lat=parseFloat(sLat);
    var long=parseFloat(sLong);
    var latLong=[lat,long];
    return latLong;
}
var createMap=function(news){
    map = L.map('map', { zoomControl:false }).setView([41.66, -4.72], 1);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 1,
        minZoom:1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    markers = new L.MarkerClusterGroup();
    for(var i=0;i<news.length;i++){
        var latLong=getLatLong(news[i]._source.countrylocation);
        marker = L.marker(new L.LatLng(latLong[0], latLong[1]));
        markers.addLayer(marker);
    }
    map.addLayer(markers);
};

createMap(newsMap);
/*------------------MouseOver Widgets----------------------------------------------------------------*/
var c=0;
var c2=0;
var c3=0;
$( ".widgetNews" ).mouseenter(function() {
   if(c==0){
    htmlWidget=$( ".widgetNews" ).html();
   }
   $(this).css("background","#8B0000");
   $(this).css( "cursor", "pointer");
   $(this).html("<p>View Detail&nbsp<span class='glyphicon glyphicon-circle-arrow-right'></span></p>");
   $("#vDetail1").hide();
   $("#vDetail1").fadeIn("slow");
   c=1;
});
$( ".widgetNews" ).mouseleave(function() {
   $(this).css("background","#DC143C");
   $(this).html(htmlWidget);
   //$(".widgetText1").hide();
   //$(".widgetText1").fadeIn("slow");
   //$(".widgetIcon1").hide();
   //$(".widgetIcon1").fadeIn("slow");

 });

$( ".widgetMedia" ).mouseenter(function() {
   if(c2==0){
    htmlWidget2=$( ".widgetMedia" ).html();
   }
   $(this).css("background","#348fe2");
   $(this).css( "cursor", "pointer");
   $(this).html("<p>View Detail&nbsp<span class='glyphicon glyphicon-circle-arrow-right'></span></p>");
   $("#vDetail2").hide();
   $("#vDetail2").fadeIn("slow");
   c2=1;   
 });
$( ".widgetMedia" ).mouseleave(function() {
   $(this).css("background","#348fe2");
   $(this).html(htmlWidget2);
   //$(".widgetText2").hide();
   //$(".widgetText2").fadeIn("slow");
   //$(".widgetIcon2").hide();
   //$(".widgetIcon2").fadeIn("slow");
 });
/*$( ".map" ).mouseenter(function() {
   $(this).fadeTo("fast" , 0.6);
   $(this).css( "cursor", "pointer" );
 });
$( ".map" ).mouseleave(function() {
   $(this).fadeTo("fast" , 1);
 });*/
/*------------------timeline----------------------------------------------------------------------*/
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

var width = 1100;
var height = 200;
var padding = 60;//originalmente era 100...60 es perfecto
var format = d3.time.format("%Y-%m-%d");


function init() {
  initCrossfilter();

  idDimension = filter.dimension(function(p, i) { return i; });
  idGrouping = idDimension.group(function(id) { return id; });

  renderAll();
}

function getDates(){
  indexFinalDate=newsMap.length-1;
  fechaIni=format.parse(newsMap[indexFinalDate]._source.date.substr(0,10));
  fechaFin=format.parse(newsMap[0]._source.date.substr(0,10));
  fechaFin=d3.time.day.offset(fechaFin,1);//sumo 1 dia para que el grafico muestre hasta el dia anterior
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
      .x(d3.time.scale()
          .domain([fechaIni,fechaFin])
          .range([padding, width - padding * 2]))
  ];

  // bind charts to dom
  domCharts = d3.selectAll(".chart")
      .data(charts)
      //.each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });...on brushend actualiza el mapa y los datos solo cuando se suelta el brush; on brush actualiza mientras se arrastra y con gran cantidad de datos se pega la animacion de arrastrar 
      .each(function(chart) { chart.on("brushend", renderAll); });
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
/*------------------news Modal----------------------------------------------------------------------*/
/*function modal(news){
    var calendarIcon="<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span>";
    var words=[];
    var keywords=news.keywords;//obtengo las keywords
    for (var i in keywords) {
        var word={text: keywords[i].keyword, weight: i};
        words[i]=word;
    }
    console.log(words);
    $("#newsWordCloud").jQCloud(words);
    $("#modalTitle").html(news.title);
    $("#modalDate").html(calendarIcon+news.date);
    $("#modalLocation").html(news.cityame+", "+news.countryname);
    $("#modalTopic").html(news.topic);
    $("#newsText").html(news.article_text);
    $("#myModal").modal();

}*/
/*creo un nuevo mapa para cada noticia*/

/*esto se realizara al pinchar una noticia*/       
// function modal(news){
//   $("#myModal").modal();//abre el modal
//   $("#myModal").on('shown.bs.modal', function (e) {//cuando el modal ya se ha abierto hacer...
//     var calendarIcon="<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span>";//icono calendario
//     /*MAPA*/
//     var latLong=getLatLong(news.countrylocation);//lat y long de la noticia
//     if(typeof map2=='undefined'){//para que solo defina una vez el mapa
//       map2= L.map('newsMap', { zoomControl:false });
//       L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 5,
//         minZoom:5,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//       }).addTo(map2);
//       map2.setView(latLong, 5);
//       L.marker(latLong).addTo(map2);
//     }else{
//       map2.setView(latLong, 5);
//       L.marker(latLong).addTo(map2);
//     }
//     /*wordcloud*/
//     var words=[];
//     var keywords=news.keywords;//obtengo las keywords
//     console.log();
//     for (var i in keywords) {
//       var word={text: keywords[i].keyword, weight: keywords[i].relevancy};
//       console.log(word);
//       words[i]=word;
//     }
//     console.log("salio..........................................................");
//     $("#modalTitle").html(news.title);
//     $("#modalDate").html(calendarIcon+news.date);
//     $("#modalLocation").html(news.cityame+", "+news.countryname);
//     $("#modalTopic").html(news.topic);
//     $("#newsText").html(news.article_text);
//     //console.log(words);
//     codigo=$("#newsWordCloud").jQCloud(words);
//     $("#newsWordCloud").jQCloud(words);
//   }) 
// }
function makeWordCloud(news){
  var words=[];
  var keywords=news.keywords;//obtengo las keywords
  for (var i in keywords) {
  var word={text: keywords[i].keyword, weight: keywords[i].relevancy};
    words[i]=word;
  }
  $("#word").empty();
  $("#word").html('<div id="newsWordCloud"></div>');
  $("#newsWordCloud").jQCloud(words);
}
var map2;
function makeMap(news){
  var latLong=getLatLong(news.countrylocation);//lat y long de la noticia
  if(typeof map2=='undefined'){//para que solo defina una vez el mapa
    map2= L.map('newsMap', { zoomControl:false });
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 5,
      minZoom:5,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2);
    map2.setView(latLong, 5);
    L.marker(latLong).addTo(map2);
    }else{
      map2.setView(latLong, 5);
      L.marker(latLong).addTo(map2);
  }
}
function newsInfo(news){
  var calendarIcon="<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span>";//icono calendario
  $("#modalTitle").html(news.title);
  $("#modalDate").html(calendarIcon+"Fecha: "+news.date);
  $("#modalLocation").html(news.cityame+", "+news.countryname);
  $("#modalTopic").html("Categoria: "+news.topic);
  $("#newsText").html(news.article_text);
}
function modal(news){
  /*variables*/
  var calendarIcon="<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span>";//icono calendario
  $("#myModal").modal();//muestro modal
  $("#myModal").on('shown.bs.modal', function (e) {
    makeWordCloud(news)
    makeMap(news);
    newsInfo(news);
    $(this).off('shown.bs.modal');
  })
}
