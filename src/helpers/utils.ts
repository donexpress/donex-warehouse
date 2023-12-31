import React from "react";
import { IntlShape } from "react-intl";
export function capitalize(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getDateFormat = (date: string): string => {
  let validTimestamp = null;
  if (date.indexOf(".") > 0) {
    validTimestamp = date.split(".")[0] + "+00:00";
  } else if (date.indexOf("Z") > 0) {
    validTimestamp = date.split("Z")[0] + "+00:00";
  } else {
    validTimestamp = date + "+00:00";
  }
  const months = {
    Jan: "Ene",
    Feb: "Feb",
    Mar: "Mar",
    Apr: "Abr",
    May: "May",
    Jun: "Jun",
    Jul: "Jul",
    Aug: "Ago",
    Sep: "Sep",
    Oct: "Oct",
    Nov: "Nov",
    Dec: "Dic",
  };
  const f_date = new Date(validTimestamp).toString().split(" ");
  if (f_date.length > 0) {
    // @ts-ignore
    if (months[f_date[1]] === undefined) {
      return "";
    }
    // @ts-ignore
    return `${months[f_date[1]]} ${f_date[2]}, ${f_date[3]}`;
  }
  return "";
};

export const getHourFormat = (date: string): string => {
  let validTimestamp = null;
  if (date.indexOf(".") > 0) {
    validTimestamp = date.split(".")[0] + "+00:00";
  } else if (date.indexOf("Z") > 0) {
    validTimestamp = date.split("Z")[0] + "+00:00";
  } else {
    validTimestamp = date + "+00:00";
  }
  const offset = new Date(validTimestamp).getTimezoneOffset()
  const no_offset_date = new Date(validTimestamp);
  let time: any = new Date(no_offset_date.getTime() + offset *60 * 1000).toString().split(" ")[4];
  if (time) {
    time = time.split(":");
    if (Number(time[0]) > 12) {
      return `${Number(time[0]) - 12}:${time[1]}:${time[2]} PM`;
    } else {
      return `${time[0]}:${time[1]}:${time[2]} AM`;
    }
  }
  return "";
};

export const getLanguage = (intl: IntlShape) => {
  switch (intl.locale) {
    case "es":
      return "es_name";
    case "en":
      return "name";
    case "zh":
      return "zh_name";
    default:
      return "name";
  }
};

export const splitLastOccurrence = (str: string, substring:string) => {
  const lastIndex = str.lastIndexOf(substring);
  const before = str.slice(0, lastIndex);
  const after = str.slice(lastIndex + 1);
  return [before, after];
}

export const text_date_format = (date: string):string => {
  let valid_date:string = date.split('T')[0]
  const arr: string[] = valid_date.split('-')
  const months = [
   "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${months[Number(arr[1])-1]} ${arr[2]}, ${arr[0]}`
}