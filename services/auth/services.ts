import axios from 'axios';

axios.defaults.timeout = 180000;

export default class Auth {

    postCredentialUrl : string;
    logOutUrl : string;
    postNewPassReqUrl : string;
    postEditPassReqUrl : string;
    postCheckClientKeyReqUrl : string;

    constructor(){
    
        this.postCredentialUrl = "https://clients.data-driven.fr/postclientcredentials";
        this.logOutUrl = "https://clients.data-driven.fr/logout";
        this.postNewPassReqUrl = "https://clients.data-driven.fr/iforgotmypassword";
        this.postEditPassReqUrl = "https://clients.data-driven.fr/ichangemypassword";
        this.postCheckClientKeyReqUrl = "https://clients.data-driven.fr/checkclientkey";
    }

    async authentificate(email : string = "", password : string = ""){

        let auth = null;

        await axios.post(this.postCredentialUrl, {
            email: email,
            password: password
        }).then( async ( result ) => {
            if (result.status === 200) {
                auth = result.data; 
            } 
        }).catch(e => {
            console.log(e);
        });
        
        return auth;
    }

    async logOut( clientKey : string = "" ){
        await axios.post(this.logOutUrl, { clientKey: clientKey });
    }
   
    async checkClientKey(clientKey : string = ""){
        let res = "";
        await axios.post(this.postCheckClientKeyReqUrl, {
            clientkey: clientKey
        }).then( async ( result ) => {
            if (result.status === 200) {
                res = result.data;
            } 
        }).catch(e => {
            console.log(e);
        });
        return res;
    }

    async changeClientPassword(clientKey : string = "", password : string = ""){
        let passChanged = false;
        await axios.post(this.postEditPassReqUrl, {
            clientkey: clientKey,
            password: password
        }).then( async ( result ) => {
            if (result.status === 200) {
                passChanged = true;
            } 
        }).catch(e => {
            console.log(e);
        });
        return passChanged;
    }

    async askForTempPassword(email){
        let emailSent = false;
        await axios.post(this.postNewPassReqUrl, {
            email:email
        }).then( async ( result ) => {
            if (result.status === 200) {
                emailSent = result.data;
            } 
        }).catch(e => {
            console.log(e);
        });
        return emailSent;
    }
}