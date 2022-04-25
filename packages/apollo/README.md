# @uplift-ltd/apollo

## Installation

    yarn add @uplift-ltd/apollo

## API

### useEnhancedQuery

Same API as Apollo useQuery except:

- It accepts a third parameter for setting the auth/unauth endpoints for you. Defaults to auth
  endpoint.
- It returns `initialLoading`, `refetching`, and `fetchingMore` (pass in
  `notifyOnNetworkStatusChange: true`)

```ts
import { useEnhancedQuery } from "@uplift-ltd/apollo";

useEnhancedQuery<MyQuery, MyQueryVariables>(MY_QUERY, { variables }, { auth: false });
```

See [Apollo useQuery docs](https://www.apollographql.com/docs/react/api/react/hooks/#usequery).

```ts
const { data, initialLoading, refetching, fetchingMore } = useEnhancedQuery(MY_QUERY, { notifyOnNetworkStatusChange: true};
```

### useEnhancedLazyQuery

Same as Apollo useLazyQuery except it accepted a third parameter for setting the auth/unauth
endpoints for you. Defaults to auth endpoint.

```ts
import { useEnhancedLazyQuery } from "@uplift-ltd/apollo";

useEnhancedLazyQuery<MyQuery, MyQueryVariables>(MY_QUERY, { variables }, { auth: false });
```

See
[Apollo useLazyQuery docs](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery).

### useEnhancedMutation

Same as Apollo useMutation except it accepted a third parameter for setting the auth/unauth
endpoints for you. Defaults to auth endpoint.

```ts
import { useEnhancedMutation } from "@uplift-ltd/apollo";

useEnhancedMutation<MyMutation, MyMutationVariables>(MY_MUTATION, { variables }, { auth: false });
```

[Apollo useMutation docs](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation).

### useEnumValues

Fetch key and descriptions for an enum from the gql server. Providing a type for the enum will give
correct data on the response type.

```ts
import { useEnumValues } from "@uplift-ltd/apollo";

const colors = useEnumValues<MyColors>("MyColors");

console.log(colors); // => { BLUE: "Brand Blue", RED: "Danger Red" }
```

### initClient

Configure Apollo client.

```ts
import { InMemoryCache } from "@apollo/client";
import { initClient } from "@uplift-ltd/apollo";

const cache = new InMemoryCache();

const client = initClient({
  cache,
});
```

### getQueryName

Get the query or mutation name.

```ts
import { getQueryName } from "@uplift-ltd/apollo";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
    }
  }
`;

const CurrentUserQueryName = getQueryName(CURRENT_USER_QUERY);

expect(CurrentUserQueryName).toEqual("CurrentUser");
```

### getQueryBody

Get the query or mutation body.

```ts
import { getQueryBody } from "@uplift-ltd/apollo";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
    }
  }
`;

const CurrentUserQueryBody = getQueryBody(CURRENT_USER_QUERY);

const EXPECTED_BODY = `
  query CurrentUser {
    me {
      id
    }
  }
`;

expect(CurrentUserQueryBody).toEqual(EXPECTED_BODY);
```
