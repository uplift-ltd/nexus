# @uplift-ltd/toasts

## Installation

    yarn add @uplift-ltd/toasts

## API

### ToastProvider

Wrap app in this provider to add context.

```tsx
import { NotificationsProvider } from "@uplift-ltd/toasts";

function MyApp() {
  return (
    <NotificationsProvider
      containerComponent={NotificationsContainer}
      notificationComponent={Notification}
      defaultTimeout={5000} // auto dismiss after this timeout, use 0 to keep forever
      leaveDuration={100} // how long to wait before unmounting (use this for animations)
    >
      <div />
    </NotificationsProvider>
  );
}
```

### useNotifications

Add a new notification. Returns decorated object.

```tsx
function MyComponent() {
  const { addNotification, dismissNotification } = useNotifications();

  const onClick = () => {
    const notification = addNotification({
      title: "Notification Title",
      description: "Lorem ipsum",
      timeout: 0,
    });

    setTimeout(() => {
      dismissNotification(notification);
    }, 5000);
  };

  return (
    <button type="button" onClick={notify}>
      Notify
    </button>
  );
}
```
