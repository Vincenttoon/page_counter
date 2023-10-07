import { gql } from "@apollo/client";

// query for me (user)
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      booksRead {
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
            user
            booksRead
            text
            createdAt
        }
        savedBooks {
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
            }
            savedAt
        }
        worms {
            _id
            user
            wormCount
            booksReadCount
        }
        wormCount
      }
  }
`;
