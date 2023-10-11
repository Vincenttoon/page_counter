import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Header from './components/Header';

import Feed from './pages/Feed';

import './App.css';

// create http link to connect to graphQl backend
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Set AuthLink to tokens for authorization of logged in users
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// create new Apollo client for application, confirm authorization and use http link. Update Cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Header />
        <div className="container">
          <Routes>
            <Route path="" element={<Feed />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
