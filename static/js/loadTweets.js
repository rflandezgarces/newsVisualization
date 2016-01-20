var politica=[];
var deportes=[];
var economia=[];
var judicial=[];
var salud=[];
var tecnologia=[];
var ecologia=[];
var entretenimiento=[];
var accidentes=[];
var obituario=[];
var sociedad=[];
var all=[];
var total=0;
var noticia = function (date,autor,title,text,url,topic,lat,long) {
    this.date=date;
    this.autor=autor;
    this.title=title;
    this.text=text;
    this.url=url;
    this.topic=topic;
    this.lat=lat;
    this.long=long;
};
$.getJSON( "news.json", function( data ) {    
    $.each( data, function(d,e) {
        total=total+1;
        var date=e._source.date;
        var autor=e._source.screen_name;
        var title=e._source.title;
        var text=e._source.tweet_text;
        var url=e._source.url;
        var topic=e._source.topic;

        var ubicacion=e._source.countrylocation;
        var l=ubicacion.length;
        var index=ubicacion.indexOf(",");
        var sLat=ubicacion.substr(0,index);
        var sLong=ubicacion.substr(index+1,l-1);
        var lat=parseFloat(sLat);
        var long=parseFloat(sLong);

        var news=new noticia(date,autor,title,text,url,topic,lat,long);
        if(topic=="politica"){
            politica.push(news);
        }
        if(topic=="deportes"){
            deportes.push(news);
        }
        if(topic=="economia"){
            economia.push(news);
        }
        if(topic=="judicial"){
            judicial.push(news);
        }
        if(topic=="salud"){
            salud.push(news);
        }
        if(topic=="tecnologia"){
            tecnologia.push(news);
        }
        if(topic=="ecologia"){
            ecologia.push(news);
        }
        if(topic=="entretenimiento"){
            entretenimiento.push(news);
        }
        if(topic=="accidentes"){
            accidentes.push(news);
        }
        if(topic=="obituario"){
            obituario.push(news);
        }
        if(topic=="sociedad"){
            sociedad.push(news);
        }
    });
    all.push(politica);
    all.push(deportes);
    all.push(economia);
    all.push(judicial);
    all.push(salud);
    all.push(tecnologia);
    all.push(ecologia);
    all.push(entretenimiento);
    all.push(accidentes);
    all.push(obituario);
    all.push(sociedad);
    iniciar();
});