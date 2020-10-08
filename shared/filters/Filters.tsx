import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Row, Col, Button } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import styles from "./styles.module.css";

interface FiltersProps {
    app : any
}

export default class Filters extends React.PureComponent<FiltersProps> {

    minDepName : string;
    minRegName : string;
    minKwordName : string;
    minPtsName : string;
    minCompaName : string;
    minCountryName : string;
    minEquipName : string;
    minFunctionName : string;
    minSectorsName : string;
    minLevelsName : string;
    minExperienceName: string;

  constructor(props) {
    super(props);
    this.minDepName="DEP";
    this.minRegName="REG";
    this.minKwordName="KWD";
    this.minPtsName="PTS";
    this.minCompaName="CMP";
    this.minCountryName="CNY";
    this.minEquipName="EQP";
    this.minFunctionName="FCT";
    this.minSectorsName="SCT";
    this.minLevelsName="LVL";
    this.minExperienceName="EXP";
    this.toggleChips= this.toggleChips.bind(this);
  }

  toggleChips(value){

    let data = value.split(": "),
        i = 0,
        j = 0,
        d = 0,
        rd = 0,
        r = 0,
        e = 0,
        o = 0,
        type = data[0],
        val = data[1],
        filters = this.props.app.state.filters,
        regionList = filters[0],
        depList = filters[1],
        sitelist = filters[2],
        countryList = filters[3],
        companyList = filters[4],
        equipementList = filters[5],
        functionList = filters[6],
        sectorList = filters[7],
        levelList = filters[8],
        experienceList = filters[9],
        deps = this.props.app.state.departements,
        regs = this.props.app.state.regions,
        nbOfRegChecked = 0,
        nbOfDepChecked = 0;

    switch(type) {
        case this.minCountryName:
          
          for(i = 0; i < countryList[1].length; i++){
              if(countryList[1][i][0] === val){
                  console.log(countryList);
                  countryList[1][i][1] = false;
                  this.props.app.setState({countries:countryList[1]});
              }
          }
        break;
        case this.minSectorsName:
          for(i = 0; i < sectorList[1].length; i++){
              if(sectorList[1][i][0] === val){
                  sectorList[1][i][1] = false;
                  this.props.app.setState({sectors:sectorList[1]});
              }
          }
        break;
        case this.minLevelsName:
          for(i = 0; i < levelList[1].length; i++){
              if(levelList[1][i][0] === val){
                  levelList[1][i][1] = false;
                  this.props.app.setState({levels:levelList[1]});
              }
          }
        break;
        case this.minExperienceName:
          for(i = 0; i < experienceList[1].length; i++){
              if(experienceList[1][i][0] === val){

                  experienceList[1][i][1] = false;
                  this.props.app.setState({experiences:experienceList[1]});
              }
          }
        break;
        case this.minPtsName:
            for(i = 0; i < sitelist[1].length; i++){
                if(sitelist[1][i][0] === val){
                    sitelist[1][i][1] = false;
                    this.props.app.setState({serverNames:sitelist[1]});
                }
            }
            break;
        case this.minCompaName:
            for(i = 0; i < companyList[1].length; i++){
                if(companyList[1][i][0] === val){
                    companyList[1][i][1] = false;
                    this.props.app.setState({companies:companyList[1]});
                }
            }
            break;
        case this.minEquipName:
            for(i = 0; i < equipementList[1].length; i++){
                if(equipementList[1][i][0] === val){
                    equipementList[1][i][1] = false;
                    this.props.app.setState({equipements:equipementList[1]});
                }
            }
            break;
        case this.minFunctionName:
            for(i = 0; i < functionList[1].length; i++){
                if(functionList[1][i][0] === val){
                    functionList[1][i][1] = false;
                    this.props.app.setState({functions:functionList[1]});
                }
            }
            break;
        case this.minDepName:
            for(i = 0; i < depList[1].length; i++){
                if(depList[1][i][0] === val){
                    depList[1][i][1] = false;
                    this.props.app.setState({departements: depList[1]});
                }
                for(j = 0; j < this.props.app.state.regAndDep.length; j++){
                    let location = this.props.app.state.regAndDep[j],
                        region = location.region;

                    for(rd = 0; rd < location.departements.length; rd++){
                        if(val === location.departements[rd]){
                            for(r = 0; r < regs.length; r++){
                                if(regs[r][0] === region){
                                    nbOfDepChecked = 0;
                                    for(e = 0; e < location.departements.length; e++){
                                        for(o = 0; o < deps.length ; o++){
                                            if(location.departements[e] === deps[o][0]){
                                                if(deps[o][1]){
                                                    nbOfDepChecked++;
                                                }
                                            }
                                        }
                                    }
                                    if(nbOfDepChecked === 0) {
                                        regs[r][1] = false;
                                        this.props.app.setState({regions: regs});
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }

                }
            }
            for(r = 0; r < regs.length; r++){
                if(regs[r][1]){
                    nbOfRegChecked++;
                }
            }
            if(nbOfRegChecked === 0){
                this.props.app.setState({allLocation: false});
            }
            break;
        case this.minRegName:
            for(i = 0; i < regionList[1].length; i++){
                if(regionList[1][i][0] === val){
                    regionList[1][i][1] = false;
                    for(j = 0; j < this.props.app.state.regAndDep.length; j++){
                        if(val === this.props.app.state.regAndDep[j].region){
                            for(d = 0; d < deps.length; d++){
                                for(rd = 0; rd < this.props.app.state.regAndDep[j].departements.length; rd++){
                                    if(deps[d][0] === this.props.app.state.regAndDep[j].departements[rd]){
                                        deps[d][1] = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                this.props.app.setState({regions: regionList[1], departements: deps});
            }
            for(r = 0; r < regs.length; r++){
                if(regs[r][1]){
                    nbOfRegChecked++;
                }
            }
            if(nbOfRegChecked === 0){
                this.props.app.setState({allLocation: false});
            }
            break;
            default:
            break;
        }

        this.componentDidMount();
    }

  generateChips(index, minName, name){
      return (
        <Row key={ name !== "Non Défini" ? name + index : name + minName + index} className={styles.filterlabel}>
            <Col xs="4" md="4" sm="4">
                <div onClick={() => this.toggleChips(minName+": "+name)}>
                    <Icon   
                        path={mdiClose}
                        title={name}
                        size={0.65}
                        horizontal
                        vertical
                        rotate={180}
                        className={styles.filtericon}
                    />
                </div>
            </Col>
            <Col xs="8" md="8" sm="8" >{name}</Col>
        </Row>

    );
  }

  generateChipses(){
    let filters = this.props.app.state.filters,
        i = 0,
        j = 0,
        ctrsChips = [],
        regChips = [],
        depChips = [],
        ptsChips = [],
        //keyWordChips = [],
        companiesChips = [],
        equipementChips = [],
        functionChips = [],
        sectorsChips = [],
        levelsChips = [],
        experiencesChips = [];


        /*console.log(this.props.app.state.regAndDep);
        console.log(this.props.app.state.regions);
        console.log(this.props.app.state.departements);*/


    for(i=0; i<filters.length; i++){
        if(filters[i] !== null && filters[i][1] !== undefined && filters[i].length !== 0 ){
            for(j=0;j<filters[i][1].length; j++){
                if( filters[i][1][j][1] ){
                    switch(filters[i][0]){
                    case "countries":
                        ctrsChips.push(this.generateChips(i,this.minCountryName, filters[i][1][j][0]));
                        break;
                    case "platforms":
                        ptsChips.push(this.generateChips(i,this.minPtsName, filters[i][1][j][0]));
                        break;
                    case "regions":
                        regChips.push(this.generateChips(i, this.minRegName,filters[i][1][j][0]));
                        break;
                    case "departements":
                        depChips.push(this.generateChips(i, this.minDepName,filters[i][1][j][0]));
                        break;
                    case "companies":
                        companiesChips.push(this.generateChips(i, this.minCompaName,filters[i][1][j][0]));
                        break;
                    case "equipements":
                        equipementChips.push(this.generateChips(i, this.minEquipName,filters[i][1][j][0]));
                        break;
                    case "functions":
                        functionChips.push(this.generateChips(i, this.minFunctionName,filters[i][1][j][0]));
                        break;
                    /*case "sectors":
                        sectorsChips.push(this.generateChips(i, this.minSectorsName,filters[i][1][j][0]));
                        break;
                    case "levels":
                        levelsChips.push(this.generateChips(i, this.minLevelsName,filters[i][1][j][0]));
                        break;
                    case "experiences":
                        experiencesChips.push(this.generateChips(i, this.minExperienceName,filters[i][1][j][0]));
                        break;*/
                    default:
                        break;
                    }
                }
            }
        }
    }
    /*console.log({
        platforms:ptsChipses,
        regions:regChipses,
        departements:depChipses,
        companies:companiesChipses,
        equipements:equipementChipses,
        functions:functionChipses,
        sectors: sectorsChipses,
        levels:levelsChipses,
        experiences:experiencesChipses
    });*/
    return {
      countries:ctrsChips,
      platforms:ptsChips,
      regions:regChips,
      //departements:depChips,
      companies:companiesChips,
      equipements:equipementChips,
      //functions:functionChips,
      sectors: sectorsChips,
      levels:levelsChips,
      experiences:experiencesChips
    };
  }

  translateTitle(value){
    let title = "";
    switch(value){
        case "countries":
            title = "Pays";
            break;
        case "platforms":
            title = "Site";
            break;
        case "regions":
            title = "Regions";
            break;
        case "departements":
            title = "Departements";
            break;
        case "companies":
            title = "Filiales";
            break;
        case "equipements":
            title = "Equipements"
            break;
        case "functions":
            title = "Fonctions"
            break;
        /*case "sectors":
            sectorsChips.push(this.generateChips(i, this.minSectorsName,filters[i][1][j][0]));
            break;
        case "levels":
            levelsChips.push(this.generateChips(i, this.minLevelsName,filters[i][1][j][0]));
            break;
        case "experiences":
            experiencesChips.push(this.generateChips(i, this.minExperienceName,filters[i][1][j][0]));
            break;*/
        default:
            break;
        }
        return title;
  }

  render() {
      return(
        <div>
            <Row className={styles.chipses}>
                {
                    this.props.app.state.filters.length !== 0 ? this.props.app.state.filters.map(( filter )=> {
                        let chipses = this.generateChipses()[filter[0]], chipsesCols = null;
                        if(chipses !== undefined && chipses.length !== 0){
                            chipsesCols = ( 
                                <Col md="3" xs="12" key={filter[0]} style={{border:"solid 1px lightgrey", minWidth:"230px", margin:"1%" ,padding:"2%"}}>
                                    <Typography className={styles.boxtitle} variant="overline" display="block" gutterBottom> {this.translateTitle(filter[0])} </Typography><br/>
                                    <div className={styles.boxfilter} >{ chipses.map((el)=>{ return el; })}</div>
                                </Col>
                            );
                        }
                        return (chipsesCols);
                    }) : null
                }
            </Row>
        </div>
      );
  }
}

