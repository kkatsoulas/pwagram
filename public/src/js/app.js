var deferredPrompt;

if('serviceWorker'in navigator){
    navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
        console.log('Service Worker registered');
    })
    .catch(e => {
        console.log(e);
    });
}

window.addEventListener('beforeinstallprompt', event => {
    console.log('Before install prompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});



console.log('executing imeddiatelly');

// var promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject({
//             code: 500,
//             message: 'An error ocurred'
//         });
//         resolve('set timeout with promise complete');
//     }, 3000);
// });

// promise.then(value => {
//     return value;
// })
// .then(text => {
//     console.log(text);
// })
// .catch(err => {
//     console.log(err);
// });

// fetch('https://httpbin.org/ip')
// .then(response => {
//     return response.json();
// })
// .then(json => {
//     console.log(json);
// })
// .catch(err => {
//     console.log(err);
// });

// fetch('https://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     mode: 'cors',
//     body: JSON.stringify({
//         message: 'Does this work?'
//     })
// })
// .then(response => {
//     return response.json();
// })
// .then(json => {
//     console.log(json);
// })
// .catch(err => {
//     console.log(err);
// });