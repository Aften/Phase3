import sqlite3
import random
from flask import Flask, session, render_template, request, g
import sys
import os

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

app.secret_key = "secretKey"

@app.route("/")
def index():

    os.remove("db.sqlite")
    data = create_db()
   
    print("Acquired DB", file=sys.stdout)
    
    return render_template("index.html", all_data = data)

def create_db():
    print("Create_db", file=sys.stdout)    
    db =  g._database = sqlite3.connect('db.sqlite' , check_same_thread=False)
    cursor = db.cursor()

    cursor.execute("CREATE TABLE GTA (release_year integer, release_name text, city text);")

    release_list = [
        (1997, "Grand Theft Auto", "state of New Guernsey"),
        (1999, "Grand Theft Auto 2", "Anywhere, USA"),
        (2001, "Grand Theft Auto III", "Liberty City"),
        (2002, "Grand Theft Auto: Vice City", "Vice City"),
        (2004, "Grand Theft Auto: San Andreas", "state of San Andreas"),
        (2008, "Grand Theft Auto IV", "Liberty City"),
        (2013, "Grand Theft Auto V", "Los Santos")
    ]    


    cursor.executemany("INSERT INTO GTA VALUES (?,?,?)", release_list)

    cursor.execute("SELECT release_name from GTA;")

    result = cursor.fetchall()
    result = [str(val[0]) for val in result]
    
        
    return result

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.run()