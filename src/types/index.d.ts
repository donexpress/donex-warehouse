import { StaticImageData } from "next/image";

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

export type LoginProps = {
  inWMS: boolean;
  inOMS: boolean;
};

export type LoginBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  status: number;
  token?: string;
};

export type TypeOptions = "success" | "error" | "info" | "warning";
export type TypePositions = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
export type TypeThemes = "light" | "dark";
export type TypeField = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'daterange' | 'tel' | 'search';
