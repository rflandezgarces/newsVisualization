@app.route('/')
def show_index():
	actualNews=news
	return render_template('index.html', news=actualNews,busqueda=popular)#nombre para html = nombre en python

@app.route('/', methods=['POST'])
def show_index_post():
    #global userQuery
    userQuery = request.form['query']
    news=query_elastic(userQuery)
    return render_template('index.html', news=news, busqueda=userQuery)#nombre para html = nombre en python

@app.route('/newsGallery/')
def show_news():
    return render_template('newsGallery.html', news=news)#nombre para html = nombre en python


http://datamining.kelluwen.cl/#/discover?_g=(refreshInterval:(display:Off,section:0,value:0),time:(from:now-1y%2Fy,mode:quick,to:now-1y%2Fy))&_a=(columns:!(_source),index:mmchile-research,interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*sampaoli')),sort:!(fecha,desc))
http://datamining.kelluwen.cl/#/discover?_g=(refreshInterval:(display:Off,section:0,value:0),time:(from:'2015-05-23T16:17:38.543Z',mode:absolute,to:'2015-10-15T13:51:10.911Z'))&_a=(columns:!(_source),index:mmchile-research,interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*sampaoli')),sort:!(fecha,desc))