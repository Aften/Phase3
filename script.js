// GLobal variables to store the amount of tickets per section
var concertTicketsAmount = 0;
var sportsTicketsAmount = 0;
var artsTicketsAmmount = 0;

// Function to determine the amount of tickets per section, this is just placeholder logic, implement the functionality for it here:
function setTicketValues() {
    concertTicketsAmount = 10;
    sportsTicketsAmount = 10;
    artsTicketsAmmount = 10;
}

// Event listener for the concert nav bar button.
document.getElementById('concertBtn').addEventListener('click', () => {
    loadTickets('concert');
    document.getElementById('dateFilter').classList.remove('hidden');
    document.getElementById('genreFilter').classList.remove('hidden');
    // Displays 10 concert tickets, change this so that it will be displayed depending the amount required from API calls.
    displayTicketsAmountFunction('concert', concertTicketsAmount, 'Date', 'Time');
});

// Event listener for the sports nav bar button.
document.getElementById('sportsBtn').addEventListener('click', () => {
    loadTickets('sports');
    document.getElementById('dateFilter').classList.remove('hidden');
    document.getElementById('genreFilter').classList.add('hidden');
    // Displays 5 sports tickets, change this so that it will be displayed depending the amount required from API calls.
    displayTicketsAmountFunction('sports', sportsTicketsAmount, 'Date', 'Time');
});

// Event listener for the arts nav bar button.
document.getElementById('artsBtn').addEventListener('click', () => {
    loadTickets('arts');
    document.getElementById('dateFilter').classList.remove('hidden');
    document.getElementById('genreFilter').classList.add('hidden');
    // Displays 15 arts related tickets, change this so that it will be displayed depending the amount required from API calls.
    displayTicketsAmountFunction('arts', artsTicketsAmmount, 'Date', 'Time');
});

let currentFilter = {
    date: 'all-dates',
    genre: 'all-genres'
};

// Event listener for the date filter
document.getElementById('dateFilter').querySelector('select').addEventListener('change', (event) => {
    currentFilter.date = event.target.value;
    updateTicketDisplayBasedOnFilter();
});

// Event listener for the genre filter
document.getElementById('genreFilter').querySelector('select').addEventListener('change', (event) => {
    currentFilter.genre = event.target.value;
    updateTicketDisplayBasedOnFilter();
});

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', performSearch);

// Function to load the tickets
function loadTickets(category) {
    const ticketSection = document.getElementById('ticketSection');
    ticketSection.innerHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Tickets</h2>`;
}

// Placeholder function designed to clear the ticket UI section and display the amount of tickets dependent on the amount required.
function displayTicketsAmountFunction(category, ticketAmount, dateValue, timeValue) {
    const ticketSection = document.getElementById('ticketSection');
    // Clear existing ticket information before adding new ones
    ticketSection.innerHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Tickets</h2>`; 

    for (let i = 1; i <= ticketAmount; i++) {
        displayTicketSectionFunction(`${category} Event ${i}`, `${category} Location ${i}`, dateValue, timeValue);
    }
}

// Function to actually display the tickets in the UI, change the input parameters based on the data gathered from SQL.
function displayTicketSectionFunction(eventName, eventLocation, eventDate, eventDayTime) {
    
    const ticketSection = document.getElementById('ticketSection');
    const ticketSectionHTML = `
        <div class="ticket-info">
            <!-- Content of the ticket info section -->
            <img src="PlaceholderImg.jpg" alt="Event Image" class="concert-image">
            <div class="ticket-details">
                <div class="time-info">
                    <p>${eventDate}</p>
                    <p1>${eventDayTime}</p1>
                </div>
                <div class="concert-info">
                    <h3>${eventName}</h3>
                    <p>${eventLocation}</p>
                </div>
            </div>
            <button class="see-tickets-btn">See Tickets</button>
        </div>
    `;

    ticketSection.insertAdjacentHTML('beforeend', ticketSectionHTML);

    const buttons = ticketSection.getElementsByClassName('see-tickets-btn');

    const lastButton = buttons[buttons.length - 1];

    lastButton.addEventListener('click', () => seeTicketsClicked(eventName, eventLocation));
}

// Placeholder function for linking to tickets, change it so that when clicked it goes to the appropriate ticket website, i.e stubhub or ticketmaste, so that the user can actually purchase the tickets.
function seeTicketsClicked(eventName, eventLocation) {
    alert(`See tickets for: ${eventName} at ${eventLocation}`);
}

