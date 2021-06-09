interface Edge<T> {
  node: T;
}

interface Connection<T> {
  edges: (Edge<T> | null)[];
}

export function mapNodes<T>(connection: Connection<T> | null | undefined): T[] {
  return connection?.edges.filter((edge): edge is Edge<T> => !!edge).map(({ node }) => node) || [];
}
