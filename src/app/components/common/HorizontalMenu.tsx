import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import '../../../styles/horizontal.menu.scss';
import { AppProps, MenuOption } from '../../../types';
import { RouteMenu } from '../../../helpers/enums';

const HorizontalMenu = ({ inWMS, inOMS }: AppProps) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale } = router.query;
    const [options, setOptions] = useState<MenuOption[]>([]);

    useEffect(() => {
        if (inWMS) {
            setOptions([
                {
                    label: intl.formatMessage({ id: 'documents' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'storageAndTransshipment' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'storagePlan' }),
                                    route: RouteMenu.STORAGE_PLAN
                                },
                                {
                                    label: intl.formatMessage({ id: 'exitPlan' }),
                                    route: RouteMenu.EXIT_PLAN
                                },
                                {
                                    label: intl.formatMessage({ id: 'warehouseManagement' }),
                                    route: RouteMenu.WAREHOUSE_MANAGEMENT
                                },
                                {
                                    label: intl.formatMessage({ id: 'operatingInstructions' }),
                                    route: RouteMenu.OPERATING_INSTRUCTIONS
                                },
                                {
                                    label: intl.formatMessage({ id: 'operationsRecord' }),
                                    route: RouteMenu.OPERATIONS_RECORD
                                }
                            ]
                        }
                    ]
                },
                {
                    label: intl.formatMessage({ id: 'user' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'user' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'insertUser' }),
                                    route: RouteMenu.INSERT_USER
                                },
                                {
                                    label: intl.formatMessage({ id: 'listUsers' }),
                                    route: RouteMenu.LIST_USERS
                                }
                            ]
                        },
                        {
                            label: intl.formatMessage({ id: 'userLevel' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'paymentMethod' }),
                            route: '#'
                        }
                    ]
                },
                {
                    label: intl.formatMessage({ id: 'logisticsNetwork' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'service' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'supplier' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'lineClassification' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'regionalDivision' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'warehouseStation' }),
                            route: '#'
                        }
                    ]
                },
                {
                    label: intl.formatMessage({ id: 'equipment' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'staff' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'insertStaff' }),
                                    route: RouteMenu.INSERT_STAFF
                                },
                                {
                                    label: intl.formatMessage({ id: 'listStaff' }),
                                    route: RouteMenu.LIST_STAFF
                                }
                            ]
                        },
                        {
                            label: intl.formatMessage({ id: 'organization' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'employeeRole' }),
                            route: '#'
                        }
                    ]
                }
            ]);
        }
        if (inOMS) {
            setOptions([
                {
                    label: intl.formatMessage({ id: 'ship' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'roadmap' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'storageAndTransshipment' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'storagePlan' }),
                                    route: '#'
                                },
                                {
                                    label: intl.formatMessage({ id: 'exitPlan' }),
                                    route: '#'
                                },
                                {
                                    label: intl.formatMessage({ id: 'productsInventory' }),
                                    route: '#'
                                },
                                {
                                    label: intl.formatMessage({ id: 'operatingInstructions' }),
                                    route: '#'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: intl.formatMessage({ id: 'more' }),
                    items: [
                        {
                            label: intl.formatMessage({ id: 'productLibrary' }),
                            route: '#'
                        }
                    ]
                }
            ]);
        }
    }, [inWMS, inOMS, intl])

    return (
        <nav className="menu">
          <ul>
            {
                options.map((option, index) => (       
                    <li key={index}>
                        {
                            option.route && (
                                <div>
                                    <a href={`/${locale}/${inOMS ? 'oms' : ''}${inWMS ? 'wms' : ''}/${option.route}`}>{option.label}</a>
                                </div>
                            )
                        }
                        {
                            option.items && (option.items.length > 0) && (
                                <div>{option.label}</div>
                            )
                        }
                        {
                            option.items && (option.items.length > 0) && (
                                <ul>
                                    {
                                        option.items.map((subOption, index2) => (
                                            <li key={index2}>
                                                {
                                                    subOption.route && (
                                                        <a href={`/${locale}/${inOMS ? 'oms' : ''}${inWMS ? 'wms' : ''}/${subOption.route}`}>{subOption.label}</a>
                                                    )
                                                }
                                                {
                                                    subOption.items && (subOption.items.length > 0) && (
                                                        <div>{subOption.label}</div>
                                                    )
                                                }
                                                {
                                                    subOption.items && (subOption.items.length > 0) && (
                                                        <ul>
                                                            {
                                                                subOption.items.map((finalOption, index3) => (
                                                                    <li key={index3}>
                                                                        <a href={`/${locale}/${inOMS ? 'oms' : ''}${inWMS ? 'wms' : ''}/${finalOption.route}`}>{finalOption.label}</a>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    )
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </li>
                ))
            }
          </ul>
        </nav>
    );
};
  
export default HorizontalMenu;