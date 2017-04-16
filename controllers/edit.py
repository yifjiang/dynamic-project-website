from flask import *
import os

from extensions import connect_to_database
from extensions import fetchResult
from extensions import db
from extensions import urlPrefix

edit = Blueprint('edit', __name__, template_folder='templates')

@edit.route(urlPrefix+'/edit', methods=['GET','POST'])
def edit_route():
	if 'username' not in session:
		return redirect(url_for('login.login_route'))

	if request.method == 'POST':
		form_type = request.form['form_type']
		if form_type == 'edit_people':
			if request.form['submit'] == 'Delete':
				fetchResult('DELETE FROM people WHERE people_id = {}'.format(request.form['people_id']))
			elif request.form['submit'] == 'Update':
				fetchResult('UPDATE people SET firstname = "{}", lastname = "{}", people_website="{}" WHERE people_id={}'.format(request.form['firstname'], request.form['lastname'], request.form['people_website'], request.form['people_id']))
				if request.form['people_website'] == "":
					fetchResult('UPDATE people SET people_website=null WHERE people_id = {}'.format(request.form['people_id']))
		elif form_type == 'add_people':
			if request.form['people_website'] == '':
				fetchResult('INSERT INTO people(firstname, lastname, people_website) VALUES("{}","{}",null)'.format(request.form['firstname'],request.form['lastname']))
			else:
				fetchResult('INSERT INTO people(firstname, lastname, people_website) VALUES("{}","{}","{}")'.format(request.form['firstname'],request.form['lastname'], request.form['people_website']))
		elif form_type == 'edit_publication':
			if request.form['submit'] == 'Delete':
				fetchResult('DELETE FROM publications WHERE publication_id = {}'.format(request.form['publication_id']))
			elif request.form['submit'] == 'Update':
				fetchResult('DELETE FROM publicationPeople WHERE publication_id={}'.format(request.form['publication_id']))
				members = request.form.getlist('members')
				for member in members:
					fetchResult('INSERT INTO publicationPeople VALUES({},{})'.format(request.form['publication_id'], member))

				fetchResult('UPDATE publications SET publication_name = "{}", conference = "{}", location = "{}", dates = "{}", link = "{}" WHERE publication_id = {}'.format(request.form['publication_name'], request.form['conference'], request.form['location'], request.form['dates'], request.form['link'], request.form['publication_id']))
				if request.form['location'] == '':
					fetchResult('UPDATE publications SET location = null WHERE publication_id = {}'.format(request.form['publication_id']))
		elif form_type == 'add_publication':
			if request.form['location'] == '':
				fetchResult('INSERT INTO publications(publication_name, conference, location, dates, link) values("{}","{}",null,"{}","{}")'.format(request.form['publication_name'],request.form['conference'], request.form['dates'], request.form['link']))
			else:
				fetchResult('INSERT INTO publications(publication_name, conference, location, dates, link) values("{}","{}","{}","{}","{}")'.format(request.form['publication_name'],request.form['conference'], request.form['location'], request.form['dates'], request.form['link']))
			publication_id = fetchResult('SELECT max(publication_id) FROM publications')[0]['max(publication_id)']
			# print(publication_id)
			members = request.form.getlist('members')
			for member in members:
				fetchResult('INSERT INTO publicationPeople VALUES({},{})'.format(publication_id, member))

		elif form_type == 'edit_project':
			if request.form['submit'] == 'Delete':
				fetchResult('DELETE FROM projects WHERE project_id = {}'.format(request.form['project_id']))
			elif request.form['submit'] == 'Update':

				fetchResult('DELETE FROM projectPeople WHERE project_id={}'.format(request.form['project_id']))
				members = request.form.getlist('members')
				for member in members:
					fetchResult('INSERT INTO projectPeople VALUES ({},{})'.format(request.form['project_id'], member))

				fetchResult('DELETE FROM projectPublication WHERE project_id={}'.format(request.form['project_id']))
				ppublications = request.form.getlist('project_publication')
				for p in ppublications:
					# print(request.form['project_id'], p)
					fetchResult('INSERT INTO projectPublication VALUES({},{})'.format(request.form['project_id'], p))


				fetchResult('UPDATE projects SET projectName="{}", subtitle="{}", summary="{}", project_website="{}", corp = "{}" WHERE project_id={}'.format(request.form['projectName'], request.form['subtitle'], request.form['summary'], request.form['project_website'], request.form['corp'], request.form['project_id']))
		elif form_type == 'new_project':
			fetchResult('INSERT INTO projects(projectName, subtitle, summary, project_website, corp) VALUES("{}", "{}", "{}", "{}", "{}")'.format(request.form['projectName'], request.form['subtitle'], request.form['summary'], request.form['project_website'], request.form['corp']))
			project_id = fetchResult('SELECT max(project_id) FROM projects')[0]['max(project_id)']
			# print(project_id)
			members = request.form.getlist('members')
			for member in members:
				fetchResult('INSERT INTO projectPeople VALUES ({},{})'.format(project_id, member))
			ppublications = request.form.getlist('project_publication')
			for p in ppublications:
				fetchResult('INSERT INTO projectPublication VALUES({},{})'.format(project_id, p))
		elif form_type == 'new_news':
			fetchResult('INSERT INTO news(title, summary, project_id) values ("{}","{}",{})'.format(request.form['title'], request.form['summary'],request.form['project_id']))
		elif form_type == 'edit_news':
			if request.form['submit'] == 'Delete':
				fetchResult('DELETE FROM news WHERE news_id = {}'.format(request.form['news_id']));
			elif request.form['submit'] == 'Update':
				fetchResult('UPDATE news SET title = "{}", summary = "{}", project_id = {} WHERE news_id = {}'.format(request.form['title'], request.form['summary'], request.form['project_id'], request.form['news_id']))

		return redirect(url_for('edit.edit_route'))

	people = fetchResult('SELECT * FROM people ORDER BY people_id')
	news = fetchResult('SELECT * FROM news ORDER BY news_id DESC')

	publications = fetchResult('SELECT * FROM publications ORDER BY publication_id DESC')
	publicationsWithPeople = fetchResult('SELECT * FROM publications ORDER BY publication_id DESC')
	for p in publicationsWithPeople:
		p['people'] = fetchResult('SELECT P.* FROM people P, publicationPeople PP WHERE P.people_id = PP.people_id and PP.publication_id = {}'.format(p['publication_id']))

	projects = []
	projects.extend(fetchResult('SELECT * FROM projects WHERE corp = "current" order by project_id DESC'))
	# print (projects)
	projects.extend(fetchResult('SELECT * FROM projects WHERE corp = "past" order by project_id DESC'))
	for project in projects:
		project['people'] = fetchResult('SELECT P.* FROM people P, projectPeople PP WHERE P.people_id = PP.people_id and PP.project_id = {}'.format(project['project_id']))
		project['publication'] = fetchResult('SELECT P.* FROM publications P, projectPublication PP WHERE P.publication_id = PP.publication_id and PP.project_id = {}'.format(project['project_id']))
		# project['news'] = fetchResult('SELECT * FROM news WHERE project_id ={} ORDER BY news_id DESC'.format(project['project_id']))
	options = {
		'people':people,
		'publications':publications,
		'publicationsWithPeople':publicationsWithPeople,
        'projects':projects,
        'news':news
	}
	return render_template('edit.html',**options)