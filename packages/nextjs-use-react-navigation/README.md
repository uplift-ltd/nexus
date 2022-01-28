# @uplift-ltd/nextjs-use-react-navigation

## Installation

    yarn add @uplift-ltd/nextjs-use-react-navigation

## API

### useRouterNavigation

Exposes stable methods for the navigation methods of NextJS router

```ts
import { useRouterNavigation } from "@uplift-ltd/nextjs-use-react-navigation";

export default function MyComponent() {
  const { back, push, replace } = useRouterNavigation();

  const goToProfile = useCallback(() => {
    return push("/profile");
  }, [push]);

  const goToProfileReplaced = useCallback(() => {
    return replace("/profile");
  }, [replace]);

  return (
    <div>
      <button type="button" onClick={back}>
        Go Back
      </button>
      <button type="button" onClick={goToProfile}>
        Go to Profile
      </button>
      <button type="button" onClick={goToProfileReplaced}>
        Go to Profile, replaced
      </button>
    </div>
  );
}
```
