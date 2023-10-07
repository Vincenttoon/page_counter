function countTotalBooks(books) {
  return books.length;
}

function countYearlyBooks(books, currentDate) {
  const currentYear = currentDate.getFullYear();

  const yearlyBooks = books.filter((book) => {
    const bookYear = new Date(book.createdAt).getFullYear();
    return bookYear === currentYear;
  });

  return yearlyBooks.length;
}

function countMonthlyBooks(books, currentDate) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthlyBooks = books.filter((book) => {
    const bookYear = new Date(book.createdAt).getFullYear();
    const bookMonth = new Date(book.createdAt).getMonth();

    return bookYear === currentYear && bookMonth === currentMonth;
  });

  return monthlyBooks.length;
}

module.exports = {
  countTotalBooks,
  countYearlyBooks,
  countMonthlyBooks,
};
