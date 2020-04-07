/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

class HeaderWithDescription extends React.Component {

  render() {
    return (
      <>
        <div className={'header pt-2 bg-gradient-' + this.props.color}>
          <Container className="d-flex align-items-center" fluid>
            <Row className="w-100">
              <Col md="12">
                <h1 className="display-2 text-white">{this.props.title}</h1>
                <p className="text-white mb-3">
                  {this.props.description}
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default HeaderWithDescription;
