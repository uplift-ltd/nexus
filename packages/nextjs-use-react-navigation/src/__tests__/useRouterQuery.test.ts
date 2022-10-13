/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouterParamMapFromURLs } from "../useRouterQuery";

const USER_URL = "/users/:userId";
const USER_ITEM_URL = "/users/:userId/items/:itemId";

const TEAM_USER_URL = "/teams/:teamId/users/:userId";
const TEAM_USER_ITEM_URL = "/teams/:teamId/users/:userId/items/:itemId";

test("Parsed params/tokens are always string", () => {
  type TestRouterParams = RouterParamMapFromURLs<
    typeof USER_URL | typeof TEAM_USER_URL | typeof USER_ITEM_URL | typeof TEAM_USER_ITEM_URL
  >;

  // These are all valid
  const userUrlParams: TestRouterParams = { userId: "654564" };
  const userItemUrlParams: TestRouterParams = { userId: "654564", itemId: "65445" };
  const teamUserUrlParams: TestRouterParams = { userId: "654564", teamId: "98798" };
  const teamUserItemUrlParams: TestRouterParams = {
    userId: "654564",
    teamId: "9878957",
    itemId: "654564",
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
