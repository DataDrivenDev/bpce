import axios from 'axios';

axios.defaults.timeout = 180000;

export default class Subscriptions {

    subscriptionUrl : string;
    subscriptionTypes : string;
    sendNewSubscriptionUrl : string;
    updateSubscription : string;
    deleteSubscription : string;
    retrieveSubscriptionsUrl : string;

    constructor(){

        this.subscriptionUrl = 'https://clients.data-driven.fr/subscriptions';
        this.retrieveSubscriptionsUrl = 'https://clients.data-driven.fr/retrieveSuscriptionOnAir';
        this.subscriptionTypes = "https://clients.data-driven.fr/subscriptionTypes";
        this.sendNewSubscriptionUrl = 'https://clients.data-driven.fr/newSub';
        this.updateSubscription = 'https://clients.data-driven.fr/updateSubscription';
        this.deleteSubscription = 'https://clients.data-driven.fr/deleteSubscription';

    }

    async getSubscriptionTypes( clientKey : string = "") {

        let data = null;

        await axios.post(this.subscriptionTypes, {
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

    async retrieveSubscriptions( clientKey : string = "" ){

        let data = null;

        await axios.post(this.subscriptionUrl, {
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

    async retrieveSubscriptionsOnAir( clientKey : string = "", period : {} ){

        let data = null;

        await axios.post(this.retrieveSubscriptionsUrl, {
            clientkey: clientKey,
            period : period
        }).then( async ( result ) => {
            if (result.status === 200) {
                data = result.data; 
                console.log(data);
            } 
        }).catch(e => {
            console.log(e);
        });

        return data;
    }

    async addSub( clientKey : string = "", values : any ){

        let msg = "Erreur lors de l'ajout d'un abonement";
    
        await axios.post(this.sendNewSubscriptionUrl, {
            clientkey: clientKey,
            values: values
        }).then( async ( result ) => {
            if (result.status === 200) {
                msg = result.data.mssg; 
            } 
        }).catch(e => {
            console.log(e);
        });

        return msg;
    }

    async validate( clientKey : string = "", params ){

        let msg = "Erreur lors de la modification de l'abonnement";
    
        await axios.post(this.updateSubscription, {
            clientkey: clientKey,
            values: params
        }).then( async ( result ) => {
            if (result.status === 200) {
                msg = result.data.mssg; 
            } 
        }).catch(e => {
            console.log(e);
        });
        return msg;
    }

    async deleteSub( clientKey : string = "", id ){

        let msg = "Erreur lors de la suppression de l'abonnement";
    
        await axios.post(this.deleteSubscription, {
            clientkey: clientKey,
            subscriptionId: id
        }).then( async ( result ) => {
            if (result.status === 200) {
                msg = result.data.mssg; 
            } 
        }).catch(e => {
            console.log(e);
        });
        return msg;
    }

}