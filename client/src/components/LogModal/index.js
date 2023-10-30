import React, { useState } from "react";

const LogModal = ({ isOpen, book, onClose, onLog }) => {
  const [rating, setRating] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleLogSubmit = () => {
    onLog({ book, rating, pagesRead, review });
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>Review Book</h2>
        <div className="log-info-container">
          <h2>Log Book</h2>
          <div className="book-info">
            <h3>Title: {book.title}</h3> {/* Update this line */}
            {book.authors && <p>Author(s): {book.authors.join(", ")}</p>}
            {book.pageCount && <p>Page Count: {book.pageCount}</p>}
            {book.image && (
              <img src={book.image} alt={`Cover of ${book.title}`} />
            )}
          </div>
          <form onSubmit={handleLogSubmit}>
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
          </form>
        </div>
        <button onClick={handleLogSubmit}>Submit Review</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LogModal;
