# @uplift-ltd/space-between

## Installation

```sh
npm i --save @uplift-ltd/space-between
```

## API

### SpaceBetween

A component to add space between items. It works by applying a className to all but the first item.

```tsx
import { SpaceBetween } from "@uplift-ltd/space-between";

function MyComponent() {
  return (
    <SpaceBetween className="mt-4">
      {someList.map((item) => (
        <MyItem key={item.id} {...item} />
      ))}
    </SpaceBetween>
  );
}
```

You can optionally pass a divider to be inserted between items.

```tsx
<SpaceBetween className="mt-4" divider={<MyDivider />}>
  ...
</SpaceBetween>
```
