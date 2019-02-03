var smartcontractapp = require('./')
var metadata = require('./metadata.json')

var opts = {
  metadata: metadata[7]
}


document.body.appendChild(smartcontractapp(opts))
