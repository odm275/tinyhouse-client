import { gql } from "apollo-boost";

export const AUTO_COMPLETE_OPTIONS = gql`
  query AutoCompleteOptions($text: String!) {
    autoCompleteOptions(text: $text) {
      result {
        title
      }
    }
  }
`;
