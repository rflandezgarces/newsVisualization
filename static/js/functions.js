var markerCluster=function(map,L,arreglo){
    var markers = new L.MarkerClusterGroup();
    for (var i = 0; i < arreglo.length; i++) {
        for (var j = 0; j < arreglo[i].length; j++) {
            var a = arreglo[i][j];
            var title = a.text;
            var url=a.url;
            var marker = L.marker(new L.LatLng(a.lat, a.long));
            marker.bindPopup(title+"<br><a href='"+url+"'target='_blank'>Link</a>");
            markers.addLayer(marker);
        }
    }
    map.addLayer(markers);
}

var iniciar=function(){
    var map = L.map('map').setView([41.66, -4.72], 2);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                    maxZoom: 3
    }).addTo(map); 
    markerCluster(this.map,L,all);//utiliza la funcion markercluster()
}