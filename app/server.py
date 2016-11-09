from flask import Flask, jsonify, abort, request
from flask_script import Manager


app = Flask(__name__)
app.config.from_pyfile('config.py')

# initialize models
from models import db

# register API endpoints
from api import api_manager

manager = Manager(app)

def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PATCH, PUT, OPTIONS, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response

app.after_request(add_cors_header)

if __name__ == '__main__':
	manager.run()
