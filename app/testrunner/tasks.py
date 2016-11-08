from celery import Celery
from celery.signals import worker_init

app = Celery('tasks', backend='rpc://', broker='amqp://guest@localhost')

db_conn = None

@worker_init.connect
def init_worker(**kwargs):
    global db_conn
    print("Initializing database connection for worker.")
    db_conn = "SOMEDB"

@app.task
def add(x, y):
    print(db_conn)
    return x + y
