
// function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
// }

self.addEventListener('message', function(e) {
  console.log("in connection");
  self.postMessage(e.data);
}, false);
