// Function to count total pages read in the current year
function countYearlyPages(books, currentDate) {
  const currentYear = currentDate.getFullYear();

  const yearlyPages = books
    .filter((book) => {
      const bookYear = new Date(book.createdAt).getFullYear();
      return bookYear === currentYear;
    })
    .reduce((total, book) => total + book.pagesRead, 0);

  return yearlyPages;
}

// Function to count total pages read in the current month
function countMonthlyPages(books, currentDate) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthlyPages = books
    .filter((book) => {
      const bookYear = new Date(book.createdAt).getFullYear();
      const bookMonth = new Date(book.createdAt).getMonth();
      return bookYear === currentYear && bookMonth === currentMonth;
    })
    .reduce((total, book) => total + book.pagesRead, 0);

  return monthlyPages;
}

module.exports = {
    countYearlyPages,
    countMonthlyPages,
}
