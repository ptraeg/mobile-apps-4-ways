function S4() {
    return (0 | 65536 * (1 + Math.random())).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function Sync(method, model, opts) {
    var prefix = model.config.adapter.collection_name ? model.config.adapter.collection_name : "default";
    var regex = new RegExp("^(" + prefix + ")\\-(.+)$");
    var resp = null;
    if ("read" === method) if (opts.parse) {
        var list = [];
        _.each(TAP.listProperties(), function(prop) {
            var match = prop.match(regex);
            null !== match && list.push(TAP.getObject(prop));
        });
        resp = list;
    } else {
        var obj = TAP.getObject(prefix + "-" + model.id);
        model.set(obj);
        resp = model.toJSON();
    } else if ("create" === method || "update" === method) {
        if (!model.id) {
            model.id = guid();
            model.set(model.idAttribute, model.id);
        }
        TAP.setObject(prefix + "-" + model.id, model.toJSON() || {});
        resp = model.toJSON();
    } else if ("delete" === method) {
        TAP.removeProperty(prefix + "-" + model.id);
        model.clear();
        resp = model.toJSON();
    }
    if (resp) {
        _.isFunction(opts.success) && opts.success(resp);
        "read" === method && model.trigger("fetch");
    } else _.isFunction(opts.error) && opts.error(resp);
}

var Alloy = require("alloy"), _ = require("alloy/underscore")._, TAP = Ti.App.Properties;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    config.columns = config.columns || {};
    config.defaults = config.defaults || {};
    ("undefined" == typeof config.columns.id || null === config.columns.id) && (config.columns.id = "String");
    return config;
};