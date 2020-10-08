import React,{ Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Button, Row, Col, Form} from 'react-bootstrap';
import MuiExpansionPanel from '@material-ui/core/Accordion';
import MuiExpansionPanelSummary from '@material-ui/core/AccordionSummary';
import MuiExpansionPanelDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import Switch from '../switch/switch';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';

import Icon from '@mdi/react'
import { mdiMapMarker,
         mdiMagnify,
         mdiWeb,
         mdiDomain,
         mdiMonitorCellphoneStar,
         mdiMapSearch,
         mdiBriefcaseOutline,
         /*mdiFocusField,
         mdiSchoolOutline,
         mdiFileAccountOutline */} from '@mdi/js';


import style from "./sidenavbar.module.css";


interface SideNavBarProps {
    app : any
}

interface SideNavBarState {
    drawerToggled : boolean,
    panelsExpanded : Array<boolean>
}

export default class SideNavBar extends Component<SideNavBarProps,SideNavBarState> {

    app : any;
    
    constructor(props){
        super(props);
        this.app = this.props.app;
        this.state = {
          drawerToggled : false,
          panelsExpanded : [false,false,false,false,false,false,false,false,false,false],
        }

        this.slideOut = this.slideOut.bind(this);
        this.slideIn = this.slideIn.bind(this);
    }

    clickOnPanel = (index, value) => {
      let panelsExpanded = this.state.panelsExpanded, i = 0;
      for( i = 0; i < panelsExpanded.length; i++ ){
        panelsExpanded[i] =  index !== i ? false : !value;
      }
      this.setState({panelsExpanded : panelsExpanded});
    }

    slideIn() {
        let element = document.getElementsByClassName( style.drawerContent )[0] as HTMLDivElement;
        if(element !== null ){
            element.classList.add(style.active);
            this.setState({ drawerToggled : true});
            this.props.app.setState({drawerToggled : true});
        }
    }

    slideOut() {
        let element = document.getElementsByClassName( style.drawerContent )[0] as HTMLDivElement;
        if( element !== null ){
            element.classList.remove(style.active);
            this.setState({ drawerToggled : false});
            this.props.app.setState({drawerToggled : false});
        }
    }
        
