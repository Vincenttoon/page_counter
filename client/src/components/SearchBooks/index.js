import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import "../../styles/SearchBooks.scss";
import { SAVE_BOOK, READ_BOOK } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Define the reviewBook and saveBook mutations and get the error and loading states
  const [reviewBook, { loading: reviewLoading, error: reviewError }] =
    useMutation(READ_BOOK);
  const [saveBook, { loading: saveLoading, error: saveError }] =
    useMutation(SAVE_BOOK);

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

  // Handle the reviewBook and saveBook mutations when the buttons are clicked
  const handleReviewBook = (book) => {
    // Ensure you have implemented the logic for the reviewBook mutation
    reviewBook({
      variables: {
        input: {
          // Pass the book data as required by your mutation
          // For example: bookId, review, rating, pagesRead, etc.
        },
      },
    });
  };

  const handleSaveBook = (book) => {
    // Ensure you have implemented the logic for the saveBook mutation
    saveBook({
      variables: {
        input: {
          // Pass the book data as required by your mutation
          // For example: bookId, userId, savedAt, etc.
        },
      },
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
    <div>
      <div className="search-div">
        <h2>
          <FaSearch /> Search Books <FaBookOpen />{" "}
        </h2>
        <p> ~ search powered by Google Books Api </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="search-results">
        {searchResults.map((book, index) => (
          <div key={index} className="search-result">
            <h3>Title: {book.volumeInfo.title}</h3>
            {book.volumeInfo.authors && (
              <p>Author(s): {book.volumeInfo.authors.join(", ")}</p>
            )}
            {book.volumeInfo.imageLinks && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
              />
            )}

            {book.volumeInfo.description && (
              <div>
                <p>
                  {book.truncateDescription
                    ? book.volumeInfo.description
                    : `${book.volumeInfo.description.slice(0, 100)}...`}
                </p>
                {book.volumeInfo.description.length > 100 && (
                  <button onClick={() => toggleDescription(index)}>
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
                <button
                  className="book-btn"
                  onClick={() => handleReviewBook(book)}
                >
                  Log
                </button>
                <button
                  className="book-btn"
                  onClick={() => handleSaveBook(book)}
                >
                  Stash
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
