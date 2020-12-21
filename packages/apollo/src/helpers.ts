import { DocumentNode, OperationDefinitionNode } from "graphql";

const getOperationDefinition = (query: DocumentNode): OperationDefinitionNode => {
  const operationDefinition = query.definitions.find(
    (definition) => definition.kind === "OperationDefinition"
  );
  if (!operationDefinition) {
    throw new Error("Failed to find operation definition");
  }
  if (operationDefinition.kind !== "OperationDefinition") {
    throw new Error("Invalid definition kind");
  }
  return operationDefinition;
};

const getOperationDefinitionName = (definition: OperationDefinitionNode) => {
  if (!definition.name) {
    throw new Error("Missing operation name");
  }
  return definition.name.value;
};

export const getQueryName = (query: DocumentNode) =>
  getOperationDefinitionName(getOperationDefinition(query));
