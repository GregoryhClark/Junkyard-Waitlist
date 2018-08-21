import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getUser, getColorArr, getMakeArr, getModelArr, getYearArr } from './../../ducks/users';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import MyWaitlist from '../MyWaitlist/MyWaitlist';
import NewWaitlist from '../NewWaitlist/NewWaitlist';
import TopNav from '../TopNav/TopNav';

class Private extends Component {

    componentDidMount() {

        this.props.getUser()
        axios.get('/findcolor')
            .then(res => {
              
                this.props.getColorArr(res.data);
            })

        axios.get('/findmakes')
            .then(res => {
              
                this.props.getMakeArr(res.data);
            })

        axios.get('/findyear')
            .then(res => {
                this.props.getYearArr(res.data);
            })
        axios.get('/allinventory')
            .then(res => {
                this.setState({
                    localInventory: res.data
                })

               
            })
    }

    render() {
        const user = this.props.user;
        function checkWaitlistLength() {
            axios.get(`/user_waitlist/${user.id}`).then(res => {
                if(res.data.length === 0){
                    alert("It looks like you don't have any vehicles in your waitlist at this time.")
                }
            })
        }

        return (
            <div className='dashboard_wrapper'>

                <TopNav userIsAdmin = {this.props.user.is_admin} userIsPremium = {this.props.user.is_premium}/>

                <div className="dash_profile_wrapper">
                    <div className="dash_pic">
                        {user ? <img src={user.image_url} alt='user profile' /> : null}
                    </div>
                </div>
                <div className="dash_nav">
                    <a href="/#/dashboard/my_waitlist" onClick={()=>checkWaitlistLength()}>
                        <div>
                            <p>MY WAITLISTS</p>
                        </div></a>
                    <a href="/#/dashboard/new_waitlist">
                        <div>
                            <p>ADD WAITLIST</p>
                        </div></a>
                </div>
                <Switch>
                    <Route path='/dashboard/my_waitlist' component={MyWaitlist} />
                    <Route path='/dashboard/new_waitlist' component={NewWaitlist} />
                </Switch>

            </div>
        )
    }

}
function mapStateToProps(state) {
    const { user, colorArr, makeArr, modelArr, yearArr } = state
    return {
      user,
      colorArr,
      makeArr,
      modelArr,
      yearArr,
    }
  }
  
  export default connect(mapStateToProps, { getUser, getColorArr, getMakeArr, getModelArr, getYearArr })(Private)