---
title: toasts
---

## Installation

    yarn add @uplift-ltd/toasts

## API

### ToastProvider

Wrap app in this provider to add context.

```tsx
import { ToastProvider } from "@uplift-ltd/toasts";

function MyApp() {
  return (
    <ToastProvider
      containerComponent={ToastContainer}
      toastComponent={Toast}
      defaultTimeout={5000} // auto dismiss after this timeout, use 0 to keep forever
      leaveDuration={0} // how long to wait before unmounting (use this for animations)
    >
      <div />
    </ToastProvider>
  );
}
```

### useToast

Add a new toast. Returns toast id.

```tsx
function MyComponent() {
  const { addToast, dismissToast } = useToast();

  const onClick = () => {
    const toastId = addToast({
      title: "Toast Title",
      description: "Lorem ipsum",
      timeout: 0,
    });

    setTimeout(() => {
      dismissToast(toastId);
    }, 5000);
  };

  return (
    <button type="button" onClick={notify}>
      Notify
    </button>
  );
}
```
