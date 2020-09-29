import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Menu, Avatar } from "antd";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import {
  LogOut as LogOutData,
  LogOut,
} from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";

const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification("You've succesfully logged out!");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!"
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>
            <HomeOutlined />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <LoginOutlined />
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
