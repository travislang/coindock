const portfolioSymbols = (state = [], action) => {
    switch (action.type) {
        case 'SET_PORTFOLIO_SYMBOLS':
            return action.payload;
        default:
            return state;
    }
}

export default portfolioSymbols;