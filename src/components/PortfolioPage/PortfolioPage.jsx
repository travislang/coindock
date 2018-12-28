import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class PortfolioPage extends Component {

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_PORTFOLIOS'})
    }

    render() {
        return (
            <h1>PORTFOLIO PAGE</h1>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
})

export default connect(mapStateToProps)(PortfolioPage);