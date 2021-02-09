---
title: error-boundary
---

## Installation

    yarn add @uplift-ltd/error-boundary

## API

### myFunction

My description.

```tsx
import { GlobalErrorBoundary } from "@uplift-ltd/error-boundary";

function Root() {
  return (
    <GlobalErrorBoundary logo={<MyLogo />} TextComponent={Text} ButtonComponent={Button}>
      <App />
    </GlobalErrorBoundary>
  );
}
```
