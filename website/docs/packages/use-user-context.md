---
title: use-user-context
---

## Installation

```sh
npm i --save @uplift-ltd/use-user-context
```

## API

### UserContextProvider

```tsx
import { gql } from "@uplift-ltd/apollo";
import { UserContextProvider } from "@uplift-ltd/use-user-context";
import { CurrentUser } from "./__generated__/CurrentUser";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    isAuthenticated
    currentUser: me {
      id
      email
    }
  }
`;

function MyApp() {
  return (
    <UserContextProvider<CurrentUser> getToken={getToken} currentUserQuery={CURRENT_USER_QUERY}>
      <div />
    </UserContextProvider>
  );
}
```

### useUserContext

Note: Create wrapper so you don't have to pass in types all the time.

```tsx
import { useUserContext } from "@uplift-ltd/use-user-context";

function MyComponent() {
  const { loading, currentUser } = useUserContext();
  return <div>{currentUser?.id}</div>;
}
```

### useAsserUserContext

Note: Create wrapper so you don't have to pass in types all the time.

```tsx
import { useAssertUserContext } from "@uplift-ltd/use-user-context";

function MyComponent() {
  const currentUser = useAssertUserContext();
  return <div>{currentUser.id}</div>;
}
```

### Override Types

#### Override User Type

```ts
import "@uplift-ltd/use-user-context";

declare module "@uplift-ltd/use-user-context" {
  export interface CurrentUser {
    id: string;
    fullName: string;
  }
}
```

#### Override Query Type

```ts
import "@uplift-ltd/use-user-context";

declare module "@uplift-ltd/use-user-context" {
  export interface CurrentUser {
    id: string;
    fullName: string;
  }

  export interface CurrentUserQuery {
    me: CurrentUser | null;
  }
}
```

#### Override Variables Type

```ts
import "@uplift-ltd/use-user-context";

declare module "@uplift-ltd/use-user-context" {
  export interface CurrentUser {
    id: string;
    fullName: string;
  }

  export interface CurrentUserQuery {
    me: CurrentUser | null;
  }

  interface CurrentUserQueryVariables {
    userId: string;
  }

  export interface CurrentUserQueryOptions {
    query: CurrentUserQuery;
    variables: CurrentUserQueryVariables;
  }
}
```
