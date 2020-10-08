/*Node modules imports*/
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import NavBar from '../../shared/navbar/navbar'
import UserContext from '../../shared/context/User';

/*Components import*/

import History from './components/history';
import CurrentSubscriptions from './components/currentsubscriptions';



interface SubscriptionsProps {
    app : []
}

export default class Subscriptions extends Component<SubscriptionsProps,{}> {
    
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div style={{width:"100%", height:"100%", margin:"0"}}>
            <NavBar/>
            <div style={{marginTop:"10%"}}>
            <Row style={{width:"90%", marginLeft:"5%"}}>
                <Col xs="12" sm="12" md="12" >
                <Typography variant="h5" component="h2" display="block" gutterBottom > Abonnements en cours </Typography>
                </Col>
            </Row>
            <Row style={{width:"100%", marginTop:"4%", overflow: "initial"}}>
                <Col xs="12" sm="12" md="12">
                 <CurrentSubscriptions app={ this.props.app }/> 
                </Col>
            </Row>
            <Row style={{width:"90%", marginTop:"5%", marginLeft:"5%"}}>
                <Col xs="12" sm="12" md="12" >
                <Typography variant="h5" component="h2" display="block" gutterBottom > Abonnements arrivés à expiration </Typography>
                </Col>
            </Row>
            <Row style={{width:"95%", marginLeft:"5%", marginTop:"4%"}}>
                <Col xs="12" sm="12" md="12">
                    <History /> 
                </Col>
            </Row>
            </div>
        </div>
      )
    }
}

