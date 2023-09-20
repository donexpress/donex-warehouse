import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import '../../../styles/horizontal.menu.scss';
import { AppProps, MenuOption } from '../../../types';
import { RouteMenu } from '../../../helpers/enums';
import { FaAngleRight } from 'react-icons/fa';

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
                                    items: [
                                        {
                                            label: intl.formatMessage({ id: 'insertStoragePlan' }),
                                            route: RouteMenu.INSERT_STORAGE_PLAN
                                        }
                                    ]
                                },
                                {
                                    label: intl.formatMessage({ id: 'exitPlan' }),
                                    route: RouteMenu.EXIT_PLAN
                                },
                                {
                                    label: intl.formatMessage({ id: 'warehouseManagement' }),
                                    items:[
                                        {
                                            label: intl.formatMessage({ id: 'insertWarehouses' }),
                                            route: RouteMenu.INSERT_WAREHOUSE
                                        },
                                        {
                                            label: intl.formatMessage({ id: 'listWarehouses' }),
                                            route: RouteMenu.WAREHOUSE_MANAGEMENT
                                        }
                                    ]
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
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'insertUserLevel' }),
                                    route: RouteMenu.INSERT_USER_LEVEL
                                },
                                {
                                    label: intl.formatMessage({ id: 'listUserLevels' }),
                                    route: RouteMenu.LIST_USER_LEVELS
                                }
                            ]
                        },
                        {
                            label: intl.formatMessage({ id: 'paymentMethod' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'insertPaymentMethod' }),
                                    route: RouteMenu.INSERT_PAYMENT_METHOD
                                },
                                {
                                    label: intl.formatMessage({ id: 'listPaymentMethods' }),
                                    route: RouteMenu.LIST_PAYMENT_METHODS
                                }
                            ]
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
                            route: RouteMenu.LIST_LINE_CLASSIFICATION
                        },
                        {
                            label: intl.formatMessage({ id: 'regionalDivision' }),
                            route: '#'
                        },
                        {
                            label: intl.formatMessage({ id: 'warehouseStation' }),
                            items: [
                                {
                                    label: intl.formatMessage({ id: 'insertCargoTerminal' }),
                                    route: RouteMenu.INSERT_WAREHOUSE_CARGO_STATION
                                },
                                {
                                    label: intl.formatMessage({ id: 'listCargoTerminal' }),
                                    route: RouteMenu.LIST_WAREHOUSE_CARGO_STATION
                                }
                            ]
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
                                                        <div className='sub-option'>
                                                            <span>
                                                                {subOption.label}
                                                            </span>
                                                            <span className='elements-center'>
                                                                <FaAngleRight size={14} />
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    subOption.items && (subOption.items.length > 0) && (
                                                        <ul>
                                                            {
                                                                subOption.items.map((finalOption, index3) => (
                                                                    <li key={index3}>
                                                                        {
                                                                            finalOption.route && (
                                                                                <a href={`/${locale}/${inOMS ? 'oms' : ''}${inWMS ? 'wms' : ''}/${finalOption.route}`}>{finalOption.label}</a>
                                                                            )
                                                                        }
                                                                        {
                                                                            finalOption.items && (finalOption.items.length > 0) && (
                                                                                <div className='sub-option'>
                                                                                    <span>
                                                                                        {finalOption.label}
                                                                                    </span>
                                                                                    <span className='elements-center'>
                                                                                        <FaAngleRight size={14} />
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        {
                                                                            finalOption.items && (finalOption.items.length > 0) && (
                                                                                <ul>
                                                                                    {
                                                                                        finalOption.items.map((ultimate, index4) => (
                                                                                            <li key={index4}>
                                                                                                <a href={`/${locale}/${inOMS ? 'oms' : ''}${inWMS ? 'wms' : ''}/${ultimate.route}`}>{ultimate.label}</a>
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
