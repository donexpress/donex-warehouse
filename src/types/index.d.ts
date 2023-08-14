import { StaticImageData } from "next/image";
import internal from "stream";

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
  fullname: string;
  username: string;
  label_code: string;
  password: string;
  payment_method: number;
  state: number;
  contact_person: string;
  company: string;
  email: string;
  phone_number_mobile: string;
  phone_number: string;
  qq: string;
  user_level: number;
  credits: string;
  financial: number;
  service_client: number;
  sales: number;
  source_sales: number;
  subsidiary: number;
  reception_area: number;
  site: number;
  instructions: string;
  actions: number[];
};

export type CargoStationWarehouseForm = {
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
