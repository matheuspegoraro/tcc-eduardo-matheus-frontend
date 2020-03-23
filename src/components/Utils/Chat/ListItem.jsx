import React, { useState } from "react";

import Avatar from "./Avatar.jsx";
import Column from "./Column.jsx";
import Title from "./Title.jsx";
import Subtitle from "./Subtitle.jsx";

function ListItem(props) {
  return (
      <div className="w-100" style={classes}>
        <div>
          <Avatar />
        </div>
        <div>
          <Column fill>
            <div>
              <Title ellipsis>{'Konrad'}</Title>
              <Subtitle nowrap>{'14:31 PM'}</Subtitle>
            </div>
            <Subtitle ellipsis>
              {'Hello, how can I help you? We have a lot to talk about'}
            </Subtitle>
          </Column>
        </div>
      </div>
  );
}

const classes = {
  margin: 0,
  padding: 0,
  border: '1px solid #F2F2F2',
  height: "100px",
  backgroundColor: '#E6E6E6',
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
};

export default ListItem;
