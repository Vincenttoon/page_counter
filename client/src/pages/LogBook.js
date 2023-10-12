import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { READ_BOOK } from "../utils/mutations"; // Import your mutation from the correct location

const LogBook = () => {
  const [rating, setRating] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [comments, setComments] = useState("");

  const [readBook] = useMutation(READ_BOOK);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Trigger the readBook mutation with the collected data
    try {
      const { data } = await readBook({
        variables: {
          bookInfoId: "bookInfoIdHere", // You need to provide the bookInfoId
          rating,
          pagesRead,
          review: comments,
        },
      });

      // Handle the mutation response, e.g., show a success message
      console.log("Book read successfully:", data.readBook);

      // Optionally, redirect the user to another page or perform other actions
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error reading book:", error);
    }
  };

  return (
    <div className="container">
      <div className="log-info-container">
      <h2> Log Book </h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Rating (0-5):</label>
            <input
              type="number"
              step="0.25"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div>
            <label>Pages Read:</label>
            <input
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
            />
          </div>
          <div>
            <label>Comments:</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <button type="submit">Log Book</button>
        </form>
        {/* Add form elements for user input (rating, pages read, comments) here */}
      </div>
    </div>
  );
};

export default LogBook;
