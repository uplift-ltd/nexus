---
title: ts-helpers
---

## Installation

    yarn add @uplift-ltd/ts-helpers

## API

### assertUnreachable

Invoke this assertion for an unreachable case.

```ts
import { assertUnreachable } from "@uplift-ltd/ts-helpers";

switch (condition) {
  case true:
    return bleh;
  default:
    assertUnreachable("invalid condition");
}
```

### notEmpty

Filter and array so typescript knows there are no null or undefined values.

```ts
import { notEmpty } from "@uplift-ltd/ts-helpers";

const array: (string | null)[] = ["foo", "bar", null, "zoo", null];
const filteredArray: string[] = array.filter(notEmpty);
```

### ArrayElement

Returns the type of an element of the array

```ts
type Item = ArrayElement<string[]>; // => string
```

```ts
type Item = ArrayElement<(ThisLineItem | ThatLineItem)[]>; // => (ThisLineItem | ThatLineItem)
```

### ArrayToUnion

Converts an array of strings into a discriminated type union.

```ts
const httpMethods = ["GET", "POST", "PUT", "PATCH", "OPTIONS", "HEAD", "DELETE"] as const; // note: `as const` is required
type HttpMethod = ArrayToUnion<typeof httpMethods>; // => "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "HEAD" | "DELETE"
```

### DeepPartial

Deeply marks attributes as optional

```ts
interface RequiredFields {
  firstName: string;
  lastName: string;
  age: number;
  address: {
    street: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
}

type OptionalFields = DeepPartial<RequiredFields>;
/*
 * => {
 *   firstName?: string;
 *   lastName?: string;
 *   age?: number;
 *   address?: {
 *     street?: string;
 *     postalCode?: string;
 *     city?: string;
 *     state?: string;
 *     country?: string;
 *   }
 * }
 *
 */
```

### RequireAtLeastOne

Tell typescript to require at least one of the keys to be present.

```ts
import { RequireAtLeastOne } from "@uplift-ltd/ts-helpers";

interface Props {
    a?: boolean
    b?: boolean
    c: boolean
}

type ABProps = RequireAtLeastOne<Props, 'a' | 'b'>

<Component a c /> /* passes */
<Component b c /> /* passes */
<Component a b c /> /* passes */
<Component c /> /* throws */
```

### RequireOnlyOne

Tell typescript to require only one (not all) of the keys to be present.

```ts
import { RequireOnlyOne } from "@uplift-ltd/ts-helpers";

interface Props {
    a?: boolean
    b?: boolean
    c: boolean
}

type ABProps = RequireOnlyOne<Props, 'a' | 'b'>

<Component a c /> /* passes */
<Component b c /> /* passes */
<Component a b c /> /* throws */
<Component c /> /* throws */
```

### Unpromise

Returns the result type of a promise.

```ts
type Result = Unpromise<Promise<boolean>>; // => boolean
```

Can be combined with `ReturnType` to get the result of a function that returns a promise.

```ts
type TheTypeWeWant = { a: boolean };

type PromiseReturningFunction = () => Promise<TheTypeWeWant>;

type TheTypeWeHave = Unpromise<ReturnType<PromiseReturningFunction>>;

// TheTypeWeHave is now TheTypeWeWant
```

### UnreachableCaseError

Throw this type of error for an unreachable case.

```ts
import { UnreachableCaseError } from "@uplift-ltd/ts-helpers";

switch (condition) {
  case true:
    return bleh;
  default:
    throw new UnreachableCaseError("invalid condition");
}
```

### ValuesOf

Returns a type union of the values of a record/object

```ts
const Colors = {
  BLUE: "blue",
  RED: "red",
  GREEN: "green",
};

type Color = ValuesOf<typeof Colors>; // => "blue" | "red" | "green"
```
