export const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "fa fa-dashboard",
  },
  {
    title: true,
    name: "UI elements",
    class: "menu-title",
  },
  {
    name: "Components",
    path: "/",
    icon: "fa fa-puzzle-piece",
  },
  {
    name: "Users",
    path: "/components/tables",
    icon: "fa fa-table",
  },
  {
    name: "Songs",
    path: "/",
    icon: "fa fa-pencil-square",
    children: [
      {
        name: "Add Song",
        path: "/components/basic-form",
        icon: "fa fa-pencil-square",
      },
      {
        name: "Update Song",
        path: "/components/advanced-form",
        icon: "fa fa-pencil-square",
      },
      {
        name: "All Song",
        path: "/components/all-songs",
        icon: "fa fa-pencil-square",
      },
      {
        name: "Genre",
        path: "/components/all-songs",
        icon: "fa fa-pencil-square",
      },
    ],
  },

  {
    name: "Albums",
    path: "/",
    icon: "fa fa-pencil-square",
    children: [
      {
        name: "All Albums",
        path: "/forms/all-album",
        icon: "fa fa-pencil-square",
      },
      {
        name: "Add Album",
        path: "/forms/add-album",
        icon: "fa fa-pencil-square",
      },
    ],
  },

  {
    name: "Widgets",
    path: "/components/widgets",
    icon: "fa fa-calculator",
  },

  {
    title: true,
    name: "Extras",
    class: "menu-title",
  },
  {
    name: "Pages",
    path: "/",
    icon: "fa fa-paperclip",
    children: [
      {
        name: "Login",
        path: "/auth/login",
        icon: "fa fa-sign-in",
      },
      {
        name: "Register",
        path: "/auth/register",
        icon: "fa fa-sign-in",
      },
      {
        name: "Error 404",
        path: "/auth/Page404",
        icon: "fa fa-paper-plane",
      },
      {
        name: "Error 500",
        path: "/auth/Page500",
        icon: "fa fa-paper-plane",
      },
    ],
  },
];

export const miniNav = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "fa fa-dashboard",
  },
  {
    name: "Components",
    path: "/",
    icon: "fa fa-puzzle-piece",
    children: [
      {
        name: "Likes",
        path: "/components/buttons",
        icon: "fa fa-puzzle-piece",
      },
    ],
  },
  {
    name: "Forms",
    path: "/",
    icon: "fa fa-pencil-square",
    children: [
      {
        name: "Basic Form",
        path: "/components/basic-form",
        icon: "fa fa-pencil-square",
      },
      {
        name: "Advanced Form",
        path: "/components/advanced-form",
        icon: "fa fa-pencil-square",
      },
    ],
  },
];
