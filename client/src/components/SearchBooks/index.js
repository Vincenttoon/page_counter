import React, { useState } from "react";
import "../../styles/SearchBooks.scss";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  return (
    <div>
      <h2>Search Google Books</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results">
        {searchResults.map((book, index) => (
          <div key={index} className="search-result">
            <h3>{book.volumeInfo.title}</h3>
            <p>
              {book.volumeInfo.authors &&
                `Authors: ${book.volumeInfo.authors.join(", ")}`}
            </p>
            <p>{book.volumeInfo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
