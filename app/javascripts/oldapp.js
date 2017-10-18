import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import ScreamContract from '../../build/contracts/Scream.json'

const TESTRPC_HOST = 'localhost'
const TESTRPC_PORT = '8545'

function component () {
  var element = document.createElement('div')
  let provider = new Web3.providers.HttpProvider(`http://${TESTRPC_HOST}:${TESTRPC_PORT}`)
  let meta = contract(ScreamContract)
  meta.setProvider(provider)
  meta.deployed()
    .then((instance) => { element.innerHTML = `Scream address: ${instance.address}` })

  return element
}

document.body.appendChild(component())