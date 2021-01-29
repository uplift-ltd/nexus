---
title: strings
---

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

### env

Helper to retrieve values from process.env with an optional default value

```ts
import { env } from "@uplift-ltd/strings";

env("REACT_APP_SPECIAL_VALUE", "JUST_IN_CASE"); // => "JUST_IN_CASE"
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

### safeJoin (and friends)

safeJoin is a higher-order function to make joining functions that will clean up it's input. Given
variadic unknown arguments, it will remove any falsey values, convert numbers to strings, trim each
component and join with the given delimiter. There are some pre-built safeJoin fns included,
(safeJoinWithSpace, safeJoinWithComma, safeJoinWithEnDash, safeJoinWithEmDash)

```ts
import {
  safeJoin,
  safeJoinWithSpace,
  safeJoinWithComma,
  safeJoinWithEnDash,
  safeJoinWithEmDash,
} from "@uplift-ltd/strings";

safeJoin(":"); // => function that accepts variadic args to be joined
safeJoin(":")("hello", "world"); // => "hello:world"
safeJoinWithSpace("hello", "", false, "world"); // "hello world"
safeJoinWithComma("hello", "", false, "world"); // "hello, world"
safeJoinWithEnDash("hello", "", false, "world"); // "hello–world"
safeJoinWithEmDash("hello", "", false, "world"); // "hello – world"
```
