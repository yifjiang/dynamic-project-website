from flask import *

from extensions import connect_to_database
from extensions import fetchResult
from extensions import urlPrefix

projects = Blueprint('projects', __name__, template_folder='templates')

@projects.route(urlPrefix+'/')
def projects_route():
    projects = []
    projects.extend(fetchResult('SELECT * FROM projects WHERE corp = "current" order by project_id DESC'))
    projects.extend(fetchResult('SELECT * FROM projects WHERE corp = "past" order by project_id DESC'))
    for project in projects:
        project['people'] = fetchResult('SELECT P.people_id, firstname, lastname, people_website FROM people P, projectPeople PP WHERE P.people_id = PP.people_id and PP.project_id = {}'.format(project['project_id']))
        project['publication'] = fetchResult('SELECT P.* FROM publications P, projectPublication PP WHERE P.publication_id = PP.publication_id and PP.project_id = {}'.format(project['project_id']))
        for p in project['publication']:
            p['people'] = fetchResult('SELECT P.* FROM people P, publicationPeople PP WHERE P.people_id = PP.people_id and PP.publication_id = {}'.format(p['publication_id']))
        project['news'] = fetchResult('SELECT * FROM news WHERE project_id ={} ORDER BY news_id DESC'.format(project['project_id']))
    options = {
        'session':session,
        'projects':projects
    }
    return render_template('projects.html', **options)
