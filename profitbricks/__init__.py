from flask import Flask, render_template, send_from_directory
import jinja2

app = Flask(__name__)
app.config.from_pyfile('config.py')

#setup our custom template loaders
app.jinja_loader = jinja2.ChoiceLoader([
    app.jinja_loader,
    jinja2.FileSystemLoader([app.config['DIST_PATH']]),
])

# loose CORS protection
def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PATCH, PUT, OPTIONS, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response

app.after_request(add_cors_header)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if path == '':
        path = 'index.html'

    #quick hack for SPA
    if ('bundle' in path) or ('css' in path):
        return send_from_directory(app.config['DIST_PATH'], path)
        
    return render_template('index.html')
