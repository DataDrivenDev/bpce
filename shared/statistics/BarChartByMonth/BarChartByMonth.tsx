import  React, {Component} from 'react';
import { HorizontalBar } from 'react-chartjs-2';


interface BarChartByMonthProps {
  drawer?: any;
  data?: Array<any>;
  selectedDataType?: string;
  filters?: Array<any>;
  selectedFilter?: Array<any>;
  info : Array<any>;
}

export default class BarChartByMonth extends React.PureComponent<BarChartByMonthProps> {

  dateLabel: Array<String>
  options : any;
  colors : any;
  dateLabelSelected : any;

  constructor(props) {

    super(props);

    this.dateLabel = ["none","Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
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
    };
    this.colors = {};
    this.dateLabelSelected = [];
  }

  findSelectedFilter(){
    let i = 0, filters = this.props.filters, fl = filters.length, fil = null, sfilter = this.props.selectedFilter;

    for(i = 0; i < fl; i++){
      fil = filters[i];
      if(fil[0] === sfilter){
        return fil[1];
      }
    }
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
                    dateLabel.push(selectedBeginYear+" 0"+i);
                }else {
                    numericDateLabel.push(selectedBeginYear+""+i);
                    dateLabel.push(selectedBeginYear+" "+i);
                }
            }
        }
    }else {
        for( i = 1; i <= 12; i++ ){
            if(i >= selectedBeginMonth){
                if( i < nl ){
                    numericDateLabel.push(selectedBeginYear+"0"+i);
                    dateLabel.push(selectedBeginYear+" 0"+i);
                }else {
                    numericDateLabel.push(selectedBeginYear+""+i);
                    dateLabel.push(selectedBeginYear+" "+i);
                }
            }
        }
        for( i = 1; i <= selectedEndMonth; i++ ){
            if( i < nl ){
                numericDateLabel.push(selectedEndMonth+"0"+i);
                dateLabel.push(selectedEndMonth+" 0"+i);
            }else {
                numericDateLabel.push(selectedEndMonth +""+i);
                dateLabel.push(selectedEndMonth +" "+i);
            }
        }
    }
    this.dateLabelSelected = numericDateLabel;
    return dateLabel;
  }

  generateDataset( filter, annoncePublishedByMonth ){

    let datasets = [], i = 0, j = 0, filledData = this.fill(filter), fdata = null, values = [], sum = 0, green = 0, blue = 0, subData = null, sl = 0, subAnnoncePublishedByMonth = null;

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
        subAnnoncePublishedByMonth = annoncePublishedByMonth[i].data;
        for( j = 0; j < sl; j++ ){
          values.push((subAnnoncePublishedByMonth[j] !== undefined && subAnnoncePublishedByMonth[j].value !== 0) ? (Math.trunc((subData[j].value/subAnnoncePublishedByMonth[j].value) *100)/100) : 0);
        }
      }

      for( j = 0; j < values.length; j++ ){
          sum += values[j];
      }

      if( sum !== 0 ){
        green = 255 - 10*i;
        blue = 255 - 2*i;
        datasets.push({ key: i, label:fdata.filter,data:values,backgroundColor:this.colors[fdata.filter.toUpperCase()] !== undefined ? this.colors[fdata.filter.toUpperCase()] : "rgb(0,"+green+","+blue+")" });
      }
      //console.log(values);
    }
    return datasets;
  }

  retrieveNbOfAnnoncePublished( filter ){

    let prop = "", i = 0, j = 0, k = 0, d = 0, res = [], sum = 0, dt = "consultation",
        flt = null, dls = null, dp = null, dpc = null;

    if( filter !== undefined ){

      let fl = filter.length, dlsl = this.dateLabelSelected.length, dpl = 0, dpcl = 0;

      for( i = 0; i < fl; i++){
        flt = filter[i][0];
        res.push({ filter : flt, data : []});
        //if( this.dateLabelSelected !== undefined ){
          for(d = 0; d < dlsl ; d++){
            dls = this.dateLabelSelected[d];
            res[i].data.push({ month: dls, value : 0});
            for( prop in this.props.data ) {
              dp = this.props.data[prop];
              dpl = dp.length;
              if( flt === prop ){
                for( j = 0; j < dpl; j++ ){
                  dpc = dp[j][dt];
                  dpcl = dpc.length;
                  sum = 0
                  for( k = 0; k < dpcl; k++ ){
                    if(dls === dpc[k].date && dpc[k].value !== 0){
                      sum += dpc[k].value;
                      break;
                    }
                  }
                  if( sum > 0 ){
                    res[i].data[d].value++;
                  }
                }
              }
            }
          }
        //}
      }
    }
    return res;
  }

  fill( filter ) {

    let prop = "", d = 0, i = 0, j = 0, k = 0, res = [], dt = this.props.selectedDataType,
        flt = null, dls = null, dp = null, dps = null;

    if( filter !== undefined ){

      let fl = filter.length, dlsl = this.dateLabelSelected.length, dpl = 0, dpsl = 0;

      if(dt === "nbofjobofferpublished"){
        res = this.retrieveNbOfAnnoncePublished(filter);
      }else {
        for( i = 0; i < fl; i++){
          flt = filter[i][0];
          res.push({ filter : flt, data : []});
          //if( this.dateLabelSelected !== undefined ){
            for(d = 0; d < dlsl ; d++){
              dls = this.dateLabelSelected[d];
              res[i].data.push({ month: dls, value : 0});
              for( prop in this.props.data ) {
                dp = this.props.data[prop];
                dpl = dp.length;
                if( flt === prop ){
                  for( j = 0; j < dpl; j++ ){
                    dps = dp[j][dt];
                    if( dps !== undefined ){
                      dpsl = dps.length;
                      for( k = 0; k < dpsl; k++ ){
                        if(dls === dps[k].date){
                          res[i].data[d].value += dps[k].value;
                        }
                      }
                    }
                  }
                }
              }
            }
          //}
        }
      }
    }
    return res;
  }

  render() {

    this.colors = this.props.info !== null ? this.props.info : {};

    let filter = this.findSelectedFilter(),
        labels = this.findDateLabel(),
        annoncePublishedByMonth = this.retrieveNbOfAnnoncePublished(filter);

    let data = {
       labels: labels,
       datasets : this.generateDataset(filter, annoncePublishedByMonth)
    };

    return  labels.length !== 0 ? <HorizontalBar data={data} width={100} height={labels.length * 50} options={this.options}/> : null;
  }
}