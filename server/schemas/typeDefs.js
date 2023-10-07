const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    booksRead: [BooksRead]
    booksReadCount: Int
    savedBooks: [SavedBooks]
    savedBooksCount: Int
    worms: [Worms]
    wormsCount: Int
  }

  type BooksRead {
    _id: ID
    user: User
    bookInfo: BookInfo
    review: String
    rating: Float
    pagesRead: Int
    createdAt: String
  }

  type SavedBooks {
    _id: ID
    user: User
    bookInfo: BookInfo
    savedAt: String
  }

  type BookInfo {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
    averageRating: Float
  }

  type Worms {
    _id: ID
    user: User
    friends: [User]
  }

  type Comment {
    _id: ID
    user: User
    booksRead: BooksRead
    text: String
    createdAt: String
  }
`;
