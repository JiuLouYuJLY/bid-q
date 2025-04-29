import {createBrowserRouter} from "react-router-dom";
import {lazy} from "react";

const Home = lazy(() => import("../view/Home/Home"));
const Search = lazy(() => import("../view/Search/Search"));
const Space = lazy(() => import("../view/Space/Space"));
const Login = lazy(() => import("../view/Login/Login"));
const Upload = lazy(() => import("../view/Upload/Upload"));
const Auction = lazy(() => import("../view/Auction/Auction"));

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/search/:id/:page",
    element: <Search/>
  },
  {
    path: "/space",
    element: <Space/>
  },
  {
    path: "space/reservation",
    element: <Space/>
  },
  {
    path: "space/buy",
    element: <Space/>
  },
  {
    path: "space/sold",
    element: <Space/>
  },
  {
    path: "space/history",
    element: <Space/>
  },
  {
    path: "/space/lot",
    element: <Space/>
  },
  {
    path: "/space/setting",
    element: <Space/>
  },
  {
    path: "/upload",
    element: <Upload/>
  },
  {
    path: "/auction/:id",
    element: <Auction/>
  },
]);

export default Router;