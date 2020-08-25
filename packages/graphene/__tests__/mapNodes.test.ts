import { mapNodes } from "../src/mapNodes";

describe("mapNodes", () => {
  it("should return nodes from a relay connection", () => {
    const connection = { edges: [{ node: { id: 1 } }] };
    const nodes = mapNodes(connection);
    expect(nodes).toEqual([{ id: 1 }]);
  });
});
