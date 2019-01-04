import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AlertListItem from './AlertListItem';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};


const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    listStyle: 'none',
    // styles we need to apply on draggables
    backgroundColor: isDragging ? '#444444' : '#303030',
    ...draggableStyle,
});


class AlertsList extends Component {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd = (result) => {
        const { alerts } = this.props;
        
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = reorder(
            alerts,
            result.source.index,
            result.destination.index
        );
        this.props.dispatch({type: 'SET_ALERTS', payload: items})
    }

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_ALERTS'})
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'UPDATE_ALERTS_ORDER', payload: this.props.alerts})
    }

    render() {
        console.log('state', this.state);
        
        const { classes, alerts } = this.props;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            className={classes.root}
                            ref={provided.innerRef}
                        >
                            {alerts.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <AlertListItem coin={item} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            // <List dense className={classes.root}>
            //     {alerts.map(item => (
            //         <AlertListItem coin={item} />
            //     ))}
            // </List>
        );
    }
}

const mapStateToProps = store => ({
    user: store.user,
    alerts: store.alerts
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsList));