import axios from 'axios';

axios.defaults.timeout = 180000;

export default class InfoSites {

    supportInfoUrl : string;
    options : any;

    constructor(){
        this.supportInfoUrl = 'https://clients.data-driven.fr/infoSites';
    }

    async postSupportInfo(clientKey, url){
        let info = null;
        await axios.post( url, {
            clientKey: clientKey,
        }).then( async ( result ) => {
            if (result.status === 200) {
                info = result.data; 
            } 
        }).catch(e => {
            console.log(e);
        });
        //console.log(data);
        return info; 
    }

    getSupportInfoUrl(){
        return this.supportInfoUrl;
    }

}

