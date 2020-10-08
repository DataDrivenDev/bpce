import  React, { Component } from 'react';
import { HorizontalBar } from 'react-chartjs-2';

interface BarChartByCompanyProps {
  dashboard?: any;
  drawer?: any;
  selectedDataType?: string;
  selectedCompany?:string;
  data?: Array<any>;
  info?: Array<any>;
}

export default class BarChartByCompany extends React.PureComponent<BarChartByCompanyProps> {

  options : any;
  info : any;

  constructor(props) {

    super(props);
    this.options = {
      legend: {
        display: false,
      },
      scales: {
          xAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }],
          yAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }   
          }]
      },
      maintainAspectRatio:false,
      tooltips: {
        mode: 'label'
      },
      elements: {
        line: {
          fill: false
        }
      }
   };
   this.info = {};
  }

  generateData( annoncePublishedBySupport ){

    let i = 0, labels = [], colors = [], values = [];

    for( i = 0; i < annoncePublishedBySupport.length; i++ ){
      labels.push(annoncePublishedBySupport[i].support);
      values.push(annoncePublishedBySupport[i].value);
      colors.push(this.info[annoncePublishedBySupport[i].support.toUpperCase()]);
    }

    return [labels, [this.props.dashboard.formatDataType(this.props.selectedDataType).toLowerCase(),values], colors];
  }

  fill(){

    let data = this.props.data, prop = "", s = 0, i = 0, d = 0, res = [], sum = 0, ds = this.props.selectedDataType,
        dp = null, dpsub = null, sn = this.props.drawer.state.serverNames, dpsubl = 0;
    
        console.log(ds);

    for( s = 0; s < sn.length; s++ ) {
        res.push({ support : sn[s][0], value : 0 });
        for( prop in data ) {
        if(prop === sn[s][0]){
            dp = data[prop];
            for( i = 0; i < dp.length; i++ ){
            if(dp[i]["Societe"].toUpperCase() === this.props.selectedCompany ){
                dpsub = dp[i][ds];
                dpsubl = dpsub !== undefined ? dpsub.length : 0;
                for(d = 0; d < dpsubl; d++ ){
                res[s].value += dpsub[d].value;
                }
            }
            }
        }
        }
    }
      
    return res;
  }

  render() {
    this.info = this.props.info !== null ? this.props.info : {};
    let annoncePublishedBySupport = this.fill(),
        d = this.generateData(annoncePublishedBySupport),
        l = d[0].length * 50,
        datasets = [{ label:d[1][0], data:d[1][1], backgroundColor:d[2] }];

    let data = {
      labels: d[0],
      datasets : [{ label:d[1][0], data:d[1][1], backgroundColor:d[2] }]
    };
    return  l !== 0 ? <HorizontalBar data={data} width={100} height={500} options={this.options}/> : null;
  }
}