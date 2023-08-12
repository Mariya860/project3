// Setup empty JS array to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express()
/* Middleware*/
const bodyParser = require('body-parser');
// define cors to allow http polices
const cors = require('cors');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
// use body parser json to allow json data
app.use(bodyParser.json());

// Cors for allowing cross origin polices
app.use(cors())
// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
// defining the journal post route
app.get('/journal', (req, res) => {
    res.status(200).send(projectData)
})
// defining new weather journal post route
app.post('/new', async (req, res) => {
    projectData = await req.body
    res.status(200).send('Success')
})

// display a terminal log server is starting at port 3000
console.log('server started at port 3000');
// attach the app to listen to port 3000
app.listen(3000)