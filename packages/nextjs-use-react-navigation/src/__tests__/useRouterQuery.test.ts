/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryStringParametersMap } from "@uplift-ltd/strings";
import { RouterParamMapFromURLs, RouterQueryResult } from "../useRouterQuery.js";

const USER_URL = "/users/:userId";
const USER_ITEM_URL = "/users/:userId/items/:itemId";

const TEAM_USER_URL = "/teams/:teamId/users/:userId";
const TEAM_USER_ITEM_URL = "/teams/:teamId/users/:userId/items/:itemId";

test("Parsed params/tokens are always string", () => {
  type TestRouterParams = RouterParamMapFromURLs<
    typeof TEAM_USER_ITEM_URL | typeof TEAM_USER_URL | typeof USER_ITEM_URL | typeof USER_URL
  >;

  // These are all valid
  const userUrlParams: TestRouterParams = { userId: "654564" };
  const userItemUrlParams: TestRouterParams = { itemId: "65445", userId: "654564" };
  const teamUserUrlParams: TestRouterParams = { teamId: "98798", userId: "654564" };
  const teamUserItemUrlParams: TestRouterParams = {
    itemId: "654564",
    teamId: "9878957",
    userId: "654564",
  };

  // These should all have type errors
  //
  // @ts-expect-error: companyId is not in TestRouterParams
  const invalidUrlParams: TestRouterParams = { companyId: "654564" };

  // @ts-expect-error: userId should not be a number
  const userUrlParamsWithNumber: TestRouterParams = { userId: 654564 };

  // empty test
  expect(true).toBeTruthy();
});

test("useRouterQuery returns record of key: string", () => {
  // default type given to useRouterQuery
  type DefaultRouterQueryResult = RouterQueryResult<QueryStringParametersMap>;

  // any key should be valid as long as the value is a string by default
  const userUrlParams: DefaultRouterQueryResult = {
    otherId: "6546544",
    teamId: "654654",
    userId: "654564",
  };

  const invalidUserUrlParams: DefaultRouterQueryResult = {
    otherId: "6546544",
    teamId: "654654",
    // @ts-expect-error: should only support strings as values
    userId: 654564,
  };

  const explicitlyProvidedParams: RouterQueryResult<"next" | "test"> = {
    next: "home",
    test: "6546544",
  };

  const explicitlyProvidedParamsButInvalid: RouterQueryResult<"next" | "test"> = {
    next: "home",
    test: "6546544",
    // @ts-expect-error: this property does not exist in the above type
    otherId: "lkjlk",
  };
});
