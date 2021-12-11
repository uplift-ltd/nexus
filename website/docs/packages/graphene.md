---
title: graphene
---

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

### bumpGlobalId

Increment the global id. Requires the parsed ID to be an integer.

```js
import { bumpGlobalId } from "@uplift-ltd/graphene";

const user1 = "VXNlcjox"; // => User:1

const user2 = bumpGlobalId(globalId); // => VXNlcjoy => User:2

const user5 = bumpGlobalId(globalId, 4); // => VXNlcjo1 => User:5
```

### bumpOrInitCursor

Increment a cursor or initialize to `arrayconnection:1` (`YXJyYXljb25uZWN0aW9uOjE=`).

```js
import { bumpOrInitCusor } from "@uplift-ltd/graphene";

bumpOrInitCursor(null); // => YXJyYXljb25uZWN0aW9uOjE= => arrayconnection:1

bumpOrInitCursor("YXJyYXljb25uZWN0aW9uOjE="); // => YXJyYXljb25uZWN0aW9uOjI= => arrayconnection:2
```

### mapNodes

Return an array of nodes from a relay-style connection.

```js
import { mapNodes } from "@uplift-ltd/graphene";

const connection = { edges: [{ node: { id: 1 } }] };
const nodes = mapNodes(connection);

console.log(nodes); // => [{ id: 1}]
```

Optionally takes in a transform callback which will operate on each node,

```js
import { mapNodes } from "@uplift-ltd/graphene";

const connection = { edges: [{ node: { id: 1 } }] };
const nodes = mapNodes(connection, (node) => ({ ...node, type: "EnhancedNode" }));

console.log(nodes); // => [{ id: 1, type: "EnhancedNode" }]
```

### useMapNodes

Like mapNodes but returns a stable array (assuming connection and callback are stable).
