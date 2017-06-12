let watson = require('watson-developer-cloud'),
  qs = require('qs')

module.exports = server => {
  let retrieve = watson.retrieve_and_rank({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    version: 'v1',
    url: 'https://gateway.watsonplatform.net/retrieve-and-rank/api'
  })
  const clusterId = process.env.CLUSTERID
  const collectionName = process.env.COLLECTIONNAME

  let solrClient = retrieve.createSolrClient({
    cluster_id: clusterId,
    collection_name: collectionName
  })

  const ranker_id = process.env.RANKERID

  server.post('/rr', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    let questionString = req.body.input
    let query = qs.stringify({
      q: questionString,
      ranker_id: ranker_id
    })
    solrClient.get('fcselect', query, function (err, searchResponse) {
      if (err) console.log('Error searching for documents: ' + err)
      else res.send(searchResponse)
    })
  })
}
