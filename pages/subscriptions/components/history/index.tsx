/*Node modules imports*/

import React, { Component } from 'react';
import UserContext from '../../../../shared/context/User';
import { Col, Form, Row, Button, Modal } from 'react-bootstrap';
import Subscriptions  from '../../../../services/subscriptions/services';
import * as Cookies from "js-cookie";

const formatDate = (date) => {
    let d = date !== "" ? new Date(date) : new Date();
    return  (d.getDate() < 10 ? "0"+d.getDate(): d.getDate()) +"/"+ (d.getMonth()+ 1 < 10 ? "0" + (d.getMonth() + 1): d.getMonth() + 1) + "/"+d.getFullYear();
}

const formatDateToSend = (date) => {
  let ds = date.split("/");
  return ds[1]+"/"+ds[0]+"/"+ds[2];
}


interface HistoryState {
  oldSubscriptions?: Array<any>,
  subscriptionTypes?: Array<any>,
  subscriptionTypesIds:Array<any>,
  supportNames?: Array<any>,
  supportIds?:Array<any>,
  validationMessage?:string,
  deleteMessage?:string,
  clickOnBtn?:number,
  show?:boolean
}

export default class History extends Component<{},HistoryState> {

    static contextType = UserContext;
    subscriptionService : any;
    clientKey: string;

    constructor(props) {
      super(props);
      this.clientKey = "";
      this.state = {
        oldSubscriptions:[],
        subscriptionTypes:[],
        subscriptionTypesIds:[],
        supportNames: [],
        supportIds: [],
        validationMessage:"",
        deleteMessage:"",
        show:false,
        clickOnBtn:0
      }
      this.subscriptionService = new Subscriptions();
    }

    async componentDidMount() {

      let retrieveClientKey = await this.context.userShouldBeChecked();
      this.clientKey = retrieveClientKey ? retrieveClientKey : ( Cookies.get('ddclientreact') !== undefined ? Cookies.get('ddclientreact') : "");

      let today = new Date(), oldSubscriptions = [], subscriptions = await this.subscriptionService.retrieveSubscriptions(this.clientKey);
      if(subscriptions !== null ){
        subscriptions.forEach(subs => {
          let endDate = new Date(subs.Fin);
          if(today.getTime() > endDate.getTime()){
            oldSubscriptions.push(subs);
          }
        });
      }
      this.setState({ oldSubscriptions: oldSubscriptions });
      
    }

    async validate(id, site) {

      let supportEl           = (document.getElementById("formGridSubSupport-" + id) as HTMLInputElement).getElementsByClassName("rbt-input-main form-control rbt-input")[0] as HTMLInputElement,
          subscriptionTypeEl  = document.getElementById("formGridSubType-" + id) as HTMLInputElement,
          beginDateEl         = document.getElementById("formGridSubBeginDate-" + id) as HTMLInputElement,
          endDateEl           = document.getElementById("formGridSubEndDate-" + id) as HTMLInputElement,
          quantiteEl          = document.getElementById("formGridSubQuantity-"+ id) as HTMLInputElement,
          budgetEl            = document.getElementById("formGridSubBudget-" + id) as HTMLInputElement,
          supportVal          = supportEl.value,
          subscriptionTypeVal = subscriptionTypeEl.value,
          beginDateVal        = beginDateEl.value,
          endDateVal          = endDateEl.value,
          quantiteVal         = quantiteEl.value,
          budgetVal           = budgetEl.value,
          params = {
            id:id,
            supportId: supportVal === "" ? this.state.supportIds[site] : this.state.supportIds[supportVal],
            subscriptionType:this.state.subscriptionTypesIds[subscriptionTypeVal],
            beginDate:formatDateToSend(beginDateVal),
            endDate:formatDateToSend(endDateVal),
            quantite:quantiteVal,
            budget:budgetVal
          };
        this.setState({ validationMessage : (await this.subscriptionService.validate(this.clientKey,params)) });
    }

    refresh(){
      this.componentDidMount();
    }

