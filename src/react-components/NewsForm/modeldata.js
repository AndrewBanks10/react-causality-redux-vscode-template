import CausalityRedux from 'causality-redux'

// Sample non UI business data
const newsNonUIData = {
  newsSourcesCache: []
}

// This will create a unique redux partition for this data in order to support hot reloading
// in this business code.
const moduleData = CausalityRedux.getModuleData(process.env.NODE_ENV !== 'production', newsNonUIData).moduleData

export default moduleData
