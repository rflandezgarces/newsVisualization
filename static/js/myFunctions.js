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
        maxZoom: 19,
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
   $(this).html("<p id='vDetail1'>View Detail&nbsp<span class='glyphicon glyphicon-circle-arrow-right'></span></p>");
   $("#vDetail1").hide();
   $("#vDetail1").fadeIn("slow");
   c=1;
});
$( ".widgetNews" ).mouseleave(function() {
   $(this).css("background","#DC143C");
   $(this).html(htmlWidget);
   $(".widgetText1").hide();
   $(".widgetText1").fadeIn("slow");
   $(".widgetIcon1").hide();
   $(".widgetIcon1").fadeIn("slow");

 });
$( ".widgetNews" ).click(function() {
  console.log("shit");

 });
$( ".widgetMedia" ).mouseenter(function() {
   if(c2==0){
    htmlWidget2=$( ".widgetMedia" ).html();
   }
   $(this).css("background","#348fe2");
   $(this).css( "cursor", "pointer");
   $(this).html("<p id='vDetail2'>View Detail&nbsp<span class='glyphicon glyphicon-circle-arrow-right'></span></p>");
   $("#vDetail2").hide();
   $("#vDetail2").fadeIn("slow");
   c2=1;   
 });
$( ".widgetMedia" ).mouseleave(function() {
   $(this).css("background","#348fe2");
   $(this).html(htmlWidget2);
   $(".widgetText2").hide();
   $(".widgetText2").fadeIn("slow");
   $(".widgetIcon2").hide();
   $(".widgetIcon2").fadeIn("slow");
 });
/*$( ".map" ).mouseenter(function() {
   $(this).fadeTo("fast" , 0.6);
   $(this).css( "cursor", "pointer" );
 });
$( ".map" ).mouseleave(function() {
   $(this).fadeTo("fast" , 1);
 });*/
/*------------------news Gallery----------------------------------------------------------------*/
/*var createModal=function(){
  //obtener id del pinchado
  //ir a ese en el arreglo
  //mostrar esa infromacion
  console.log("sdfsdfsdf");
}
createModal(news);*/
// onclick="$('#myModal').modal('show')
$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-v.json&callback=?', function (data) {

        // create the chart
        $('#container').highcharts('StockChart', {
            chart: {
                alignTicks: true,
                height:300
            },

            rangeSelector: {
                selected: 1
            },

            series: [{
                type: 'column',
                name: 'AAPL Stock Volume',
                data: data,
                dataGrouping: {
                    units: [[
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]]
                }
            }]
        });
    });
});