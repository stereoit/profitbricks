from flask import jsonify
from profitbricks import app
from profitbricks.models import TestRun
from . import test_runner


@app.route('/api/testrunners/<task_id>')
def taskstatus(task_id):
    '''
    taskstatus view creates dynamic api endpoint to view state of celery tasks
    '''
    task = test_runner.AsyncResult(task_id)
    return jsonify({
        "id": task.id,
        "state": task.state,
        "failed": task.failed(),
        "finished": task.ready(),
         "info": "" if task.failed() else task.info
    })
    return jsonify(response)
