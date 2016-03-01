/*------------------create Map----------------------------------------------------------------*/
/*$(window).bind('beforeunload',function(){
  $.getJSON('/', {
      isReloading:"True",
   });
  $.getJSON('/home', {
      isReloading:"True",
   });
});*/
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

    markers = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    });
    for(var i=0;i<news.length;i++){
        var latLong=getLatLong(news[i]._source.countrylocation);
        marker = L.marker(new L.LatLng(latLong[0], latLong[1]));
        markers.addLayer(marker);
    }
    map.addLayer(markers);
};
createMap(newsMap);
/*------------------MouseOver Widgets----------------------------------------------------------------*/
htmlWidgetNews='<h5 style="vertical-align: middle;">Noticias Relacionadas</h5><h1 id="numNews" style="vertical-align: middle;"><center></center></h1>'//html del boton
htmlWidgetMedia='<h5 style="vertical-align: middle;">Fuentes de Noticias</h5><h1 id="numMedia" style="vertical-align: middle;"><center></center></h1>';
$( ".widgetNews" ).mouseenter(function() {
  height=$( ".widgetNews" ).height();//obtengo el alto del boton
  $(this).css( "cursor", "pointer");//le cambio el cursor al pasar por encima
  $(this).height(height);//le asigno el tamaño
  $(this).html("<h2><center><span class='glyphicon glyphicon-search' aria-hidden='true'></span></center></h2>");
});

$( ".widgetNews" ).mouseleave(function() {
   $(this).height(height);//le asigno el mismo tamaño
   $(this).html(htmlWidgetNews);//vuelvo al html antes de pasar por encima
   $( "#numNews" ).html(numNews);//lo tomo desde la funcion del timeline para actualizar el num de noticias
 });

$( ".widgetMedia" ).mouseenter(function() {
    heightMedia=$( ".widgetNews" ).height();
   $(this).css( "cursor", "pointer");
   $(this).height(heightMedia);
   $(this).html("<h2><center><span class='glyphicon glyphicon-search' aria-hidden='true'></span></center></h2>");   
 });
$( ".widgetMedia" ).mouseleave(function() {
   $(this).height(heightMedia);
   $(this).html(htmlWidgetMedia);
   $( "#numMedia" ).html(mediaNumDimensionGrouping.length);//lo tomo desde la funcion del timeline para actualizar el num de medios
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
  numNews=0;//dira cuantas noticias estan seleccionadas desde la linea de tiempo
  startSelecDate=-1;//guarda primera fecha seleccionada
  finSelectDate=0;//guarda ultima fecha seleccionada
  var lastIndex=0;//posicion de la ultima fecha +
  for(var i=0;i<newsMap.length;i++){
    var pointId = pointIds[i];
    //console.log(pointId);
    if(pointId.value > 0){
      var latLong=getLatLong(newsMap[i]._source.countrylocation);
      numNews=numNews+1;
      marker = L.marker(new L.LatLng(latLong[0], latLong[1]));
      markers.addLayer(marker);
      
      if(startSelecDate==-1){//guarda la primera ocurrencia de la fecha(fecha inicial)
        startSelecDate=i;
      }
      lastIndex=i;//guarda la ultima ocurrecia de la fecha(fecha final)
    }  
  }
  finSelecDate=lastIndex;
  map.addLayer(markers);
}

function updateWidgets(){
  newsSelected=newsMap.slice(startSelecDate,finSelecDate+1);//corta el arreglo de noticias para solo obtener las seleccionadas por la linea de tiempo
  initCrossfilterNumMedia(newsSelected);//cuenta los medios involucrados
  $( "#numNews" ).html(numNews);//actualiza el numero de noticias relacionadas del widget
  $( "#numMedia" ).html(mediaNumDimensionGrouping.length);//actualiza el numero de medios Relacionados del widget
  initCrossfilterNumLocations(newsSelected);//cuento cant de localidades
  var numLoc=locNumDimensionGrouping.length;
  $( "#numLoc" ).html(numLoc+"&nbsplocalidades relacionadas");
}

function updateDates(){
   var fechaFin=String(format.parse(newsMap[startSelecDate]._source.date.substr(0,10)));
   var fechaIni=String(format.parse(newsMap[finSelecDate]._source.date.substr(0,10)));
   if(fechaFin==fechaIni){//si es que es un solo dia
      var dateIndic=" ("+fechaIni.substr(0,15)+")";
      $( "#dateIndic" ).html(dateIndic);
   }else{//si es que es un rango de fecha
    var dateIndic=" ("+fechaIni.substr(0,15)+" - "+fechaFin.substr(0,15)+")";
      $( "#dateIndic" ).html(dateIndic);
   }
  var date=startSelecDate+"-"+finSelecDate;
   $.getJSON('/dateRange', {
      fecha:date,
      dateIndic:dateIndic,
   });
}

// Whenever the brush moves, re-render charts and map markers
function renderAll() {
  //var pointIds = dateDimensionGrouping.all();
  //console.log(pointIds);
  updateMarkers();
  updateDates();
  updateWidgets();
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
/*------------------stacked bar chart----------------------------------------------------------------------*/
/*cuenta cuantos medios estan involucrados en la noticia*/
function initCrossfilterNumMedia(news) {
  filterMedia = crossfilter(news);

  // simple dimensions and groupings for major variables
  mediaNumDimension = filterMedia.dimension(
      function(p) {
        return p._source.screen_name;
      });
  mediaNumDimensionGrouping = mediaNumDimension.group().reduceCount(
      function(p) {
        return p;
      }).all();
}

function initCrossfilterNumLocations(news) {
  filterMedia = crossfilter(news);

  // simple dimensions and groupings for major variables
  locNumDimension = filterMedia.dimension(
      function(p) {
        return p._source.countrylocation;
      });
  locNumDimensionGrouping =locNumDimension.group().reduceCount(
      function(p) {
        return p;
      }).all();
}