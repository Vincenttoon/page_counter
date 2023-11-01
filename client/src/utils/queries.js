// Import Packages
import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      booksLoggedCount
      booksLogged {
        _id
        createdAt
        review
        rating
        pagesRead
        bookInfo {
          _id
          authors
          description
          bookId
          image
          link
          title
          averageRating
          pageCount
        }
        comments {
          _id
          user
          text
          createdAt
        }
        commentCount
        stashedBooks {
          _id
          user
          stashedAt
          bookInfo {
            _id
            authors
            description
            bookId
            image
            link
            title
            averageRating
            pageCount
          }
        }
        stashedBooksCount
        worms {
          _id
          user
          wormCount
          booksLoggedCount
        }
        wormCount
      }
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      booksLoggedCount
      stashedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksLoggedCount
      }
    }
  }
`;
// VVV Query All Users

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      email
      booksLoggedCount
      stashedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksLoggedCount
      }
    }
  }
`;

export const QUERY_USERS_BY_NAME = gql`
  query getUsersByName($username: String!) {
    usersByName(username: $username) {
      _id
      username
      email
      booksLoggedCount
      stashedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksLoggedCount
      }
    }
  }
`;

export const QUERY_ALL_BOOKS_LOGGED = gql`
  {
    allBooksLogged {
      _id
      createdAt
      review
      rating
      pagesRead
      user
      bookInfo {
        _id
        authors
        description
        bookId
        image
        link
        title
        averageRating
        pageCount
      }
      comments {
        _id
        user
        text
        createdAt
      }
      stashedBooks {
        _id
        user
        savedAt
        bookInfo {
          _id
          authors
          description
          bookId
          image
          link
          title
          averageRating
          pageCount
        }
      }
      worms {
        _id
        user
        wormCount
        booksLoggedCount
      }
    }
  }
`;

export const BASIC_QUERY_ALL_BOOKS_LOGGED = gql`
  {
    allBooksLogged {
      _id
      user
      bookInfo {
        _id
        authors
        title
        link
        image
        averageRating
        pageCount
      }
      commentCount
    }
  }
`;

export const QUERY_ALL_STASHED_BOOKS = gql`
  {
    allStashedBooks {
      _id
      stashedAt
      user
      bookInfo {
        _id
        authors
        description
        bookId
        image
        link
        title
        averageRating
        pageCount
      }
    }
  }
`;

export const QUERY_BOOK_BY_ID = gql`
  query QueryBookById($bookId: ID!) {
    bookById(bookId: $bookId) {
      _id
      authors
      description
      bookId
      image
      link
      title
      averageRating
      pageCount
    }
  }
`;

export const QUERY_SAVED_BOOK_BY_ID_OR_TITLE = gql`
  query QuerySavedBookByIdOrTitle($bookId: ID, $bookTitle: String) {
    savedBookByIdOrTitle(bookId: $bookId, bookTitle: $bookTitle) {
      _id
      savedAt
      user
      bookInfo {
        _id
        authors
        description
        bookId
        image
        link
        title
        averageRating
        pageCount
      }
    }
  }
`;

export const QUERY_STASHED_BOOK_BY_ID_OR_TITLE = gql`
  query QueryStashedBookByIdOrTitle($bookId: ID, $bookTitle: String) {
    stashedBookByIdOrTitle(bookId: $bookId, bookTitle: $bookTitle) {
      _id
      stashedAt
      user
      bookInfo {
        _id
        authors
        description
        bookId
        image
        link
        title
        averageRating
        pageCount
      }
    }
  }
`;

export const QUERY_LOGGED_BOOK_BY_ID_OR_TITLE = gql`
  query QueryLoggedBookByIdOrTitle($bookId: ID, $bookTitle: String) {
    loggedBookByIdOrTitle(bookId: $bookId, bookTitle: $bookTitle) {
      _id
      createdAt
      review
      rating
      pagesRead
      user
      bookInfo {
        _id
        authors
        description
        bookId
        image
        link
        title
        averageRating
        pageCount
      }
      comments {
        _id
        user
        text
        createdAt
      }
    }
  }
`;
