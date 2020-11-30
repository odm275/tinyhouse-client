/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AutoCompleteOptions
// ====================================================

export interface AutoCompleteOptions_autoCompleteOptions_result {
  __typename: "Listing";
  title: string;
}

export interface AutoCompleteOptions_autoCompleteOptions {
  __typename: "Listings";
  result: AutoCompleteOptions_autoCompleteOptions_result[];
}

export interface AutoCompleteOptions {
  autoCompleteOptions: AutoCompleteOptions_autoCompleteOptions | null;
}

export interface AutoCompleteOptionsVariables {
  text: string;
}
