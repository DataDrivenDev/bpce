import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Accordion, Card, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import MonthPicker from 'react-month-picker';


//import Filters from '../filters/Filters';
import MonthBox  from '../monthbox/MonthBox';
import statsLibrary from '../stats/sort_data';
import InfoSiteService from '../../services/infosites/services';
import BarChart from './BarChart/BarChart';
import BarChartByCompany from './BarChartByCompany/BarChartByCompany';
//import ByMonthChart from '../statistics/BarChart/ByMonthChart';
import PerfTableStats  from './table/PerfTableStats';
import BlogTableStats  from './table/ContentSiteTableStats';
import SumUp  from './sumup/SumUp';
import * as Cookies from "js-cookie";

import UserContext from '../../shared/context/User';


import style from "./statistics.module.css";

interface  StatisticsProps {
  drawer : any,
  filters : any
  dataAnalysed : Array<any>
}

interface  StatisticsState {
  infoColor : any,
  infoCostType : any,
  filterSelectedPanelOpen: boolean,
  showFilterStatus : boolean,
  barChartSelectedProp : string,
  barChartMonthSelectedProp : string,
  barChartSelectedCompany : string,
  simpleBarChartDataType : string,
  simpleBarChartDataProp : Array<string>,
  barChartDataType : string,
  barChartMonthDataType : string,
  barChartDataProp : Array<string>,
  barChartMonthSelectedFilter : string,
  barChartMonthDataProp : Array<string>,
  dropdownBarCharSelectionOpen : boolean,
  show:boolean
};



export default class Statistics extends Component< StatisticsProps, StatisticsState> {

  static contextType = UserContext;
  statsLibrary : any;
  monthPickerRef : any;

  constructor(props){
    super(props);
    this.handleRangeChange         = this.handleRangeChange.bind(this);
    this.handleRangeDissmis        = this.handleRangeDissmis.bind(this);
    this.handleClickRangeBox       = this.handleClickRangeBox.bind(this);
    this.toggleFilterSelectedPanel = this.toggleFilterSelectedPanel.bind(this);
    this.toggleCalendarPanel       = this.toggleCalendarPanel.bind(this);
    this.statsLibrary = new statsLibrary();
    this.monthPickerRef = null;
    this.state = {
      infoColor : null,
      infoCostType : null,
      filterSelectedPanelOpen: false,
      showFilterStatus : false,
      barChartSelectedProp : "RegionNom",
      barChartMonthSelectedProp : "RegionNom",
      barChartSelectedCompany : "BPCE SA",
      simpleBarChartDataType : "apply",
      simpleBarChartDataProp : ["apply","completed","hired","gencompleted", "genhired"],
      barChartDataType : "apply",
      barChartMonthDataType : "apply",
      barChartDataProp : ["apply","completed","hired","gencompleted", "genhired" ],
      barChartMonthSelectedFilter : "companies",
      barChartMonthDataProp : ["apply","completed","hired","gencompleted", "genhired" ],
      dropdownBarCharSelectionOpen : false,
      show:false
    };
  }

  async componentDidMount(){

    let infoSiteService = new InfoSiteService(),
        clientKey = await this.context.userShouldBeChecked();
        let info = await infoSiteService.postSupportInfo(clientKey,infoSiteService.getSupportInfoUrl());
        let infoCostType = info !== null ? info.reduce( (acc, obj) => {
          let cle =  obj["Site"] !== undefined ? obj["Site"] : null;
          if(!acc[cle] && cle !== null) {
            acc[cle] = obj["CostType"];
          }
          return acc;
        }, {}) : {},
        infoColor = info !== null ? info.reduce( (acc, obj) => {
          let cle =  obj["Site"] !== undefined ? obj["Site"].toUpperCase() : null;
          if(!acc[cle] && cle !== null) {
            acc[cle] = obj["Color"];
          }
          return acc;
      }, {}) : {};

    this.setState({ infoColor : infoColor, infoCostType : infoCostType });
  }


  handleRangeChange = (value, text, listIndex) => {

    let from = this.props.drawer.state.mrange.from,
        to   = this.props.drawer.state.mrange.to;

    if( listIndex === 0 ){
      from = { year: value, month: text };
    } else if ( listIndex === 1 ){
      to = { year: value, month: text };
    }

    this.props.drawer.setState({ mrange : { from: from, to: to } });
    this.setState({ show:true });
  }

