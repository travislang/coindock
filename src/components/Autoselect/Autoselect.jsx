import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

function renderInput(inputProps) {
    const { InputProps, classes, ref, message, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    // const isSelected = false;
    const isSelected = (selectedItem && selectedItem.symbol_name || '').indexOf(suggestion.symbol_name) > -1;
    console.log('suggestion', suggestion, 'is selected', isSelected, 'selected item', selectedItem);
    return (
        <MenuItem
            {...itemProps}
            key={suggestion.id}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.symbol_name}
        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(props) {
    const inputValue = props.inputValue.trim().toLowerCase();
    const inputLength = inputValue.length;
    console.log('getsuggestions props', props);
    
    let count = 0;
    if(inputLength === 0) {
        props.dispatch({ type: 'SET_SEARCH_FALSE' })
        props.dispatch({ type: 'CLEAR_TICKERS' })
    }
    return inputLength === 0
        ? []
        : props.tickerNames.filter(suggestion => {
            const keep =
                count < 7 && suggestion.symbol_name.slice(0, inputLength).toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

const styles = theme => ({
    root: {
        width: '100%',
    },
    container: {
        position: 'relative',
        display: 'flex',
        borderRadius: '25px',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '65%',
        [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing.unit * 3,
            marginRight: theme.spacing.unit * 3,
            width: '50%',
        },
        
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit * 5,
        left: 0,
        top: 0,
        width: '100%',
    },
    inputRoot: {
        color: theme.palette.text.primary,
        width: '100%',
        '&:before': {
            content: '""',
            borderBottom: 'none !important',
            
        },
        '&:after': {
            content: '""',
            borderBottom: 'none'
        },
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacingTop: {
        marginTop: theme.spacing.unit * 9,
    }
});



class IntegrationDownshift extends Component {

    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' });
    }

    handleSelection = (selected) => {
        try {
            if (this.props.handleSelection) {
                this.props.handleSelection(selected);
            }
            else {
                throw 'no selection function was passed down in props to AutoSelect component'
            }
        } catch (err) {
            console.log(err)
        }
    }
    render() {
        const { classes, message, coinId } = this.props;
        let initialId = this.props.tickerNames.filter(item => {
            return item.id === Number(coinId)
        });
        initialId = initialId.length > 0 ? initialId[0].symbol_name : ''
        console.log(initialId);
        
        
        return (
            <div className={classes.container}>
                <Downshift
                    id="downshift-simple"
                    onChange={(selection) => this.handleSelection(selection)}
                    itemToString={item => (item ? item.symbol_name : '')}
                    initialInputValue={initialId}
                >
                    {({
                        getInputProps,
                        getItemProps,
                        getMenuProps,
                        highlightedIndex,
                        inputValue,
                        isOpen,
                        selectedItem,
                    }) => (
                            <div>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                {renderInput({
                                    fullWidth: true,
                                    classes,
                                    InputProps: getInputProps({
                                        placeholder: message
                                    }),
                                })}
                                <div {...getMenuProps()}>
                                    {isOpen ? (
                                        <Paper className={classes.paper} elevation={10}>
                                            {getSuggestions({ inputValue, ...this.props }).map((suggestion, index) =>
                                                renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({ item: suggestion }),
                                                    highlightedIndex,
                                                    selectedItem,
                                                }),
                                            )}
                                        </Paper>
                                    ) : null}
                                </div>
                            </div>
                        )}
                </Downshift>
            </div>
        )
    }
}

IntegrationDownshift.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    tickerNames: state.tickerNames,
});

export default connect(mapStateToProps)(withStyles(styles)(IntegrationDownshift));