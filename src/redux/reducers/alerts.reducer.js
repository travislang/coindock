const alerts = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALERTS':
            return action.payload;
        default:
            return state;
    }
}

export default alerts;