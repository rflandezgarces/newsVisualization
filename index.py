# -*- coding: utf-8 -*-
from flask import Flask,render_template
from elasticsearch import Elasticsearch
from flask import request


app = Flask(__name__)

def query_elastic(string):
    es = Elasticsearch()
    res = es.search(index="documents_analyzed", doc_type="articles", body={"query": {"match": {"_all": string}}})
    tamano=res['hits']['total']
    res = es.search(index="documents_analyzed", doc_type="articles", body={"size" : tamano,"query": {"match": {"_all": string}},"sort": { "date": { "order": "desc" }}})
    res['hits']['hits']#este es un json con los datos de 0 a n
    return res['hits']['hits']

def popular_term():
    #obtener el temino o frase mas importante en le dia
    #por motivos de prueba se usara star wars
    global term
    term="star wars"#termino que se busca
    #se buscara este termino en elastic y se devolveran las noticias relacionadas para mostrar
    global news
    news=query_elastic(term)#noticias de la busqueda

popular_term()#ejecuto la funcion para llenar term y news al inicio

@app.route('/')
def show_index():
    return render_template('index.html', news=news,busqueda=term)#nombre para html = nombre en python

@app.route('/newsGallery/')
def show_news():
    return render_template('newsGallery.html', news=news)#nombre para html = nombre en python

@app.route('/', methods=['POST'])
def show_index_post():
    #actualizo variables globales para que show_index muestre lo correcto.
    global term
    term = request.form['query']
    global news
    news=query_elastic(term)
    return render_template('index.html', news=news, busqueda=term)#nombre para html = nombre en python


if __name__ == "__main__":
      app.run(debug=True)
