import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../../styles/SearchBooks.scss";
import { saveBookIds, getSavedBookIds } from "../../utils/localStorage";
import { SAVE_BOOK, STASH_BOOK } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState(Auth.getSavedBookIds()); // Use a function to get saved book IDs from local storage

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

  const navigate = useNavigate();

  const handleSaveBook = (book) => {
    if (book && book.volumeInfo) {
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

      // Log the input object to the console
      console.log("Input object:", input);

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
    } else {
      console.error("Invalid book data");
    }
  };

  const handleStashBook = (bookId) => {
    const bookToStash = searchResults.find((book) => book.id === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    const input = {
      bookInfo: {
        bookId: bookId,
        authors: bookToStash.volumeInfo.authors || ["No author to display"],
        title: bookToStash.volumeInfo.title,
        description: bookToStash.volumeInfo.description,
        image: bookToStash.volumeInfo.imageLinks?.thumbnail || "",
      },
      stashedAt: new Date().toISOString(),
    };

    stashBook({
      variables: {
        input,
      },
    })
      .then((response) => {
        if (response.data.stashBook.success) {
          // Handle success, show a success message or update state as needed
          console.log(
            "Book stashed successfully:",
            response.data.stashBook.message
          );
        } else {
          console.error(
            "Error stashing book:",
            response.data.stashBook.message
          );
        }
      })
      .catch((error) => {
        console.error("Error stashing book:", error);
      });
  };

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
