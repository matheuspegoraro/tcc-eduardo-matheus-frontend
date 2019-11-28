import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: theme.palette.success
  },
  topbar: {
    background: theme.palette.primary.gradient
  }, 
  title: {
    fontWeight: 'bold',
    color: theme.palette.white
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <RouterLink to="/">
          <Typography
            className={classes.title}
            variant="h5"
          >ADMINSITRAÍ</Typography>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
