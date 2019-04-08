const express = require('express'); // base framework
const mongoose = require('mongoose'); // ORM library
const bodyParser = require('body-parser');
const app = express();
// create connection to mongodb
const db = mongoose.connect('mongodb://localhost/bookAPI'); // bookAPI is the name of the database
const bookRouter = express.Router();
// uses nodemon to configure environment variables
const port = process.env.PORT || 3000; // see package.json file

// data model import
const Book = require('./models/bookModel');

// use library for parsing request body to json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Can't hit this route directly
bookRouter.route('/books') // handles requests for this route
  .post((req, res) => {
    const book = new Book(req.body);
    book.save();

    return res.status(201).json(book);
  })
  .get((req, res) => {
    const query = {};
    // query string stored in query field on request
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      
      if(err) {
        return res.send(err)
      }
        return res.json(books);
    });
  });

// Can't hit this route directly
bookRouter.route('/books/:bookId') // handles requests for this route

  .get((req, res) => {

    Book.findById(req.params.bookId, (err, books) => {
      
      if(err) {
        return res.send(err)
      }
        return res.json(books);
    });
  });

app.use('/api', bookRouter); // set up handler for a route

// handler for the root
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// express is listening for requests on this port
app.listen(port, () => {
  console.log(`Running on port  ${port}`);
});

