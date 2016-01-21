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
    map = L.map('map').setView([41.66, -4.72], 1);
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