import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Layout } from "antd";
import { HomeHero } from "./components";

import mapBackground from "./assets/map-background.jpg";

const { Content } = Layout;

export const Home = ({ history }: RouteComponentProps) => {
  const onSearch = (value: string) => {
    history.push(`/listings/${value}`);
  };
  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />
    </Content>
  );
};
