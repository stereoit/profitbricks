import os
from flask import request, jsonify
from flask_uploads import UploadSet, configure_uploads

from profitbricks import app
from profitbricks.models import db, TestRun, TestRunFile
from profitbricks.testrunner import start_testrunner

test_files = photos = UploadSet('testfiles', extensions='py')
configure_uploads(app, test_files)

ALLOWED_EXTENSIONS = set(['py',])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# validation of username on server side missing
@app.route('/newTestrun', methods=['POST'])
def newTestRun():
    if request.method == 'POST':
        username = request.form['username']
        testrun = TestRun(username=username)
        db.session.add(testrun)
        db.session.commit()

        for file in request.files.getlist('files[]'):
            if file and allowed_file(file.filename):
                filename = test_files.save(file, folder=str(testrun.id))
                testrunfile = TestRunFile(url=filename, testrun_id=testrun.id)
                db.session.add(testrunfile)
                db.session.commit()

        start_testrunner(testrun.id)
        
        return jsonify({"message":"Testrun created"})

    return jsonify({"error": "only POST here"}), 405
