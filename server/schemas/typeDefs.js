const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [SavedBooks]
    booksLogged: [BooksLogged]
    booksLoggedCount: Int
    stashedBooks: [StashedBooks]
    stashedBooksCount: Int
    worms: [Worms]
    wormsCount: Int
  }

  type BooksLogged {
    _id: ID
    user: User
    bookInfo: BookInfo
    review: String
    rating: Float
    pagesRead: Int
    createdAt: String
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
    pageCount: Int
  }

  type Worms {
    _id: ID
    user: User
    friends: [User]
  }

  type Comment {
    _id: ID
    user: User
    booksLogged: BooksLogged
    text: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type SavedBooks {
    _id: ID
    user: User
    bookInfo: BookInfo
    savedAt: String
  }

  type StashedBooks {
    _id: ID
    user: User
    bookInfo: BookInfo
    stashedAt: String
  }

  type Query {
    me: User
    allUsers: [User]
    user(username: String!): User
    oneUser(username: String!): User
    getUserSavedBooks(username: String!): User
    allBooksLogged(username: String): [BooksLogged]
    allSavedBooks(username: String): [SavedBooks]
    allStashedBooks(username: String): [StashedBooks]
    bookById(bookId: ID!): BookInfo
    stashedBookByIdOrTitle(bookId: ID, bookTitle: String): StashedBooks
    savedBookByIdOrTitle(bookId: ID, bookTitle: String): SavedBooks
    loggedBookByIdOrTitle(bookId: ID, bookTitle: String): BooksLogged
  }

  type Mutation {
    # Define your mutations here
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): SaveBookResponse
    removeSavedBook(bookId: ID!): RemoveSavedBookResponse
    stashBook(input: StashBookInput!): StashBookResponse
    removeStashedBook(bookId: ID!): RemoveStashedBookResponse
    addWorm(wormId: ID!): AddWormResponse
    removeWorm(wormId: ID!): RemoveWormResponse
    logBook(input: LoggedBookInput!): BooksLogged
    updateRating(input: UpdateRatingInput!): BooksLogged
    updateReview(input: UpdateReviewInput!): BooksLogged
    deleteReview(bookLoggedId: ID!): DeletionResponse
    addComment(bookLoggedId: ID!, text: String!): Comment
    deleteComment(commentId: ID!): String
  }

  input SaveBookInput {
    bookInfo: ID!
  }

  input StashBookInput {
    bookInfo: ID!
  }

  input LoggedBookInput {
    bookInfoId: ID!
    review: String!
    rating: Float!
    pagesRead: Int!
  }

  input UpdateRatingInput {
    bookLoggedId: ID!
    rating: Float!
  }

  input UpdateReviewInput {
    bookLoggedId: ID!
    review: String!
  }

  # Define Boolean responses
  type SaveBookResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type StashBookResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type RemoveSavedBookResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type RemoveStashedBookResponse {
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
`;

module.exports = typeDefs;
