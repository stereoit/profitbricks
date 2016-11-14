import os
import encodings.idna
import random
import time
import tempfile
import shutil
import requests
import subprocess


from celery import Celery
from celery.signals import worker_init
from flask import jsonify

from profitbricks import app
from profitbricks.models import db, TestRun

celery = Celery(
    app.name,
    broker=app.config['CELERY_BROKER_URL'],
    result_persistent=True
)
celery.conf.update(app.config) # this takes care of `backend`

# take testrun_id, read it's data, execute and store back results
@celery.task(bind=True)
def test_runner(self, testrun_id):
    testrun = TestRun.query.get(testrun_id)
    server_url = 'http://localhost:5000/_uploads/testfiles/' #hardcoded for now

    if testrun is None:
        return { 'status': 'Failed', 'error': "TestRun not found"}

    testrun.status = 'RUNNIG'
    db.session.add(testrun)
    db.session.commit()

    self.update_state(
        state='PROGRESS',
        meta={
            'testrun_id': testrun_id,
            'status': "Downloading and executing test files"
        },
    )

    testrun_status = "SUCCESS"
    for testfile in testrun.testfiles.all():
        tmpdir = tempfile.mkdtemp()
        filename = testfile.url.split('/')[1]
        filepath = os.path.join(tmpdir,filename)

        r = requests.get(server_url + testfile.url)
        if r.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in r:
                    f.write(chunk)
        else:
            testrun.status = 'FAILED'
            db.session.add(testrun)
            db.session.commit()
            return { 'status': 'File not found!' + testfile.url}

        #run using pytest
        proc = subprocess.Popen(["/usr/bin/env", "pytest", filepath], stdout=subprocess.PIPE, shell=False)
        (out, err) = proc.communicate()

        if proc.returncode:
            testrun_status = 'FAILED'

        #update the Testrun model
        testrun.results += """
        Tested: {}
        Result: {}
        Stdout: {}
        Stderr:  {}
        ========================================================================


        """.format(filename, proc.returncode and "FAIL" or "SUCCESS" , out, err)
        # shutil.rmtree(tmpdir)

    #update the state of the TestRun
    testrun.status = testrun_status
    db.session.add(testrun)
    db.session.commit()

    return {'status': testrun.status}


def start_testrunner(testrun_id):
	'''
	Start new testrunner, returls async id
	'''
	testrun = TestRun.query.get(testrun_id)
	if testrun is None:
		return #something happened, we do not have object in db

	#let's add few seconds delay to simulate machine load
	task = test_runner.apply_async(args=[testrun.id], countdown=5)

	# store back to DB the session task
	testrun.testrunner_id = task.id
	db.session.add(testrun)
	db.session.commit()

	return task
