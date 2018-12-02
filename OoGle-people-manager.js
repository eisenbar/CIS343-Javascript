// The API toolkit for making REST systems easily
const express = require('express');

// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');

// Node JS modules for filesystem access
const fs = require('fs');

// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');

//create an array of all of the programmers for easy access
let prog = [];
prog.push(database)

// Make an instance of our express application
const app = express();

// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
	throw new Error('Could not find database of programmers!');
}

// Build our routes

//Get all programmers from database
app.get('/', (req, res) => {
		res.send(prog);

		//for testing
		console.log("All the programmers!")
		});

//get certian programmer with valid ID
app.get('/:id', (req, res) => {
		const id = req.params.id;
		let emp = findProg(id);
		if(emp !== '')
		    res.send(emp);
		else
		    res.send("Not a proper employee! app.get by ID");

		//for testing
		console.log(id + " found!");
		});

//Add or update a programmer with given ID
app.put('/:id/:att/:val', (req, res) => {
		const id = req.params.id;
		const att = req.params.att;
		const val = req.params.val;

		let prog = findProg(id);

		if(prog !== ''){
		    prog[att] = val;
		    res.send(prog);
		}
		else
		    res.send("Failed to update. Programmer not found! app.put")
		});

//Post route to create new programmer
app.post('/:file', (req, res) => {

		const file = "./" + req.param.file;

		try{
		    const programmer = require(file);
		    const body = req.body; // Hold your JSON in here!
		    prog.push(programmer)
            res.send(prog);
        }
        catch(e){
            res.send("Could not create programmer! app.post ");
        }
		});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE
//Improper route handling
app.all("*", (req, res) => {
	res.send("Not a proper route!");
	console.log("Not a valid route!")
});

app.listen(port, () => {
		console.log(`She's alive on port ${port}`);
		});

//Helper method to determine a valid programmer
//@param id of supect prog
//returns '' if nothing is found
function findProg(id){

    for(let i in prog){
        if(prog[i].SID === id)
            return prog[i];
    }
    return '';
}