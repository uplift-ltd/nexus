import { createMakeUrl, makeUrl, makeQueryString } from "../src/urls";

test.each([
  ["/test-url/:tokenId", { tokenId: "654" }, undefined, undefined, "/test-url/654"],
  ["/test-url/:tokenId/", { tokenId: "654" }, undefined, undefined, "/test-url/654/"],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ignore" },
    "/test-url/654",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ignore" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ensure" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ensure" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "remove" },
    "/test-url/654",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "remove" },
    "/test-url/654",
  ],
  ["/test-url/:tokenId", { tokenId: "654" }, undefined, undefined, "/test-url/654"],
  ["/test-url/:tokenId", { tokenId: 123 }, undefined, undefined, "/test-url/123"],
  ["/test-url/:tokenId", { tokenId: 123 }, { msg: "Hello" }, undefined, "/test-url/123?msg=Hello"],
  [
    "/test-url/:tokenId/:userId",
    { tokenId: 987, userId: "ABC123" },
    undefined,
    undefined,
    "/test-url/987/ABC123",
  ],
  [
    "/test-url/:tokenId/:userId",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    undefined,
    "/test-url/987/ABC123?msg=Hello",
  ],

  [
    "/test-url/:tokenId/:userId",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    undefined,
    "/test-url/987/ABC123?msg=Hello",
  ],
  [
    "/test-url/:tokenId/:userId/",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    undefined,
    "/test-url/987/ABC123/?msg=Hello",
  ],

  [
    "/test-url/:tokenId/:userId",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    { trailingSlash: "ensure" },
    "/test-url/987/ABC123/?msg=Hello",
  ],
  [
    "/test-url/:tokenId/:userId/",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    { trailingSlash: "ensure" },
    "/test-url/987/ABC123/?msg=Hello",
  ],

  [
    "/test-url/:tokenId/:userId",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    { trailingSlash: "remove" },
    "/test-url/987/ABC123?msg=Hello",
  ],
  [
    "/test-url/:tokenId/:userId/",
    { tokenId: 987, userId: "ABC123" },
    { msg: "Hello", null: null, undefined },
    { trailingSlash: "remove" },
    "/test-url/987/ABC123?msg=Hello",
  ],
])("makeUrls (%s, %s, %s, %s)", (url, tokens, params, options, expected) => {
  // @ts-expect-error: tokens will complain because some of the provided URLs won't have tokens
  expect(makeUrl(url, tokens, params, options)).toBe(expected);
});

test.each([
  ["/test-url/:tokenId", { tokenId: "654" }, undefined, undefined, "/test-url/654"],
  ["/test-url/:tokenId/", { tokenId: "654" }, undefined, undefined, "/test-url/654/"],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ignore" },
    "/test-url/654",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ignore" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ensure" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "ensure" },
    "/test-url/654/",
  ],
  [
    "/test-url/:tokenId",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "remove" },
    "/test-url/654",
  ],
  [
    "/test-url/:tokenId/",
    { tokenId: "654" },
    undefined,
    { trailingSlash: "remove" },
    "/test-url/654",
  ],
])("createMakeUrl with trailing slash option", (url, tokens, params, options, expected) => {
  const myMakeUrl = createMakeUrl({ trailingSlash: "ignore" });
  const withTrailingSlash = createMakeUrl({ trailingSlash: "ensure" });
  const withoutTrailingSlash = createMakeUrl({ trailingSlash: "ensure" });

  const overriddenOptions = !!options;

  // @ts-expect-error
  const baseUrl = myMakeUrl(url, tokens, params, options);
  // @ts-expect-error
  const urlWithSlash = withTrailingSlash(url, tokens, params, options);
  // @ts-expect-error
  const urlWithoutSlash = withoutTrailingSlash(url, tokens, params, options);

  // should be created, unmodified
  expect(baseUrl).toBe(expected);

  if (overriddenOptions) {
    expect(urlWithSlash).toBe(expected);
  } else {
    expect(doesUrlEndWithSlash(urlWithSlash)).toBe(true);
  }

  if (overriddenOptions) {
    expect(urlWithoutSlash).toBe(expected);
  } else {
    expect(doesUrlEndWithSlash(urlWithoutSlash)).toBe(true);
  }
});