    render() {
        //console.log(this.app.state.countries);
        let expandIcon = (<ExpandMoreIcon className={this.state.drawerToggled ? style.show : style.hide } />);
        return (
          <div id={style.drawer} onMouseEnter={this.slideIn} onMouseLeave={this.slideOut}>
              <div className={style.drawerContent }>
                <List>
                    <MuiExpansionPanel className={style.panelContainer} expanded={this.state.panelsExpanded[0]} square>
                    <MuiExpansionPanelSummary  className={style.panelContent}
                                               expandIcon={ expandIcon }
                                               onClick={() => this.clickOnPanel(0,this.state.panelsExpanded[0])}
                                               >
                        <Icon
                            path={ mdiMapSearch }
                            title="Countries"
                            size={0.80}
                            horizontal
                            vertical
                            rotate={180}
                            color="black"
                            className="side-icons"
                        />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Pays</Typography>
                    </MuiExpansionPanelSummary>
                    <MuiExpansionPanelDetails className={style.panelDetail} style={{display:"block"}}>
                        {
                            this.app.state.countries.map((el) =>
                                <div className={ this.state.drawerToggled ? style.show : style.hide } key={el} >
                                    <Switch for="cts" departements={[]} depAndReg = {[]} region="" value={el} checked={el[1]} appRef={this.app} options={this.app.state.countries} />
                                </div>
                            )
                        }
                    </MuiExpansionPanelDetails>
                </MuiExpansionPanel>
                <MuiExpansionPanel className="panelContainer" square  expanded={this.state.panelsExpanded[1]}>
                    <MuiExpansionPanelSummary className="panelContent"
                                              expandIcon={ expandIcon }
                                              onClick={() => this.clickOnPanel(1,this.state.panelsExpanded[1])}>
                        <Icon path={ mdiMapMarker }
                            title="Localisation"
                            size={0.80}
                            horizontal
                            vertical
                            rotate={180}
                            color="black"
                            className="side-icons"
                        />
                    <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Localisation</Typography>

                    </MuiExpansionPanelSummary>
                    <MuiExpansionPanelDetails className="panelDetail hide" style={{display:"block"}}>
                        {
                        this.app.state.regions.map((el) => el[0] !== "" ?
                            <div key={el[0]} className={ this.state.drawerToggled ? style.show : style.hide } >
                                <Switch 
                                        value={el}
                                        checked={el[1]}
                                        appRef={this.app}
                                        for="location"
                                        region={el[0]}
                                        options={this.app.state.regions}
                                        departements={this.app.state.departements}
                                        depAndReg={this.app.state.regAndDep}
                                />
                            </div> : null
                        )
                        }
                    <br />
                    <Row className={ this.state.drawerToggled ? style.show : style.hide } > 
                        <Button className={ this.app.state.allLocation ? "btnLoc noLocationBtn" :" btnLoc allLocationBtn" } onClick={this.app.toggleAllLocationsBtn} variant="contained" size="sm" >{this.app.state.allLocation ? "Aucunes" : "Toutes"}</Button>
                    </Row>
                    </MuiExpansionPanelDetails>
                </MuiExpansionPanel>
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[2]} >
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={ expandIcon } onClick={() => this.clickOnPanel(2,this.state.panelsExpanded[2])}>
                            <Icon
                                path={ mdiWeb }
                                title="Supports d'annonces d'emplois"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Supports</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className={ style.panelDetail +" " + (this.state.drawerToggled ? style.show : style.hide) }>
                            {
                                this.app.state.serverNames.map((el) => 
                                <div key={el} className={ this.state.drawerToggled ? style.show : style.hide } >
                                    <Switch  for="sup" value={el} departements={[]} depAndReg = {[]} region="" checked={el[1]} appRef={this.app} options={this.app.state.serverNames} />
                                </div>
                                )
                            }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[3]} >
                        <MuiExpansionPanelSummary  className={style.panelContent} expandIcon={ expandIcon } onClick={() => this.clickOnPanel(3,this.state.panelsExpanded[3])} >
                            <Icon
                                path={mdiDomain}
                                title="Filiales"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className={style.sideicons}
                            />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Filiales</Typography>
                        </MuiExpansionPanelSummary>
                         <MuiExpansionPanelDetails className={ style.panelDetail +" " + (this.state.drawerToggled ? style.show : style.hide) }>

