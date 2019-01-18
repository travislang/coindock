import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    footer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 40,
        backgroundColor: theme.palette.background.default
    }
});

const Footer = (props) => (
  <footer className={props.classes.footer}>
    <Typography variant="overline" align={'center'}>
            Travis Lang &copy; 2019
    </Typography>
  </footer>
);

export default withStyles(styles)(Footer);
