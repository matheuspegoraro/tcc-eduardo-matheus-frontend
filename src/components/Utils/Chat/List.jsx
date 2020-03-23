import React, { useState } from "react";

function List(props) {
  return (
      <div className="w-100" style={classes}>{props.children}</div>
  );
}

const classes = {
  margin: 0,
  padding: 0,
  height: "60vh",
  maxHeight: "60vh",
  overflowY: 'auto',
  backgroundColor: '#F2F2F2'
};

export default List;
