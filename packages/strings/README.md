# @uplift-ltd/strings

## Installation

    yarn add @uplift-ltd/strings

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

### makeUrl

makeUrl is used to easily replace Url Tokens and optionally, append querystring params. Any
null/undefined tokens or params are filtered out and will not make it into the final url string.

makeUrl can also control trailing slashes in your URLS.

- "ignore" will leave slash as-is
- "ensure" will ensure urls always end with a slash
- "remove" will ensure urls never end with a slash

```ts
import { makeUrl } from "@uplift-ltd/strings";

const USER_PROFILE_URL = "/user/:userId";
const USER_SERVICE_DETAILS_URL = "/user/:userId/:serviceId";

makeUrl(USER_PROFILE_URL, { userId: 654654 }); // => "/user/654654"
makeUrl(USER_SERVICE_DETAILS_URL, { userId: 654654, serviceId: "github" }); // => "/user/654654/github"
makeUrl(USER_SERVICE_DETAILS_URL, { userId: 654654, serviceId: "github" }, { tab: "repos" }); // => "/user/654654/github?tab=repos"

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

// Can also pass all config as a single object
makeUrl({
  url: USER_SERVICE_DETAILS_URL,
  tokens: { userId: 654654, serviceId: "github" },
  options: { trailingSlashes: "ensure" },
}); // => "/user/654654/github/"
```
