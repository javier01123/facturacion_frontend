import moment from "moment";

export const dateRenderer = (value) => moment(value).format("DD-MM-YYYY");

export const moneyRenderer = (value) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  export const numberRenderer = (value) =>
  ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");