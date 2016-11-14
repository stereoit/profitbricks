import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Database connectoin, to me it looks like I could do with Redis complely
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = False


# Celery configuration
# RabbitMQ for message queue and
# Redis for storing results
CELERY_BROKER_URL = 'amqp://guest@localhost'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'


#Flask-Uploads
# UPLOADS_DEFAULT_DEST=os.path.join(basedir, 'uploads')
UPLOADED_TESTFILES_DEST=os.path.join(basedir, 'uploads')
UPLOADS_DEFAULT_URL='/uploads'

#Normal Flask uploads
UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
