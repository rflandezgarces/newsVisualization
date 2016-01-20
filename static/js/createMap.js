/*var getLatLong=function(latLong){
    var l=latLong.length;
    var index=latLong.indexOf(",");
    var sLat=latLong.substr(0,index);
    var sLong=latLong.substr(index+1,l-1);
    var lat=parseFloat(sLat);
    var long=parseFloat(sLong);
    var latLong=[lat,long];
    return latLong;
}

var startMap=function(newsMap){
    map = L.map('map').setView([41.66, -4.72], 1);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    markers = new L.MarkerClusterGroup();
    for (var i = 0; i < newsMap.length; i++) {
        for (var j = 0; j < newsMap[i].length; j++) {
            var a = newsMap[i][j];
            var title = a.text;
            var url=a.url;
            marker = L.marker(new L.LatLng(a.lat, a.long));
            marker.bindPopup(title+"<br><a href='"+url+"'target='_blank'>Link</a>");
            markers.addLayer(marker);
        }
    }
    //$( "#all" ).prop( "checked", true );
    map.addLayer(markers);
}*/

