---
title: save-on-navigate-back
---

A common pattern in native apps is to automatically save state when navigating away from detail
pages. This component and hook provide an easy way to hook into react-navigation's `onBeforeRemove`
event to run your Formik onSubmit function before `navigation.pop`

## Installation

    yarn add @uplift-ltd/save-on-navigate-back

## API

### SaveOnNavigateBack

Render this component when you want to intercept back navigation and run your save function.
Conditionally rendering this on a page makes it easy to control when your save function will fire.
Eg, only autosave after the object has been created explicitly by the user.  
This component needs a React.ref wrapped boolean value in order to work. We provide a helper for
this with `useSaveOnNavigateBack`

```ts
import React, { useRef } from "react";
import { SaveOnNavigateBack } from "@uplift-ltd/save-on-navigate-back";

const Form = () => {
  const formSuccessful = useRef(false);

  return (
    <EnhancedFormik
      onSubmit={async (values) => {
        const result = await saveToServer(values);

        if (result?.success) {
          // set formSuccessful to true so that our SaveOnNavigateBack component will let us pop
          formSuccessful.current = true;
          navigation.pop();
        } else {
          formSuccessful.current = false;
          setFormError("Unable to save");
        }
      }}
    >
      <Form>
        <Input name="firstName" />
        <Input name="lastaName" />
        {user?.id && <SaveOnNavigateBack formSuccessful={formSuccessful} />}
      </Form>
    </EnhancedFormik>
  );
};
```

### useSaveOnNavigateBack

Ref and component wrapped as hook, for easier consumption. Returns the SaveOnNavigateBack component,
the boolean ref (to be passed into the SaveOnNavigateBack component), and a helper fn to set
formSuccess value.

```ts
import React, { useRef } from "react";
import { useSaveOnNavigateBack } from "@uplift-ltd/save-on-navigate-back";

const Form = () => {
  const [SaveOnNavigateBack, formSuccessful, setFormSuccessful] = useSaveOnNavigateBack();

  return (
    <EnhancedFormik
      onSubmit={async (values) => {
        const result = await saveToServer(values);

        if (result?.success) {
          // set formSuccessful to true so that our SaveOnNavigateBack component will let us pop
          setFormSuccessful(true);
          navigation.pop();
        } else {
          setFormSuccessful(false);
          setFormError("Unable to save");
        }
      }}
    >
      <Form>
        <Input name="firstName" />
        <Input name="lastaName" />
        {user?.id && <SaveOnNavigateBack formSuccessful={formSuccessful} />}
      </Form>
    </EnhancedFormik>
  );
};
```
