import React, { Component } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    logo: {
        fontWeight: theme.typography.fontWeightLight,
        letterSpacing: '0.03em',
        fontSize: "1.5rem",
        lineHeight: '1.33',
        display: 'inline-block',
        marginRight: '5px'
    }
});

class LogoIcon extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Typography className={classes.logo} color="inherit" >
                    CoinDock
                </Typography>
                <SvgIcon color='primary' viewBox='0 0 40.029 40.029'>
                    <path d="M34.408,10.246L23.48,10.367l-5.359,9.527l5.572,9.402l10.928-0.123l5.359-9.525L34.408,10.246z M33.661,27.551
                    l-9.043,0.104l-4.61-7.781l4.434-7.883l9.043-0.102l4.609,7.779L33.661,27.551z"/>
                    <path d="M16.549,18.932l5.357-9.527L16.334,0L5.406,0.125L0.049,9.65l5.57,9.402L16.549,18.932z M6.365,1.746l9.047-0.102
                        l4.607,7.781l-4.432,7.883l-9.044,0.104L1.936,9.629L6.365,1.746z"/>
                    <path d="M5.644,21.098l-5.358,9.525l5.57,9.406l10.93-0.123l5.357-9.527l-5.571-9.406L5.644,21.098z M15.823,38.283l-9.044,0.104
                    L2.17,30.602l4.433-7.881l9.046-0.105l4.607,7.783L15.823,38.283z"/>
                </SvgIcon>
            </div>
            
        )
    }
    
}

export default withStyles(styles)(LogoIcon);
