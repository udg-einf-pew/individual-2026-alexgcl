import { gql } from '@apollo/client/core';

export const REGISTER = gql`
  mutation Register($user: Register!) {
    register(user: $user)
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const PROFILE = gql`
  query Profile {
    profile {
      id
      name
      email
      role
    }
  }
`;
