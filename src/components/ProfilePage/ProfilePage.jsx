import React, { Component } from 'react';
import { connect } from 'react-redux';


class ProfilePage extends Component {
    render() {
        return (
            <div>
                <p>
                    Profile Page
                </p>
            </div>
        )
    }
}

export default connect()(ProfilePage);