import React from 'react';
import NavBar from '../../shared/navbar/navbar';
import Statistics from '../../shared/statistics/statistics';
import UserContext from '../../shared/context/User';
import StatsLibrary from '../../shared/stats/sort_data';
import Spinner  from '../../shared/spinner/spinner';
import SideNavBar from '../../shared/sidenavbar/sidenavbar';
import Subscriptions from '../../services/subscriptions/services';
import StatisticsService from '../../services/statistics/services';


import * as Cookies from "js-cookie";

import styles from "./Styles.module.css";

interface DrawerProps {
  history : any,
  router : any
}

interface DrawerState {
      drawerToggled: boolean,
      filterStatuses:Array<any>,
      filters:Array<any>,
      serverNames:Array<any>,
      labels:Array<any>,
      regions:Array<any>,
      departements:Array<any>,
      companies:Array<any>,
      countries:Array<any>,
      equipements:Array<any>,
      mrange: any,
      functions:Array<any>,
      sectors:Array<any>,
      levels:Array<any>,
      experiences:Array<any>,
      regAndDep:Array<any>,
      setofbudjet:Array<any>,
      setofdata:Array<any>,
      dataSortedByEquipements:Array<any>,
      allLocation:boolean,
      allCompanies:boolean,
      refKeyWord:string,
      titleKeyWord:string,
      isLoading:boolean
}


export default class Drawer extends React.Component<DrawerProps, DrawerState> {

  static contextType = UserContext;


  statsLibrary: any;
  subscriptionService: any;

  constructor(props) {
    super(props);
    this.state = {
      drawerToggled:false,
      filterStatuses:[],
      filters:[],
      serverNames:[],
      labels:[],
      regions:[],
      departements:[],
      companies:[],
      countries:[],
      equipements:[["Mobile",true],["Ordinateur",true]],
      mrange: {from: {year: new Date().getFullYear() - 1, month: new Date().getMonth() + 1 }, to: {year: new Date().getFullYear(), month: new Date().getMonth() + 1 }},
      functions:[],
      sectors:[],
      levels:[],
      experiences:[],
      regAndDep:[],
      setofbudjet:[],
      setofdata:[],
      dataSortedByEquipements : [],
      allLocation:true,
      allCompanies:true,
      refKeyWord:"",
      titleKeyWord:"",
      isLoading:true
    };
    this.statsLibrary = new StatsLibrary();
    this.subscriptionService = new Subscriptions();
    this.toggleAllLocationsBtn = this.toggleAllLocationsBtn.bind(this);
    this.toggleAllCompanies = this.toggleAllCompanies.bind(this);
    this.changeTitleKeyWord = this.changeTitleKeyWord.bind(this);
    this.changeRefKeyWord = this.changeRefKeyWord.bind(this);
  }


  async componentDidMount() {
    await this.retrieveData();
  }

  retrieveData = async () => {

    if( this.context.setofdata.length === 0 ){

    let statService = new StatisticsService(),
        clientKey = await this.context.userShouldBeChecked(),
        clientName = this.context.clientName ? this.context.clientName : ( Cookies.get('ddclientname') !== undefined ? Cookies.get('ddclientname') : "");
      
      await this.subscriptionService.retrieveSubscriptionsOnAir(clientKey,{from:this.state.mrange.from, to:this.state.mrange.to}).then((res) => { 
        this.setState({ setofbudjet: res }); 
        this.context.setSubscription({ subscribtions : res });
      });

      await statService.askForData(clientKey, clientName, statService.getStatisticsEndPoint(),{from:this.state.mrange.from, to:this.state.mrange.to}).then((res) => {
        // Set the overall data into the state
        this.setState({ setofdata: res, isLoading: false });
        this.context.setData(res);
        console.log(res);
        // Sort the data and fill the navigators type array in the state
        this.generateFilterData(((this.state.equipements !== undefined && this.state.equipements.length !== 0) ? this.statsLibrary.sortByEquipment(res, this.state.equipements) : []));

        }).catch((error)=>{
        this.setState({ setofdata: [], isLoading: false });
      });

      /*await statService.askForData(clientKey, clientName, statService.getStatisticsEndPoint()).then((res) => {
        // Set the overall data into the state
        this.setState({ setofdata: res, isLoading: false });
        this.context.setData(res);
        // Sort the data and fill the navigators type array in the state
        this.generateFilterData(((this.state.equipements !== undefined && this.state.equipements.length !== 0) ? this.statsLibrary.sortByEquipment(res, this.state.equipements) : []));

        }).catch((error)=>{
        this.setState({ setofdata: [], isLoading: false });
      });*/
    }

    if(this.context.setofdata.length !== 0 && this.state.setofdata.length === 0){
      /*console.log(this.state.filters);
      console.log(this.context.filters);*/
      this.setState({ setofdata: this.context.setofdata}, () => {
        this.setState({ 
          dataSortedByEquipements : this.context.filters.dataSortedByEquipements,
          labels: this.context.filters.labels,
          serverNames : this.context.filters.serverNames,
          companies : this.context.filters.companies,
          countries : this.context.filters.countries,
          functions : this.context.filters.functions,
          regions : this.context.filters.regions,
          regAndDep : this.context.filters.regAndDep,
          departements : this.context.filters.departements,
          filterStatuses : this.context.filters.filterStatuses,
          filters : this.context.filters.filters,
          isLoading: false
        });
      });
      //console.log(this.state.labels);
    }
  }

