const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Query {
        me: User
    }
    type Auth {
        token: ID!
        user: User
    }
    input saveBookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        forSale: String
        link: String
        title: String
    }
    type Mutation {
        login(email: String!, password: String!): auth
        addUser(username: String!, email: Strin!, password: String!): Auth
        saveBook(book: saveBookInput): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typDefs;