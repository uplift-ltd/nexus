# @uplift-ltd/constants

This package provides some common constants, as well as a helper to get env variables easier

## Installation

    yarn add @uplift-ltd/constants

## Provided Constants

Apollo / GraphQL:

- GRAPHQL_TOKEN
- GRAPHQL_HOST
- GRAPHQL_BATCHING
- GRAPHQL_AUTH_ENDPOINT
- GRAPHQL_UNAUTH_ENDPOINT

## API

### env

Helper to get a value from the environent, with optional fallback.

```ts
import { env } from "@uplift-ltd/constants";

env("REACT_APP_MY_CUSTOM_DATE_FORMAT", "YYYY-mm-dd");
```
