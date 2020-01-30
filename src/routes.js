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
import Index from "views/Index.jsx";
import Profile from "views/pages/Profile.jsx";
import Maps from "views/pages/Maps.jsx";
import Register from "views/pages/Register.jsx";
import Login from "views/pages/Login.jsx";
import Tables from "views/pages/Tables.jsx";
import Icons from "views/pages/Icons.jsx";
import Categories from "views/pages/Categories.jsx";
import ForgotPassword from "./views/pages/ForgotPassword";
import RecoveryPassword from "./views/pages/RecoveryPassword";
import OfxImports from "./views/pages/OfxImports";

var routes = [
  {
    path: "/principal",
    name: "Principal",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/dashboard",
    private: true,
    display: true
  },
  {
    path: "/categorias",
    name: "Categorias",
    icon: "ni ni-planet text-blue",
    component: Categories,
    layout: "/dashboard",
    private: true,
    display: true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-books text-info",
    component: Icons,
    layout: "/dashboard",
    private: true,
    display: false
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/dashboard",
    private: true,
    display: false
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/dashboard",
    private: true,
    display: false
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/dashboard",
    private: true,
    display: false
  },
  {
    path: "/importar-ofx",
    name: "Importação de OFX",
    icon: "fa fa-file-upload text-red",
    component: OfxImports,
    layout: "/dashboard",
    private: true,
    display: true
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/autenticar",
    display: false
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/autenticar",
    display: false
  },
  {
    path: "/esqueci-minha-senha",
    name: "Forgot Password",
    icon: "ni ni-circle-08 text-pink",
    component: ForgotPassword,
    layout: "/autenticar",
    display: false
  },
  {
    path: "/recuperar-senha",
    name: "Recovery Password",
    icon: "ni ni-circle-08 text-pink",
    component: RecoveryPassword,
    layout: "/autenticar",
    display: false
  }
];
export default routes;
