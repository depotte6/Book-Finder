const { AuthenticationError } = require('apollo-server-express');
const { User, Book  } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('books');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate('books');
        },
        books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Book.find(params).sort({ bookId: ID });
        },
        book:  (parent, { bookId }) => {
            return Book.findOne({ _id: bookId });
        },
        me: async (parent, args, context ) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          saveBook: async (parent, { book }, context ) => {
              if (context.user) {
                  const updatedUser = await User.findOneAndUpdate(
                      { _id: context.user._id },
                      { $addToSet: { savedBooks: book } },
                      { new: true }
                  )
                  return updatedUser; 
                } 
                throw new AuthenticationError('You need to be logged in');
          },
          removeBook: async (parent, { bookId }, context) => {
              if (context.user) {
                  const updatedUser = findOneAndUpdate(
                      { _id: context.user._id },
                      { $pull: { savedBooks: { bookId: bookId } } },
                      { new: true }
                  )
                  return updatedUser;
              }
          }
      
    }
};

module.exports = resolvers;