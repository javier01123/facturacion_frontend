import moment from "moment";

export const dateRenderer = (value) => moment(value).format("DD-MM-YYYY");

export const moneyRenderer = (value) => `$` + Number(value).toLocaleString();

export const numberRenderer = (value) => Number(value).toLocaleString();
// ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
