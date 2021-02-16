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
  resetStatusOnSubmit
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
  resetStatusOnSubmit: true,
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

#### applyErrorsToFields

```tsx
import { EnhancedFormik } from "@uplift-ltd/formik";

<EnhancedFormik<FormValues>
  onSubmit={async (values, { applyErrorsToFields }) => {
    const { data } = await someMutation();
    if (!data?.someMutation?.success) {
      if (data?.someMutation?.errors?.length) {
        // data.someMutation.errors should be of shape { field: string; messages: string[] }
        // this is the common shape returned by uplift_core via graphene for field-level errors
        applyErrorsToFields(data.someMutation.errors);
        // Now formik fields will show the errors for the correct fields (assuming FE and BE field names match)
      }
    }
  }}
/>;
```

### EnhancedField / useEnhancedField

Enhancement that allows you to hide field errors when the input gains focus. It does this by setting
`meta.touched` to `false`.

#### EnhancedField

```tsx
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

```tsx
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

#### useEnhancedFormikContext

```tsx
import { useEnhancedFormikContext } from "@uplift-ltd/formik";

const MyField = ({ label, ...props }) => {
  const {
    setFormStatus,
    setFormError,
    applyErrorsToFields,
  } = useEnhancedFormikContext<FormValues>();
  return <button onClick={() => setFormError("NEIN!")}>No</button>;
};
```
