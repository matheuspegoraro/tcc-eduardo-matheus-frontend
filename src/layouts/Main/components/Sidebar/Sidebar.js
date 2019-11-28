import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  AttachMoney as AttachMoneyIcon, 
  MoneyOff as MoneyOffIcon, 
  AccountBalance as AccountBalanceIcon,
  MonetizationOn as MonetizationOnIcon,
  Money as MoneyIcon,
  CreditCard as CreditCardIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Chat Online',
      href: '/chat-online',
      icon: <ChatIcon />
    },
    {
      title: 'Financeiro',
      href: '#',
      icon: <MonetizationOnIcon />,
      subpages: [
        {
          title: 'Entradas',
          href: '/entradas-financeiras',
          icon: <AttachMoneyIcon />
        },
        {
          title: 'Saídas',
          href: '/saidas-financeiras',
          icon: <MoneyOffIcon />
        },
        {
          title: 'Fluxo de Caixa',
          href: '/fluxo-de-caixa',
          icon: <MoneyIcon />
        },
        {
          title: 'Contas Bancárias',
          href: '/contas-bancarias',
          icon: <AccountBalanceIcon />
        },
        {
          title: 'Cartões',
          href: '/cartoes',
          icon: <CreditCardIcon />
        },
      ],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
