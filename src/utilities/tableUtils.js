import { Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export const createColumn = (dataIndex, title, options = {}) => {
  let sorterImpl = (a, b) => a[dataIndex].localeCompare(b[dataIndex]);

  if (options.isNumeric === true) {
    sorterImpl = (a, b) => a[dataIndex] - b[dataIndex];
  }

  return {
    key: dataIndex,
    dataIndex,
    title,
    defaultSortOrder: "ascend",
    sortDirections: ["descend", "ascend"],
    ellipsis: true,
    sorter: sorterImpl,
    ...options,
  };
};

export const createEditarColumn = (title, key, route,options={}) => {
  return {
    title: title,
    key: key,
    render: (text, record) => {
      return (
        <Space size="small">
          <Link to={route + record.id}>Editar</Link>
        </Space>
      );
    },
    ...options,
  };
};

let serachDelay;

export const search = (value, rows, setDataCallback) => {
  if (serachDelay) {
    clearTimeout(serachDelay);
    serachDelay = null;
  }

  const executeSearch = () => {
    const filteredRows = rows.filter((e) =>
      Object.keys(e)
        .filter((k) => k !== "key")
        .some((k) => String(e[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setDataCallback(filteredRows);
  };

  serachDelay = setTimeout(executeSearch, 300);
};
