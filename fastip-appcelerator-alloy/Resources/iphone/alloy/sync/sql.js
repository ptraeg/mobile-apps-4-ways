function S4() {
    return (0 | 65536 * (1 + Math.random())).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function Migrator(config, transactionDb) {
    this.db = transactionDb;
    this.dbname = config.adapter.db_name;
    this.table = config.adapter.collection_name;
    this.idAttribute = config.adapter.idAttribute;
    this.column = function(name) {
        var parts = name.split(/\s+/);
        var type = parts[0];
        switch (type.toLowerCase()) {
          case "string":
          case "varchar":
          case "date":
          case "datetime":
            Ti.API.warn('"' + type + '" is not a valid sqlite field, using TEXT instead');

          case "text":
            type = "TEXT";
            break;

          case "int":
          case "tinyint":
          case "smallint":
          case "bigint":
          case "boolean":
            Ti.API.warn('"' + type + '" is not a valid sqlite field, using INTEGER instead');

          case "integer":
            type = "INTEGER";
            break;

          case "double":
          case "float":
          case "decimal":
          case "number":
            Ti.API.warn('"' + name + '" is not a valid sqlite field, using REAL instead');

          case "real":
            type = "REAL";
            break;

          case "blob":
            type = "BLOB";
            break;

          case "null":
            type = "NULL";
            break;

          default:
            type = "TEXT";
        }
        parts[0] = type;
        return parts.join(" ");
    };
    this.createTable = function(config) {
        var columns = [];
        var found = false;
        for (var k in config.columns) {
            k === this.idAttribute && (found = true);
            columns.push(k + " " + this.column(config.columns[k]));
        }
        found || this.idAttribute !== ALLOY_ID_DEFAULT || columns.push(ALLOY_ID_DEFAULT + " TEXT UNIQUE");
        var sql = "CREATE TABLE IF NOT EXISTS " + this.table + " ( " + columns.join(",") + ")";
        this.db.execute(sql);
    };
    this.dropTable = function() {
        this.db.execute("DROP TABLE IF EXISTS " + this.table);
    };
    this.insertRow = function(columnValues) {
        var columns = [];
        var values = [];
        var qs = [];
        var found = false;
        for (var key in columnValues) {
            key === this.idAttribute && (found = true);
            columns.push(key);
            values.push(columnValues[key]);
            qs.push("?");
        }
        if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
            columns.push(this.idAttribute);
            values.push(guid());
            qs.push("?");
        }
        this.db.execute("INSERT INTO " + this.table + " (" + columns.join(",") + ") VALUES (" + qs.join(",") + ");", values);
    };
    this.deleteRow = function(columns) {
        var sql = "DELETE FROM " + this.table;
        var keys = _.keys(columns);
        var len = keys.length;
        var conditions = [];
        var values = [];
        len && (sql += " WHERE ");
        for (var i = 0; len > i; i++) {
            conditions.push(keys[i] + " = ?");
            values.push(columns[keys[i]]);
        }
        sql += conditions.join(" AND ");
        this.db.execute(sql, values);
    };
}

