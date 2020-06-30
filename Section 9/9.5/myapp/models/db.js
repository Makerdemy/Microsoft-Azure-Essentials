// @ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient
const debug = require('debug')('myapp:Db')

class Db {
  /**
   * Manages reading, adding, and updating Tasks in Cosmos DB
   * @param {CosmosClient} cosmosClient
   * @param {string} databaseId
   * @param {string} containerId
   */
  constructor(cosmosClient, databaseId, containerId) {
    this.client = cosmosClient
    this.databaseId = databaseId
    this.containerId = containerId

    this.database = null
    this.container = null
  }

  async init() {
    debug('Setting up the database...')
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    })
    this.database = dbResponse.database
    debug('Setting up the database...done!')
    debug('Setting up the container...')
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.containerId
    })
    this.container = coResponse.container
    debug('Setting up the container...done!')
  }

  async getItems(itemId) {
    debug('Getting items from the database')
    const { resources: articles } = await this.container.items.readAll().fetchAll()
    return articles
  }

  async find(querySpec) {
    debug('Querying for items from the database')
    if (!this.container) {
      throw new Error('Container is not initialized.')
    }
    const { resources } = await this.container.items.query(querySpec).fetchAll()
    return resources
  }

  async addItem(item) {
    debug('Adding an item to the database')
    const { resource: doc } = await this.container.items.create(item)
    return doc
  }

  async updateItem(item) {
    debug('Update an item in the database')
    const { resource: replaced } = await this.container
      .item(item.id, item.type)
      .replace(item)
    return replaced
  }

  async deleteItem(item){
    debug('Delete an item in the database')
    const { resource: deleted } = await this.container.item(item.id, item.type).delete()
    return deleted
  }
}

module.exports = Db