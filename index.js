const  request  = require('async-request');
const  { JSDOM } = require("jsdom");
const fs = require('fs');

const CHECK_INTERVAL = 2000; //ms
const DURATION = 20; //min
const LIMIT_OF_TRIES = DURATION * 60000 / CHECK_INTERVAL;

const register = (options) => {
    return request('https://extrareality.by/shturm_minsk', {
       method: 'POST',
       ...options 
    });
}

const getData = (options) => {
    return request('https://extrareality.by/shturm_minsk', {
        method: 'GET',
        ...options
    })
    .catch((err) => {
        console.log(err);        
    });
}

const wait = (timeInMs) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeInMs);
    });
}

const getForm = () => {
    let count = 0;
    let form;

    while (!from && count <= LIMIT_OF_TRIES) {
        const data = await get
    }
    
        getData()
            .then(res => {
                count++;
                console.log(count);
                
                if (count > LIMIT_OF_TRIES) {
                    clearInterval(checkId);
                    return false;
                }

                form = new JSDOM(res.body).window.document.getElementById('registration-form');
                console.log(form, 1);
                
                if(form) {
                    clearInterval(checkId);
                    return form;
                } 
            });
    }, CHECK_INTERVAL);
}

async function startProcess(response) {
    const headrs = response.headers;

    const form = await getForm();

    console.log(form);
    

    
     
}

request('https://extrareality.by/shturm_minsk')
    .then((response) => {
        startProcess(response);     
    })
    .catch((err) => {
        console.log(err);        
    });

