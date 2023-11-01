const { AuthenticationError } = require("apollo-server-express");
const { User, BooksRead, BookInfo } = require("../models");
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
        .populate("booksRead")
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

    allBooksRead: async (parent, { username }) => {
      try {
        const params = username ? { username } : {};

        const booksRead = await BooksRead.find(params);

        return booksRead;
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

    readBook: async (
      parent,
      { bookInfoId, review, rating, pagesRead },
      context
    ) => {
      try {
        if (context.user) {
          // Create a new BooksRead entry
          const newBookRead = new BooksRead({
            user: context.user._id,
            bookInfo: bookInfoId,
            review,
            rating,
            pagesRead,
          });

          // Save the new bookRead entry
          const savedBookRead = await newBookRead.save();

          // Update the user's `booksRead` array with the new bookRead ID
          await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { booksRead: savedBookRead._id } },
            { new: true }
          );

          return savedBookRead;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error reading book:", error);
        throw new Error("Failed to read the book");
      }
    },

    // update rating on book read vvv

    updateRating: async (parent, { bookReadId, rating }, context) => {
      try {
        if (context.user) {
          // Find the bookRead entry by ID and ensure it belongs to the logged-in user
          const bookRead = await BooksRead.findOne({
            _id: bookReadId,
            user: context.user._id,
          });

          if (!bookRead) {
            throw new UserInputError("Read history entry not found");
          }

          // Update the rating of the bookRead entry
          bookRead.rating = rating;

          // Save the updated bookRead entry
          const updatedBookRead = await bookRead.save();

          return updatedBookRead;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error updating rating:", error);
        throw new Error("Failed to update the rating");
      }
    },

    // update review of book read vvv

    updateReview: async (parent, { bookReadId, review }, context) => {
      try {
        if (context.user) {
          // Find the bookRead entry by ID and ensure it belongs to the logged-in user
          const bookRead = await BooksRead.findOne({
            _id: bookReadId,
            user: context.user._id,
          });

          if (!bookRead) {
            throw new UserInputError("Read history not found");
          }

          // Update the review of the bookRead entry
          bookRead.review = review;

          // Save the updated bookRead entry
          const updatedBookRead = await bookRead.save();

          return updatedBookRead;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to update the review");
      }
    },

    // delete review of book read vvv

    deleteReview: async (parent, { bookReadId }, context) => {
      try {
        if (context.user) {
          // Find the bookRead entry by ID and ensure it belongs to the logged-in user
          const bookRead = await BooksRead.findOne({
            _id: bookReadId,
            user: context.user._id,
          });

          if (!bookRead) {
            throw new UserInputError("BookRead entry not found");
          }

          // Delete the bookRead entry
          await bookRead.remove();

          return { message: "Review deleted successfully" };
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.error("Error deleting review:", error);
        throw new Error("Failed to delete the review");
      }
    },

    // ability to add a comment vvv

    addComment: async (parent, { bookReadId, text }, context) => {
      try {
        if (context.user) {
          // Find the bookRead entry by ID and ensure it belongs to the logged-in user
          const bookRead = await BooksRead.findOne({
            _id: bookReadId,
            user: context.user._id,
          });

          if (!bookRead) {
            throw new UserInputError("BookRead entry not found");
          }

          // Create a new comment
          const newComment = new Comment({
            user: context.user._id,
            booksRead: bookReadId,
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
            comment.booksRead.user.toString() === context.user._id.toString()
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
