import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
        marginRight: theme.spacing.unit * 2
    },
});

class CoinLoader extends React.Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 30);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const { completed } = this.state;
        this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CircularProgress
                    className={classes.progress}
                    variant="determinate"
                    value={this.state.completed}
                    color="primary"
                    size={24}
                />
            </div>
        );
    }
}


export default withStyles(styles)(CoinLoader);