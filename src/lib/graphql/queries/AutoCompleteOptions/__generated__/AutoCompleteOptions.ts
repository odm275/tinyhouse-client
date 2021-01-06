/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AutoCompleteOptions
// ====================================================

export interface AutoCompleteOptions_autoCompleteOptions_Listings_result {
  __typename: "Listing";
  address: string;
}

export interface AutoCompleteOptions_autoCompleteOptions_Listings {
  __typename: "Listings";
  total: number;
  result: AutoCompleteOptions_autoCompleteOptions_Listings_result[];
}

export interface AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults_result {
  __typename: "CityAndAdmin";
  admin: string | null;
  city: string | null;
}

export interface AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults {
  __typename: "CityAndAdminResults";
  total: number;
  result: AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults_result[];
}

export type AutoCompleteOptions_autoCompleteOptions = AutoCompleteOptions_autoCompleteOptions_Listings | AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults;

export interface AutoCompleteOptions {
  autoCompleteOptions: AutoCompleteOptions_autoCompleteOptions | null;
}

export interface AutoCompleteOptionsVariables {
  text: string;
}
