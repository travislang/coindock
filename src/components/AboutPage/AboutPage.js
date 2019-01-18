import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PlayArrow from '@material-ui/icons/PlayArrow';

import Footer from'../Footer/Footer';

const styles = theme => ({
    root: {
        position: 'relative',
        minHeight: '90vh',
        flexGrow: 1,
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
});

function AboutPage(props) {
    const { classes } = props;
    return (
        <Grid className={classes.root} container justify={'center'}>
            <Grid item xs={12} md={6}>
                <Typography variant="h4" align={'center'} className={classes.title}>
                    Technologies Used:
                </Typography>
                <Grid container justify={'center'} className={classes.demo}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <PlayArrow color='primary' />
                            </ListItemIcon>
                            <ListItemText
                                primary="React/Redux/Sagas/Node/Express/Material-UI"
                                secondary={null}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PlayArrow color='primary' />
                            </ListItemIcon>
                            <ListItemText
                                primary="Socket.io/Native WebSockets"
                                secondary='Used for real-time price data'
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PlayArrow color='primary' />
                            </ListItemIcon>
                            <ListItemText
                                primary="Service Workers / Web Push API"
                                secondary='Used for push notifications'
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PlayArrow color='primary' />
                            </ListItemIcon>
                            <ListItemText
                                primary="Nivo"
                                secondary='Used for price charts'
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PlayArrow color='primary' />
                            </ListItemIcon>
                            <ListItemText
                                primary="Downshift"
                                secondary='Used for predictive search'
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
            <Footer />
        </Grid>
    )
}

export default withStyles(styles)(AboutPage);
