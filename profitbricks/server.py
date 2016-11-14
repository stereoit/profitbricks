from flask_script import Manager, Server
from profitbricks import app
from flask import url_for

# initialize models
from profitbricks.models import db

# register API endpoints
import profitbricks.api

manager = Manager(app)

# setup '/api/testrunner/<task_id>' route
import profitbricks.testrunner.api

# setup '/newTestrunform' route
import profitbricks.upload

# add runserver command
manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    threaded = True,
    host = app.config['ADDRESS'],
    port = app.config['PORT'])
)

# helper command to show registered routes
@manager.command
def list_routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)
        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        line = urllib.parse.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, url))
        output.append(line)
    for line in sorted(output):
        print(line)

if __name__ == '__main__':
	manager.run()
