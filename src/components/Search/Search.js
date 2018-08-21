import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getUser, getColorArr, getMakeArr, getModelArr, getYearArr } from './../../ducks/users';
import { connect } from 'react-redux';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TopNav from '../TopNav/TopNav';
import './Search.css'
import { FormControl } from '../../../node_modules/@material-ui/core';

const ITEM_HEIGHT = 48;

class Search extends Component {
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
    this.searchInventoryFiltered = this.searchInventoryFiltered.bind(this)
    this.searchAllInventory = this.searchAllInventory.bind(this)
    this.getModels = this.getModels.bind(this)
  }
  componentDidMount() {
    axios.get('/allinventory')
      .then(res => {
        this.setState({
          localInventory: res.data
        })
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
  searchAllInventory() {

    axios.get('/allinventory')
      .then(res => {
        this.setState({
          localInventory: res.data,
          filterClicked: false
        })
      })

  }

  render() {

    const rows = this.state.localInventory.map((vehicle, index) => {
      function shortenDate(fullDate) {
        var shortDate = fullDate.substring(0, 10)
        return shortDate;
      }
      return (
        {
          id: index + 1,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          dateEntered: shortenDate(vehicle.date_entered)
        }
      )
    })

    let makeSelection = this.props.makeArr.length ? this.props.makeArr.map((make, index) => {
      return (

        <MenuItem key={index} value={make.make}>{make.make}</MenuItem>
      )
    })
      : null

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

      <div className="Search_master">
        <TopNav userIsAdmin={this.props.user.is_admin} userIsPremium={this.props.user.is_premium} />

        <h1 className="search_header">Search our existing inventory to see if we have what you need!</h1>

        <form className="search_form" autoComplete="off">
          <FormControl>
            <InputLabel htmlFor="make-select">Make</InputLabel>
            <Select
  
              value={this.state.tempMake}
              onChange={(e) => this.getModels(e.target.value)}
              inputProps={{
                name: 'tempMake',
                id: 'make-select',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {makeSelection}
            </Select>
          </FormControl>
          <div className="search_spacer"></div>

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
          <div className="search_spacer"></div>


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
          <div className="search_spacer"></div>


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

        </form>

        <div className="filter_buttons">
          <Button onClick={this.searchInventoryFiltered}>Filter</Button>
          <Button onClick={this.searchAllInventory}>Clear Filters</Button>
        </div>

        <div className="search_paper">
          <Paper >
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Make</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Date Entered</TableCell>
                </TableRow>
              </TableHead>
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
                      <TableCell >{row.dateEntered}</TableCell>
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
  const { user, colorArr, makeArr, modelArr, yearArr } = state
  return {
    user,
    colorArr,
    makeArr,
    modelArr,
    yearArr,
  }
}

export default (connect(mapStateToProps, { getUser, getColorArr, getMakeArr, getModelArr, getYearArr }))(Search)