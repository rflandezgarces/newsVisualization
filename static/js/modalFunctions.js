var modal=function(news){
    var calendarIcon="<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span>";
    var words=[];
    var keywords=news.keywords;//obtengo las keywords
    for (var i in keywords) {
        var word={text: keywords[i].keyword, weight: i};
        words[i]=word;
    }
    //crear mapa y luego agregar el icono cada vez
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
        var map = L.map('newsMap').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var latLong=getLatLong(news.countrylocation);
        console.log(latLong);
        var marker = L.marker(latLong).addTo(map);
    };
    createMap(news);
    $("#newsWordCloud").jQCloud(words);
    $("#modalTitle").html(news.title);
    $("#modalDate").html(calendarIcon+news.date);
    $("#modalLocation").html(news.cityame+", "+news.countryname);
    $("#modalTopic").html(news.topic);
    $("#newsText").html(news.article_text);
    $("#myModal").modal();

}