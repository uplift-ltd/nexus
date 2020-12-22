/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EnumData
// ====================================================

export interface EnumData_enumData_enumValues {
  __typename: "__EnumValue";
  name: string;
  description: string | null;
}

export interface EnumData_enumData {
  __typename: "__Type";
  name: string | null;
  enumValues: EnumData_enumData_enumValues[] | null;
}

export interface EnumData {
  enumData: EnumData_enumData | null;
}

export interface EnumDataVariables {
  enumName: string;
}
