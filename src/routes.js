import ClientDashboard from "views/pages/ClientDashboard.jsx";
import AdvisoryDashboard from "views/pages/AdvisoryDashboard.jsx";
import AdminDashboard from "views/pages/AdminDashboard.jsx";
import Register from "views/pages/Register.jsx";
import Login from "views/pages/Login.jsx";
import Categories from "views/pages/Categories.jsx";
import ForgotPassword from "./views/pages/ForgotPassword";
import RecoveryPassword from "./views/pages/RecoveryPassword";
import OfxImports from "./views/pages/OfxImports";
import Banks from "./views/pages/Bank/Banks";
import Bills from "./views/pages/Bills";
import BillTypes from "./views/pages/BillTypes";
import Expenses from "./views/pages/Expense/Expenses";
import MaintenanceExpense from "./views/pages/Expense/Maintenance";
import Revenues from "./views/pages/Revenue/Revenues";
import Transfers from "./views/pages/Transfer/Transfers";
import MaintenanceTransfer from "./views/pages/Transfer/Maintenance";
import Chat from "./views/pages/Chat/Chat";
import ClientPerAdvisory from "./views/pages/ClientPerAdvisory";
import MaintenanceBank from "./views/pages/Bank/Maintenance";
import MaintenanceRevenue from "./views/pages/Revenue/Maintenance";
import Profile from "./views/pages/Profile";
import Consultancies from "./views/pages/Consultancies";
import CashFlow from "./views/pages/CashFlow";

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
          path: "/fluxo-de-caixa",
          name: "Fluxo de Caixa",
          icon: "fa fa-chart-line text-orange",
          component: CashFlow,
          layout: "/app",
          private: true,
          display: true
        },
        {
          path: "/receitas/:id/editar",
          name: "Receitas",
          icon: "fa fa-arrow-up text-green",
          component: MaintenanceRevenue,
          layout: "/app",
          private: true,
          display: false
        },
        {
          path: "/receitas/novo",
          name: "Receitas",
          icon: "fa fa-arrow-up text-green",
          component: MaintenanceRevenue,
          layout: "/app",
          private: true,
          display: false
        },
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
          path: "/despesas/:id/editar",
          name: "Despesas - Editar",
          icon: "ni ni-building text-blue",
          component: MaintenanceExpense,
          layout: "/app",
          private: true,
          display: false
        },
        {
          path: "/despesas/novo",
          name: "Despesas - Novo",
          icon: "ni ni-building text-blue",
          component: MaintenanceExpense,
          layout: "/app",
          private: true,
          display: false
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
          path: "/transferencias/novo",
          name: "Transferências - Novo",
          icon: "ni ni-building text-blue",
          component: MaintenanceTransfer,
          layout: "/app",
          private: true,
          display: false
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
    },
    {
      path: "/perfil",
      name: "Perfil",
      icon: "ni ni-bag-17 text-orange",
      component: Profile,
      layout: "/app",
      private: true,
      display: true
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
    {
      path: "/perfil",
      name: "Perfil",
      icon: "ni ni-bag-17 text-orange",
      component: Profile,
      layout: "/app",
      private: true,
      display: false
    },
    {
      path: "/consultorias",
      name: "Análise de Clientes",
      icon: "fa fa-user-circle text-orange",
      component: Consultancies,
      layout: "/app",
      private: true,
      display: true
    },
    {
      path: "/receitas",
      name: "Receitas",
      icon: "fa fa-arrow-up text-green",
      component: Revenues,
      layout: "/app",
      private: true,
      display: false
    },
    {
      path: "/despesas",
      name: "Despesas",
      icon: "fa fa-arrow-up text-green",
      component: Expenses,
      layout: "/app",
      private: true,
      display: false
    },
    {
      path: "/transferencias",
      name: "Transferências",
      icon: "fa fa-exchange-alt text-primary",
      component: Transfers,
      layout: "/app",
      private: true,
      display: false
    },
    {
      path: "/fluxo-de-caixa",
      name: "Fluxo de Caixa",
      icon: "fa fa-chart-line text-orange",
      component: CashFlow,
      layout: "/app",
      private: true,
      display: false
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
