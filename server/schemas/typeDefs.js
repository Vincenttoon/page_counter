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
  
  input ReadBookInput {
    bookInfoId: ID!
    review: String!
    rating: Float!
    pagesRead: Int!
  }
  
  input UpdateRatingInput {
    bookReadId: ID!
    rating: Float!
  }
  
  input UpdateReviewInput {
    bookReadId: ID!
    review: String!
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
  
  type Auth {
    token: ID!
    user: User
  }
  
  type Query {
    me: User
    allUsers: [User]
    oneUser(username: String!): User
    allBooksRead(username: String): [BooksRead]
    allSavedBooks(username: String): [SavedBooks]
  }
  
  input SaveBookInput {
    bookInfo: ID!
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput!): SaveBookResponse
    removeSavedBook(bookId: ID!): RemoveSavedBookResponse
    addWorm(wormId: ID!): AddWormResponse
    removeWorm(wormId: ID!): RemoveWormResponse
    readBook(input: ReadBookInput!): BooksRead
    updateRating(input: UpdateRatingInput!): BooksRead
    updateReview(input: UpdateReviewInput!): BooksRead
    deleteReview(bookReadId: ID!): DeletionResponse
    addComment(bookReadId: ID!, text: String!): Comment
    deleteComment(commentId: ID!): String
  }
  
  # Boolean responses for mutations:
  
  type SaveBookResponse {
    success: Boolean!
    message: String!
    user: User
  }
  
  type RemoveSavedBookResponse {
    success: Boolean!
    message: String!
    user: User
  }
  
  type AddWormResponse {
    success: Boolean!
    message: String!
    user: User 
  }
  
  type RemoveWormResponse {
    success: Boolean!
    message: String!
    user: User
  }
  
  type DeletionResponse {
    message: String
  }
`
