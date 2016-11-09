from flask_script import Manager, Server
from app import app

# initialize models
from models import db

# register API endpoints
from api import api_manager

manager = Manager(app)

# setup '/api/testrunner/<task_id>' route
import testrunner.api

manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    threaded = True,
    host = '0.0.0.0')
)

if __name__ == '__main__':
	manager.run()
