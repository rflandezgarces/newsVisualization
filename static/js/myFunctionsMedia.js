/*cuenta cuantas noticias por medio se realizan al dia*/
function initCrossfilterBarChart(news) {
  filterMedia = crossfilter(news);
  //cuento cantidad de ocurrencias de un medio por fecha
  numPerDateDimension = filterMedia.dimension(
    function(p) {
      var data=p._source.screen_name+";"+p._source.date.substr(0,10);
      return data;     
    });
  numPerDateDimensionGrouping = numPerDateDimension.group();
  
  //lista de fechas a utilizar
  filterMediaChart = crossfilter(news);
  dateChartDimension = filterMediaChart.dimension(
      function(p) {return p._source.date.substr(0,10);
      });
  dateChartDimensionGrouping = dateChartDimension.group(
      function(v) {
        return v;
      });
  //arreglos para el grafico...
  //armo las categorias(fechas) para el eje x del grafico
  categories=[];
  for(var i in dateChartDimensionGrouping.all()){
    categories[i]=String(dateChartDimensionGrouping.all()[i].key);
  }

  //armo la cantidad de medios por dia en un arreglo
  series=[];//arreglo que contiene medio y cantidad por fecha
  var data=numPerDateDimensionGrouping.all()[0].key;
  var l=data.length;
  var medioAnt=data.substr(0,l-11);//obtengo nombre medio
  var fecha=data.substr(l-10,l);//obtengo fecha
  var cantData=numPerDateDimensionGrouping.all()[i].value;//obtengo cantidad
  var posFecha=categories.indexOf(fecha);//busco la posicion de la fecha en el arreglo de fechas
  var cantFechas=categories.length;
  var lenFecha=categories.length;
  var fechas=new Array(lenFecha);//arreglo de fechas y cantidad por medio
  fechas.fill(null);//relleno de null
  fechas[posFecha]=cantData;//asigno la cantidad a esa fecha correspondiente con la posicion del arreglo de fechas
  c=0;
  if(l==1){//cuando el arreglo de medios sea de largo 1
    dataChart={name:medioAnt,data:fechas};
    series[c]=dataChart;
  }
  numPerDateDimensionGrouping=numPerDateDimensionGrouping.all().slice(1);//corto el cero porque ya lo ocupe
  //numPerDateDimensionGrouping pasa a ser arreglo y no ocupa all()
  for(var i in numPerDateDimensionGrouping){
    data=numPerDateDimensionGrouping[i].key;
    l=data.length;
    medioSig=data.substr(0,l-11);//obtengo nombre medio
    if(medioAnt==medioSig){
        fecha=data.substr(l-10,l);//obtengo fecha
        cantData=numPerDateDimensionGrouping[i].value;//obtengo cantidad
        posFecha=categories.indexOf(fecha);//busco la posicion de la fecha en el arreglo de fechas
        fechas[posFecha]=cantData;//asigno la cantidad a esa fecha correspondiente con la posicion del arreglo de fechas
        medioAnt=medioSig;
    }else{
      dataChart={name:medioAnt,data:fechas};
      series[c]=dataChart;
      fechas=new Array(lenFecha);//redefino para reiniciar el arreglo
      fechas.fill(null);//relleno de null

      fecha=data.substr(l-10,l);//obtengo fecha
      cantData=numPerDateDimensionGrouping[i].value;//obtengo cantidad
      posFecha=categories.indexOf(fecha);//busco la posicion de la fecha en el arreglo de fechas
      fechas[posFecha]=cantData;//asigno la cantidad a esa fecha correspondiente con la posicion del arreglo de fechas
      medioAnt=medioSig;
      
      c++;
    }
  }
  dataChart={name:medioAnt,data:fechas};
  series[c]=dataChart;
  //funcion que dibuja el grafico en base a categories[] y series[]
  $(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Number Of Media Publications per Day'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total News Related'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'bottom',
            y: 25,
            floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                borderWidth: 0,
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: series
    });
  });
}
initCrossfilterBarChart(newsMedia);//ejecuto funcion