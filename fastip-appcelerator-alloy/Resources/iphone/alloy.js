function ucfirst(text) {
    if (!text) return text;
    return text[0].toUpperCase() + text.substr(1);
}

function addNamespace(apiName) {
    return (CONST.IMPLICIT_NAMESPACES[apiName] || CONST.NAMESPACE_DEFAULT) + "." + apiName;
}

function processStyle(controller, proxy, classes, opts, defaults) {
    opts = opts || {};
    opts.classes = classes;
    proxy.apiName && (opts.apiName = proxy.apiName);
    proxy.id && (opts.id = proxy.id);
    proxy.applyProperties(exports.createStyle(controller, opts, defaults));
}

function isTabletFallback() {
    return Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 700;
}

var _ = require("alloy/underscore")._, Backbone = require("alloy/backbone"), CONST = require("alloy/constants");

exports.version = "1.3.0";

exports._ = _;

exports.Backbone = Backbone;

var DEFAULT_WIDGET = "widget";

var TI_VERSION = Ti.version;

var MW320_CHECK = false;

var IDENTITY_TRANSFORM = void 0;

var RESET = {
    bottom: null,
    left: null,
    right: null,
    top: null,
    height: null,
    width: null,
    shadowColor: null,
    shadowOffset: null,
    backgroundImage: null,
    backgroundRepeat: null,
    center: null,
    layout: null,
    backgroundSelectedColor: null,
    backgroundSelectedImage: null,
    opacity: 1,
    touchEnabled: true,
    enabled: true,
    horizontalWrap: true,
    zIndex: 0,
    backgroundColor: null,
    font: null,
    visible: true,
    color: null,
    transform: null,
    backgroundGradient: {},
    borderColor: "transparent",
    borderRadius: 0,
    borderWidth: 0
};

RESET = _.extend(RESET, {
    backgroundLeftCap: 0,
    backgroundTopCap: 0
});

exports.M = function(name, modelDesc, migrations) {
    var config = (modelDesc || {}).config || {};
    var adapter = config.adapter || {};
    var extendObj = {};
    var extendClass = {};
    var mod;
    if (adapter.type) {
        mod = require("alloy/sync/" + adapter.type);
        extendObj.sync = function(method, model, opts) {
            mod.sync(method, model, opts);
        };
    } else extendObj.sync = function(method, model) {
        Ti.API.warn("Execution of " + method + "#sync() function on a model that does not support persistence");
        Ti.API.warn("model: " + JSON.stringify(model.toJSON()));
    };
    extendObj.defaults = config.defaults;
    migrations && (extendClass.migrations = migrations);
    mod && _.isFunction(mod.beforeModelCreate) && (config = mod.beforeModelCreate(config, name) || config);
    var Model = Backbone.Model.extend(extendObj, extendClass);
    Model.prototype.config = config;
    _.isFunction(modelDesc.extendModel) && (Model = modelDesc.extendModel(Model) || Model);
    mod && _.isFunction(mod.afterModelCreate) && mod.afterModelCreate(Model, name);
    return Model;
};

exports.C = function(name, modelDesc, model) {
    var extendObj = {
        model: model
    };
    var config = (model ? model.prototype.config : {}) || {};
    var mod;
    if (config.adapter && config.adapter.type) {
        mod = require("alloy/sync/" + config.adapter.type);
        extendObj.sync = function(method, model, opts) {
            mod.sync(method, model, opts);
        };
    } else extendObj.sync = function(method, model) {
        Ti.API.warn("Execution of " + method + "#sync() function on a collection that does not support persistence");
        Ti.API.warn("model: " + JSON.stringify(model.toJSON()));
    };
    var Collection = Backbone.Collection.extend(extendObj);
    Collection.prototype.config = config;
    _.isFunction(modelDesc.extendCollection) && (Collection = modelDesc.extendCollection(Collection) || Collection);
    mod && _.isFunction(mod.afterCollectionCreate) && mod.afterCollectionCreate(Collection);
    return Collection;
};

exports.UI = {};

exports.UI.create = function(controller, apiName, opts) {
    opts = opts || {};
    var baseName, ns;
    var parts = apiName.split(".");
    if (1 === parts.length) {
        baseName = apiName;
        ns = opts.ns || CONST.IMPLICIT_NAMESPACES[baseName] || CONST.NAMESPACE_DEFAULT;
    } else {
        if (!(parts.length > 1)) throw "Alloy.UI.create() failed: No API name was given in the second parameter";
        baseName = parts[parts.length - 1];
        ns = parts.slice(0, parts.length - 1).join(".");
    }
    opts.apiName = ns + "." + baseName;
    baseName = baseName[0].toUpperCase() + baseName.substr(1);
    var style = exports.createStyle(controller, opts);
    return eval(ns)["create" + baseName](style);
};

