# @uplift-ltd/graphene

## Installation

    yarn add @uplift-ltd/graphene

## API

### fromGlobalId

Get the raw database ID from a global id.

```js
import { fromGlobalId } from "@uplift-ltd/graphene";

const globalId = "VXNlcjox";
const dbId = fromGlobalId(globalId);

console.log(globalId); // => VXNlcjox
console.log(dbId); // => 1
```

### toGlobalId

Encode a model name and database id to a global id.

```js
import { toGlobalId } from "@uplift-ltd/graphene";

const globalId = toGlobalId("User", 1);

console.log(globalId); // => VXNlcjox
```

### parseGlobalId

Parse both the model name and the database id from the global id.

```js
import { parseGlobalId } from "@uplift-ltd/graphene";

const { name, id } = parseGlobalId("VXNlcjox");

console.log(name); // => User
console.log(id); // => 1
```

### mapNodes

Return an array of nodes from a relay-style connection.

```js
import { mapNodes } from "@uplift-ltd/graphene";

const connection = { edges: [{ node: { id: 1 } }] };
const nodes = mapNodes(connection);

console.log(nodes); // => [{ id: 1}]
```
