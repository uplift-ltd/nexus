---
title: TypeScript Helpers
---

## Installation

    yarn add @uplift-ltd/ts-helpers

## API

### notEmpty

Filter and array so typescript knows there are no null or undefined values.

```ts
import { notEmpty } from "@uplift-ltd/ts-helpers";

const array: (string | null)[] = ["foo", "bar", null, "zoo", null];
const filteredArray: string[] = array.filter(notEmpty);
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
