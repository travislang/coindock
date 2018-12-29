const portfolios = (state = [], action) => {
    switch (action.type) {
        case 'SET_PORTFOLIOS':
            return action.payload;
        default:
            return state;
    }
}

export default portfolios;