                            {
                                this.app.state.companies.map((el) => el[0] !== "" ? 
                                <div className={ this.state.drawerToggled ? style.show : style.hide } key={el}>
                                    <Switch for="cmp" departements={[]} depAndReg = {[]} region=""  value={el}  checked={el[1]} appRef={this.app} options={this.app.state.companies} />
                                </div> : <div key={el} ></div>)
                            }
                            <br />
                            <Row>
                                <Button className={ this.app.state.allCompanies ? style.btn + " " + style.noDataBtn : style.btn +" "+ style.allDataBtn } onClick={this.app.toggleAllCompanies} variant="contained" size="sm" >{this.app.state.allCompanies ? "Aucunes" : "Toutes"}</Button>
                            </Row>
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[4]} >
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={ expandIcon } onClick={() => this.clickOnPanel(4,this.state.panelsExpanded[4])}>
                            <Icon
                                path={mdiMonitorCellphoneStar}
                                title="Equipments"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Equipements</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className={ style.panelDetail +" " + (this.state.drawerToggled ? style.show : style.hide) }>
                            { this.app.state.equipements.map((el) => 
                                <div  key={el} className={ this.state.drawerToggled ? style.show : style.hide }>
                                    <Switch for="equ" value={el} departements={[]} depAndReg = {[]} region="" checked={el[1]} appRef={this.app} options={this.app.state.equipements} /> 
                                </div>
                            ) }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>

                    {/*<MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[7]} >
                       <MuiExpansionPanelSummary className={style.panelContent} expandIcon={expandIcon} onClick={() => this.clickOnPanel(7,this.state.panelsExpanded[7])}>
                            <Icon
                                path={  mdiSchoolOutline }
                                title="Levels"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                            <Typography className="filterlabel" variant="overline" display="inline" gutterBottom>Niveaux</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className="panelDetail" >
                            {
                                this.app.state.levels.map((el)=><Switch className={ this.state.drawerToggled ? style.show : style.hide } key={el} value={el} color={"primary"} checked={el[1]} appRef={this.app} for="lvl" options={this.app.state.levels} />)
                            }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>*/}
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[5]} >
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={ expandIcon } onClick={() => this.clickOnPanel(5,this.state.panelsExpanded[5])}>
                            <Icon
                                path={ mdiBriefcaseOutline }
                                title="Functions"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Fonctions</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className={ style.panelDetail +" " + (this.state.drawerToggled ? style.show : style.hide) }>
                            {
                                this.app.state.functions.map((el) => 
                                <div key={el} className={ this.state.drawerToggled ? style.show : style.hide } >
                                    <Switch departements={[]} depAndReg = {[]} region="" for="fts" value={el} checked={el[1]} appRef={this.app}  options={this.app.state.functions} />
                                </div>
                                )
                            }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                    {/*<MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[6]} >
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={ expandIcon } onClick={() => this.clickOnPanel(6,this.state.panelsExpanded[6])}>
                            <Icon
                                path={ mdiFocusField }
                                title="Sectors"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                            <Typography className="filterlabel" variant="overline" display="inline" gutterBottom>Secteurs</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className="panelDetail" >
                            {
                                this.app.state.sectors.map((el)=> <Switch className={ this.state.drawerToggled ? style.show : style.hide } key={el} value={el} color={"primary"} checked={el[1]} appRef={this.app} for="sct" options={this.app.state.sectors} />)
                            }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[8]}>
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={expandIcon} onClick={() => this.clickOnPanel(8,this.state.panelsExpanded[8])}>
                            <Icon
                                path={  mdiFileAccountOutline }
                                title="Experiences"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                            <Typography className="filterlabel" variant="overline" display="inline" gutterBottom>Experiences</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className="panelDetail" >
                            {
                                this.app.state.experiences.map((el)=><Switch className={ this.state.drawerToggled ? style.show : style.hide } key={el} value={el} color={"primary"} checked={el[1]} appRef={this.app} for="exp" options={this.app.state.experiences} />)
                            }
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>*/}
                    <MuiExpansionPanel className={style.panelContainer} square expanded={this.state.panelsExpanded[9]} >
                        <MuiExpansionPanelSummary className={style.panelContent} expandIcon={  expandIcon } onClick={() => this.clickOnPanel(9,this.state.panelsExpanded[9])}>
                            <Icon path={ mdiMagnify }
                                title="Search for annonces with a specific key word"
                                size={0.80}
                                horizontal
                                vertical
                                rotate={180}
                                color="black"
                                className="side-icons"
                            />
                        <Typography className={ style.filterlabel +" " + (this.state.drawerToggled ? style.show : style.hide) } variant="overline" display="inline" gutterBottom>Mot clés</Typography>
                        </MuiExpansionPanelSummary>
                        <MuiExpansionPanelDetails className={ style.panelDetail +" " + (this.state.drawerToggled ? style.show : style.hide) }>
                            <Paper className="panelContentKeyWord">
                                <Row>
                                    <Col sm="12" md="12" xs="12">
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Titre de l'annonce" onChange={this.props.app.changeTitleKeyWord}/>
                                        </Form.Group>
                                    </Col>
                                </Row> <br/>
                                <Row>
                                    <Col sm="12" md="12" xs="12">
                                        <Form.Group >
                                            <Form.Control type="text" placeholder="Référence" onChange={this.props.app.changeRefKeyWord}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Paper>
                        </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                </List>
              </div>
          </div>
        );
    }
}

