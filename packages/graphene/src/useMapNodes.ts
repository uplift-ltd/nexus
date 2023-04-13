import { useMemo } from "react";
import { Connection, mapNodes } from "./mapNodes.js";

export function useMapNodes<Node>(connection: Connection<Node> | null | undefined): Node[];

export function useMapNodes<Result, Node>(
  connection: Connection<Node> | null | undefined,
  callback: (node: Node) => Result
): Result[];

export function useMapNodes<Node, Result = Node>(
  connection: Connection<Node> | null | undefined,
  callback?: (item: Node) => Result
) {
  return useMemo(() => {
    if (callback) {
      return mapNodes(connection, callback);
    }
    return mapNodes(connection);
  }, [connection, callback]);
}
