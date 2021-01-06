import { gql } from "apollo-boost";

export const AUTO_COMPLETE_OPTIONS = gql`
  query AutoCompleteOptions($text: String!) {
    autoCompleteOptions(text: $text) {
      ... on Listings {
        total
        result {
          address
        }
      }
      ... on CityAndAdminResults {
        total
        result {
          admin
          city
        }
      }
    }
  }
`;
