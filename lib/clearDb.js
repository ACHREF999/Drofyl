"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var schema_1 = require("./lib/schema");
lib_1.default.delete(schema_1.files).then(function (res) {
    console.log(res);
    return true;
});