exports.createStyle = function(controller, opts, defaults) {
    var classes, apiName;
    if (!opts) return {};
    classes = _.isArray(opts.classes) ? opts.classes.slice(0) : _.isString(opts.classes) ? opts.classes.split(/\s+/) : [];
    apiName = opts.apiName;
    apiName && -1 === apiName.indexOf(".") && (apiName = addNamespace(apiName));
    var styleArray;
    styleArray = controller && _.isObject(controller) ? require("alloy/widgets/" + controller.widgetId + "/styles/" + controller.name) : require("alloy/styles/" + controller);
    var styleFinal = {};
    var i, len;
    for (i = 0, len = styleArray.length; len > i; i++) {
        var style = styleArray[i];
        var styleApi = style.key;
        style.isApi && -1 === styleApi.indexOf(".") && (styleApi = (CONST.IMPLICIT_NAMESPACES[styleApi] || CONST.NAMESPACE_DEFAULT) + "." + styleApi);
        if (style.isId && opts.id && style.key === opts.id || style.isClass && _.contains(classes, style.key)) ; else {
            if (!style.isApi) continue;
            -1 === style.key.indexOf(".") && (style.key = addNamespace(style.key));
            if (style.key !== apiName) continue;
        }
        if (style.queries && style.queries.formFactor && !Alloy[style.queries.formFactor]) continue;
        _.extend(styleFinal, style.style);
    }
    var extraStyle = _.omit(opts, [ CONST.CLASS_PROPERTY, CONST.APINAME_PROPERTY ]);
    _.extend(styleFinal, extraStyle);
    styleFinal[CONST.CLASS_PROPERTY] = classes;
    styleFinal[CONST.APINAME_PROPERTY] = apiName;
    MW320_CHECK && delete styleFinal[CONST.APINAME_PROPERTY];
    return defaults ? _.defaults(styleFinal, defaults) : styleFinal;
};

exports.addClass = function(controller, proxy, classes, opts) {
    if (!classes) {
        if (opts) {
            MW320_CHECK && delete opts.apiName;
            proxy.applyProperties(opts);
        }
        return;
    }
    var pClasses = proxy[CONST.CLASS_PROPERTY] || [];
    var beforeLen = pClasses.length;
    classes = _.isString(classes) ? classes.split(/\s+/) : classes;
    var newClasses = _.union(pClasses, classes || []);
    if (beforeLen === newClasses.length) {
        if (opts) {
            MW320_CHECK && delete opts.apiName;
            proxy.applyProperties(opts);
        }
        return;
    }
    processStyle(controller, proxy, newClasses, opts);
};

exports.removeClass = function(controller, proxy, classes, opts) {
    classes = classes || [];
    var pClasses = proxy[CONST.CLASS_PROPERTY] || [];
    var beforeLen = pClasses.length;
    if (!beforeLen || !classes.length) {
        if (opts) {
            MW320_CHECK && delete opts.apiName;
            proxy.applyProperties(opts);
        }
        return;
    }
    classes = _.isString(classes) ? classes.split(/\s+/) : classes;
    var newClasses = _.difference(pClasses, classes);
    if (beforeLen === newClasses.length) {
        if (opts) {
            MW320_CHECK && delete opts.apiName;
            proxy.applyProperties(opts);
        }
        return;
    }
    processStyle(controller, proxy, newClasses, opts, RESET);
};

exports.resetClass = function(controller, proxy, classes, opts) {
    classes = classes || [];
    classes = _.isString(classes) ? classes.split(/\s+/) : classes;
    processStyle(controller, proxy, classes, opts, RESET);
};

exports.createWidget = function(id, name, args) {
    if ("undefined" != typeof name && null !== name && _.isObject(name) && !_.isString(name)) {
        args = name;
        name = DEFAULT_WIDGET;
    }
    return new (require("alloy/widgets/" + id + "/controllers/" + (name || DEFAULT_WIDGET)))(args);
};

exports.createController = function(name, args) {
    return new (require("alloy/controllers/" + name))(args);
};

exports.createModel = function(name, args) {
    return new (require("alloy/models/" + ucfirst(name)).Model)(args);
};

exports.createCollection = function(name, args) {
    return new (require("alloy/models/" + ucfirst(name)).Collection)(args);
};

exports.isTablet = function() {
    return "ipad" === Ti.Platform.osname;
}();

exports.isHandheld = !exports.isTablet;

exports.Globals = {};

exports.Models = {};

exports.Models.instance = function(name) {
    return exports.Models[name] || (exports.Models[name] = exports.createModel(name));
};

exports.Collections = {};

exports.Collections.instance = function(name) {
    return exports.Collections[name] || (exports.Collections[name] = exports.createCollection(name));
};

exports.CFG = require("alloy/CFG");