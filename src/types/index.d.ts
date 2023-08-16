import { StaticImageData } from "next/image";
import { Service } from './service';
import { User } from './user';

export type Languages = 'es' | 'en';

export type LanguageObj = {
  code: string;
  name: string;
  flag: StaticImageData | string;
}

export type UserProfile = {
  id?: number;
  username: string;
  fullname?: string;
  profile_image?: string;
  phone_number?: string;
  email?: string;
};

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

export type LoginBody = {
  username: string;
  password: string;
};

export type UserForm = {
  nickname: string;
  username: string;
  label_code: string;
  password: string;
  payment_method_id: number;
  state_id: number;
  contact: string;
  company: string;
  email: string;
  phone_number_mobile: string;
  phone: string;
  qq: string;
  user_level_id: number;
  credits: string;
  finantial_representative: number;
  client_service_representative: number;
  sales_representative: number;
  sales_source: number;
  subsidiary_id: number;
  regional_division_id: number;
  warehouse_id: number;
  observations: string;
  actions: number[];
  observations: string;
};

export type CargoStationWarehouseForm = {
  id?: number;
  name: string;
  english_name: string;
  receiving_area: string;
  principal: string;
  contact_phone: string;
  stateId: number;
  address: string;
  city: string;
  province: string;
  country: string;
  cp: string;
  shared_warehouse_system_code: string;
  shared_warehouse_docking_code: string;
  customer_order_number_rules: string;
};

export type PaymentMethodForm = {
  code: string;
  name: string;
};

export type UserLevelForm = {
  name: string;
  designated_service: number;
  instructions: string;
};

export type StateWarehouse = {
  id: number;
  name: string;
}

export type CargoStationWarehouseProps = {
  states: StateWarehouse[];
  countries: Country[];
};

export type UserLevelProps = {
  services: Service[];
};

export type UsersProps = {
  userList: User[];
};

export type UserFormProps = {
  id?: number;
  user?: User;
  staffList: any[];
  subsidiarieList: any[];
  regionalDivisionList: any[];
  warehouseList: any[];
  userLevelList: any[];
  paymentMethodList: any[];
  userStateList: any[];
};

export type WarehouseListProps = {
  warehouseList: CargoStationWarehouseForm[];
};

export type ValueSelect = { 
  value: string | number; 
  label: string 
};

export type LoginResponse = {
  status: number;
  token?: string;
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

export type CargoStationWarehouseResponse = {
  status: number;
  warehouse?: CargoStationWarehouseForm;
};

export type Response = {
  status: number;
  data?: any;
};

export type MenuOption = {
  label: string;
  items?: MenuOption[];
  action?: number;
  route?: string;
};

export type TypeOptions = "success" | "error" | "info" | "warning";
export type TypePositions = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
export type TypeThemes = "light" | "dark";
export type TypeField = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'daterange' | 'tel' | 'search';
