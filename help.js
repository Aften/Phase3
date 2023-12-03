//Stubhub API 
fetch('https://account.stubhub.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded -d grant_type=client_credentials -d scope=read:events',
    'Authorization': 'Basic ' + btoa('clientId:clientSecret')
  }
});

var mysql = require('mysql');

const stubhubApiKey = fetch('https://account.stubhub.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded -d grant_type=client_credentials -d scope=read:events',
    'Authorization': 'Basic ' + btoa('clientId:clientSecret')
  }
});
const stubhubEndpoint = 'https://api.stubhub.net/catalog/events';

//SQL connection
var con = mysql.createConnection({
  host: "localhost",
  user: "postgres",
  password: "8888"
});

con.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

//SQL creation
con.connect(function(err) {
  //if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE db412", function (err, result) {
    //if (err) throw err;
    console.log("Database created");
  });

  var table = "CREATE TABLE event(id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL, start_date VARCHAR(255) NOT NULL, ticket_price VARCHAR(255) NOT NULL)";
  // Function to fetch data from StubHub API and insert into MySQL table
  con.query(table, function(err, result) {
    console.log("Table created")
  })
  
  async function fetchDatabase() {
  // Fetch data from StubHub API
    const response = await fetch(stubhubEndpoint, {
      headers: {
        'Authorization': `Bearer ${stubhubApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    

    const data = await response.json();

    // Insert data into MySQL table
    data.events.forEach(event => {
      const insertQuery = 'INSERT INTO stubhub_events (eventName, eventLocation, eventDate, eventTime) VALUES (?, ?, ?, ?)';
      const values = [event.name, event.venue.name, event.date, event.startDateTime];

      db.query(insertQuery, values, (error, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
        } else {
          console.log('Data inserted into MySQL:', result);
        }
      });
    });
  }

  // Call the function to fetch data and insert into MySQL table
  fetchDatabase();
});