  handleRangeDissmis = async (value) => {

    let el = document.getElementsByClassName("rmp-container");
    this.props.drawer.setState({ mrange : value });
    el[0].setAttribute( "style", "z-index : -1 !important");
    this.setState({ show : false}, async () => {
      await this.props.drawer.refreshSetOfData();
      this.props.drawer.generateFilterData(this.props.drawer.state.dataSortedByEquipements);
    });
  }

  handleClickRangeBox = (e) => {

    let el = document.getElementsByClassName("rmp-container");
    this.monthPickerRef.show();
    this.setState({show:true});
    el[0].setAttribute( "style", "z-index : 1030 !important");
  
  }

  toggleCalendarPanel = (e) => {
    this.setState( { show:false } );
  }

   toggleDropdownBarCharSelection = () => {
    this.setState({ dropdownBarCharSelectionOpen : !this.state.dropdownBarCharSelectionOpen});
  }

  changeSelectedCompany = (company) => {
    this.setState({ barChartSelectedCompany: company });
  }

  simpleChangeSelectedData = ( prop ) => {
    this.setState({ simpleBarChartDataType: prop });
  }

  changeSelectedbarChartMonthFilter = (filterName) => {

    let filter = "";

    switch(filterName) {

        case "regions":
          filter = "RegionNom";
          break;
        case "departements":
          filter = "DepartNom";
          break;
        case "platforms" :
          filter = "Support";
          break;
        case "countries":
          filter = "Country";
          break;
        case "companies":
          filter = "Societe";
          break;
        case "equipements":
          filter = "Equipement";
          break;
        case "functions":
          filter = "Fonction";
          break;
        default :
          filter = "Support";
          break;
    }
    this.setState({ barChartMonthSelectedProp: filter, barChartMonthSelectedFilter: filterName });
  }

  formatDataType = ( text ) => {

    let newText = "";

    switch(text) {

      case "nbofjobofferpublished":
        newText = "Annonces publiées";
        break;
      case "apply" :
        newText = "Candidatures initiées"
        break;
      case "consultation" :
        newText = "Consultations"
        break;
      case "completed" :
        newText = "Candidatures finalisées"
        break;
      case "entretien" :
        newText = "Entretiens directs"
        break;
      case "hired" :
        newText = "Embauches"
        break;
      case "gencompleted" :
        newText = "Candidatures indirectes"
        break;
      case "genentretien" :
        newText = "Entretiens indirects"
        break;
      case "genhired" :
        newText = "Embauches indirectes"
        break;
      case "costapply" :
        newText = "Coût à la candidature"
        break;
      case "costconsultation" :
        newText = "Coût à la consultation"
        break;
      case "costcompleted" :
        newText = "Coût au CV direct"
        break;
      default :
        newText = text;
        break;
    }
    return newText.toUpperCase();
  }

  formatFilter = ( text ) => {

    let newText = "";

    switch(text) {

      case "companies" :
        newText = "Entreprises"
        break;
      case "countries" :
        newText = "Pays"
        break;
      case "departements" :
        newText = "Departements"
        break;
      case "equipements" :
        newText = "Equipements"
        break;
      case "functions" :
        newText = "Fonctions"
        break;
      case "platforms" :
        newText = "Supports"
        break;
      case "regions" :
        newText = "Regions"
        break;
      default :
        newText = text;
        break;
    }
    return newText.toUpperCase();
  }

  changeSelectedData = ( dataType ) => {
    this.setState({ barChartDataType : dataType });
  }

  changeSelectedbarChartMontData = ( dataType ) => {
    this.setState({ barChartMonthDataType : dataType });
  }

  /**
  * We count the total number of selected filters
  */

  countSelectedFilter = (filters) => {
    let i = 0, j = 0, nbSelected = 1, nbOfFilter = 0;

    for(i = 0; i < filters.length; i++){
      if( filters[i] !== null && filters[i][1] !== undefined ){
        let arrFilt = filters[i][1];
        for(j = 0; j < arrFilt.length; j++){
          if( filters[i][1][j] !== null && filters[i][1][j][1] ){
            nbSelected++;
          }
          nbOfFilter++;
        }
      }
    }
    return [nbSelected,nbOfFilter];
  }


  toggleFilterSelectedPanel = () => {
    this.setState({filterSelectedPanelOpen : !this.state.filterSelectedPanelOpen});
  }

  triggerFilterStatuses = ( filterStatuses ) => {
    this.props.drawer.setState({filterStatuses:filterStatuses});
  }


