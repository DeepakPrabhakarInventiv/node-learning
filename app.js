const express = require('express');
const hbs = require('hbs');
const app = express();
const { connectToDatabase, getDb } = require('./db'); // Import db module



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
app.get('/', async (req, res) => {

    try {
        // Ensure the database is connected
        await connectToDatabase();
        const db = getDb();

        //delete query
        // await db.collection('users').deleteOne({
        //     username: "ramji"
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })

        //Update Query
        // await db.collection('users').updateOne({
        //     username: 'ramji',
        // }, {
        //     $set: {
        //         email: "ramji@appinventiv.com"
        //     }
        // }).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // })



        // Fetch all users from the 'users' collection
        const users = await db.collection('users').find().toArray();

        console.log('Users:', users); // Log all users

        // Render the response
        res.render('index', {
            title: 'Welcome',
            message: 'This is the Home Page',
            users, // Pass users to the template if needed
        });

    } catch (err) {
        console.error('Failed to fetch users:', err);

        // Send an error response
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while fetching users.',
        });
    }

});

// Handle form submissions
app.post('/submit', (req, res) => {

    const { username, email } = req.body;

    connectToDatabase().then(() => {
        // Example: Insert data into the database after connection
        const db = getDb();

        db.collection('users').insertOne({
            username,
            email
        }).then(result => {
            console.log('User inserted:', result.insertedId);
            res.send(result.insertedId + " User inserted");
        }).catch(err => {
            console.error('Failed to insert user:', err);
        });

    }).catch(err => {
        console.error('Failed to connect to the database. Server not started.', err);
    });

    console.log(req.body);
    // const { search } = req.body; // Extract form data
    // console.log(`search: ${search}`); // Log data
    // res.send(`Form received! Name: ${search}`);
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
