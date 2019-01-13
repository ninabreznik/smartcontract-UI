var smartcontractapp = require('./')
var metadata = require('./metadata.json')

var opts = {
  metadata: metadata[6]
}


document.body.appendChild(smartcontractapp(opts))