  render(){

    const dataAnalysed = this.props.drawer.state.setofdata.length !== 0 ? this.props.dataAnalysed : [],
        dataFilteredByMonth = dataAnalysed[0],
        //filterStatuses = dataAnalysed[1],
        dataFilteredByMonthAndBySupport = this.statsLibrary.groupBySupport(dataFilteredByMonth),
        dataFilteredBySelection1 = this.statsLibrary.groupBySupport(this.statsLibrary.groupBySelection(dataFilteredByMonth,this.state.barChartSelectedProp));
        //dataFilteredBySelection2 = this.statsLibrary.groupBySelection(dataFilteredByMonth,this.state.barChartMonthSelectedProp);
        //console.log(this.state.infoCostType);

    
    const sumUpProps = {

      app : this.props.drawer,
      data : dataFilteredByMonth,
      dataBySupport : dataFilteredByMonthAndBySupport,
      info : this.state.infoColor,
      siteCostType : this.state.infoCostType

    }/*,costTableProps = {
      dataBySupportNotFiltered : this.statsLibrary.groupBySupport(this.props.drawer.state.setofdata),
      dataByMontAndBySupport : dataFilteredByMonthAndBySupport,
      info : this.state.infoColor,
      siteCostType : this.state.infoCostType,
      app : this.props.drawer
    },*/
    ,statsProps = {
      app: this.props.drawer,
      data: dataFilteredByMonthAndBySupport,
    }

    const pickerLang = {
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    }

    const makeText = m => {
       if (m && m.year && m.month) return (pickerLang.months[m.month-1] + ' ' + m.year)
       return '?'
    }

    const makeSentence = (from, to) => {
      if(from.year === to.year && from.month === to.month){
        return <Typography onClick={this.handleClickRangeBox} className="mainTitle" variant="overline" display="block" gutterBottom> {'Dashboard Pour ' + makeText(from)}  </Typography>;
      }else{
        return <Typography onClick={this.handleClickRangeBox} className="mainTitle" variant="overline" display="block" gutterBottom> {'Dashboard  De ' + makeText(from) + ' à ' + makeText(to)}  </Typography>;
      }
    }

    return (  <div className={style.maincontainer} /*style={{ width:this.props.drawer.state.drawerToggled ? "80%" : "100%"}}*/>
                <MonthPicker
                        ref={(reference) => { this.monthPickerRef = reference }}
                        years={{max: { year: new Date().getFullYear(), month: new Date().getMonth() + 1  }}}
                        range={this.props.drawer.state.mrange}
                        theme="light"
                        show={this.state.show}
                        lang={pickerLang.months}
                        onChange={this.handleRangeChange}
                        onDismiss={this.handleRangeDissmis} 
                        >
                      <MonthBox onClick={this.handleClickRangeBox} />
                </MonthPicker>
                  <Row className="header-row-fiters">
                      <Col xs="12" sm="12" md="12">
                        <Accordion>
                            <Card>
                              <Card.Header>
                                <Row className="filter-header">
                                  <Col xs="12" sm="9" md="9" className="dash-title">
                                    { makeSentence(this.props.drawer.state.mrange.from, this.props.drawer.state.mrange.to) }
                                  </Col>
                                  <Col xs="12" sm="3" md="3" style={{textAlign:"center"}}>
                                    <Button style={{marginTop:"5px"}} onClick={async (event) => { await this.componentDidMount(); await this.props.drawer.refreshSetOfData(event); } }>Rafraichir</Button>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs="12" sm="12" md="12">
                                    {/*<Accordion.Toggle as={Button} className={style.filterBtn} variant="link" eventKey="0" onClick={this.toggleFilterSelectedPanel}> */}
                                    { this.countSelectedFilter(this.props.filters)[0].toString() + " Critères séléctionnés" }
                                    {/*</Accordion.Toggle>*/}
                                  </Col>
                                </Row>
                              </Card.Header>
                              {/*<Accordion.Collapse eventKey="0">
                                  <Card.Body>
                                    <Filters {...drawer } /> 
                                  </Card.Body>
                                </Accordion.Collapse>*/}
                            </Card>
                        </Accordion>
                      </Col>
                  </Row>
                  <SumUp {...sumUpProps } />
                  <hr className="divider" />
                  <Row>
                    <Col xs="12" sm="12" md="12">
                      <Typography className="title" variant="overline" display="block" gutterBottom > Réalisations par supports </Typography>
                    </Col>
                  </Row>
                  <Row>
                     <Col xs="12" sm="12" md="12">
                       <div className="menu-dropdown">
                         <DropdownButton  variant="outline-secondary" className="btn-data-type" drop="down" title={ this.formatDataType(this.state.simpleBarChartDataType) }>
                           { this.state.simpleBarChartDataProp.map((dataType) => dataType !== this.state.simpleBarChartDataType ? <Dropdown.Item key={dataType} as="button" onClick={() => this.simpleChangeSelectedData(dataType)} >{this.formatDataType(dataType)}</Dropdown.Item> : null)}
                         </DropdownButton>
                       </div>
                       <div style={{marginTop:"100px"}}>
                          <BarChart drawer={this.props.drawer} dashboard={this} data={dataFilteredByMonthAndBySupport} info={this.state.infoColor}  selectedDataType={this.state.simpleBarChartDataType} />
                       </div>
                     </Col>
                 </Row>
                 <hr className="divider" />
                  <Row className="vertical-space">
                    <Col xs="12" sm="12" md="12">
                      <Typography className="title" variant="overline" display="block" gutterBottom> Performances par support  </Typography>
                      <div className="vertical-space" style={{marginLeft:"2%"}}>
                        <PerfTableStats {...statsProps } />
                      </div>
                    </Col>
                  </Row>
                  <hr className="divider" />
                  <Row className="vertical-space">
                    <Col xs="12" sm="12" md="12">
                      <div className="vertical-space" style={{marginLeft:"2%"}}>
                        <BlogTableStats {...statsProps } />
                      </div>
                    </Col>
                  </Row>
                {/*<hr className="divider" />
                 <Row className="vertical-space">
                  <Col xs="12" sm="12" md="12">
                        <Typography className="title" variant="overline" display="block" gutterBottom> Coûts par support  </Typography>
                        <div className="vertical-space">
                          <CostTableStats { ...costTableProps } />
                        </div>
                    </Col>
                  </Row>*/}
                <hr className="divider" />
                <Row>
                  <Col xs="12" sm="12" md="12">
                    <Typography className="title" variant="overline" display="block" gutterBottom > { this.formatDataType(this.state.barChartDataType) +" pour "+ this.state.barChartSelectedCompany }  </Typography>
                  </Col>
                </Row>
                <Row>
                   <Col xs="12" sm="12" md="12">
                     <div className="menu-dropdown" >
                       <DropdownButton  variant="outline-secondary" className="btn-data-type" drop="down" title={ this.formatDataType(this.state.barChartDataType) } >
                         { this.state.barChartDataProp.map((dataType) => dataType !== this.state.barChartDataType ? <Dropdown.Item key={dataType} as="button" onClick={() => this.changeSelectedData(dataType)} >{this.formatDataType(dataType)}</Dropdown.Item> : null)}
                       </DropdownButton>
                       <DropdownButton  variant="outline-secondary" className="btn-filter-type" drop="down" title={ this.state.barChartSelectedCompany } >
                         { this.props.drawer.state.companies.map((company) =>  <Dropdown.Item key={company[0]} as="button" onClick={() => this.changeSelectedCompany(company[0])} >{company[0].toUpperCase()}</Dropdown.Item>)}
                       </DropdownButton>
                     </div>
                     <div style={{marginTop:"100px"}}>
                          <BarChartByCompany drawer={this.props.drawer} dashboard={this} data={dataFilteredByMonthAndBySupport} info={this.state.infoColor}  selectedDataType={this.state.barChartDataType} selectedCompany={this.state.barChartSelectedCompany} />
                       </div>
                   </Col>
               </Row>
               <hr className="divider" />
                {/* <Row>
                  <Col xs="12" sm="12" md="12">
                    <Typography className="title" variant="overline" display="block" gutterBottom style={{ marginRight: "2%" }} >  { this.formatDataType(this.state.barChartMonthDataType) + " par mois" }  </Typography>
                  </Col>
                </Row>
                 <Row>
                   <Col xs="12" sm="12" md="12">
                     <div className="menu-dropdown">
                       <DropdownButton  variant="outline-secondary" className="btn-data-type" drop="down" title={ this.formatDataType(this.state.barChartMonthDataType) } >
                        { this.state.barChartDataProp.map((dataType) => this.state.barChartMonthDataType !== dataType ? <Dropdown.Item key={dataType} as="button" onClick={() => this.changeSelectedbarChartMontData(dataType)} >{this.formatDataType(dataType)}</Dropdown.Item> : null)}
                       </DropdownButton> 
                     </div>
                      <div style={{marginTop:"100px"}}>
                        <ByMonthChart drawer={this.props.drawer} dashboard={this} data={dataFilteredBySelection2}  selectedDataType={this.state.barChartMonthDataType} />
                     </div>
                   </Col>
                </Row> */ }
            </div>
        );
  }
}