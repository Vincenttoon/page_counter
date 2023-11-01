// Import packages
import { gql } from "@apollo/client";

// LOGIN $$
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// ADD USER $$
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      success
      message
      user {
        _id
        username
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
            pageCount
          }
        }
      }
    }
  }
`;

export const REMOVE_SAVED_BOOK = gql`
  mutation removeSavedBook($bookId: ID!) {
    removeSavedBook(id: $bookId) {
      _id
    }
  }
`;

export const STASH_BOOK = gql`
  mutation stashBook($input: BookInput!) {
    stashBook(input: $input) {
      success
      message
      user {
        _id
        username
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
      }
    }
  }
`;

export const REMOVE_STASHED_BOOK = gql`
  mutation removeStashedBook($bookId: ID!) {
    removeStashedBook(id: $bookId) {
      _id
    }
  }
`;

export const ADD_WORM = gql`
  mutation addWorm($id: ID!) {
    addWorm(wormId: $id) {
      _id
      username
      worms {
        _id
        user
        wormCount
        booksReadCount
      }
    }
  }
`;

export const REMOVE_WORM = gql`
  mutation removeWorm($id: ID!) {
    removeWorm(wormId: $id) {
      _id
      username
      worms {
        _id
        worms
      }
    }
  }
`;

export const READ_BOOK = gql`
  mutation readBook(
    $bookInfoId: ID!
    $review: String
    $rating: Float
    $pagesRead: Int
  ) {
    readBook(
      bookInfoId: $bookInfoId
      review: $review
      rating: $rating
      pagesRead: $pagesRead
    ) {
      _id
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
      review
      rating
      pagesRead
      createdAt
      comments {
        _id
        user
        text
        createdAt
      }
    }
  }
`;

export const UPDATE_RATING = gql`
  mutation updateRating($bookReadId: ID!, $rating: Float!) {
    updateRating(bookReadId: $bookReadId, rating: $rating) {
      _id
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
      review
      rating
      pagesRead
      createdAt
      comments {
        _id
        user
        text
        createdAt
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation updateReview($bookReadId: ID!, $review: String!) {
    updateReview(bookReadId: $bookReadId, review: $review) {
      _id
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
      review
      rating
      pagesRead
      createdAt
      comments {
        _id
        user
        text
        createdAt
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation deleteReview($bookReadId: ID!) {
    deleteReview(bookReadId: $bookReadId) {
      message
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($bookReadId: ID!, $text: String!) {
    addComment(bookReadId: $bookReadId, text: $text) {
      _id
      user
      booksRead
      text
      createdAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;
