import React from 'react';
import Router from 'next/router';
import UserContext from '../../shared/context/User';
import { Col, Form, Button } from 'react-bootstrap';
import * as EmailValidator from 'email-validator';
import InputGroup from 'react-bootstrap/InputGroup';
import NavBar from '../../shared/navbar/navbar';
import Alert from 'react-bootstrap/Alert';
import Icon from '@mdi/react';
import AuthService from '../../services/auth/services';
import { mdiLock } from '@mdi/js';


import style from "./styles.module.css";


interface LoginState {
  email?: string,
  emailChecked?: boolean,
  password?: string,
  passwordChecked?:boolean,
  showAlert?: boolean,
  logged?: boolean,
  validated?:boolean
}

export default class Login extends React.Component<{},LoginState> {

  static contextType = UserContext;
  
  constructor(props){
    super(props);
    this.state = {
      email:"",
      emailChecked: false ,
      password: "",
      passwordChecked:false,
      showAlert: false,
      logged: false ,
      validated: false
    }
  }
  
  checkEmail = async (event) => {
    this.setState({emailChecked: EmailValidator.validate(event.target.value), email : event.target.value});
  }

  checkPassword = async (event) => {
   // let passwordSchema = new PasswordValidator().is().min(8).is().max(32).has().has().uppercase().has().lowercase().has().digits().has().symbols();
    this.setState({ passwordChecked:true , password : event.target.value});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let auth = await new AuthService().authentificate(this.state.email,this.state.password);
    if(auth) {
      let info = {
        clientKey : auth.clientKey,
        clientName : auth.clientName,
        clientSurname : auth.clientSurname,
        raisonSocial : auth.raisonSocial,
        options : auth.options
      };
      this.context.signIn(info);
      this.setState({ logged: true});
    } else {
      this.setState({ showAlert: true, validated: false});
    }
  }

  render = () => {
    return (
      <div className={style.background}>
        <NavBar />
          <div className={style.upperloginformcontainer}>
            <div className={style.loginformcontainer}>
          <Form validated={ this.state.validated && this.state.logged } onSubmit={this.handleSubmit}>
            <Form.Row className={style.loginform}>
                <Form.Group style={{fontWeight:"bold", fontSize:"1.2em"}} as={Col} md="12">
                   Connexion 
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="email">
                  <Form.Label> Email </Form.Label>
                  <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control required type="email" placeholder="clients@bpce.fr" onChange={this.checkEmail} />
                      <Form.Control.Feedback type="invalid">
                        Veuillez renseigner votre email
                      </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="password">
                  <Form.Label> Mot de passe </Form.Label>
                  <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                        <Icon path={ mdiLock }
                          title="Déconnexion"
                          size={0.60}
                          horizontal
                          vertical
                          rotate={180}
                          color="black"
                          />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                  <Form.Control required type="password" onChange={this.checkPassword } />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Button type="submit" className={style.loginbtn} variant="info"> Se connecter </Button>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Button className={style.loginbtn} variant="secondary" onClick={ () => { Router.push("/passwordforgotten") }}> Mot de passe oublié </Button>
                </Form.Group>
                { 
                  this.state.showAlert && !this.state.logged && this.state.email !== "" && this.state.password !== "" ? 
                  <Alert variant='danger' style={{textAlign:"justify"}}>
                    Identifiants inconnus, Veuillez modifier l'email ou le mot de passe
                  </Alert> : null 
                }
                { 
                  this.state.showAlert && this.state.emailChecked && this.state.passwordChecked ? 
                  <Alert variant='success' style={{textAlign:"justify"}}>
                    Les identifiants respectent les conditions de longueur et de forme, vous pouvez essayez de vous connecter
                  </Alert> : null 
                }
              </Form.Row>
            </Form> 
          </div>
        </div>
      </div>
    )
  }
}