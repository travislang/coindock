import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import green from '@material-ui/core/colors/green';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        // fontSize: theme.typography.pxToRem(15),
        flexBasis: '50%',
        flexShrink: 0,
        paddingLeft: 20,
    },
    secondaryHeading: {
        // fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        flexBasis: '25%',
        textAlign: 'center'
    },
    green: {
        color: green[500],
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        flexBasis: '33.33%',
        borderRight: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        textAlign: 'center',
    },
    avatar: {
        padding: 5,
        width: 30,
        height: 30,
        verticalAlign: 'top',
        backgroundColor: theme.palette.grey[300]
        
    },
    inline: {
        display: 'inline-block',
    }
});

class CoinExpansionItem extends Component {
    state = {
        expanded: null,
    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    render() {
        const { classes, coin } = this.props;
        const { expanded } = this.state;
        
        return (
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.heading}>
                        <Avatar alt="crypto logo" src={coin.logo} className={classNames(classes.avatar, classes.inline)} />
                        <Typography variant='h5' className={classNames(classes.inline, classes.heading)}>
                            {coin.symbol_name}
                        </Typography>
                    </div>
                    <Typography variant='h6' className={classNames(classes.secondaryHeading, classes.green)}>55</Typography>
                    <Typography variant='h6' className={classes.secondaryHeading}>+7.14%</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.helper}>
                        <Typography variant='h5'>
                            2,548,582
                            </Typography>
                        <Typography color='secondary' variant='overline'>
                            24 Hour Volume
                            </Typography>
                    </div>
                    <div className={classes.helper}>
                        <Typography variant='h5'>
                            $58,690,281
                            </Typography>
                        <Typography color='secondary' variant='overline'>
                            Market Cap
                            </Typography>
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary">
                        Save
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    }
}

export default withStyles(styles)(CoinExpansionItem);