// Placeholder search function, implement the actual search functionality here.
function performSearch() {
    const query = document.getElementById('searchInput').value;
    alert(`Search for: ${query}`);
}

// Function designed to display the tickets based on the filter value, change this function to do so. Currently just filters the amount of tickets as a palceholder logic.
function updateTicketDisplayBasedOnFilter() {
    let ticketAmount;
    const currentDate = new Date();

    //genre_id
    // Example cases for filtering
    if (currentFilter.date === 'today') {
        var today = ('SELECT * FROM events WHERE date = ? LIMIT 20', [eventDate]);
        ticketAmount = 20;
    } else if (currentFilter.date === 'this-weekend') { 
        var weekend = ('SELECT * FROM events WHERE date = ? LIMIT 20', [eventDate]);
    } else if (currentFilter.date === 'this-month') {

    } 

    //by genre pop/rock alt classical r&b rap/hiphop dance
    if(currentFilter.genre === 'Pop/Rock') {
        var genreFilter = ('SELECT * FROM events WHERE genre_id = ? LIMIT 20', 'Pop/Rock');
    } else if (currentFilter.date === 'Alternative Music') {
      var genreFilter = ('SELECT * FROM events WHERE genre_id = ? LIMIT 20', 'Alternative Music');
    } else if (currentFilter.date === 'R&B') {
      var genreFilter = ('SELECT * FROM events WHERE genre_id = ? LIMIT 20', 'R&B');
    } else if (currentFilter.date === 'Rap and Hip-Hop') {
      var genreFilter = ('SELECT * FROM events WHERE genre_id = ? LIMIT 20', 'Rap and Hip-Hop');
    } else if (currentFilter.date === 'Dance and Electronic') {
      var genreFilter = ('SELECT * FROM events WHERE genre_id = ? LIMIT 20', 'Dance and Electronic');
    } else {
        // Default amount of tickets
        ticketAmount = 30;
    }

    const currentCategory = document.getElementById('ticketSection').innerText.split(' ')[0].toLowerCase();
    displayTicketsAmountFunction(currentCategory, ticketAmount, 'Date', 'Time');
}

// Calls the setTicketValues function when site is initially loaded.
window.onload = function() {
    setTicketValues();
};

const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

fetch('https://account.stubhub.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded -d grant_type=client_credentials -d scope=read:events',
    'Authorization': 'Basic ' + btoa('clientId:clientSecret')
  }
});

const app = express();
const port = 5432;

// MySQL Database Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'postgres',
  password: 'password',
  database: 'postgres',
  port: '5432'
});

const table = "CREATE TABLE table (eventName VARCHAR(255), eventLocation VARCHAR(255), eventDate VARCHAR(255), eventDayTime VARCHAR(255), genre_id VARCHAR(255)"
db.query(table, (err, results) => {
  console.log('table');
})

// StubHub API Key (replace with your actual API key)
const stubhubApiKey = 'YOUR_STUBHUB_API_KEY';

// Express middleware for parsing JSON
app.use(express.json());

// StubHub API endpoint
const stubhubEndpoint = 'https://api.stubhub.com/sellers/search/events/v3';

// Express route to get tickets from StubHub API
app.get('/api/tickets/:category', async (req, res) => {
  const category = req.params.category;

  try {
    // Fetch data from StubHub API
    const response = await axios.get(stubhubEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${stubhubApiKey}`,
      },
      params: {
        q: category,
      },
    });

    // Extract relevant ticket information from the StubHub API response
    const tickets = response.data.events.map((event) => ({
      eventName: event.name,
      eventLocation: event.venue.name,
      eventDate: event.date,
      eventDayTime: event.startDateTime,
    }));

    // Insert ticket data into MySQL database
    const insertQuery = 'INSERT INTO tickets (eventName, eventLocation, eventDate, eventDayTime) VALUES ?';
    const values = tickets.map((ticket) => [ticket.eventName, ticket.eventLocation, ticket.eventDate, ticket.eventDayTime]);

    db.query(insertQuery, [values], (error, results) => {
      if (error) throw error;
      console.log('Tickets inserted into the database:', results);
    });

    // Send the tickets as a response
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching data from StubHub API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});