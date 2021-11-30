import { getFileNameComponents } from "../src/helpers";

describe("file-uploaders - Helpers", () => {
  it("should get correct file paths", () => {
    const result = ["image.jpg", "jpg", "image"];
    // expect(EnhancedFormik).toBeDefined();
    expect(getFileNameComponents("file://blah/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("https://uplift.ltd/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("/src/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("./src/nested/image.jpg")).toStrictEqual(result);
  });
});
