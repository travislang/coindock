const search = (state = false, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TRUE':
            return true;
        case 'SET_SEARCH_FALSE':
            return false;
        default:
            return state;
    }
}

export default search;