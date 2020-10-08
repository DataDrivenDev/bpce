import  React, {Component} from 'react';
import { HorizontalBar } from 'react-chartjs-2';

interface BarChartBySelectionProps {
  dashboard?: any,
  drawer?: any,
  selectedDataType?: string,
  data?: Array<any>,
  info?: Array<any>,
  selectedFilter :  string
}

export default class BarChartBySelection extends React.PureComponent<BarChartBySelectionProps> {

  options : any;
  info : any;

  constructor(props) {
    super(props);
    this.options = {
      maintainAspectRatio:false,
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

  findSelectedFilter(){
    let i = 0, filters = this.props.drawer.state.filters, fl = filters.length, fil = null, sfilter = this.props.selectedFilter;

    for(i = 0; i < fl; i++){
      fil = filters[i];
      if(fil[0] === sfilter){
        return fil[1];
      }
    }
  }

  findLabels(filters) {
    let labels = [], i = 0;
    if(filters){
      for( i = 0; i < filters.length; i++ ){
        if(filters[i]){
          labels.push(filters[i][0]);
        }
      }
    }
    return labels;
  }

  generateDataset ( filters, annoncePublishedBySupport ){

    let datasets = [], i = 0, j = 0, filledData = this.fill(filters), fdata = null, values = [], sum = 0, green = 0, blue = 0, subData = null, sl = 0, subAnnoncePublishedBySupport = null;

    for( i = 0; i < filledData.length; i++ ){
      fdata = filledData[i];
      subData = fdata.data;
      sl = subData.length;
      sum = 0;
      values = [];

      if( this.props.selectedDataType === "nbofjobofferpublished" ){
        for( j = 0; j < sl; j++ ){
          values.push( subData[j].value );
        }
      } else {
        subAnnoncePublishedBySupport = annoncePublishedBySupport[i].data;
        for( j = 0; j < sl; j++ ){
          values.push(subAnnoncePublishedBySupport[j].value !== 0 ? (Math.trunc((subData[j].value/subAnnoncePublishedBySupport[j].value) *100)/100) : 0);
        }
      }

      for( j = 0; j < values.length; j++ ){
        sum += values[j];
      }
      if( sum !== 0 ){
        green = 255 - 10*i;
        blue = 255 - 2*i;
        datasets.push({ key: i, label: filledData[i].support, data:values,backgroundColor:this.info[fdata.support.toUpperCase()] !== undefined ? this.info[fdata.support.toUpperCase()] : "rgb(0,"+green+","+blue+")" });
      }
      //console.log(values);
    }
    return datasets;
  }

  retrieveNbOfAnnoncePublished( filters ){

    let data = this.props.data, prop = "", subProp = "", s = 0, i = 0, k = 0, d = 0, res = [], sum = 0, dt = "consultation",
        flt = null, dp = null, dpsub = null, dpsubc = null, sn = this.props.drawer.state.serverNames;

    if( filters !== undefined ){

      let fl = filters.length, dpsubl = 0, dpsubcl = 0;

      for( s = 0; s < sn.length; s++ ) {
        res.push({ support: sn[s][0], data : [] });
        for( i = 0; i < fl; i++){
          flt = filters[i][0];
          res[s].data.push({ filter : flt, value : 0 });
            for( prop in data ) {
              if( flt === prop ){
                dp = data[prop];
                for( subProp in dp ){
                  if(sn[s][0] === subProp ){
                    dpsub = dp[subProp];
                    dpsubl = dpsub.length;
                    for( k = 0; k < dpsubl; k++ ){
                      dpsubc = dpsub[k][dt];
                      dpsubcl = dpsubc.length;
                      sum = 0
                      for(d = 0; d < dpsubcl; d++ ){
                        sum += dpsubc[d].value;
                      }
                      if( sum > 0 ){
                        res[s].data[i].value++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }
    return res;
  }

  fill( filters ){

    let data = this.props.data, prop = "", subProp = "", s = 0, i = 0, k = 0, d = 0, res = [], dt = this.props.selectedDataType,
        flt = null, dp = null, dpsub = null, dpsubs = null, sn = this.props.drawer.state.serverNames;

    if( filters !== undefined ){

      if(this.props.selectedDataType === "nbofjobofferpublished"){
        res = this.retrieveNbOfAnnoncePublished(filters);
      }else {
        let fl = filters.length, dpsubl = 0, dpsubsl = 0;
        for( s = 0; s < sn.length; s++ ) {
          res.push({ support: sn[s][0], data : [] });
          for( i = 0; i < fl; i++){
            flt = filters[i][0];
            res[s].data.push({ filter : flt, value : 0 });
            for( prop in data ) {
              dp = data[prop];
              if( flt === prop ){
                for( subProp in dp ){
                  if(sn[s][0] === subProp ){
                    dpsub = dp[subProp];
                    dpsubl = dpsub.length;
                    for( k = 0; k < dpsubl; k++ ){
                      dpsubs = dpsub[k][dt];
                      dpsubsl = dpsubs.length;
                      for(d = 0; d < dpsubsl; d++ ){
                        res[s].data[i].value += dpsubs[d].value;
                      }
                    }
                  }
                }
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

    let filters = this.findSelectedFilter(),
        labels = this.findLabels(filters),
        annoncePublishedBySupport =  this.props.selectedDataType === "nbofjobofferpublished" ? [] : this.retrieveNbOfAnnoncePublished(filters),
        datasets = this.generateDataset(filters, annoncePublishedBySupport),
        l = labels.length * 100 /** datasets.length * 30;*/

    let data = {
       labels: labels,
       datasets : datasets
    };

    //console.log(l);

    return  (labels.length !== 0 && datasets.length !== 0) ? <HorizontalBar data={data} width={100} height={ 800 } options={this.options}/> : null;
  }
}