import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DataDrivenDoughnutProps {
  data : number | any[],
  labels : number | any[],
  colors : number | any[],
  nbMiddle : number | any[]
}

export default class DataDrivenDoughnut extends React.PureComponent<DataDrivenDoughnutProps> {

  ref : any;

  constructor(props){
    super(props);
    this.ref = null;
  }

  format(nb : number | any[] = this.props.nbMiddle){

    let nbInt : number = nb as number;

    let nbToSubString = "";

    if( nb.toString().length > 5 && nb.toString().length < 7 ){

      nb = Math.ceil(nbInt/ 100);
      nb /= 10;
      nbToSubString = nb.toString().replace(".",",")+" K";

    }else if( nb.toString().length >= 7 ){
      nb = Math.ceil(nbInt / 10000);
      nb /= 100;
      nbToSubString = nbInt.toString().replace(".",",")+" M";

    }else {
      nbToSubString = nbInt.toString();
    }
    return nbToSubString;
  }

  render() {
    return (
      <div>
        <Doughnut
            ref={(reference) => this.ref = reference}
            data={{ datasets : [{
              label: "",
              data : ((this.props.data !== undefined) ? this.props.data : []),
              backgroundColor: this.props.colors
            }], labels: this.props.labels}}
            options={{
              legend: {
                display: false,
              },
              elements: {
                  center: {
                  text: this.format(),
                  color: '#1d1d2c',
                  fontStyle: 'Helvetica'
                }
              },
              maintainAspectRatio: false,
            }}
            plugins={[{
                beforeDraw: (chart, options) => {

                  let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2),
                      centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

                  //Start with a base font of 30px
                  chart.ctx.font = "18px Arial";
                  //Set font settings to draw it correctly.
                  chart.ctx.textAlign = 'center';
                  chart.ctx.textBaseline = 'middle';

                  //Draw text in center
                  chart.ctx.fillText(chart.config.options.elements.center.text, centerX, centerY);

                }
              }]
            }
        />
    </div>
    );
  }
}