import React, { Component } from 'react';
import { getUser, getColorArr, getMakeArr, getModelArr, getYearArr } from './../../ducks/users';
import { connect } from 'react-redux';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import { FormControl } from '../../../node_modules/@material-ui/core';
import './NewWaitlist.css'

const ITEM_HEIGHT = 48;

class NewWaitlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            localInventory: [],
            tempColor: '',
            tempMake: '',
            tempModel: '',
            tempYear: '',
            userIsAdmin: false,
            userIsPremium: false,
            filterClicked: false,
            searchByColor: '',

        }

        this.getModels = this.getModels.bind(this)
        this.addWaitlist = this.addWaitlist.bind(this)
    }
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

    getModels(selectedMake) {
        this.setState({
            tempMake: selectedMake
        })

        axios.get(`/findmodels/${selectedMake}`)
            .then(res => {
                this.props.getModelArr(res.data);
            })
    }

    setTempModel(selectedModel) {
        console.log('setTempModel invoked with value:', selectedModel)
        this.setState({
            tempModel: selectedModel
        })
    }

    setTempYear(selectedYear) {
        this.setState({
            tempYear: selectedYear
        })
    }
    setTempColor(selectedColor) {
        this.setState({
            tempColor: selectedColor
        })

    }

    addWaitlist() {
        let carDetails = this.state;
        carDetails.user_id = this.props.user.id;

        axios.post(`/addwaitlist`, carDetails)
            .then(res => {

                alert('Vehicle added to waitlist.')


                this.setState({
                    tempColor: '',
                    tempMake: '',
                    tempModel: '',
                    tempYear: ''

                })
            }
            )

    }
    render() {


        let makeSelection = this.props.makeArr.length ? this.props.makeArr.map((make, index) => {
            return (

                <MenuItem key={index} value={make.make}>{make.make}</MenuItem>
            )
        })
            : <MenuItem value={40}>Fourty</MenuItem>

        let modelSelection = this.props.modelArr.map((model, index) => {

            if (this.props.modelArr.length > 0) {
                return (
                    <MenuItem key={index} value={model.model}>{model.model}</MenuItem>

                )
            } else {
                return (

                    <MenuItem >Select Make First</MenuItem>
                )
            }
        });

        let yearSelection = this.props.yearArr.map((year, index) => {
            return (

                <MenuItem key={index} value={year.year}>{year.year}</MenuItem>
            )
        })

        let colorSelection = this.props.colorArr.map((color, index) => {

            return (

                <MenuItem key={index} value={color.color}>{color.color}</MenuItem>
            )
        })

        return (

            <div>

                <h1 className="new_waitlist_title">New Waitlist</h1>
                <form className = "new_waitlist_form" autoComplete="off">
                <FormControl>
                    <InputLabel htmlFor="make-select">Make</InputLabel>
                    <Select
                        onChange={(e) => this.getModels(e.target.value)}
                        value={this.state.tempMake}
                        id='make-select'
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {makeSelection}
                    </Select>
                </FormControl>
                <div className="new_waitlist_spacer"></div>

                {/* Model Select */}
                <FormControl>
                    <InputLabel htmlFor="model-select">Model</InputLabel>
                    <Select
                        onChange={(e) => this.setTempModel(e.target.value)}
                        value={this.state.tempModel}
                        id='model-select'
                        paperprops={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: 200,
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {modelSelection}
                    </Select>
                </FormControl>
                <div className="new_waitlist_spacer"></div>


                {/* Year Select */}
                <FormControl>
                    <InputLabel htmlFor="year-select">Year</InputLabel>
                    <Select
                        onChange={(e) => this.setTempYear(e.target.value)}
                        value={this.state.tempYear}
                        id='year-select'
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {yearSelection}
                    </Select>
                </FormControl>
                <div className="new_waitlist_spacer"></div>


                {/* Color Select */}
                <FormControl>
                    <InputLabel htmlFor="color-select">Color</InputLabel>
                    <Select
                        onChange={(e) => this.setTempColor(e.target.value)}
                        value={this.state.tempColor}
                        id='color-select'
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {colorSelection}
                    </Select>
                </FormControl>

                {/* </form> */}

                <div className="filter_buttons">
                    <Button onClick={this.addWaitlist}>Save</Button>
                </div>
                </form>

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

export default connect(mapStateToProps, { getUser, getColorArr, getMakeArr, getModelArr, getYearArr })(NewWaitlist)