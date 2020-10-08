import  React, {Component} from 'react';
import { HorizontalBar } from 'react-chartjs-2';

interface ByMonthChartProps {
    dashboard?: any;
    drawer?: any;
    selectedDataType?: string;
    data?: Array<any>;
    info?: Array<any>;
  }

export default class ByMonthChart extends React.PureComponent<ByMonthChartProps> {

  dateLabelSelected : Array<any>;
  options :any;
  colors : any;

  constructor(props) {

    super(props);
    this.dateLabelSelected = [];
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
   this.colors = {};
  }

  findDateLabel(){

    let selectedBeginMonth = this.props.drawer.state.mrange.from.month,
        selectedEndMonth   = this.props.drawer.state.mrange.to.month,
        selectedBeginYear  = this.props.drawer.state.mrange.from.year,
        selectedEndYear  = this.props.drawer.state.mrange.to.year,
        nl = 10,
        i = 0,
        dateLabel = [],
        numericDateLabel = [];

    if( selectedBeginYear === selectedEndYear ){
        for( i = 1; i <= 12; i++ ){
            if(i >= selectedBeginMonth && i <= selectedEndMonth){
                if( i < nl ){
                    numericDateLabel.push(selectedBeginYear+"0"+i);
                    dateLabel.push("0"+ i +"/"+ selectedBeginYear);
                }else {
                    numericDateLabel.push(selectedBeginYear+""+i);
                    dateLabel.push(i+"/"+ selectedBeginYear);
                }
            }
        }
    }else {
        for( i = 1; i <= 12; i++ ){
            if(i >= selectedBeginMonth){
                if( i < nl ){
                    numericDateLabel.push(selectedBeginYear+"0"+i);
                    dateLabel.push("0" + i + "/"+selectedBeginYear);
                }else {
                    numericDateLabel.push(selectedBeginYear+""+i);
                    dateLabel.push(i+"/"+selectedBeginYear);
                }
            }
        }
        for( i = 1; i <= selectedEndMonth; i++ ){
            if( i < nl ){
                numericDateLabel.push(selectedEndYear+"0"+i);
                dateLabel.push("0" + i + "/"+selectedEndYear );
            }else {
                numericDateLabel.push(selectedEndYear +""+i);
                dateLabel.push(i +"/"+ selectedEndYear );
            }
        }
    }
    this.dateLabelSelected = numericDateLabel;
    return dateLabel;
  }

  generateData( fillteredData ){

    let i = 0, labels = [], colors = [], values = [], green = 0, blue = 0, color = null;

    for( i = 0; i < fillteredData.length; i++ ) {

      green = 255 - 10*i;
      blue = 255 - 2*i;
      color = "rgb(0,"+green+","+blue+")";
      labels.push(fillteredData[i].month);
      values.push(fillteredData[i].value);
      colors.push(color);

    }

    //console.log([labels, [this.props.dashboard.formatDataType(this.props.selectedDataType).toLowerCase(),values], colors]);

    return [labels, [this.props.dashboard.formatDataType(this.props.selectedDataType).toLowerCase(),values], colors];
  }

  filter(){

    let prop = "", i = 0, j = 0, d = 0, res = [], ds = this.props.selectedDataType,
        dp = null, dpl = 0, k = 0, dpsub = null, dates = this.dateLabelSelected, dpsubl = 0, dls = null;

    if(ds === "nbofjobofferpublished"){
        for( d = 0; d < dates.length; d++ ) {
            dls = this.dateLabelSelected[d];
            res.push({ month : dates[d], value : 0 });
            for( prop in this.props.data ) {
                dp = this.props.data[prop];
                dpl = dp.length;
                for( k = 0; k < dpl; k++ ){
                    dpsub = dp[k]["consultation"];
                    dpsubl = dpsub.length;
                    for( j = 0; j < dpsubl; j++ ){
                        if(dls === dpsub[j].date && dpsub[j].value !== 0){
                            res[d].value++;
                            break;
                        }
                    }
                }  
            }
        }
    }else {
        for( d = 0; d < dates.length; d++ ) {
            dls = this.dateLabelSelected[d];
            res.push({ month : dates[d], value : 0 });
            for( prop in this.props.data ) {
                dp = this.props.data[prop];
                dpl = dp.length;
                for( k = 0; k < dpl; k++ ){
                    dpsub = dp[k][ds];
                    dpsubl = dpsub.length;
                    for( j = 0; j < dpsubl; j++ ){
                        if(parseInt(dls,10) === parseInt(dpsub[j].date,10) && dpsub[j].value !== 0){
                            res[d].value += dpsub[j].value;
                        }
                    }
                }  
            }
        }
        for( d = 0; d < dates.length; d++ ) {
            dls = this.dateLabelSelected[d];
            res.push({ month : dates[d], value : 0 });
            for( prop in this.props.data ) {
                dp = this.props.data[prop];
                dpl = dp.length;
                for( i = 0; i < dpl; i++ ){
                    dpsub = dp[i][ds];
                    dpsubl = dpsub.length;
                    for(k = 0; k < dpsubl; k++ ){
                        //console.log(dpsubl[k].date);
                        if(dls === dpsubl[k].date ){
                            res[d].value += dpsub[k].value;
                        }
                    }
                }
                
            }
        }
    }
    return res;
  }

  render() {

    let labels = this.findDateLabel(),
        fillteredData = this.filter(),
        dg   = this.generateData(fillteredData),
        data = {
            labels: labels,
            datasets : [{ label:dg[1][0], data:dg[1][1], backgroundColor:dg[2] }]
        };

    return  labels.length !== 0 ? <HorizontalBar data={data} width={100} height={500} options={this.options}/> : null;
  }
}