import React, { Component } from "react";
import AuthService from '../../services/auth/services';
import Router from 'next/router';
import * as EmailValidator from 'email-validator';
import { Col, Form, Button, Toast} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import NavBar from '../../shared/navbar/navbar';


import style from "./styles.module.css";

interface State {
  email?:string,
  emailSent?:boolean,
  localEmailCheckPassed?:boolean,
  infoMsgVisible?: boolean,
  helpPopoverOpen?:boolean,
  validated?:boolean
}

export default class PasswordForgotten extends Component<{}, State> {

  router : any;

  constructor(props){
    super(props);
    this.state = {
      email:"",
      emailSent:false,
      localEmailCheckPassed:false,
      infoMsgVisible:false,
      helpPopoverOpen:false,
      validated:false,
    };
    this.askForNewTempPass = this.askForNewTempPass.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }


  async askForNewTempPass(event) {
    event.preventDefault();
    this.setState({ emailSent : await new AuthService().askForTempPassword(this.state.email), infoMsgVisible : true });
  }
  
  checkEmail(event) {
    this.setState({ email: event.target.value, localEmailCheckPassed : EmailValidator.validate(event.target.value), validated: EmailValidator.validate(event.target.value) });
  }

  onDismiss() {
    this.setState({ infoMsgVisible: !this.state.infoMsgVisible });
  }

  render() {
    return (
      <div style={{width:"100%", height:"100%", margin:"0"}}>
        <NavBar />
        <div className={style.background}>
          <Toast show={this.state.infoMsgVisible} onClose={this.onDismiss} style={{position:"absolute", marginTop:"80px", right:"20px"}}>
            <Toast.Header className="header">
              <strong className="mr-auto header-title">Informations</strong>
              <small className="header-title" >Oublie de mot de passe</small>
            </Toast.Header>
          <Toast.Body> {this.state.emailSent ? "Nous vous avons envoyé un message, veuillez vérifier votre messagerie" : "L'email renseigné ne correspond à aucun de nos utilisateurs, veuillez essayer un autre email"}</Toast.Body>
            </Toast>
            <div className={style.upperloginformcontainer}>
              <div className={style.loginformcontainer}>
            <Form validated={this.state.emailSent} onSubmit={this.askForNewTempPass} >
              <Form.Row className={style.loginform}>
              <Form.Group style={{fontWeight:"bold", fontSize:"1.2em"}} as={Col} md="12">
                Mot de passe perdu ?
              </Form.Group>
                  <Form.Group as={Col} md="12" controlId="email">
                    <Form.Label> Email </Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="emailInputGroupPrepend">@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required type="email" placeholder="client@bpce.fr" onChange={(event) => this.checkEmail(event)} />
                        <Form.Control.Feedback type="invalid">
                          Veuillez renseigner votre email
                        </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Button type="submit" variant="info" style={{width:"100%"}}>Envoyer un email</Button>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Button className="login-btn" variant="secondary" onClick={ () => Router.push("/") } style={{width:"100%"}} > Se connecter </Button>
                  </Form.Group>
              </Form.Row>
            </Form>
          </div>
         </div>
        </div>
      </div>
    );
  }
};
