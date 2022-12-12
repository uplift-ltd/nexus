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
- Supports automatically skipping a query based on undefined/null values for specified variables.
  - When `skip` evaluates to `true`, the query will _always_ be skipped and `skipVariables` will not
    be evaluated
  - When `skip` is falsey, `skipVariables` will be evaluated using `skipVariablesPredicate`. If any
    variable returns `true` from the `skipVariablesPredicate`, the query will be skipped

```ts
import { useEnhancedQuery } from "@uplift-ltd/apollo";

useEnhancedQuery<MyQuery, MyQueryVariables>(MY_QUERY, { variables }, { auth: false });

useEnhancedQuery(MY_QUERY, {
  variables: {
    userId,
    itemId,
  },
  skip: !isOnline, // this is a non-variable-related condition that will skip the query if `true`. If this condition becomes false, then we will check values of skipVariables below
  skipVariables: ["userId"], // if variables.userId evaluates to null or undefined, this Query will be skipped until it is defined.
});

useEnhancedQuery(MY_QUERY, {
  variables: {
    userId,
    itemId,
  },
  skip: !isOnline,
  skipVariables: ["userId"],
  // customize the predicate used to determine if a variable is "missing" and therefore,
  // the query should be skipped until it evaluates as "not missing"
  //
  // Returning `true` from this predicate indicates the variable is missing and
  // that the query SHOULD BE SKIPPED.
  skipVariablesPredicate: (key, value) => {
    return !SKIP_VARIABLE_KEYS_TO_IGNORE.includes(key) || !notEmpty(value);
  },
});
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
