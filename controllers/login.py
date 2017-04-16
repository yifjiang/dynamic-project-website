from flask import *
import hashlib

from extensions import urlPrefix
from extensions import fetchResult
from extensions import hashPassword
from extensions import configureOptionForUser

def rehash(password, hashed):
	splited = str(hashed).split('$')
	algorithm = splited[0]
	salt = splited[1]
	m = hashlib.new(algorithm)
	m.update(str(salt+password).encode('utf-8'))
	password_hash = m.hexdigest()
	return '$'.join([algorithm, salt, password_hash])

login = Blueprint('login', __name__, template_folder='templates')

@login.route(urlPrefix+'/login', methods=['GET','POST'])
def login_route():
	options = {
		'urlPrefix':urlPrefix,
		'blankUser':False,
		'blankPassword':False
	}
	options = configureOptionForUser(options)
	isError = False
	if request.method == 'POST':
		username = request.form['username']
		password = request.form['password']
		if username == '':
			options['blankUser']=True
			isError = True
		else:
			users = fetchResult('SELECT password FROM user WHERE username = "{}"'.format(username))
			if len(users) == 0:
				options['usernameNotExist'] = True
				isError = True
			else:
				user = (users[0])
		if password == '':
			options['blankPassword']=True
			isError = True
		else:
			if not isError:
				if rehash(password, user['password']) == user['password']:
					session['username'] = username
				else:
					options['passWordIncorrect']=True
					isError = True
		if not isError:
			return redirect(url_for('projects.projects_route'))
	return render_template('login.html', **options)

@login.route(urlPrefix+'/logout', methods=['GET','POST'])
def logout_route():
	session.clear()
	return redirect(url_for('projects.projects_route'))