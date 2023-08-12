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

export type LoginResponse = {
  status: number;
  token?: string;
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
