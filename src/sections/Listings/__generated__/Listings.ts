/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Listings
// ====================================================

export interface Listings_listings {
  __typename: "Listing";
  id: string;
  title: string;
  image: string | null;
  address: string | null;
  price: number | null;
  numOfGuests: number | null;
  numOfBeds: number | null;
  numOfBaths: number | null;
  rating: number | null;
}

export interface Listings {
  listings: Listings_listings[];
}
