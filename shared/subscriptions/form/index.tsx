
import React, { Component } from 'react';
import * as Cookies from "js-cookie";
import { Col, Form, Modal, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import SubscriptionsService  from '../../../services/subscriptions/services';
import UserContext from '../../../shared/context/User';

const formatDate = (date) => {
  let d = date !== "" ? new Date(date) : new Date();
  return  (d.getDate() < 10 ? "0"+d.getDate(): d.getDate()) +"/"+ (d.getMonth()+ 1 < 10 ? "0" + (d.getMonth() + 1): d.getMonth() + 1) + "/"+d.getFullYear();
}

const formatDateToSend = (date) => {
  let ds = date.split("/");
  return ds[1]+"/"+ds[0]+"/"+ds[2];
}

interface SubscriptionFormProps {
    supportNames?:Array<any>,
    subscriptionService?: any,
    subscriptionForm : any,
    subscriptionTypes : Array<any>,
    subscriptionTypesIds : Array<any>
    supportIds : Array<any>,
    values: any,
    app : any
}

interface SubscriptionFormState {
    disabled?:boolean,
    show?: boolean,
    mssg?: string,
    showMessg?: boolean,
    id?:number,
    supportIds?: Array<any>
}

export default class SubscriptionForm extends Component<SubscriptionFormProps, SubscriptionFormState > {

    static contextType = UserContext;
    subscriptionService : any;
    clientKey : string;

    constructor(props) {
      super(props);
      this.subscriptionService = new SubscriptionsService();
      this.state = {
        supportIds : [],
        disabled:true,
        show:false,
        mssg: "",
        showMessg:false,
        id:0
      }
    }

    componentDidMount = async () => {
      this.clientKey = await this.context.userShouldBeChecked();
    }

    update() {
      this.setState({disabled:!this.state.disabled});
      this.props.subscriptionForm.refresh();
    }

    toggleModal(){
      this.setState({show:!this.state.show});
    }

    async validate() {

      let supportEl           = (document.getElementById("formGridSubSupport-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") ) as HTMLInputElement ).getElementsByClassName("rbt-input-main form-control rbt-input")[0] as HTMLInputElement,
          subscriptionTypeEl  = document.getElementById("formGridSubType-" + (this.props.values !== undefined ? this.props.values.id.toString() : "")) as HTMLInputElement,
          beginDateEl         = document.getElementById("formGridSubBeginDate-" + (this.props.values !== undefined ? this.props.values.id.toString() : "")) as HTMLInputElement,
          endDateEl           = document.getElementById("formGridSubEndDate-" + (this.props.values !== undefined ? this.props.values.id.toString() : "")) as HTMLInputElement,
          quantiteEl          = document.getElementById("formGridSubQuantity-"+ (this.props.values !== undefined ? this.props.values.id.toString() : "")) as HTMLInputElement,
          budgetEl            = document.getElementById("formGridSubBudget-" + (this.props.values !== undefined ? this.props.values.id.toString() : "")) as HTMLInputElement,
          supportVal          = supportEl.value,
          subscriptionTypeVal = subscriptionTypeEl.value,
          beginDateVal        = beginDateEl.value,
          endDateVal          = endDateEl.value,
          quantiteVal         = quantiteEl.value,
          budgetVal           = budgetEl.value;


          let params = {
            id:this.props.values !== undefined ? this.props.values.id.toString() : "",
            supportId: supportVal === "" ? this.props.supportIds[this.props.values.Site] : this.props.supportIds[supportVal],
            subscriptionType:this.props.subscriptionTypesIds[subscriptionTypeVal],
            beginDate:formatDateToSend(beginDateVal),
            endDate:formatDateToSend(endDateVal),
            quantite:quantiteVal,
            budget:budgetVal
          };

          console.log(params);
      
      await this.subscriptionService.validate(this.clientKey,params);
      this.setState({disabled:!this.state.disabled});
      this.props.subscriptionForm.refresh();
    }

    async delete() {
      await this.subscriptionService.deleteSub(this.clientKey,this.props.values !== undefined ? this.props.values.id.toString() : "");
      this.props.subscriptionForm.refresh();
    }

    render() {

      //console.log("formGridSubBeginDate-" + (this.props.values !== undefined ? this.props.values.id.toString() : ""));
      
      return(
        <Form>
          <Form.Row style={{overflow:"initial"}} className="row-style">   
          <Form.Group as={Col} md="2"  >
            <div id={"formGridSubSupport-" + (this.props.values !== undefined ? this.props.values !== undefined ? this.props.values.id.toString() : "" : "") }>
              <Typeahead id={"typeahead-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") } placeholder={this.props.values.Site}  value={ this.props.values.Site } disabled={this.state.disabled} options={this.props.supportNames !== null ? this.props.supportNames : [] } />
            </div>
          </Form.Group>
          <Form.Group as={Col} md="2" controlId={ "formGridSubType-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") } >
            <Form.Control as="select" disabled={ this.state.disabled } defaultValue={ this.props.values.Abonnement } custom>
              {
                this.props.subscriptionTypes.map((subType) =>
                  <option  key ={ subType.id.toString() + " " + subType.Illimite.toString()} >{ subType.Abonnement }</option>
                )
              }
            </Form.Control>
          </Form.Group>
            <Form.Group as={Col} md="2" controlId={"formGridSubBeginDate-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") }  >
              <Form.Control defaultValue={ formatDate(this.props.values.Debut) } disabled={this.state.disabled} />
            </Form.Group>
              <Form.Group as={Col} md="2" controlId={"formGridSubEndDate-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") }  >
            <Form.Control defaultValue={ formatDate(this.props.values.Fin) } disabled={this.state.disabled} />
            </Form.Group>
              <Form.Group as={Col} md="1" controlId={"formGridSubQuantity-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") }  >
            <Form.Control defaultValue={ this.props.values.Quantite === -1 ? "n/a" : this.props.values.Quantite } disabled={this.state.disabled} />
            </Form.Group>
            <Form.Group as={Col} md="1" controlId={"formGridSubBudget-" + (this.props.values !== undefined ? this.props.values.id.toString() : "") }  >
              <Form.Control defaultValue={ this.props.values.Montant } disabled={this.state.disabled} />
            </Form.Group>
            <Form.Group as={Col} md="1"> 
              <Form.Control type="button" onClick={ (event) => { this.update();}} className="btn-outline-info"  value={ this.state.disabled ? "modifier" : "Annuler"} />
            </Form.Group>
            <Form.Group as={Col} md="1" > 
              <Form.Control type="button" onClick={ (event) => { this.state.disabled ? this.toggleModal() : this.validate(); }} className={this.state.disabled ? "btn-outline-danger" : "btn-outline-success"}  value={ this.state.disabled ? "suppr" : "valider"} />
            </Form.Group>
          </Form.Row>
            <Modal show={this.state.show} onHide={() => this.toggleModal()} className="delete-modal" >
              <Modal.Header closeButton>
                <Modal.Title> Supression d'un abonnement </Modal.Title>
              </Modal.Header>
              <Modal.Body> 
                { "Voulez vous supprimer l'abonnement " + this.props.values.Abonnement + " sur le support "+ this.props.values.Site +" d'un montant de " + this.props.values.Montant + " euros  ?  "} 
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={(event) =>  { this.delete(); this.toggleModal(); }}>
                  Oui
                </Button>
                <Button variant="danger" onClick={() =>  this.toggleModal()} >
                  Non
                </Button>
              </Modal.Footer>
            </Modal>
        </Form>
      );
    }
}

