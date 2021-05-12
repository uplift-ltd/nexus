import { gql } from "@apollo/client";
import { getQueryName } from "../src/helpers";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
    }
  }
`;

const LOGIN_QUERY = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
    }
  }
`;

const CURRENT_USER_FRAGMENT = gql`
  fragment CurrentUserFragment on User {
    id
  }
`;

const CURRENT_USER_WITH_FRAGMENT_QUERY = gql`
  fragment CurrentUserFragment on User {
    id
  }

  query CurrentUserWithFragment {
    me {
      ...CurrentUserFragment
    }
  }
`;

describe("helpers", () => {
  describe("getQueryName", () => {
    it("should get the query name", () => {
      const queryName = getQueryName(CURRENT_USER_QUERY);
      expect(queryName).toEqual("CurrentUser");
    });

    it("should get the mutation name", () => {
      const queryName = getQueryName(LOGIN_QUERY);
      expect(queryName).toEqual("LoginUser");
    });

    it("should work with fragment first", () => {
      const queryName = getQueryName(CURRENT_USER_WITH_FRAGMENT_QUERY);
      expect(queryName).toEqual("CurrentUserWithFragment");
    });

    it("should throw if no operation", () => {
      expect(() => getQueryName(CURRENT_USER_FRAGMENT)).toThrow();
    });
  });
});
