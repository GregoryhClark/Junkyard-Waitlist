import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import '../TopNav.css';
import './TopHamMenu.css';

const { REACT_APP_LOGOUT } = process.env

class TopHamMenu extends React.Component {
    state = {
        anchorEl: null,
        visible: false
    };

    handleClick = event => {
        this.setState({ 
            anchorEl: event.currentTarget,
            visible: true
         });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };


    render() {
        const { anchorEl } = this.state;
        // console.log(anchorEl)
        let upgradeButton = this.props.userIsPremium === false? <Button color="inherit" className="hamItem" href="/#/upgrade">Upgrade</Button> 
        : null
        let inventoryButton = this.props.userIsAdmin === true? <Button color="inherit" className="hamItem" href="/#/inventory">Inventory</Button>
        : null
        return (
            <div className="TopHamMenuMaster">
                <Button

                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MenuIcon />
                    
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >

                        <Button color="inherit" onClick={this.handleClose} href="/#/dashboard" className="hamItem">Dashboard</Button>
                        <Button color="inherit" onClick={this.handleClose} href="/#/search" className="hamItem">Search</Button>
                        {inventoryButton}
                        {upgradeButton}
                        <Button color="inherit" onClick={this.handleClose} href="/#/profile" className="hamItem">Profile</Button>
                        <Button color="inherit" onClick={this.handleClose} href={REACT_APP_LOGOUT} className="hamItem">Logout</Button>
               
                </Menu>
            </div>
        );
    }
}

export default TopHamMenu;