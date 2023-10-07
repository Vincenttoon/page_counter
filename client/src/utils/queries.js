// Import Packages
import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      booksReadCount
      booksRead {
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
        }
        comments {
          _id
          user
          text
          createdAt
        }
        commentCount # Include commentCount directly in the query
        savedBooks {
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
          }
        }
        savedBooksCount
        worms {
          _id
          user
          wormCount
          booksReadCount
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
      booksReadCount
      savedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksReadCount
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
      booksReadCount
      savedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksReadCount
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
      booksReadCount
      savedBooksCount
      wormCount
      worms {
        _id
        user
        wormCount
        booksReadCount
      }
    }
  }
`;

export const QUERY_ALL_BOOKS_READ = gql`
  {
    allBooksRead {
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
      }
      comments {
        _id
        user
        text
        createdAt
      }
      savedBooks {
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
        }
      }
      worms {
        _id
        user
        wormCount
        booksReadCount
      }
    }
  }
`;

export const BASIC_QUERY_ALL_BOOKS_READ = gql`
  {
    allBooksRead {
        _id
        user
        bookInfo {
            _id
            authors
            title
            link
            image
            averageRating
        }
        commentCount
    }
  }
`

export const QUERY_ALL_SAVED_BOOKS = gql`
  {
    allSavedBooks {
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
      }
    }
  }
`;

