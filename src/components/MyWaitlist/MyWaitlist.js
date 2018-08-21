import React, { Component } from 'react'
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { getUser, getColorArr, getMakeArr, getModelArr, getYearArr } from './../../ducks/users';
import axios from 'axios';
import './MyWaitlist.css';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Private extends Component {
    constructor() {
        super()
        this.state = {
            localUserID: -1,
            localWaitlist: [],
            tempColor: '',
            tempMake: '',
            tempModel: '',
            tempYear: '',
            waitlistVisible: false,
            waitlistClassName: 'waitlist_invisible',
            userIsAdmin: false,
            userIsPremium: false,
            viewingWaitlist: false
        }

    }
    componentDidMount() {

        this.props.getUser()
            .then((res) => {

                this.setState({
                    localUserID: res.value.id,
                    userIsAdmin: res.value.is_admin
                })

            })

        axios.get(`/user_waitlist/${this.props.user.id}`).then(res => {

            this.setState({
                localWaitlist: res.data
            })
        })

    }
    deleteWaitlist(id) {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        axios.delete(`/delete_waitlist/${id}`)
                            .then(axios.get(`/user_waitlist/${this.props.user.id}`).then(res => {

                                this.setState({
                                    localWaitlist: res.data
                                })
                            }))
                    }
                },
                {
                    label: 'No',
                    onClick: () => null
                }
            ]
        })
    }

    render() {
        let headers = this.state.localWaitlist.length ?
            <TableHead>
                <TableRow>
                    <TableCell>Make</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            : null

        var rows = this.state.localWaitlist.map((vehicle, index) => {

            return (

                {
                    id: index + 1,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    vehicleID: vehicle.id

                }
            )
        })

        return (
            <div>
                <div className="waitlist_paper">
                    <Paper >
                        <Table >
                            {headers}
                            <TableBody>
                                {rows.map(row => {
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.make}
                                            </TableCell>
                                            <TableCell >{row.model}</TableCell>
                                            <TableCell >{row.year}</TableCell>
                                            <TableCell >{row.color}</TableCell>
                                            <TableCell >{<Button onClick={(e) => this.deleteWaitlist(row.vehicleID)}>Delete</Button>}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </div>
        )
    }

}
function mapStateToProps(state) {
    const { user, colorArr, makeArr, modelArr, yearArr, navbarSlide } = state
    return {
        user,
        colorArr,
        makeArr,
        modelArr,
        yearArr,
        navbarSlide
    }
}

export default connect(mapStateToProps, { getUser, getColorArr, getMakeArr, getModelArr, getYearArr })(Private)