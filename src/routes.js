import ClientDashboard from "views/pages/ClientDashboard.jsx";
import AdvisoryDashboard from "views/pages/AdvisoryDashboard.jsx";
import AdminDashboard from "views/pages/AdminDashboard.jsx";
import Profile from "views/pages/Profile.jsx";
import Maps from "views/pages/Maps.jsx";
import Register from "views/pages/Register.jsx";
import Login from "views/pages/Login.jsx";
import Categories from "views/pages/Categories.jsx";
import ForgotPassword from "./views/pages/ForgotPassword";
import RecoveryPassword from "./views/pages/RecoveryPassword";
import OfxImports from "./views/pages/OfxImports";
import Banks from "./views/pages/Bank/Banks";
import CreditCards from "./views/pages/CreditCards";
import Bills from "./views/pages/Bills";
import BillTypes from "./views/pages/BillTypes";
import Expenses from "./views/pages/Expenses";
import Revenues from "./views/pages/Revenues";
import Transfers from "./views/pages/Transfers";
import Chat from "./views/pages/Chat/Chat";
import ClientPerAdvisory from "./views/pages/ClientPerAdvisory";
import MaintenanceBank from "./views/pages/Bank/Maintenance";


import { getTokenDecoded } from "./auth";

function routes() {

  const companyType = getTokenDecoded().type;

  const defaultRoutes = [
    {
      path: "/login",
      name: "Entrar no Sistema",
      icon: "ni ni-circle-08 text-pink",
      component: Login,
      layout: "/autenticar",
      display: false
    },
    {
      path: "/registre-se",
      name: "Registre-se em nosso sistema",
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
  
  const clientRoutes = [
    {
      path: "/principal",
      name: "Principal",
      icon: "ni ni-tv-2 text-primary",
      component: ClientDashboard,
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
          path: "/bancos/:id/editar",
          name: "Bancos - Editar",
          icon: "ni ni-building text-blue",
          component: MaintenanceBank,
          layout: "/app",
          private: true,
          display: false
        },
        {
          path: "/bancos/novo",
          name: "Bancos - Novo",
          icon: "ni ni-building text-blue",
          component: MaintenanceBank,
          layout: "/app",
          private: true,
          display: false
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
          component: Chat,
          layout: "/app",
          private: true,
          display: true
        }
      ]
    }
  ];

  const advisoryRoutes = [
    {
      path: "/principal",
      name: "Principal",
      icon: "ni ni-tv-2 text-primary",
      component: AdvisoryDashboard,
      layout: "/app",
      private: true,
      display: true
    },
  ];

  const adminRoutes = [
    {
      path: "/principal",
      name: "Principal",
      icon: "ni ni-tv-2 text-primary",
      component: AdminDashboard,
      layout: "/app",
      private: true,
      display: true
    },
    {
      path: "/cliente-x-consultoria",
      name: "Cliente X Consultoria",
      icon: "fas fa-users text-green",
      component: ClientPerAdvisory,
      layout: "/app",
      private: true,
      display: true
    }
  ];

  switch (companyType) {
    case 1:
      return [...defaultRoutes, ...clientRoutes];
      break;

    case 2:
      return [...defaultRoutes, ...advisoryRoutes];
      break;

    case 3:
      return [...defaultRoutes, ...adminRoutes];
      break;
  
    default:
      return defaultRoutes;
  }
}

export default routes();
