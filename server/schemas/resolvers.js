const { AuthenticationError } = require("apollo-server-express");
const {
  User,
  BooksLogged,
  BookInfo,
  StashedBooks,
  SavedBooks,
} = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // check if user is authenticated
      if (context.user) {
        // context.user already contains the user data, so you can return it directly
        return context.user;
      }
      throw new AuthenticationError("Not logged in");
    },

    // Finds all users vvv

    allUsers: async () => {
      return User.find()
        .select("-__v -password")
        .populate("booksLogged")
        .populate("worms");
    },

    // Finds user based on username vvv

    oneUser: async (parent, { username }, context) => {
      try {
        const user = await User.findOne({ username }).select("-__v -password");

        if (!user) {
          throw new UserInputError("User not found");
        }

        return user;
      } catch (error) {
        console.error("Error fetching user by username:", error);
        throw new Error("Failed to fetch user by username.");
      }
    },

    // Query for all books read vvv

    allBooksLogged: async (parent, { username }) => {
      try {
        const params = username ? { username } : {};

        const booksLogged = await BooksLogged.find(params);

        return booksLogged;
      } catch (error) {
        console.error("Error fetching books read:", error);
        throw new Error("Failed to fetch books read.");
      }
    },

    // Query to find all of a Users savedBooks
    allSavedBooks: async (parent, { username }) => {
      try {
        const params = username ? { username } : {};

        const user = await User.findOne(params).populate("savedBooks");

        if (!user) {
          throw new UserInputError("User not found");
        }

        const savedBooks = user.savedBooks;

        return savedBooks;
      } catch (error) {
        console.error("Error fetching saved books:", error);
        throw new Error("Failed to fetch saved books.");
      }
    },

    allStashedBooks: async (parent, { username }) => {
      try {
        const params = username ? { username } : {};

        // Find the user based on the provided username (if any)
        const user = await User.findOne(params).populate("stashedBooks");

        if (!user) {
          throw new UserInputError("User not found");
        }

        const stashedBooks = user.stashedBooks;

        return stashedBooks;
      } catch (error) {
        console.error("Error fetching stashed books:", error);
        throw new Error("Failed to fetch stashed books.");
      }
    },

    bookById: async (_, { bookId }) => {
      try {
        const book = await BookInfo.findById(bookId);
        return book;
      } catch (error) {
        throw new ApolloError("Book not found", "INTERNAL_SERVER_ERROR", {
          error,
        });
      }
    },

    // Fetch a specific stashed book by its ID or title
    stashedBookByIdOrTitle: async (parent, { bookId, bookTitle }) => {
      try {
        if (bookId) {
          // If bookId is provided, search by ID
          const stashedBook = await StashedBooks.findById(bookId);
          return stashedBook;
        } else if (bookTitle) {
          // If bookTitle is provided, search by title
          const stashedBook = await StashedBooks.findOne({ title: bookTitle });
          return stashedBook;
        } else {
          // If neither bookId nor bookTitle is provided, return null
          return null;
        }
      } catch (error) {
        console.error("Error fetching stashed book:", error);
        throw new Error("Failed to fetch stashed book.");
      }
    },

    // Fetch a specific saved book by its ID or title
    savedBookByIdOrTitle: async (parent, { bookId, bookTitle }) => {
      try {
        if (bookId) {
          // If bookId is provided, search by ID
          const savedBook = await SavedBooks.findById(bookId);
          return savedBook;
        } else if (bookTitle) {
          // If bookTitle is provided, search by title
          const savedBook = await SavedBooks.findOne({ title: bookTitle });
          return savedBook;
        } else {
          // If neither bookId nor bookTitle is provided, return null
          return null;
        }
      } catch (error) {
        console.error("Error fetching saved book:", error);
        throw new Error("Failed to fetch saved book.");
      }
    },

    // Fetch a specific logged book by its ID or title
    loggedBookByIdOrTitle: async (parent, { bookId, bookTitle }) => {
      try {
        if (bookId) {
          // If bookId is provided, search by ID
          const loggedBook = await BooksLogged.findById(bookId);
          return loggedBook;
        } else if (bookTitle) {
          // If bookTitle is provided, search by title
          const loggedBook = await BooksLogged.findOne({ title: bookTitle });
          return loggedBook;
        } else {
          // If neither bookId nor bookTitle is provided, return null
          return null;
        }
      } catch (error) {
        console.error("Error fetching logged book:", error);
        throw new Error("Failed to fetch logged book.");
      }
    },
  },

  //   VVV Mutations

  Mutation: {
    // Login vvv

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    // mutation for adding users to database through GraphQl
    addUser: async (parent, args) => {
      try {
        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({
          $or: [{ email: args.email }, { username: args.username }],
        });

        if (existingUser) {
          // User with the same email or username already exists
          return new Error("User with this email or username already exists.");
        }

        // If no existing user, create a new user
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
      } catch (error) {
        // Handle other errors, such as database errors
        console.error(error);
        return new Error("An error occurred while creating the user.");
      }
    },

    // Save book for later vvv

    saveBook: async (parent, { input }, context) => {
      try {
        if (context.user) {
          // Check if the book is already saved to prevent duplicates
          const user = await User.findOne({
            _id: context.user._id,
            "savedBooks.bookInfo": input.bookInfo,
          });

          if (user) {
            return {
              success: false,
              message: "Book is already saved",
            };
          }

          // Add the book to the user's savedBooks array
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true }
          );

          return {
            success: true,
            message: "Book saved successfully",
            user: updatedUser,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Failed to save book");
      }
    },

    // Remove from Saved for later list vvv

    removeSavedBook: async (parent, { bookId }, context) => {
      try {
        if (context.user) {
          // Find the user by ID
          const user = await User.findById(context.user._id);

          if (!user) {
            throw new Error("User not found");
          }

          // Check if the book exists in the user's savedBooks array
          const savedBookIndex = user.savedBooks.findIndex(
            (savedBook) => savedBook.bookInfo.toString() === bookId
          );

          if (savedBookIndex === -1) {
            return {
              success: false,
              message: "Book not found in saved list",
            };
          }

          // Remove the book from the savedBooks array
          user.savedBooks.splice(savedBookIndex, 1);

          // Save the updated user
          await user.save();

          return {
            success: true,
            message: "Book removed from saved list",
            user,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error removing saved book:", error);
        throw new Error("Failed to remove saved book");
      }
    },

    // Stash book for later

    stashBook: async (parent, { input }, context) => {
      try {
        if (context.user) {
          // Check if the book is already stashed to prevent duplicates
          const user = await User.findOne({
            _id: context.user._id,
            "stashedBooks.bookInfo": input.bookInfo,
          });

          if (user) {
            return {
              success: false,
              message: "Book is already stashed",
            };
          }

          // Add the book to the user's stashedBooks array
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { stashedBooks: input } },
            { new: true }
          );

          return {
            success: true,
            message: "Book stashed for later reading successfully",
            user: updatedUser,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error stashing book:", error);
        throw new Error("Failed to stash book for later reading");
      }
    },

    // Remove Stashed Books:

    removeStashedBook: async (parent, { bookId }, context) => {
      try {
        if (context.user) {
          // Find the user by ID
          const user = await User.findById(context.user._id);

          if (!user) {
            throw new Error("User not found");
          }

          // Check if the book exists in the user's stashedBooks array
          const stashedBookIndex = user.stashedBooks.findIndex(
            (stashedBook) => stashedBook.bookInfo.toString() === bookId
          );

          if (stashedBookIndex === -1) {
            return {
              success: false,
              message: "Book not found in stashed list",
            };
          }

          // Remove the book from the stashedBooks array
          user.stashedBooks.splice(stashedBookIndex, 1);

          // Save the updated user
          await user.save();

          return {
            success: true,
            message: "Book removed from stashed list",
            user,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error removing stashed book:", error);
        throw new Error("Failed to remove stashed book");
      }
    },

    // Add Friend (Worm) vvv

    addWorm: async (parent, { wormId }, context) => {
      try {
        if (context.user) {
          // Find the user by ID
          const user = await User.findById(context.user._id);

          if (!user) {
            throw new Error("User not found");
          }

          // Check if the worm (friend) exists in the user's worms array
          const wormExists = user.worms.some(
            (existingWorm) => existingWorm.toString() === wormId
          );

          if (wormExists) {
            return {
              success: false,
              message: "Worm is already added",
            };
          }

          // Add the worm to the worms array
          user.worms.push(wormId);

          // Save the updated user
          await user.save();

          return {
            success: true,
            message: "Worm added successfully",
            user,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error adding worm:", error);
        throw new Error("Failed to add worm");
      }
    },

    // Remove Friend (worm ): ) vvv

    removeWorm: async (parent, { wormId }, context) => {
      try {
        if (context.user) {
          // Find the user by ID
          const user = await User.findById(context.user._id);

          if (!user) {
            throw new Error("User not found");
          }

          // Check if the worm (friend) exists in the user's worms array
          const wormIndex = user.worms.findIndex(
            (existingWorm) => existingWorm.toString() === wormId
          );

          if (wormIndex === -1) {
            return {
              success: false,
              message: "Worm not found in your list",
            };
          }

          // Remove the worm from the worms array
          user.worms.splice(wormIndex, 1);

          // Save the updated user
          await user.save();

          return {
            success: true,
            message: "Worm removed successfully",
            user,
          };
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error removing worm:", error);
        throw new Error("Failed to remove worm");
      }
    },

    // review of book read vvv

    logBook: async (
      parent,
      { bookInfoId, review, rating, pagesRead },
      context
    ) => {
      try {
        if (context.user) {
          // Check if the book is already saved in the user's savedBooks
          const user = await User.findOne({
            _id: context.user._id,
            "savedBooks.bookInfo": bookInfoId,
          });

          if (user) {
            // The book is already saved, so we can proceed to log it

            // Create a new BooksLogged entry
            const newBookLogged = new BooksLogged({
              user: context.user._id,
              bookInfo: bookInfoId,
              review,
              rating,
              pagesRead,
            });

            // Save the new bookLogged entry
            const savedBookLogged = await newBookLogged.save();

            // Update the user's `booksLogged` array with the new bookLogged ID
            await User.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { booksLogged: savedBookLogged._id } },
              { new: true }
            );

            return savedBookLogged;
          } else {
            // The book is not saved, so we should not proceed to log it
            return {
              success: false,
              message: "You need to save the book before logging it.",
            };
          }
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error reading book:", error);
        throw new Error("Failed to read the book");
      }
    },

    // update rating on book read vvv

    updateRating: async (parent, { bookLoggedId, rating }, context) => {
      try {
        if (context.user) {
          // Find the bookLogged entry by ID and ensure it belongs to the logged-in user
          const bookLogged = await BooksLogged.findOne({
            _id: bookLoggedId,
            user: context.user._id,
          });

          if (!bookLogged) {
            throw new UserInputError("Read history entry not found");
          }

          // Update the rating of the bookLogged entry
          bookLogged.rating = rating;

          // Save the updated bookLogged entry
          const updatedbookLogged = await bookLogged.save();

          return updatedbookLogged;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error updating rating:", error);
        throw new Error("Failed to update the rating");
      }
    },

    // update review of book read vvv

    updateReview: async (parent, { bookLoggedId, review }, context) => {
      try {
        if (context.user) {
          // Find the bookLogged entry by ID and ensure it belongs to the logged-in user
          const bookLogged = await BooksLogged.findOne({
            _id: bookLoggedId,
            user: context.user._id,
          });

          if (!bookLogged) {
            throw new UserInputError("Read history not found");
          }

          // Update the review of the bookLogged entry
          bookLogged.review = review;

          // Save the updated bookLogged entry
          const updatedbookLogged = await bookLogged.save();

          return updatedbookLogged;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to update the review");
      }
    },

    // delete review of book read vvv

    deleteReview: async (parent, { bookLoggedId }, context) => {
      try {
        if (context.user) {
          // Find the bookLogged entry by ID and ensure it belongs to the logged-in user
          const bookLogged = await BooksLogged.findOne({
            _id: bookLoggedId,
            user: context.user._id,
          });

          if (!bookLogged) {
            throw new UserInputError("bookLogged entry not found");
          }

          // Delete the bookLogged entry
          await bookLogged.remove();

          return { message: "Review deleted successfully" };
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error deleting review:", error);
        throw new Error("Failed to delete the review");
      }
    },

    // ability to add a comment vvv

    addComment: async (parent, { bookLoggedId, text }, context) => {
      try {
        if (context.user) {
          // Find the bookLogged entry by ID and ensure it belongs to the logged-in user
          const bookLogged = await BooksLogged.findOne({
            _id: bookLoggedId,
            user: context.user._id,
          });

          if (!bookLogged) {
            throw new UserInputError("bookLogged entry not found");
          }

          // Create a new comment
          const newComment = new Comment({
            user: context.user._id,
            booksLogged: bookLoggedId,
            text,
          });

          // Save the comment
          await newComment.save();

          return newComment;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("Failed to add a comment");
      }
    },

    // ability to delete a comment, whether owner of the original post or the comment poster vvv

    deleteComment: async (parent, { commentId }, context) => {
      try {
        if (context.user) {
          // Find the comment by ID
          const comment = await Comment.findOne({ _id: commentId });

          if (!comment) {
            throw new UserInputError("Comment not found");
          }

          // Check if the user is the owner of the comment or the owner of the original post
          if (
            comment.user.toString() === context.user._id.toString() ||
            comment.booksLogged.user.toString() === context.user._id.toString()
          ) {
            // Delete the comment
            await comment.remove();
            return "Comment deleted successfully";
          } else {
            throw new AuthenticationError(
              "You don't have permission to delete this comment"
            );
          }
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete the comment");
      }
    },
  },
};

module.exports = resolvers;
