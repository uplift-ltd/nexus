# @uplift-ltd/ts-helpers

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

### typedIncludes

Assert whether a variable is a member of an array in a type-safe way. This also avoids the "string"
is not a member of TYPE errors.

```ts
const colors = ["blue", "green", "red"] as const;

// You avoid the error here, that myColor is string, not a member of colors
if (typedIncludes(colors, myColor)) {
  // typeof myColor = "blue" | "green" | "red"

  // You also get a type error here that yellow is not "blue" | "green" | "red"
  if (myColor === "yellow") {
  }
}
```

### ArrayElement

Returns the type of an element of the array

```ts
type Item = ArrayElement<string[]>; // => string
```

```ts
type Item = ArrayElement<(ThisLineItem | ThatLineItem)[]>; // => (ThisLineItem | ThatLineItem)
```

### Arrays

Ensures that the provided data is an array, and if it's not, wraps it in an array

```ts
type Item = ThisLineItem | ThisLineItem[];
```

```ts
const itemOrItems: Item;
const itemsArray: ThisLineItem[] = ensureArray(itemOrItems);
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

### Relay

Helpers for working with Relay Connections

_GetConnectionNode_  
Extracts the Node from a Relay Connection, even if some or all of the Connection is nullable

_GetConnectionNodeArray_  
Helper that just returns an array of the Connection Node, also works if Connection is nullable

```ts
type User = {
  firstName: string;
  lastName: string;
  age: number;
};

// Non-nullable
type Organization = {
  users: {
    edges: { node: User }[];
  };
};

// Nullable
type NullableOrganization = {
  users?: {
    edges?: { node: User }[] | null;
  } | null;
};

Organization["users"]["edges"][0]["node"];
// => User

GetConnectionNode<Organization["users"]>;
// => User

GetConnectionNodeArray<Organization["users"]>;
// => Array<User>

GetConnectionNode<NonNullable<NullableOrganization["users"]>>;
// => User

GetConnectionNodeArray<NonNullable<NullableOrganization["users"]>>;
// => Array<User>
```

### makeUnionMemberGuard

Filter on a discriminated union.

```ts
import { makeGraphqlUnionGuard, makeUnionMemberGuard } from "@uplift-ltd/ts-helpers";

type A = {
  __typename: "A";
  x: number;
};

type B = {
  __typename: "B";
  y: number;
};

type AB = A | B;

const a = { __typename: "A", x: 1 } as const;
const b = { __typename: "B", y: 2 } as const;

const ab: AB[] = [a, b];

ab.filter(makeUnionMemberGuard("__typename", "A")); // A[]

ab.filter(makeUnionMemberGuard("__typename", "B")); // B[]

ab.filter(makeGraphqlUnionMemberGuard("A")); // A[]

ab.filter(makeGraphqlUnionMemberGuard("B")); // B[]
```