    toggleModal(){
        this.setState({show:!this.state.show});
    }

    async delete(id) {
        await this.subscriptionService.deleteSub(this.clientKey,id);
        this.componentDidMount();
    }

    async addSubscription() {

      let supportEl           = (document.getElementById("formGridSubSupport") as HTMLInputElement).getElementsByClassName("rbt-input-main form-control rbt-input")[0] as HTMLInputElement,
          subscriptionTypeEl  = document.getElementById("formGridSubType") as HTMLInputElement,
          beginDateEl         = document.getElementById("formGridSubBeginDate") as HTMLInputElement,
          endDateEl           = document.getElementById("formGridSubEndDate") as HTMLInputElement,
          quantiteEl          = document.getElementById("formGridSubQuantity") as HTMLInputElement,
          budgetEl            = document.getElementById("formGridSubBudget") as HTMLInputElement,
          supportVal          = supportEl.value,
          subscriptionTypeVal = subscriptionTypeEl.value,
          beginDateVal        = beginDateEl.value,
          endDateVal          = endDateEl.value,
          quantiteVal         = quantiteEl.value,
          budgetVal           = budgetEl.value,
          values = {
            supportId:supportVal === "" ?  0 : this.state.supportIds[supportVal],
            subscriptionType: this.state.subscriptionTypesIds[subscriptionTypeVal],
            beginDate:beginDateVal,
            endDate:endDateVal,
            quantite:quantiteVal,
            budget:budgetVal
          };
      this.setState({ validationMessage : (await this.subscriptionService.addSub(this.clientKey,values)) });
    }

    async deleteSub(id) {
      this.setState({ deleteMessage : (await this.subscriptionService.deleteSub(this.clientKey,id)) });
    }

    render() {
      let i = -1;
      return(
        <div style={{width:"90%", textAlign:"center"}}>
          <Row>
            <Col md={2}>
              Site
            </Col>
            <Col md={2}>
              Souscription
            </Col>
            <Col md={2}>
              Début
            </Col>
            <Col md={2}>
              Fin
            </Col>
            <Col md={1}>
              Quantité
            </Col>
            <Col md={1}>
              Montant
            </Col>
            <Col md={1}>
              
            </Col>
            <Col md={1}>

            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              { this.state.oldSubscriptions.length !== 0 ? this.state.oldSubscriptions.map((subscription) => { i++; return (
                  <div>
                    <Form.Row style={{overflow:"initial"}} className="row-style">   
                        <Col md="2">
                            { subscription.Site }
                        </Col>
                        <Col md="2">
                            { subscription.Abonnement }
                        </Col> 
                        <Col md="2">
                            { formatDate(subscription.Debut) }
                        </Col>
                        <Col md="2">
                            { formatDate(subscription.Fin) }
                        </Col>
                        <Col md="1">
                            { subscription.Quantite }
                        </Col>
                        <Col md="1">
                            { subscription.Montant } 
                        </Col>
                        <Form.Group as={Col} md="2" > 
                            <Form.Control type="button" onClick={ (event) => { this.toggleModal() }} className={"btn-outline-danger"}  value={"suppr"} />
                        </Form.Group>
                        
                    </Form.Row>

                    <Modal show={this.state.show} onHide={() => this.toggleModal()} className="delete-modal" >
                        <Modal.Header closeButton>
                            <Modal.Title> Supression d'un abonnement expiré </Modal.Title>
                        </Modal.Header>
                        <Modal.Body> 
                            { "Voulez vous supprimer l'abonnement expiré " + subscription.Abonnement + " sur le support "+ subscription.Site +" d'un montant de " + subscription.Montant + " euros ?"} 
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="success" onClick={(event) =>  { this.delete(subscription.id); this.toggleModal(); }}>
                            Oui
                        </Button>
                        <Button variant="danger" onClick={() =>  this.toggleModal()} >
                            Non
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
              )}) : "Aucune données" }
            </Col>
        </Row>
        </div>
      );
    }
}
