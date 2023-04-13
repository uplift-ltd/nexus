---
title: nextjs-use-react-navigation
---

## Installation

    npm i --save @uplift-ltd/nextjs-use-react-navigation

## API

### useRouterNavigation

Exposes stable methods for the navigation methods of NextJS router

```ts
import { useRouterNavigation } from "@uplift-ltd/nextjs-use-react-navigation";

export default function MyComponent() {
  const { back, push, replace } = useRouterNavigation();

  const goToProfile = useCallback(() => {
    return push("/profile");
  }, [push]);

  const goToProfileReplaced = useCallback(() => {
    return replace("/profile");
  }, [replace]);

  return (
    <div>
      <button type="button" onClick={back}>
        Go Back
      </button>
      <button type="button" onClick={goToProfile}>
        Go to Profile
      </button>
      <button type="button" onClick={goToProfileReplaced}>
        Go to Profile, replaced
      </button>
    </div>
  );
}
```

### useRouterQuery

Nice way of accessing type-safe `router.params`. By default, the type is narrowed to returning
`string | undefined` instead of the next.js default of `string[] | string | undefined`. This makes
it a bit nicer to use, avoiding the need for checking if the variable is `string[]`.

```ts
const Component = () => {
  const { routerQuery } = useRouterQuery();

  const { foo, bar } = routerQuery;
  // routerQuery is essentially Record<string, string | undefined>
  // typeof foo => string | undefined
  // typeof bar => string | undefined
};
```

You can also pass in a type shape, useful if you expect a key to be an array after all.

```ts
type ParamType = {
  foo: string;
  bar: string;
  baz: string[];
  count: number;
};

const Component = () => {
  const { routerQuery } = useRouterQuery<ParamType>();

  const { foo, bar, baz, count, other } = routerQuery;
  //                            ^^^ Error here, 'other' is not defined on ParamType
  // typeof foo => string | undefined
  // typeof bar => string | undefined
  // typeof baz => string[] | undefined
  // typeof count => string | undefined
  // NOTE: ^^^ number gets converted to string because URL params are not parsed
};
```

You can pass in a string union as a convenience when you only expect params to be of string, but
want to type-check access

```ts
const Component = () => {
  const { routerQuery } = useRouterQuery<"foo" | "bar" | "count">();

  const { foo, bar, count, other } = routerQuery;
  //                       ^^^ Error here, 'other' is not defined on our union
  // typeof foo => string | undefined
  // typeof bar => string | undefined
  // typeof count => string | undefined
};
```

### useRouterQueryForUrl

An enhanced `useRouterQuery` hook that looks at your URL and adds the URL param tokens as required
keys in the returned object, and allows you to specify the possible query params that might be
passed as well. The second type argument functions exactly as the initial type argument found on
`useRouterQuery`.

```ts
const USER_DETAIL_URL = "/teams/:teamId/users/:userId";

const Component = () => {
  const { routerQuery } = useRouterQueryForUrl<typeof USER_DETAIL_URL, "foo" | "bar">();

  const { teamId, userId, foo, bar } = routerQuery;
  // typeof teamId => string
  // typeof userId => string
  // typeof foo => string | undefined
  // typeof bar => string | undefined
};
```

Or, with a more complex type shape

```ts
const USER_DETAIL_URL = "/teams/:teamId/users/:userId";

type ParamType = {
  foo: string;
  bar: string;
  baz: string[];
  count: number;
};

const Component = () => {
  const { routerQuery } = useRouterQueryForUrl<typeof USER_DETAIL_URL, ParamType>();

  const { teamId, userId, foo, bar, baz, count, other } = routerQuery;
  //                            ^^^ Error here, 'other' is not defined on ParamType
  // typeof teamId => string
  // typeof userId => string
  // typeof foo => string | undefined
  // typeof bar => string | undefined
  // typeof baz => string[] | undefined
  // typeof count => string | undefined
  // NOTE:  ^^^ number gets converted to string because URL params are not parsed
};
```
