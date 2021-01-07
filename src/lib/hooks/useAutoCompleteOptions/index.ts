import { useState, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import debounce from "lodash.debounce";

import { AUTO_COMPLETE_OPTIONS } from "../../graphql/queries";
import {
  AutoCompleteOptions as AutoCompleteOptionsData,
  AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults_result as CityAndAdminResult,
  AutoCompleteOptionsVariables,
} from "../../graphql/queries/AutoCompleteOptions/__generated__/AutoCompleteOptions";

export const useAutoCompleteOptions = (search: string) => {
  const client = useApolloClient();
  const [options, setOptions] = useState<any>([]);
  const debouncedQuery = useRef(
    debounce(async (search) => {
      const { data } = await client.query<
        AutoCompleteOptionsData,
        AutoCompleteOptionsVariables
      >({ query: AUTO_COMPLETE_OPTIONS, variables: { text: search } });

      if (data) {
        // const options = handleAutoCompleteResults(data, search);
        setOptions(data.autoCompleteOptions);
      }
    }, 1000)
  ).current;
  useEffect(() => {
    const searchInputIsLongEnough = search.length > 2;
    const fetchAsyncDebouncedQuery = async () => {
      if (searchInputIsLongEnough) {
        // try to get some options
        try {
          await debouncedQuery(search);
        } catch {
          throw Error("Couldn't get options");
        }
      } else {
        setOptions([]);
      }
    };
    fetchAsyncDebouncedQuery();
  }, [search]);

  // What we actually want off this hook!!
  return {
    options,
  };
};
