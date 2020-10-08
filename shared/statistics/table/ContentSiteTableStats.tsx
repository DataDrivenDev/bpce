import "./styles.module.css";
import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import UserContext from '../../context/User';
import * as Cookies from "js-cookie";

import style from "./styles.module.css";

const { ExportCSVButton } = CSVExport;

interface ContentSiteTableStatsProps {
  data : any,
  app : any,
}

export default class ContentSiteTableStats extends React.PureComponent<ContentSiteTableStatsProps> {

  static contextType = UserContext;
         columns : Array<any>;
         firstviewColumns : Array<any>;

  constructor(props) {

    super(props);
    this.columns = [
      {
        dataField: 'site',
        text: 'Sites de contenu'
      },
      {
        dataField: 'views',
        text: 'Consultations',
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
        text: 'Candidatures indirectes',
      },
      {
        dataField: 'hiringgen',
        text: 'Embauches indirectes',
      }
    ];
    this.firstviewColumns = [
        {
          dataField: 'site',
          text: 'Sites de contenu'
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
          dataField: 'cvgen',
          text: 'Candidatures générées',
        },
        {
          dataField: 'hiringgen',
          text: 'Embauches générées',
        }
      ];
  }

  sort(){

    let nbOfAnnoncePublished = 0,
        line = null,
        i = 0,
        j = 0,
        s = 0,
        views = 0,
        firstview = 0,
        apply = 0,
        applyRate = "",
        completed = 0,
        entretien = 0,
        gencompleted = 0,
        genentretien = 0,
        genhired = 0,
        hired = 0,
        sum = 0,
        obj = {},
        finalArr = [],
        site = "";
        //applyTot = 0;

    for( const prop in this.props.data ){

      if( this.props.data[prop][0].SupportType === "Blog" ){

      nbOfAnnoncePublished = 0;
      views = 0;
      firstview = 0;
      apply = 0;
      completed = 0;
      entretien = 0;
      hired = 0;
      gencompleted = 0;
      genentretien = 0;
      genhired = 0;
      site = prop.toUpperCase();

      for( i = 0; i < this.props.data[prop].length; i++) {
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
        if( sum > 0 ){
          nbOfAnnoncePublished++;
        }
        for( j = 0; j < line["apply"].length; j++ ){
          apply += line["apply"][j].value;
        }
        for( j = 0; j < line["completed"].length; j++ ){
          completed += line["completed"][j].value;
        }
        /*for( j = 0; j < line["entretien"].length; j++ ){
          entretien += line["entretien"][j].value;
        }*/
        for( j = 0; j < line["hired"].length; j++ ){
          hired += line["hired"][j].value;
        }
        for( j = 0; j < line["gencompleted"].length; j++ ){
          gencompleted += line["gencompleted"][j].value;
        }
        /*for( j = 0; j < line["genentretien"].length; j++ ){
          genentretien += line["genentretien"][j].value;
        }*/
        for( j = 0; j < line["genhired"].length; j++ ){
          genhired += line["genhired"][j].value;
        }
      }

      applyRate = views !== 0 ? ((apply/views) * 100).toString().replace(".",",").substring(0, 4)+" %": "0 %";

      obj = {
        site: site,
        annonces: nbOfAnnoncePublished,
        firstview:firstview,
        views: /*s === 0 ? views - applyTot : */views,
        apply: apply,
        applyRate: applyRate,
        completed: completed,
        interview: entretien,
        hiring: hired,
        cvgen : gencompleted,
        interviewgen : genentretien,
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

