// Import packages
import { gql } from "@apollo/client";

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
