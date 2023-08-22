import { RouteMenu } from "./../helpers/enums";
import { useRouter } from "next/router";
import { useIntl } from 'react-intl';


export const menuWMS = () => {
    const intl = useIntl();
    const router = useRouter();
    return [
        
        {
            id: 1,      
            icon:'BiUser',
            label: intl.formatMessage({ id: 'user' }),
            items: [
                {
                    id:1.1,
                    label: intl.formatMessage({ id: 'listUsers' }),
                    route: RouteMenu.LIST_USERS
                },
                {
                    id:1.2,
                    label: intl.formatMessage({ id: 'listUserLevels' }),
                    route: RouteMenu.LIST_USER_LEVELS
                },
                {
                    id: 1.3,
                    label: intl.formatMessage({ id: 'paymentMethod' }),
                    route: RouteMenu.LIST_PAYMENT_METHODS,
                }
            ]
        },
        {
            id: 2,
            icon:'BiSolidLayer',
            label: intl.formatMessage({ id: 'storageAndTransshipment' }),
            items: [
                {
                    id: 2.1,
                    label: intl.formatMessage({ id: 'storagePlan' }),
                    route: RouteMenu.STORAGE_PLAN
                },
                {
                    id: 2.2,
                    label: intl.formatMessage({ id: 'exitPlan' }),
                    route: RouteMenu.EXIT_PLAN
                },
                {
                    id: 2.3,
                    label: intl.formatMessage({ id: 'warehouseManagement' }),
                    route: RouteMenu.WAREHOUSE_MANAGEMENT
                },
                {
                    id: 2.4,
                    label: intl.formatMessage({ id: 'operatingInstructions' }),
                    route: RouteMenu.OPERATING_INSTRUCTIONS
                },
                {
                    id: 2.5,
                    label: intl.formatMessage({ id: 'operationsRecord' }),
                    route: RouteMenu.OPERATIONS_RECORD
                }
            ]
        },
        {
            id: 3,
            icon:'BiLogoNetlify',
            label: intl.formatMessage({ id: 'logisticsNetwork' }),
            items: [
                {
                    id: 3.1,
                    label: intl.formatMessage({ id: 'service' }),
                    route: '#'
                },
                {
                    id: 3.2,
                    label: intl.formatMessage({ id: 'supplier' }),
                    route: '#'
                },
                {
                    id: 3.3,
                    label: intl.formatMessage({ id: 'lineClassification' }),
                    route: '#'
                },
                {
                    id: 3.4,
                    label: intl.formatMessage({ id: 'regionalDivision' }),
                    route: '#'
                },
                {
                    id: 3.5,
                    label: intl.formatMessage({ id: 'warehouseStation' }),
                    route: RouteMenu.LIST_WAREHOUSE_CARGO_STATION
                }
            ]
        },
        {
            id: 4,
            icon:'BiStation',
            label: intl.formatMessage({ id: 'equipment' }),
            items: [
                {
                    id: 4.1,
                    label: intl.formatMessage({ id: 'staff' }),
                    route: RouteMenu.LIST_STAFF,
                },
                {
                    id: 4.2,
                    label: intl.formatMessage({ id: 'organization' }),
                    route: '#'
                },
                {
                    id: 4.3,
                    label: intl.formatMessage({ id: 'employeeRole' }),
                    route: '#'
                }
            ]
        }
    ]
};

export const menuOMS = () => {
    const intl = useIntl();
    const router = useRouter();
    return [
        {
            id: 1,
            icon:'BiSolidShip',
            label: intl.formatMessage({ id: 'ship' }),
            items: [
                {
                    id: 1.1,
                    label: intl.formatMessage({ id: 'roadmap' }),
                    route: '#'
                }                
            ]
        },
        {
            id: 2,
            icon:'BiSolidLayer',
            label: intl.formatMessage({ id: 'storageAndTransshipment' }),
            items: [
                {
                    id: 2.1,
                    label: intl.formatMessage({ id: 'storagePlan' }),
                    route: '#'
                },
                {
                    id: 2.2,
                    label: intl.formatMessage({ id: 'exitPlan' }),
                    route: '#'
                },
                {
                    id: 2.3,
                    label: intl.formatMessage({ id: 'productsInventory' }),
                    route: '#'
                },
                {
                    id: 2.4,
                    label: intl.formatMessage({ id: 'operatingInstructions' }),
                    route: '#'
                }
            ]
        },
        {
            id: 3,
            icon:'BiPlusCircle',
            label: intl.formatMessage({ id: 'more' }),
            items: [
                {
                    id: 3.1,
                    label: intl.formatMessage({ id: 'productLibrary' }),
                    route: '#'
                }
            ]
        }
    ]
};


export const Icons = () => {

};