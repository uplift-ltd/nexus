import { ArrayElement } from "./arrayElement";

type NullableRelayConnection<N> = {
  edges?: NullableEdge<N>[] | null;
};

type NullableEdge<T> = {
  node?: T | null;
};

/**
 * GetConnectionNode
 *
 * Extracts the Node type from a Connection, even if the connection/edge/node is nullable
 */
export type GetConnectionNode<
  NullableConnectionType extends NullableRelayConnection<unknown>
> = NonNullable<ArrayElement<NonNullable<NullableConnectionType["edges"]>>["node"]>;

/**
 * GetConnectionNode
 *
 * Helper to create an array from a given Connection's Node type, even if the
 * connection/edge/node is nullable
 */
export type GetConnectionNodeArray<
  NullableConnectionType extends NullableRelayConnection<unknown>
> = Array<GetConnectionNode<NullableConnectionType>>;
