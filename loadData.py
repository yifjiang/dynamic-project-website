import pymysql
import pymysql.cursors
import os
import controllers
import config
from extensions import hashPassword


def load_data():
	options = {
    'host': config.env['host'],
    'user': config.env['user'],
    'passwd': config.env['password'],
    'cursorclass' : pymysql.cursors.DictCursor
  	}
	db = pymysql.connect(**options)
	db.autocommit(True)
	cur = db.cursor()
	sqlFilesDirectory = "./sql/"
	sqlFilesNames = os.listdir(sqlFilesDirectory)
	sqlFilesNames.remove("load_data_photo.sql")
	sqlFilesNames.append("load_data_photo.sql")
	sqlFilesNames.remove("load_data_contain.sql")
	sqlFilesNames.append("load_data_contain.sql")
	for sqlFileName in sqlFilesNames:
		if sqlFileName.startswith("load_"):
			sqlFile = open(sqlFilesDirectory+sqlFileName)
			sql = sqlFile.read()
			cur.execute(sql)
			sqlFile.close()
	cur.execute('SELECT username, password FROM user')
	results = cur.fetchall()
	for result in results:
		username = result['username']
		password = result['password']
		cur.execute('UPDATE user SET password = "{}" where username = "{}"'.format(hashPassword(password), username))
		

if __name__ == '__main__':
	load_data()