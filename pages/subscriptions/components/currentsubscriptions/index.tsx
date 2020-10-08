/*Node modules imports*/

import React, { Component } from 'react';
import { Col, Row, Form, Toast} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import SupportList  from '../../../../services/supports/services';
import Subscriptions  from '../../../../services/subscriptions/services';
import SubscriptionForm from '../../../../shared/subscriptions/form';
import UserContext from '../../../../shared/context/User';
import * as Cookies from "js-cookie";

const formatDateToSend = (date) => {
  let ds = date.split("/");
  return ds[1]+"/"+ds[0]+"/"+ds[2];
}


interface CurrentSubscriptionsProps {
  app:any
}

interface CurrentSubscriptionsState {
    currentSubscriptions?: Array<any>,
    subscriptionTypes?: Array<any>,
    subscriptionTypesIds:Array<any>,
    supportNames?: Array<any>,
    supportIds?:Array<any>,
    validationMessage?:string,
    deleteMessage?:string,
    clickOnBtn?:number,
    mssg?:string
    openMsgPopup?:boolean
}

export default class CurrentSubscriptions extends Component< CurrentSubscriptionsProps , CurrentSubscriptionsState> {
    
    static contextType = UserContext;

    subscriptionService : any;
    clientKey:string;

    constructor(props) {
      super(props);
      this.clientKey = null;
      this.state = {
        currentSubscriptions : [],
        subscriptionTypes: [],
        subscriptionTypesIds:[],
        supportNames : [],
        supportIds : [],
        mssg:"",
        deleteMessage:"",
        clickOnBtn:0,
        openMsgPopup : false
      }
      this.subscriptionService = new Subscriptions();
    }

    async componentDidMount() {

      let retrieveClientKey = await this.context.userShouldBeChecked();

      this.clientKey = retrieveClientKey ? retrieveClientKey : ( Cookies.get('ddclientreact') !== undefined ? Cookies.get('ddclientreact') : "");

      const supportListService = new SupportList(),
          today = new Date(), currentSubscriptions = [],
          subscriptions = await this.subscriptionService.retrieveSubscriptions(this.clientKey),
          supportList = await supportListService.retrieve(this.clientKey),
          subscriptionTypes = await this.subscriptionService.getSubscriptionTypes(this.clientKey),
          supportNames = [];
          let i = 0,
          supportIds = supportList !== null ? supportList.reduce( (acc, obj) => {
            let cle = obj["Site"];
                if(!acc[cle]) {
                  acc[cle] = obj["id"];
                }
              return acc;
          }, {}) : {},
          subscriptionTypeIds = subscriptionTypes !== null ? subscriptionTypes.reduce( (acc, obj) => {
            let cle = obj["Abonnement"];
                if(!acc[cle]) {
                  acc[cle] = obj["id"];
                }
              return acc;
          }, {}) : {};

      if(supportList !== null) {
        for( i = 0; i < supportList.length; i++ ){
          supportNames.push(supportList[i].Site);
        }
      }

      if( subscriptions !== null ){
        subscriptions.forEach(subs => {
          let endDate = new Date(subs.Fin);
          if(today.getTime() < endDate.getTime()){
            currentSubscriptions.push(subs);
          }
        });
      }

    this.setState({ subscriptionTypes:subscriptionTypes, subscriptionTypesIds: subscriptionTypeIds , currentSubscriptions: currentSubscriptions,supportNames:supportNames, supportIds: supportIds });
    }

    closePopupMsg = () => {
      this.setState({ openMsgPopup : false });
    }

    async validate(id, site) {

      let supportEl           = (document.getElementById("formGridSubSupport-" + id) as HTMLInputElement).getElementsByClassName("rbt-input-main form-control rbt-input")[0] as HTMLInputElement,
          subscriptionTypeEl  = document.getElementById("formGridSubType-" + id) as HTMLInputElement,
          beginDateEl         = document.getElementById("formGridSubBeginDate-" + id) as HTMLInputElement,
          endDateEl           = document.getElementById("formGridSubEndDate-" + id) as HTMLInputElement,
          quantiteEl          = document.getElementById("formGridSubQuantity-"+ id) as HTMLInputElement,
          budgetEl            = document.getElementById("formGridSubBudget-" + id)as HTMLInputElement ,
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
        this.setState({ mssg : (await this.subscriptionService.validate(this.clientKey,params)), openMsgPopup : true });
    }

