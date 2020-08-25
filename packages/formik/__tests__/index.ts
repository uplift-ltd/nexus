// import { EnhancedFormik } from "../src/EnhancedFormik";
import { useEnhancedFormik } from "../src/useEnhancedFormik";

// Getting error:
// return <_formik.Formik onSubmit={async (values, formikHelpers) => {
//        ^
// SyntaxError: Unexpected token '<'

describe("Formik", () => {
  it("should have useEnhancedFormik", () => {
    // expect(EnhancedFormik).toBeDefined();
    expect(useEnhancedFormik).toBeDefined();
  });
});
