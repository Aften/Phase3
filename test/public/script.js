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
    //displayTicketsAmountFunction('concert', concertTicketsAmount, 'Date', 'Time');
    loadEvents('concert');  // temporary
});

// Event listener for the sports nav bar button.
document.getElementById('sportsBtn').addEventListener('click', () => {
    loadTickets('sports');
    document.getElementById('dateFilter').classList.remove('hidden');
    document.getElementById('genreFilter').classList.add('hidden');
    // Displays 5 sports tickets, change this so that it will be displayed depending the amount required from API calls.
    loadEvents('sports');
});

// Event listener for the arts nav bar button.
document.getElementById('artsBtn').addEventListener('click', () => {
    loadTickets('arts');
    document.getElementById('dateFilter').classList.remove('hidden');
    document.getElementById('genreFilter').classList.add('hidden');
    // Displays 15 arts related tickets, change this so that it will be displayed depending the amount required from API calls.
    loadEvents('music');
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

// Function to load the events from the data from the database
async function loadEvents(genre) {
	try {
        const response = await fetch(`/api/events?genre=${genre}`);
        if (!response.ok) {
            throw new Error('Failed to fetch search');
        }
        const eventsData = await response.json();
        displayEvents(eventsData);
    } catch (error) {
        console.error('Failed to fetch events:', error);
    }
}

// Function that uses displayTicketSectionFunction to display the tickets from the database
async function displayEvents(events) {
    const ticketSection = document.getElementById('ticketSection');
    ticketSection.innerHTML = '';
    events.forEach(event => {
        displayTicketSectionFunction(event.title, event.name, event.city, event.state, event.datetime, event.url, event.image);
    });
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
// Adjustments to the parameters
function displayTicketSectionFunction(eventName, eventLocation, eventCity, eventState, eventDateTime, eventURL, eventImage) {

    const ticketSection = document.getElementById('ticketSection');
    const ticketSectionHTML = `
        <div class="ticket-info">
            <!-- Content of the ticket info section -->
            <img src='${eventImage}' alt="Event Image" class="concert-image">
            <div class="ticket-details">
                <div class="time-info">
                    <p>DateTime</p>
                    <p1>${eventDateTime}</p1>
                </div>
                <div class="concert-info">
                    <h3>${eventName}</h3>
                    <p>${eventLocation} - ${eventCity}, ${eventState}</p>
                </div>
            </div>
            <button class="see-tickets-btn">See Tickets</button>
        </div>
    `;

    ticketSection.insertAdjacentHTML('beforeend', ticketSectionHTML);

    const buttons = ticketSection.getElementsByClassName('see-tickets-btn');

    const lastButton = buttons[buttons.length - 1];

    // button leads to the website based on url
    lastButton.addEventListener('click', () => window.location.href = eventURL);
}

// Placeholder function for linking to tickets, change it so that when clicked it goes to the appropriate ticket website, i.e stubhub or ticketmaste, so that the user can actually purchase the tickets.
function seeTicketsClicked(eventName, eventLocation) {
    alert(`See tickets for: ${eventName} at ${eventLocation}`);
}

// Placeholder search function, implement the actual search functionality here.
async function performSearch() {
    const query = document.getElementById('searchInput').value;
    //alert(`Search for: ${query}`);

    // fetch the search results and show the data from the search
    try {
        const response = await fetch(`/api/events/search?searched=${query}`)
        if (!response.ok) {
            throw new Error('Failed to fetch search');
        }
        console.log(response);
        const searchData = await response.json();
        displayEvents(searchData);
    } catch (error) {
        console.error('Failed to search:', error);
    }
    
}

// Function designed to display the tickets based on the filter value, change this function to do so. Currently just filters the amount of tickets as a palceholder logic.
function updateTicketDisplayBasedOnFilter() {
    let ticketAmount;

    // Example cases for filtering
    if (currentFilter.date === 'today' && currentFilter.genre === 'pop-rock') {
        ticketAmount = 20;
    } else if (currentFilter.date === 'this-weekend' && currentFilter.genre === 'classical') { 
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