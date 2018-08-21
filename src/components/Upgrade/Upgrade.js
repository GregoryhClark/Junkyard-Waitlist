import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getUser } from './../../ducks/users';
import { Redirect } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import TopNav from '../TopNav/TopNav';
import './Upgrade.css';
import Paper from '@material-ui/core/Paper';
const { REACT_APP_PAYMENT_REQ } = process.env
class Private extends Component {
    constructor() {
        super()
        this.state = {

            userIsAdmin: false,
            userIsPremium: false,
            redirect: false

        }
        this.onToken = this.onToken.bind(this);
    }

    componentDidMount() {

        this.props.getUser()

    }

    onToken(token) {

        let user = this.props.user;

        token.card = void 0;
        axios.post(`${REACT_APP_PAYMENT_REQ}${user.id}`, { token, amount: 100 }).then(response => {
            this.setState({ redirect: true })
            alert(`You have been upgraded to premium!`)
            return <Redirect to='/dashboard' />
        });

    }
    myFunction() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }
    render() {

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/dashboard' />;
        }


        return (
            <div>

                <TopNav userIsAdmin = {this.props.user.is_admin} userIsPremium = {this.props.user.is_premium}/>
                <div className="upgrade_paper">
                <Paper>
                    <h1 className="upgrade_header">Upgrade to Premium for just 99 cents!</h1>

                    <p className="upgrade_desc"> Want immdediate notifications? Premium gets you immediate updates whenever a new vehicle is added to our inventory. With a basic account, notifications are sent out 24 hours after they are logged in our system.</p>
                    <div className="checkout_form">
                        <StripeCheckout
                            token={this.onToken}
                            stripeKey='pk_test_uFE6zSqGKm4S9QEMIg47DAPr'
                            amount={0.99} />

                    </div>
                </Paper>

                </div>


            </div>
        )
    }
}
function mapStateToProps(state) {

    let { user } = state;
    return {
        user: user
    }
}

export default connect(mapStateToProps, { getUser })(Private)