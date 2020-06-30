const Db = require("../models/Db");

 class Services {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {Db} db
    */
    constructor(db) {
        this.db = db;
    }

    async getArticles(req, res){
        const articles = await this.db.getItems();
        //res.status(200).json(articles);
        res.render("index", {
            title: "Astronomy",
            articles: articles
        });
    }

    async queryArticleByName(req, res){
        const querySpec = {
            query:
              'SELECT a.id, a.type, a.name, a.description FROM articles a WHERE a.name = @value',
            parameters: [
              {
                name: '@value',
                value: req.query.name // e.g. 'articles/querybyname/Carina nebula',
              }
            ]
        };
        const items = await this.db.find(querySpec);
        //res.status(200).json(items);
        res.render("index", {
            title1: "Astronomy",
            articles1: items
        });
    }

    async postArticles(req, res) {
        const item = req.body;
        await this.db.addItem(item);
        res.redirect("/get");
    }

    async putArticle(req, res) {
        const replaceitem = {
            id: req.query.id,
            type: req.query.type,
            name: req.query.name,
            description: req.query.description
          };
        await this.db.updateItem(replaceitem);
        res.redirect("/get");
    }

    async deleteArticle(req, res){
        const deleteitem = {
            id: req.query.id,
            type: req.query.type
          };
        await this.db.deleteItem(deleteitem);
        //await Promise.all(items);
        res.redirect("/get");
    }
 }

 module.exports = Services;