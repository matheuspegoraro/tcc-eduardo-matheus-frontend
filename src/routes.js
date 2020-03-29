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
import Banks from "./views/pages/Banks";
import CreditCards from "./views/pages/CreditCards";
import Bills from "./views/pages/Bills";
import BillTypes from "./views/pages/BillTypes";
import Expenses from "./views/pages/Expenses";
import Revenues from "./views/pages/Revenues";
import Transfers from "./views/pages/Transfers";
import ChatSupport from "./views/pages/ChatSupport";

var routes = [
  {
    path: "/principal",
    name: "Principal",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/app",
    private: true,
    display: true
  },
  {
    path: "/categorias",
    name: "Categorias",
    icon: "ni ni-planet text-blue",
    component: Categories,
    layout: "/app",
    private: true,
    display: true
  },
  {
    path: null,
    name: "Financeiro",
    icon: "ni ni-money-coins text-info",
    component: null,
    layout: null,
    private: true,
    display: true,
    children: [
      {
        path: "/receitas",
        name: "Receitas",
        icon: "fa fa-arrow-up text-green",
        component: Revenues,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/despesas",
        name: "Despesas",
        icon: "fa fa-arrow-down text-red",
        component: Expenses,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/transferencias",
        name: "Transferências",
        icon: "fa fa-exchange-alt text-primary",
        component: Transfers,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/bancos",
        name: "Bancos",
        icon: "ni ni-building text-blue",
        component: Banks,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/cartoes-credito",
        name: "Cartões",
        icon: "ni ni-credit-card text-info",
        component: CreditCards,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/tipos-contas-bancaria",
        name: "Tipos de Conta Bancária",
        icon: "ni ni-bag-17 text-orange",
        component: BillTypes,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/contas-bancarias",
        name: "Contas Bancárias",
        icon: "ni ni-bag-17 text-orange",
        component: Bills,
        layout: "/app",
        private: true,
        display: true
      }
    ]
  },
  {
    path: null,
    name: "Arquivos O.F.X.",
    icon: "fa fa-archive text-green",
    component: null,
    layout: null,
    private: true,
    display: true,
    children: [
      {
        path: "/importar-ofx",
        name: "Importar",
        icon: "fa fa-file-upload text-green",
        component: OfxImports,
        layout: "/app",
        private: true,
        display: true
      },
      {
        path: "/historico-ofx",
        name: "Históricos",
        icon: "fa fa-history text-blue",
        component: null,
        layout: "/app",
        private: true,
        display: true
      },
    ]
  },
  {
    path: null,
    name: "Suporte",
    icon: "ni ni-single-02 text-orange",
    component: null,
    layout: null,
    private: true,
    display: true,
    children: [
      {
        path: "/chat-suporte",
        name: "Chat Suporte",
        icon: "fa fa-comments text-green",
        component: ChatSupport,
        layout: "/app",
        private: true,
        display: true
      }
    ]
  },
  {
    path: "/login",
    name: "Entrar no Sistema",
    icon: "ni ni-circle-08 text-pink",
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
  },
];
export default routes;
