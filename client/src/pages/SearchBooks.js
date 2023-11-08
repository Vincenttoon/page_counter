import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import "../styles/SearchBooks.scss";
import { Link, useNavigate } from "react-router-dom";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_BOOK } from "../utils/mutations";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // uses mutation through apollo/react-hooks
  const [saveBook] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail,
        link: book.volumeInfo.link,
        title: book.volumeInfo.title,
        averageRating: book.volumeInfo.averageRating,
        pageCount: book.volumeInfo.pageCount,
      }));

      console.log(bookData);

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    console.log("Saving book with ID:", bookId);
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log("bookToSave:", bookToSave);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBook({
        variables: {
          input: bookToSave,
        },
      });

      if (!response) {
        throw new Error("Something went wrong!");
      }

      // Check if the save was successful
      if (response.data.saveBook) {
        console.log("Book saved successfully!");
        // You can set a success message state here if needed
      } else {
        console.error("Failed to save book.");
        // You can set an error message state here if needed
      }

      // if book successfully saves to the user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
      // Handle the error and set an error message state if needed
    }
  };

  const toggleDescription = (index) => {
    const updatedSearchResults = [...searchInput];
    updatedSearchResults[index].truncateDescription =
      !updatedSearchResults[index].truncateDescription;
    setSearchInput(updatedSearchResults);
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-text"
          />
          <button onClick={handleFormSubmit} className="search-btn">
            Search
          </button>
        </div>
      </div>

      <div className="search-results">
        {searchedBooks.map((book, index) => (
          <div key={index} className="search-result">
            <h3>Title: {book.title}</h3>
            {book.authors && (
              <h4>
                Author(s):<p>{book.authors.join(", ")}</p>
              </h4>
            )}
            {book.image && (
              <img src={book.image} alt={`Cover of ${book.title}`} />
            )}

            {book.description && (
              <div className="desc-div">
                <p>
                  {book.truncateDescription
                    ? book.description
                    : `${book.description.slice(0, 100)}...`}
                </p>
                {book.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(index)}
                    className="desc-btn"
                  >
                    {book.truncateDescription ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            )}

            {book.pageCount && <p>Page Count: {book.pageCount}</p>}
            {book.averageRating && <p>Average Rating: {book.averageRating}</p>}
            {Auth.loggedIn() && (
              <div>
                {/* <Link to={`/log-book/${book.bookId}`}>
                  <button
                    className="log-btn"
                    onClick={() => handleSaveBook(book.bookId)}
                  >
                    Log
                  </button>
                </Link> */}
                <Link to="/profile">
                  <button
                    className="stash-btn"
                    onClick={() => handleSaveBook(book.bookId)}
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
