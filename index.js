const firstResponse = {};

const getForm = () => {
    fetch('https://extrareality.by/shturm_minsk', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
        // headers: {
        //     'Access-Control-Allow-Origin': '*',
        //     'Origin': 'https://extrareality.by',
        //     'Accept-Encoding': 'gzip, deflate, br',
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //     'Referer': 'https://extrareality.by/shturm_minsk',
        //     'X-Requested-With': 'XMLHttpRequest',
        //     "Content-Type": "text/html"
        // }
    })
        .then(response => {
            console.log(response);
            
            return response.json()
        })
        .then(data => {
            // firstResponse['Cookie'] = data.headers['Set-Cookie'];
            console.log(data);
        })
        .catch(err => {
            console.log(err);            
        })
  
    
}
