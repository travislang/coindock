const portfolios = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PORTFOLIOS':
            return {
                portfolios: action.payload,
                activePortfolio: action.payload.filter(item => {
                    return item.active;
                })
            }
        case 'SET_ACTIVE_PORTFOLIO':
            return {
                ...state,
                activePortfolio: state.portfolios.filter(item => {
                    return item.active;
                })
            }
        default:
            return state;
    }
}

export default portfolios;