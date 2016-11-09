import encodings.idna
import random
import time
from celery import Celery
from celery.signals import worker_init
from app import app

celery = Celery(
    app.name,
    broker=app.config['CELERY_BROKER_URL'],
    result_persistent=True
)
celery.conf.update(app.config) # this takes care of `backend`



#tst value for init_connect signal
db_conn = None

# I might replace this with the app context
# @worker_init.connect
# def init_worker(**kwargs):
#     global db_conn
#     print("Initializing database connection for worker.")
    # db_conn = "SOMEDB"


# version with app context
# take testrun_id, read it's data, execute and store back results
@celery.task
def test_runner(testrun_id):
    """Background task to proces given Testrun."""
    with app.app_context():
        print("Processing ", testrun_id)
        return True


#I can used this as a sample pytest
@celery.task(bind=True)
def long_task(self):
    """Background task that runs a long function with progress reports."""
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
        self.update_state(state='PROGRESS',
                          meta={'current': i, 'total': total,
                                'status': message})
        time.sleep(1)
    return {'current': 100, 'total': 100, 'status': 'Task completed!',
            'result': 42}
