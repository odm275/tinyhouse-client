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
  AutoCompleteOptionsVariables,
} from "../../lib/graphql/queries/AutoCompleteOptions/__generated__/AutoCompleteOptions";
const { Header } = Layout;
const { Search } = Input;

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

    return result.city;
  }

  return result.address;
}

function uniq(a: string[]) {
  return Array.from(new Set(a));
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const client = useApolloClient();
    const [search, setSearch] = useState<string>("");

    const [options, setOptions] = useState<{ value: string }[]>([]);

    console.log("options", options);

    useEffect(() => {
      const { pathname } = location;
      const pathnameSubStrings = pathname.split("/");
      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }
      if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
        // localhost:3000/listings/toronto
        setSearch(pathnameSubStrings[2]);
        return;
      }
    }, [location]);

    const handleAutoCompleteResults = (
      results: AutoCompleteOptionsData["autoCompleteOptions"]["result"]
    ) => {
      const options = results.map((result) =>
        suggestCityOrAddress(search, result)
      );
      const uniqueOptions = uniq(options);
      const antdOptions = uniqueOptions.map((option) => {
        return { value: option };
      });
      return antdOptions;
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
      debounce(async (text) => {
        const { data } = await client.query<
          AutoCompleteOptionsData,
          AutoCompleteOptionsVariables
        >({ query: AUTO_COMPLETE_OPTIONS, variables: { text } });
        if (data && data.autoCompleteOptions) {
          const autoCompleteResults = data.autoCompleteOptions.result;
          const options = handleAutoCompleteResults(autoCompleteResults);

          setOptions(options);
        }
      }, 1000)
    ).current;

    const onChange = async (data: string) => {
      // GO to server
      setSearch(data);
      const searchInputIsLongEnough = search.length > 3;
      if (searchInputIsLongEnough) {
        // try to get some options
        try {
          await debouncedQuery(search);
        } catch {
          throw Error("Couldn't get options");
        }
      }
    };

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
            <AutoComplete value={search} onChange={onChange} options={options}>
              <Input.Search
                placeholder="Search 'San Francisco'"
                enterButton
                onSearch={onSearch}
              />
            </AutoComplete>
            {/* <Search
              placeholder="Search 'San Francisco'"
              enterButton
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              onSearch={onSearch}
            />
             */}
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
