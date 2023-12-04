// TicketMaster API Data to Database

/* 
 * Would have used Node.js to test this script, and this would
 * take the first twenty events from the TicketMaster API. It would
 * take only twenty events, for each page should have twenty events,
 * and this would only fetch the data of the first page.
 * Have to install Node.js, and once it has been installed, run
 * 'npm install pg node-fetch express' to get the modules if missing on cmd. Then, do
 * 'node ticketMasterData.js' to run the script. May have to edit package.json.
 */

// Connection to PostgreSQL
import psql from 'pg';
import fetch from 'node-fetch';
import express from 'express';

const { Client } = psql;
const client = new Client({
	host: 'localhost',
	database: 'master',
	port: 5432,
	user: 'postgres',
	password: 'password',
});

client.connect();

// server
const exp = express();

exp.use(express.static('public'));
exp.get('/', (req, res) => {
	res.sendFile(process.cwd() + '/index.html');
});

exp.get('/api/events', async (req, out) => {  // database of events table only into json
	try {
		const result = await client.query('SELECT * FROM event');
		out.json(result.rows);
	} catch (error) {
		console.error(error);
		out.status(500).send('Internal Server Error');
	}
});

exp.listen(5000, () => {
	console.log('http://localhost:5000');
});

// TicketMaster API url and key
const key = 'AF9i9qoiuHEGMbquAwIDAfdskj8p9oR9';
const url = 'https://app.ticketmaster.com/discovery/v2/events';

createDatabase();  // call to add data to database (stops adding when encounters a duplicate)

// Fetches the data from TicketMaster API
async function fetchEvents(page) {
	try {
		const response = await fetch(`${url}?apikey=${key}&page=${page}`);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}
		
		const eventData = await response.json();
		console.log('Data was sucessfully fetched.');
		return eventData._embedded.events;
	} catch (error) {
		console.error(error.message);
		return[];
	}
}

// Adding the events to the database. This will add the vendor, venues, events, and performers/attractions
async function createDatabase() {
	// prices
	var min = 0.0;
	var max = 0.0;

	// creating the vendor (TicketMaster)
	var insertVendor = {  // insert query
		text: 'INSERT INTO vendor (vendorId, vendorName) VALUES ($1, $2)',
		values: [0, 'TicketMaster'],
	}
	var checkVendor = {  // to check if vendor already created
		text: 'SELECT COUNT(*) FROM vendor WHERE vendorId = $1',
		values: [0],
	}

	var vendorFound = await client.query(checkVendor);
	if (!(vendorFound.rows[0].count > 0)) {  // if vendor does not exist
		await client.query(insertVendor);
		console.log('Vendor was sucessfully added.');
	}

	for (let page = 0; page <= 0; page++) {  // go through pages (more pages = more data for database)
		const events = await fetchEvents(page);  // get the data from page

		// Go through the events
		for (const event of events) {
		// Venue
			// creating the venue
			//console.log(event)
			const venue = event._embedded.venues[0];  // first venue from file
			var insertVenue = {  // insert query
				text: 'INSERT INTO venue (name, country, city, address, state, venueId) VALUES ($1, $2, $3, $4, $5, $6)',
				values: [venue.name, venue.country.countryCode, venue.city.name, venue.address.line1, venue.state.stateCode, venue.id],
			}

			var checkVenue = {  // to check if venue already exists
				text: 'SELECT COUNT(*) FROM venue WHERE venueId = $1',
				values: [venue.id],
			}

			var venueFound = await client.query(checkVenue);
			if (!(venueFound.rows[0].count > 0)) {  // if venue does not exist
				await client.query(insertVenue);
				//console.log('Venue was sucessfully added.');
			}

		// Event
			// creating the event
			if (event.priceRanges && event.priceRanges.length > 0) {  // check if priceRnages exist
				//console.log("exist");
				// get the min and max
				min = event.priceRanges.reduce((min, range) => (range.min !== undefined ? Math.min(min, range.min) : min), Infinity);
				max = event.priceRanges.reduce((max, range) => (range.max !== undefined ? Math.max(max, range.max) : max), -Infinity);
			}
			else {
				//console.log("does not exist");
				min = 0.0;
				max = 0.0;
			}

			var insertEvent = {  // insert query
				text: 'INSERT INTO event(eventId, venueId, vendorId, datetime, title, url, ageRestricted, lowestPrice, highestPrice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
				values: [event.id, venue.id, 0, event.dates.start.dateTime || 'N/A', event.name, event.url, event.ageRestriction || false, min, max],
			}

			var checkEvent = {  // select query to see count of events
				text: 'SELECT COUNT(*) FROM event WHERE eventId = $1',
				values: [event.id],
			}
			var eventFound = await client.query(checkEvent);
			if (!(eventFound.rows[0].count > 0)) {  // if event does not exist
				await client.query(insertEvent);
				//console.log('Event was sucessfully added.');
			}

		// Performers
			// creating the performers
			if (event._embedded.attractions) {  // if there are performers
				for (const performer of event._embedded.attractions) {  // for every performer
					var checkPerformer = {  // to check if performer already exists
						text: 'SELECT COUNT(*) FROM performer WHERE performerId = $1 AND eventId = $2',
						values: [performer.id, event.id],
					}

					var performerFound = await client.query(checkPerformer);

					if (!(performerFound.rows[0].count > 0)) {  // if performer does not exist in the event
						// creating the performer
						var insertPerformer = {  // insert query
							text: 'INSERT INTO performer (performerId, performerName, eventId) VALUES ($1, $2, $3)',
							values: [performer.id, performer.name, event.id],
						}

						await client.query(insertPerformer);
					}

				}
			}
		}
    }
}