const portfolios = (state = null, action) => {
    switch (action.type) {
        case 'SET_EXPANDED':
            return action.payload;
        default:
            return state;
    }
}

export default portfolios;