test("Test absolute URLs", () => {
  const makeAbsoluteUrl = createMakeUrl({
    absoluteUrl: true,
    absoluteUrlHttps: true,
    absoluteUrlOrigin: "test.uplift.ltd",
  });

  const USERS_URL = "/users/:userId";
  const USERS_URL_WITH_SLASH = "/users/:userId/";

  /*
   *  expect(makeAbsoluteUrl(USERS_URL, { userId: 3213 })).toBe("https://test.uplift.ltd/users/3213");
   *  expect(makeAbsoluteUrl(USERS_URL, { userId: 3213 }, { term: "test" })).toBe(
   *    "https://test.uplift.ltd/users/3213?term=test"
   *  );
   *
   *  const makeAbsoluteUrlWithFunctions = createMakeUrl({
   *    absoluteUrl: true,
   *    absoluteUrlHttps: (url) => url.length > 25,
   *    absoluteUrlOrigin: (url) => `url-length-${url.length}.uplift.ltd`,
   *  });
   *
   *  expect(makeAbsoluteUrlWithFunctions(USERS_URL, { userId: 3213 })).toBe(
   *    `http://url-length-11.uplift.ltd/users/3213`
   *  );
   *  expect(makeAbsoluteUrlWithFunctions(USERS_URL, { userId: 3213 }, { term: "test" })).toBe(
   *    `http://url-length-11.uplift.ltd/users/3213?term=test`
   *  );
   */

  const makeAbsoluteUrlWithFunctionsAndSlash = createMakeUrl({
    absoluteUrl: true,
    absoluteUrlHttps: (url) => url.length > 25,
    absoluteUrlOrigin: (url) => `url-length-${url.length}.uplift.ltd`,
    trailingSlash: "ensure",
  });

  expect(makeAbsoluteUrlWithFunctionsAndSlash(USERS_URL, { userId: 3213 })).toBe(
    `http://url-length-12.uplift.ltd/users/3213/`
  );
  expect(makeAbsoluteUrlWithFunctionsAndSlash(USERS_URL, { userId: 3213 }, { term: "test" })).toBe(
    `http://url-length-12.uplift.ltd/users/3213/?term=test`
  );
  expect(
    makeAbsoluteUrlWithFunctionsAndSlash(USERS_URL_WITH_SLASH, { userId: 3213 }, null, {
      trailingSlash: "remove",
    })
  ).toBe(`http://url-length-11.uplift.ltd/users/3213`);
  expect(
    makeAbsoluteUrlWithFunctionsAndSlash(
      USERS_URL_WITH_SLASH,
      { userId: 3213 },
      { term: "test" },
      {
        trailingSlash: "remove",
      }
    )
  ).toBe(`http://url-length-11.uplift.ltd/users/3213?term=test`);
});

test.each([
  [{ msg: "Hello", null: null, undefined, empty: "" }, "msg=Hello"],
  [{}, ""],
  [{ terms: ["hello", "world"].join(",") }, "terms=hello%2Cworld"],
  [{ userId: 1354, terms: ["hello", "world"].join(",") }, "userId=1354&terms=hello%2Cworld"],
  [{ term: ["hello", "world"] }, "term=hello&term=world"],
  [{ userId: 1354, term: ["hello", "world"] }, "userId=1354&term=hello&term=world"],
])("makeQueryString (%s, %s)", (params, expected) => {
  expect(makeQueryString(params)).toBe(expected);
});

function doesUrlEndWithSlash(url: string) {
  const [path] = url.split("?");
  return path.endsWith("/");
}
