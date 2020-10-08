import axios from 'axios';

axios.defaults.timeout = 180000;

export default class SupportList {

    supportListUrl : string;

    constructor() {
        this.supportListUrl = 'https://clients.data-driven.fr/supports';
    }

    async retrieve( clientKey : string ) {

        let data = null;

        await axios.post(this.supportListUrl, {
            clientkey: clientKey
        }).then( async ( result ) => {
            if (result.status === 200) {
                data = result.data; 
            } 
        }).catch(e => {
            console.log(e);
        });

        return data;
    }
    
}