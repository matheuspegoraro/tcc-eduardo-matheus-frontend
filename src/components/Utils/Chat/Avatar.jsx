import React, { useState } from "react";

function Avatar(props) {
  return (
      <div style={classes}>{props.children}</div>
  );
}

const classes = {
  backgroundImage: "url('http://i.stack.imgur.com/Dj7eP.jpg')",
  width: "75px",
  height: "75px",
  margin: "12.5px",
  backgroundSize: "cover",
  backgroundPosition: "top center",
  borderRadius: "50%"
}

export default Avatar;
