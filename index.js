const request  = require('async-request');
const { JSDOM } = require("jsdom");
const logger = require('simple-node-logger').createSimpleLogger('shturm.log');

const CREW_NAME = 'ы';
const NUMBER_OF_PLAYERS = '20';
const CONTACTS = '123';
const LOGO_URL = '';
const ADDITIONAL_INFO = '';
const NUMBER_OF_GAME = 1; // 0 - Tuesday, 1 - Wednesday, 2 - Thursday, 3 - Friday
const PAUSE_BETWEEN_TRIES = 2000; // ms
const DURATION_OF_FORM_GETTING = 0.1; // min
const LIMIT_OF_REG_TRIES = 2;
const LIMIT_OF_FIRST_TRIES = 20;
const ORIGIN = 'https://extrareality.by';
const X_REQUESTED_WITH = 'XMLHttpRequest';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36';
const REGISTRATION_URL = 'https://extrareality.by/afisha/form_submit';
const LINKS = [
    'https://extrareality.by/mozg_minsk',
    'https://extrareality.by/shturm_minsk'
];
const FINAL_REQUEST_HEADERS = {
    //'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};
const LINK_TO_CHECK = LINKS[1];
const LIMIT_OF_GET_TRIES = DURATION_OF_FORM_GETTING * 60000 / PAUSE_BETWEEN_TRIES;
 
const sendData = options => request(REGISTRATION_URL, { method: 'POST', ...options })
    .catch((err) => {

        logger.log('error', 'sendData() --> ', REGISTRATION_URL, 'MESSAGE:', err);
    });

    

const getData = options => request(LINK_TO_CHECK, { method: 'GET', ...options })
    .catch((err) => {
        logger.log('error', 'getData() --> ', LINK_TO_CHECK, 'MESSAGE:', err);
    });

const wait = (timeInMs) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeInMs);
    });
}

async function getForm(requestOptions) {
    let count = 0;
    let form;

    while (!form && count < LIMIT_OF_GET_TRIES) {
        const { body } = await getData(requestOptions);

        form = new JSDOM(body).window.document.getElementById('registration-form');
        count++;

        logger.info('getForm() --> Try №', count, ` -- ${form ? 'SUCCESS' : 'FAIL'}`);
        
        await wait(PAUSE_BETWEEN_TRIES);
    }

    !form && logger.info('getForm() --> Limit of tries is riched. Form is not found.');

    return form;
}

async function register(options) {
    let count = 0;
    let isRegistrationSuccessful = false;
    let response;

    while (!isRegistrationSuccessful && count < LIMIT_OF_REG_TRIES) {
        response = await sendData(options);
        isRegistrationSuccessful = response && response.statusCode === 200;
        count++;

        logger.info('register() --> Try №', count, ` ${isRegistrationSuccessful ? 'SUCCESS' : 'FAIL'}`);

        await wait(PAUSE_BETWEEN_TRIES);
    }

    if (isRegistrationSuccessful) {
        logger.info('register() --> ', response.body);
    } else {
        logger.info('register() --> Limit of tries is riched. Registration is not completed. REASON: ', response.body);
    }

    return isRegistrationSuccessful;
}

async function getFirstResponse() {
    let count = 0;
    let isSuccessful = false;
    let response;

    while(!isSuccessful && count < LIMIT_OF_FIRST_TRIES) {
        response = await getData();
        isSuccessful = response.statusCode === 200;

        count++;

        logger.info('getFirstResponse() --> Try №', count, ` -- ${isSuccessful ? 'SUCCESS' : 'FAIL'}`, ' -- Status: ', response.statusCode);

        if (isSuccessful === 200) {
            return response;
        }

        await wait(PAUSE_BETWEEN_TRIES);
    }

    !response && logger.info('getFirstResponse() --> Limit of tries is riched. Cannot get access to ', LINK_TO_CHECK);

    return response;
}

async function startProcess() {
    const firstResponse = await getFirstResponse();

    if (!firstResponse) {
        return;
    }

    const headers = {
        'User-Agent': USER_AGENT,
        'Cookie': firstResponse.headers['Set-Cookie'],
        'Origin': ORIGIN,
        'Referer': LINK_TO_CHECK,
        'X-Requested-With': X_REQUESTED_WITH
    };

    const form = await getForm({ headers });

    if (!form) {
        return;
    }

    const event_id = form.querySelector('input[name=event_id]').value;
    const session_id = form.querySelectorAll('label.radio input')[NUMBER_OF_GAME].value;
    const data = {
        event_id,
        session_id,
        title: CREW_NAME,
        players_num: NUMBER_OF_PLAYERS,
        Контакты: CONTACTS,
        Лого: LOGO_URL,
        Дополнительно: ADDITIONAL_INFO,
    }
    const optionsForRegistration = {
        headers: {
            ...headers,
            ...FINAL_REQUEST_HEADERS
        },
        data
    }    
    
    register(optionsForRegistration);
}

startProcess();
