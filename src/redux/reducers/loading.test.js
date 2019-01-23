import loading from './loading.reducer';

describe('Testing loading reducer', () => {
    //If action.payload is false set loading state as false
    test('input is false, output should be false', () => {
        let action = { type: 'SET_LOADING_FALSE'}
        expect(loading(undefined, action)).toBe(false)
    })
    //If action.payload is true set loading state as true
    test('input is true, output should be true', () => {
        let action = { type: 'SET_LOADING_TRUE'}
        expect(loading(undefined, action)).toBe(true)
    })
});