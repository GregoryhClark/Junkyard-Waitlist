import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getUser, getColorArr, getMakeArr, getModelArr, getYearArr } from './../../ducks/users';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import './Inventory.css';
import 'react-confirm-alert/src/react-confirm-alert.css'
import TopNav from '../TopNav/TopNav';

class Private extends Component {
    constructor() {
        super()
        this.state = {
            localInventory: [],
            tempColor: '',
            tempMake: '',
            tempModel: '',
            tempYear: '',
            isEditing: false,
            editingIndex: -1,
            filterClicked: false

        }
        this.enterInventory = this.enterInventory.bind(this);
        this.searchAllInventory = this.searchAllInventory.bind(this);
        this.deleteInventory = this.deleteInventory.bind(this);
        this.editInventory = this.editInventory.bind(this);
        this.displayCorrectModelSchtuff = this.displayCorrectModelSchtuff.bind(this);
        this.searchInventoryFiltered = this.searchInventoryFiltered.bind(this);
        this.editClick = this.editClick.bind(this);
    }
    componentDidMount() {

        this.props.getUser()
            .then((res) => {
               
            })

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
    searchInventoryFiltered() {

        let { tempMake, tempColor, tempModel, tempYear } = this.state;
        if (tempMake && tempColor && tempModel && tempYear) {

            axios.get(`/filteredinventory/${tempMake}/${tempModel}/${tempYear}/${tempColor}`)
                .then(res => {
                   
                    this.setState({

                        localInventory: res.data,
                        filterClicked: true
                    })
                })
        } else {
            alert('You must select all values.')
        }
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
        this.setState({
            tempModel: selectedModel
        })
    }
    setTempColor(selectedColor) {
        this.setState({
            tempColor: selectedColor
        })
       

    }
    setTempYear(selectedYear) {
        this.setState({
            tempYear: selectedYear
        })
    }

    enterInventory() {
        let newCar = this.state;
     
        if (newCar.tempColor && newCar.tempMake && newCar.tempModel && newCar.tempYear) {
            axios.post(`/enterinventory`, newCar)
                .then(res => {
            
                    this.setState({

                        localInventory: res.data
                    })
                })
            axios.post('/send_email', newCar)
                .then(this.searchAllInventory)
        } else {
            alert('You must select all values.')
        }
    }
    searchAllInventory() {

        axios.get('/allinventory')
            .then(res => {
                this.setState({
                    localInventory: res.data,
                    isEditing: false,
                    editingIndex: -1
                })

               
            })

    }
    deleteInventory(id) {


        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                     
                        axios.delete(`/delete_inventory/${id}`)
                            .then(this.searchAllInventory)
                    }
                },
                {
                    label: 'No',
                    onClick: () => null
                }
            ]
        })
    }
    editInventory(vehicleID) {


        var editObj = {
            make: this.state.tempMake,
            model: this.state.tempModel,
            year: this.state.tempYear,
            color: this.state.tempColor,
            id: vehicleID
        }
        if (this.state.tempColor && this.state.tempMake && this.state.tempModel && this.state.tempYear) {
            axios.put(`/edit_inventory`, editObj)
                .then(this.searchAllInventory)

        }
        else {
            alert('You must select all values.')
        }
    }


    displayCorrectModelSchtuff() {
        if (this.props.modelArr.length < 1) {
            return (
                <option >Select Make First</option>
            )
        } else {
            return (this.props.modelArr.map((model, index) => {
                return (<option key={index}>{model.model}</option>)
            }))
        }

    }

    editClick(invID) {
        this.setState({
            editingIndex: invID,
            isEditing: true
        })


   }

    render() {

        var makeSelection = this.props.makeArr.map((make, index) => {
            return (

                <option key={index}>{make.make}</option>
            )
        })
        var colorSelection = this.props.colorArr.map((color, index) => {

            return (

                <option key={index}>{color.color}</option>
            )
        })

        var yearSelection = this.props.yearArr.map((year, index) => {
            return (

                <option key={index}>{year.year}</option>
            )
        })

        var modelSelection = this.displayCorrectModelSchtuff();

        var searchResultHeaders = this.state.localInventory.length ?

            <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Color</th>
                <th>Date Entered</th>
            </tr>
            : this.state.filterClicked ? <div>
                <p className="oops">Oops, it looks like we don't have any of those. <Link to="/dashboard/new_waitlist">Click here</Link> to add to your waitlist.
            </p>
            </div>
                : null;

        var searchResults = this.state.localInventory.map((vehicle, index) => {

            function shortenDate(fullDate) {
                var shortDate = fullDate.substring(0, 10)
                return shortDate;
            }
            return (
                this.state.editingIndex !== index ?
                    <tr key={index}>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.color}</td>
                        <td>{shortenDate(vehicle.date_entered)}</td>
                        <td>
                            <button onClick={(e) => this.deleteInventory(vehicle.id)}>Delete</button>
                            <button onClick={(e) => this.editClick(index)}>Edit</button>
                        </td>
                    </tr>
                    :
                    <tr key={index}>
                        <td><select onChange={(e) => this.getModels(e.target.value)}>
                            <option>Select</option>
                            {makeSelection}
                        </select></td>

                        <td><select onChange={(e) => this.setTempModel(e.target.value)}>
                            {modelSelection}
                        </select></td>


                        <td><select onChange={(e) => this.setTempYear(e.target.value)}>
                            <option>Select</option>
                            {yearSelection}
                        </select></td>


                        <td><select onChange={(e) => this.setTempColor(e.target.value)}>
                            <option>Select</option>
                            {colorSelection}
                        </select></td>

                        <td>Cannot Change Date</td>

                        <td>
                            <button onClick={(e) => this.deleteInventory(vehicle.id)}>Delete</button>
                            <button onClick={(e) => this.editInventory(vehicle.id)}>save</button></td>
                    </tr>
            )
        })
        return (

            <div>
                <TopNav userIsAdmin = {this.props.user.is_admin} userIsPremium = {this.props.user.is_premium}/>



                <div className="search_bar">

                    <div className="new_make">
                        <p>Make:</p>
                        <select onChange={(e) => this.getModels(e.target.value)}>
                            <option>Select</option>
                            {makeSelection}
                        </select>
                    </div>
                    <div className="new_model">
                        <p>Model:</p>
                        <select onChange={(e) => this.setTempModel(e.target.value)}>
                            <option>Select</option>
                            {modelSelection}
                        </select>
                    </div>
                    <div className="new_year">
                        <p>Year:</p>
                        <select onChange={(e) => this.setTempYear(e.target.value)}>
                            <option>Select</option>
                            {yearSelection}
                        </select>
                    </div>
                    <div className="new_color">
                        <p>Color:</p>
                        <select onChange={(e) => this.setTempColor(e.target.value)}>
                            <option>Select</option>
                            {colorSelection}
                        </select>
                    </div>

                    <button onClick={this.searchInventoryFiltered}>Filter</button>


                    <button onClick={this.searchAllInventory}>Clear Filters</button>


                </div>

                <div className='inventory_body_wrapper'>

                    <div className="inv_search_results_wrapper">
                        <table className="inv_search_results">
                            <tbody>
                                {searchResultHeaders}
                            </tbody>
                            <tbody>
                                {searchResults}
                            </tbody>
                        </table>
                    </div>


                    <div className="new_entry_form">
                        <h1 className='new_waitlist_title'>Enter New Vehicle</h1>

                        <div className="new_selects">
                            <div className="newer_make">
                                <p>Make:</p>
                                <select onChange={(e) => this.getModels(e.target.value)}>
                                    <option>Select</option>
                                    {makeSelection}
                                </select>
                            </div>

                            <div className="new_model">
                                <p>Model:</p>
                                <select onChange={(e) => this.setTempModel(e.target.value)}>
                                    <option>Select</option>
                                    {modelSelection}
                                </select>
                            </div>
                            <div className="new_year">
                                <p>Year:</p>
                                <select onChange={(e) => this.setTempYear(e.target.value)}>
                                    <option>Select</option>
                                    {yearSelection}
                                </select>
                            </div>
                            <div className="new_color">
                                <p>Color:</p>
                                <select onChange={(e) => this.setTempColor(e.target.value)}>
                                    <option>Select</option>
                                    {colorSelection}
                                </select>
                            </div>

                            <button onClick={this.enterInventory}>Save Entry</button>
                        </div>
                    </div>

                </div>
            </div >
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