function Sync(method, model, opts) {
    var db, sql, table = model.config.adapter.collection_name, columns = model.config.columns, dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT, resp = null;
    switch (method) {
      case "create":
      case "update":
        resp = function() {
            var attrObj = {};
            if (!model.id) {
                model.id = model.idAttribute === ALLOY_ID_DEFAULT ? guid() : null;
                attrObj[model.idAttribute] = model.id;
                model.set(attrObj, {
                    silent: true
                });
            }
            var names = [], values = [], q = [];
            for (var k in columns) {
                names.push(k);
                values.push(model.get(k));
                q.push("?");
            }
            sql = "REPLACE INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");";
            db = Ti.Database.open(dbName);
            db.execute("BEGIN;");
            db.execute(sql, values);
            if (null === model.id) {
                var sqlId = "SELECT last_insert_rowid();";
                var rs = db.execute(sqlId);
                if (rs && rs.isValidRow()) {
                    model.id = rs.field(0);
                    attrObj[model.idAttribute] = model.id;
                    model.set(attrObj, {
                        silent: true
                    });
                } else Ti.API.warn("Unable to get ID from database for model: " + model.toJSON());
                rs && rs.close();
            }
            db.execute("COMMIT;");
            db.close();
            return model.toJSON();
        }();
        break;

      case "read":
        opts.query && opts.id && Ti.API.warn('Both "query" and "id" options were specified for model.fetch(). "id" will be ignored.');
        sql = "SELECT * FROM " + table;
        opts.query ? sql = opts.query : opts.id && (sql += " WHERE " + model.idAttribute + " = " + opts.id);
        db = Ti.Database.open(dbName);
        var rs;
        rs = _.isString(sql) ? db.execute(sql) : db.execute(sql.statement, sql.params);
        var len = 0;
        var values = [];
        while (rs.isValidRow()) {
            var o = {};
            var fc = 0;
            fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
            _.times(fc, function(c) {
                var fn = rs.fieldName(c);
                o[fn] = rs.fieldByName(fn);
            });
            values.push(o);
            len++;
            rs.next();
        }
        rs.close();
        db.close();
        model.length = len;
        resp = 1 === len ? values[0] : values;
        break;

      case "delete":
        sql = "DELETE FROM " + table + " WHERE " + model.idAttribute + "=?";
        db = Ti.Database.open(dbName);
        db.execute(sql, model.id);
        db.close();
        model.id = null;
        resp = model.toJSON();
    }
    if (resp) {
        _.isFunction(opts.success) && opts.success(resp);
        "read" !== method || opts.silent || model.trigger("fetch", {
            fromAdapter: true
        });
    } else _.isFunction(opts.error) && opts.error(resp);
}

function GetMigrationFor(dbname, table) {
    var mid = null;
    var db = Ti.Database.open(dbname);
    db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT);");
    var rs = db.execute("SELECT latest FROM migrations where model = ?;", table);
    rs.isValidRow() && (mid = rs.field(0) + "");
    rs.close();
    db.close();
    return mid;
}

function Migrate(Model) {
    var migrations = Model.migrations || [];
    var lastMigration = {};
    migrations.length && migrations[migrations.length - 1](lastMigration);
    var config = Model.prototype.config;
    config.adapter.db_name = config.adapter.db_name || ALLOY_DB_DEFAULT;
    var migrator = new Migrator(config);
    var targetNumber = "undefined" == typeof config.adapter.migration || null === config.adapter.migration ? lastMigration.id : config.adapter.migration;
    if ("undefined" == typeof targetNumber || null === targetNumber) {
        var tmpDb = Ti.Database.open(config.adapter.db_name);
        migrator.db = tmpDb;
        migrator.createTable(config);
        tmpDb.close();
        return;
    }
    targetNumber += "";
    var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name);
    var direction;
    if (currentNumber === targetNumber) return;
    if (currentNumber && currentNumber > targetNumber) {
        direction = 0;
        migrations.reverse();
    } else direction = 1;
    db = Ti.Database.open(config.adapter.db_name);
    migrator.db = db;
    db.execute("BEGIN;");
    if (migrations.length) for (var i = 0; migrations.length > i; i++) {
        var migration = migrations[i];
        var context = {};
        migration(context);
        if (direction) {
            if (context.id > targetNumber) break;
            if (currentNumber >= context.id) continue;
        } else {
            if (targetNumber >= context.id) break;
            if (context.id > currentNumber) continue;
        }
        var funcName = direction ? "up" : "down";
        _.isFunction(context[funcName]) && context[funcName](migrator);
    } else migrator.createTable(config);
    db.execute("DELETE FROM migrations where model = ?", config.adapter.collection_name);
    db.execute("INSERT INTO migrations VALUES (?,?)", targetNumber, config.adapter.collection_name);
    db.execute("COMMIT;");
    db.close();
    migrator.db = null;
}

