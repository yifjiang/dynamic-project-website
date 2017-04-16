import pymysql
import pymysql.cursors
import config
import hashlib
import uuid
from flask import session

urlPrefix = '/yifjiang_screening'
algorithm = 'sha512'

def connect_to_database():
  options = {
    'host': config.env['host'],
    'user': config.env['user'],
    'passwd': config.env['password'],
    'db': config.env['db'],
    'cursorclass' : pymysql.cursors.DictCursor
  }
  db = pymysql.connect(**options)
  db.autocommit(True)
  return db

db = connect_to_database()
def fetchResult(command):
  cur = db.cursor()
  cur.execute(command) 
  return cur.fetchall()

def hashPassword(password):
  salt = uuid.uuid4().hex
  m = hashlib.new(algorithm)
  m.update(str(salt+password).encode('utf-8'))
  password_hash = m.hexdigest()
  return '$'.join([algorithm, salt, password_hash])

def configureOptionForUser(options):
  options['urlPrefix'] = urlPrefix
  if 'username' in session:
        options['loggedIn'] = True
        username = session['username']
        options['username'] = username
        user = fetchResult('SELECT firstname, lastname FROM user WHERE username = "{}"'.format(username))[0]
        options['user'] = user
  return options
