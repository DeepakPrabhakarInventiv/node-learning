const express = require('express');
const hbs = require('hbs');
const app = express();


// Set view engine
app.set('view engine', 'hbs');

// Register partials
hbs.registerPartials(__dirname + '/views/partials');

// Serve static files
app.use(express.static('public'));

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true })); // For URL-encoded form data
app.use(express.json()); // For JSON payloads

// Routes
app.get('/', (req, res) => {

    res.render('index', {
        title: 'Welcome',
        message: 'This is the Home Page',
    });
});

// Handle form submissions
app.post('/submit', (req, res) => {
    // console.log(req.body);
    const { search } = req.body; // Extract form data
    console.log(`search: ${search}`); // Log data
    res.send(`Form received! Name: ${search}`);
});


app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
