import React, { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.jsx";

import List from "../../components/Utils/Chat/List.jsx";
import ListItem from "../../components/Utils/Chat/ListItem.jsx";

function ChatSupport() {
  return (
    <>
      <SimpleHeader color="info"/>
      {/* Page content */}
      <Container className=" mt--8" fluid>
        {/* Table */}
        <Row>
          <div className=" col-sm-12 col-lg-6 col-xl-4">
            <Card className=" shadow">
              <CardHeader className=" bg-transparent">
                <h3 className=" mb-0">Conversas</h3>
              </CardHeader>
              <CardBody style={{padding: 0}}>
                <List>
                  <ListItem />                  
                  <ListItem />                  
                  <ListItem />                  
                  <ListItem />                  
                  <ListItem />                  
                  <ListItem />                  
                  <ListItem />                  
                </List>
              </CardBody>
            </Card>
          </div>
          <div className=" col-sm-12 col-lg-6 col-xl-8 mt-sm-4 mt-lg-0">
            <Card className=" shadow">
              <CardHeader className=" bg-transparent">
                <h3 className=" mb-0">Matheus Pegoraro</h3>
              </CardHeader>
              <CardBody style={{padding: 0}}>
                <List>
                  
                </List>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default ChatSupport;
