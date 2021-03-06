from flask import Flask, render_template
import extensions
import controllers
from controllers import projects, login, edit #login
import config

# Initialize Flask app with the template folder address
app = Flask(__name__, template_folder='templates')

# secret key
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

# Register the controllers
app.register_blueprint(projects.projects)
app.register_blueprint(login.login)
app.register_blueprint(edit.edit)

# Listen on external IPs
# For us, listen to port 3000 so you can just run 'python app.py' to start the server
if __name__ == '__main__':
    # listen on external IPs
    app.run(host=config.env['host'], port=config.env['port'], debug=True)
