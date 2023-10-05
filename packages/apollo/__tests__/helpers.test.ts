import { gql } from "@apollo/client";
import { getQueryBody, getQueryName } from "../src/helpers.js";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
    }
  }
`;

const CURRENT_USER_QUERY_BODY = `
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

const LOGIN_QUERY_BODY = `
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

const CURRENT_USER_FRAGMENT_BODY = `
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

const CURRENT_USER_WITH_FRAGMENT_QUERY_BODY = `
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

  describe("getQueryBody", () => {
    it("should get the query body", () => {
      const queryBody = getQueryBody(CURRENT_USER_QUERY);
      expect(queryBody).toEqual(CURRENT_USER_QUERY_BODY);
    });

    it("should get the mutation body", () => {
      const queryBody = getQueryBody(LOGIN_QUERY);
      expect(queryBody).toEqual(LOGIN_QUERY_BODY);
    });

    it("should work with fragment first", () => {
      const queryBody = getQueryBody(CURRENT_USER_WITH_FRAGMENT_QUERY);
      expect(queryBody).toEqual(CURRENT_USER_WITH_FRAGMENT_QUERY_BODY);
    });

    it("should not throw if no operation", () => {
      const queryBody = getQueryBody(CURRENT_USER_FRAGMENT);
      expect(queryBody).toEqual(CURRENT_USER_FRAGMENT_BODY);
    });
  });
});
