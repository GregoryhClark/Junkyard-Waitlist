import React from 'react';
import { connect } from 'react-redux';
import { getUser } from './../../ducks/users'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TopNav from '../TopNav/TopNav';
import { Button } from '../../../node_modules/@material-ui/core';
import axios from 'axios';
import './Profile.css';

class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            cell: '',
            userIsAdmin: false,
            userIsPremium: false
        };
    }
    componentDidMount() {
        this.props.getUser()
            .then((res) => {
                this.setState({
                    localUserID: res.value.id,
                    userIsAdmin: res.value.is_admin,
                    userIsPremium: res.value.is_premium
                })
            })
    }
    updateUserInfo(state) {
        let profileInfo = state;
        profileInfo.user_id = this.props.user.id
        axios.put('/profile', profileInfo)
            .then(this.setState({
                name: '',
                email: '',
                cell: ''
            }),
                alert("Your Info has saved!"),
        )
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <div className="Profile_master">
            
                <TopNav userIsAdmin = {this.props.user.is_admin} userIsPremium = {this.props.user.is_premium}/>
                <div className="prof_spacer"></div>
                <Paper className = "profile_paper">
                    <Typography variant="headline" component="h3">
                        Update your profile information here.
                    </Typography>
                    <form  noValidate autoComplete="off">
                        <div className="profile_textfields">
                        <TextField
                            id="name"
                            label="Name"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal"
                        />
                            <TextField
                            id="email"
                            label="E-Mail"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            margin="normal"
                        />
                            <TextField
                            id="cell"
                            label="Cell Phone"
                            value={this.state.cell}
                            onChange={this.handleChange('cell')}
                            margin="normal"
                        />
                        </div>

                        <Button onClick={() => this.updateUserInfo(this.state)}>Save</Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state
    return {
        user
    }
};
export default (connect(mapStateToProps, { getUser }))(Profile);
