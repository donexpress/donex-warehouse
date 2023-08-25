export type Staff = {
    id: number;
    username: string;
    chinesse_name: string;
    english_name: string;
    email: string;
    phone: string;
    observations: string | null;
    state_id: number;
    organization_id: number;
    role_id: number;
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
    warehouses: [],
    affiliations: number[] | null;
}

export type StaffState = {
    id: number;
    name: string;
}