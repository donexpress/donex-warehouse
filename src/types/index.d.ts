import { StaticImageData } from "next/image";
import { Service } from './service';
import { User } from './user';
import { Line } from './line';
import { Staff, StaffState } from './staff';
import { PaymentMethod } from './payment_methods';
import { UserState } from './user_state';
import { Role } from './role';
import { Organization } from './organization';

export type Languages = 'es' | 'en' | 'zh';

export type LanguageObj = {
  code: string;
  name: string;
  flag: StaticImageData | string;
}

export type MessageOpts = {
  type?: TypeOptions;
  position?: TypePositions;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: TypeThemes;
};

export type AppProps = {
  inWMS: boolean;
  inOMS: boolean;
};

export type PaginationProps = {
  pageLimit: number;
  totalRecords: number;
  pageNeighbours: number;
  totalPages: number;
};

export type LoginBody = {
  username: string;
  password: string;
};

export type UserForm = {
  nickname: string;
  username: string;
  label_code: string;
  password: string;
  payment_method_id: number | null;
  state: string | null;
  contact: string;
  company: string;
  email: string;
  phone_number: string;
  phone: string;
  qq: string;
  user_level_id: number | null;
  credits: string;
  finantial_representative: number | null;
  client_service_representative: number | null;
  sales_representative: number | null;
  sales_source: number | null;
  subsidiary_id: number | null;
  regional_division_id: number | null;
  warehouse_id: number | null;
  observations: string;
  shipping_control: boolean;
  hidde_transfer_order: boolean;
  reset_password: boolean;
  customer_number?: string;
};

export type CargoStationWarehouseForm = {
  id?: number;
  name: string;
  english_name: string;
  receiving_area: string;
  principal: string;
  contact_phone: string;
  state: string | null;
  address: string;
  city: string;
  province: string;
  country: string;
  cp: string;
  shared_warehouse_system_code: string;
  shared_warehouse_docking_code: string;
  customer_order_number_rules: string;
};

export type StateWarehouse = {
  id: number;
  name: string;
  es_name: string,
  zh_name: string,
  value: string,
  position: number,
}

export type StateDefault = {
  normal: StateWarehouse,
  frezze: StateWarehouse,
  close: StateWarehouse,
};

export type CargoStationWarehouseProps = {
  id?: number;
  warehouse?: CargoStationWarehouseForm;
  isFromDetails?: boolean;
  states: StateWarehouse[];
  countries: Country[];
  receptionAreas: any[];
};

export type UsersProps = {
  userList: User[];
  userStateList: UserState[];
  paymentMethodList: PaymentMethod[];
};

export type UserFormProps = {
  id?: number;
  user?: User;
  isFromShowUser?: boolean;
  staffList: any[];
  subsidiarieList: any[];
  regionalDivisionList: any[];
  warehouseList: any[];
  userLevelList: any[];
  paymentMethodList: any[];
  userStateList: any[];
};

export type WarehouseListProps = {
  states: StateWarehouse[];
};

export type ValueSelect = {
  value: string | number;
  label: string
};

export type LoginResponse = {
  status: number;
  token?: string;
  message?: string;
};

export type Country = {
  name: string;
  native: string;
  phone: string;
  continent: string;
  capital: string;
  currency: string;
  languages: string[];
  emoji: string;
  emojiU: string;
};

export type Carrier = {
  name: string;
  value: string;
  position: string;
}

export type MWB = {
  waybill_id: string;
  carrier?: string;
}

export type CargoStationWarehouseResponse = {
  status: number;
  warehouse?: CargoStationWarehouseForm;
};

export type StaffProps = {
  staffList: Staff[];
};

export type StaffFormProps = {
  id?: number;
  staff?: Staff;
  isFromDetails?: boolean;
  staffStates: StaffState[];
  roles: Role[];
  organizations: Organization[];
  affiliations: CargoStationWarehouseForm[];
};

export type StaffForm = {
    username: string;
    password: string;
    chinesse_name: string | null;
    english_name: string | null;
    email: string;
    phone: string;
    observations: string | null;
    state: string | null;
    organization_id: number | null;
    role_id: number | null;
    affiliations: number[] | null;
    warehouses?: CargoStationWarehouseForm[];
    default_cargo_station_id: number | null;
    change_password_on_login: boolean;
    allow_search: boolean;
};

export type StaffFormProps = {
  id?: number;
  staff?: Staff;
  isFromDetails?: boolean;
  staffStates: StaffState[];
  roles: Role[];
  organizations: Organization[];
  affiliations: CargoStationWarehouseForm[];
};

export type LineForm = {
  name: string;
  contain_channels?: string;
  include_order_account?: string;
};

export type LineFormProps = {
  id?: number;
  line?: Line;
  isFromDetails?: boolean;
};

export type Response = {
  status: number;
  data?: any;
};

export type MenuOption = {
  id?: number;
  icon?: string;
  label: string;
  items?: MenuOption[];
  action?: number;
  route?: string;
};

export type File = {
  url: string;
  name: string;
};

export type Counts = {
  user_count: number;
  staff_count: number;
  role_count: number;
  level_count: number;
  payment_level_count: number;
  organization_count: number;
  warehouse_count: number;
  service_count: number;
  supplier_count: number;
  storage_plan_count: number;
  output_plan_count: number;
  cargo_station_count: number;
  line_clasification_count: number;
  regional_division_count: number;
};

export type BatchStoragePlans = {
  customer_order_number: string;
  username?: string | null;
  warehouse_code: string;
  reference_number: string;
  pr_number: string;
  box_amount: number;
  delivered_time: string | null;
  observations: string;
  return: boolean;
  rejected_boxes: boolean;
  expansion_box_number: string;
  digits_box_number: number | null;
};

export type BatchStoragePlansInput = {
  customer_order_number: string;
  username: string | null;
  warehouse_code: string;
  reference_number: string;
  bl_number: string;
  box_amount: number;
  delivered_time: string;
  observations: string;
  return: boolean;
  rejected_boxes: boolean;
  digits_box_number: number;
};

export type TypeOptions = "success" | "error" | "info" | "warning";
export type TypePositions = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
export type TypeThemes = "light" | "dark";
export type TypeField = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'daterange' | 'tel' | 'search' | 'checkbox' | 'select-filter' | 'datetime-local';
