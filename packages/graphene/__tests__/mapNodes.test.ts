import { mapNodes } from "../src/mapNodes.js";

describe("mapNodes", () => {
  it("should return nodes from a relay connection", () => {
    const connection = { edges: [{ node: { id: 1 } }] };
    const nodes = mapNodes(connection);
    expect(nodes).toEqual([{ id: 1 }]);
  });

  it("should apply transform callback to each node", () => {
    const connection = { edges: [{ node: { id: 1 } }] };
    const nodes = mapNodes(connection, (node) => ({ ...node, type: "EnhancedNode" }));

    expect(nodes).toEqual([{ id: 1, type: "EnhancedNode" }]);
  });
});
