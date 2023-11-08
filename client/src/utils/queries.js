import { gql } from "@apollo/client";

// query for me (user)
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
        averageRating
        pageCount
      }
    }
  }
`;


export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
        averageRating
        pageCount
      }
    }
  }
`;
