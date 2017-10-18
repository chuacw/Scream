var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider());

var ScreamContractAddr = "0x86E5b6D7648b8B994886aeB98E2B4770675e608D"; // on Kovan

window.addEventListener('load', function () {

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
 if (typeof web3 !== 'undefined') {

  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
  console.log("web3: " + web3);
  console.log("window.web3: " + window.web3);

  if (web3.currentProvider.isMetaMask) {
   if (typeof web3.eth.defaultAccount === 'undefined') {
    // document.body.innerHTML = '<body><h1>Oops! Your browser does not support Ethereum Ãapps.</h1></body>';
    console.log("Case 1");
   }
   else {
    document.write("Starting app...");
    document.body.innerHTML = '<body><h1>App running.</h1></body>';
    console.log("case 2");
   }
  }
  else {
     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
     window.web3 = new Web3(new Web3.providers.HttpProvider("http://shouts.groks-the.info:8545"));
     console.log("case 3");
     if (!web3.isConnected())
       updateNotRunning();
  }

 }
})

function zeroize(value) {
  return ("0" + value).slice(-2);
}

function formatDate(date) {
  let monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year + " " + zeroize(date.getHours()) + ":" + zeroize(date.getMinutes());
}


let displayLatestFromTop = true;

function gotBlock(ABlock, event) {
  let firstElement = document.getElementById("div0000000000000000");
  if (typeof(firstElement) != "undefined") {
    if (firstElement.innerHTML != "")
      firstElement.innerHTML = "";
  }
  let timestamp = ABlock.timestamp;
  let date1 = new Date(timestamp*1000);
  console.log(event.data);
  let data = event.data.replace("0x", "");
  let msg = coder.decodeParams(["string"], data);
  // document.writeln(prefix + ": " + formatDate(date1) + " - " + msg + "<br />");
  mainShout = document.getElementById('Shouts');
  let divName = 'div'+ABlock.number+ABlock.size;
  let newShout = document.createElement(divName);
  newShout.innerHTML = ABlock.number + " " + formatDate(date1) + " - " + msg + "<br/>";
  if (displayLatestFromTop) {
    mainShout.insertBefore(newShout, mainShout.childNodes[0]);
  } else
  {
    mainShout.appendChild(newShout);
  }
}

function displayEvent(prefix, event) {
  let blockNumber = event.blockNumber;
  web3.eth.getBlock(blockNumber, (error, result) => { // needs to have callback
      if(!error)
          gotBlock(result, event)
      else
          console.error(error);
  })
}

optionsShout = {
  fromBlock: 4332907, //4289879,
  toBlock: 'latest',
  address: ScreamContractAddr,
  topics: [web3.sha3('__Shout(string)')]
}

let filter, w;

function startFilter() {
  filter = web3.eth.filter(optionsShout);

  filter.watch((error, event) => {
    if (!error) {
      if (event.blockNumber > optionsShout.fromBlock) {
        optionsShout.fromBlock = event.blockNumber;
        displayEvent("event1", event);
      }
    } else
    {
      console.log("Error?");
      
    }
  })
}

if (typeof(Worker) !== "undefined") {
    console.log("Web Worker supported");
} else {
    console.log("No Web Worker!");
}

if (typeof(w) == "undefined") {
  w = new Worker("javascripts/CheckConnection.js");
  console.log("Worker created");
  w.addEventListener('message', function(event) {
     // code here
  }, false);
  w.postMessage(112); // start the worker
}

function updateStatus(text) {
  let status = document.getElementById("status");
  status.innerHTML = text;
}

function updateNotRunning() {
}

function Reconnect() {
  console.log('Are we listening???');
  try {
    console.log(web3.isConnected());
//     web3.net.getListening(function(error, result){ 
//       console.log("Resetting web3");
//       console.log("Listening: " + result);
//       if (!result) {
//         console.log("stop Watching");
//         filter.stopWatching();
//         web3.reset();
//         startFilter();
//       }
//       
//     })
// 
    
    let connected = web3.isConnected();
    console.log("Listening: " + connected);
    if (!connected) {
        console.log("stop Watching");
//        filter.stopWatching();
        console.log("Resetting web3");
//        web3.reset();
//        startFilter();
        updateNotRunning();
    } else {
      updateStatus("");
    }

  } catch (err) {
    console.log(err.message);
    updateNotRunning();
  }

  setTimeout(function() {Reconnect()}, 1000);
};

function ReconnectBtn() {
  let status = document.getElementById("status");
  status.innerHTML = "Reconnecting...";
  Reconnect();
  setTimeout(function() 
    {
      let status = document.getElementById("status");
      status.innerHTML = "";
    }, 1000
  );
}

function Reinsert() {
  let number = Math.floor(Math.random() * 10000000000);
  mainShout = document.getElementById('Shouts');
  
  setTimeout(function() { Reinsert() }, 1000);  
}

function checkReconnection() {
  setTimeout(function() {Reconnect()}, 1000);
}

if (web3.isConnected()) {
  startFilter(); 
};

checkReconnection();

// setTimeout(function() { Reinsert() }, 1000);
