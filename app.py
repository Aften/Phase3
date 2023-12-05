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

    #Create Tables
    cursor.execute("CREATE TABLE vendor (    vendorId VARCHAR(255) PRIMARY KEY,    vendorName VARCHAR(255) NOT NULL);")
    cursor.execute("CREATE TABLE venue (   venueId VARCHAR(255) PRIMARY KEY,   name VARCHAR(255) NOT NULL,   country VARCHAR(255) NOT NULL,   city VARCHAR(255) NOT NULL,   address VARCHAR(255) NOT NULL,   state VARCHAR(255) NOT NULL);") 
    cursor.execute("CREATE TABLE event(    eventId VARCHAR(255) PRIMARY KEY,    venueId VARCHAR(255) NOT NULL,    vendorId VARCHAR(255) NOT NULL,    datetime VARCHAR(255) NOT NULL,    title VARCHAR(255) NOT NULL,    url VARCHAR(255) NOT NULL,    ageRestricted BOOLEAN NOT NULL,    lowestPrice FLOAT NOT NULL,    highestPrice FLOAT NOT NULL);")
    cursor.execute("CREATE TABLE performer (    performerId VARCHAR(255) NOT NULL,    performerName VARCHAR(255) NOT NULL,          eventId VARCHAR(255) NOT NULL)")


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