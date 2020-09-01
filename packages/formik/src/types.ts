import { FormikConfig, FormikHelpers, FormikProps } from "formik";
import { StatusHelpers } from "./status";

type FormikConfigWithoutOverrides<Values> = Omit<FormikConfig<Values>, "children" | "onSubmit">;

interface FormikConfigOverrides<Values> {
  children?: ((props: FormikProps<Values> & StatusHelpers) => React.ReactNode) | React.ReactNode;
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values> & StatusHelpers
  ) => void | Promise<any>;
}

export type FormikConfigWithOverrides<Values> = FormikConfigWithoutOverrides<Values> &
  FormikConfigOverrides<Values>;
