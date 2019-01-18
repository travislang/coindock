const connectedFlag = (state = true, action) => {
    switch (action.type) {
        case 'SET_CONNECTED_FALSE':
            return false;
        case 'SET_CONNECTED_TRUE':
            return true;
        default:
            return state;
    }
}

export default connectedFlag;