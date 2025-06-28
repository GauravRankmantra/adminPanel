import Dashboard from "./views/Dashboard";

import Tables from "./views/Tables";
import Cards from "./views/Cards";
import ProgressBars from "./views/ProgressBars";
import Modals from "./views/Modals";

import Typography from "./views/Typography";
import AddSong from "./views/AddSong";
import AdvancedForm from "./views/AdvancedForm";
import LeafletMaps from "./views/LeafletMaps";
import Login from "./views/Login";
import Register from "./views/Register";
import Page404 from "./views/Error404";
import Page500 from "./views/Error500";
import AllSongs from "./views/AllSongs";
import AddAlbum from "./views/AddAlbum";
import AllAlbums from "./views/AllAlbums";
import AlbumInfo from "./views/AlbumInfo";
import Profile from "./views/Profile";
import ContactInfo from "./views/ContactInfo";
import PrivacyPolicy from "./views/PrivacyPolicy";
import Genres from "./views/Genres";
import Terms from "./views/Terms";
import Home from "./views/Home";
import AllArtist from "./views/AllArtist";
import WebUpdate from "./views/WebUpdate";
import Ticket from "./views/Ticket";
import { components } from "react-select";
import SalesFilterPanel from "./views/SalesFilterPanel";
import FeaturedVideoAdmin from "./views/FeaturedVideoAdmin";
import ManageSeller from "./views/ManageSeller";
import FooterManagement from "./components/FooterManagement";
import DonationTable from "./views/DonationTable";
import SponsorTable from "./views/SponsorTable";
import Subsciber from "./views/Subsciber";

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
    path: "/components/cards",
    component: Cards,
  },

  {
    path: "/components/progressbars",
    component: ProgressBars,
  },

  {
    path: "/forms/donation",
    component: DonationTable,
  },

  
  {
    path: "/forms/subsciber",
    component: Subsciber,
  },
  {
    path: "/forms/sponsor",
    component: SponsorTable,
  },
  {
    path: "/components/modals",
    component: Modals,
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
    path: "/forms/add-album",
    component: AddAlbum,
  },
  {
    path: "/forms/all-album",
    component: AllAlbums,
  },
  {
    path: "/contactInfo",
    component: ContactInfo,
  },
  {
    path: "/privacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/terms",
    component: Terms,
  },
  {
    path: "/forms/album/:albumId",
    component: AlbumInfo,
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
    path: "/forms/all-artist",
    component: AllArtist,
  },
  {
    path: "/forms/genre",
    component: Genres,
  },
  {
    path: "/forms/homepage",
    component: Home,
  },

  {
    path: "/forms/webUpdate",
    component: WebUpdate,
  },
  {
    path: "/forms/sales",
    component: SalesFilterPanel,
  },
  {
    path: "/manageSeller",
    component: ManageSeller,
  },

  {
    path: "/forms/footer",
    component: FooterManagement,
  },
  {
    path: "/forms/video",
    component: FeaturedVideoAdmin,
  },

  {
    path: "/forms/tickets",
    component: Ticket,
  },
  {
    path: "/maps/leaflet-maps",
    component: LeafletMaps,
  },
  {
    path: "/profile-admin",
    component: Profile,
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