function installDatabase(config) {
    var dbFile = config.adapter.db_file;
    var table = config.adapter.collection_name;
    var rx = /(^|.*\/)([^\/]+)\.[^\/]+$/;
    var match = dbFile.match(rx);
    if (null === match) throw 'Invalid sql database filename "' + dbFile + '"';
    config.adapter.db_name = config.adapter.db_name || match[2];
    var dbName = config.adapter.db_name;
    Ti.API.debug('Installing sql database "' + dbFile + '" with name "' + dbName + '"');
    var db = Ti.Database.install(dbFile, dbName);
    if (false === config.adapter.remoteBackup && true) {
        Ti.API.debug('iCloud "do not backup" flag set for database "' + dbFile + '"');
        db.file.setRemoteBackup(false);
    }
    var rs = db.execute('pragma table_info("' + table + '");');
    var columns = {};
    while (rs.isValidRow()) {
        var cName = rs.fieldByName("name");
        var cType = rs.fieldByName("type");
        columns[cName] = cType;
        cName !== ALLOY_ID_DEFAULT || config.adapter.idAttribute || (config.adapter.idAttribute = ALLOY_ID_DEFAULT);
        rs.next();
    }
    config.columns = columns;
    rs.close();
    if (config.adapter.idAttribute) {
        if (!_.contains(_.keys(config.columns), config.adapter.idAttribute)) throw 'config.adapter.idAttribute "' + config.adapter.idAttribute + '" not found in list of columns for table "' + table + '"\n' + "columns: [" + _.keys(config.columns).join(",") + "]";
    } else {
        Ti.API.info('No config.adapter.idAttribute specified for table "' + table + '"');
        Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');
        var fullStrings = [], colStrings = [];
        _.each(config.columns, function(type, name) {
            colStrings.push(name);
            fullStrings.push(name + " " + type);
        });
        var colsString = colStrings.join(",");
        db.execute("ALTER TABLE " + table + " RENAME TO " + table + "_temp;");
        db.execute("CREATE TABLE " + table + "(" + fullStrings.join(",") + "," + ALLOY_ID_DEFAULT + " TEXT UNIQUE);");
        db.execute("INSERT INTO " + table + "(" + colsString + "," + ALLOY_ID_DEFAULT + ") SELECT " + colsString + ",CAST(_ROWID_ AS TEXT) FROM " + table + "_temp;");
        db.execute("DROP TABLE " + table + "_temp;");
        config.columns[ALLOY_ID_DEFAULT] = "TEXT UNIQUE";
        config.adapter.idAttribute = ALLOY_ID_DEFAULT;
    }
    db.close();
}

var _ = require("alloy/underscore")._;

var ALLOY_DB_DEFAULT = "_alloy_";

var ALLOY_ID_DEFAULT = "alloy_id";

var cache = {
    config: {},
    Model: {}
};

module.exports.beforeModelCreate = function(config, name) {
    if (cache.config[name]) return cache.config[name];
    if ("mobileweb" === Ti.Platform.osname || "undefined" == typeof Ti.Database) throw "No support for Titanium.Database in MobileWeb environment.";
    config.adapter.db_file && installDatabase(config);
    if (!config.adapter.idAttribute) {
        Ti.API.info('No config.adapter.idAttribute specified for table "' + config.adapter.collection_name + '"');
        Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');
        config.columns[ALLOY_ID_DEFAULT] = "TEXT UNIQUE";
        config.adapter.idAttribute = ALLOY_ID_DEFAULT;
    }
    cache.config[name] = config;
    return config;
};

module.exports.afterModelCreate = function(Model, name) {
    if (cache.Model[name]) return cache.Model[name];
    Model = Model || {};
    Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
    Migrate(Model);
    cache.Model[name] = Model;
    return Model;
};

module.exports.sync = Sync;