/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors, Menu, MenuItem } from '@material-ui/core';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => { 
        if(page.href === "#") {
          const { subpages } = page;

          return (
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <PopupState variant="popover" popupId="financial-popup">
                {popupState => (
                  <React.Fragment>
                    <Button 
                      component={CustomRouterLink}
                      to={'#/'}
                      activeClassName={classes.active}
                      className={classes.button}
                      {...bindTrigger(popupState)}
                    >
                      <div className={classes.icon}>{page.icon}</div>
                      {page.title}
                    </Button>
                    <Menu 
                      {...bindMenu(popupState)} 
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      getContentAnchorEl={null}
                    >
                      {subpages.map(subpage => {
                        return (
                          <MenuItem 
                            component={CustomRouterLink}
                            to={subpage.href}
                            key={subpage.title}
                          >
                            <div className={classes.icon}>{subpage.icon}</div>
                            {subpage.title}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </ListItem>
          ); 
        } else {
          return (
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                to={page.href}
              >
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
              </Button>
            </ListItem>
          ); 
        }
      })}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
