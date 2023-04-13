# @uplift-ltd/push-notifications

## Installation

    npm i --save @uplift-ltd/push-notifications

## Firebase Cloud Messaging (FCM)

FCM is required for sending push notifications to Android devices. See
[Expo docs](https://docs.expo.io/push-notifications/using-fcm/).

- Add Project in [Firebase Console](https://console.firebase.google.com/)
- Add Firebase to your Android app and follow the setup steps. Make sure that the Android package
  name you enter is the same as the value of android.package in your app.config.\*.ts
- Download the google-services.json file and place it in
  `src/constants/google-services/google-services-*.json`
- In your app.config.\*.ts, add an android.googleServicesFile field with the relative path to the
  `google-services.json` file you just downloaded.

```json
{
  ...
  "android": {
    "googleServicesFile": "./src/constants/google-services/google-services-production.json",
    ...
  }
}
```

## API

This module can used either with context or hooks.

_Note:_ When reading the docs below, pay attention to the difference between these:

- `registerForPushNotifications` -> this is a function you can pass in to customize getting the
  token
- `registerPushNotifications` -> this is a function you get back to trigger getting the token
- `onRegisterPushNotifications` -> this is a callback when `registerPushFunction` resolves

### NotificationProvider

Takes in functions to handle:

- notification received
- notification response received
- save token / register device

```tsx
import {
  NotificationProvider,
  NotificationReceivedListener,
  NotificationResponseReceivedListener,
} from "@uplift-ltd/push-notifications";
import Constants from 'expo-constants

const handleNotificationReceived: NotificationReceivedListener = (notification) => {
  console.log(notification);
};

const handleNotificationResponseReceived: NotificationReceivedListener = (response) => {
  console.log(response.notification);
};

function Root() {
  const [registerDevice] = useMutation(REGISTER_DEVICE);

  const handleRegisterPushNotifications = useCallback(async (token) => {
    try {
      await registerDevice({ variables: { token, deviceId: Constants.installationId } });
    } catch (err) {
      Sentry.captureExeception(err)
    }
  }, []);

  return (
    <NotificationProvider
      onReceived={handleNotificationReceived}
      onResponseReceived={handleNotificationResponseReceived}
      onRegisterPushNotifications={handleRegisterPushNotifications}
    >
      <App />
    </NotificationProvider>
  );
}
```

### NotificationPrompt

On render, prompts the user for permission to send notifications. Uses context from
`NotificationProvider`.

```tsx
import { NotificationProvider, NotificationPrompt } from "@uplift-ltd/push-notifications";

function Root() {
  return (
    <NotificationProvider {...seePropsAbove}>
      <NotificationPrompt />
    </NotificationProvider>
  );
}
```

### NotificationAlertPrompt

If permission is undetermined, it renders an alert. If the user accepts, then it requests permission
to notify. On iOS if the user denies you cannot ask for permission again. You can customize the
alert copy, defaults are shown below.

_NOTE_: On iOS if the user denies the status is always undetermined, you may want to store if the
user denied and hide the component. You can do this using `onRegisterPushNotifications` on
`NotificationProvider` or `onRegisterPushNotifications` on `NotificationAlertPrompt`. In the future
we will handle this here. Note that `onRegisterPushNotifications` should be a stable function
(should not change on render).

```tsx
import { NotificationProvider, NotificationAlertPrompt } from "@uplift-ltd/push-notifications";

function Root() {
  return (
    <NotificationProvider {...seePropsAbove}>
      <NotificationAlertPrompt
        title="Please Allow Notifications"
        message="This application uses notifications to keep you up to date on new activity."
        acceptLabel="Enable"
        cancelLabel="Not Now"
      />
    </NotificationProvider>
  );
}
```

### NotificationRenderPrompt

If permission is undetermined, it renders the children. The children is a function that gets passed
in `permissionStatus` and `registerPushNotifications`.

_NOTE_: On iOS if the user denies the status is always undetermined, you may want to store if the
user denied and hide the component. You can check the result of `registerPushNotifications` for
this.

```tsx
import {
  NotificationProvider,
  NotificationRenderPrompt,
  PermissionStatus,
} from "@uplift-ltd/push-notifications";

function Root() {
  return (
    <NotificationProvider {...seePropsAbove}>
      <NotificationRenderPrompt>
        {({ permissionStatus, registerPushNotifications }) => {
          if (permissionStatus !== PermissionStatus.UNDETERMINED) {
            return null;
          }
          return <Button onPress={registerPushNotifications}>Notify Me!</Button>;
        }}
      </NotificationRenderPrompt>
    </NotificationProvider>
  );
}
```

### usePushNotifications

You can avoid the context entirely and use the hooks instead.

```tsx
import { usePushNotifications, PermissionStatus } from "@uplift-ltd/push-notifications";

const handleNotificationReceived: NotificationReceivedListener = (notification) => {
  console.log(notification);
};

const handleNotificationResponseReceived: NotificationReceivedListener = (response) => {
  console.log(response.notification);
};

function Root() {
  const { permissionStatus, registerPushNotifications } = usePushNotifications({
    onReceived: handleNotificationReceived,
    onResponseReceived: handleNotificationResponseReceived,
    onRegisterPushNotifications: async ({ token }) => {
      if (token) {
        const { data } = await registerDevice({
          variables: { token, deviceId: Constants.installationId, userId },
        });
        if (!data.registerDevice.success) {
          throw new Error(
            data.registerDevice.message || "Failed to register for push notifications."
          );
        }
      }
    },
  });

  const [registerDevice] = useMutation(REGISTER_DEVICE);

  useEffect(() => {
    const run = async () => {
      try {
        if (permissionStatus === PermissionStatus.UNDETERMINED) {
          const { token } = await registerPushNotifications();
          if (!token) {
            Alert.alert("If you change your mind you can go to app settings.");
          }
        }
      } catch (err) {
        Sentry.captureExeception(err);
      }
    };
    run();
  }, [userId]);
}
```
