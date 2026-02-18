import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Login";
import Layout from "../pages/Layout";

import BookList from "../pages/book/BookList";
import ListUser from "../pages/user/UserList";
import PublisherList from "../pages/publisher/PublisherList";
import CategoryList from "../pages/category/CategoryList";
import RoleList from "../pages/role/RoleList";
import LoanList from "../pages/loan/LoanList";
import MenuList from "../pages/menu/MenuList";
import MenuPermissionList from "../pages/menupermission/MenuPermissionList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "book/booklist", element: <BookList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "user/listuser", element: <ListUser /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "publisher/publisherlist", element: <PublisherList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "category/categorylist", element: <CategoryList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "role/rolelist", element: <RoleList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "loan/loanlist", element: <LoanList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [{ path: "menu/menulist", element: <MenuList /> }],
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { path: "menupermission/menupermissionlist", element: <MenuPermissionList /> },
    ],
  },
]);