  refreshSetOfData = async () => {
    this.context.setData([]);
    this.context.setFilters({});
    this.setState({ setofdata: [] , isLoading: true }, async () => {
      await this.retrieveData();
    });
  }


  generateFilterData( arrSortedByEquipements ){

    let   dataBetweenTwoMonths = (arrSortedByEquipements.length !== 0 ? this.statsLibrary.sortByDate(arrSortedByEquipements, this.state.mrange.from, this.state.mrange.to) : []),
          arrOfCompanies = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Societe"),
          arrOfCountries = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Country"),
          arrOfFunctions = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Fonction"),
          /*arrOfSectors = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Secteur"),
          arrOfLevels = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Niveau"),
          arrOfExperiences = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Experience"),*/
          arrSerName = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"Support"),
          depFilterStatusArr = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"DepartNom"),
          regFilterStatusArr = this.statsLibrary.sortByProperty(dataBetweenTwoMonths,"RegionNom"),
          arrOfLocation = this.statsLibrary.sortByLocation(dataBetweenTwoMonths,"RegionNom","DepartNom"),
          companies = [],
          countries = [],
          equipmnts = [],
          functions = [],
          /*sectors = [],
          levels = [],
          experiences = [],*/
          sites = [],
          regions = [],
          deps = [],
          labels = [],
          i = 0,
          j = 0;

        
      //let locationFilteredData = this.statsLibrary.groupByLocationForFilter(dataBetweenTwoMonths);
      
      //console.log(locationFilteredData);

      let arrStatuses = [depFilterStatusArr,regFilterStatusArr,arrOfCompanies,arrOfCountries,arrOfFunctions,arrSerName].flat(), filterStatuses = [];

      for( i = 0; i < arrStatuses.length; i++ ){
        if( arrStatuses[i] !== "" && arrStatuses[i] !== null ){
          filterStatuses.push({filter:arrStatuses[i]});
        }
      }

      let objFilterStatuses = filterStatuses.reduce( (acc, obj) => {
          let cle = obj["filter"];
          if(cle !== null && cle !== ""){
            if(!acc[cle]) {
              acc[cle] = 0;
            }
          }
          return acc;
      }, {});

      //Let's initialize the companies array for the dedicated filter

      for (i = 0; i < arrOfCompanies.length ; i++) {
        companies.push([arrOfCompanies[i],true]);
      }

      //Let's initialize the countries array for the dedicated filter

      for (i = 0; i < arrOfCountries.length ; i++) {
        countries.push([arrOfCountries[i],true]);
      }

      //Let's initialize the functions array for the dedicated filter

      for (i = 0; i < arrOfFunctions.length ; i++) {
        functions.push([arrOfFunctions[i],true]);
      }

      //Let's initialize the sectors array for the dedicated filter

      /*for (i = 0; i < arrOfSectors.length ; i++) {
        sectors.push([arrOfSectors[i],true]);
      }*/

      //Let's initialize the levels array for the dedicated filter

      /*for (i = 0; i < arrOfLevels.length ; i++) {
        levels.push([arrOfLevels[i],true]);
      }*/

      //Let's initialize the experience array for the dedicated filter

      /*for (i = 0; i < arrOfExperiences.length ; i++) {
        experiences.push([arrOfExperiences[i],true]);
      }*/

      //Let's initialize the array for the support filter, the sites array for the filters and the labels for the bar chart.

      for (i = 0; i < arrSerName.length ; i++) {
        if(arrSerName[i] !== null){
          labels.push(arrSerName[i]);
          sites.push([arrSerName[i],true]);
        }
      }

      //Let's initialize the regions array for the filters

      for (i = 0; i < regFilterStatusArr.length; i++) {
        regions.push([regFilterStatusArr[i],true]);
      }

      //Let's initialize the array for the departements

      /*for (i = 0; i < arrOfLocation.length; i++){
        deps.push([depFilterStatusArr[i],true]);
      }*/

    /*Setting the initial state of the applications*/

    const filters = {
      dataSortedByEquipements : arrSortedByEquipements,
      labels: labels.sort(),
      serverNames: sites,
      companies: companies,
      countries: countries,
      /*levels:levels,
      experiences:experiences,
      sectors:sectors,*/
      functions:functions,
      regions : regions,
      regAndDep : arrOfLocation,
      departements : deps,
      filterStatuses : objFilterStatuses,
      filters : [
        ["regions",regions],
        ["departements",deps],
        ["platforms",sites],
        ["countries", countries],
        ["companies",companies],
        ["equipements",equipmnts],
        ["functions",functions],
        /*["sectors",sectors],
        ["levels",levels],
        ["experiences",experiences]*/
      ]
    }
    this.setState({ 
      dataSortedByEquipements : arrSortedByEquipements,
      labels: labels.sort(),
      serverNames: sites,
      companies: companies,
      countries: countries,
      /*levels:levels,
      experiences:experiences,
      sectors:sectors,*/
      functions:functions,
      regions : regions,
      regAndDep : arrOfLocation,
      departements : deps,
      filterStatuses : objFilterStatuses,
      filters : [
        ["regions",regions],
        ["departements",deps],
        ["platforms",sites],
        ["countries", countries],
        ["companies",companies],
        ["equipements",equipmnts],
        ["functions",functions],
        /*["sectors",sectors],
        ["levels",levels],
        ["experiences",experiences]*/
      ]
    });
    this.context.setFilters(filters);
  }

  changeTitleKeyWord(event){
    //console.log(event);
    this.setState({ titleKeyWord: event.target.value });
  }

  changeRefKeyWord(event){
    //console.log(event);
    this.setState({ refKeyWord: event.target.value });
  }

  // method to toggle the all location btn
  toggleAllLocationsBtn(){

    let regs = this.state.regions,
        deps = this.state.departements,
        i = 0,
        j = 0;

    if( this.state.allLocation ){
      for( j=0 ; j < deps.length; j++) {
        deps[j][1] = false;
      }
      for( i=0 ; i < regs.length; i++) {
        regs[i][1] = false;
      }
    }else{
      for( j=0 ; j < deps.length; j++) {
        deps[j][1] = true;
      }
      for( i=0 ; i < regs.length; i++) {
        regs[i][1] = true;
      }
    }

    this.setState({ regions: regs, departements: deps, allLocation: !this.state.allLocation});
  }

  toggleAllCompanies(){

    let comps = this.state.companies,
        j = 0;

    if( this.state.allCompanies ){
      for( j=0; j < comps.length; j++) {
        comps[j][1] = false;
      }
    }else{
      for( j=0; j < comps.length; j++) {
        comps[j][1] = true;
      }
    }
    this.setState({ companies: comps, allCompanies: !this.state.allCompanies });
  }

  render() {

    const StatisticsProps = {
      data : (this.state.setofdata !== null && this.state.setofdata.length === 0) ? this.context.setofdata : this.state.setofdata,
      drawer: this,
      filters :this.state.filters
    }

    return (
      <div style={{width:"100%", height:"100%", margin:"0"}} >
        <NavBar />
         { this.state.isLoading ? <div className="spinnerpos"> <Spinner/> </div> : <Statistics { ...StatisticsProps }/>}
        <SideNavBar app={this} /> 
        <style jsx>{`
          .spinnerpos {
            text-align: center;
            width: 100%; 
            top: 45%;
            position:fixed
          }
      `}</style>
      </div>
    );
  }
}
