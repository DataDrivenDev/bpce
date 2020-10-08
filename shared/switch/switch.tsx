import React,{ Component } from 'react';
import { Row, Col, Form, Collapse} from 'react-bootstrap';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import style from "./style.module.css";

interface SwitchesProps {
    options: Array<any>,
    departements: Array<any>,
    depAndReg : Array<any>,
    appRef : any,
    checked : boolean,
    for : string,
    value : string,
    region : string
}

export default class Switches extends Component<SwitchesProps> {


  constructor(props){
    super(props);
    this.state = {
      expanded : false
    }
    this.togglePanel = this.togglePanel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDepChange = this.handleDepChange.bind(this);
  }

  componentDidMount(){
    let i = 0, nbofRegChecked = 0;
    if(this.props.for === "location") {
      for(i = 0; i < this.props.appRef.state.regions.length; i++) {
        if(this.props.appRef.state.regions[i][1]){
          nbofRegChecked++;
        }
      }
      if(nbofRegChecked === 0){
        this.props.appRef.setState({ allLocation: false });
      }
    }
  }

  handleChange = event => {

    let i = 0,j = 0, d = 0, arr = this.props.options, deps = this.props.departements, glarr = this.props.depAndReg, nbofRegChecked = 0;

    for(i = 0; i < arr.length; i++){
      if(arr[i][0] !== undefined && arr[i][0] === this.props.value[0]){
        arr[i][1] = event.target.checked;
        break;
      }
    }

    /** Basic filters */
    
    switch(this.props.for){
      case "location" :
        this.props.appRef.setState({ regions: arr });

        for(i = 0; i < this.props.appRef.state.regions.length; i++) {
          if(this.props.appRef.state.regions[i][1]){
            nbofRegChecked++;
          }
        }
        if(nbofRegChecked === 0){
          this.props.appRef.setState({ allLocation: false });
        }
        if(nbofRegChecked === this.props.appRef.state.regions.length){
          this.props.appRef.setState({ allLocation: true });
        }

      /**
      * Setting the value for the checkboxes according the current checked region
      */
      if(this.props.checked){
        for(j = 0; j < glarr.length; j++){
          if(glarr[j].region === this.props.value[0]){
              for(i = 0; i < glarr[j].departements.length; i++){
                for(d = 0; d < deps.length; d++){
                  if(glarr[j].departements[i] === deps[d][0]){
                    deps[d][1] = false;
                    break;
                  }
                }
              }
            break;
          }
        }
      }else{
        for(j = 0; j < glarr.length; j++){
          if(glarr[j].region === this.props.value[0]){
            for(i = 0; i < glarr[j].departements.length; i++){
              for(d = 0; d < deps.length; d++){
                if(glarr[j].departements[i] === deps[d][0]){
                  deps[d][1] = true;
                  break;
                }
              }
            }
            break;
          }
        }
      }
      break;
      case "sup" :

        this.props.appRef.setState({ sites: arr });
        break;
      case "cmp" :

        this.props.appRef.setState({ companies: arr });
        break;
      case "equ" :

        this.props.appRef.setState({ equipements: arr });
        break;
      case "cts" :

        this.props.appRef.setState({ countries: arr });
        break;
      case "fts" :

        this.props.appRef.setState({ sites: arr });
        break;
      case "lvl" :

        this.props.appRef.setState({ levels: arr });
        break;
      case "sct" :

        this.props.appRef.setState({ sectors: arr });
        break;
      case "exp" :

        this.props.appRef.setState({ experiences: arr });
        break;
      default :
        break;
    }
  };

  handleDepChange(event){
    let i = 0,
        j = 0,
        d = 0,
        arr = this.props.departements,
        glarr = this.props.depAndReg,
        nbCheck = 0,
        nbdepsChecked = 0;

    // Changing the state of the departements
    //if( event !== undefined ) {
      for(i = 0; i < arr.length; i++){
        if(arr[i][0] === event.target.id){
          //console.log(arr[i][0]);
          arr[i][1] = event.target.checked;
          break;
        }
      }
      this.props.appRef.setState({ departements: arr });
      arr = this.props.appRef.state.departements;
    //}

    // Checking the number of department check for the selected region
    for(i = 0; i < glarr.length; i++){
      if(glarr[i].region === this.props.value[0]){
        for(j = 0; j < glarr[i].departements.length; j++){
          nbdepsChecked = 0;
          for(d = 0;d < arr.length; d++){
            if(arr[d][1]){
              nbdepsChecked++;
            }
            if(glarr[i].departements[j] === arr[d][0]){
              if(arr[d][1]){
                nbCheck++;
              }
            }
          }
        }
      }
    }
    // if all the department are unchecked, deselect the region
    if(nbCheck === 0){
      let regs = this.props.appRef.state.regions;
      for(i = 0; i < this.props.appRef.state.regions.length; i++) {
        if(regs[i][0] === this.props.region){
          regs[i][1] = false;
          break;
        }
      }
    }
    if(nbdepsChecked === 0){
      this.props.appRef.setState({allLocation : false});
    }
    if(nbdepsChecked === arr.length){
      this.props.appRef.setState({ allLocation: true });
    }
  }

