import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Row, Col } from 'react-bootstrap';
import Doughnut from '../doughnut/Doughnut';


import style from './sumup.module.css';

interface SumUpProps {
  data : Array<any>,
  app : any,
  info : Array<any>,
  dataBySupport : Array<any>,
  siteCostType : Array<any>
}


export default class SumUp extends React.PureComponent<SumUpProps> {

  nbOfjobOffersOnCareerSite : number;
  nbTotalofViews : number;
  nbTotalofApplies : number;
  nbTotalofAnnonce : number;
  info : any;

  constructor(props){
    super(props);
    this.nbOfjobOffersOnCareerSite = 0;
    this.nbTotalofViews = 0
    this.nbTotalofApplies = 0;
    this.nbTotalofAnnonce = 0;
    this.info = {};
  }

  numberWithSpace(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  retrieveNbOfjobOffersOnCareerSite(){

    let data = this.props.data, i = 0;
    this.nbOfjobOffersOnCareerSite = 0;

    if( data !== undefined ){
      for( i = 0; i < data.length; i++ ){
        if( this.props.siteCostType !== null && data[i].SupportType === "Site Carrière" && this.props.siteCostType[data[i].SupportType] !== 1 ){
          this.nbOfjobOffersOnCareerSite++;
        }
      }
    }
    return this.nbOfjobOffersOnCareerSite;
  }

  retrieveNbOfOn(type,support,option){

    let data = this.props.data, i = 0, m = 0, nb = 0;
  
    if( data !== undefined ){
      for( i = 0; i < data.length; i++ ){
        if( this.props.siteCostType !== null && data[i].SupportType === support && this.props.siteCostType[data[i].SupportType] !== option ){
          for( m = 0; m < data[i][type].length; m++){
            nb += data[i][type][m].value;
          }
        }
      }
    }
    //console.log(nb);

    return nb;
  }

  retrieveNbOfAnnonceBySupport(dataToAnalyse){

    let nbTotal = 0,
        nbTotalOnCarreerSite = 0,
        i = 0,
        values = [],
        labels = [],
        colors = [],
        green = 0,
        blue = 0;

    if( this.props.app.state.equipements[0][1] || this.props.app.state.equipements[1][1] ){

      for( const prop in dataToAnalyse ){
        if( this.props.siteCostType !== null && dataToAnalyse[prop][0].SupportType !== "Site Carrière" && dataToAnalyse[prop][0].SupportType !== "Blog"){
          values.push(dataToAnalyse[prop].length);
          nbTotal += dataToAnalyse[prop].length;
          labels.push(prop);
        }
        if( dataToAnalyse[prop][0].SupportType === "Site Carrière" ){
          nbTotalOnCarreerSite += dataToAnalyse[prop].length;
        }
      }
    }

    /*Let fill the colors array for the Doughnuts*/
    for( i = 0; i < labels.length; i++ ){
      green = 255 - 20*i;
      blue = 255 - 10*i;

      if( this.info !== null && this.info[labels[i].toUpperCase()] !== undefined ){
        colors.push(this.info[labels[i].toUpperCase()]);
      }else{
        colors.push("rgb(0,"+green+","+blue+")");
      }
    }

    this.nbTotalofAnnonce = nbTotalOnCarreerSite;

    return [values,nbTotal,labels,colors];

  }

  retrieveNbOfViewsBySupport(dataToAnalyse) {

    let i = 0,
        j = 0,
        nbTotalOfViews = 0,
        nbTotal = 0,
        values = [],
        supportData = [],
        nbAppliesDivByNbOffPub = 0,
        applies = 0,
        line = null,
        labels = [];

    for( const prop in dataToAnalyse ){

      if( this.props.siteCostType !== null && dataToAnalyse[prop][0].SupportType !== "Site Carrière" && dataToAnalyse[prop][0].SupportType !== "Blog" ){
        labels.push(prop);
        supportData = dataToAnalyse[prop];
        nbAppliesDivByNbOffPub = 0;
        for( i = 0; i < supportData.length; i++ ){
          line = supportData[i];
          for( j = 0; j < line["consultation"].length; j++ ){
            nbAppliesDivByNbOffPub += (line["apply"][j].value / supportData.length);
            nbTotal += (line["apply"][j].value / supportData.length);
          }
        }
        values.push(nbAppliesDivByNbOffPub.toFixed(2));
      }
    }
  
    return [values,nbTotal.toFixed(2),labels];
  }

  retrieveNbOfCandidateBySupport(dataToAnalyse){

    let nbTotal = 0,
        applies = 0,
        nbOfAppliesWithConsult = 0,
        values = [],
        supportData = [],
        labels = [],
        line = null,
        i = 0,
        j = 0 ;

    //console.log(dataToAnalyse);

    for( const prop in dataToAnalyse ){

      if( this.props.siteCostType !== null && dataToAnalyse[prop][0].SupportType !== "Site Carrière" && dataToAnalyse[prop][0].SupportType !== "Blog" ){
        labels.push(prop);
        supportData = dataToAnalyse[prop];
        applies = 0;
      }

      //console.log(prop);

      for( i = 0; i < supportData.length; i++ ){
        line = supportData[i];
        for( j = 0; j < line["apply"].length; j++ ){ 
          applies += line["apply"][j].value;
          nbTotal += line["apply"][j].value;
          if( line["consultation"][j].value !== 0 ){
            nbOfAppliesWithConsult += line["apply"][j].value;
          }
        }
      }
      if( this.props.siteCostType !== null && dataToAnalyse[prop][0].SupportType !== "Site Carrière" && dataToAnalyse[prop][0].SupportType !== "Blog" ){
        values.push(applies);
      }
    }

    //console.log(nbOfAppliesWithConsult);
    
    return [values,nbTotal,labels];
  }

  render() {


      this.info = this.props.info !== null ? this.props.info : {};

      const dataSortedBySupport = this.props.dataBySupport,
          nbOfAnnonceBySupport = this.retrieveNbOfAnnonceBySupport(dataSortedBySupport),
          nbOfViewBySupport = this.retrieveNbOfViewsBySupport(dataSortedBySupport),
          nbOfCandidateBySupport = this.retrieveNbOfCandidateBySupport(dataSortedBySupport);

      /** Nb of apply with consultation divided by the number of views */

      let ratio = this.retrieveNbOfOn("consultation","Site Carrière",1) !== 0 ? this.numberWithSpace((this.retrieveNbOfOn("apply","Site Carrière",1)* 100 /this.retrieveNbOfOn("consultation","Site Carrière",1)).toFixed(2)) : 0;
      
      const firstDghtProps = {
        data : nbOfAnnonceBySupport[0], 
        colors : nbOfAnnonceBySupport[3],
        labels : nbOfAnnonceBySupport[2],
        nbMiddle : nbOfAnnonceBySupport[1]
      },
      secondDghtProps = {
        data: nbOfViewBySupport[0],
        colors: nbOfAnnonceBySupport[3],
        labels : nbOfViewBySupport[2],
        nbMiddle : nbOfViewBySupport[1],
      },
      thirdDghtProps = {
        data : nbOfCandidateBySupport[0],
        colors : nbOfAnnonceBySupport[3],
        labels : nbOfCandidateBySupport[2],
        nbMiddle : nbOfCandidateBySupport[1] 
      }

      //console.log(nbOfAnnonceBySupport);

      return (
      <div>
        <Row className={style.sumupcontainer}>
            <Col xs="12" sm="12" md="4">
              <Row>
                <Col xs="5" sm="5" md="12">
                  <div className={style.numbers}>
                    {this.numberWithSpace(this.retrieveNbOfjobOffersOnCareerSite())}
                  </div>
                </Col>
                <Col xs="7" sm="7" md="12">
                  <Typography className={style.legend}  variant="overline" display="block" gutterBottom>Annonces publiées sur le site carrière</Typography><br/>
                </Col>
              </Row>
            </Col>
            <Col xs="12" sm="12" md="4">
              <Row>
                <Col xs="5" sm="5" md="12">
                  <div className={style.numbers}>
                    {(this.retrieveNbOfjobOffersOnCareerSite() !== 0) ? this.numberWithSpace((this.retrieveNbOfOn("consultation","Site Carrière",1) / this.retrieveNbOfjobOffersOnCareerSite()).toFixed(2))  : 0 }
                  </div>
                </Col>
                <Col xs="7" sm="4" md="12">
                    <Typography className={style.legend} variant="overline" display="block" gutterBottom> consultations/annonces sur le site carrière </Typography>
                </Col>
              </Row>
            </Col>
            <Col xs="12" sm="12" md="4">
            <Row>
              <Col xs="5" sm="5" md="12">
                <div className={style.numbers}>
                  { ratio + " %" }
                </div>
              </Col>
              <Col xs="7" sm="7" md="12">
                <Typography className={style.legend} variant="overline" display="block" gutterBottom>Taux de transformation sur le site carrière</Typography>
              </Col>
            </Row>
            </Col>
          </Row>
          <Row style={{textAlign:"center", padding: "5% 0% 5% 0%"}}>
          <Col xs="12" sm="12" md="4" className={style.doughnutcontainer}>
            {/*<CircurlarProgressBar textColor="#000000" backgroundColor="#FFFFFF" value={0.66}/>*/}
            <Doughnut { ...firstDghtProps }/>
            <Typography className={style.legend}  variant="overline" display="block" gutterBottom>  Offres publiées sur les sites emploi </Typography>
          </Col>
          <Col xs="12" sm="12" md="4" className={style.doughnutcontainer}>
            {/*<CircurlarProgressBar textColor="#000000" backgroundColor="#FFFFFF" value={0.22}/>*/}
            <Doughnut { ...secondDghtProps } />
            <Typography className={style.legend}  variant="overline" display="block" gutterBottom> Candidatures / Annonces publiées sur les sites emploi </Typography>
          </Col>
          <Col xs="12" sm="12" md="4" className={style.doughnutcontainer}>
            {/*<CircurlarProgressBar textColor="#000000" backgroundColor="#FFFAZE" value={ ratio.toString() }/>*/}
            <Doughnut { ...thirdDghtProps } />
            <Typography className={style.legend} variant="overline" display="block" gutterBottom> Candidatures sur les sites emploi</Typography>
           
          </Col>
        </Row>
      </div>
      );
  }
}

