export interface FormikStatus {
  formSuccess: boolean | string;
  formError: boolean | string | Error;
  allowResubmit: boolean;
}
