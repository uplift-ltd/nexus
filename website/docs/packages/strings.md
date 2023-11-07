---
title: strings
---

## Installation

```sh
npm i --save @uplift-ltd/strings
```

## API

### capitalize

Returns the given string with it's first character uppercased

```ts
import { capitalize } from "@uplift-ltd/strings";

capitalize("uplift"); // => "Uplift"
```

### pluralize

Pluralize is a higher-order function useful for making pluralization helpers. Given a singular and
plural form of a word, you get a fn that takes in the object count and returns a string with the
count and the correct singular/plural form.

```ts
import { pluralize } from "@uplift-ltd/strings";

const getCarsLabel = pluralize("car", "cars");
getCarsLabel(5); // => "5 cars"
```

### formatPhoneNumber

formatPhoneNumber takes in a phone number of unknown format returns a US standard formatting

```ts
import { formatPhoneNumber } from "@uplift-ltd/strings";

formatPhoneNumber("7859179500"); // => "(785) 917-9500"
formatPhoneNumber("+17859179500"); // => "1 (785) 917-9500"
formatPhoneNumber("785917-9500"); // => "(785) 917-9500"
formatPhoneNumber("+1 785 9179500"); // => "1 (785) 917-9500"
```

### formatUsCurrency

formatUsCurrency takes in a number and formats it as US currency, optionally hiding the cents.

_NOTE: If using hideCents, it's up to you to round/ceil/floor the number as needed before passing it
to the fn._

```ts
import { formatUsCurrency } from "@uplift-ltd/strings";

formatUsCurrency(123.12); // => "$123.12"
formatUsCurrency(123.12, true); // => "$123"
```

### safeJsonParse

safeJsonParse takes in a string (hopefully serialized JSON!) and attempts to parse it. If parsing
fails, it will return the optional fallback or undefined.

```ts
import { safeJsonParse } from "@uplift-ltd/strings";

safeJsonParse('{"firstName": "John"}'); // => Object { firstName: "John" }
// invalid JSON string
safeJsonParse('{"firstName}'); // undefined
// invalid JSON string with fallback
safeJsonParse("", []); // => []

// also accepts the std JSON.parse reviver callback. NOTE: reviver is not applied to the fallback
safeJsonParse('{"firstName": "John"}', {}, (key, value) => {
  typeof value === "string" ? value.toLowerCase() : value;
}); // => { firstName: "john" }
safeJsonParse('{"firs', {}, (key, value) => {
  typeof value === "string" ? value.toLowerCase() : value;
}); // => {}
```

### safeJoin (and friends)

safeJoin is a higher-order function to make joining functions that will clean up it's input. Given
variadic unknown arguments, it will remove any falsey values, convert numbers to strings, trim each
component and join with the given delimiter. There are some pre-built safeJoin fns included,
(safeJoinWithSpace, safeJoinWithComma, safeJoinWithEnDash, safeJoinWithEmDash)

```ts
import {
  safeJoin,
  safeJoinTogether,
  safeJoinWithSpace,
  safeJoinWithComma,
  safeJoinWithEnDash,
  safeJoinWithEmDash,
} from "@uplift-ltd/strings";

safeJoin(":"); // => function that accepts variadic args to be joined
safeJoin(":")("hello", "world"); // => "hello:world"
safeJoinTogether("hello", "", false, "world"); // "helloworld"
safeJoinWithSpace("hello", "", false, "world"); // "hello world"
safeJoinWithComma("hello", "", false, "world"); // "hello, world"
safeJoinWithEnDash("hello", "", false, "world"); // "hello–world"
safeJoinWithEmDash("hello", "", false, "world"); // "hello – world"
```

### makeQueryString

Given an object of key/values, returns a properly encoded querystring for appending to a URL after
removing any falsey/missing values. Values as arrays will be appended multiple times. If you want to
add an array as comma separated, you will need to pass it as a string for the value.

```ts
makeQueryString({
  userId: 1234,
  search: null,
  repoName: "hello world",
  message: "",
}); // => "userId=1234&repoName=hello%20world"

// with array value
makeQueryString({
  term: ["hello", "world"],
  repoName: "hello world",
}); // => "repoName=hello%20world&term=hello&term=world"

// for comma separated values, join first
makeQueryString({
  terms: ["hello", "world"].join(","),
  repoName: "hello world",
}); // => "repoName=hello%20world&terms=hello%2Cworld"
```

### makeUrl

When constructing URLs, `makeUrl` will help with token replacement, querystring parameters, and can
optionally control trailing slashes.

When given a url with tokens, `makeUrl` will type check the tokens in the given url. This provides
autocompletion of tokens and ensures that values for all tokens are provided.

makeUrl has several options available,

1. Control over trailing slashes in your URLS.
   - "ignore" will leave slash as-is (default)
   - "ensure" will ensure urls always end with a slash
   - "remove" will ensure urls never end with a slash
1. Manage absolute url creation, as well as the origin and protocol
1. Choose Dynamic URL pathname parameter type.
   - `express` uses `:userId` style params (default)
   - `nextjs` uses `[userId]` style params

```ts
import { makeUrl } from "@uplift-ltd/strings";

const USER_PROFILE_URL = "/user/:userId";
const USER_SERVICE_DETAILS_URL = "/user/:userId/:serviceId";

const NEXTJS_USER_PROFILE_URL = "/user/[userId]";

makeUrl(USER_PROFILE_URL, { userId: 654654 }); // => "/user/654654"
makeUrl(USER_SERVICE_DETAILS_URL, { userId: 654654, serviceId: "github" }); // => "/user/654654/github"
makeUrl(USER_SERVICE_DETAILS_URL, { userId: 654654, serviceId: "github" }, { tab: "repos" }); // => "/user/654654/github?tab=repos"

makeUrl(NEXTJS_USER_PROFILE_URL, { userId: 654654 }, null, { dynamicUrlStyle: "nextjs" }); // => "/user/654654"

// trailingSlashes
const USER_SERVICE_DETAILS_URL_WITH_SLASH = `${USER_SERVICE_DETAILS_URL}/`;

makeUrl(USER_SERVICE_DETAILS_URL, { userId: 654654, serviceId: "github" }, { tab: "repos" }); // => "/user/654654/github?tab=repos"
makeUrl(
  USER_SERVICE_DETAILS_URL_WITH_SLASH,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" }
); // => "/user/654654/github/?tab=repos"

// same as omitting
makeUrl(
  USER_SERVICE_DETAILS_URL,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "ignore" }
); // => "/user/654654/github?tab=repos"
makeUrl(
  USER_SERVICE_DETAILS_URL_WITH_SLASH,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "ignore" }
); // => "/user/654654/github/?tab=repos"

// ensure slashes
makeUrl(
  USER_SERVICE_DETAILS_URL,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "ensure" }
); // => "/user/654654/github/?tab=repos"
makeUrl(
  USER_SERVICE_DETAILS_URL_WITH_SLASH,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "ensure" }
); // => "/user/654654/github/?tab=repos"

// remove slash
makeUrl(
  USER_SERVICE_DETAILS_URL,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "remove" }
); // => "/user/654654/github?tab=repos"
makeUrl(
  USER_SERVICE_DETAILS_URL_WITH_SLASH,
  { userId: 654654, serviceId: "github" },
  { tab: "repos" },
  { trailingSlashes: "remove" }
); // => "/user/654654/github?tab=repos"
```

### createMakeUrl

Constructs a custom version of `makeUrl` with default options. This makes it easy to add trailing
slashes to every link on your site as well as creating a second instance that is used for creating
absolute URLs. All options can be overriden manually during use by passing as the 4th argument.
