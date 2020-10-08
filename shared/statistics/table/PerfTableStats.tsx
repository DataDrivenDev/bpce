import "./styles.module.css";
import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import UserContext from '../../context/User';
import * as Cookies from "js-cookie";

import style from "./styles.module.css";

const { ExportCSVButton } = CSVExport;

interface PerfTableStatsProps {
  data : any,
  app : any
}

export default class PerfTableStats extends React.PureComponent<PerfTableStatsProps> {

  static contextType = UserContext;
  columns : Array<any>;
  firstviewColumns : Array<any>;

  constructor(props) {

    super(props);
    this.columns = [
      {
        dataField: 'site',
        text: 'Sites'
      },
      {
        dataField: 'annonces',
        text: 'Offres publiées'
      },
      {
        dataField: 'views',
        text: 'Consultations',
      },
      {
        dataField: 'nbSiteConsulted',
        text: 'Sites consultés',
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
        text: 'Embauches',
      },
      {
        dataField: 'cvgen',
        text: 'Candidatures indirects',
      },
      {
        dataField: 'hiringgen',
        text: 'Embauches indirectes',
      },
    ];
    this.firstviewColumns = [
      {
        dataField: 'site',
        text: 'Sites'
      },
      {
        dataField: 'annonces',
        text: 'Offres publiées'
      },
      {
        dataField: 'firstview',
        text: 'Première consultation',
      },
      {
        dataField: 'views',
        text: 'Consultations',
      },
      {
        dataField: 'nbSiteConsulted',
        text: 'Sites consultés',
      },
      {
        dataField: 'apply',
        text: 'Candidatures initiées',
      },
      {
        dataField: 'completed',
        text: 'Candidatures finalisée',
      },
      {
        dataField: 'hiring',
        text: 'Embauches',
      },
      {
        dataField: 'cvgen',
        text: 'Candidatures indirectes',
      },
      {
        dataField: 'hiringgen',
        text: 'Embauches indirectes',
      }
    ];
  }

  sort(){

    let nbOfAnnoncePublished = 0,
        line = null,
        i = 0,
        j = 0,
        s = 0,
        views : any = 0,
        firstview : any = 0,
        apply : any = 0,
        applyRate : any = 0,
        completed : any = 0,
        gencompleted : any = 0,
        genhired : any = 0,
        hired : any = 0,
        nbsupportconsulted : any = 0,
        sum = 0,
        obj = {},
        finalArr = [],
        site = "";
        //applyTot = 0;

    for( const prop in this.props.data ){

      //console.log(prop);

      if( this.props.data[prop][0].SupportType !== "Blog" ){

      nbOfAnnoncePublished = 0;
      views = 0;
      firstview = 0;
      apply = 0;
      completed = 0;
      hired = 0;
      gencompleted = 0;
      genhired = 0;
      nbsupportconsulted = 0;
      site = prop.toUpperCase();

      for( i = 0; i < this.props.data[prop].length; i++){
        line = this.props.data[prop][i];
        sum = 0;

        if( Cookies.get('ddoptions') === "1" ){
          for( j = 0; j < line["firstview"].length; j++ ){
            firstview += line["firstview"][j].value;
          }
        }
        for( j = 0; j < line["consultation"].length; j++ ){
          sum += line["consultation"][j].value;
          views += line["consultation"][j].value;
        }
        if( sum >= 0 ){
          nbOfAnnoncePublished++;
        }
        for( j = 0; j < line["apply"].length; j++ ){
          apply += line["apply"][j].value;
        }
        for( j = 0; j < line["completed"].length; j++ ){
          completed += line["completed"][j].value;
        }
        for( j = 0; j < line["hired"].length; j++ ){
          hired += line["hired"][j].value;
        }
        for( j = 0; j < line["gencompleted"].length; j++ ){
          gencompleted += line["gencompleted"][j].value;
        }
        for( j = 0; j < line["genhired"].length; j++ ){
          genhired += line["genhired"][j].value;
        }

      }

      firstview = (firstview === 0 ? "NC" : firstview);
      views = (views === 0 ? "NC" : views);
      apply = (apply === 0 ? "NC" : apply);
      completed = (completed === 0 ? "NC" : completed);
      hired = (hired === 0 ? "NA" : hired);
      gencompleted = (gencompleted === 0 ? "NA" : gencompleted);
      genhired = (genhired === 0 ? "NC" : genhired);

      applyRate = views !== 0 ? ((apply/views) * 100).toString().replace(".",",").substring(0, 4)+" %": "0 %";

      if( s === 0 ) {
        site = "SITE CARRIERE";
      }

      /** By default let put the views to N/A for Indeed */

      /*if( prop === "Indeed" ){
        views = "NA";
      }*/

      obj = {
        site: site,
        annonces: nbOfAnnoncePublished,
        firstview:firstview,
        views: /*s === 0 ? views - applyTot : */views,
        apply: apply,
        applyRate: applyRate,
        completed: completed,
        nbsupconsulted: nbsupportconsulted,
        hiring: hired,
        cvgen : gencompleted,
        hiringgen : genhired
      };
      s++;
      finalArr.push(obj);
     }
    }
    return finalArr;
  }


  render() {

    return(
      <ToolkitProvider
        keyField="site"
        data={ this.sort() }
        columns={ Cookies.get('ddoptions') === "1" ? this.firstviewColumns : this.columns }
        exportCSV
      >
      {
        props => (
          <div>
            <div className={style.ddtable}>
              <BootstrapTable  { ...props.baseProps } bordered={ false } hover striped  noDataIndication="Absence de données"/>
            </div>
            <ExportCSVButton className={style.csvExportBtn} { ...props.csvProps } >Exporter en CSV</ExportCSVButton>
          </div>
        )
      }
      </ToolkitProvider>
    );
  }
}

