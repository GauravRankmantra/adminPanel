import Dashboard from "./views/Dashboard";
import Badges from "./views/Badges";
import Tables from "./views/Tables";
import Cards from "./views/Cards";
import ProgressBars from "./views/ProgressBars";
import Modals from "./views/Modals";
import Grids from "./views/Grids";
import Typography from "./views/Typography";
import AddSong from "./views/AddSong";
import AdvancedForm from "./views/AdvancedForm";
import LeafletMaps from "./views/LeafletMaps";
import Login from "./views/Login";
import Register from "./views/Register";
import Page404 from "./views/Error404";
import Page500 from "./views/Error500";
import AllSongs from "./views/AllSongs";

const routes = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },

  {
    path: "/components/badges",
    component: Badges,
  },

  {
    path: "/components/cards",
    component: Cards,
  },

  {
    path: "/components/progressbars",
    component: ProgressBars,
  },
  {
    path: "/components/modals",
    component: Modals,
  },
  {
    path: "/components/grids",
    component: Grids,
  },
  {
    path: "/components/typography",
    component: Typography,
  },
  {
    path: "/tables",
    component: Tables,
  },
  {
    path: "/forms/basic-form",
    component: AddSong,
  },
  {
    path: "/forms/advanced-form",
    component: AdvancedForm,
  },
  {
    path: "/forms/all-songs",
    component: AllSongs,
  },

  {
    path: "/maps/leaflet-maps",
    component: LeafletMaps,
  },
  {
    route: "/login",
    component: Login,
  },
  {
    route: "/register",
    component: Register,
  },
  {
    route: "/page404",
    component: Page404,
  },
  {
    route: "*",
    component: Page404,
  },
  {
    route: "/auth/page500",
    component: Page500,
  },
];

export default routes;
