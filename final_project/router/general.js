const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

function getBooks() {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation
      resolve(JSON.stringify(books,null,4));
    });
  }

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //res.send(JSON.stringify(books,null,4));
  const allBooks = await getBooks();
  res.send(allBooks);
});

function getBooksForISBN(isbn) {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation
      resolve(books[isbn]);
    });
  }
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) =>{
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  
  const bookData = await getBooksForISBN(req.params.isbn);
  res.send(bookData);
  
 });

 function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation
      const booksKeys = [];
      let i=0;
        for(let key in books){
            booksKeys[i++] = key;
        }
        let selectedBook = [];
        
        for(i =0; i < booksKeys.length; i++){
            if(books[booksKeys[i]].author == author){
                selectedBook.push(books[booksKeys[i]]);
            }
        }
        resolve(selectedBook);
    });
  }
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  
    const selectedBook = await getBooksByAuthor(req.params.author);
    res.send(selectedBook);
  
});

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation
      const booksKeys = [];
      let i=0;
        for(let key in books){
            booksKeys[i++] = key;
        }
        let selectedBook = [];
        
        for(i =0; i < booksKeys.length; i++){
            if(books[booksKeys[i]].title == title){
                selectedBook.push(books[booksKeys[i]]);
            }
        }
        
        resolve(selectedBook);
    });
  }

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const selectedBook = await getBooksByTitle(req.params.title);
  res.send(selectedBook);
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;

  if(isbn){
    for(key in books){
        if(key == isbn){
            res.send(books[key].reviews);
        }
    }
  }
});

module.exports.general = public_users;
