# @uplift-ltd/use-user-context

## Installation

    yarn add @uplift-ltd/use-user-context

## API

### UserContextProvider

```tsx
import { gql } from "@uplift-ltd/apollo";
import { UserContextProvider } from "@uplift-ltd/use-user-context";
import { Authenticated } from "./__generated__/Authenticated";
import { CurrentUser } from "./__generated__/CurrentUser";

const AUTHENTICATED_QUERY = gql`
  query Authenticated {
    isAuthenticated
  }
`;

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser: me {
      id
      email
    }
  }
`;

function MyApp() {
  return (
    <UserContextProvider<Authenticated, CurrentUser>
      getToken={getToken}
      authenticatedQuery={AUTHENTICATED_QUERY}
      currentUserQuery={CURRENT_USER_QUERY}
    >
      <div />
    </UserContextProvider>
  );
}
```

### useUserContext

Note: Create wrapper so you don't have to pass in types all the time.

```tsx
import { useUserContext } from "@uplift-ltd/use-user-context";
import {
  CurrentUser,
  CurrentUser_currentUser as CurrentUserShape,
} from "./__generated__/CurrentUser";

const useTypedUserContext = () => useUserContext<CurrentUserShape>();

function MyComponent() {
  const { loading, currentUser } = useTypedUserContext();
  return <div>{currentUser?.id}</div>;
}
```

### useAsserUserContext

Note: Create wrapper so you don't have to pass in types all the time.

```tsx
import { useAssertUserContext } from "@uplift-ltd/use-user-context";
import {
  CurrentUser,
  CurrentUser_currentUser as CurrentUserShape,
} from "./__generated__/CurrentUser";

const useTypedAssertUserContext = () => useAssertUserContext<CurrentUserShape>();

function MyComponent() {
  const currentUser = useTypedAssertUserContext();
  return <div>{currentUser.id}</div>;
}
```
