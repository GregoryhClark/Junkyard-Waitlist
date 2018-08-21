import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TopHamMenu from './TopHamMenu/TopHamMenu.js';
import Logout from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import './TopNav.css'

const { REACT_APP_LOGOUT } = process.env
const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};
function TopNav(props) {
    const { classes } = props;
    let upgradeButton = props.userIsPremium === false? <Button color="inherit" href="/#/upgrade">Upgrade</Button> 
    : null
    let inventoryButton = props.userIsAdmin === true? <Button color="inherit" href="/#/inventory">Inventory</Button>
    : null
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <TopHamMenu userIsAdmin = {props.userIsAdmin} userIsPremium = {props.userIsPremium}/>
      
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Junkyard Waitlist
          </Typography>
                    <div className="TopnavButtons">

                        
                        <Button color="inherit" href="/#/dashboard">Dashboard</Button>
                        <Button color="inherit" href="/#/search">Search</Button>
                        {inventoryButton}
                        {upgradeButton}
                        <Button color="inherit" href="/#/profile">Profile</Button>
                        <Tooltip 
                        title="Logout">
                        <IconButton color="inherit" href={REACT_APP_LOGOUT}><Logout/></IconButton>
                        </Tooltip>

                    </div>

                </Toolbar>
            </AppBar>
        </div>

    )

}
export default withStyles(styles)(TopNav);