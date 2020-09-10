interface Edge<T> {
  node: T;
}

interface Connection<T> {
  edges: Edge<T>[];
}

export function mapNodes<T>(connection: Connection<T> | null | undefined): T[] {
  return connection?.edges.map(({ node }) => node) || [];
}
