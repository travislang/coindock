import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PortfolioExpansionPanel from './PortfolioExpansionPanel';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

//reorders listed to users pref order
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// used for sortable item component
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    listStyle: 'none',
    borderBottom: `2px solid rgba(255, 255, 255, 0.12)`,
    backgroundColor: isDragging ? '#444444' : '#303030',
    // styles needed on draggables
    ...draggableStyle,
});


class PortfolioList extends Component {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    // reorder alerts and send new array to redux
    onDragEnd = (result) => {
        const { portfolioSymbols } = this.props;
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = reorder(
            portfolioSymbols,
            result.source.index,
            result.destination.index
        );
        this.props.dispatch({ type: 'SET_PORTFOLIO_SYMBOLS', payload: items })
    }

    // sends new list order to server to save in db
    componentWillUnmount() {
        
    }

    render() {
        const { classes, portfolioSymbols } = this.props;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            className={classes.root}
                            ref={provided.innerRef}
                        >
                            {portfolioSymbols.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <PortfolioExpansionPanel dragHandleProps={provided.dragHandleProps} coin={item} />
                                            
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

const mapStateToProps = store => ({
    portfolioSymbols: store.portfolioSymbols
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioList));