const extras = require('../extras');
const validator = require('../validator');
let _articles = require("../content/articles.json");
const articles = exports;

const sortFieldDefault = "date";
const sortOrderDefault = "desc";
const pageDefault = 1;
const limitDefault = 10;
const includeDepsDefault = false;

articles.readAll = function (req, res, payload, cb) {
    let sortField   = payload.sortField === undefined ? sortFieldDefault : payload.sortField;
    let sortOrder   = payload.sortOrder === undefined ? sortOrderDefault : payload.sortOrder;
    let page        = payload.page === undefined ? pageDefault : payload.page;
    let limit       = payload.limit === undefined ? limitDefault : payload.limit;
    let includeDeps = payload.includeDeps === undefined ? includeDepsDefault : payload.includeDeps;

    let response = {
        "items" : _articles.sort((a, b) => {
            switch (sortField) {
                case "id" : {
                    if (a.id > b.id) return sortOrder === "asc" ? 1 : -1;
                    if (a.id === b.id) return 0;
                    if (a.id < b.id) return sortOrder === "asc" ? -1 : 1;
                }
                case "title" : {
                    if (a.title > b.title) return sortOrder === "asc" ? 1 : -1;
                    if (a.title === b.title) return 0;
                    if (a.title < b.title) return sortOrder === "asc" ? -1 : 1;
                }
                case "text" : {
                    if (a.text > b.text) return sortOrder === "asc" ? 1 : -1;
                    if (a.text === b.text) return 0;
                    if (a.text < b.text) return sortOrder === "asc" ? -1 : 1;
                }
                case "date" : {
                    if (a.date > b.date) return sortOrder === "asc" ? 1 : -1;
                    if (a.date === b.date) return 0;
                    if (a.date < b.date) return sortOrder === "asc" ? -1 : 1;
                }
                case "author" : {
                    if (a.author > b.author) return sortOrder === "asc" ? 1 : -1;
                    if (a.author === b.author) return 0;
                    if (a.author < b.author) return sortOrder === "asc" ? -1 : 1;
                }
            }
        }).slice((page - 1) * limit, (page - 1) * limit + limit).filter((article) => {
            if (includeDeps) return true;
            if (!includeDeps) return article.comments.length === 0;

        }),
        "meta" : {
            "page" : page,
            "pages" : Math.round(_articles.length/limit),
            "count" : _articles.length,
            "limit" : limit
        }
    };
    cb(null, response);
};

articles.read = function (req, res, payload, cb) {
    let index = _articles.findIndex(article => article.id === payload.id);

    if (index !== -1) {
        cb(null, _articles[index]);
    }
    else {
        cb({code: 405, message: 'Article not found'});
    }
};

articles.create = function (req, res, payload, cb) {
    if (validator.isArticleValid(payload)) {
        payload.id = extras.generateId();
        _articles.push(payload);
        cb(null, payload);
        extras.saveArticles(_articles);
    }
    else {
        cb({code: 400, message: 'Request invalid'});
    }
};

articles.update = function (req, res, payload, cb) {
    if (validator.isArticleValid(payload)) {
        let index = _articles.findIndex(article => article.id === payload.id);
        if (index !== -1) {
            _articles[index] = payload;
            cb(null, payload);
            extras.saveArticles(_articles);
        }
        else {
            cb({code: 405, message: 'Article not found'});
        }
    }
    else {
        cb({code: 400, message: 'Request invalid'});
    }
};

articles.delete = function (req, res, payload, cb) {
    let index = _articles.findIndex(article => article.id === payload.id);

    if (index !== -1) {
        _articles.splice(index, 1);
        cb(null, _articles);
        extras.saveArticles(_articles);
    }
    else {
        cb({code: 405, message: 'Article not found'});
    }
};