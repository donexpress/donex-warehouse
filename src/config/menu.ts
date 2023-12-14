import { getCookie } from "@/helpers/cookieUtilserege1992";
import { RouteMenu } from "./../helpers/enums";
import { IntlShape } from "react-intl";

export const menuWMS = (intl: IntlShape) => {
  const role = getCookie("profileWMS").role.name;

  console.log(role);

  let menuWMS = [
    {
      id: 1,
      icon: "BiUser",
      label: intl.formatMessage({ id: "user" }),
      items: [
        {
          id: 1.1,
          label: intl.formatMessage({ id: "users" }),
          route: RouteMenu.LIST_USERS,
        },
        {
          id: 1.2,
          label: intl.formatMessage({ id: "user_levels" }),
          route: RouteMenu.LIST_USER_LEVELS,
        },
        {
          id: 1.3,
          label: intl.formatMessage({ id: "paymentMethod" }),
          route: RouteMenu.LIST_PAYMENT_METHODS,
        },
      ],
    },
    {
      id: 2,
      icon: "BiSolidLayer",
      label: intl.formatMessage({ id: "storageAndTransshipment" }),
      items: [
        {
          id: 2.1,
          label: intl.formatMessage({ id: "storagePlan" }),
          route: RouteMenu.STORAGE_PLAN,
        },
        {
          id: 2.2,
          label: intl.formatMessage({ id: "exitPlan" }),
          route: RouteMenu.EXIT_PLAN,
        },
        {
          id: 2.3,
          label: intl.formatMessage({ id: "warehouseManagement" }),
          route: RouteMenu.WAREHOUSE_MANAGEMENT,
        },
        {
          id: 2.4,
          label: intl.formatMessage({ id: "operatingInstructions" }),
          route: RouteMenu.OPERATING_INSTRUCTIONS,
        },
      ],
    },
    {
      id: 3,
      icon: "BiLogoNetlify",
      label: intl.formatMessage({ id: "logisticsNetwork" }),
      items: [
        /* {
          id: 3.1,
          label: intl.formatMessage({ id: "service" }),
          route: "#",
        },
        {
          id: 3.2,
          label: intl.formatMessage({ id: "supplier" }),
          route: "#",
        }, */
        {
          id: 3.3,
          label: intl.formatMessage({ id: "lineClassification" }),
          route: RouteMenu.LIST_LINE_CLASSIFICATION,
        },
        {
          id: 3.4,
          label: intl.formatMessage({ id: "regionalDivision" }),
          route: RouteMenu.LIST_REGIONAL_DIVISION,
        },
        {
          id: 3.5,
          label: intl.formatMessage({ id: "warehouseStation" }),
          route: RouteMenu.LIST_WAREHOUSE_CARGO_STATION,
        },
      ],
    },
    {
      id: 4,
      icon: "BiCoin",
      label: intl.formatMessage({ id: "finances" }),
      items: [
        {
          id: 4.1,
          label: intl.formatMessage({ id: "airGuide" }),
          route: RouteMenu.LIST_AIR_GUIDE,
        },
        {
          id: 4.2,
          label: intl.formatMessage({ id: "summary" }),
          route: RouteMenu.LIST_SUMMARY,
        },
      ],
    },
    {
      id: 5,
      icon: "BiStation",
      label: intl.formatMessage({ id: "equipment" }),
      items: [
        {
          id: 5.1,
          label: intl.formatMessage({ id: "staff" }),
          route: RouteMenu.LIST_STAFF,
        },
        {
          id: 5.2,
          label: intl.formatMessage({ id: "organization" }),
          route: RouteMenu.LIST_ORGANIZATION,
        },
        /* {
          id: 5.3,
          label: intl.formatMessage({ id: "employeeRole" }),
          route: "#",
        }, */
      ],
    },
  ];

  if (role === "Finanzas") {
    menuWMS = menuWMS.filter((menu) => menu.id === 4)
  } else {
    menuWMS = menuWMS.filter((menu) => menu.id !== 4)
  }

  return menuWMS;
};

export const menuOMS = (intl: IntlShape) => {
  return [
    {
      id: 1,
      icon: "BiSolidShip",
      label: intl.formatMessage({ id: "ship" }),
      items: [
        {
          id: 1.1,
          label: intl.formatMessage({ id: "roadmap" }),
          route: "#",
        },
      ],
    },
    {
      id: 2,
      icon: "BiSolidLayer",
      label: intl.formatMessage({ id: "storageAndTransshipment" }),
      items: [
        {
          id: 2.1,
          label: intl.formatMessage({ id: "storagePlan" }),
          route: RouteMenu.STORAGE_PLAN,
        },
        {
          id: 2.2,
          label: intl.formatMessage({ id: "exitPlan" }),
          route: RouteMenu.EXIT_PLAN,
        },
        /* {
          id: 2.3,
          label: intl.formatMessage({ id: "productsInventory" }),
          route: "#",
        }, */
        {
          id: 2.4,
          label: intl.formatMessage({ id: "operatingInstructions" }),
          route: RouteMenu.OPERATING_INSTRUCTIONS,
        },
      ],
    },
    /* {
      id: 3,
      icon: "BiPlusCircle",
      label: intl.formatMessage({ id: "more" }),
      items: [
        {
          id: 3.1,
          label: intl.formatMessage({ id: "productLibrary" }),
          route: "#",
        },
      ],
    }, */
  ];
};

export const Icons = () => { };
