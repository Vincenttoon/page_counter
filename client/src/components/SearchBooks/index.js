import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../../styles/SearchBooks.scss";
import { SAVE_BOOK, STASH_BOOK } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Define the reviewBook and saveBook mutations and get the error and loading states
  const [saveBook] = useMutation(SAVE_BOOK);
  const [stashBook] = useMutation(STASH_BOOK);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error("Error searching Google Books API:", error);
    }
  };

  useEffect(() => {
    if (Auth.loggedIn()) {
      console.log("User is logged in");
    } else {
      console.log("User is not logged in");
    }
  }, []);

  const navigate = useNavigate();

  const handleSaveBook = (book) => {
    // Create the input object with the book data
    const input = {
      bookInfo: {
        // Populate the bookInfo object with the relevant data from your book object
        bookId: book.id,
        authors: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks.thumbnail,
        link: book.volumeInfo.link,
        title: book.volumeInfo.title,
        averageRating: book.volumeInfo.averageRating,
        pageCount: book.volumeInfo.pageCount,
      },
      savedAt: new Date().toISOString(),
    };

    // Make the saveBook mutation
    saveBook({
      variables: {
        input,
      },
    })
      .then((response) => {
        // Handle the response, for example, show a success message.
        console.log("Book saved successfully:", response);
      })
      .catch((error) => {
        // Handle errors, for example, show an error message.
        console.error("Error saving book:", error);
      });
  };

  const handleStashBook = (book) => {
    // Create the input object with the book data
    const input = {
      bookInfo: {
        // Populate the bookInfo object with the relevant data from your book object
        bookId: book.id,
        authors: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks.thumbnail,
        link: book.volumeInfo.link,
        title: book.volumeInfo.title,
        averageRating: book.volumeInfo.averageRating,
        pageCount: book.volumeInfo.pageCount,
      },
      savedAt: new Date().toISOString(),
    };

    // Make the saveBook mutation
    stashBook({
      variables: {
        input,
      },
    })
      .then((response) => {
        // Handle the response, for example, show a success message.
        console.log("Book stashed successfully:", response);

      })
      .catch((error) => {
        // Handle errors, for example, show an error message.
        console.error("Error stashing book:", error);
      });
  };

  // Function to toggle the description truncation
  const toggleDescription = (index) => {
    const updatedSearchResults = [...searchResults];
    updatedSearchResults[index].truncateDescription =
      !updatedSearchResults[index].truncateDescription;
    setSearchResults(updatedSearchResults);
  };

  return (
    <div className="container">
      <div className="search-div">
        <h2 className="h2-search-books">
          <FaSearch /> Find Books <FaBookOpen />{" "}
        </h2>
        <p className="p-search">
          {" "}
          ~ search powered by{" "}
          <a href="https://developers.google.com/books">
            Google Books Api
          </a> ~{" "}
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-text"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>
      </div>

      <div className="search-results">
        {searchResults.map((book, index) => (
          <div key={index} className="search-result">
            <h3>Title: {book.volumeInfo.title}</h3>
            {book.volumeInfo.authors && (
              <h4>
                Author(s):<p>{book.volumeInfo.authors.join(", ")}</p>
              </h4>
            )}
            {book.volumeInfo.imageLinks && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
              />
            )}

            {book.volumeInfo.description && (
              <div className="desc-div">
                <p>
                  {book.truncateDescription
                    ? book.volumeInfo.description
                    : `${book.volumeInfo.description.slice(0, 100)}...`}
                </p>
                {book.volumeInfo.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(index)}
                    className="desc-btn"
                  >
                    {book.truncateDescription ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}

            {book.volumeInfo.pageCount && (
              <p>Page Count: {book.volumeInfo.pageCount}</p>
            )}
            {book.volumeInfo.averageRating && (
              <p>Average Rating: {book.volumeInfo.averageRating}</p>
            )}
            {Auth.loggedIn() && (
              <div>
                <Link to={`/log-book/${book.id}`}>
                  <button
                    className="log-btn"
                    onClick={() => handleSaveBook(book)}
                  >
                    Log
                  </button>
                </Link>
                <Link to="/profile">
                  <button
                    className="stash-btn"
                    onClick={() => handleStashBook(book)}
                  >
                    Stash
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
