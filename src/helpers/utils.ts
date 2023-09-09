import React from "react";
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
  let time: any = new Date(validTimestamp).toString().split(" ")[4];
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
