---
title: money
---

## Installation

```sh
npm i --save @uplift-ltd/money
```

## API

### formatCurrency

Format an amount.

```js
import { formatCurrency } from "@uplift-ltd/money";

formatCurrency(123.45, "USD"); // => $123.45
formatCurrency("12345.67", "USD"); // => $12,345.67
formatCurrency(null, "USD"); // => $0
```

### parseAmount

Parse a money string into a number.

```js
import { parseAmount } from "@uplift-ltd/money";

parseAmount("123.45 USD"); // => 123.45
```
