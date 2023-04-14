// import { EnhancedFormik } from "../src/EnhancedFormik.js";
import { useEnhancedFormik } from "../src/useEnhancedFormik.js";

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
