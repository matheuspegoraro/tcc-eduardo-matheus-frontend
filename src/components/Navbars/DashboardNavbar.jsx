import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";

import { removeToken, getTokenDecoded } from "../../auth";

function DashboardNavbar() {

  const userName = getTokenDecoded().name;

  const logout = async (e) => {
    e.preventDefault();
    removeToken();
    window.location.replace('/autenticar/login');
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("assets/img/theme/team-1-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {userName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Bem vindo!</h6>
                </DropdownItem>
                <DropdownItem to="/app/perfil" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Perfil</span>
                </DropdownItem>
                <DropdownItem to="/app/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Configurações</span>
                </DropdownItem>
                <DropdownItem to="/app/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Atividades</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#" onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Sair</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default DashboardNavbar;
