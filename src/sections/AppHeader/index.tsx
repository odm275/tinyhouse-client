import React, { useState, useEffect, useRef } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Input, AutoComplete, Layout } from "antd";
import debounce from "lodash.debounce";
import { MenuItems } from "./components";
import logo from "./assets/tinyhouse-logo.png";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";
import { AUTO_COMPLETE_OPTIONS } from "../../lib/graphql/queries";
import {
  AutoCompleteOptions as AutoCompleteOptionsData,
  AutoCompleteOptions_autoCompleteOptions_CityAndAdminResults_result as CityAndAdminResult,
  AutoCompleteOptionsVariables,
} from "../../lib/graphql/queries/AutoCompleteOptions/__generated__/AutoCompleteOptions";
const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

function suggestCityOrAddress(text: string, result: any) {
  const sanitizedCity = result.city.toLowerCase();
  const sanitizedText = text.toLowerCase();
  // text is in city
  if (sanitizedCity.includes(sanitizedText)) {
    // we want the city as the suggestion
    const cityWState = `${result.city}, ${result.admin}`;
    return { title: cityWState, path: result.city };
  } else {
    return { title: result.address, path: result.id };
  }
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const client = useApolloClient();
    const [search, setSearch] = useState<string>("");

    const [options, setOptions] = useState<any>([]);

    useEffect(() => {
      const { pathname } = location;
      const pathnameSubStrings = pathname.split("/");
      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }
      if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
        setSearch(pathnameSubStrings[2]);
        return;
      }
    }, [location]);

    const renderCityAndAdminResult = (result: any, search: string) => {
      const { title, path } = suggestCityOrAddress(search, result);
      return {
        value: title,
        label: (
          <a href={`${window.location.origin}/listings/${path.toLowerCase()}`}>
            {title}
          </a>
        ),
      };
    };

    const renderAddressResult = (result: any, search: string) => {
      const { id, address } = result;

      return {
        value: address,
        label: (
          <a href={`${window.location.origin}/listing/${id}`}>{address}</a>
        ),
      };
    };

    const handleAutoCompleteResults = (
      data: AutoCompleteOptionsData,
      search: string
    ) => {
      // Filter results that don't match every character in search input.
      // server may return partial matches we don't want(Fuzzy gets us half way, we clean it up here)
      const searchIncludesCity = (result: any, search: any) => {
        const { city } = result;
        if (city) {
          const sanitizedCity = city.toLowerCase();
          const sanitizedText = search.toLowerCase();

          return sanitizedCity.includes(sanitizedText);
        }
      };
      if (data.autoCompleteOptions) {
        console.log("results", data.autoCompleteOptions);
        if (data.autoCompleteOptions?.__typename === "Listings") {
          const renderOptions = data.autoCompleteOptions.result.map((result) =>
            renderAddressResult(result, search)
          );
          return renderOptions;
        } else if (
          data.autoCompleteOptions?.__typename === "CityAndAdminResults"
        ) {
          const renderOptions = data.autoCompleteOptions.result
            .filter((result) => searchIncludesCity(result, search))
            .map((result) => renderCityAndAdminResult(result, search));

          return renderOptions;
        }

        //MAP results -> renderOptions
        // return renderOptions;
      }
      return [];
    };

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search");
      }
    };

    const debouncedQuery = useRef(
      debounce(async (search) => {
        const { data } = await client.query<
          AutoCompleteOptionsData,
          AutoCompleteOptionsVariables
        >({ query: AUTO_COMPLETE_OPTIONS, variables: { text: search } });

        if (data) {
          const options = handleAutoCompleteResults(data, search);
          console.log("options", options);
          setOptions(options);
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

    // Now we need to render the options

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <AutoComplete
              value={search}
              onChange={(data: string) => setSearch(data)}
              options={options}
              style={{ width: "100%" }}
            >
              <Input.Search
                placeholder="Search 'San Francisco'"
                enterButton
                onSearch={onSearch}
              />
            </AutoComplete>
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
