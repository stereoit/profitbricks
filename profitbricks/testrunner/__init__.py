import encodings.idna
import random
import time

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
    """
    Background task to proces given Testrun.

    It will connect to DB, read Testrun data and download files
    Process this files.
    Store back the results/exception

    For simplicity yet I am returning simple value.
    """
    testrun = TestRun.query.get(testrun_id)

    if testrun is None:
        return { 'status': 'Failed', 'error': "TestRun not found"}

    testrun.status = 'RUNNIG'
    db.session.add(testrun)
    db.session.commit()

    verb = ['Starting up', 'Booting', 'Repairing', 'Loading', 'Checking']
    adjective = ['master', 'radiant', 'silent', 'harmonic', 'fast']
    noun = ['solar array', 'particle reshaper', 'cosmic ray', 'orbiter', 'bit']
    message = ''
    total = random.randint(10, 50)
    for i in range(total):
        if not message or random.random() < 0.25:
            message = '{0} {1} {2}...'.format(random.choice(verb),
                                              random.choice(adjective),
                                              random.choice(noun))
        self.update_state(
            state='PROGRESS',
            meta={
                'testrun_id': testrun_id,
                'current': i,
                'total': total,
                'status': message
            },
        )
        time.sleep(1)

    #update the state of the TestRun
    testrun.status = 'SUCCESS'
    db.session.add(testrun)
    db.session.commit()

    return {'current': 100, 'total': 100, 'status': 'Task completed!', 'result': 42}


def start_testrunner(testrun_id):
	'''
	Start new testrunner, returls async id
	'''
	testrun = TestRun.query.get(testrun_id)
	if testrun is None:
		return #something happened, we do not have object in db

	#let's add 20 seconds delay to simulate some load
	task = test_runner.apply_async(args=[testrun.id], countdown=20)

	# store back to DB the session task
	testrun.testrunner_id = task.id
	db.session.add(testrun)
	db.session.commit()

	return task
