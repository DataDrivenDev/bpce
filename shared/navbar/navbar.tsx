import React, { Component } from 'react';
import Router from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import UserContext from '../../shared/context/User';
import AuthService from '../../services/auth/services';
import * as Cookies from "js-cookie";


/*Css import */
import style from './navbar.module.css';

/*Logo import*/
import whiteDdPicto from '../../assets/img/logo/Logo-460x192w-fullsh.png';

class NavBar extends React.PureComponent {

  static contextType = UserContext;
  clientKey : string;

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.clientKey = this.context.clientKey ? this.context.clientKey : Cookies.get('ddclientreact');
  }

  async goToPath( event, path = "/", authHelp ){
    if( this.clientKey || authHelp ){
      if(await new AuthService().checkClientKey(this.clientKey)){
        Router.push(path);	
      }else{
        Router.push("/");		
      }
    }
  }

  render() {

    let name = this.context.clientName ? this.context.clientName : ( Cookies.get('ddclientname') !== undefined ? Cookies.get('ddclientname') : "" ),
        surName = this.context.clientSurname ? this.context.clientSurname : ( Cookies.get('ddclientsurname') !== undefined ? Cookies.get('ddclientsurname') :  ""),
        corporateName = this.context.raisonSocial ? this.context.raisonSocial : (Cookies.get('ddclientcoporatename') !== undefined ? Cookies.get('ddclientcoporatename') : "");

    const popover = (
      <Popover id="popover-basic">
         { name !== "" ? <Popover.Title as="h3" style={{textAlign:"center"}}>{ name + " " + surName }</Popover.Title> : null }
        <Popover.Content>
          { this.clientKey ? <Nav.Link  onClick={async (event) => this.goToPath(event,"/changepassword", true) }  style={{cursor:"pointer", color:"black"}}> Changer de mot de passe </Nav.Link> : null }
          <Nav.Link  onClick={async (event) => this.context.signOut("/passwordforgotten")}  style={{cursor:"pointer", color:"black"}} > Mot de passe oublié ? </Nav.Link>
          <Nav.Link  onClick={this.clientKey ? (event) => this.context.signOut("/") : async (event) => this.goToPath(event,"/",true)}  style={{cursor:"pointer", color:"black"}}> { this.clientKey ? "Déconnexion" : "Connexion" } </Nav.Link>
        </Popover.Content>
      </Popover>
    );
    return (
      <Navbar collapseOnSelect expand="lg" fixed="top"  variant="dark" className={style.navbar}>
        <Navbar.Brand><img src={whiteDdPicto} width="75px" height="35px" style={{cursor:"pointer"}} alt="data-driven-logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" >
            <Nav.Link onClick={async (event) => { this.goToPath(event,"/statistics",false) }} style={{cursor:"pointer", color:"white"}}> Statistiques</Nav.Link>
            <Nav.Link onClick={async (event) => { this.goToPath(event,"/subscriptions",false) }} style={{cursor:"pointer",  color:"white"}} >Abonnements</Nav.Link>
          </Nav>
          <Nav style={{display:"inline"}}>
            <OverlayTrigger trigger="click" placement="bottom" overlay={ popover }> 
              <AccountCircleIcon style={{color:"white", cursor:"pointer"}}/>
            </OverlayTrigger>
          </Nav>
          <Nav className={style.clientcorporatename}>
            <div> { corporateName.toString() } </div>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
    );
  }
}

/*const NavBarWithRouter = withRouter(NavBar);*/
export default NavBar;