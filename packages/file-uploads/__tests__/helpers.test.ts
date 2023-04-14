import { getFileNameComponents } from "../src/helpers.js";

describe("file-uploaders - Helpers", () => {
  it("should get correct file paths", () => {
    const result = ["image.jpg", "jpg", "image"];
    expect(getFileNameComponents("file://blah/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("https://uplift.ltd/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("/src/nested/image.jpg")).toStrictEqual(result);
    expect(getFileNameComponents("./src/nested/image.jpg")).toStrictEqual(result);
  });
});
