import React, { Component } from "react";
import { Col, Form, Button, Toast, ProgressBar} from 'react-bootstrap';
import AuthService from '../../services/auth/services';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Icon from '@mdi/react';
import PasswordValidator from 'password-validator';
import { mdiLock } from '@mdi/js';
import * as Cookies from "js-cookie";
import NavBar from '../../shared/navbar/navbar';
import UserContext from '../../shared/context/User';
import Router from 'next/router';

import style from "./styles.module.css";

interface ChangePasswordProps {
  router?: any
}
  
interface ChangePasswordState {
  newPassword?:string,
  count?:number,
  newPasswordChecked?:string,
  passwordChanged?:boolean,
  helpPopoverOpen?:boolean,
  infoMsgVisible?:boolean,
  validated?:boolean,
}

export default class ChangePassword extends Component<ChangePasswordProps,ChangePasswordState> {

  static contextType = UserContext;

  passwordSchema :any;
  timerId : any;
  clientKey : string;

  constructor(props){
    super(props);
    this.timerId = null;
    this.clientKey = "";
    this.passwordSchema = new PasswordValidator().is().min(8).has().has().uppercase().has().lowercase().has().digits().has().symbols();
    
    this.state = {

      newPassword:"",
      count:0,
      newPasswordChecked:"",
      passwordChanged:false,
      helpPopoverOpen:false,
      infoMsgVisible:false,
      validated:false

    };

    this.askForNewPass = this.askForNewPass.bind(this);
    this.checkNewPassword = this.checkNewPassword.bind(this);
  }

  componentDidMount = async () => {
    this.clientKey = await this.context.userShouldBeChecked();
  }

  async askForNewPass(event) {
    event.preventDefault();
    let authService = new AuthService();
    this.setState({ passwordChanged : await authService.changeClientPassword(this.clientKey,this.state.newPassword) });
    if(this.state.passwordChanged) {
      this.setState({infoMsgVisible:true});
      this.startTimer();
    }
  }

  count = () => {
    if( this.state.count !== 10) {
      this.setState({ count: this.state.count + 1 });
    } else {
      this.stopTimer();
      Cookies.remove('ddclientreact');
      Router.push("/");
    }
  }

  startTimer(){
    if(this.timerId === null){     
      this.timerId = setInterval(() => this.count(), 500);
    }
  }
  
  stopTimer(){
    clearInterval(this.timerId);
  }

  checkNewPassword(event) {
    let passwordChecked = this.passwordSchema.validate(event.target.value);
    this.setState({ newPassword: event.target.value, newPasswordChecked : passwordChecked, validated: passwordChecked });
  }

  onDismiss() {
    this.setState({ infoMsgVisible: !this.state.infoMsgVisible });
  }

  render() {
  
    return (
    <div style={{width:"100%", height:"100%", margin:"0"}}>
       <NavBar />
      <div className={style.background} >
      <Toast className="toast-info" show={this.state.infoMsgVisible} onClose={this.onDismiss} style={{position:"absolute", marginTop:"80px", right:"20px"}}>
        <Toast.Header className="header">
          <strong className="mr-auto header-title">Informations</strong>
          <small className="header-title" >Changer de mot de passe</small>
        </Toast.Header>
        <Toast.Body>
          Le mot de passe est changé, vous allez être redirigé vers l'espace de connexion <br/><br/>
          <ProgressBar now={ this.state.count * 10 } style={{ height:"3px"}}/>
        </Toast.Body>
      </Toast>
      <div className={style.upperloginformcontainer}>
          <div className={style.loginformcontainer}>
       <Form validated={this.state.validated} onSubmit={this.askForNewPass}>
          <Form.Row className={style.loginform}>
            <Form.Group style={{fontWeight:"bold", fontSize:"1.2em"}} as={Col} md="12">
              Mot de passe perdu ?
            </Form.Group>
              <Form.Group as={Col} md="12" controlId="new-password">
                <Form.Label> Nouveau mot de passe </Form.Label>
                <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="newPasswordInputGroupPrepend">
                      <Icon path={ mdiLock }
                        title="Nouveau mot de passe"
                        size={0.60}
                        horizontal
                        vertical
                        rotate={180}
                        color="black"
                        />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  <Form.Control required type="password" onChange={ (event) => this.checkNewPassword(event) } maxLength={32} autoComplete="new-password" />
                  <Form.Control.Feedback type="invalid">
                    Veuillez renseigner un nouveau mot de passe
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group><br/>
              <Form.Group as={Col} md="12">
                <Button type="submit" className={style.changepassbtn} variant="info"> Changer </Button>
              </Form.Group>
              { 
                !this.state.newPasswordChecked && this.state.newPassword !== "" ?
                <Alert variant='danger' style={{textAlign:"left"}}>
                  Le nouveau mot de passe ne répond pas aux critères requis, il doit contenir des:
                  <ul>
                    <li>
                      Majuscules
                    </li>
                    <li>
                      Minuscules
                    </li>
                    <li>
                      Chiffres
                    </li>
                    <li>
                      Caractères spéciaux
                    </li>
                  </ul> 
                </Alert> : null 
              }
          </Form.Row>
      </Form>  
    </div>
    </div>
    </div>
    </div>
    );
  }
};

