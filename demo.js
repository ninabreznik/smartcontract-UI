var smartcontractapp = require('./')
var metadata = require('./metadata.json')

var opts = {
  metadata: metadata[5]
}


document.body.appendChild(smartcontractapp(opts))
