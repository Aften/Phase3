import sqlite3
import random
from flask import Flask, session, render_template, request, g
import sys
import os

app = Flask(__name__)
app.secret_key = "secretKey"

@app.route("/")
def index():
    if os.path.isfile("db.sqlite"):
        os.remove("db.sqlite")
        print("Deleting original DB", file=sys.stdout)    

    data = create_db()
   
    print("Acquired DB", file=sys.stdout)
    return render_template("index.html", all_data = data)

def create_db():
    print("Create_db", file=sys.stdout)    
    conn = sqlite3.connect('db.sqlite' , check_same_thread=False)
    
    cursor = conn.cursor()

    #Create Vendors
    cursor.execute("CREATE TABLE vendor (vendorId TEXT,vendorName TEXT NOT NULL, PRIMARY KEY (vendorId));")
    
    data_tuple = (1, 'StubHub')
    cursor.execute("INSERT INTO vendor (vendorId, vendorName) VALUES (?,?)", data_tuple)    
    data_tuple = (0, 'TicketMaster')
    cursor.execute("INSERT INTO vendor (vendorId, vendorName) VALUES (?,?)", data_tuple)    

    
    
    #Create Venues
    cursor.execute("CREATE TABLE venue (venueId TEXT, name TEXT NOT NULL, country TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL, state TEXT NOT NULL, PRIMARY KEY(venueId));") 

    data_tuple = ('Footprint Center','US', 'Phoenix', '201 East Jefferson Street', 'AZ', 'KovZpZAE617A')
    cursor.execute("INSERT INTO venue (name, country, city, address, state, venueId) VALUES(?,?,?,?,?,?)", data_tuple)
    
    data_tuple = ('Chase Center','US', 'San Francisco', '300 16th Street', 'CA', 'KovZ917Ah1H')
    cursor.execute("INSERT INTO venue (name, country, city, address, state, venueId) VALUES(?,?,?,?,?,?)", data_tuple)

    data_tuple = ('State Farm Arena','US', 'Atlanta', 'One State Farm Drive', 'GA', 'KovZpa2Xke')
    cursor.execute("INSERT INTO venue (name, country, city, address, state, venueId) VALUES(?,?,?,?,?,?)", data_tuple)

    #Create events
    cursor.execute("CREATE TABLE event(    eventId TEXT,    venueId TEXT NOT NULL,    vendorId TEXT NOT NULL,    datetime TEXT NOT NULL,    title TEXT NOT NULL,    url TEXT NOT NULL,    ageRestricted INT NOT NULL,    lowestPrice REAL NOT NULL,    highestPrice REAL NOT NULL,    FOREIGN KEY (vendorID) REFERENCES vendor(vendorID),    FOREIGN KEY (venueID) REFERENCES venue(venueID), PRIMARY KEY(eventId));")
    
    data_tuple = ('G5vYZ9svBCs1O', 'KovZ917Ah1H', 0, '2023-10-25T02:00:00Z', 'Golden State Warriors vs. Phoenix Suns','https://www.ticketmaster.com/golden-state-warriors-vs-phoenix-suns-san-francisco-california-10-24-2023/event/1C005F107A3B12A0', 0, 150.0, 2200.0);    
    cursor.execute("INSERT INTO event( eventId, venueId, vendorId,datetime, title, url, ageRestricted, lowestPrice,highestPrice) VALUES (?,?,?,?,?,?,?,?,?)", data_tuple)

    data_tuple = ('vvG1zZ9YJwb39L', 'KovZpa2Xke', 0, '2024-02-03T00:30:00Z', 'Atlanta Hawks vs. Phoenix Suns','https://www.ticketmaster.com/atlanta-hawks-vs-phoenix-suns-atlanta-georgia-02-02-2024/event/0E005F09B26125DF',0, 59.0, 981.0);    
    cursor.execute("INSERT INTO event( eventId, venueId, vendorId,datetime, title, url, ageRestricted, lowestPrice,highestPrice) VALUES (?,?,?,?,?,?,?,?,?)", data_tuple)

    data_tuple = ('G5v0Z9Yc3SZzB', 'KovZpZAE617A', 0, '2023-10-29T02:00:00Z', 'Phoenix Suns vs. Utah Jazz','https://www.ticketmaster.com/phoenix-suns-vs-utah-jazz-phoenix-arizona-10-28-2023/event/19005F0B52CC0E3A',0, 78.0, 4289.0);    
    cursor.execute("INSERT INTO event( eventId, venueId, vendorId,datetime, title, url, ageRestricted, lowestPrice,highestPrice) VALUES (?,?,?,?,?,?,?,?,?)", data_tuple)
    
    #Create PERFORMERS
    cursor.execute("CREATE TABLE performer(performerId TEXT NOT NULL, performerName TEXT NOT NULL, eventId TEXT NOT NULL)")
    
    data_tuple = ('K8vZ9171oZf', 'Phoenix Suns', 'G5v0Z9Yc3SZzB')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)
    
    data_tuple = ('K8vZ9171o5V', 'Utah Jazz', 'G5v0Z9Yc3SZzB')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)

    data_tuple = ('K8vZ9171oZf', 'Phoenix Suns', 'vvG1zZ9YJwb39L')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)
    
    data_tuple = ('K8vZ91718XV', 'Atlanta Hawks', 'vvG1zZ9YJwb39L')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)
    
    data_tuple = ('K8vZ9171oZf', 'Phoenix Suns', 'G5vYZ9svBCs1O')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)
    
    data_tuple = ('K8vZ9171oa0', 'Golden State Warriors', 'G5vYZ9svBCs1O')
    cursor.execute("INSERT INTO performer (performerId, performerName, eventId) VALUES (?,?,?)",data_tuple)

    conn.commit()
    
    result = ""

    cursor.execute("SELECT vendorName FROM vendor WHERE vendor.vendorId=0 ;")    
    resultList = cursor.fetchall()
    result = [str(val[0]) for val in resultList]
    
    cursor.execute("SELECT title FROM event WHERE event.vendorId = 0;")
    resultList = cursor.fetchall()
    result = [str(val[0]) for val in resultList]
    
    return result

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.run()