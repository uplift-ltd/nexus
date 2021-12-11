export interface Edge<T> {
  node: T;
}

export interface Connection<T> {
  edges: (Edge<T> | null)[];
}

export function mapNodes<Node>(connection: Connection<Node> | null | undefined): Node[];

export function mapNodes<Result extends unknown, Node>(
  connection: Connection<Node> | null | undefined,
  callback: (node: Node) => Result
): Result[];

export function mapNodes<Node, Result extends unknown = Node>(
  connection: Connection<Node> | null | undefined,
  callback?: (item: Node) => Result
) {
  const edges = (connection?.edges || []).filter((edge): edge is Edge<Node> => !!edge);

  if (callback) {
    return edges.map(({ node }) => callback(node));
  }

  return edges.map(({ node }) => node);
}
