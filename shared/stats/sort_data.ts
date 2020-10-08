export default class statLibrary {

  constructor(){
    
  }
  
  /**
   * Method to reduce a table filled by identical framed objects according to a specific property inside them
   * like the support or the RegionNom. The result is an object :
   * result = {
      support1 : [objWithSupport1,objWithSupport1...]
      support2 : [objWithSupport2,objWithSupport2...]
      .
      .
      .
      .
   * }

   * @param  {Array<Object>=[]} tableauObjets
   * @param  {string} propriete
   * 

  */
  reduce( tableauObjets : Array<Object> = [], propriete : string){

    let cle = null;
    return tableauObjets.reduce( (acc, obj) => {
        cle = propriete !== null ? obj[propriete] : null;
        if(cle !== null){
          if(!acc[cle]) {
            acc[cle] = [];
          }
          acc[cle].push(obj);
        }
        return acc;
    }, {});
  }
  

  /**
  * 
  * Recusive method to group identical framed objects from an array according a chosen property.
  * The main purpose is to call several time group with a different property as parameter for each
  * call, the result will be framed like this for a first call with the support property as parameter
  * and a second call with the regionNom as parameter:
  * result = {
      support1: {
          regionNom1 : [objWithSupport1AndRegionNom1, objWithSupport1AndRegionNom1...]
          regionNom2 : [objWithSupport1AndRegionNom2, objWithSupport1AndRegionNom2...]
          .
          .
      }
      support2 : {
          regionNom1 : [objWithSupport2AndRegionNom1, objWithSupport2AndRegionNom1...]
          regionNom2 : [objWithSupport2AndRegionNom2, objWithSupport2AndRegionNom2...]
          .
          .
      }
      .
      .
      .
      .
  * }

  * @param  {any} tableauObjets
  * @param  {string} propriete
  * 
  */

  group(tableauObjets : any , propriete : string) {
  	let property : string = "";

  	if ( Array.isArray(tableauObjets) )  {
  		tableauObjets = this.reduce(tableauObjets,propriete);
  	} else {
  		for( property in tableauObjets ){
  			if( Array.isArray(tableauObjets[property]) ){
  				tableauObjets[property] = this.reduce(tableauObjets[property], propriete);
  			} else {
  				tableauObjets[property] = this.group(tableauObjets[property], propriete);
  			}
  		}
  	}
	   return tableauObjets;
   }

   
    /**
    * Call of the group method with the property equal to Support by default
    * 
    * @param  {any} tableauObjets
    * @param  {string="Support"} propriete
    * 
    */

    groupBySupport( tableauObjets : any , propriete : string = "Support" ) {
  	  return this.group(tableauObjets, propriete);
    }


    /** 
    * Call of the group method with the property empty
    * @param  {Array<any>=[]} tableauObjets
    * @param  {string} propriete
    */
   
     groupBySelection( tableauObjets  : Array< any > = [], propriete : string ) {
   	  return this.group(tableauObjets, propriete);
     }


    /** 
    * Composition method. Call it to do recursive call with the group method
    * @param  {} ...functions
    */
   
    pipe = (...functions ) => input => functions.reduce(
        (acc, fn) => fn(acc), input
    );

    groupBy = this.pipe(this.groupBySupport);


    /*
    * Sort method to retrieve an array of obj
    */

    sortByProperty(tableauObjets  : Array< any > = [] , property : string = "", propToIgnore : string = "SupportType", valueToIgnore : string = "Site Carrière") {

        let arr = [], i = 0, l = tableauObjets.length;

        for(i = 0; i < l; i++) {
            if( tableauObjets[i][propToIgnore] !== valueToIgnore ){
              arr.push(tableauObjets[i][property]);
            }
        }

        return this.foo(arr).sort();
    }

    /** Find occurences 
    * @param  {Array<any>=[]} arr
    */

    foo(arr  : Array< any > = []){
      
        let a = [], prev, i = 0, l = arr.length, val = null;

        arr.sort();

        for ( i = 0; i < l; i++ ) {
            val = arr[i];
            if ( val !== prev ) {
                a.push(val);
            }
            prev = val;
        }
        return a;
    }

    /** 
    * Sort location method to generate location filters,
    * for each region found in the data we are collecting the linked departement
    * @param  {Array<any>=[]} tableauObjets
    * @param  {string=""} regionProp
    * @param  {string=""} departementProp
    */

    sortByLocation (tableauObjets  : Array< any > = [], regionProp : string = "", departementProp : string = "") {

        let obj : object = {},
            arrf : Array<any> = [],
            i : number  = 0,
            j : number= 0,
            l : number = 0,
            r : string = "",
            otherTypeOfRegionFound : boolean = false;

            //console.log(tableauObjets);

            if(tableauObjets !== undefined && tableauObjets[0] !== undefined){

                obj = { region : tableauObjets[0][regionProp].trim(), departements : [] };
                arrf.push(obj);
                /* Let's find the regions, those are pushed into an array*/
                for (i = 0; i < tableauObjets.length ; i++) {
                  //if(tableauObjets[i]["RegionNom"].trim() !== ""){
                    r = tableauObjets[i][regionProp] !== null ? tableauObjets[i][regionProp].trim() : "";
                    for(l = 0; l < arrf.length; l++) {
                      if(arrf[l].region !== r) {
                        otherTypeOfRegionFound = true;
                      }else {
                        otherTypeOfRegionFound = false;
                        break;
                      }
                    }
                    if(otherTypeOfRegionFound){
                      arrf.push({ region : r, departements : [tableauObjets[i][departementProp]] });
                    }
                  //}
                }
                //console.log(arrf);

                for(j = 0;j < arrf.length; j++) {
                   for (i = 0; i < tableauObjets.length ; i++) {
                     if(( arrf[j].region === tableauObjets[i][regionProp] )){
                        arrf[j].departements.push(tableauObjets[i][departementProp]);
                     }
                   }
                }
            }

        /** Find all the occurence, return an array */

        for(j = 0;j < arrf.length; j++) {
            arrf[j].departements = this.foo(arrf[j].departements);
        }

        //console.log(arrf);

        return arrf.sort();
    }

    /**
    * @param  {Array<any>=[]} data
    * @param  {Array<any>=[]} filter
    * 
    * 
    */


    sortByEquipment(data : Array< any > = [], filter : Array< any > = []) {

      let arr = [], i = 0, j = 0, hasToBeFlatted = true, dl = data !== null ? data.length : 0, fl = filter.length, line = null, filt = "",
          lineSorted = { Intitule: "", DatePublication: "", Societe: "", DepartNom: "", RegionNom: "", Ref: "", Country: "", Support: "", SupportType: "", Equipement: "", Poste: "", Fonction: "", Secteur: "", Experience: "", Niveau: "", nbsuppcompl: [], consultation: [], firstview : [], completed: [], gencompleted: [], apply: [], genhired:[], hired: [], costconsultation : [], costapply: [], costcompleted : [] };

          for( j = 0; j < dl; j++ ){
            line = data[j];
            lineSorted = {
                 nbsuppcompl: [], 
                 consultation: [], 
                 firstview : [], 
                 completed: [], 
                 gencompleted: [], 
                 apply: [],  
                 genhired:[], 
                 hired: [], 
                 costconsultation : [], 
                 costapply: [], 
                 costcompleted : [],
                 Intitule: line.Intitule,
                 DatePublication: line.DatePublication,
                 Societe: line.Societe,
                 DepartNom: line.DepartNom,
                 RegionNom: line.RegionNom,
                 Ref: line.Ref,
                 Country: line.Country,
                 Support: line.Support,
                 SupportType: line.SupportType,
                 Equipement: line.Equipement,
                 Poste: line.Poste,
                 Fonction: line.Fonction,
                 Secteur: line.Secteur,
                 Experience: line.Experience,
                 Niveau: line.Niveau,
              };
            
            
            for( i = 0; i < fl; i++ ){
              if( filter[i][1] ){
                filt = filter[i][0];
                for( const property in line[filt] ){
                  //console.log(property);
                  if(lineSorted[property] !== undefined && line[filt][property] !== undefined){
                    lineSorted[property].push(line[filt][property]);
                  }
                }
              }
            }
            
            for( const property in lineSorted ){
              hasToBeFlatted = Array.isArray(lineSorted[property]);
              if(hasToBeFlatted){
                lineSorted[property] = lineSorted[property].flat();
              }else {
                break;
              }
            }
          arr.push(lineSorted);
        }
      return arr;
    }
    
    /**
     * Method to retrieve annonces published between the two given dates from a set of data 
     * 
     * @param  {Array<any>=[]} data
     * @param  {any} from
     * @param  {any} to
     */

    sortByDate(data : Array< any > = [], from : any, to : any, options : any){

      let i = 0,
          j = 0,
          date : number = 0,
          line = null,
          nLine = { Intitule: "", DatePublication:"", Societe: "", DepartNom: "", RegionNom: "", Ref: "", Country: "", Support: "", SupportType: "", Equipement: "", Poste: "", Fonction: "", Secteur: "", Experience: "", Niveau: "", nbsuppcompl: [], firstview : [], consultation: [], completed: [], gencompleted: [], apply: [], genhired:[], hired: [], costconsultation : [], costapply: [], costcompleted : []},
          dataSorted = [],
          emptyValue = {value:0};

      let start = parseInt(from.year.toString() + (from.month.toString().length === 1 ? "0" + from.month.toString() : from.month.toString()),10),
          end   = parseInt(to.year.toString() + (to.month.toString().length === 1 ? "0" + to.month.toString() : to.month.toString()),10),
          filtDates = { start : start, end : end };


      for( i = 0; i < data.length; i++ ){

        line = data[i];

        nLine = {
             Intitule: line.Intitule,
             DatePublication: line.DatePublication,
             Societe: line.Societe,
             DepartNom: line.DepartNom,
             RegionNom: line.RegionNom,
             Ref: line.Ref,
             Country: line.Country,
             Support: line.Support,
             SupportType: line.SupportType,
             Equipement: line.Equipement,
             Poste: line.Poste,
             Fonction: line.Fonction,
             Secteur: line.Secteur,
             Experience: line.Experience,
             Niveau: line.Niveau,
             nbsuppcompl: [],
             consultation: [],
             firstview :[],
             completed: [],
             gencompleted: [],
             apply: [],
             genhired:[],
             hired: [],
             costconsultation : [],
             costapply: [],
             costcompleted : []
          };



          for( j = 0; j < line["consultation"].length; j++ ){

            date = parseInt(line["consultation"][j].date,10);

            if( date >= filtDates.start && date <= filtDates.end ){
              
              /* Selected options, will be an array, there is just firstview (1) for now */
              
              if( options === "1" ){
                nLine["firstview"].push(line["firstview"][j] !== undefined ? (line["firstview"][j].value !== null ? line["firstview"][j] : emptyValue): emptyValue);
              }

              /** Performances */
              nLine["nbsuppcompl"].push(line["nbsuppcompl"][j].value !== null ? line["nbsuppcompl"][j] : emptyValue );
              nLine["consultation"].push(line["consultation"][j].value !== null ? line["consultation"][j] : emptyValue );
              nLine["completed"].push(line["completed"][j] !== undefined ? (line["completed"][j].value !== null ? line["completed"][j] : emptyValue) : emptyValue);
              nLine["gencompleted"].push(line["gencompleted"][j].value !== null ? line["gencompleted"][j] : emptyValue );
              nLine["hired"].push(line["hired"][j].value !== null ? line["hired"][j] : emptyValue );
              nLine["genhired"].push(line["genhired"][j].value !== null ? line["genhired"][j] : emptyValue );
              nLine["apply"].push(line["apply"][j].value !== null ? line["apply"][j] : emptyValue );

              /*Costs*/
              nLine["costconsultation"].push(line["costconsultation"][j].value !== null ? line["costconsultation"][j] : emptyValue );
              nLine["costapply"].push(line["costapply"][j].value !== null ? line["costapply"][j] : emptyValue );
              nLine["costcompleted"].push(line["costcompleted"][j].value !== null ? line["costcompleted"][j] : emptyValue );

            }
          }
          dataSorted.push(nLine);
        }

      //console.log(dataSorted);

      return dataSorted;
    }

    /**
     * Retrieve a pack of annonces form a given set of data between two given dates.
     * 
     * @param  {Date=null} sd
     * @param  {Date=null} ed
     * @param  {Array<any>=[]} data
     *
     */

    retrieveAnnonceBetwnTwoDate(sd : Date = null, ed : Date = null, data : Array< any > = []) {

      let i : number = 0 ,
          arr : Array<any> = [] ,
          time : number = 0,
          sdTime : number = 0,
          edTime : number = 0,
          notSame : boolean = false;

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

    /**
    * filterByKeyWord says if a announce has into the data provided a specific keyword  
    * @param  {string=""} keyWord
    * @param  {Array<any>=[]} data
    */

    filterByKeyWord( keyWord : string = "", data : Array< any > = []) {
      if ( keyWord === "" && keyWord.length < 3 ){
        return true;
      } else {
        return (data.includes(keyWord.toLowerCase()) || data.includes(keyWord.toUpperCase()));
      }
    }

    /**
    * filterBySelection says if a announce of the set of data fit to the selection made by the user
    *  
    * @param  {string=""} dataToAnalyse
    * @param  {Array<any>=[]} selectedData
    * 
    */

    filterBySelection ( dataToAnalyse : string = "", selectedData : Array< any > = [] ) {
      let hasTobePushed : boolean = true, i : number = 0;
      for( i = 0; i < selectedData.length; i++ ){
        if(selectedData[i] !== null && selectedData[i][0] === dataToAnalyse && !selectedData[i][1]){
          hasTobePushed = false;
          break;
        }
      }
      return hasTobePushed;
    }

    triggerFilter ( data : Array< any > = [], filterStatuses : Array< any > = [] )  {

      let filterProp : string = "", prop : string = "", valueFound : boolean = false, i : number = 0;

      for( filterProp in filterStatuses ) {
        valueFound = false;
        for( i = 0; i < data.length; i++ ){
          for( prop in data[i] ){
            if( !Array.isArray(data[i][prop]) && data[i][prop] !== undefined  && data[i][prop] !== null && data[i][prop] === filterProp ){
                valueFound = true;
                filterStatuses[filterProp] = 1;
                break;
            }
          }
        }
        if( ! valueFound ){
          filterStatuses[filterProp] = 0;
        }
      }
      return filterStatuses;
    }
    
    /**
     * Method which filter the data of the app according to a provided boolean. If withDateFilter is provided, the filter method takes it in account
     * and returns an array also filtered by date and by each selection made by the user, the method call filterBySelection. 
     * This aim to step by step to an array filtered by all the selected criterias  
     * 
     * @param  {boolean=false} withDateFilter
     * @param  {any} drawer
     */

    filter ( withDateFilter : boolean = false , drawer : any, options : any ) {

        let arr : Array<any> = [],
            filterStatuses : Array<any> = drawer.state.filterStatuses,
            arrEq : Array<any> = ((drawer.state.equipements !== undefined && drawer.state.equipements.length !== 0) ? this.sortByEquipment(drawer.state.setofdata, drawer.state.equipements) : []),
            //arrDate : Array<any> = ( withDateFilter ? (arrEq.length !== 0 ? this.sortByDate(arrEq, drawer.state.mrange.from, drawer.state.mrange.to, options) : []) : drawer.state.setofdata),
            i : number = 0,
            dl : number  = arrEq.length,
            d : any = null;

        if( dl !== 0 ){
            for (i = 0; i < dl ; i++) {
                d = arrEq[i];
                if(
                    this.filterBySelection(d["Country"],drawer.state.countries)
                    /*&& this.filterBySelection(d["Support"],drawer.state.serverNames)*/
                    && this.filterBySelection(d["Societe"],drawer.state.companies)
                    /*&& this.filterBySelection(d["Fonction"],drawer.state.functions)*/
                    /*&& this.filterBySelection(d["Secteur"],app.state.sectors)
                    && this.filterBySelection(d["Niveau"],app.state.levels)
                    && this.filterBySelection(d["Experience"],app.state.experiences)*/
                    /*&& this.filterBySelection(d["RegionNom"], drawer.state.regions)*/
                    //&& this.filterBySelection(d["DepartNom"], drawer.state.departements)
                    /*&& this.filterByKeyWord(drawer.state.titleKeyWord,d["Intitule"])
                    && this.filterByKeyWord(drawer.state.refKeyWord,d["Ref"])*/
                ){
                  arr.push(d);
                }
            }

          filterStatuses = this.triggerFilter(arr,filterStatuses);
          //console.log(arr);
        }
        return [arr, filterStatuses];
    }
}