    refresh = async () => {
      await this.componentDidMount();
    }

    async addSubscription() {

      let supportEl           = (document.getElementById("formGridSubSupport")as HTMLInputElement).getElementsByClassName("rbt-input-main form-control rbt-input")[0] as HTMLInputElement,
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
          },hasToBeSent = true;

      this.state.currentSubscriptions.some(sub => {
        if( sub.Site === supportVal ){
          hasToBeSent = false;
          return;
        }
      });

      this.setState({ mssg : ( hasToBeSent ? (await this.subscriptionService.addSub(this.clientKey,values)) : "Un seul abonnement sur le site: " + supportVal + " est permis"), openMsgPopup : true  }, () => {
        console.log(supportEl);
        supportEl.value = "";
        subscriptionTypeEl.value = "";
        beginDateEl.value = "";
        endDateEl.value = "";
        quantiteEl.value = "";
        budgetEl.value = "";
      });
      
    }

    async deleteSub(id) {
      this.setState({ deleteMessage : (await this.subscriptionService.deleteSub(this.clientKey,id)) });
    }

    render() {
      let i = -1;
      return(
      <div>
        <Toast  show={this.state.openMsgPopup} onClose={this.closePopupMsg} style={{position:"fixed", zIndex:1, marginTop:"-150px", right:"20px"}}>
          <Toast.Header className="header">
            <strong className="mr-auto header-title">Informations</strong>
            <small className="header-title" >abonnement</small>
          </Toast.Header>
          <Toast.Body>
            { this.state.mssg }
          </Toast.Body>
        </Toast>
        <div style={{width:"90%", marginLeft:"5%", textAlign:"center"}}>
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
          <Row style={{overflow:"initial"}}>
            <Col md={12}>
              { this.state.currentSubscriptions.length !== 0 ? this.state.currentSubscriptions.map((subscription) => { i++; return (
                <SubscriptionForm key={i} 
                         values={ subscription } 
                         app={this.props.app}
                         supportNames = { this.state.supportNames } 
                         subscriptionTypes={ this.state.subscriptionTypes } 
                         subscriptionTypesIds={this.state.subscriptionTypesIds} 
                         supportIds={this.state.supportIds}
                         subscriptionForm={this}
                /> 

              )}) : "Aucune données" }
            </Col>
          </Row>
          <Form className="row-style"> 
            <Form.Row style={{overflow:"initial"}} >   
              <Form.Group as={Col} md="2"  >
                <div id="formGridSubSupport">
                  <Typeahead id="typeahead-support" placeholder="site" options={this.state.supportNames !== null ? this.state.supportNames : []} />
                </div>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId={ "formGridSubType"} >
              <Form.Control as="select" custom>
                {
                  this.state.subscriptionTypes !== null ? this.state.subscriptionTypes.map((subType) => <option key ={ subType.id.toString() + " " + subType.Illimite.toString() } >{ subType.Abonnement }</option>) : null
                }
                </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="2" controlId={"formGridSubBeginDate" }  >
                  <Form.Control type="date" />
                </Form.Group>
                  <Form.Group as={Col} md="2" controlId={"formGridSubEndDate" }  >
                <Form.Control type="date" />
                </Form.Group>
                  <Form.Group as={Col} md="1" controlId={"formGridSubQuantity" } >
                <Form.Control type="number" />
                </Form.Group>
                <Form.Group as={Col} md="1" controlId={"formGridSubBudget" }  >
                  <Form.Control type="number" />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId={"allowUpdateBtn" } style={{textAlign:"center"}}> 
                  <Form.Control type="button" onClick={ (event) => { this.addSubscription(); this.refresh(); }} className="btn-outline-success" value="Ajouter"/>
                </Form.Group>
              </Form.Row>
          </Form>
        </div>
      </div>
      );
    }
}

