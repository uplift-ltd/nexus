# @uplift-ltd/formik

## Installation

    yarn add @uplift-ltd/formik

## API

### EnhancedFormik / useEnhancedFormik

These wrappers do a few things:

- handle reporting errors to Sentry
- adds `initialStatus` for form errors
- adds `setFormSuccess` and `setFormError` helpers
- adds `applyErrorsToFields` helper

#### EnhancedFormik

```tsx
import { EnhancedFormik } from "@uplift-ltd/formik";

<EnhancedFormik<FormValues>
  onSubmit={() => {
    throw new Error("I get submitted to sentry and set to status.formError");
  }}
/>;
```

#### useEnhancedFormik

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

#### setFormSuccess / setFormError

```tsx
import { EnhancedFormik } from "@uplift-ltd/formik";

<EnhancedFormik<FormValues>
  onSubmit={async (values, { setFormSuccess, setFormError }) => {
    try {
      const { data } = await someMutation();
      if (!data?.someMutation?.success) {
        throw new Error(
          data?.someMutation?.message || "Failed to do _blank_. Please try again later."
        );
      }
      setFormSuccesss("You did it!");
    } catch (err) {
      Sentry.captureExpection(err);
      setFormError(err.message);
    }
  }}
/>;
```

### EnhancedField / useEnhancedField

Enhancement that allows you to hide field errors when the input gains focus. It does this by setting
`meta.touched` to `false`.

#### EnhancedField

```ts
import { EnhancedField } from "@uplift-ltd/formik";

const MyField = ({ label, ...props }) => {
  console.log(Object.keys(field));
  // ['onBlur', 'onChange', 'onFocus', 'value', ...]
  //                        ^ our enhancement to track focus and clear touched status

  return (
    <EnhancedField hideErrorsOnFocus>
      {({ field, meta }) => {
        console.log(Object.keys(field));
        // ['onBlur', 'onChange', 'onFocus', 'value', ...]
        //                        ^ our enhancement to track focus and clear touched status

        return (
          <label>
            {label}
            <input {...field} />
            {meta.touched && meta.error && <p>{meta.error}</p>}
          </label>
        );
      }}
    </EnhancedField>
  );
};
```

#### useEnhancedField

```ts
import { useEnhancedField } from "@uplift-ltd/formik";

const MyField = ({ label, ...props }) => {
  const [field, meta] = useEnhancedField<string>({
    hideErrorsOnFocus: true,
    ...props,
  });

  console.log(Object.keys(field));
  // ['onBlur', 'onChange', 'onFocus', 'value', ...]
  //                        ^ our enhancement to track focus and clear touched status

  return (
    <label>
      {label}
      <input {...field} {...props} />
      {meta.touched && meta.error && <p>{meta.error}</p>}
    </label>
  );
};
```
