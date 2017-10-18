var coder = require('./node_modules/web3/lib/solidity/coder.js');
        // NOTE NOTE the path in the require
        // dont override global variable
        if (typeof window !== 'undefined' && typeof window.coder === 'undefined') {
            window.coder = coder;
        }
        module.exports = coder;
