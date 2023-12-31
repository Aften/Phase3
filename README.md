# Event Aggregation Website

## Project Overview:
- This project is designed to populate a simple website to display ticket information to the user. 
- It was made using HTML, CSS, JavaScript, FLASK, and SQLITE3. 
- The API's used to populate the SQL database are StubHub and TicketMaster.
- The SQL database is populated at runtime from data gathered from the API calls. We decided to use FLASK to handle the SQL queries as it has an optimal runtime for our project scope and it allows us to easily see and edit the database when needed.

## User Manual:

### How to run the website:
- To run the website you must first install Python flask: https://flask.palletsprojects.com/en/3.0.x/installation/
- Then using your terminal navigate to inside the downloaded folder.
- To generate the website follow the steps below:

To utilize the Event Aggregation Website, you will need to install Python. 

Python can be downloaded at: https://www.python.org/

Ensure that you set the python environment variables during installation.

Once that is complete, you will need to install pip to download necessary database libraries.
https://pypi.org/project/pip/

Once pip has been installed, you can utilize it to download Flask, the primary back-end framework our application uses to run the database.
You can utilize this command to download pip

$ pip install -U Flask

From there, you will need to download Node.JS for the javascript functionalities in our applicaiton.
This can be found here:
https://nodejs.org/en

From here, you are now able to run the application. Download the repository from the GitHub.
GitHub: https://github.com/Aften/Phase3

From there, find the location of the repository using your command line of choice. 
Ensure that you are able to Python by calling:

python --version

Ensure that you are able to Python by calling:

flask --version

If these two are properly installed and you are able to see the version, you can run the software by entering "flask run" through the terminal while in the applications file directory.

Finally run the command: "flask run". This will generate a link to the website:

![test3](https://github.com/Aften/Phase3/assets/34137769/c6ea6d70-2cee-48d7-a7b3-f0e7f42c2cd5)

- Finally copy and paste the address into a web browser of your choice.
  
### How to navigate the website:
- The website navigation is simple, by default you are put into the Home page of the website. This section displays to the user the various tickets.
- It displays the origin of the ticket, that being either StubHub or TicketMaster. It also displays the lowest and highest prices available for each ticket. 
- Lastly it displays the link to purchase the ticket.

![1](https://github.com/Aften/Phase3/assets/34137769/b58e5274-d73a-43de-a07f-1da722f7f91e)

- You can also click on the 'Event Aggregation Website' text in the top left of the navigation bar to refresh the home screen:

![finally](https://github.com/Aften/Phase3/assets/34137769/becd743e-9ead-4cc7-a6bd-8a565d04f727)

### How to purchase a ticket:
- Once you find a ticket you're interested in purchasing, simply copy and paste the link into another browser tab to purchase.
- Here's an example of one of the links below, in this case it's for the Golden State Warriors vs Phoenix Suns:

![another one](https://github.com/Aften/Phase3/assets/34137769/74437a97-5551-4709-9b38-036be01743d9)


