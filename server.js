const express = require('express');
const hbs = require('hbs'); //handlebars
const fs =require('fs'); //file system - allows you to work with files on your computer

//set the environment variable for Heroku to use.  makes the port dynamic
const port = process.env.PORT || 3000;

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//app.use is how you register middleware. takes a function
app.use((req, res, next) => {//next to tell when middleware func is done
	const now = new Date().toString();
	//go to expressjs.com API Reference to look at request and response methods
	const log = `${now}: ${req.method} ${req.url}`
	console.log(log);
	// the \n is newline character to move to next line
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	})
	next();
});

//don't need next because it'll stop everything
//middleware executed in order so help page will still render
// app.use((req, res) => {
// 	res.render('maintenance.hbs');
// })

//built-in middleware
//__dirname is variable with path to project directory
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

app.get('/', (req, res) => {
	// res.send('<h1>Hello Express!</h1>');
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Portfolio page here!'
	})
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Projects Page',
		welcomeMessage: 'Here are my projects'
	})
})

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
	}); //renders static about page
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'This is an error message'
	})
})

app.listen(port, () => {
	//this prints in terminal to tell where port is running
	console.log(`Server is up on port ${port}`);
});
