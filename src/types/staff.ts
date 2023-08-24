export type Staff = {
    id: number;
    username: string;
    chinesse_name: string;
    english_name: string;
    email: string;
    phone: string;
    observations: string | null;
    stateId: number;
    organizationId: number;
    roleId: number;
    states: {
        id: number;
        name: string;
    },
    organizations: {
        id: number;
        name: string;
        parent_organization: string;
        organization_type: string;
    },
    warehouses: []
}