  togglePanel(event){
    //this.setState({expanded :!this.state.expanded });
  }

  generateOptDepForReg(){
    let els = [], i = 0, k = 0, j = 0, e = 0, checked = false, glarr = this.props.depAndReg;

    for(i = 0; i < glarr.length; i++){
      if(glarr[i].region === this.props.value[0]){
        for(j=0; j < glarr[i].departements.length; j++ ){
          //if(this.props.departements !== undefined) {
            for(e=0;e<this.props.departements.length;e++){
              if((glarr[i].departements[j] === this.props.departements[e][0] && this.props.departements[e][1])){
                checked = true;
              }else{
                checked = false;
              }
              if(glarr[i].departements[j] === this.props.departements[e][0]){
                els.push(
                  <Row key={k} style={{padding: "2%"}}>
                    <Col sm="2" md="2" xs="2" >
                      <Form.Group style={{marginTop:"2px"}} controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="" id={this.props.departements[e][0] !== null ? this.props.departements[e][0] : "customSwitch"+Math.random().toString() } checked={checked} onChange={this.handleDepChange}  disabled={!this.props.checked ? true : false} />
                      </Form.Group>
                    </Col>
                    <Col sm="6" md="6" xs="6" style={{marginTop:"5px"}}>{this.props.departements[e][0]}</Col>
                    <Col sm="4" md="4" xs="4">
                      { this.props.appRef.state.filterStatuses[this.props.departements[e][0]] !== undefined && this.props.appRef.state.filterStatuses[this.props.departements[e][0]] === 1 ? <div className={style.status + " " + style.depactivefilter}></div> : <div className={style.status +" "+ style.notactivefilter}></div> }
                    </Col>
                  </Row>
                );
                k++;
                break;
              }
            }
          //}
        }
      }
    }
    return els;
  }

  generatePanel(){

    let els = (<Row className={ style.switchcontainer} >
                  <Col sm="2" md="2" xs="2">
                    <Form.Check 
                      checked={this.props.checked}
                      onChange={this.handleChange}
                      type="switch"
                      label=""
                      id={ this.props.value !== null ? this.props.value[0] : "customSwitch" + Math.random().toString() }
                    />
                  </Col>
                  <Col sm="7" md="7" xs="7" style={{marginTop:"3px"}}>
                      { this.props.for === "location" ? "" : this.props.value[0] }
                  </Col>
                  <Col sm="3" md="3" xs="3">
                    { this.props.for === "equ" || this.props.for === "location" ? <div></div> : (this.props.appRef.state.filterStatuses[this.props.value[0]] !== undefined && this.props.appRef.state.filterStatuses[this.props.value[0]] === 1 ? <div className={style.status +" "+ style.activefilter}></div> : <div className={style.status +" "+ style.notactivefilter}></div>) }
                  </Col>
               </Row>);

    if(this.props.for === "location"){
      els = (
        <div className={style.switchcontainer} >
          <Row>
            <Col sm="3" md="3" xs="3" > { els } </Col>
            <Col sm="5" md="5" xs="5" style={{ padding: "0", marginTop: "3px"}} >{this.props.value[0]}</Col>
            <Col sm="2" md="2" xs="2">
              { this.props.appRef.state.filterStatuses[this.props.value[0]] !== undefined && this.props.appRef.state.filterStatuses[this.props.value[0]] === 1 ? <div className={style.status +" "+ style.activefilter}></div> : <div className={style.status +" " + style.notactivefilter}></div> }
            </Col>
            { /*<Col sm="2" md="2" xs="2" style={{padding: "0"}}> <ExpandMoreIcon className={!this.state.expanded ? style.arrowUpLoc : style.arrowDownLoc} fontSize="small" onClick={this.togglePanel} /></Col> */ }
          </Row>
          {/*<Collapse in={this.state.expanded }>
              <div>
                { this.generateOptDepForReg().map((el) => el) }
              </div>
            </Collapse> */}
        </div>

      );
    }
    return els;
  }

  render() {
    return this.generatePanel();
  }
}


