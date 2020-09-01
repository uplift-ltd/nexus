---
title: apollo
---

## Installation

    yarn add @uplift-ltd/apollo

## API

### useEnhancedQuery

Same as Apollo useQuery except it accepted a third parameter for setting the auth/unauth endpoints
for you. Defaults to auth endpoint.

```ts
import { useEnhancedQuery } from "@uplift-ltd/apollo";

useEnhancedQuery<MyQuery, MyQueryVariables>(MY_QUERY, { variables }, { auth: false });
```

See [Apollo useQuery docs](https://www.apollographql.com/docs/react/api/react/hooks/#usequery).

### useEnhancedMutation

Same as Apollo useMutation except it accepted a third parameter for setting the auth/unauth
endpoints for you. Defaults to auth endpoint.

```ts
import { useEnhancedMutation } from "@uplift-ltd/apollo";

useEnhancedMutation<MyMutation, MyMutationVariables>(MY_MUTATION, { variables }, { auth: false });
```

[Apollo useMutation docs](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation).

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
