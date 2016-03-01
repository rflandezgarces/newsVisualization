# -*- coding: utf-8 -*-
from flask import Flask,render_template
from elasticsearch import Elasticsearch
from flask import request
import json

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

def date_range():#selecciona solo las noticias del rango seleccionado en el timeline
    fecha=str(request.args.get('fecha'))#obtiene el rango seleccionado en el timeline
    global dateIndic
    dateIndic=str(request.args.get('dateIndic'))#obtine la fecha del indicador superior
    #manejo de cadenas para obtener los datos recibidos
    pos=fecha.index('-')
    l=len(fecha)
    fechaInicio=int(fecha[0:pos])
    fechaFinal=int(fecha[pos+1:l])
    global selecNews#defino como global para que show_news() lo pueda ocupar
    selecNews=news[fechaInicio:fechaFinal+1]#corto el arreglo de noticias segun lo seleccionado

@app.route('/')#pantalla de inicia que siempre muestra la busqueda definida por el servidor
def show_index():
    popular_term() #para que no quede guardada la busqueda anterior al re renderizar el template
    return render_template('index.html', news=news,busqueda=term)#nombre para html = nombre en python

@app.route('/home')#pantalla de inicia que muestra la busqueda del usuario
def show_home():
    #popular_term() #serviria para que no quede guardada la busqueda anterior al recargar
    return render_template('index.html', news=news,busqueda=term)#nombre para html = nombre en python

@app.route('/dateRange/')
def show_date():#recibe la actualizacion de las fechas seleccionadas por el usuario
    date_range()#se ejecuta y crea las variables necesarias

@app.route('/newsGallery/')
def show_news():
    return render_template('newsGallery.html', news=selecNews, busqueda=term,dateIndic=dateIndic)#nombre para html = nombre en python

@app.route('/mediaInfo/')
def show_media_info():
    return render_template('mediaInfo.html', news=selecNews, busqueda=term,dateIndic=dateIndic)#nombre para html = nombre en python

@app.route('/', methods=['POST'])
def show_index_post():
    #actualizo variables globales para que show_index muestre lo correcto.
    global term
    term = request.form['query']
    global news
    news=query_elastic(term)
    return show_home()
    #return render_template('index.html', news=news, busqueda=term)#nombre para html = nombre en python


if __name__ == "__main__":
      app.run(debug=True)