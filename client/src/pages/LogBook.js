import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { QUERY_SAVED_BOOK_BY_ID_OR_TITLE } from "../utils/queries";
import { LOG_BOOK } from "../utils/mutations";

const LogBook = () => {
  const { bookId } = useParams();
  const { error, data } = useQuery(QUERY_SAVED_BOOK_BY_ID_OR_TITLE, {
    // Change QUERY_BOOK_BY_ID to QUERY_SAVED_BOOK_BY_ID_OR_TITLE
    variables: { bookId },
  });

  const [bookInfo, setBookInfo] = useState({});
  const [rating, setRating] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [review, setReview] = useState("");

  const [logBook] = useMutation(LOG_BOOK);

  useEffect(() => {
    if (error) {
      console.error("Error: ", error);
    } else if (data?.bookById) {
      setBookInfo(data.bookById);
    }
  }, [data, error]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await logBook({
        variables: {
          id: bookInfo._id,
          rating,
          pagesRead,
          review,
        },
      });

      console.log("Book read successfully:", data?.readBook);

      // Optionally, you can redirect the user to another page here
      // For example, after successfully logging a book, you can use a router to navigate to the user's bookshelf or another page.
    } catch (error) {
      console.error("Error reading book:", error);
    }
  };

  return (
    <div className="container">
      <div className="log-info-container">
        <h2>Log Book</h2>
        <div className="book-info">
          <h3>Title: {bookInfo.title}</h3>
          {bookInfo.authors && <p>Author(s): {bookInfo.authors.join(", ")}</p>}
          {bookInfo.pageCount && <p>Page Count: {bookInfo.pageCount}</p>}
          {bookInfo.image && (
            <img src={bookInfo.image} alt={`Cover of ${bookInfo.title}`} />
          )}
        </div>
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
            <label>Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <button type="submit">Log Book</button>
        </form>
      </div>
    </div>
  );
};

export default LogBook;
