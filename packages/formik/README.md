# @uplift-ltd/formik

## Installation

    yarn add @uplift-ltd/formik

## API

### Formik

```tsx
import { EnhancedFormik } from "@uplift-ltd/formik";

<EnhancedFormik<FormValues>
  onSubmit={() => {
    throw new Error("I get submitted to sentry and set to status.formError");
  }}
/>;
```

### useEnhancedFormik

```ts
import { useEnhancedFormik } from "@uplift-ltd/formik";

const formik = useEnhancedFormik<FormValues>({
  initialValues: {
    message: "",
  },
  validationSchema: yup.object().shape({
    message: yup.string().required("You must supply a message."),
  }),
  onSubmit: async (values) => {
    await someMutation({
      variables: {
        message: values.message,
      },
    });
  },
});
```
