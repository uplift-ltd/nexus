import { createMakeUrl, makeQueryString, makeUrl } from "../src/urls.js";

const EXPRESS_URL_TEST_CASES = [
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
  [
    "/test-url/:tokenId/",
    { tokenId: "VGFza2xpc3Q6OTI=" },
    undefined,
    { trailingSlash: "remove" },
    "/test-url/VGFza2xpc3Q6OTI=",
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
  [
    "/test-url/:tokenId/:userId/",
    { tokenId: "VGFza2xpc3Q6OTI=", userId: "ABC123" },
    { id: "VGFza2xpc3Q6OTI=", msg: "Hello", null: null },
    { trailingSlash: "remove" },
    "/test-url/VGFza2xpc3Q6OTI=/ABC123?msg=Hello&id=VGFza2xpc3Q6OTI%3D",
  ],
] as const;

const TOKENS_REGEX = /:([^/]+)/g;

const NEXTJS_URL_TEST_CASES = EXPRESS_URL_TEST_CASES.map(
  ([url, ...testCase]) => [url.replace(TOKENS_REGEX, "[$1]"), ...testCase] as const
);

test.each(EXPRESS_URL_TEST_CASES)(
  "express style makeUrl (%s, %s, %s, %s)",
  (url, tokens, params, options, expected) => {
    // @ts-expect-error: tokens will complain because some of the provided URLs won't have tokens
    expect(makeUrl(url, tokens, params, options)).toBe(expected);
  }
);

test.each(NEXTJS_URL_TEST_CASES)(
  "next.js style makeUrl (%s, %s, %s, %s)",
  (url, tokens, params, options, expected) => {
    const nextjsMakeUrl = createMakeUrl({ dynamicUrlStyle: "nextjs" });
    // @ts-expect-error: tokens will complain because some of the provided URLs won't have tokens
    expect(nextjsMakeUrl(url, tokens, params, options)).toBe(expected);

    // @ts-expect-error: tokens will complain because some of the provided URLs won't have tokens
    expect(makeUrl(url, tokens, params, { ...options, dynamicUrlStyle: "nextjs" })).toBe(expected);
  }
);

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
  [
    "/test-url/[tokenId]/",
    { tokenId: "654" },
    undefined,
    { dynamicUrlStyle: "nextjs", trailingSlash: "remove" },
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
    absoluteUrl: {
      host: "test.uplift.ltd",
      https: true,
    },
  });

  const USERS_URL = "/users/:userId";
  const USERS_URL_WITH_SLASH = "/users/:userId/";

  expect(makeAbsoluteUrl(USERS_URL, { userId: 3213 })).toBe("https://test.uplift.ltd/users/3213");
  expect(makeAbsoluteUrl(USERS_URL, { userId: 3213 }, { term: "test" })).toBe(
    "https://test.uplift.ltd/users/3213?term=test"
  );

  expect(
    makeAbsoluteUrl(
      USERS_URL,
      { userId: 3213 },
      {},
      { absoluteUrl: { host: "http://localhost:8000" } }
    )
  ).toBe("http://localhost:8000/users/3213");
  expect(
    makeAbsoluteUrl(
      USERS_URL,
      { userId: 3213 },
      { term: "test" },
      { absoluteUrl: { host: "http://localhost:8000" } }
    )
  ).toBe("http://localhost:8000/users/3213?term=test");

  const makeAbsoluteUrlWithFunctions = createMakeUrl({
    absoluteUrl: {
      host: (url) => `url-length-${url.length}.uplift.ltd`,
      https: (url) => url.length > 25,
    },
  });

  expect(makeAbsoluteUrlWithFunctions(USERS_URL, { userId: 3213 })).toBe(
    `http://url-length-11.uplift.ltd/users/3213`
  );
  expect(makeAbsoluteUrlWithFunctions(USERS_URL, { userId: 3213 }, { term: "test" })).toBe(
    `http://url-length-11.uplift.ltd/users/3213?term=test`
  );

  const makeAbsoluteUrlWithFunctionsAndSlash = createMakeUrl({
    absoluteUrl: {
      host: (url) => `url-length-${url.length}.uplift.ltd`,
      https: (url) => url.length > 25,
    },
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
  [{ empty: "", msg: "Hello", null: null, undefined }, "msg=Hello"],
  [{}, ""],
  [{ terms: ["hello", "world"].join(",") }, "terms=hello%2Cworld"],
  [{ terms: ["hello", "world"].join(","), userId: 1354 }, "userId=1354&terms=hello%2Cworld"],
  [{ term: ["hello", "world"] }, "term=hello&term=world"],
  [{ term: ["hello", "world"], userId: 1354 }, "userId=1354&term=hello&term=world"],
])("makeQueryString (%s, %s)", (params, expected) => {
  expect(makeQueryString(params)).toBe(expected);
});

function doesUrlEndWithSlash(url: string) {
  const [path] = url.split("?");
  return path.endsWith("/");
}
