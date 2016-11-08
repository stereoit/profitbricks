from celery import Celery
from celery.signals import worker_init

celery = Celery('tasks', backend='rpc://', broker='amqp://guest@localhost')

db_conn = None

# I might replace this with the app context
# @worker_init.connect
# def init_worker(**kwargs):
#     global db_conn
#     print("Initializing database connection for worker.")
    # db_conn = "SOMEDB"


# version with app context
@celery.task
def test_runner(testrun_id):
    """Background task to proces given Testrun."""
    with app.app_context():
        print("Processing ", testrun_id)
        return True