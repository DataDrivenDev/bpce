import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import UserContext from '../../context/User';


import style from "./styles.module.css";

const { ExportCSVButton } = CSVExport;

interface CostTableStatsProps {
  dataBySupportNotFiltered : Array<any>,
  dataByMontAndBySupport : Array<any>,
  app : any,
  siteCostType : Array<any>;
}

const retrieveAnnonceBetwnTwoDate = (sd,ed,data) => {
  let i = 0,
      arr = [],
      time = 0,
      sdTime = 0,
      edTime = 0,
      notSame = false;

  if( data !== undefined && data.length !== 0 ){
    sdTime = ((sd instanceof Date) ? sd.getTime() : new Date(sd).getTime());
    edTime = ((ed instanceof Date) ? ed.getTime() : new Date(ed).getTime());
    notSame = (sd.getTime() !== ed.getTime());

    for(i = 0; i < data.length; i++ ){
      time = new Date(data[i]["DatePublication"]).getTime();
      if(sdTime <= time && time <= edTime && notSame ){
        arr.push(data[i]);
      }
    }
  }
  return arr;
}

export default class CostTableStats extends React.PureComponent<CostTableStatsProps> {

  static contextType = UserContext;
  columns : Array<any>;

  constructor(props) {
    super(props);
    this.columns = [
      {
      dataField: 'site',
      text: 'Site'
      },
      {
      dataField: 'views',
      text: 'Consultation',
      },
      {
      dataField: 'apply',
      text: 'Candidatures initiées',
      },
      {
      dataField: 'completed',
      text: 'Candidatures finalisées',
      },
      {
      dataField: 'hiring',
      text: 'Embauche',
      }
    ]
  }

compute(){

    let displayStartYear = this.props.app.state.mrange.from.year,
        displayStartMonth = this.props.app.state.mrange.from.month,
        displayEndYear = this.props.app.state.mrange.to.year,
        displayEndMonth = this.props.app.state.mrange.to.month,
        intDisplayStartDate = parseInt(displayStartYear+displayStartMonth,10),
        intDisplayEndDate = parseInt(displayEndYear+displayEndMonth,10),
        intCe = 0,
        finalArr = [],
        contracts = this.props.app.state.setofbudjet.length !== 0 ? this.props.app.state.setofbudjet: this.context.subscribtions.subscribtions,
        apiMoneySpend = 0,
        oneDay = 24 * 60 * 60 * 1000,
        contractBegin = null,
        contractEnd = null,
        quantity = 0,
        budgetByDay = 0,
        budget = 0,
        obj = {
          start:"",
          end:"",
          site:"-",
          views:"-",
          apply:"-",
          completed:"-",
          //interview:"-",
          hiring:"-"
        },
        dataNbOfAnnoncePublished = 0,
        views = 0,
        apply = 0,
        completed = 0,
        entretien = 0,
        hired = 0,
        sum = 0,
        k = 0,
        i = 0,
        j = 0,
        b = 0,
        c = 0,
        m = 0,
        contractToAnalyse = [],
        contractToDisplay = [],
        contractsIntoPeriod = [];

      /*console.log(this.props.app.state.setofbudjet);

      console.log(this.context.subscribtions.subscribtions);*/

        /* Loop on all the contracts in order to remove the contracts which are not in the selected client period
           The time gap between the end of the contract and the display end date is computed into the contractToAnalyse array
        */

        if(contracts !== null && contracts.length !== 0){

          for( b = 0; b < contracts.length; b++ ){
            //console.log(new Date(contracts[b].Debut).getTime() !== new Date(contracts[b].Fin).getTime());
            if(new Date(contracts[b].Debut).getTime() < new Date(contracts[b].Fin).getTime() && contracts[b].Montant) {
              contractsIntoPeriod.push(contracts[b]);
            }
          }

          for( i = 0; i < this.props.app.state.serverNames.length; i++ ){
            //console.log(this.props.state.serverNames[i][0].toUpperCase());
            for( c = 0; c < contractsIntoPeriod.length; c++ ) {
              //console.log(contractsIntoPeriod[c].Site.toUpperCase());
              if( contractsIntoPeriod[c].Site.toUpperCase() === this.props.app.state.serverNames[i][0].toUpperCase()){
                let ceDate = new Date(contractsIntoPeriod[c].Fin);
                intCe = parseInt(ceDate.getFullYear().toString() + ceDate.getMonth().toString(),10);
                //console.log(intCe);
                //console.log(intDisplayEndDate);
                contractToAnalyse.push([contractsIntoPeriod[c],Math.abs(intCe - intDisplayEndDate)]);
              }
            }
          }

        //console.log( contractToAnalyse );

        if( contractToAnalyse.length !== 0 ){

          let arrOfTimesAndNames = [], arrOfTimes = [], arrOfValSorted = [];

          /** Let push all the time and support contract name computed into the contractToAnalyse into the arrOfTimesAndNames */

          for( b = 0; b < contractToAnalyse.length; b++ ){
            for( i = 0; i < this.props.app.state.serverNames.length; i++ ){
              if( contractToAnalyse[b] !== undefined && contractToAnalyse[b][0] !== undefined && contractToAnalyse[b][0].Site.toUpperCase() === this.props.app.state.serverNames[i][0].toUpperCase() ){
                arrOfTimesAndNames.push([contractToAnalyse[b][1], this.props.app.state.serverNames[i][0]]);
              }
            }
          }

          /** Let push all the time computed into the contractToAnalyse into the arrOfTimes in order to find the minimum value for a specific support */

          for( i = 0; i < this.props.app.state.serverNames.length; i++ ){
            arrOfTimes = [];
            for( k = 0; k < arrOfTimesAndNames.length; k++ ) {
              if(arrOfTimesAndNames[k][1].toUpperCase() === this.props.app.state.serverNames[i][0].toUpperCase()){
                arrOfTimes.push(arrOfTimesAndNames[k][0]);
              }
            }
            arrOfValSorted.push([Math.min(...arrOfTimes),this.props.app.state.serverNames[i][0]]);
          }

          for( b = 0; b < contractToAnalyse.length; b++ ){
            for(k = 0; k < arrOfValSorted.length; k++){
              if( contractToAnalyse[b][1] === arrOfValSorted[k][0] && arrOfValSorted[k][1].toUpperCase() === contractToAnalyse[b][0].Site.toUpperCase()){
                contractToDisplay.push(contractToAnalyse[b]);
              }
            }
          }
        }
      }

      for( const site in this.props.dataBySupportNotFiltered ){

        //console.log(site);

        /** Let compute the support budget cost of type 1 example : Indeed */
      
        if ( displayStartYear === displayEndYear ){
          for( m = displayStartMonth; m <= displayEndMonth; m++ ){
              if( this.props.siteCostType !== null && this.props.siteCostType[site] === 1 ){
                apiMoneySpend = 0;
                let supportData = this.props.dataByMontAndBySupport[site];
                if( supportData !== undefined ){
                  for( j = 0; j < supportData.length; j++) {
                    let line = supportData[j];
                    for( const property in line ) {
                      if( Array.isArray(line[property]) && property.includes("cost") ){
                       for( i = 0; i < line[property].length; i++ ){
                         apiMoneySpend += line[property][i].value; 
                       }
                     }
                   }
                }
              }
            }
          }
        }else {
          for( m = displayStartMonth; m <= 12; m++ ){
            if( this.props.siteCostType !== null && this.props.siteCostType[site] === 1 ){
              apiMoneySpend = 0;
              let supportData = this.props.dataByMontAndBySupport[site];
              if( supportData !== undefined ){
                for( j = 0; j < supportData.length; j++) {
                  let line = supportData[j];
                  for( const property in line ) {
                    if( Array.isArray(line[property]) && property.includes("cost") ){
                     for( i = 0; i < line[property].length; i++ ){
                      apiMoneySpend += line[property][i].value;
                     }
                   }
                 }
               }
             }
           }
          }
          for( m = 1; m <= displayEndMonth; m++ ){
            if( this.props.siteCostType !== null && this.props.siteCostType[site] === 1 ){
              apiMoneySpend = 0;
              let supportData = this.props.dataByMontAndBySupport[site];
              if( supportData !== undefined ){
                for( j = 0; j < supportData.length; j++) {
                  let line = supportData[j];
                  for( const property in line ) {
                    if( Array.isArray(line[property]) && property.includes("cost") ){
                     for( i = 0; i < line[property].length; i++ ){
                      apiMoneySpend += line[property][i].value;
                     }
                   }
                 }
               }
             }
           }
          }
        }
        
        if( this.props.dataBySupportNotFiltered[site][0].SupportType !== "Site Carrière" ) {

          /* API data */
          if( this.props.siteCostType !== null && this.props.siteCostType[site] === 1 ) {

            let obj = {},
                APIData = this.props.dataByMontAndBySupport[site],
                views = 0,
                apply = 0,
                completed = 0,
                entretien = 0,
                hired = 0;
              
            //console.log(APIData);
            
            if( APIData !== undefined ){
              for( j = 0; j < APIData.length; j++) {

                let line = APIData[j];
                sum = 0;
  
                for(c = 0; c < line["consultation"].length; c++){
                  sum += line["consultation"][c].value;
                  views += line["consultation"][c].value;
                  apply += line["apply"][c].value;
                  completed += line["completed"][c].value;
                  hired += line["hired"][c].value;
                  //entretien += line["entretien"][c].value;
                }
              }
            }

            console.log(apiMoneySpend);
            /*console.log(views);*/

            obj = {
              site:site.toUpperCase(),
              views:(views !== 0 ? (( apiMoneySpend / views ).toFixed(2).toString().replace(".",",") +" €"): "-"),
              apply:(apply !== 0 ? ((( apiMoneySpend / apply )).toFixed(2).toString().replace(".",",") +" €"): "-"),
              completed:(completed !== 0 ? ((( apiMoneySpend / completed )).toFixed(2).toString().replace(".",",") +" €"): "-"),
              //interview:(entretien !== 0 ? ((( apiMoneySpend / hired )).toFixed(2).toString().replace(".",",") +" €"): "-"),
              hiring:(hired !== 0 ? ((( apiMoneySpend / entretien )).toFixed(2).toString().replace(".",",") +" €"): "-"),
            };

            finalArr.push(obj);
          }


          for( b = 0; b < contractToDisplay.length; b++ ) {

            contractBegin = new Date(contractToDisplay[b][0].Debut);
            contractEnd = new Date(contractToDisplay[b][0].Fin);

              let filteredDataForOneSupport = [],
                  dataForOneSupport = [];

              /*console.log(contractToDisplay[b][0]);
              console.log(site.toUpperCase());*/

            if( contractToDisplay[b][0].Site.toUpperCase() === site.toUpperCase() ){

              filteredDataForOneSupport = retrieveAnnonceBetwnTwoDate(contractBegin,contractEnd,this.props.dataByMontAndBySupport[site]);
              dataForOneSupport = retrieveAnnonceBetwnTwoDate(contractBegin,contractEnd,this.props.dataBySupportNotFiltered[site]);
              quantity = -1;
              views = 0;
              apply = 0;
              completed = 0;
              entretien = 0;
              hired = 0;
              sum = 0;

              /** Let computes the contract budget according to the contract subscription */

              if(contractToDisplay[b][0].Quantite !== -1){

                quantity = contractToDisplay[b][0].Quantite !== null ? contractToDisplay[b][0].Quantite : 0;
                budget = contractToDisplay[b][0].Montant !== null ? contractToDisplay[b][0].Montant : 0;

              }else{

                budgetByDay = contractToDisplay[b][0].Montant/(Math.abs(contractBegin.getTime()-contractEnd.getTime())/oneDay);
                budget = ((Math.abs(contractBegin.getTime() - new Date().getTime())/oneDay) * budgetByDay);

                for( j = 0; j < dataForOneSupport.length; j++){

                  let line = dataForOneSupport[j];
                  sum = 0;
                  //console.log(dataForOneSupport[j]);
                  //if( line["consultation"] !== undefined ){
                    for(c = 0; c < line["Ordinateur"]["consultation"].length; c++){
                      sum += line["Ordinateur"]["consultation"][c].value;
                    }
                    for(c = 0; c < line["Mobile"]["consultation"].length; c++){
                      sum += line["Mobile"]["consultation"][c].value;
                    }
                  //}
                  if( sum >= 0 ){
                    dataNbOfAnnoncePublished++;
                  }
                }
              }

              for( j = 0; j < filteredDataForOneSupport.length; j++){
                let line = filteredDataForOneSupport[j];
                sum = 0;
                for(c = 0; c < line["consultation"].length; c++){
                  sum += line["consultation"][c].value;
                  views += line["consultation"][c].value;
                  apply += line["apply"][c].value;
                  completed += line["completed"][c].value;
                  hired += line["hired"][c].value;
                  //entretien += line["entretien"][c].value;
                }
              }

            /** According to the contract subscription */
            let nbAnnonceSinceBeginContract = filteredDataForOneSupport.length;

            
            //console.log(site);
            //console.log(this.props.siteCostType);
           /*console.log(budget);
            console.log(quantity);
            console.log(nbAnnonceSinceBeginContract);*/

            quantity = quantity === 0 ? 1 : quantity; 

            if( quantity !== -1 ){

              /*console.log(site);
              console.log("nb annonce filtered since begin contract ==>" + nbAnnonceSinceBeginContract);
              console.log("montant ==>" + budget);
              console.log("quantité ==>" + quantity);
              console.log("vues ==>" + views);
              console.log("apply ==>" + apply);*/

              obj = {
                start:contractBegin,
                end:contractEnd,
                site:site.toUpperCase(),
                views:(views !== 0 ? (((nbAnnonceSinceBeginContract * budget)/(quantity * views)).toFixed(2).toString().replace(".",",") +" €") : "-"),
                apply:(apply !== 0 ? (((nbAnnonceSinceBeginContract * budget)/(quantity * apply)).toFixed(2).toString().replace(".",",") +" €") : "-"),
                completed:(completed !== 0 ? (((nbAnnonceSinceBeginContract * budget)/(quantity * completed)).toFixed(2).toString().replace(".",",") +" €") : "-"),
                //interview:(entretien !== 0 ? (((nbAnnonceSinceBeginContract * budget)/(quantity * entretien)).toFixed(2).toString().replace(".",",") +" €") : "-"),
                hiring:(hired !== 0 ? (((nbAnnonceSinceBeginContract * budget)/(quantity * hired)).toFixed(2).toString().replace(".",",") +" €") : "-"),
              };

              }else {

                /*console.log(site);
                console.log("nb annonce not filtered since begin contract ==>" + dataNbOfAnnoncePublished );
                console.log("annonce filtered since begin contract ==>" + nbAnnonceSinceBeginContract );
                console.log("budget ==>" + budget);
                console.log("vues ==>" + views);
                console.log("apply ==>" + apply);
                console.log("entretien ==>" + entretien);
                console.log("completed ==>" + completed);
                console.log("hired ==>" + hired);*/

              obj = {
                start:contractBegin,
                end:contractEnd,
                site:site.toUpperCase(),
                views:(views !== 0 ? (((budget * nbAnnonceSinceBeginContract) /(views * dataNbOfAnnoncePublished)).toFixed(2).toString().replace(".",",") +" €"): "-"),
                apply:(apply !== 0 ? (((budget * nbAnnonceSinceBeginContract) /(apply * dataNbOfAnnoncePublished)).toFixed(2).toString().replace(".",",") +" €"): "-"),
                completed:(completed !== 0 ? (((budget * nbAnnonceSinceBeginContract) /(completed * dataNbOfAnnoncePublished)).toFixed(2).toString().replace(".",",") +" €"): "-"),
                //interview:(entretien !== 0 ? (((budget * nbAnnonceSinceBeginContract) /(entretien * dataNbOfAnnoncePublished)).toFixed(2).toString().replace(".",",") +" €"): "-"),
                hiring:(hired !== 0 ? (((budget * nbAnnonceSinceBeginContract) /(hired * dataNbOfAnnoncePublished)).toFixed(2).toString().replace(".",",") +" €"): "-"),
                };
              }
              //console.log(obj)
              finalArr.push(obj);
            }
          }
        }
      }
    return finalArr;
  }

  render() {
    return(
      <div>
          <ToolkitProvider
            keyField="site"
            data={ this.compute() }
            columns={ this.columns }
            exportCSV
          >
          {
            props => (
              <div>
                <div className={style.ddtable}>
                  <BootstrapTable  keyField="site" { ...props.baseProps } bordered={ false } hover striped  noDataIndication="Absence de données"/>
                </div>
                <ExportCSVButton className={style.csvExportBtn} { ...props.csvProps } >Exporter en CSV </ExportCSVButton>
              </div>
            )
          }
          </ToolkitProvider>
      </div>
    );
  }
}