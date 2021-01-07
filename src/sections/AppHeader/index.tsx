import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Input, AutoComplete, Layout } from "antd";
import { MenuItems } from "./components";
import logo from "./assets/tinyhouse-logo.png";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";
import { useAutoCompleteOptions } from "../../lib/hooks";
const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const suggestCityOrAddress = (text: string, result: any) => {
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
};

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

const renderAddressResult = (result: any) => {
  const { id, address } = result;

  return {
    value: address,
    label: <a href={`${window.location.origin}/listing/${id}`}>{address}</a>,
  };
};
const searchIncludesCity = (result: any, search: any) => {
  const { city } = result;
  if (city) {
    const sanitizedCity = city.toLowerCase();
    const sanitizedText = search.toLowerCase();

    return sanitizedCity.includes(sanitizedText);
  }
};

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState<string>("");
    const { options } = useAutoCompleteOptions(search);

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

    const renderOptions = (options: any) => {
      if (options?.__typename === "Listings") {
        const renderOptions = options.result.map((result: any) =>
          renderAddressResult(result)
        );
        return renderOptions;
      } else if (options.__typename === "CityAndAdminResults") {
        const renderOptions = options.result
          .filter((result: any) => searchIncludesCity(result, search))
          .map((result: any) => renderCityAndAdminResult(result, search));

        return renderOptions;
      }
    };

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search");
      }
    };

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
              options={renderOptions(options)}
              style={{ width: "100%" }}
            >
              <Input.Search
                placeholder="Enter an address, neighborhood, city, or ZIP code"
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
