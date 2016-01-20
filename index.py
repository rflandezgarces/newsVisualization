# -*- coding: utf-8 -*-
from flask import Flask,render_template
from elasticsearch import Elasticsearch
from flask import request


app = Flask(__name__)

def query_elastic(string):
    es = Elasticsearch()
    res = es.search(index="documents_analyzed", doc_type="articles", body={"query": {"match": {"_all": string}}})
    tamano=res['hits']['total']
    res = es.search(index="documents_analyzed", doc_type="articles", body={"size" : tamano,"query": {"match": {"_all": string}}})
    res['hits']['hits']#este es un json con los datos de 0 a n
    return res['hits']['hits']

@app.route('/')
def show_news():
	string="star wars"
	news=query_elastic(string)
	return render_template('newsAnalisis.html', news=news)#nombre para html = nombre en python

if __name__ == "__main__":
      app.run(debug=True)
