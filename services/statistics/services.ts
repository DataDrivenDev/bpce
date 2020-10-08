import axios from 'axios';

axios.defaults.timeout = 180000;

export default class DashboardService {

    statisticsEndPoint: string;
    mockEndPoint: string;

    constructor(){
        this.statisticsEndPoint  = 'https://clients.data-driven.fr/dashboard-v2';
        this.mockEndPoint = 'http://localhost:3001/mockdata';
    }

    async askForData(clientKey: string = "", clientName : string = "", url : string = "", period : {}) {
        let data = null;
        await axios.post( url, {
            clientKey: clientKey,
            clientName : clientName,
            period : period
        }).then( async ( result ) => {
            if (result.status === 200) {
                data = result.data; 
            } 
        }).catch(e => {
            console.log(e);
        });
        return data;
    }

    async askForMock( url : string = "" ) {
        let data = null;
        await axios.get( url ).then( async ( result ) => {
            if (result.status === 200) {
                data = result.data; 
            } 
        }).catch(e => {
            console.log(e);
        });
        return data;
    }

    getStatisticsEndPoint() : string {
        return this.statisticsEndPoint;
    }

    getMockEndPoint() : string {
        return this.mockEndPoint;
    }
}