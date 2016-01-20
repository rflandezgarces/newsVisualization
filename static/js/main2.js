$( document ).ready(function() {
    $('.collapse').collapse();
    $('.dropdown-toggle').dropdown();
    
    var countChecked = function() {
        $(".leaflet-objects-pane").remove();//elimina los marcadores actuales en el mapa
        //markerCluster(map,L,politica);
    };
    countChecked();

    $( "input[id=showPolitics]" ).on( "click", countChecked );
});