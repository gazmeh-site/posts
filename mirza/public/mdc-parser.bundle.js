var MirzaMdc = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/extend/index.js
  var require_extend = __commonJS({
    "node_modules/extend/index.js"(exports, module) {
      "use strict";
      var hasOwn = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;
      var defineProperty = Object.defineProperty;
      var gOPD = Object.getOwnPropertyDescriptor;
      var isArray = function isArray2(arr) {
        if (typeof Array.isArray === "function") {
          return Array.isArray(arr);
        }
        return toStr.call(arr) === "[object Array]";
      };
      var isPlainObject2 = function isPlainObject3(obj) {
        if (!obj || toStr.call(obj) !== "[object Object]") {
          return false;
        }
        var hasOwnConstructor = hasOwn.call(obj, "constructor");
        var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
          return false;
        }
        var key2;
        for (key2 in obj) {
        }
        return typeof key2 === "undefined" || hasOwn.call(obj, key2);
      };
      var setProperty = function setProperty2(target, options) {
        if (defineProperty && options.name === "__proto__") {
          defineProperty(target, options.name, {
            enumerable: true,
            configurable: true,
            value: options.newValue,
            writable: true
          });
        } else {
          target[options.name] = options.newValue;
        }
      };
      var getProperty = function getProperty2(obj, name) {
        if (name === "__proto__") {
          if (!hasOwn.call(obj, name)) {
            return void 0;
          } else if (gOPD) {
            return gOPD(obj, name).value;
          }
        }
        return obj[name];
      };
      module.exports = function extend2() {
        var options, name, src, copy, copyIsArray, clone;
        var target = arguments[0];
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (target == null || typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        for (; i < length; ++i) {
          options = arguments[i];
          if (options != null) {
            for (name in options) {
              src = getProperty(target, name);
              copy = getProperty(options, name);
              if (target !== copy) {
                if (deep && copy && (isPlainObject2(copy) || (copyIsArray = isArray(copy)))) {
                  if (copyIsArray) {
                    copyIsArray = false;
                    clone = src && isArray(src) ? src : [];
                  } else {
                    clone = src && isPlainObject2(src) ? src : {};
                  }
                  setProperty(target, { name, newValue: extend2(deep, clone, copy) });
                } else if (typeof copy !== "undefined") {
                  setProperty(target, { name, newValue: copy });
                }
              }
            }
          }
        }
        return target;
      };
    }
  });

  // entry.js
  var entry_exports = {};
  __export(entry_exports, {
    parse: () => parse3
  });

  // node_modules/bail/index.js
  function bail(error) {
    if (error) {
      throw error;
    }
  }

  // node_modules/unified/lib/index.js
  var import_extend = __toESM(require_extend(), 1);

  // node_modules/devlop/lib/default.js
  function ok() {
  }

  // node_modules/is-plain-obj/index.js
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  }

  // node_modules/trough/lib/index.js
  function trough() {
    const fns = [];
    const pipeline = { run, use };
    return pipeline;
    function run(...values) {
      let middlewareIndex = -1;
      const callback = values.pop();
      if (typeof callback !== "function") {
        throw new TypeError("Expected function as last argument, not " + callback);
      }
      next(null, ...values);
      function next(error, ...output) {
        const fn = fns[++middlewareIndex];
        let index2 = -1;
        if (error) {
          callback(error);
          return;
        }
        while (++index2 < values.length) {
          if (output[index2] === null || output[index2] === void 0) {
            output[index2] = values[index2];
          }
        }
        values = output;
        if (fn) {
          wrap(fn, next)(...output);
        } else {
          callback(null, ...output);
        }
      }
    }
    function use(middelware) {
      if (typeof middelware !== "function") {
        throw new TypeError(
          "Expected `middelware` to be a function, not " + middelware
        );
      }
      fns.push(middelware);
      return pipeline;
    }
  }
  function wrap(middleware, callback) {
    let called;
    return wrapped;
    function wrapped(...parameters) {
      const fnExpectsCallback = middleware.length > parameters.length;
      let result;
      if (fnExpectsCallback) {
        parameters.push(done);
      }
      try {
        result = middleware.apply(this, parameters);
      } catch (error) {
        const exception = (
          /** @type {Error} */
          error
        );
        if (fnExpectsCallback && called) {
          throw exception;
        }
        return done(exception);
      }
      if (!fnExpectsCallback) {
        if (result && result.then && typeof result.then === "function") {
          result.then(then, done);
        } else if (result instanceof Error) {
          done(result);
        } else {
          then(result);
        }
      }
    }
    function done(error, ...output) {
      if (!called) {
        called = true;
        callback(error, ...output);
      }
    }
    function then(value) {
      done(null, value);
    }
  }

  // node_modules/unist-util-stringify-position/lib/index.js
  function stringifyPosition(value) {
    if (!value || typeof value !== "object") {
      return "";
    }
    if ("position" in value || "type" in value) {
      return position(value.position);
    }
    if ("start" in value || "end" in value) {
      return position(value);
    }
    if ("line" in value || "column" in value) {
      return point(value);
    }
    return "";
  }
  function point(point4) {
    return index(point4 && point4.line) + ":" + index(point4 && point4.column);
  }
  function position(pos) {
    return point(pos && pos.start) + "-" + point(pos && pos.end);
  }
  function index(value) {
    return value && typeof value === "number" ? value : 1;
  }

  // node_modules/vfile-message/lib/index.js
  var VFileMessage = class extends Error {
    /**
     * Create a message for `reason`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {Options | null | undefined} [options]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns
     *   Instance of `VFileMessage`.
     */
    // eslint-disable-next-line complexity
    constructor(causeOrReason, optionsOrParentOrPlace, origin) {
      super();
      if (typeof optionsOrParentOrPlace === "string") {
        origin = optionsOrParentOrPlace;
        optionsOrParentOrPlace = void 0;
      }
      let reason = "";
      let options = {};
      let legacyCause = false;
      if (optionsOrParentOrPlace) {
        if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("type" in optionsOrParentOrPlace) {
          options = {
            ancestors: [optionsOrParentOrPlace],
            place: optionsOrParentOrPlace.position
          };
        } else {
          options = { ...optionsOrParentOrPlace };
        }
      }
      if (typeof causeOrReason === "string") {
        reason = causeOrReason;
      } else if (!options.cause && causeOrReason) {
        legacyCause = true;
        reason = causeOrReason.message;
        options.cause = causeOrReason;
      }
      if (!options.ruleId && !options.source && typeof origin === "string") {
        const index2 = origin.indexOf(":");
        if (index2 === -1) {
          options.ruleId = origin;
        } else {
          options.source = origin.slice(0, index2);
          options.ruleId = origin.slice(index2 + 1);
        }
      }
      if (!options.place && options.ancestors && options.ancestors) {
        const parent = options.ancestors[options.ancestors.length - 1];
        if (parent) {
          options.place = parent.position;
        }
      }
      const start = options.place && "start" in options.place ? options.place.start : options.place;
      this.ancestors = options.ancestors || void 0;
      this.cause = options.cause || void 0;
      this.column = start ? start.column : void 0;
      this.fatal = void 0;
      this.file = "";
      this.message = reason;
      this.line = start ? start.line : void 0;
      this.name = stringifyPosition(options.place) || "1:1";
      this.place = options.place || void 0;
      this.reason = this.message;
      this.ruleId = options.ruleId || void 0;
      this.source = options.source || void 0;
      this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
      this.actual = void 0;
      this.expected = void 0;
      this.note = void 0;
      this.url = void 0;
    }
  };
  VFileMessage.prototype.file = "";
  VFileMessage.prototype.name = "";
  VFileMessage.prototype.reason = "";
  VFileMessage.prototype.message = "";
  VFileMessage.prototype.stack = "";
  VFileMessage.prototype.column = void 0;
  VFileMessage.prototype.line = void 0;
  VFileMessage.prototype.ancestors = void 0;
  VFileMessage.prototype.cause = void 0;
  VFileMessage.prototype.fatal = void 0;
  VFileMessage.prototype.place = void 0;
  VFileMessage.prototype.ruleId = void 0;
  VFileMessage.prototype.source = void 0;

  // node_modules/vfile/lib/minpath.browser.js
  var minpath = { basename, dirname, extname, join, sep: "/" };
  function basename(path2, extname2) {
    if (extname2 !== void 0 && typeof extname2 !== "string") {
      throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path2);
    let start = 0;
    let end = -1;
    let index2 = path2.length;
    let seenNonSlash;
    if (extname2 === void 0 || extname2.length === 0 || extname2.length > path2.length) {
      while (index2--) {
        if (path2.codePointAt(index2) === 47) {
          if (seenNonSlash) {
            start = index2 + 1;
            break;
          }
        } else if (end < 0) {
          seenNonSlash = true;
          end = index2 + 1;
        }
      }
      return end < 0 ? "" : path2.slice(start, end);
    }
    if (extname2 === path2) {
      return "";
    }
    let firstNonSlashEnd = -1;
    let extnameIndex = extname2.length - 1;
    while (index2--) {
      if (path2.codePointAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd < 0) {
          seenNonSlash = true;
          firstNonSlashEnd = index2 + 1;
        }
        if (extnameIndex > -1) {
          if (path2.codePointAt(index2) === extname2.codePointAt(extnameIndex--)) {
            if (extnameIndex < 0) {
              end = index2;
            }
          } else {
            extnameIndex = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) {
      end = firstNonSlashEnd;
    } else if (end < 0) {
      end = path2.length;
    }
    return path2.slice(start, end);
  }
  function dirname(path2) {
    assertPath(path2);
    if (path2.length === 0) {
      return ".";
    }
    let end = -1;
    let index2 = path2.length;
    let unmatchedSlash;
    while (--index2) {
      if (path2.codePointAt(index2) === 47) {
        if (unmatchedSlash) {
          end = index2;
          break;
        }
      } else if (!unmatchedSlash) {
        unmatchedSlash = true;
      }
    }
    return end < 0 ? path2.codePointAt(0) === 47 ? "/" : "." : end === 1 && path2.codePointAt(0) === 47 ? "//" : path2.slice(0, end);
  }
  function extname(path2) {
    assertPath(path2);
    let index2 = path2.length;
    let end = -1;
    let startPart = 0;
    let startDot = -1;
    let preDotState = 0;
    let unmatchedSlash;
    while (index2--) {
      const code4 = path2.codePointAt(index2);
      if (code4 === 47) {
        if (unmatchedSlash) {
          startPart = index2 + 1;
          break;
        }
        continue;
      }
      if (end < 0) {
        unmatchedSlash = true;
        end = index2 + 1;
      }
      if (code4 === 46) {
        if (startDot < 0) {
          startDot = index2;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot > -1) {
        preDotState = -1;
      }
    }
    if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
    preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path2.slice(startDot, end);
  }
  function join(...segments) {
    let index2 = -1;
    let joined;
    while (++index2 < segments.length) {
      assertPath(segments[index2]);
      if (segments[index2]) {
        joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
      }
    }
    return joined === void 0 ? "." : normalize(joined);
  }
  function normalize(path2) {
    assertPath(path2);
    const absolute = path2.codePointAt(0) === 47;
    let value = normalizeString(path2, !absolute);
    if (value.length === 0 && !absolute) {
      value = ".";
    }
    if (value.length > 0 && path2.codePointAt(path2.length - 1) === 47) {
      value += "/";
    }
    return absolute ? "/" + value : value;
  }
  function normalizeString(path2, allowAboveRoot) {
    let result = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let index2 = -1;
    let code4;
    let lastSlashIndex;
    while (++index2 <= path2.length) {
      if (index2 < path2.length) {
        code4 = path2.codePointAt(index2);
      } else if (code4 === 47) {
        break;
      } else {
        code4 = 47;
      }
      if (code4 === 47) {
        if (lastSlash === index2 - 1 || dots === 1) {
        } else if (lastSlash !== index2 - 1 && dots === 2) {
          if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
            if (result.length > 2) {
              lastSlashIndex = result.lastIndexOf("/");
              if (lastSlashIndex !== result.length - 1) {
                if (lastSlashIndex < 0) {
                  result = "";
                  lastSegmentLength = 0;
                } else {
                  result = result.slice(0, lastSlashIndex);
                  lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
                }
                lastSlash = index2;
                dots = 0;
                continue;
              }
            } else if (result.length > 0) {
              result = "";
              lastSegmentLength = 0;
              lastSlash = index2;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            result = result.length > 0 ? result + "/.." : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (result.length > 0) {
            result += "/" + path2.slice(lastSlash + 1, index2);
          } else {
            result = path2.slice(lastSlash + 1, index2);
          }
          lastSegmentLength = index2 - lastSlash - 1;
        }
        lastSlash = index2;
        dots = 0;
      } else if (code4 === 46 && dots > -1) {
        dots++;
      } else {
        dots = -1;
      }
    }
    return result;
  }
  function assertPath(path2) {
    if (typeof path2 !== "string") {
      throw new TypeError(
        "Path must be a string. Received " + JSON.stringify(path2)
      );
    }
  }

  // node_modules/vfile/lib/minproc.browser.js
  var minproc = { cwd };
  function cwd() {
    return "/";
  }

  // node_modules/vfile/lib/minurl.shared.js
  function isUrl(fileUrlOrPath) {
    return Boolean(
      fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
      fileUrlOrPath.auth === void 0
    );
  }

  // node_modules/vfile/lib/minurl.browser.js
  function urlToPath(path2) {
    if (typeof path2 === "string") {
      path2 = new URL(path2);
    } else if (!isUrl(path2)) {
      const error = new TypeError(
        'The "path" argument must be of type string or an instance of URL. Received `' + path2 + "`"
      );
      error.code = "ERR_INVALID_ARG_TYPE";
      throw error;
    }
    if (path2.protocol !== "file:") {
      const error = new TypeError("The URL must be of scheme file");
      error.code = "ERR_INVALID_URL_SCHEME";
      throw error;
    }
    return getPathFromURLPosix(path2);
  }
  function getPathFromURLPosix(url) {
    if (url.hostname !== "") {
      const error = new TypeError(
        'File URL host must be "localhost" or empty on darwin'
      );
      error.code = "ERR_INVALID_FILE_URL_HOST";
      throw error;
    }
    const pathname = url.pathname;
    let index2 = -1;
    while (++index2 < pathname.length) {
      if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
        const third = pathname.codePointAt(index2 + 2);
        if (third === 70 || third === 102) {
          const error = new TypeError(
            "File URL path must not include encoded / characters"
          );
          error.code = "ERR_INVALID_FILE_URL_PATH";
          throw error;
        }
      }
    }
    return decodeURIComponent(pathname);
  }

  // node_modules/vfile/lib/index.js
  var order = (
    /** @type {const} */
    [
      "history",
      "path",
      "basename",
      "stem",
      "extname",
      "dirname"
    ]
  );
  var VFile = class {
    /**
     * Create a new virtual file.
     *
     * `options` is treated as:
     *
     * *   `string` or `Uint8Array` — `{value: options}`
     * *   `URL` — `{path: options}`
     * *   `VFile` — shallow copies its data over to the new file
     * *   `object` — all fields are shallow copied over to the new file
     *
     * Path related fields are set in the following order (least specific to
     * most specific): `history`, `path`, `basename`, `stem`, `extname`,
     * `dirname`.
     *
     * You cannot set `dirname` or `extname` without setting either `history`,
     * `path`, `basename`, or `stem` too.
     *
     * @param {Compatible | null | undefined} [value]
     *   File value.
     * @returns
     *   New instance.
     */
    constructor(value) {
      let options;
      if (!value) {
        options = {};
      } else if (isUrl(value)) {
        options = { path: value };
      } else if (typeof value === "string" || isUint8Array(value)) {
        options = { value };
      } else {
        options = value;
      }
      this.cwd = "cwd" in options ? "" : minproc.cwd();
      this.data = {};
      this.history = [];
      this.messages = [];
      this.value;
      this.map;
      this.result;
      this.stored;
      let index2 = -1;
      while (++index2 < order.length) {
        const field2 = order[index2];
        if (field2 in options && options[field2] !== void 0 && options[field2] !== null) {
          this[field2] = field2 === "history" ? [...options[field2]] : options[field2];
        }
      }
      let field;
      for (field in options) {
        if (!order.includes(field)) {
          this[field] = options[field];
        }
      }
    }
    /**
     * Get the basename (including extname) (example: `'index.min.js'`).
     *
     * @returns {string | undefined}
     *   Basename.
     */
    get basename() {
      return typeof this.path === "string" ? minpath.basename(this.path) : void 0;
    }
    /**
     * Set basename (including extname) (`'index.min.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} basename
     *   Basename.
     * @returns {undefined}
     *   Nothing.
     */
    set basename(basename2) {
      assertNonEmpty(basename2, "basename");
      assertPart(basename2, "basename");
      this.path = minpath.join(this.dirname || "", basename2);
    }
    /**
     * Get the parent path (example: `'~'`).
     *
     * @returns {string | undefined}
     *   Dirname.
     */
    get dirname() {
      return typeof this.path === "string" ? minpath.dirname(this.path) : void 0;
    }
    /**
     * Set the parent path (example: `'~'`).
     *
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} dirname
     *   Dirname.
     * @returns {undefined}
     *   Nothing.
     */
    set dirname(dirname2) {
      assertPath2(this.basename, "dirname");
      this.path = minpath.join(dirname2 || "", this.basename);
    }
    /**
     * Get the extname (including dot) (example: `'.js'`).
     *
     * @returns {string | undefined}
     *   Extname.
     */
    get extname() {
      return typeof this.path === "string" ? minpath.extname(this.path) : void 0;
    }
    /**
     * Set the extname (including dot) (example: `'.js'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be set if there’s no `path` yet.
     *
     * @param {string | undefined} extname
     *   Extname.
     * @returns {undefined}
     *   Nothing.
     */
    set extname(extname2) {
      assertPart(extname2, "extname");
      assertPath2(this.dirname, "extname");
      if (extname2) {
        if (extname2.codePointAt(0) !== 46) {
          throw new Error("`extname` must start with `.`");
        }
        if (extname2.includes(".", 1)) {
          throw new Error("`extname` cannot contain multiple dots");
        }
      }
      this.path = minpath.join(this.dirname, this.stem + (extname2 || ""));
    }
    /**
     * Get the full path (example: `'~/index.min.js'`).
     *
     * @returns {string}
     *   Path.
     */
    get path() {
      return this.history[this.history.length - 1];
    }
    /**
     * Set the full path (example: `'~/index.min.js'`).
     *
     * Cannot be nullified.
     * You can set a file URL (a `URL` object with a `file:` protocol) which will
     * be turned into a path with `url.fileURLToPath`.
     *
     * @param {URL | string} path
     *   Path.
     * @returns {undefined}
     *   Nothing.
     */
    set path(path2) {
      if (isUrl(path2)) {
        path2 = urlToPath(path2);
      }
      assertNonEmpty(path2, "path");
      if (this.path !== path2) {
        this.history.push(path2);
      }
    }
    /**
     * Get the stem (basename w/o extname) (example: `'index.min'`).
     *
     * @returns {string | undefined}
     *   Stem.
     */
    get stem() {
      return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : void 0;
    }
    /**
     * Set the stem (basename w/o extname) (example: `'index.min'`).
     *
     * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
     * on windows).
     * Cannot be nullified (use `file.path = file.dirname` instead).
     *
     * @param {string} stem
     *   Stem.
     * @returns {undefined}
     *   Nothing.
     */
    set stem(stem) {
      assertNonEmpty(stem, "stem");
      assertPart(stem, "stem");
      this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
    }
    // Normal prototypal methods.
    /**
     * Create a fatal message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `true` (error; file not usable)
     * and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {never}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {never}
     *   Never.
     * @throws {VFileMessage}
     *   Message.
     */
    fail(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = true;
      throw message;
    }
    /**
     * Create an info message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `undefined` (info; change
     * likely not needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    info(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
      message.fatal = void 0;
      return message;
    }
    /**
     * Create a message for `reason` associated with the file.
     *
     * The `fatal` field of the message is set to `false` (warning; change may be
     * needed) and the `file` field is set to the current file path.
     * The message is added to the `messages` field on `file`.
     *
     * > 🪦 **Note**: also has obsolete signatures.
     *
     * @overload
     * @param {string} reason
     * @param {MessageOptions | null | undefined} [options]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {string} reason
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Node | NodeLike | null | undefined} parent
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {Point | Position | null | undefined} place
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @overload
     * @param {Error | VFileMessage} cause
     * @param {string | null | undefined} [origin]
     * @returns {VFileMessage}
     *
     * @param {Error | VFileMessage | string} causeOrReason
     *   Reason for message, should use markdown.
     * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
     *   Configuration (optional).
     * @param {string | null | undefined} [origin]
     *   Place in code where the message originates (example:
     *   `'my-package:my-rule'` or `'my-rule'`).
     * @returns {VFileMessage}
     *   Message.
     */
    message(causeOrReason, optionsOrParentOrPlace, origin) {
      const message = new VFileMessage(
        // @ts-expect-error: the overloads are fine.
        causeOrReason,
        optionsOrParentOrPlace,
        origin
      );
      if (this.path) {
        message.name = this.path + ":" + message.name;
        message.file = this.path;
      }
      message.fatal = false;
      this.messages.push(message);
      return message;
    }
    /**
     * Serialize the file.
     *
     * > **Note**: which encodings are supported depends on the engine.
     * > For info on Node.js, see:
     * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
     *
     * @param {string | null | undefined} [encoding='utf8']
     *   Character encoding to understand `value` as when it’s a `Uint8Array`
     *   (default: `'utf-8'`).
     * @returns {string}
     *   Serialized file.
     */
    toString(encoding) {
      if (this.value === void 0) {
        return "";
      }
      if (typeof this.value === "string") {
        return this.value;
      }
      const decoder = new TextDecoder(encoding || void 0);
      return decoder.decode(this.value);
    }
  };
  function assertPart(part, name) {
    if (part && part.includes(minpath.sep)) {
      throw new Error(
        "`" + name + "` cannot be a path: did not expect `" + minpath.sep + "`"
      );
    }
  }
  function assertNonEmpty(part, name) {
    if (!part) {
      throw new Error("`" + name + "` cannot be empty");
    }
  }
  function assertPath2(path2, name) {
    if (!path2) {
      throw new Error("Setting `" + name + "` requires `path` to be set too");
    }
  }
  function isUint8Array(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/unified/lib/callable-instance.js
  var CallableInstance = (
    /**
     * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
     */
    /** @type {unknown} */
    /**
     * @this {Function}
     * @param {string | symbol} property
     * @returns {(...parameters: Array<unknown>) => unknown}
     */
    (function(property) {
      const self2 = this;
      const constr = self2.constructor;
      const proto = (
        /** @type {Record<string | symbol, Function>} */
        // Prototypes do exist.
        // type-coverage:ignore-next-line
        constr.prototype
      );
      const value = proto[property];
      const apply = function() {
        return value.apply(apply, arguments);
      };
      Object.setPrototypeOf(apply, proto);
      return apply;
    })
  );

  // node_modules/unified/lib/index.js
  var own = {}.hasOwnProperty;
  var Processor = class _Processor extends CallableInstance {
    /**
     * Create a processor.
     */
    constructor() {
      super("copy");
      this.Compiler = void 0;
      this.Parser = void 0;
      this.attachers = [];
      this.compiler = void 0;
      this.freezeIndex = -1;
      this.frozen = void 0;
      this.namespace = {};
      this.parser = void 0;
      this.transformers = trough();
    }
    /**
     * Copy a processor.
     *
     * @deprecated
     *   This is a private internal method and should not be used.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   New *unfrozen* processor ({@linkcode Processor}) that is
     *   configured to work the same as its ancestor.
     *   When the descendant processor is configured in the future it does not
     *   affect the ancestral processor.
     */
    copy() {
      const destination = (
        /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
        new _Processor()
      );
      let index2 = -1;
      while (++index2 < this.attachers.length) {
        const attacher = this.attachers[index2];
        destination.use(...attacher);
      }
      destination.data((0, import_extend.default)(true, {}, this.namespace));
      return destination;
    }
    /**
     * Configure the processor with info available to all plugins.
     * Information is stored in an object.
     *
     * Typically, options can be given to a specific plugin, but sometimes it
     * makes sense to have information shared with several plugins.
     * For example, a list of HTML elements that are self-closing, which is
     * needed during all phases.
     *
     * > **Note**: setting information cannot occur on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * > **Note**: to register custom data in TypeScript, augment the
     * > {@linkcode Data} interface.
     *
     * @example
     *   This example show how to get and set info:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   const processor = unified().data('alpha', 'bravo')
     *
     *   processor.data('alpha') // => 'bravo'
     *
     *   processor.data() // => {alpha: 'bravo'}
     *
     *   processor.data({charlie: 'delta'})
     *
     *   processor.data() // => {charlie: 'delta'}
     *   ```
     *
     * @template {keyof Data} Key
     *
     * @overload
     * @returns {Data}
     *
     * @overload
     * @param {Data} dataset
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Key} key
     * @returns {Data[Key]}
     *
     * @overload
     * @param {Key} key
     * @param {Data[Key]} value
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @param {Data | Key} [key]
     *   Key to get or set, or entire dataset to set, or nothing to get the
     *   entire dataset (optional).
     * @param {Data[Key]} [value]
     *   Value to set (optional).
     * @returns {unknown}
     *   The current processor when setting, the value at `key` when getting, or
     *   the entire dataset when getting without key.
     */
    data(key2, value) {
      if (typeof key2 === "string") {
        if (arguments.length === 2) {
          assertUnfrozen("data", this.frozen);
          this.namespace[key2] = value;
          return this;
        }
        return own.call(this.namespace, key2) && this.namespace[key2] || void 0;
      }
      if (key2) {
        assertUnfrozen("data", this.frozen);
        this.namespace = key2;
        return this;
      }
      return this.namespace;
    }
    /**
     * Freeze a processor.
     *
     * Frozen processors are meant to be extended and not to be configured
     * directly.
     *
     * When a processor is frozen it cannot be unfrozen.
     * New processors working the same way can be created by calling the
     * processor.
     *
     * It’s possible to freeze processors explicitly by calling `.freeze()`.
     * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
     * `.stringify()`, `.process()`, or `.processSync()` are called.
     *
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   The current processor.
     */
    freeze() {
      if (this.frozen) {
        return this;
      }
      const self2 = (
        /** @type {Processor} */
        /** @type {unknown} */
        this
      );
      while (++this.freezeIndex < this.attachers.length) {
        const [attacher, ...options] = this.attachers[this.freezeIndex];
        if (options[0] === false) {
          continue;
        }
        if (options[0] === true) {
          options[0] = void 0;
        }
        const transformer = attacher.call(self2, ...options);
        if (typeof transformer === "function") {
          this.transformers.use(transformer);
        }
      }
      this.frozen = true;
      this.freezeIndex = Number.POSITIVE_INFINITY;
      return this;
    }
    /**
     * Parse text to a syntax tree.
     *
     * > **Note**: `parse` freezes the processor if not already *frozen*.
     *
     * > **Note**: `parse` performs the parse phase, not the run phase or other
     * > phases.
     *
     * @param {Compatible | undefined} [file]
     *   file to parse (optional); typically `string` or `VFile`; any value
     *   accepted as `x` in `new VFile(x)`.
     * @returns {ParseTree extends undefined ? Node : ParseTree}
     *   Syntax tree representing `file`.
     */
    parse(file) {
      this.freeze();
      const realFile = vfile(file);
      const parser = this.parser || this.Parser;
      assertParser("parse", parser);
      return parser(String(realFile), realFile);
    }
    /**
     * Process the given file as configured on the processor.
     *
     * > **Note**: `process` freezes the processor if not already *frozen*.
     *
     * > **Note**: `process` performs the parse, run, and stringify phases.
     *
     * @overload
     * @param {Compatible | undefined} file
     * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
     * @returns {undefined}
     *
     * @overload
     * @param {Compatible | undefined} [file]
     * @returns {Promise<VFileWithOutput<CompileResult>>}
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`]; any value accepted as
     *   `x` in `new VFile(x)`.
     * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
     *   Callback (optional).
     * @returns {Promise<VFile> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise a promise, rejected with a fatal error or resolved with the
     *   processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    process(file, done) {
      const self2 = this;
      this.freeze();
      assertParser("process", this.parser || this.Parser);
      assertCompiler("process", this.compiler || this.Compiler);
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        const realFile = vfile(file);
        const parseTree = (
          /** @type {HeadTree extends undefined ? Node : HeadTree} */
          /** @type {unknown} */
          self2.parse(realFile)
        );
        self2.run(parseTree, realFile, function(error, tree, file2) {
          if (error || !tree || !file2) {
            return realDone(error);
          }
          const compileTree = (
            /** @type {CompileTree extends undefined ? Node : CompileTree} */
            /** @type {unknown} */
            tree
          );
          const compileResult = self2.stringify(compileTree, file2);
          if (looksLikeAValue(compileResult)) {
            file2.value = compileResult;
          } else {
            file2.result = compileResult;
          }
          realDone(
            error,
            /** @type {VFileWithOutput<CompileResult>} */
            file2
          );
        });
        function realDone(error, file2) {
          if (error || !file2) {
            reject(error);
          } else if (resolve) {
            resolve(file2);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, file2);
          }
        }
      }
    }
    /**
     * Process the given file as configured on the processor.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > **Note**: `processSync` freezes the processor if not already *frozen*.
     *
     * > **Note**: `processSync` performs the parse, run, and stringify phases.
     *
     * @param {Compatible | undefined} [file]
     *   File (optional); typically `string` or `VFile`; any value accepted as
     *   `x` in `new VFile(x)`.
     * @returns {VFileWithOutput<CompileResult>}
     *   The processed file.
     *
     *   The parsed, transformed, and compiled value is available at
     *   `file.value` (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most
     *   > compilers return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    processSync(file) {
      let complete = false;
      let result;
      this.freeze();
      assertParser("processSync", this.parser || this.Parser);
      assertCompiler("processSync", this.compiler || this.Compiler);
      this.process(file, realDone);
      assertDone("processSync", "process", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, file2) {
        complete = true;
        bail(error);
        result = file2;
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * > **Note**: `run` freezes the processor if not already *frozen*.
     *
     * > **Note**: `run` performs the run phase, not other phases.
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} file
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
     * @returns {undefined}
     *
     * @overload
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     * @param {Compatible | undefined} [file]
     * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {(
     *   RunCallback<TailTree extends undefined ? Node : TailTree> |
     *   Compatible
     * )} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
     *   Callback (optional).
     * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
     *   Nothing if `done` is given.
     *   Otherwise, a promise rejected with a fatal error or resolved with the
     *   transformed tree.
     */
    run(tree, file, done) {
      assertNode(tree);
      this.freeze();
      const transformers = this.transformers;
      if (!done && typeof file === "function") {
        done = file;
        file = void 0;
      }
      return done ? executor(void 0, done) : new Promise(executor);
      function executor(resolve, reject) {
        ok(
          typeof file !== "function",
          "`file` can\u2019t be a `done` anymore, we checked"
        );
        const realFile = vfile(file);
        transformers.run(tree, realFile, realDone);
        function realDone(error, outputTree, file2) {
          const resultingTree = (
            /** @type {TailTree extends undefined ? Node : TailTree} */
            outputTree || tree
          );
          if (error) {
            reject(error);
          } else if (resolve) {
            resolve(resultingTree);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(void 0, resultingTree, file2);
          }
        }
      }
    }
    /**
     * Run *transformers* on a syntax tree.
     *
     * An error is thrown if asynchronous transforms are configured.
     *
     * > **Note**: `runSync` freezes the processor if not already *frozen*.
     *
     * > **Note**: `runSync` performs the run phase, not other phases.
     *
     * @param {HeadTree extends undefined ? Node : HeadTree} tree
     *   Tree to transform and inspect.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {TailTree extends undefined ? Node : TailTree}
     *   Transformed tree.
     */
    runSync(tree, file) {
      let complete = false;
      let result;
      this.run(tree, file, realDone);
      assertDone("runSync", "run", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, tree2) {
        bail(error);
        result = tree2;
        complete = true;
      }
    }
    /**
     * Compile a syntax tree.
     *
     * > **Note**: `stringify` freezes the processor if not already *frozen*.
     *
     * > **Note**: `stringify` performs the stringify phase, not the run phase
     * > or other phases.
     *
     * @param {CompileTree extends undefined ? Node : CompileTree} tree
     *   Tree to compile.
     * @param {Compatible | undefined} [file]
     *   File associated with `node` (optional); any value accepted as `x` in
     *   `new VFile(x)`.
     * @returns {CompileResult extends undefined ? Value : CompileResult}
     *   Textual representation of the tree (see note).
     *
     *   > **Note**: unified typically compiles by serializing: most compilers
     *   > return `string` (or `Uint8Array`).
     *   > Some compilers, such as the one configured with
     *   > [`rehype-react`][rehype-react], return other values (in this case, a
     *   > React tree).
     *   > If you’re using a compiler that doesn’t serialize, expect different
     *   > result values.
     *   >
     *   > To register custom results in TypeScript, add them to
     *   > {@linkcode CompileResultMap}.
     *
     *   [rehype-react]: https://github.com/rehypejs/rehype-react
     */
    stringify(tree, file) {
      this.freeze();
      const realFile = vfile(file);
      const compiler2 = this.compiler || this.Compiler;
      assertCompiler("stringify", compiler2);
      assertNode(tree);
      return compiler2(tree, realFile);
    }
    /**
     * Configure the processor to use a plugin, a list of usable values, or a
     * preset.
     *
     * If the processor is already using a plugin, the previous plugin
     * configuration is changed based on the options that are passed in.
     * In other words, the plugin is not added a second time.
     *
     * > **Note**: `use` cannot be called on *frozen* processors.
     * > Call the processor first to create a new unfrozen processor.
     *
     * @example
     *   There are many ways to pass plugins to `.use()`.
     *   This example gives an overview:
     *
     *   ```js
     *   import {unified} from 'unified'
     *
     *   unified()
     *     // Plugin with options:
     *     .use(pluginA, {x: true, y: true})
     *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
     *     .use(pluginA, {y: false, z: true})
     *     // Plugins:
     *     .use([pluginB, pluginC])
     *     // Two plugins, the second with options:
     *     .use([pluginD, [pluginE, {}]])
     *     // Preset with plugins and settings:
     *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
     *     // Settings only:
     *     .use({settings: {position: false}})
     *   ```
     *
     * @template {Array<unknown>} [Parameters=[]]
     * @template {Node | string | undefined} [Input=undefined]
     * @template [Output=Input]
     *
     * @overload
     * @param {Preset | null | undefined} [preset]
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {PluggableList} list
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *
     * @overload
     * @param {Plugin<Parameters, Input, Output>} plugin
     * @param {...(Parameters | [boolean])} parameters
     * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
     *
     * @param {PluggableList | Plugin | Preset | null | undefined} value
     *   Usable value.
     * @param {...unknown} parameters
     *   Parameters, when a plugin is given as a usable value.
     * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
     *   Current processor.
     */
    use(value, ...parameters) {
      const attachers = this.attachers;
      const namespace = this.namespace;
      assertUnfrozen("use", this.frozen);
      if (value === null || value === void 0) {
      } else if (typeof value === "function") {
        addPlugin(value, parameters);
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          addList(value);
        } else {
          addPreset(value);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value + "`");
      }
      return this;
      function add(value2) {
        if (typeof value2 === "function") {
          addPlugin(value2, []);
        } else if (typeof value2 === "object") {
          if (Array.isArray(value2)) {
            const [plugin, ...parameters2] = (
              /** @type {PluginTuple<Array<unknown>>} */
              value2
            );
            addPlugin(plugin, parameters2);
          } else {
            addPreset(value2);
          }
        } else {
          throw new TypeError("Expected usable value, not `" + value2 + "`");
        }
      }
      function addPreset(result) {
        if (!("plugins" in result) && !("settings" in result)) {
          throw new Error(
            "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
          );
        }
        addList(result.plugins);
        if (result.settings) {
          namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
        }
      }
      function addList(plugins) {
        let index2 = -1;
        if (plugins === null || plugins === void 0) {
        } else if (Array.isArray(plugins)) {
          while (++index2 < plugins.length) {
            const thing = plugins[index2];
            add(thing);
          }
        } else {
          throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
        }
      }
      function addPlugin(plugin, parameters2) {
        let index2 = -1;
        let entryIndex = -1;
        while (++index2 < attachers.length) {
          if (attachers[index2][0] === plugin) {
            entryIndex = index2;
            break;
          }
        }
        if (entryIndex === -1) {
          attachers.push([plugin, ...parameters2]);
        } else if (parameters2.length > 0) {
          let [primary, ...rest] = parameters2;
          const currentPrimary = attachers[entryIndex][1];
          if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
            primary = (0, import_extend.default)(true, currentPrimary, primary);
          }
          attachers[entryIndex] = [plugin, primary, ...rest];
        }
      }
    }
  };
  var unified = new Processor().freeze();
  function assertParser(name, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name + "` without `parser`");
    }
  }
  function assertCompiler(name, value) {
    if (typeof value !== "function") {
      throw new TypeError("Cannot `" + name + "` without `compiler`");
    }
  }
  function assertUnfrozen(name, frozen) {
    if (frozen) {
      throw new Error(
        "Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
      );
    }
  }
  function assertNode(node2) {
    if (!isPlainObject(node2) || typeof node2.type !== "string") {
      throw new TypeError("Expected node, got `" + node2 + "`");
    }
  }
  function assertDone(name, asyncName, complete) {
    if (!complete) {
      throw new Error(
        "`" + name + "` finished async. Use `" + asyncName + "` instead"
      );
    }
  }
  function vfile(value) {
    return looksLikeAVFile(value) ? value : new VFile(value);
  }
  function looksLikeAVFile(value) {
    return Boolean(
      value && typeof value === "object" && "message" in value && "messages" in value
    );
  }
  function looksLikeAValue(value) {
    return typeof value === "string" || isUint8Array2(value);
  }
  function isUint8Array2(value) {
    return Boolean(
      value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
    );
  }

  // node_modules/mdast-util-to-string/lib/index.js
  var emptyOptions = {};
  function toString(value, options) {
    const settings = options || emptyOptions;
    const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
    const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
    return one(value, includeImageAlt, includeHtml);
  }
  function one(value, includeImageAlt, includeHtml) {
    if (node(value)) {
      if ("value" in value) {
        return value.type === "html" && !includeHtml ? "" : value.value;
      }
      if (includeImageAlt && "alt" in value && value.alt) {
        return value.alt;
      }
      if ("children" in value) {
        return all(value.children, includeImageAlt, includeHtml);
      }
    }
    if (Array.isArray(value)) {
      return all(value, includeImageAlt, includeHtml);
    }
    return "";
  }
  function all(values, includeImageAlt, includeHtml) {
    const result = [];
    let index2 = -1;
    while (++index2 < values.length) {
      result[index2] = one(values[index2], includeImageAlt, includeHtml);
    }
    return result.join("");
  }
  function node(value) {
    return Boolean(value && typeof value === "object");
  }

  // node_modules/decode-named-character-reference/index.dom.js
  var element = document.createElement("i");
  function decodeNamedCharacterReference(value) {
    const characterReference2 = "&" + value + ";";
    element.innerHTML = characterReference2;
    const character = element.textContent;
    if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") {
      return false;
    }
    return character === characterReference2 ? false : character;
  }

  // node_modules/micromark-util-chunked/index.js
  function splice(list4, start, remove, items) {
    const end = list4.length;
    let chunkStart = 0;
    let parameters;
    if (start < 0) {
      start = -start > end ? 0 : end + start;
    } else {
      start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0;
    if (items.length < 1e4) {
      parameters = Array.from(items);
      parameters.unshift(start, remove);
      list4.splice(...parameters);
    } else {
      if (remove) list4.splice(start, remove);
      while (chunkStart < items.length) {
        parameters = items.slice(chunkStart, chunkStart + 1e4);
        parameters.unshift(start, 0);
        list4.splice(...parameters);
        chunkStart += 1e4;
        start += 1e4;
      }
    }
  }
  function push(list4, items) {
    if (list4.length > 0) {
      splice(list4, list4.length, 0, items);
      return list4;
    }
    return items;
  }

  // node_modules/micromark-util-combine-extensions/index.js
  var hasOwnProperty = {}.hasOwnProperty;
  function combineExtensions(extensions) {
    const all3 = {};
    let index2 = -1;
    while (++index2 < extensions.length) {
      syntaxExtension(all3, extensions[index2]);
    }
    return all3;
  }
  function syntaxExtension(all3, extension2) {
    let hook;
    for (hook in extension2) {
      const maybe = hasOwnProperty.call(all3, hook) ? all3[hook] : void 0;
      const left = maybe || (all3[hook] = {});
      const right = extension2[hook];
      let code4;
      if (right) {
        for (code4 in right) {
          if (!hasOwnProperty.call(left, code4)) left[code4] = [];
          const value = right[code4];
          constructs(
            // @ts-expect-error Looks like a list.
            left[code4],
            Array.isArray(value) ? value : value ? [value] : []
          );
        }
      }
    }
  }
  function constructs(existing, list4) {
    let index2 = -1;
    const before = [];
    while (++index2 < list4.length) {
      ;
      (list4[index2].add === "after" ? existing : before).push(list4[index2]);
    }
    splice(existing, 0, 0, before);
  }

  // node_modules/micromark-util-decode-numeric-character-reference/index.js
  function decodeNumericCharacterReference(value, base) {
    const code4 = Number.parseInt(value, base);
    if (
      // C0 except for HT, LF, FF, CR, space.
      code4 < 9 || code4 === 11 || code4 > 13 && code4 < 32 || // Control character (DEL) of C0, and C1 controls.
      code4 > 126 && code4 < 160 || // Lone high surrogates and low surrogates.
      code4 > 55295 && code4 < 57344 || // Noncharacters.
      code4 > 64975 && code4 < 65008 || /* eslint-disable no-bitwise */
      (code4 & 65535) === 65535 || (code4 & 65535) === 65534 || /* eslint-enable no-bitwise */
      // Out of range
      code4 > 1114111
    ) {
      return "\uFFFD";
    }
    return String.fromCodePoint(code4);
  }

  // node_modules/micromark-util-normalize-identifier/index.js
  function normalizeIdentifier(value) {
    return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
  }

  // node_modules/micromark-util-character/index.js
  var asciiAlpha = regexCheck(/[A-Za-z]/);
  var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  function asciiControl(code4) {
    return (
      // Special whitespace codes (which have negative values), C0 and Control
      // character DEL
      code4 !== null && (code4 < 32 || code4 === 127)
    );
  }
  var asciiDigit = regexCheck(/\d/);
  var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  function markdownLineEnding(code4) {
    return code4 !== null && code4 < -2;
  }
  function markdownLineEndingOrSpace(code4) {
    return code4 !== null && (code4 < 0 || code4 === 32);
  }
  function markdownSpace(code4) {
    return code4 === -2 || code4 === -1 || code4 === 32;
  }
  var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
  var unicodeWhitespace = regexCheck(/\s/);
  function regexCheck(regex) {
    return check;
    function check(code4) {
      return code4 !== null && code4 > -1 && regex.test(String.fromCharCode(code4));
    }
  }

  // node_modules/micromark-util-sanitize-uri/index.js
  function normalizeUri(value) {
    const result = [];
    let index2 = -1;
    let start = 0;
    let skip = 0;
    while (++index2 < value.length) {
      const code4 = value.charCodeAt(index2);
      let replace2 = "";
      if (code4 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
        skip = 2;
      } else if (code4 < 128) {
        if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code4))) {
          replace2 = String.fromCharCode(code4);
        }
      } else if (code4 > 55295 && code4 < 57344) {
        const next = value.charCodeAt(index2 + 1);
        if (code4 < 56320 && next > 56319 && next < 57344) {
          replace2 = String.fromCharCode(code4, next);
          skip = 1;
        } else {
          replace2 = "\uFFFD";
        }
      } else {
        replace2 = String.fromCharCode(code4);
      }
      if (replace2) {
        result.push(value.slice(start, index2), encodeURIComponent(replace2));
        start = index2 + skip + 1;
        replace2 = "";
      }
      if (skip) {
        index2 += skip;
        skip = 0;
      }
    }
    return result.join("") + value.slice(start);
  }

  // node_modules/micromark-factory-space/index.js
  function factorySpace(effects, ok3, type, max) {
    const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
    let size = 0;
    return start;
    function start(code4) {
      if (markdownSpace(code4)) {
        effects.enter(type);
        return prefix(code4);
      }
      return ok3(code4);
    }
    function prefix(code4) {
      if (markdownSpace(code4) && size++ < limit) {
        effects.consume(code4);
        return prefix;
      }
      effects.exit(type);
      return ok3(code4);
    }
  }

  // node_modules/micromark/lib/initialize/content.js
  var content = {
    tokenize: initializeContent
  };
  function initializeContent(effects) {
    const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
    let previous4;
    return contentStart;
    function afterContentStartConstruct(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, contentStart, "linePrefix");
    }
    function paragraphInitial(code4) {
      effects.enter("paragraph");
      return lineStart(code4);
    }
    function lineStart(code4) {
      const token = effects.enter("chunkText", {
        contentType: "text",
        previous: previous4
      });
      if (previous4) {
        previous4.next = token;
      }
      previous4 = token;
      return data(code4);
    }
    function data(code4) {
      if (code4 === null) {
        effects.exit("chunkText");
        effects.exit("paragraph");
        effects.consume(code4);
        return;
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        effects.exit("chunkText");
        return lineStart;
      }
      effects.consume(code4);
      return data;
    }
  }

  // node_modules/micromark/lib/initialize/document.js
  var document2 = {
    tokenize: initializeDocument
  };
  var containerConstruct = {
    tokenize: tokenizeContainer
  };
  function initializeDocument(effects) {
    const self2 = this;
    const stack = [];
    let continued = 0;
    let childFlow;
    let childToken;
    let lineStartOffset;
    return start;
    function start(code4) {
      if (continued < stack.length) {
        const item = stack[continued];
        self2.containerState = item[1];
        return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code4);
      }
      return checkNewContainers(code4);
    }
    function documentContinue(code4) {
      continued++;
      if (self2.containerState._closeFlow) {
        self2.containerState._closeFlow = void 0;
        if (childFlow) {
          closeFlow();
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let point4;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            point4 = self2.events[indexBeforeFlow][1].end;
            break;
          }
        }
        exitContainers(continued);
        let index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = {
            ...point4
          };
          index2++;
        }
        splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
        self2.events.length = index2;
        return checkNewContainers(code4);
      }
      return start(code4);
    }
    function checkNewContainers(code4) {
      if (continued === stack.length) {
        if (!childFlow) {
          return documentContinued(code4);
        }
        if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
          return flowStart(code4);
        }
        self2.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
      }
      self2.containerState = {};
      return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code4);
    }
    function thereIsANewContainer(code4) {
      if (childFlow) closeFlow();
      exitContainers(continued);
      return documentContinued(code4);
    }
    function thereIsNoNewContainer(code4) {
      self2.parser.lazy[self2.now().line] = continued !== stack.length;
      lineStartOffset = self2.now().offset;
      return flowStart(code4);
    }
    function documentContinued(code4) {
      self2.containerState = {};
      return effects.attempt(containerConstruct, containerContinue, flowStart)(code4);
    }
    function containerContinue(code4) {
      continued++;
      stack.push([self2.currentConstruct, self2.containerState]);
      return documentContinued(code4);
    }
    function flowStart(code4) {
      if (code4 === null) {
        if (childFlow) closeFlow();
        exitContainers(0);
        effects.consume(code4);
        return;
      }
      childFlow = childFlow || self2.parser.flow(self2.now());
      effects.enter("chunkFlow", {
        _tokenizer: childFlow,
        contentType: "flow",
        previous: childToken
      });
      return flowContinue(code4);
    }
    function flowContinue(code4) {
      if (code4 === null) {
        writeToChild(effects.exit("chunkFlow"), true);
        exitContainers(0);
        effects.consume(code4);
        return;
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        writeToChild(effects.exit("chunkFlow"));
        continued = 0;
        self2.interrupt = void 0;
        return start;
      }
      effects.consume(code4);
      return flowContinue;
    }
    function writeToChild(token, endOfFile) {
      const stream = self2.sliceStream(token);
      if (endOfFile) stream.push(null);
      token.previous = childToken;
      if (childToken) childToken.next = token;
      childToken = token;
      childFlow.defineSkip(token.start);
      childFlow.write(stream);
      if (self2.parser.lazy[token.start.line]) {
        let index2 = childFlow.events.length;
        while (index2--) {
          if (
            // The token starts before the line ending…
            childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
            (!childFlow.events[index2][1].end || // …or ends after it.
            childFlow.events[index2][1].end.offset > lineStartOffset)
          ) {
            return;
          }
        }
        const indexBeforeExits = self2.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let seen;
        let point4;
        while (indexBeforeFlow--) {
          if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
            if (seen) {
              point4 = self2.events[indexBeforeFlow][1].end;
              break;
            }
            seen = true;
          }
        }
        exitContainers(continued);
        index2 = indexBeforeExits;
        while (index2 < self2.events.length) {
          self2.events[index2][1].end = {
            ...point4
          };
          index2++;
        }
        splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
        self2.events.length = index2;
      }
    }
    function exitContainers(size) {
      let index2 = stack.length;
      while (index2-- > size) {
        const entry = stack[index2];
        self2.containerState = entry[1];
        entry[0].exit.call(self2, effects);
      }
      stack.length = size;
    }
    function closeFlow() {
      childFlow.write([null]);
      childToken = void 0;
      childFlow = void 0;
      self2.containerState._closeFlow = void 0;
    }
  }
  function tokenizeContainer(effects, ok3, nok) {
    return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok3, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
  }

  // node_modules/micromark-util-classify-character/index.js
  function classifyCharacter(code4) {
    if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
      return 1;
    }
    if (unicodePunctuation(code4)) {
      return 2;
    }
  }

  // node_modules/micromark-util-resolve-all/index.js
  function resolveAll(constructs2, events, context) {
    const called = [];
    let index2 = -1;
    while (++index2 < constructs2.length) {
      const resolve = constructs2[index2].resolveAll;
      if (resolve && !called.includes(resolve)) {
        events = resolve(events, context);
        called.push(resolve);
      }
    }
    return events;
  }

  // node_modules/micromark-core-commonmark/lib/attention.js
  var attention = {
    name: "attention",
    resolveAll: resolveAllAttention,
    tokenize: tokenizeAttention
  };
  function resolveAllAttention(events, context) {
    let index2 = -1;
    let open;
    let group;
    let text7;
    let openingSequence;
    let closingSequence;
    let use;
    let nextEvents;
    let offset;
    while (++index2 < events.length) {
      if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
        open = index2;
        while (open--) {
          if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
            if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
              continue;
            }
            use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
            const start = {
              ...events[open][1].end
            };
            const end = {
              ...events[index2][1].start
            };
            movePoint(start, -use);
            movePoint(end, use);
            openingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start,
              end: {
                ...events[open][1].end
              }
            };
            closingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start: {
                ...events[index2][1].start
              },
              end
            };
            text7 = {
              type: use > 1 ? "strongText" : "emphasisText",
              start: {
                ...events[open][1].end
              },
              end: {
                ...events[index2][1].start
              }
            };
            group = {
              type: use > 1 ? "strong" : "emphasis",
              start: {
                ...openingSequence.start
              },
              end: {
                ...closingSequence.end
              }
            };
            events[open][1].end = {
              ...openingSequence.start
            };
            events[index2][1].start = {
              ...closingSequence.end
            };
            nextEvents = [];
            if (events[open][1].end.offset - events[open][1].start.offset) {
              nextEvents = push(nextEvents, [["enter", events[open][1], context], ["exit", events[open][1], context]]);
            }
            nextEvents = push(nextEvents, [["enter", group, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text7, context]]);
            nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context));
            nextEvents = push(nextEvents, [["exit", text7, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group, context]]);
            if (events[index2][1].end.offset - events[index2][1].start.offset) {
              offset = 2;
              nextEvents = push(nextEvents, [["enter", events[index2][1], context], ["exit", events[index2][1], context]]);
            } else {
              offset = 0;
            }
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - offset - 2;
            break;
          }
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "attentionSequence") {
        events[index2][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeAttention(effects, ok3) {
    const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
    const previous4 = this.previous;
    const before = classifyCharacter(previous4);
    let marker;
    return start;
    function start(code4) {
      marker = code4;
      effects.enter("attentionSequence");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        return inside;
      }
      const token = effects.exit("attentionSequence");
      const after = classifyCharacter(code4);
      const open = !after || after === 2 && before || attentionMarkers2.includes(code4);
      const close = !before || before === 2 && after || attentionMarkers2.includes(previous4);
      token._open = Boolean(marker === 42 ? open : open && (before || !close));
      token._close = Boolean(marker === 42 ? close : close && (after || !open));
      return ok3(code4);
    }
  }
  function movePoint(point4, offset) {
    point4.column += offset;
    point4.offset += offset;
    point4._bufferIndex += offset;
  }

  // node_modules/micromark-core-commonmark/lib/autolink.js
  var autolink = {
    name: "autolink",
    tokenize: tokenizeAutolink
  };
  function tokenizeAutolink(effects, ok3, nok) {
    let size = 0;
    return start;
    function start(code4) {
      effects.enter("autolink");
      effects.enter("autolinkMarker");
      effects.consume(code4);
      effects.exit("autolinkMarker");
      effects.enter("autolinkProtocol");
      return open;
    }
    function open(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return schemeOrEmailAtext;
      }
      if (code4 === 64) {
        return nok(code4);
      }
      return emailAtext(code4);
    }
    function schemeOrEmailAtext(code4) {
      if (code4 === 43 || code4 === 45 || code4 === 46 || asciiAlphanumeric(code4)) {
        size = 1;
        return schemeInsideOrEmailAtext(code4);
      }
      return emailAtext(code4);
    }
    function schemeInsideOrEmailAtext(code4) {
      if (code4 === 58) {
        effects.consume(code4);
        size = 0;
        return urlInside;
      }
      if ((code4 === 43 || code4 === 45 || code4 === 46 || asciiAlphanumeric(code4)) && size++ < 32) {
        effects.consume(code4);
        return schemeInsideOrEmailAtext;
      }
      size = 0;
      return emailAtext(code4);
    }
    function urlInside(code4) {
      if (code4 === 62) {
        effects.exit("autolinkProtocol");
        effects.enter("autolinkMarker");
        effects.consume(code4);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok3;
      }
      if (code4 === null || code4 === 32 || code4 === 60 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return urlInside;
    }
    function emailAtext(code4) {
      if (code4 === 64) {
        effects.consume(code4);
        return emailAtSignOrDot;
      }
      if (asciiAtext(code4)) {
        effects.consume(code4);
        return emailAtext;
      }
      return nok(code4);
    }
    function emailAtSignOrDot(code4) {
      return asciiAlphanumeric(code4) ? emailLabel(code4) : nok(code4);
    }
    function emailLabel(code4) {
      if (code4 === 46) {
        effects.consume(code4);
        size = 0;
        return emailAtSignOrDot;
      }
      if (code4 === 62) {
        effects.exit("autolinkProtocol").type = "autolinkEmail";
        effects.enter("autolinkMarker");
        effects.consume(code4);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok3;
      }
      return emailValue(code4);
    }
    function emailValue(code4) {
      if ((code4 === 45 || asciiAlphanumeric(code4)) && size++ < 63) {
        const next = code4 === 45 ? emailValue : emailLabel;
        effects.consume(code4);
        return next;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/blank-line.js
  var blankLine = {
    partial: true,
    tokenize: tokenizeBlankLine
  };
  function tokenizeBlankLine(effects, ok3, nok) {
    return start;
    function start(code4) {
      return markdownSpace(code4) ? factorySpace(effects, after, "linePrefix")(code4) : after(code4);
    }
    function after(code4) {
      return code4 === null || markdownLineEnding(code4) ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/block-quote.js
  var blockQuote = {
    continuation: {
      tokenize: tokenizeBlockQuoteContinuation
    },
    exit,
    name: "blockQuote",
    tokenize: tokenizeBlockQuoteStart
  };
  function tokenizeBlockQuoteStart(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 === 62) {
        const state = self2.containerState;
        if (!state.open) {
          effects.enter("blockQuote", {
            _container: true
          });
          state.open = true;
        }
        effects.enter("blockQuotePrefix");
        effects.enter("blockQuoteMarker");
        effects.consume(code4);
        effects.exit("blockQuoteMarker");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      if (markdownSpace(code4)) {
        effects.enter("blockQuotePrefixWhitespace");
        effects.consume(code4);
        effects.exit("blockQuotePrefixWhitespace");
        effects.exit("blockQuotePrefix");
        return ok3;
      }
      effects.exit("blockQuotePrefix");
      return ok3(code4);
    }
  }
  function tokenizeBlockQuoteContinuation(effects, ok3, nok) {
    const self2 = this;
    return contStart;
    function contStart(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, contBefore, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
      }
      return contBefore(code4);
    }
    function contBefore(code4) {
      return effects.attempt(blockQuote, ok3, nok)(code4);
    }
  }
  function exit(effects) {
    effects.exit("blockQuote");
  }

  // node_modules/micromark-core-commonmark/lib/character-escape.js
  var characterEscape = {
    name: "characterEscape",
    tokenize: tokenizeCharacterEscape
  };
  function tokenizeCharacterEscape(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("characterEscape");
      effects.enter("escapeMarker");
      effects.consume(code4);
      effects.exit("escapeMarker");
      return inside;
    }
    function inside(code4) {
      if (asciiPunctuation(code4)) {
        effects.enter("characterEscapeValue");
        effects.consume(code4);
        effects.exit("characterEscapeValue");
        effects.exit("characterEscape");
        return ok3;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/character-reference.js
  var characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
  function tokenizeCharacterReference(effects, ok3, nok) {
    const self2 = this;
    let size = 0;
    let max;
    let test;
    return start;
    function start(code4) {
      effects.enter("characterReference");
      effects.enter("characterReferenceMarker");
      effects.consume(code4);
      effects.exit("characterReferenceMarker");
      return open;
    }
    function open(code4) {
      if (code4 === 35) {
        effects.enter("characterReferenceMarkerNumeric");
        effects.consume(code4);
        effects.exit("characterReferenceMarkerNumeric");
        return numeric;
      }
      effects.enter("characterReferenceValue");
      max = 31;
      test = asciiAlphanumeric;
      return value(code4);
    }
    function numeric(code4) {
      if (code4 === 88 || code4 === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code4);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max = 6;
        test = asciiHexDigit;
        return value;
      }
      effects.enter("characterReferenceValue");
      max = 7;
      test = asciiDigit;
      return value(code4);
    }
    function value(code4) {
      if (code4 === 59 && size) {
        const token = effects.exit("characterReferenceValue");
        if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
          return nok(code4);
        }
        effects.enter("characterReferenceMarker");
        effects.consume(code4);
        effects.exit("characterReferenceMarker");
        effects.exit("characterReference");
        return ok3;
      }
      if (test(code4) && size++ < max) {
        effects.consume(code4);
        return value;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-fenced.js
  var nonLazyContinuation = {
    partial: true,
    tokenize: tokenizeNonLazyContinuation
  };
  var codeFenced = {
    concrete: true,
    name: "codeFenced",
    tokenize: tokenizeCodeFenced
  };
  function tokenizeCodeFenced(effects, ok3, nok) {
    const self2 = this;
    const closeStart = {
      partial: true,
      tokenize: tokenizeCloseStart
    };
    let initialPrefix = 0;
    let sizeOpen = 0;
    let marker;
    return start;
    function start(code4) {
      return beforeSequenceOpen(code4);
    }
    function beforeSequenceOpen(code4) {
      const tail = self2.events[self2.events.length - 1];
      initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
      marker = code4;
      effects.enter("codeFenced");
      effects.enter("codeFencedFence");
      effects.enter("codeFencedFenceSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === marker) {
        sizeOpen++;
        effects.consume(code4);
        return sequenceOpen;
      }
      if (sizeOpen < 3) {
        return nok(code4);
      }
      effects.exit("codeFencedFenceSequence");
      return markdownSpace(code4) ? factorySpace(effects, infoBefore, "whitespace")(code4) : infoBefore(code4);
    }
    function infoBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFencedFence");
        return self2.interrupt ? ok3(code4) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code4);
      }
      effects.enter("codeFencedFenceInfo");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return info(code4);
    }
    function info(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return infoBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return factorySpace(effects, metaBefore, "whitespace")(code4);
      }
      if (code4 === 96 && code4 === marker) {
        return nok(code4);
      }
      effects.consume(code4);
      return info;
    }
    function metaBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return infoBefore(code4);
      }
      effects.enter("codeFencedFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code4);
    }
    function meta(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceMeta");
        return infoBefore(code4);
      }
      if (code4 === 96 && code4 === marker) {
        return nok(code4);
      }
      effects.consume(code4);
      return meta;
    }
    function atNonLazyBreak(code4) {
      return effects.attempt(closeStart, after, contentBefore)(code4);
    }
    function contentBefore(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return contentStart;
    }
    function contentStart(code4) {
      return initialPrefix > 0 && markdownSpace(code4) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code4) : beforeContentChunk(code4);
    }
    function beforeContentChunk(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code4);
      }
      effects.enter("codeFlowValue");
      return contentChunk(code4);
    }
    function contentChunk(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFlowValue");
        return beforeContentChunk(code4);
      }
      effects.consume(code4);
      return contentChunk;
    }
    function after(code4) {
      effects.exit("codeFenced");
      return ok3(code4);
    }
    function tokenizeCloseStart(effects2, ok4, nok2) {
      let size = 0;
      return startBefore;
      function startBefore(code4) {
        effects2.enter("lineEnding");
        effects2.consume(code4);
        effects2.exit("lineEnding");
        return start2;
      }
      function start2(code4) {
        effects2.enter("codeFencedFence");
        return markdownSpace(code4) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4) : beforeSequenceClose(code4);
      }
      function beforeSequenceClose(code4) {
        if (code4 === marker) {
          effects2.enter("codeFencedFenceSequence");
          return sequenceClose(code4);
        }
        return nok2(code4);
      }
      function sequenceClose(code4) {
        if (code4 === marker) {
          size++;
          effects2.consume(code4);
          return sequenceClose;
        }
        if (size >= sizeOpen) {
          effects2.exit("codeFencedFenceSequence");
          return markdownSpace(code4) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code4) : sequenceCloseAfter(code4);
        }
        return nok2(code4);
      }
      function sequenceCloseAfter(code4) {
        if (code4 === null || markdownLineEnding(code4)) {
          effects2.exit("codeFencedFence");
          return ok4(code4);
        }
        return nok2(code4);
      }
    }
  }
  function tokenizeNonLazyContinuation(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code4) {
      return self2.parser.lazy[self2.now().line] ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-indented.js
  var codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  var furtherStart = {
    partial: true,
    tokenize: tokenizeFurtherStart
  };
  function tokenizeCodeIndented(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("codeIndented");
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code4);
    }
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code4) : nok(code4);
    }
    function atBreak(code4) {
      if (code4 === null) {
        return after(code4);
      }
      if (markdownLineEnding(code4)) {
        return effects.attempt(furtherStart, atBreak, after)(code4);
      }
      effects.enter("codeFlowValue");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("codeFlowValue");
        return atBreak(code4);
      }
      effects.consume(code4);
      return inside;
    }
    function after(code4) {
      effects.exit("codeIndented");
      return ok3(code4);
    }
  }
  function tokenizeFurtherStart(effects, ok3, nok) {
    const self2 = this;
    return furtherStart2;
    function furtherStart2(code4) {
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return furtherStart2;
      }
      return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code4);
    }
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok3(code4) : markdownLineEnding(code4) ? furtherStart2(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-text.js
  var codeText = {
    name: "codeText",
    previous,
    resolve: resolveCodeText,
    tokenize: tokenizeCodeText
  };
  function resolveCodeText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index2;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index2 = headEnterIndex;
      while (++index2 < tailExitIndex) {
        if (events[index2][1].type === "codeTextData") {
          events[headEnterIndex][1].type = "codeTextPadding";
          events[tailExitIndex][1].type = "codeTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index2 = headEnterIndex - 1;
    tailExitIndex++;
    while (++index2 <= tailExitIndex) {
      if (enter === void 0) {
        if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
          enter = index2;
        }
      } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
        events[enter][1].type = "codeTextData";
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          tailExitIndex -= index2 - enter - 2;
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous(code4) {
    return code4 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
  }
  function tokenizeCodeText(effects, ok3, nok) {
    const self2 = this;
    let sizeOpen = 0;
    let size;
    let token;
    return start;
    function start(code4) {
      effects.enter("codeText");
      effects.enter("codeTextSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === 96) {
        effects.consume(code4);
        sizeOpen++;
        return sequenceOpen;
      }
      effects.exit("codeTextSequence");
      return between(code4);
    }
    function between(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 32) {
        effects.enter("space");
        effects.consume(code4);
        effects.exit("space");
        return between;
      }
      if (code4 === 96) {
        token = effects.enter("codeTextSequence");
        size = 0;
        return sequenceClose(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return between;
      }
      effects.enter("codeTextData");
      return data(code4);
    }
    function data(code4) {
      if (code4 === null || code4 === 32 || code4 === 96 || markdownLineEnding(code4)) {
        effects.exit("codeTextData");
        return between(code4);
      }
      effects.consume(code4);
      return data;
    }
    function sequenceClose(code4) {
      if (code4 === 96) {
        effects.consume(code4);
        size++;
        return sequenceClose;
      }
      if (size === sizeOpen) {
        effects.exit("codeTextSequence");
        effects.exit("codeText");
        return ok3(code4);
      }
      token.type = "codeTextData";
      return data(code4);
    }
  }

  // node_modules/micromark-util-subtokenize/lib/splice-buffer.js
  var SpliceBuffer = class {
    /**
     * @param {ReadonlyArray<T> | null | undefined} [initial]
     *   Initial items (optional).
     * @returns
     *   Splice buffer.
     */
    constructor(initial) {
      this.left = initial ? [...initial] : [];
      this.right = [];
    }
    /**
     * Array access;
     * does not move the cursor.
     *
     * @param {number} index
     *   Index.
     * @return {T}
     *   Item.
     */
    get(index2) {
      if (index2 < 0 || index2 >= this.left.length + this.right.length) {
        throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
      }
      if (index2 < this.left.length) return this.left[index2];
      return this.right[this.right.length - index2 + this.left.length - 1];
    }
    /**
     * The length of the splice buffer, one greater than the largest index in the
     * array.
     */
    get length() {
      return this.left.length + this.right.length;
    }
    /**
     * Remove and return `list[0]`;
     * moves the cursor to `0`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    shift() {
      this.setCursor(0);
      return this.right.pop();
    }
    /**
     * Slice the buffer to get an array;
     * does not move the cursor.
     *
     * @param {number} start
     *   Start.
     * @param {number | null | undefined} [end]
     *   End (optional).
     * @returns {Array<T>}
     *   Array of items.
     */
    slice(start, end) {
      const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
      if (stop < this.left.length) {
        return this.left.slice(start, stop);
      }
      if (start > this.left.length) {
        return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
      }
      return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
    }
    /**
     * Mimics the behavior of Array.prototype.splice() except for the change of
     * interface necessary to avoid segfaults when patching in very large arrays.
     *
     * This operation moves cursor is moved to `start` and results in the cursor
     * placed after any inserted items.
     *
     * @param {number} start
     *   Start;
     *   zero-based index at which to start changing the array;
     *   negative numbers count backwards from the end of the array and values
     *   that are out-of bounds are clamped to the appropriate end of the array.
     * @param {number | null | undefined} [deleteCount=0]
     *   Delete count (default: `0`);
     *   maximum number of elements to delete, starting from start.
     * @param {Array<T> | null | undefined} [items=[]]
     *   Items to include in place of the deleted items (default: `[]`).
     * @return {Array<T>}
     *   Any removed items.
     */
    splice(start, deleteCount, items) {
      const count = deleteCount || 0;
      this.setCursor(Math.trunc(start));
      const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
      if (items) chunkedPush(this.left, items);
      return removed.reverse();
    }
    /**
     * Remove and return the highest-numbered item in the array, so
     * `list[list.length - 1]`;
     * Moves the cursor to `length`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    pop() {
      this.setCursor(Number.POSITIVE_INFINITY);
      return this.left.pop();
    }
    /**
     * Inserts a single item to the high-numbered side of the array;
     * moves the cursor to `length`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    push(item) {
      this.setCursor(Number.POSITIVE_INFINITY);
      this.left.push(item);
    }
    /**
     * Inserts many items to the high-numbered side of the array.
     * Moves the cursor to `length`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    pushMany(items) {
      this.setCursor(Number.POSITIVE_INFINITY);
      chunkedPush(this.left, items);
    }
    /**
     * Inserts a single item to the low-numbered side of the array;
     * Moves the cursor to `0`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    unshift(item) {
      this.setCursor(0);
      this.right.push(item);
    }
    /**
     * Inserts many items to the low-numbered side of the array;
     * moves the cursor to `0`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    unshiftMany(items) {
      this.setCursor(0);
      chunkedPush(this.right, items.reverse());
    }
    /**
     * Move the cursor to a specific position in the array. Requires
     * time proportional to the distance moved.
     *
     * If `n < 0`, the cursor will end up at the beginning.
     * If `n > length`, the cursor will end up at the end.
     *
     * @param {number} n
     *   Position.
     * @return {undefined}
     *   Nothing.
     */
    setCursor(n) {
      if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
      if (n < this.left.length) {
        const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
        chunkedPush(this.right, removed.reverse());
      } else {
        const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
        chunkedPush(this.left, removed.reverse());
      }
    }
  };
  function chunkedPush(list4, right) {
    let chunkStart = 0;
    if (right.length < 1e4) {
      list4.push(...right);
    } else {
      while (chunkStart < right.length) {
        list4.push(...right.slice(chunkStart, chunkStart + 1e4));
        chunkStart += 1e4;
      }
    }
  }

  // node_modules/micromark-util-subtokenize/index.js
  function subtokenize(eventsArray) {
    const jumps = {};
    let index2 = -1;
    let event;
    let lineIndex;
    let otherIndex;
    let otherEvent;
    let parameters;
    let subevents;
    let more;
    const events = new SpliceBuffer(eventsArray);
    while (++index2 < events.length) {
      while (index2 in jumps) {
        index2 = jumps[index2];
      }
      event = events.get(index2);
      if (index2 && event[1].type === "chunkFlow" && events.get(index2 - 1)[1].type === "listItemPrefix") {
        subevents = event[1]._tokenizer.events;
        otherIndex = 0;
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
          otherIndex += 2;
        }
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
          while (++otherIndex < subevents.length) {
            if (subevents[otherIndex][1].type === "content") {
              break;
            }
            if (subevents[otherIndex][1].type === "chunkText") {
              subevents[otherIndex][1]._isInFirstContentOfListItem = true;
              otherIndex++;
            }
          }
        }
      }
      if (event[0] === "enter") {
        if (event[1].contentType) {
          Object.assign(jumps, subcontent(events, index2));
          index2 = jumps[index2];
          more = true;
        }
      } else if (event[1]._container) {
        otherIndex = index2;
        lineIndex = void 0;
        while (otherIndex--) {
          otherEvent = events.get(otherIndex);
          if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
            if (otherEvent[0] === "enter") {
              if (lineIndex) {
                events.get(lineIndex)[1].type = "lineEndingBlank";
              }
              otherEvent[1].type = "lineEnding";
              lineIndex = otherIndex;
            }
          } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
          } else {
            break;
          }
        }
        if (lineIndex) {
          event[1].end = {
            ...events.get(lineIndex)[1].start
          };
          parameters = events.slice(lineIndex, index2);
          parameters.unshift(event);
          events.splice(lineIndex, index2 - lineIndex + 1, parameters);
        }
      }
    }
    splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
    return !more;
  }
  function subcontent(events, eventIndex) {
    const token = events.get(eventIndex)[1];
    const context = events.get(eventIndex)[2];
    let startPosition = eventIndex - 1;
    const startPositions = [];
    let tokenizer = token._tokenizer;
    if (!tokenizer) {
      tokenizer = context.parser[token.contentType](token.start);
      if (token._contentTypeTextTrailing) {
        tokenizer._contentTypeTextTrailing = true;
      }
    }
    const childEvents = tokenizer.events;
    const jumps = [];
    const gaps = {};
    let stream;
    let previous4;
    let index2 = -1;
    let current = token;
    let adjust = 0;
    let start = 0;
    const breaks = [start];
    while (current) {
      while (events.get(++startPosition)[1] !== current) {
      }
      startPositions.push(startPosition);
      if (!current._tokenizer) {
        stream = context.sliceStream(current);
        if (!current.next) {
          stream.push(null);
        }
        if (previous4) {
          tokenizer.defineSkip(current.start);
        }
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = true;
        }
        tokenizer.write(stream);
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = void 0;
        }
      }
      previous4 = current;
      current = current.next;
    }
    current = token;
    while (++index2 < childEvents.length) {
      if (
        // Find a void token that includes a break.
        childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
      ) {
        start = index2 + 1;
        breaks.push(start);
        current._tokenizer = void 0;
        current.previous = void 0;
        current = current.next;
      }
    }
    tokenizer.events = [];
    if (current) {
      current._tokenizer = void 0;
      current.previous = void 0;
    } else {
      breaks.pop();
    }
    index2 = breaks.length;
    while (index2--) {
      const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
      const start2 = startPositions.pop();
      jumps.push([start2, start2 + slice.length - 1]);
      events.splice(start2, 2, slice);
    }
    jumps.reverse();
    index2 = -1;
    while (++index2 < jumps.length) {
      gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
      adjust += jumps[index2][1] - jumps[index2][0] - 1;
    }
    return gaps;
  }

  // node_modules/micromark-core-commonmark/lib/content.js
  var content2 = {
    resolve: resolveContent,
    tokenize: tokenizeContent
  };
  var continuationConstruct = {
    partial: true,
    tokenize: tokenizeContinuation
  };
  function resolveContent(events) {
    subtokenize(events);
    return events;
  }
  function tokenizeContent(effects, ok3) {
    let previous4;
    return chunkStart;
    function chunkStart(code4) {
      effects.enter("content");
      previous4 = effects.enter("chunkContent", {
        contentType: "content"
      });
      return chunkInside(code4);
    }
    function chunkInside(code4) {
      if (code4 === null) {
        return contentEnd(code4);
      }
      if (markdownLineEnding(code4)) {
        return effects.check(continuationConstruct, contentContinue, contentEnd)(code4);
      }
      effects.consume(code4);
      return chunkInside;
    }
    function contentEnd(code4) {
      effects.exit("chunkContent");
      effects.exit("content");
      return ok3(code4);
    }
    function contentContinue(code4) {
      effects.consume(code4);
      effects.exit("chunkContent");
      previous4.next = effects.enter("chunkContent", {
        contentType: "content",
        previous: previous4
      });
      previous4 = previous4.next;
      return chunkInside;
    }
  }
  function tokenizeContinuation(effects, ok3, nok) {
    const self2 = this;
    return startLookahead;
    function startLookahead(code4) {
      effects.exit("chunkContent");
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, prefixed, "linePrefix");
    }
    function prefixed(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return nok(code4);
      }
      const tail = self2.events[self2.events.length - 1];
      if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
        return ok3(code4);
      }
      return effects.interrupt(self2.parser.constructs.flow, nok, ok3)(code4);
    }
  }

  // node_modules/micromark-factory-destination/index.js
  function factoryDestination(effects, ok3, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    const limit = max || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    function start(code4) {
      if (code4 === 60) {
        effects.enter(type);
        effects.enter(literalType);
        effects.enter(literalMarkerType);
        effects.consume(code4);
        effects.exit(literalMarkerType);
        return enclosedBefore;
      }
      if (code4 === null || code4 === 32 || code4 === 41 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.enter(type);
      effects.enter(rawType);
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return raw2(code4);
    }
    function enclosedBefore(code4) {
      if (code4 === 62) {
        effects.enter(literalMarkerType);
        effects.consume(code4);
        effects.exit(literalMarkerType);
        effects.exit(literalType);
        effects.exit(type);
        return ok3;
      }
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return enclosed(code4);
    }
    function enclosed(code4) {
      if (code4 === 62) {
        effects.exit("chunkString");
        effects.exit(stringType);
        return enclosedBefore(code4);
      }
      if (code4 === null || code4 === 60 || markdownLineEnding(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? enclosedEscape : enclosed;
    }
    function enclosedEscape(code4) {
      if (code4 === 60 || code4 === 62 || code4 === 92) {
        effects.consume(code4);
        return enclosed;
      }
      return enclosed(code4);
    }
    function raw2(code4) {
      if (!balance && (code4 === null || code4 === 41 || markdownLineEndingOrSpace(code4))) {
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok3(code4);
      }
      if (balance < limit && code4 === 40) {
        effects.consume(code4);
        balance++;
        return raw2;
      }
      if (code4 === 41) {
        effects.consume(code4);
        balance--;
        return raw2;
      }
      if (code4 === null || code4 === 32 || code4 === 40 || asciiControl(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? rawEscape : raw2;
    }
    function rawEscape(code4) {
      if (code4 === 40 || code4 === 41 || code4 === 92) {
        effects.consume(code4);
        return raw2;
      }
      return raw2(code4);
    }
  }

  // node_modules/micromark-factory-label/index.js
  function factoryLabel(effects, ok3, nok, type, markerType, stringType) {
    const self2 = this;
    let size = 0;
    let seen;
    return start;
    function start(code4) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code4);
      effects.exit(markerType);
      effects.enter(stringType);
      return atBreak;
    }
    function atBreak(code4) {
      if (size > 999 || code4 === null || code4 === 91 || code4 === 93 && !seen || // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      code4 === 94 && !size && "_hiddenFootnoteSupport" in self2.parser.constructs) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit(stringType);
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        effects.exit(type);
        return ok3;
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return atBreak;
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return labelInside(code4);
    }
    function labelInside(code4) {
      if (code4 === null || code4 === 91 || code4 === 93 || markdownLineEnding(code4) || size++ > 999) {
        effects.exit("chunkString");
        return atBreak(code4);
      }
      effects.consume(code4);
      if (!seen) seen = !markdownSpace(code4);
      return code4 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return labelInside;
      }
      return labelInside(code4);
    }
  }

  // node_modules/micromark-factory-title/index.js
  function factoryTitle(effects, ok3, nok, type, markerType, stringType) {
    let marker;
    return start;
    function start(code4) {
      if (code4 === 34 || code4 === 39 || code4 === 40) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        marker = code4 === 40 ? 41 : code4;
        return begin;
      }
      return nok(code4);
    }
    function begin(code4) {
      if (code4 === marker) {
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        effects.exit(type);
        return ok3;
      }
      effects.enter(stringType);
      return atBreak(code4);
    }
    function atBreak(code4) {
      if (code4 === marker) {
        effects.exit(stringType);
        return begin(marker);
      }
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return factorySpace(effects, atBreak, "linePrefix");
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker || code4 === null || markdownLineEnding(code4)) {
        effects.exit("chunkString");
        return atBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? escape : inside;
    }
    function escape(code4) {
      if (code4 === marker || code4 === 92) {
        effects.consume(code4);
        return inside;
      }
      return inside(code4);
    }
  }

  // node_modules/micromark-factory-whitespace/index.js
  function factoryWhitespace(effects, ok3) {
    let seen;
    return start;
    function start(code4) {
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        seen = true;
        return start;
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code4);
      }
      return ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/definition.js
  var definition = {
    name: "definition",
    tokenize: tokenizeDefinition
  };
  var titleBefore = {
    partial: true,
    tokenize: tokenizeTitleBefore
  };
  function tokenizeDefinition(effects, ok3, nok) {
    const self2 = this;
    let identifier;
    return start;
    function start(code4) {
      effects.enter("definition");
      return before(code4);
    }
    function before(code4) {
      return factoryLabel.call(
        self2,
        effects,
        labelAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionLabel",
        "definitionLabelMarker",
        "definitionLabelString"
      )(code4);
    }
    function labelAfter(code4) {
      identifier = normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1));
      if (code4 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code4);
        effects.exit("definitionMarker");
        return markerAfter;
      }
      return nok(code4);
    }
    function markerAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, destinationBefore)(code4) : destinationBefore(code4);
    }
    function destinationBefore(code4) {
      return factoryDestination(
        effects,
        destinationAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionDestination",
        "definitionDestinationLiteral",
        "definitionDestinationLiteralMarker",
        "definitionDestinationRaw",
        "definitionDestinationString"
      )(code4);
    }
    function destinationAfter(code4) {
      return effects.attempt(titleBefore, after, after)(code4);
    }
    function after(code4) {
      return markdownSpace(code4) ? factorySpace(effects, afterWhitespace, "whitespace")(code4) : afterWhitespace(code4);
    }
    function afterWhitespace(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("definition");
        self2.parser.defined.push(identifier);
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function tokenizeTitleBefore(effects, ok3, nok) {
    return titleBefore2;
    function titleBefore2(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, beforeMarker)(code4) : nok(code4);
    }
    function beforeMarker(code4) {
      return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code4);
    }
    function titleAfter(code4) {
      return markdownSpace(code4) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code4) : titleAfterOptionalWhitespace(code4);
    }
    function titleAfterOptionalWhitespace(code4) {
      return code4 === null || markdownLineEnding(code4) ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/hard-break-escape.js
  var hardBreakEscape = {
    name: "hardBreakEscape",
    tokenize: tokenizeHardBreakEscape
  };
  function tokenizeHardBreakEscape(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("hardBreakEscape");
      effects.consume(code4);
      return after;
    }
    function after(code4) {
      if (markdownLineEnding(code4)) {
        effects.exit("hardBreakEscape");
        return ok3(code4);
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/heading-atx.js
  var headingAtx = {
    name: "headingAtx",
    resolve: resolveHeadingAtx,
    tokenize: tokenizeHeadingAtx
  };
  function resolveHeadingAtx(events, context) {
    let contentEnd = events.length - 2;
    let contentStart = 3;
    let content3;
    let text7;
    if (events[contentStart][1].type === "whitespace") {
      contentStart += 2;
    }
    if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
      contentEnd -= 2;
    }
    if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
      contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
    }
    if (contentEnd > contentStart) {
      content3 = {
        type: "atxHeadingText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end
      };
      text7 = {
        type: "chunkText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end,
        contentType: "text"
      };
      splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content3, context], ["enter", text7, context], ["exit", text7, context], ["exit", content3, context]]);
    }
    return events;
  }
  function tokenizeHeadingAtx(effects, ok3, nok) {
    let size = 0;
    return start;
    function start(code4) {
      effects.enter("atxHeading");
      return before(code4);
    }
    function before(code4) {
      effects.enter("atxHeadingSequence");
      return sequenceOpen(code4);
    }
    function sequenceOpen(code4) {
      if (code4 === 35 && size++ < 6) {
        effects.consume(code4);
        return sequenceOpen;
      }
      if (code4 === null || markdownLineEndingOrSpace(code4)) {
        effects.exit("atxHeadingSequence");
        return atBreak(code4);
      }
      return nok(code4);
    }
    function atBreak(code4) {
      if (code4 === 35) {
        effects.enter("atxHeadingSequence");
        return sequenceFurther(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("atxHeading");
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, atBreak, "whitespace")(code4);
      }
      effects.enter("atxHeadingText");
      return data(code4);
    }
    function sequenceFurther(code4) {
      if (code4 === 35) {
        effects.consume(code4);
        return sequenceFurther;
      }
      effects.exit("atxHeadingSequence");
      return atBreak(code4);
    }
    function data(code4) {
      if (code4 === null || code4 === 35 || markdownLineEndingOrSpace(code4)) {
        effects.exit("atxHeadingText");
        return atBreak(code4);
      }
      effects.consume(code4);
      return data;
    }
  }

  // node_modules/micromark-util-html-tag-name/index.js
  var htmlBlockNames = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  var htmlRawNames = ["pre", "script", "style", "textarea"];

  // node_modules/micromark-core-commonmark/lib/html-flow.js
  var htmlFlow = {
    concrete: true,
    name: "htmlFlow",
    resolveTo: resolveToHtmlFlow,
    tokenize: tokenizeHtmlFlow
  };
  var blankLineBefore = {
    partial: true,
    tokenize: tokenizeBlankLineBefore
  };
  var nonLazyContinuationStart = {
    partial: true,
    tokenize: tokenizeNonLazyContinuationStart
  };
  function resolveToHtmlFlow(events) {
    let index2 = events.length;
    while (index2--) {
      if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
        break;
      }
    }
    if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
      events[index2][1].start = events[index2 - 2][1].start;
      events[index2 + 1][1].start = events[index2 - 2][1].start;
      events.splice(index2 - 2, 2);
    }
    return events;
  }
  function tokenizeHtmlFlow(effects, ok3, nok) {
    const self2 = this;
    let marker;
    let closingTag;
    let buffer;
    let index2;
    let markerB;
    return start;
    function start(code4) {
      return before(code4);
    }
    function before(code4) {
      effects.enter("htmlFlow");
      effects.enter("htmlFlowData");
      effects.consume(code4);
      return open;
    }
    function open(code4) {
      if (code4 === 33) {
        effects.consume(code4);
        return declarationOpen;
      }
      if (code4 === 47) {
        effects.consume(code4);
        closingTag = true;
        return tagCloseStart;
      }
      if (code4 === 63) {
        effects.consume(code4);
        marker = 3;
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        buffer = String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function declarationOpen(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        marker = 2;
        return commentOpenInside;
      }
      if (code4 === 91) {
        effects.consume(code4);
        marker = 5;
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        marker = 4;
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      return nok(code4);
    }
    function commentOpenInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return self2.interrupt ? ok3 : continuationDeclarationInside;
      }
      return nok(code4);
    }
    function cdataOpenInside(code4) {
      const value = "CDATA[";
      if (code4 === value.charCodeAt(index2++)) {
        effects.consume(code4);
        if (index2 === value.length) {
          return self2.interrupt ? ok3 : continuation;
        }
        return cdataOpenInside;
      }
      return nok(code4);
    }
    function tagCloseStart(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        buffer = String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function tagName(code4) {
      if (code4 === null || code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        const slash = code4 === 47;
        const name = buffer.toLowerCase();
        if (!slash && !closingTag && htmlRawNames.includes(name)) {
          marker = 1;
          return self2.interrupt ? ok3(code4) : continuation(code4);
        }
        if (htmlBlockNames.includes(buffer.toLowerCase())) {
          marker = 6;
          if (slash) {
            effects.consume(code4);
            return basicSelfClosing;
          }
          return self2.interrupt ? ok3(code4) : continuation(code4);
        }
        marker = 7;
        return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code4) : closingTag ? completeClosingTagAfter(code4) : completeAttributeNameBefore(code4);
      }
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        buffer += String.fromCharCode(code4);
        return tagName;
      }
      return nok(code4);
    }
    function basicSelfClosing(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return self2.interrupt ? ok3 : continuation;
      }
      return nok(code4);
    }
    function completeClosingTagAfter(code4) {
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeClosingTagAfter;
      }
      return completeEnd(code4);
    }
    function completeAttributeNameBefore(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        return completeEnd;
      }
      if (code4 === 58 || code4 === 95 || asciiAlpha(code4)) {
        effects.consume(code4);
        return completeAttributeName;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeNameBefore;
      }
      return completeEnd(code4);
    }
    function completeAttributeName(code4) {
      if (code4 === 45 || code4 === 46 || code4 === 58 || code4 === 95 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return completeAttributeName;
      }
      return completeAttributeNameAfter(code4);
    }
    function completeAttributeNameAfter(code4) {
      if (code4 === 61) {
        effects.consume(code4);
        return completeAttributeValueBefore;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeNameAfter;
      }
      return completeAttributeNameBefore(code4);
    }
    function completeAttributeValueBefore(code4) {
      if (code4 === null || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 34 || code4 === 39) {
        effects.consume(code4);
        markerB = code4;
        return completeAttributeValueQuoted;
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAttributeValueBefore;
      }
      return completeAttributeValueUnquoted(code4);
    }
    function completeAttributeValueQuoted(code4) {
      if (code4 === markerB) {
        effects.consume(code4);
        markerB = null;
        return completeAttributeValueQuotedAfter;
      }
      if (code4 === null || markdownLineEnding(code4)) {
        return nok(code4);
      }
      effects.consume(code4);
      return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code4) {
      if (code4 === null || code4 === 34 || code4 === 39 || code4 === 47 || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96 || markdownLineEndingOrSpace(code4)) {
        return completeAttributeNameAfter(code4);
      }
      effects.consume(code4);
      return completeAttributeValueUnquoted;
    }
    function completeAttributeValueQuotedAfter(code4) {
      if (code4 === 47 || code4 === 62 || markdownSpace(code4)) {
        return completeAttributeNameBefore(code4);
      }
      return nok(code4);
    }
    function completeEnd(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return completeAfter;
      }
      return nok(code4);
    }
    function completeAfter(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return continuation(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return completeAfter;
      }
      return nok(code4);
    }
    function continuation(code4) {
      if (code4 === 45 && marker === 2) {
        effects.consume(code4);
        return continuationCommentInside;
      }
      if (code4 === 60 && marker === 1) {
        effects.consume(code4);
        return continuationRawTagOpen;
      }
      if (code4 === 62 && marker === 4) {
        effects.consume(code4);
        return continuationClose;
      }
      if (code4 === 63 && marker === 3) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      if (code4 === 93 && marker === 5) {
        effects.consume(code4);
        return continuationCdataInside;
      }
      if (markdownLineEnding(code4) && (marker === 6 || marker === 7)) {
        effects.exit("htmlFlowData");
        return effects.check(blankLineBefore, continuationAfter, continuationStart)(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("htmlFlowData");
        return continuationStart(code4);
      }
      effects.consume(code4);
      return continuation;
    }
    function continuationStart(code4) {
      return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code4);
    }
    function continuationStartNonLazy(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return continuationBefore;
    }
    function continuationBefore(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        return continuationStart(code4);
      }
      effects.enter("htmlFlowData");
      return continuation(code4);
    }
    function continuationCommentInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationRawTagOpen(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        buffer = "";
        return continuationRawEndTag;
      }
      return continuation(code4);
    }
    function continuationRawEndTag(code4) {
      if (code4 === 62) {
        const name = buffer.toLowerCase();
        if (htmlRawNames.includes(name)) {
          effects.consume(code4);
          return continuationClose;
        }
        return continuation(code4);
      }
      if (asciiAlpha(code4) && buffer.length < 8) {
        effects.consume(code4);
        buffer += String.fromCharCode(code4);
        return continuationRawEndTag;
      }
      return continuation(code4);
    }
    function continuationCdataInside(code4) {
      if (code4 === 93) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationDeclarationInside(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        return continuationClose;
      }
      if (code4 === 45 && marker === 2) {
        effects.consume(code4);
        return continuationDeclarationInside;
      }
      return continuation(code4);
    }
    function continuationClose(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("htmlFlowData");
        return continuationAfter(code4);
      }
      effects.consume(code4);
      return continuationClose;
    }
    function continuationAfter(code4) {
      effects.exit("htmlFlow");
      return ok3(code4);
    }
  }
  function tokenizeNonLazyContinuationStart(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      return self2.parser.lazy[self2.now().line] ? nok(code4) : ok3(code4);
    }
  }
  function tokenizeBlankLineBefore(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return effects.attempt(blankLine, ok3, nok);
    }
  }

  // node_modules/micromark-core-commonmark/lib/html-text.js
  var htmlText = {
    name: "htmlText",
    tokenize: tokenizeHtmlText
  };
  function tokenizeHtmlText(effects, ok3, nok) {
    const self2 = this;
    let marker;
    let index2;
    let returnState;
    return start;
    function start(code4) {
      effects.enter("htmlText");
      effects.enter("htmlTextData");
      effects.consume(code4);
      return open;
    }
    function open(code4) {
      if (code4 === 33) {
        effects.consume(code4);
        return declarationOpen;
      }
      if (code4 === 47) {
        effects.consume(code4);
        return tagCloseStart;
      }
      if (code4 === 63) {
        effects.consume(code4);
        return instruction;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return tagOpen;
      }
      return nok(code4);
    }
    function declarationOpen(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentOpenInside;
      }
      if (code4 === 91) {
        effects.consume(code4);
        index2 = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return declaration;
      }
      return nok(code4);
    }
    function commentOpenInside(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentEnd;
      }
      return nok(code4);
    }
    function comment2(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 45) {
        effects.consume(code4);
        return commentClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = comment2;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return comment2;
    }
    function commentClose(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return commentEnd;
      }
      return comment2(code4);
    }
    function commentEnd(code4) {
      return code4 === 62 ? end(code4) : code4 === 45 ? commentClose(code4) : comment2(code4);
    }
    function cdataOpenInside(code4) {
      const value = "CDATA[";
      if (code4 === value.charCodeAt(index2++)) {
        effects.consume(code4);
        return index2 === value.length ? cdata : cdataOpenInside;
      }
      return nok(code4);
    }
    function cdata(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.consume(code4);
        return cdataClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = cdata;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return cdata;
    }
    function cdataClose(code4) {
      if (code4 === 93) {
        effects.consume(code4);
        return cdataEnd;
      }
      return cdata(code4);
    }
    function cdataEnd(code4) {
      if (code4 === 62) {
        return end(code4);
      }
      if (code4 === 93) {
        effects.consume(code4);
        return cdataEnd;
      }
      return cdata(code4);
    }
    function declaration(code4) {
      if (code4 === null || code4 === 62) {
        return end(code4);
      }
      if (markdownLineEnding(code4)) {
        returnState = declaration;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return declaration;
    }
    function instruction(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (code4 === 63) {
        effects.consume(code4);
        return instructionClose;
      }
      if (markdownLineEnding(code4)) {
        returnState = instruction;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return instruction;
    }
    function instructionClose(code4) {
      return code4 === 62 ? end(code4) : instruction(code4);
    }
    function tagCloseStart(code4) {
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return tagClose;
      }
      return nok(code4);
    }
    function tagClose(code4) {
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagClose;
      }
      return tagCloseBetween(code4);
    }
    function tagCloseBetween(code4) {
      if (markdownLineEnding(code4)) {
        returnState = tagCloseBetween;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagCloseBetween;
      }
      return end(code4);
    }
    function tagOpen(code4) {
      if (code4 === 45 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagOpen;
      }
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      return nok(code4);
    }
    function tagOpenBetween(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        return end;
      }
      if (code4 === 58 || code4 === 95 || asciiAlpha(code4)) {
        effects.consume(code4);
        return tagOpenAttributeName;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenBetween;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenBetween;
      }
      return end(code4);
    }
    function tagOpenAttributeName(code4) {
      if (code4 === 45 || code4 === 46 || code4 === 58 || code4 === 95 || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return tagOpenAttributeName;
      }
      return tagOpenAttributeNameAfter(code4);
    }
    function tagOpenAttributeNameAfter(code4) {
      if (code4 === 61) {
        effects.consume(code4);
        return tagOpenAttributeValueBefore;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeNameAfter;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenAttributeNameAfter;
      }
      return tagOpenBetween(code4);
    }
    function tagOpenAttributeValueBefore(code4) {
      if (code4 === null || code4 === 60 || code4 === 61 || code4 === 62 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 34 || code4 === 39) {
        effects.consume(code4);
        marker = code4;
        return tagOpenAttributeValueQuoted;
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeValueBefore;
        return lineEndingBefore(code4);
      }
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return tagOpenAttributeValueBefore;
      }
      effects.consume(code4);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        marker = void 0;
        return tagOpenAttributeValueQuotedAfter;
      }
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        returnState = tagOpenAttributeValueQuoted;
        return lineEndingBefore(code4);
      }
      effects.consume(code4);
      return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueUnquoted(code4) {
      if (code4 === null || code4 === 34 || code4 === 39 || code4 === 60 || code4 === 61 || code4 === 96) {
        return nok(code4);
      }
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      effects.consume(code4);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuotedAfter(code4) {
      if (code4 === 47 || code4 === 62 || markdownLineEndingOrSpace(code4)) {
        return tagOpenBetween(code4);
      }
      return nok(code4);
    }
    function end(code4) {
      if (code4 === 62) {
        effects.consume(code4);
        effects.exit("htmlTextData");
        effects.exit("htmlText");
        return ok3;
      }
      return nok(code4);
    }
    function lineEndingBefore(code4) {
      effects.exit("htmlTextData");
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return lineEndingAfter;
    }
    function lineEndingAfter(code4) {
      return markdownSpace(code4) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4) : lineEndingAfterPrefix(code4);
    }
    function lineEndingAfterPrefix(code4) {
      effects.enter("htmlTextData");
      return returnState(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-end.js
  var labelEnd = {
    name: "labelEnd",
    resolveAll: resolveAllLabelEnd,
    resolveTo: resolveToLabelEnd,
    tokenize: tokenizeLabelEnd
  };
  var resourceConstruct = {
    tokenize: tokenizeResource
  };
  var referenceFullConstruct = {
    tokenize: tokenizeReferenceFull
  };
  var referenceCollapsedConstruct = {
    tokenize: tokenizeReferenceCollapsed
  };
  function resolveAllLabelEnd(events) {
    let index2 = -1;
    const newEvents = [];
    while (++index2 < events.length) {
      const token = events[index2][1];
      newEvents.push(events[index2]);
      if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
        const offset = token.type === "labelImage" ? 4 : 2;
        token.type = "data";
        index2 += offset;
      }
    }
    if (events.length !== newEvents.length) {
      splice(events, 0, events.length, newEvents);
    }
    return events;
  }
  function resolveToLabelEnd(events, context) {
    let index2 = events.length;
    let offset = 0;
    let token;
    let open;
    let close;
    let media;
    while (index2--) {
      token = events[index2][1];
      if (open) {
        if (token.type === "link" || token.type === "labelLink" && token._inactive) {
          break;
        }
        if (events[index2][0] === "enter" && token.type === "labelLink") {
          token._inactive = true;
        }
      } else if (close) {
        if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
          open = index2;
          if (token.type !== "labelLink") {
            offset = 2;
            break;
          }
        }
      } else if (token.type === "labelEnd") {
        close = index2;
      }
    }
    const group = {
      type: events[open][1].type === "labelLink" ? "link" : "image",
      start: {
        ...events[open][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    const label2 = {
      type: "label",
      start: {
        ...events[open][1].start
      },
      end: {
        ...events[close][1].end
      }
    };
    const text7 = {
      type: "labelText",
      start: {
        ...events[open + offset + 2][1].end
      },
      end: {
        ...events[close - 2][1].start
      }
    };
    media = [["enter", group, context], ["enter", label2, context]];
    media = push(media, events.slice(open + 1, open + offset + 3));
    media = push(media, [["enter", text7, context]]);
    media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
    media = push(media, [["exit", text7, context], events[close - 2], events[close - 1], ["exit", label2, context]]);
    media = push(media, events.slice(close + 1));
    media = push(media, [["exit", group, context]]);
    splice(events, open, events.length, media);
    return events;
  }
  function tokenizeLabelEnd(effects, ok3, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    let labelStart;
    let defined;
    while (index2--) {
      if ((self2.events[index2][1].type === "labelImage" || self2.events[index2][1].type === "labelLink") && !self2.events[index2][1]._balanced) {
        labelStart = self2.events[index2][1];
        break;
      }
    }
    return start;
    function start(code4) {
      if (!labelStart) {
        return nok(code4);
      }
      if (labelStart._inactive) {
        return labelEndNok(code4);
      }
      defined = self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize({
        start: labelStart.end,
        end: self2.now()
      })));
      effects.enter("labelEnd");
      effects.enter("labelMarker");
      effects.consume(code4);
      effects.exit("labelMarker");
      effects.exit("labelEnd");
      return after;
    }
    function after(code4) {
      if (code4 === 40) {
        return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code4);
      }
      if (code4 === 91) {
        return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code4);
      }
      return defined ? labelEndOk(code4) : labelEndNok(code4);
    }
    function referenceNotFull(code4) {
      return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code4);
    }
    function labelEndOk(code4) {
      return ok3(code4);
    }
    function labelEndNok(code4) {
      labelStart._balanced = true;
      return nok(code4);
    }
  }
  function tokenizeResource(effects, ok3, nok) {
    return resourceStart;
    function resourceStart(code4) {
      effects.enter("resource");
      effects.enter("resourceMarker");
      effects.consume(code4);
      effects.exit("resourceMarker");
      return resourceBefore;
    }
    function resourceBefore(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceOpen)(code4) : resourceOpen(code4);
    }
    function resourceOpen(code4) {
      if (code4 === 41) {
        return resourceEnd(code4);
      }
      return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code4);
    }
    function resourceDestinationAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceBetween)(code4) : resourceEnd(code4);
    }
    function resourceDestinationMissing(code4) {
      return nok(code4);
    }
    function resourceBetween(code4) {
      if (code4 === 34 || code4 === 39 || code4 === 40) {
        return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code4);
      }
      return resourceEnd(code4);
    }
    function resourceTitleAfter(code4) {
      return markdownLineEndingOrSpace(code4) ? factoryWhitespace(effects, resourceEnd)(code4) : resourceEnd(code4);
    }
    function resourceEnd(code4) {
      if (code4 === 41) {
        effects.enter("resourceMarker");
        effects.consume(code4);
        effects.exit("resourceMarker");
        effects.exit("resource");
        return ok3;
      }
      return nok(code4);
    }
  }
  function tokenizeReferenceFull(effects, ok3, nok) {
    const self2 = this;
    return referenceFull;
    function referenceFull(code4) {
      return factoryLabel.call(self2, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code4);
    }
    function referenceFullAfter(code4) {
      return self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1))) ? ok3(code4) : nok(code4);
    }
    function referenceFullMissing(code4) {
      return nok(code4);
    }
  }
  function tokenizeReferenceCollapsed(effects, ok3, nok) {
    return referenceCollapsedStart;
    function referenceCollapsedStart(code4) {
      effects.enter("reference");
      effects.enter("referenceMarker");
      effects.consume(code4);
      effects.exit("referenceMarker");
      return referenceCollapsedOpen;
    }
    function referenceCollapsedOpen(code4) {
      if (code4 === 93) {
        effects.enter("referenceMarker");
        effects.consume(code4);
        effects.exit("referenceMarker");
        effects.exit("reference");
        return ok3;
      }
      return nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-image.js
  var labelStartImage = {
    name: "labelStartImage",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartImage
  };
  function tokenizeLabelStartImage(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("labelImage");
      effects.enter("labelImageMarker");
      effects.consume(code4);
      effects.exit("labelImageMarker");
      return open;
    }
    function open(code4) {
      if (code4 === 91) {
        effects.enter("labelMarker");
        effects.consume(code4);
        effects.exit("labelMarker");
        effects.exit("labelImage");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      return code4 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-link.js
  var labelStartLink = {
    name: "labelStartLink",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartLink
  };
  function tokenizeLabelStartLink(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      effects.enter("labelLink");
      effects.enter("labelMarker");
      effects.consume(code4);
      effects.exit("labelMarker");
      effects.exit("labelLink");
      return after;
    }
    function after(code4) {
      return code4 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/line-ending.js
  var lineEnding = {
    name: "lineEnding",
    tokenize: tokenizeLineEnding
  };
  function tokenizeLineEnding(effects, ok3) {
    return start;
    function start(code4) {
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      return factorySpace(effects, ok3, "linePrefix");
    }
  }

  // node_modules/micromark-core-commonmark/lib/thematic-break.js
  var thematicBreak = {
    name: "thematicBreak",
    tokenize: tokenizeThematicBreak
  };
  function tokenizeThematicBreak(effects, ok3, nok) {
    let size = 0;
    let marker;
    return start;
    function start(code4) {
      effects.enter("thematicBreak");
      return before(code4);
    }
    function before(code4) {
      marker = code4;
      return atBreak(code4);
    }
    function atBreak(code4) {
      if (code4 === marker) {
        effects.enter("thematicBreakSequence");
        return sequence(code4);
      }
      if (size >= 3 && (code4 === null || markdownLineEnding(code4))) {
        effects.exit("thematicBreak");
        return ok3(code4);
      }
      return nok(code4);
    }
    function sequence(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        size++;
        return sequence;
      }
      effects.exit("thematicBreakSequence");
      return markdownSpace(code4) ? factorySpace(effects, atBreak, "whitespace")(code4) : atBreak(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/list.js
  var list = {
    continuation: {
      tokenize: tokenizeListContinuation
    },
    exit: tokenizeListEnd,
    name: "list",
    tokenize: tokenizeListStart
  };
  var listItemPrefixWhitespaceConstruct = {
    partial: true,
    tokenize: tokenizeListItemPrefixWhitespace
  };
  var indentConstruct = {
    partial: true,
    tokenize: tokenizeIndent
  };
  function tokenizeListStart(effects, ok3, nok) {
    const self2 = this;
    const tail = self2.events[self2.events.length - 1];
    let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let size = 0;
    return start;
    function start(code4) {
      const kind = self2.containerState.type || (code4 === 42 || code4 === 43 || code4 === 45 ? "listUnordered" : "listOrdered");
      if (kind === "listUnordered" ? !self2.containerState.marker || code4 === self2.containerState.marker : asciiDigit(code4)) {
        if (!self2.containerState.type) {
          self2.containerState.type = kind;
          effects.enter(kind, {
            _container: true
          });
        }
        if (kind === "listUnordered") {
          effects.enter("listItemPrefix");
          return code4 === 42 || code4 === 45 ? effects.check(thematicBreak, nok, atMarker)(code4) : atMarker(code4);
        }
        if (!self2.interrupt || code4 === 49) {
          effects.enter("listItemPrefix");
          effects.enter("listItemValue");
          return inside(code4);
        }
      }
      return nok(code4);
    }
    function inside(code4) {
      if (asciiDigit(code4) && ++size < 10) {
        effects.consume(code4);
        return inside;
      }
      if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code4 === self2.containerState.marker : code4 === 41 || code4 === 46)) {
        effects.exit("listItemValue");
        return atMarker(code4);
      }
      return nok(code4);
    }
    function atMarker(code4) {
      effects.enter("listItemMarker");
      effects.consume(code4);
      effects.exit("listItemMarker");
      self2.containerState.marker = self2.containerState.marker || code4;
      return effects.check(
        blankLine,
        // Can’t be empty when interrupting.
        self2.interrupt ? nok : onBlank,
        effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
      );
    }
    function onBlank(code4) {
      self2.containerState.initialBlankLine = true;
      initialSize++;
      return endOfPrefix(code4);
    }
    function otherPrefix(code4) {
      if (markdownSpace(code4)) {
        effects.enter("listItemPrefixWhitespace");
        effects.consume(code4);
        effects.exit("listItemPrefixWhitespace");
        return endOfPrefix;
      }
      return nok(code4);
    }
    function endOfPrefix(code4) {
      self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit("listItemPrefix"), true).length;
      return ok3(code4);
    }
  }
  function tokenizeListContinuation(effects, ok3, nok) {
    const self2 = this;
    self2.containerState._closeFlow = void 0;
    return effects.check(blankLine, onBlank, notBlank);
    function onBlank(code4) {
      self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
      return factorySpace(effects, ok3, "listItemIndent", self2.containerState.size + 1)(code4);
    }
    function notBlank(code4) {
      if (self2.containerState.furtherBlankLines || !markdownSpace(code4)) {
        self2.containerState.furtherBlankLines = void 0;
        self2.containerState.initialBlankLine = void 0;
        return notInCurrentItem(code4);
      }
      self2.containerState.furtherBlankLines = void 0;
      self2.containerState.initialBlankLine = void 0;
      return effects.attempt(indentConstruct, ok3, notInCurrentItem)(code4);
    }
    function notInCurrentItem(code4) {
      self2.containerState._closeFlow = true;
      self2.interrupt = void 0;
      return factorySpace(effects, effects.attempt(list, ok3, nok), "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
    }
  }
  function tokenizeIndent(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "listItemIndent", self2.containerState.size + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok3(code4) : nok(code4);
    }
  }
  function tokenizeListEnd(effects) {
    effects.exit(this.containerState.type);
  }
  function tokenizeListItemPrefixWhitespace(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return !markdownSpace(code4) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-core-commonmark/lib/setext-underline.js
  var setextUnderline = {
    name: "setextUnderline",
    resolveTo: resolveToSetextUnderline,
    tokenize: tokenizeSetextUnderline
  };
  function resolveToSetextUnderline(events, context) {
    let index2 = events.length;
    let content3;
    let text7;
    let definition3;
    while (index2--) {
      if (events[index2][0] === "enter") {
        if (events[index2][1].type === "content") {
          content3 = index2;
          break;
        }
        if (events[index2][1].type === "paragraph") {
          text7 = index2;
        }
      } else {
        if (events[index2][1].type === "content") {
          events.splice(index2, 1);
        }
        if (!definition3 && events[index2][1].type === "definition") {
          definition3 = index2;
        }
      }
    }
    const heading3 = {
      type: "setextHeading",
      start: {
        ...events[content3][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    events[text7][1].type = "setextHeadingText";
    if (definition3) {
      events.splice(text7, 0, ["enter", heading3, context]);
      events.splice(definition3 + 1, 0, ["exit", events[content3][1], context]);
      events[content3][1].end = {
        ...events[definition3][1].end
      };
    } else {
      events[content3][1] = heading3;
    }
    events.push(["exit", heading3, context]);
    return events;
  }
  function tokenizeSetextUnderline(effects, ok3, nok) {
    const self2 = this;
    let marker;
    return start;
    function start(code4) {
      let index2 = self2.events.length;
      let paragraph3;
      while (index2--) {
        if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
          paragraph3 = self2.events[index2][1].type === "paragraph";
          break;
        }
      }
      if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph3)) {
        effects.enter("setextHeadingLine");
        marker = code4;
        return before(code4);
      }
      return nok(code4);
    }
    function before(code4) {
      effects.enter("setextHeadingLineSequence");
      return inside(code4);
    }
    function inside(code4) {
      if (code4 === marker) {
        effects.consume(code4);
        return inside;
      }
      effects.exit("setextHeadingLineSequence");
      return markdownSpace(code4) ? factorySpace(effects, after, "lineSuffix")(code4) : after(code4);
    }
    function after(code4) {
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("setextHeadingLine");
        return ok3(code4);
      }
      return nok(code4);
    }
  }

  // node_modules/micromark/lib/initialize/flow.js
  var flow = {
    tokenize: initializeFlow
  };
  function initializeFlow(effects) {
    const self2 = this;
    const initial = effects.attempt(
      // Try to parse a blank line.
      blankLine,
      atBlankEnding,
      // Try to parse initial flow (essentially, only code).
      effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), "linePrefix"))
    );
    return initial;
    function atBlankEnding(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEndingBlank");
      effects.consume(code4);
      effects.exit("lineEndingBlank");
      self2.currentConstruct = void 0;
      return initial;
    }
    function afterConstruct(code4) {
      if (code4 === null) {
        effects.consume(code4);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code4);
      effects.exit("lineEnding");
      self2.currentConstruct = void 0;
      return initial;
    }
  }

  // node_modules/micromark/lib/initialize/text.js
  var resolver = {
    resolveAll: createResolver()
  };
  var string = initializeFactory("string");
  var text = initializeFactory("text");
  function initializeFactory(field) {
    return {
      resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
      tokenize: initializeText
    };
    function initializeText(effects) {
      const self2 = this;
      const constructs2 = this.parser.constructs[field];
      const text7 = effects.attempt(constructs2, start, notText);
      return start;
      function start(code4) {
        return atBreak(code4) ? text7(code4) : notText(code4);
      }
      function notText(code4) {
        if (code4 === null) {
          effects.consume(code4);
          return;
        }
        effects.enter("data");
        effects.consume(code4);
        return data;
      }
      function data(code4) {
        if (atBreak(code4)) {
          effects.exit("data");
          return text7(code4);
        }
        effects.consume(code4);
        return data;
      }
      function atBreak(code4) {
        if (code4 === null) {
          return true;
        }
        const list4 = constructs2[code4];
        let index2 = -1;
        if (list4) {
          while (++index2 < list4.length) {
            const item = list4[index2];
            if (!item.previous || item.previous.call(self2, self2.previous)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
  function createResolver(extraResolver) {
    return resolveAllText;
    function resolveAllText(events, context) {
      let index2 = -1;
      let enter;
      while (++index2 <= events.length) {
        if (enter === void 0) {
          if (events[index2] && events[index2][1].type === "data") {
            enter = index2;
            index2++;
          }
        } else if (!events[index2] || events[index2][1].type !== "data") {
          if (index2 !== enter + 2) {
            events[enter][1].end = events[index2 - 1][1].end;
            events.splice(enter + 2, index2 - enter - 2);
            index2 = enter + 2;
          }
          enter = void 0;
        }
      }
      return extraResolver ? extraResolver(events, context) : events;
    }
  }
  function resolveAllLineSuffixes(events, context) {
    let eventIndex = 0;
    while (++eventIndex <= events.length) {
      if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
        const data = events[eventIndex - 1][1];
        const chunks = context.sliceStream(data);
        let index2 = chunks.length;
        let bufferIndex = -1;
        let size = 0;
        let tabs;
        while (index2--) {
          const chunk = chunks[index2];
          if (typeof chunk === "string") {
            bufferIndex = chunk.length;
            while (chunk.charCodeAt(bufferIndex - 1) === 32) {
              size++;
              bufferIndex--;
            }
            if (bufferIndex) break;
            bufferIndex = -1;
          } else if (chunk === -2) {
            tabs = true;
            size++;
          } else if (chunk === -1) {
          } else {
            index2++;
            break;
          }
        }
        if (context._contentTypeTextTrailing && eventIndex === events.length) {
          size = 0;
        }
        if (size) {
          const token = {
            type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
              _index: data.start._index + index2,
              line: data.end.line,
              column: data.end.column - size,
              offset: data.end.offset - size
            },
            end: {
              ...data.end
            }
          };
          data.end = {
            ...token.start
          };
          if (data.start.offset === data.end.offset) {
            Object.assign(data, token);
          } else {
            events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
            eventIndex += 2;
          }
        }
        eventIndex++;
      }
    }
    return events;
  }

  // node_modules/micromark/lib/constructs.js
  var constructs_exports = {};
  __export(constructs_exports, {
    attentionMarkers: () => attentionMarkers,
    contentInitial: () => contentInitial,
    disable: () => disable,
    document: () => document3,
    flow: () => flow2,
    flowInitial: () => flowInitial,
    insideSpan: () => insideSpan,
    string: () => string2,
    text: () => text2
  });
  var document3 = {
    [42]: list,
    [43]: list,
    [45]: list,
    [48]: list,
    [49]: list,
    [50]: list,
    [51]: list,
    [52]: list,
    [53]: list,
    [54]: list,
    [55]: list,
    [56]: list,
    [57]: list,
    [62]: blockQuote
  };
  var contentInitial = {
    [91]: definition
  };
  var flowInitial = {
    [-2]: codeIndented,
    [-1]: codeIndented,
    [32]: codeIndented
  };
  var flow2 = {
    [35]: headingAtx,
    [42]: thematicBreak,
    [45]: [setextUnderline, thematicBreak],
    [60]: htmlFlow,
    [61]: setextUnderline,
    [95]: thematicBreak,
    [96]: codeFenced,
    [126]: codeFenced
  };
  var string2 = {
    [38]: characterReference,
    [92]: characterEscape
  };
  var text2 = {
    [-5]: lineEnding,
    [-4]: lineEnding,
    [-3]: lineEnding,
    [33]: labelStartImage,
    [38]: characterReference,
    [42]: attention,
    [60]: [autolink, htmlText],
    [91]: labelStartLink,
    [92]: [hardBreakEscape, characterEscape],
    [93]: labelEnd,
    [95]: attention,
    [96]: codeText
  };
  var insideSpan = {
    null: [attention, resolver]
  };
  var attentionMarkers = {
    null: [42, 95]
  };
  var disable = {
    null: []
  };

  // node_modules/micromark/lib/create-tokenizer.js
  function createTokenizer(parser, initialize, from) {
    let point4 = {
      _bufferIndex: -1,
      _index: 0,
      line: from && from.line || 1,
      column: from && from.column || 1,
      offset: from && from.offset || 0
    };
    const columnStart = {};
    const resolveAllConstructs = [];
    let chunks = [];
    let stack = [];
    let consumed = true;
    const effects = {
      attempt: constructFactory(onsuccessfulconstruct),
      check: constructFactory(onsuccessfulcheck),
      consume,
      enter,
      exit: exit3,
      interrupt: constructFactory(onsuccessfulcheck, {
        interrupt: true
      })
    };
    const context = {
      code: null,
      containerState: {},
      defineSkip,
      events: [],
      now,
      parser,
      previous: null,
      sliceSerialize,
      sliceStream,
      write
    };
    let state = initialize.tokenize.call(context, effects);
    let expectedCode;
    if (initialize.resolveAll) {
      resolveAllConstructs.push(initialize);
    }
    return context;
    function write(slice) {
      chunks = push(chunks, slice);
      main();
      if (chunks[chunks.length - 1] !== null) {
        return [];
      }
      addResult(initialize, 0);
      context.events = resolveAll(resolveAllConstructs, context.events, context);
      return context.events;
    }
    function sliceSerialize(token, expandTabs) {
      return serializeChunks(sliceStream(token), expandTabs);
    }
    function sliceStream(token) {
      return sliceChunks(chunks, token);
    }
    function now() {
      const {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      } = point4;
      return {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      };
    }
    function defineSkip(value) {
      columnStart[value.line] = value.column;
      accountForPotentialSkip();
    }
    function main() {
      let chunkIndex;
      while (point4._index < chunks.length) {
        const chunk = chunks[point4._index];
        if (typeof chunk === "string") {
          chunkIndex = point4._index;
          if (point4._bufferIndex < 0) {
            point4._bufferIndex = 0;
          }
          while (point4._index === chunkIndex && point4._bufferIndex < chunk.length) {
            go(chunk.charCodeAt(point4._bufferIndex));
          }
        } else {
          go(chunk);
        }
      }
    }
    function go(code4) {
      consumed = void 0;
      expectedCode = code4;
      state = state(code4);
    }
    function consume(code4) {
      if (markdownLineEnding(code4)) {
        point4.line++;
        point4.column = 1;
        point4.offset += code4 === -3 ? 2 : 1;
        accountForPotentialSkip();
      } else if (code4 !== -1) {
        point4.column++;
        point4.offset++;
      }
      if (point4._bufferIndex < 0) {
        point4._index++;
      } else {
        point4._bufferIndex++;
        if (point4._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
        // strings.
        /** @type {string} */
        chunks[point4._index].length) {
          point4._bufferIndex = -1;
          point4._index++;
        }
      }
      context.previous = code4;
      consumed = true;
    }
    function enter(type, fields) {
      const token = fields || {};
      token.type = type;
      token.start = now();
      context.events.push(["enter", token, context]);
      stack.push(token);
      return token;
    }
    function exit3(type) {
      const token = stack.pop();
      token.end = now();
      context.events.push(["exit", token, context]);
      return token;
    }
    function onsuccessfulconstruct(construct, info) {
      addResult(construct, info.from);
    }
    function onsuccessfulcheck(_, info) {
      info.restore();
    }
    function constructFactory(onreturn, fields) {
      return hook;
      function hook(constructs2, returnState, bogusState) {
        let listOfConstructs;
        let constructIndex;
        let currentConstruct;
        let info;
        return Array.isArray(constructs2) ? (
          /* c8 ignore next 1 */
          handleListOfConstructs(constructs2)
        ) : "tokenize" in constructs2 ? (
          // Looks like a construct.
          handleListOfConstructs([
            /** @type {Construct} */
            constructs2
          ])
        ) : handleMapOfConstructs(constructs2);
        function handleMapOfConstructs(map4) {
          return start;
          function start(code4) {
            const left = code4 !== null && map4[code4];
            const all3 = code4 !== null && map4.null;
            const list4 = [
              // To do: add more extension tests.
              /* c8 ignore next 2 */
              ...Array.isArray(left) ? left : left ? [left] : [],
              ...Array.isArray(all3) ? all3 : all3 ? [all3] : []
            ];
            return handleListOfConstructs(list4)(code4);
          }
        }
        function handleListOfConstructs(list4) {
          listOfConstructs = list4;
          constructIndex = 0;
          if (list4.length === 0) {
            return bogusState;
          }
          return handleConstruct(list4[constructIndex]);
        }
        function handleConstruct(construct) {
          return start;
          function start(code4) {
            info = store();
            currentConstruct = construct;
            if (!construct.partial) {
              context.currentConstruct = construct;
            }
            if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
              return nok(code4);
            }
            return construct.tokenize.call(
              // If we do have fields, create an object w/ `context` as its
              // prototype.
              // This allows a “live binding”, which is needed for `interrupt`.
              fields ? Object.assign(Object.create(context), fields) : context,
              effects,
              ok3,
              nok
            )(code4);
          }
        }
        function ok3(code4) {
          consumed = true;
          onreturn(currentConstruct, info);
          return returnState;
        }
        function nok(code4) {
          consumed = true;
          info.restore();
          if (++constructIndex < listOfConstructs.length) {
            return handleConstruct(listOfConstructs[constructIndex]);
          }
          return bogusState;
        }
      }
    }
    function addResult(construct, from2) {
      if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
        resolveAllConstructs.push(construct);
      }
      if (construct.resolve) {
        splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
      }
      if (construct.resolveTo) {
        context.events = construct.resolveTo(context.events, context);
      }
    }
    function store() {
      const startPoint = now();
      const startPrevious = context.previous;
      const startCurrentConstruct = context.currentConstruct;
      const startEventsIndex = context.events.length;
      const startStack = Array.from(stack);
      return {
        from: startEventsIndex,
        restore
      };
      function restore() {
        point4 = startPoint;
        context.previous = startPrevious;
        context.currentConstruct = startCurrentConstruct;
        context.events.length = startEventsIndex;
        stack = startStack;
        accountForPotentialSkip();
      }
    }
    function accountForPotentialSkip() {
      if (point4.line in columnStart && point4.column < 2) {
        point4.column = columnStart[point4.line];
        point4.offset += columnStart[point4.line] - 1;
      }
    }
  }
  function sliceChunks(chunks, token) {
    const startIndex = token.start._index;
    const startBufferIndex = token.start._bufferIndex;
    const endIndex = token.end._index;
    const endBufferIndex = token.end._bufferIndex;
    let view;
    if (startIndex === endIndex) {
      view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
    } else {
      view = chunks.slice(startIndex, endIndex);
      if (startBufferIndex > -1) {
        const head2 = view[0];
        if (typeof head2 === "string") {
          view[0] = head2.slice(startBufferIndex);
        } else {
          view.shift();
        }
      }
      if (endBufferIndex > 0) {
        view.push(chunks[endIndex].slice(0, endBufferIndex));
      }
    }
    return view;
  }
  function serializeChunks(chunks, expandTabs) {
    let index2 = -1;
    const result = [];
    let atTab;
    while (++index2 < chunks.length) {
      const chunk = chunks[index2];
      let value;
      if (typeof chunk === "string") {
        value = chunk;
      } else switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = "\n";
          break;
        }
        case -3: {
          value = "\r\n";
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab) continue;
          value = " ";
          break;
        }
        default: {
          value = String.fromCharCode(chunk);
        }
      }
      atTab = chunk === -2;
      result.push(value);
    }
    return result.join("");
  }

  // node_modules/micromark/lib/parse.js
  function parse(options) {
    const settings = options || {};
    const constructs2 = (
      /** @type {FullNormalizedExtension} */
      combineExtensions([constructs_exports, ...settings.extensions || []])
    );
    const parser = {
      constructs: constructs2,
      content: create2(content),
      defined: [],
      document: create2(document2),
      flow: create2(flow),
      lazy: {},
      string: create2(string),
      text: create2(text)
    };
    return parser;
    function create2(initial) {
      return creator;
      function creator(from) {
        return createTokenizer(parser, initial, from);
      }
    }
  }

  // node_modules/micromark/lib/postprocess.js
  function postprocess(events) {
    while (!subtokenize(events)) {
    }
    return events;
  }

  // node_modules/micromark/lib/preprocess.js
  var search = /[\0\t\n\r]/g;
  function preprocess() {
    let column = 1;
    let buffer = "";
    let start = true;
    let atCarriageReturn;
    return preprocessor;
    function preprocessor(value, encoding, end) {
      const chunks = [];
      let match;
      let next;
      let startPosition;
      let endPosition;
      let code4;
      value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
      startPosition = 0;
      buffer = "";
      if (start) {
        if (value.charCodeAt(0) === 65279) {
          startPosition++;
        }
        start = void 0;
      }
      while (startPosition < value.length) {
        search.lastIndex = startPosition;
        match = search.exec(value);
        endPosition = match && match.index !== void 0 ? match.index : value.length;
        code4 = value.charCodeAt(endPosition);
        if (!match) {
          buffer = value.slice(startPosition);
          break;
        }
        if (code4 === 10 && startPosition === endPosition && atCarriageReturn) {
          chunks.push(-3);
          atCarriageReturn = void 0;
        } else {
          if (atCarriageReturn) {
            chunks.push(-5);
            atCarriageReturn = void 0;
          }
          if (startPosition < endPosition) {
            chunks.push(value.slice(startPosition, endPosition));
            column += endPosition - startPosition;
          }
          switch (code4) {
            case 0: {
              chunks.push(65533);
              column++;
              break;
            }
            case 9: {
              next = Math.ceil(column / 4) * 4;
              chunks.push(-2);
              while (column++ < next) chunks.push(-1);
              break;
            }
            case 10: {
              chunks.push(-4);
              column = 1;
              break;
            }
            default: {
              atCarriageReturn = true;
              column = 1;
            }
          }
        }
        startPosition = endPosition + 1;
      }
      if (end) {
        if (atCarriageReturn) chunks.push(-5);
        if (buffer) chunks.push(buffer);
        chunks.push(null);
      }
      return chunks;
    }
  }

  // node_modules/micromark-util-decode-string/index.js
  var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
  function decodeString(value) {
    return value.replace(characterEscapeOrReference, decode);
  }
  function decode($0, $1, $2) {
    if ($1) {
      return $1;
    }
    const head2 = $2.charCodeAt(0);
    if (head2 === 35) {
      const head3 = $2.charCodeAt(1);
      const hex = head3 === 120 || head3 === 88;
      return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
    }
    return decodeNamedCharacterReference($2) || $0;
  }

  // node_modules/mdast-util-from-markdown/lib/index.js
  var own2 = {}.hasOwnProperty;
  function fromMarkdown(value, encoding, options) {
    if (encoding && typeof encoding === "object") {
      options = encoding;
      encoding = void 0;
    }
    return compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, true))));
  }
  function compiler(options) {
    const config = {
      transforms: [],
      canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
      enter: {
        autolink: opener(link3),
        autolinkProtocol: onenterdata,
        autolinkEmail: onenterdata,
        atxHeading: opener(heading3),
        blockQuote: opener(blockQuote2),
        characterEscape: onenterdata,
        characterReference: onenterdata,
        codeFenced: opener(codeFlow),
        codeFencedFenceInfo: buffer,
        codeFencedFenceMeta: buffer,
        codeIndented: opener(codeFlow, buffer),
        codeText: opener(codeText2, buffer),
        codeTextData: onenterdata,
        data: onenterdata,
        codeFlowValue: onenterdata,
        definition: opener(definition3),
        definitionDestinationString: buffer,
        definitionLabelString: buffer,
        definitionTitleString: buffer,
        emphasis: opener(emphasis3),
        hardBreakEscape: opener(hardBreak3),
        hardBreakTrailing: opener(hardBreak3),
        htmlFlow: opener(html7, buffer),
        htmlFlowData: onenterdata,
        htmlText: opener(html7, buffer),
        htmlTextData: onenterdata,
        image: opener(image3),
        label: buffer,
        link: opener(link3),
        listItem: opener(listItem3),
        listItemValue: onenterlistitemvalue,
        listOrdered: opener(list4, onenterlistordered),
        listUnordered: opener(list4),
        paragraph: opener(paragraph3),
        reference: onenterreference,
        referenceString: buffer,
        resourceDestinationString: buffer,
        resourceTitleString: buffer,
        setextHeading: opener(heading3),
        strong: opener(strong3),
        thematicBreak: opener(thematicBreak4)
      },
      exit: {
        atxHeading: closer(),
        atxHeadingSequence: onexitatxheadingsequence,
        autolink: closer(),
        autolinkEmail: onexitautolinkemail,
        autolinkProtocol: onexitautolinkprotocol,
        blockQuote: closer(),
        characterEscapeValue: onexitdata,
        characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
        characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
        characterReferenceValue: onexitcharacterreferencevalue,
        characterReference: onexitcharacterreference,
        codeFenced: closer(onexitcodefenced),
        codeFencedFence: onexitcodefencedfence,
        codeFencedFenceInfo: onexitcodefencedfenceinfo,
        codeFencedFenceMeta: onexitcodefencedfencemeta,
        codeFlowValue: onexitdata,
        codeIndented: closer(onexitcodeindented),
        codeText: closer(onexitcodetext),
        codeTextData: onexitdata,
        data: onexitdata,
        definition: closer(),
        definitionDestinationString: onexitdefinitiondestinationstring,
        definitionLabelString: onexitdefinitionlabelstring,
        definitionTitleString: onexitdefinitiontitlestring,
        emphasis: closer(),
        hardBreakEscape: closer(onexithardbreak),
        hardBreakTrailing: closer(onexithardbreak),
        htmlFlow: closer(onexithtmlflow),
        htmlFlowData: onexitdata,
        htmlText: closer(onexithtmltext),
        htmlTextData: onexitdata,
        image: closer(onexitimage),
        label: onexitlabel,
        labelText: onexitlabeltext,
        lineEnding: onexitlineending,
        link: closer(onexitlink),
        listItem: closer(),
        listOrdered: closer(),
        listUnordered: closer(),
        paragraph: closer(),
        referenceString: onexitreferencestring,
        resourceDestinationString: onexitresourcedestinationstring,
        resourceTitleString: onexitresourcetitlestring,
        resource: onexitresource,
        setextHeading: closer(onexitsetextheading),
        setextHeadingLineSequence: onexitsetextheadinglinesequence,
        setextHeadingText: onexitsetextheadingtext,
        strong: closer(),
        thematicBreak: closer()
      }
    };
    configure(config, (options || {}).mdastExtensions || []);
    const data = {};
    return compile;
    function compile(events) {
      let tree = {
        type: "root",
        children: []
      };
      const context = {
        stack: [tree],
        tokenStack: [],
        config,
        enter,
        exit: exit3,
        buffer,
        resume,
        data
      };
      const listStack = [];
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
          if (events[index2][0] === "enter") {
            listStack.push(index2);
          } else {
            const tail = listStack.pop();
            index2 = prepareList(events, tail, index2);
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        const handler = config[events[index2][0]];
        if (own2.call(handler, events[index2][1].type)) {
          handler[events[index2][1].type].call(Object.assign({
            sliceSerialize: events[index2][2].sliceSerialize
          }, context), events[index2][1]);
        }
      }
      if (context.tokenStack.length > 0) {
        const tail = context.tokenStack[context.tokenStack.length - 1];
        const handler = tail[1] || defaultOnError;
        handler.call(context, void 0, tail[0]);
      }
      tree.position = {
        start: point2(events.length > 0 ? events[0][1].start : {
          line: 1,
          column: 1,
          offset: 0
        }),
        end: point2(events.length > 0 ? events[events.length - 2][1].end : {
          line: 1,
          column: 1,
          offset: 0
        })
      };
      index2 = -1;
      while (++index2 < config.transforms.length) {
        tree = config.transforms[index2](tree) || tree;
      }
      return tree;
    }
    function prepareList(events, start, length) {
      let index2 = start - 1;
      let containerBalance = -1;
      let listSpread = false;
      let listItem4;
      let lineIndex;
      let firstBlankLineIndex;
      let atMarker;
      while (++index2 <= length) {
        const event = events[index2];
        switch (event[1].type) {
          case "listUnordered":
          case "listOrdered":
          case "blockQuote": {
            if (event[0] === "enter") {
              containerBalance++;
            } else {
              containerBalance--;
            }
            atMarker = void 0;
            break;
          }
          case "lineEndingBlank": {
            if (event[0] === "enter") {
              if (listItem4 && !atMarker && !containerBalance && !firstBlankLineIndex) {
                firstBlankLineIndex = index2;
              }
              atMarker = void 0;
            }
            break;
          }
          case "linePrefix":
          case "listItemValue":
          case "listItemMarker":
          case "listItemPrefix":
          case "listItemPrefixWhitespace": {
            break;
          }
          default: {
            atMarker = void 0;
          }
        }
        if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
          if (listItem4) {
            let tailIndex = index2;
            lineIndex = void 0;
            while (tailIndex--) {
              const tailEvent = events[tailIndex];
              if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
                if (tailEvent[0] === "exit") continue;
                if (lineIndex) {
                  events[lineIndex][1].type = "lineEndingBlank";
                  listSpread = true;
                }
                tailEvent[1].type = "lineEnding";
                lineIndex = tailIndex;
              } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {
              } else {
                break;
              }
            }
            if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
              listItem4._spread = true;
            }
            listItem4.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
            events.splice(lineIndex || index2, 0, ["exit", listItem4, event[2]]);
            index2++;
            length++;
          }
          if (event[1].type === "listItemPrefix") {
            const item = {
              type: "listItem",
              _spread: false,
              start: Object.assign({}, event[1].start),
              // @ts-expect-error: we’ll add `end` in a second.
              end: void 0
            };
            listItem4 = item;
            events.splice(index2, 0, ["enter", item, event[2]]);
            index2++;
            length++;
            firstBlankLineIndex = void 0;
            atMarker = true;
          }
        }
      }
      events[start][1]._spread = listSpread;
      return length;
    }
    function opener(create2, and) {
      return open;
      function open(token) {
        enter.call(this, create2(token), token);
        if (and) and.call(this, token);
      }
    }
    function buffer() {
      this.stack.push({
        type: "fragment",
        children: []
      });
    }
    function enter(node2, token, errorHandler) {
      const parent = this.stack[this.stack.length - 1];
      const siblings2 = parent.children;
      siblings2.push(node2);
      this.stack.push(node2);
      this.tokenStack.push([token, errorHandler || void 0]);
      node2.position = {
        start: point2(token.start),
        // @ts-expect-error: `end` will be patched later.
        end: void 0
      };
    }
    function closer(and) {
      return close;
      function close(token) {
        if (and) and.call(this, token);
        exit3.call(this, token);
      }
    }
    function exit3(token, onExitError) {
      const node2 = this.stack.pop();
      const open = this.tokenStack.pop();
      if (!open) {
        throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
          start: token.start,
          end: token.end
        }) + "): it\u2019s not open");
      } else if (open[0].type !== token.type) {
        if (onExitError) {
          onExitError.call(this, token, open[0]);
        } else {
          const handler = open[1] || defaultOnError;
          handler.call(this, token, open[0]);
        }
      }
      node2.position.end = point2(token.end);
    }
    function resume() {
      return toString(this.stack.pop());
    }
    function onenterlistordered() {
      this.data.expectingFirstListItemValue = true;
    }
    function onenterlistitemvalue(token) {
      if (this.data.expectingFirstListItemValue) {
        const ancestor = this.stack[this.stack.length - 2];
        ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
        this.data.expectingFirstListItemValue = void 0;
      }
    }
    function onexitcodefencedfenceinfo() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.lang = data2;
    }
    function onexitcodefencedfencemeta() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.meta = data2;
    }
    function onexitcodefencedfence() {
      if (this.data.flowCodeInside) return;
      this.buffer();
      this.data.flowCodeInside = true;
    }
    function onexitcodefenced() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
      this.data.flowCodeInside = void 0;
    }
    function onexitcodeindented() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2.replace(/(\r?\n|\r)$/g, "");
    }
    function onexitdefinitionlabelstring(token) {
      const label2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label2;
      node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    }
    function onexitdefinitiontitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitdefinitiondestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitatxheadingsequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      if (!node2.depth) {
        const depth = this.sliceSerialize(token).length;
        node2.depth = depth;
      }
    }
    function onexitsetextheadingtext() {
      this.data.setextHeadingSlurpLineEnding = true;
    }
    function onexitsetextheadinglinesequence(token) {
      const node2 = this.stack[this.stack.length - 1];
      node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
    }
    function onexitsetextheading() {
      this.data.setextHeadingSlurpLineEnding = void 0;
    }
    function onenterdata(token) {
      const node2 = this.stack[this.stack.length - 1];
      const siblings2 = node2.children;
      let tail = siblings2[siblings2.length - 1];
      if (!tail || tail.type !== "text") {
        tail = text7();
        tail.position = {
          start: point2(token.start),
          // @ts-expect-error: we’ll add `end` later.
          end: void 0
        };
        siblings2.push(tail);
      }
      this.stack.push(tail);
    }
    function onexitdata(token) {
      const tail = this.stack.pop();
      tail.value += this.sliceSerialize(token);
      tail.position.end = point2(token.end);
    }
    function onexitlineending(token) {
      const context = this.stack[this.stack.length - 1];
      if (this.data.atHardBreak) {
        const tail = context.children[context.children.length - 1];
        tail.position.end = point2(token.end);
        this.data.atHardBreak = void 0;
        return;
      }
      if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
        onenterdata.call(this, token);
        onexitdata.call(this, token);
      }
    }
    function onexithardbreak() {
      this.data.atHardBreak = true;
    }
    function onexithtmlflow() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexithtmltext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitcodetext() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.value = data2;
    }
    function onexitlink() {
      const node2 = this.stack[this.stack.length - 1];
      if (this.data.inReference) {
        const referenceType = this.data.referenceType || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      this.data.referenceType = void 0;
    }
    function onexitimage() {
      const node2 = this.stack[this.stack.length - 1];
      if (this.data.inReference) {
        const referenceType = this.data.referenceType || "shortcut";
        node2.type += "Reference";
        node2.referenceType = referenceType;
        delete node2.url;
        delete node2.title;
      } else {
        delete node2.identifier;
        delete node2.label;
      }
      this.data.referenceType = void 0;
    }
    function onexitlabeltext(token) {
      const string4 = this.sliceSerialize(token);
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.label = decodeString(string4);
      ancestor.identifier = normalizeIdentifier(string4).toLowerCase();
    }
    function onexitlabel() {
      const fragment = this.stack[this.stack.length - 1];
      const value = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      this.data.inReference = true;
      if (node2.type === "link") {
        const children = fragment.children;
        node2.children = children;
      } else {
        node2.alt = value;
      }
    }
    function onexitresourcedestinationstring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.url = data2;
    }
    function onexitresourcetitlestring() {
      const data2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.title = data2;
    }
    function onexitresource() {
      this.data.inReference = void 0;
    }
    function onenterreference() {
      this.data.referenceType = "collapsed";
    }
    function onexitreferencestring(token) {
      const label2 = this.resume();
      const node2 = this.stack[this.stack.length - 1];
      node2.label = label2;
      node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
      this.data.referenceType = "full";
    }
    function onexitcharacterreferencemarker(token) {
      this.data.characterReferenceType = token.type;
    }
    function onexitcharacterreferencevalue(token) {
      const data2 = this.sliceSerialize(token);
      const type = this.data.characterReferenceType;
      let value;
      if (type) {
        value = decodeNumericCharacterReference(data2, type === "characterReferenceMarkerNumeric" ? 10 : 16);
        this.data.characterReferenceType = void 0;
      } else {
        const result = decodeNamedCharacterReference(data2);
        value = result;
      }
      const tail = this.stack[this.stack.length - 1];
      tail.value += value;
    }
    function onexitcharacterreference(token) {
      const tail = this.stack.pop();
      tail.position.end = point2(token.end);
    }
    function onexitautolinkprotocol(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = this.sliceSerialize(token);
    }
    function onexitautolinkemail(token) {
      onexitdata.call(this, token);
      const node2 = this.stack[this.stack.length - 1];
      node2.url = "mailto:" + this.sliceSerialize(token);
    }
    function blockQuote2() {
      return {
        type: "blockquote",
        children: []
      };
    }
    function codeFlow() {
      return {
        type: "code",
        lang: null,
        meta: null,
        value: ""
      };
    }
    function codeText2() {
      return {
        type: "inlineCode",
        value: ""
      };
    }
    function definition3() {
      return {
        type: "definition",
        identifier: "",
        label: null,
        title: null,
        url: ""
      };
    }
    function emphasis3() {
      return {
        type: "emphasis",
        children: []
      };
    }
    function heading3() {
      return {
        type: "heading",
        // @ts-expect-error `depth` will be set later.
        depth: 0,
        children: []
      };
    }
    function hardBreak3() {
      return {
        type: "break"
      };
    }
    function html7() {
      return {
        type: "html",
        value: ""
      };
    }
    function image3() {
      return {
        type: "image",
        title: null,
        url: "",
        alt: null
      };
    }
    function link3() {
      return {
        type: "link",
        title: null,
        url: "",
        children: []
      };
    }
    function list4(token) {
      return {
        type: "list",
        ordered: token.type === "listOrdered",
        start: null,
        spread: token._spread,
        children: []
      };
    }
    function listItem3(token) {
      return {
        type: "listItem",
        spread: token._spread,
        checked: null,
        children: []
      };
    }
    function paragraph3() {
      return {
        type: "paragraph",
        children: []
      };
    }
    function strong3() {
      return {
        type: "strong",
        children: []
      };
    }
    function text7() {
      return {
        type: "text",
        value: ""
      };
    }
    function thematicBreak4() {
      return {
        type: "thematicBreak"
      };
    }
  }
  function point2(d) {
    return {
      line: d.line,
      column: d.column,
      offset: d.offset
    };
  }
  function configure(combined, extensions) {
    let index2 = -1;
    while (++index2 < extensions.length) {
      const value = extensions[index2];
      if (Array.isArray(value)) {
        configure(combined, value);
      } else {
        extension(combined, value);
      }
    }
  }
  function extension(combined, extension2) {
    let key2;
    for (key2 in extension2) {
      if (own2.call(extension2, key2)) {
        switch (key2) {
          case "canContainEols": {
            const right = extension2[key2];
            if (right) {
              combined[key2].push(...right);
            }
            break;
          }
          case "transforms": {
            const right = extension2[key2];
            if (right) {
              combined[key2].push(...right);
            }
            break;
          }
          case "enter":
          case "exit": {
            const right = extension2[key2];
            if (right) {
              Object.assign(combined[key2], right);
            }
            break;
          }
        }
      }
    }
  }
  function defaultOnError(left, right) {
    if (left) {
      throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
        start: left.start,
        end: left.end
      }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is open");
    } else {
      throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is still open");
    }
  }

  // node_modules/remark-parse/lib/index.js
  function remarkParse(options) {
    const self2 = this;
    self2.parser = parser;
    function parser(doc) {
      return fromMarkdown(doc, {
        ...self2.data("settings"),
        ...options,
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: self2.data("micromarkExtensions") || [],
        mdastExtensions: self2.data("fromMarkdownExtensions") || []
      });
    }
  }

  // node_modules/ccount/index.js
  function ccount(value, character) {
    const source = String(value);
    if (typeof character !== "string") {
      throw new TypeError("Expected character");
    }
    let count = 0;
    let index2 = source.indexOf(character);
    while (index2 !== -1) {
      count++;
      index2 = source.indexOf(character, index2 + character.length);
    }
    return count;
  }

  // node_modules/escape-string-regexp/index.js
  function escapeStringRegexp(string4) {
    if (typeof string4 !== "string") {
      throw new TypeError("Expected a string");
    }
    return string4.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  }

  // node_modules/unist-util-is/lib/index.js
  var convert = (
    // Note: overloads in JSDoc can’t yet use different `@template`s.
    /**
     * @type {(
     *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
     *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
     *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
     *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
     *   ((test?: Test) => Check)
     * )}
     */
    /**
     * @param {Test} [test]
     * @returns {Check}
     */
    (function(test) {
      if (test === null || test === void 0) {
        return ok2;
      }
      if (typeof test === "function") {
        return castFactory(test);
      }
      if (typeof test === "object") {
        return Array.isArray(test) ? anyFactory(test) : (
          // Cast because `ReadonlyArray` goes into the above but `isArray`
          // narrows to `Array`.
          propertiesFactory(
            /** @type {Props} */
            test
          )
        );
      }
      if (typeof test === "string") {
        return typeFactory(test);
      }
      throw new Error("Expected function, string, or object as test");
    })
  );
  function anyFactory(tests) {
    const checks2 = [];
    let index2 = -1;
    while (++index2 < tests.length) {
      checks2[index2] = convert(tests[index2]);
    }
    return castFactory(any);
    function any(...parameters) {
      let index3 = -1;
      while (++index3 < checks2.length) {
        if (checks2[index3].apply(this, parameters)) return true;
      }
      return false;
    }
  }
  function propertiesFactory(check) {
    const checkAsRecord = (
      /** @type {Record<string, unknown>} */
      check
    );
    return castFactory(all3);
    function all3(node2) {
      const nodeAsRecord = (
        /** @type {Record<string, unknown>} */
        /** @type {unknown} */
        node2
      );
      let key2;
      for (key2 in check) {
        if (nodeAsRecord[key2] !== checkAsRecord[key2]) return false;
      }
      return true;
    }
  }
  function typeFactory(check) {
    return castFactory(type);
    function type(node2) {
      return node2 && node2.type === check;
    }
  }
  function castFactory(testFunction) {
    return check;
    function check(value, index2, parent) {
      return Boolean(
        looksLikeANode(value) && testFunction.call(
          this,
          value,
          typeof index2 === "number" ? index2 : void 0,
          parent || void 0
        )
      );
    }
  }
  function ok2() {
    return true;
  }
  function looksLikeANode(value) {
    return value !== null && typeof value === "object" && "type" in value;
  }

  // node_modules/unist-util-visit-parents/lib/color.js
  function color(d) {
    return d;
  }

  // node_modules/unist-util-visit-parents/lib/index.js
  var empty = [];
  var CONTINUE = true;
  var EXIT = false;
  var SKIP = "skip";
  function visitParents(tree, test, visitor, reverse) {
    let check;
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
    } else {
      check = test;
    }
    const is2 = convert(check);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node2, index2, parents) {
      const value = (
        /** @type {Record<string, unknown>} */
        node2 && typeof node2 === "object" ? node2 : {}
      );
      if (typeof value.type === "string") {
        const name = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit4, "name", {
          value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
        });
      }
      return visit4;
      function visit4() {
        let result = empty;
        let subresult;
        let offset;
        let grandparents;
        if (!test || is2(node2, index2, parents[parents.length - 1] || void 0)) {
          result = toResult(visitor(node2, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if ("children" in node2 && node2.children) {
          const nodeAsParent = (
            /** @type {UnistParent} */
            node2
          );
          if (nodeAsParent.children && result[0] !== SKIP) {
            offset = (reverse ? nodeAsParent.children.length : -1) + step;
            grandparents = parents.concat(nodeAsParent);
            while (offset > -1 && offset < nodeAsParent.children.length) {
              const child = nodeAsParent.children[offset];
              subresult = factory(child, offset, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
        }
        return result;
      }
    }
  }
  function toResult(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "number") {
      return [CONTINUE, value];
    }
    return value === null || value === void 0 ? empty : [value];
  }

  // node_modules/mdast-util-find-and-replace/lib/index.js
  function findAndReplace(tree, list4, options) {
    const settings = options || {};
    const ignored = convert(settings.ignore || []);
    const pairs2 = toPairs(list4);
    let pairIndex = -1;
    while (++pairIndex < pairs2.length) {
      visitParents(tree, "text", visitor);
    }
    function visitor(node2, parents) {
      let index2 = -1;
      let grandparent;
      while (++index2 < parents.length) {
        const parent = parents[index2];
        const siblings2 = grandparent ? grandparent.children : void 0;
        if (ignored(
          parent,
          siblings2 ? siblings2.indexOf(parent) : void 0,
          grandparent
        )) {
          return;
        }
        grandparent = parent;
      }
      if (grandparent) {
        return handler(node2, parents);
      }
    }
    function handler(node2, parents) {
      const parent = parents[parents.length - 1];
      const find2 = pairs2[pairIndex][0];
      const replace2 = pairs2[pairIndex][1];
      let start = 0;
      const siblings2 = parent.children;
      const index2 = siblings2.indexOf(node2);
      let change = false;
      let nodes = [];
      find2.lastIndex = 0;
      let match = find2.exec(node2.value);
      while (match) {
        const position3 = match.index;
        const matchObject = {
          index: match.index,
          input: match.input,
          stack: [...parents, node2]
        };
        let value = replace2(...match, matchObject);
        if (typeof value === "string") {
          value = value.length > 0 ? { type: "text", value } : void 0;
        }
        if (value === false) {
          find2.lastIndex = position3 + 1;
        } else {
          if (start !== position3) {
            nodes.push({
              type: "text",
              value: node2.value.slice(start, position3)
            });
          }
          if (Array.isArray(value)) {
            nodes.push(...value);
          } else if (value) {
            nodes.push(value);
          }
          start = position3 + match[0].length;
          change = true;
        }
        if (!find2.global) {
          break;
        }
        match = find2.exec(node2.value);
      }
      if (change) {
        if (start < node2.value.length) {
          nodes.push({ type: "text", value: node2.value.slice(start) });
        }
        parent.children.splice(index2, 1, ...nodes);
      } else {
        nodes = [node2];
      }
      return index2 + nodes.length;
    }
  }
  function toPairs(tupleOrList) {
    const result = [];
    if (!Array.isArray(tupleOrList)) {
      throw new TypeError("Expected find and replace tuple or list of tuples");
    }
    const list4 = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
    let index2 = -1;
    while (++index2 < list4.length) {
      const tuple = list4[index2];
      result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
    }
    return result;
  }
  function toExpression(find2) {
    return typeof find2 === "string" ? new RegExp(escapeStringRegexp(find2), "g") : find2;
  }
  function toFunction(replace2) {
    return typeof replace2 === "function" ? replace2 : function() {
      return replace2;
    };
  }

  // node_modules/mdast-util-gfm-autolink-literal/lib/index.js
  var inConstruct = "phrasing";
  var notInConstruct = ["autolink", "link", "image", "label"];
  function gfmAutolinkLiteralFromMarkdown() {
    return {
      transforms: [transformGfmAutolinkLiterals],
      enter: {
        literalAutolink: enterLiteralAutolink,
        literalAutolinkEmail: enterLiteralAutolinkValue,
        literalAutolinkHttp: enterLiteralAutolinkValue,
        literalAutolinkWww: enterLiteralAutolinkValue
      },
      exit: {
        literalAutolink: exitLiteralAutolink,
        literalAutolinkEmail: exitLiteralAutolinkEmail,
        literalAutolinkHttp: exitLiteralAutolinkHttp,
        literalAutolinkWww: exitLiteralAutolinkWww
      }
    };
  }
  function gfmAutolinkLiteralToMarkdown() {
    return {
      unsafe: [
        {
          character: "@",
          before: "[+\\-.\\w]",
          after: "[\\-.\\w]",
          inConstruct,
          notInConstruct
        },
        {
          character: ".",
          before: "[Ww]",
          after: "[\\-.\\w]",
          inConstruct,
          notInConstruct
        },
        {
          character: ":",
          before: "[ps]",
          after: "\\/",
          inConstruct,
          notInConstruct
        }
      ]
    };
  }
  function enterLiteralAutolink(token) {
    this.enter({ type: "link", title: null, url: "", children: [] }, token);
  }
  function enterLiteralAutolinkValue(token) {
    this.config.enter.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkHttp(token) {
    this.config.exit.autolinkProtocol.call(this, token);
  }
  function exitLiteralAutolinkWww(token) {
    this.config.exit.data.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "link");
    node2.url = "http://" + this.sliceSerialize(token);
  }
  function exitLiteralAutolinkEmail(token) {
    this.config.exit.autolinkEmail.call(this, token);
  }
  function exitLiteralAutolink(token) {
    this.exit(token);
  }
  function transformGfmAutolinkLiterals(tree) {
    findAndReplace(
      tree,
      [
        [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
        [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]
      ],
      { ignore: ["link", "linkReference"] }
    );
  }
  function findUrl(_, protocol, domain2, path2, match) {
    let prefix = "";
    if (!previous2(match)) {
      return false;
    }
    if (/^w/i.test(protocol)) {
      domain2 = protocol + domain2;
      protocol = "";
      prefix = "http://";
    }
    if (!isCorrectDomain(domain2)) {
      return false;
    }
    const parts = splitUrl(domain2 + path2);
    if (!parts[0]) return false;
    const result = {
      type: "link",
      title: null,
      url: prefix + protocol + parts[0],
      children: [{ type: "text", value: protocol + parts[0] }]
    };
    if (parts[1]) {
      return [result, { type: "text", value: parts[1] }];
    }
    return result;
  }
  function findEmail(_, atext, label2, match) {
    if (
      // Not an expected previous character.
      !previous2(match, true) || // Label ends in not allowed character.
      /[-\d_]$/.test(label2)
    ) {
      return false;
    }
    return {
      type: "link",
      title: null,
      url: "mailto:" + atext + "@" + label2,
      children: [{ type: "text", value: atext + "@" + label2 }]
    };
  }
  function isCorrectDomain(domain2) {
    const parts = domain2.split(".");
    if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) {
      return false;
    }
    return true;
  }
  function splitUrl(url) {
    const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
    if (!trailExec) {
      return [url, void 0];
    }
    url = url.slice(0, trailExec.index);
    let trail2 = trailExec[0];
    let closingParenIndex = trail2.indexOf(")");
    const openingParens = ccount(url, "(");
    let closingParens = ccount(url, ")");
    while (closingParenIndex !== -1 && openingParens > closingParens) {
      url += trail2.slice(0, closingParenIndex + 1);
      trail2 = trail2.slice(closingParenIndex + 1);
      closingParenIndex = trail2.indexOf(")");
      closingParens++;
    }
    return [url, trail2];
  }
  function previous2(match, email) {
    const code4 = match.input.charCodeAt(match.index - 1);
    return (match.index === 0 || unicodeWhitespace(code4) || unicodePunctuation(code4)) && // If it’s an email, the previous character should not be a slash.
    (!email || code4 !== 47);
  }

  // node_modules/mdast-util-gfm-footnote/lib/index.js
  footnoteReference.peek = footnoteReferencePeek;
  function enterFootnoteCallString() {
    this.buffer();
  }
  function enterFootnoteCall(token) {
    this.enter({ type: "footnoteReference", identifier: "", label: "" }, token);
  }
  function enterFootnoteDefinitionLabelString() {
    this.buffer();
  }
  function enterFootnoteDefinition(token) {
    this.enter(
      { type: "footnoteDefinition", identifier: "", label: "", children: [] },
      token
    );
  }
  function exitFootnoteCallString(token) {
    const label2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "footnoteReference");
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    node2.label = label2;
  }
  function exitFootnoteCall(token) {
    this.exit(token);
  }
  function exitFootnoteDefinitionLabelString(token) {
    const label2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "footnoteDefinition");
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    node2.label = label2;
  }
  function exitFootnoteDefinition(token) {
    this.exit(token);
  }
  function footnoteReferencePeek() {
    return "[";
  }
  function footnoteReference(node2, _, state, info) {
    const tracker = state.createTracker(info);
    let value = tracker.move("[^");
    const exit3 = state.enter("footnoteReference");
    const subexit = state.enter("reference");
    value += tracker.move(
      state.safe(state.associationId(node2), { after: "]", before: value })
    );
    subexit();
    exit3();
    value += tracker.move("]");
    return value;
  }
  function gfmFootnoteFromMarkdown() {
    return {
      enter: {
        gfmFootnoteCallString: enterFootnoteCallString,
        gfmFootnoteCall: enterFootnoteCall,
        gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
        gfmFootnoteDefinition: enterFootnoteDefinition
      },
      exit: {
        gfmFootnoteCallString: exitFootnoteCallString,
        gfmFootnoteCall: exitFootnoteCall,
        gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
        gfmFootnoteDefinition: exitFootnoteDefinition
      }
    };
  }
  function gfmFootnoteToMarkdown(options) {
    let firstLineBlank = false;
    if (options && options.firstLineBlank) {
      firstLineBlank = true;
    }
    return {
      handlers: { footnoteDefinition, footnoteReference },
      // This is on by default already.
      unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
    };
    function footnoteDefinition(node2, _, state, info) {
      const tracker = state.createTracker(info);
      let value = tracker.move("[^");
      const exit3 = state.enter("footnoteDefinition");
      const subexit = state.enter("label");
      value += tracker.move(
        state.safe(state.associationId(node2), { before: value, after: "]" })
      );
      subexit();
      value += tracker.move("]:");
      if (node2.children && node2.children.length > 0) {
        tracker.shift(4);
        value += tracker.move(
          (firstLineBlank ? "\n" : " ") + state.indentLines(
            state.containerFlow(node2, tracker.current()),
            firstLineBlank ? mapAll : mapExceptFirst
          )
        );
      }
      exit3();
      return value;
    }
  }
  function mapExceptFirst(line, index2, blank) {
    return index2 === 0 ? line : mapAll(line, index2, blank);
  }
  function mapAll(line, index2, blank) {
    return (blank ? "" : "    ") + line;
  }

  // node_modules/mdast-util-gfm-strikethrough/lib/index.js
  var constructsWithoutStrikethrough = [
    "autolink",
    "destinationLiteral",
    "destinationRaw",
    "reference",
    "titleQuote",
    "titleApostrophe"
  ];
  handleDelete.peek = peekDelete;
  function gfmStrikethroughFromMarkdown() {
    return {
      canContainEols: ["delete"],
      enter: { strikethrough: enterStrikethrough },
      exit: { strikethrough: exitStrikethrough }
    };
  }
  function gfmStrikethroughToMarkdown() {
    return {
      unsafe: [
        {
          character: "~",
          inConstruct: "phrasing",
          notInConstruct: constructsWithoutStrikethrough
        }
      ],
      handlers: { delete: handleDelete }
    };
  }
  function enterStrikethrough(token) {
    this.enter({ type: "delete", children: [] }, token);
  }
  function exitStrikethrough(token) {
    this.exit(token);
  }
  function handleDelete(node2, _, state, info) {
    const tracker = state.createTracker(info);
    const exit3 = state.enter("strikethrough");
    let value = tracker.move("~~");
    value += state.containerPhrasing(node2, {
      ...tracker.current(),
      before: value,
      after: "~"
    });
    value += tracker.move("~~");
    exit3();
    return value;
  }
  function peekDelete() {
    return "~";
  }

  // node_modules/markdown-table/index.js
  function defaultStringLength(value) {
    return value.length;
  }
  function markdownTable(table2, options) {
    const settings = options || {};
    const align = (settings.align || []).concat();
    const stringLength = settings.stringLength || defaultStringLength;
    const alignments = [];
    const cellMatrix = [];
    const sizeMatrix = [];
    const longestCellByColumn = [];
    let mostCellsPerRow = 0;
    let rowIndex = -1;
    while (++rowIndex < table2.length) {
      const row2 = [];
      const sizes2 = [];
      let columnIndex2 = -1;
      if (table2[rowIndex].length > mostCellsPerRow) {
        mostCellsPerRow = table2[rowIndex].length;
      }
      while (++columnIndex2 < table2[rowIndex].length) {
        const cell = serialize(table2[rowIndex][columnIndex2]);
        if (settings.alignDelimiters !== false) {
          const size = stringLength(cell);
          sizes2[columnIndex2] = size;
          if (longestCellByColumn[columnIndex2] === void 0 || size > longestCellByColumn[columnIndex2]) {
            longestCellByColumn[columnIndex2] = size;
          }
        }
        row2.push(cell);
      }
      cellMatrix[rowIndex] = row2;
      sizeMatrix[rowIndex] = sizes2;
    }
    let columnIndex = -1;
    if (typeof align === "object" && "length" in align) {
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = toAlignment(align[columnIndex]);
      }
    } else {
      const code4 = toAlignment(align);
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = code4;
      }
    }
    columnIndex = -1;
    const row = [];
    const sizes = [];
    while (++columnIndex < mostCellsPerRow) {
      const code4 = alignments[columnIndex];
      let before = "";
      let after = "";
      if (code4 === 99) {
        before = ":";
        after = ":";
      } else if (code4 === 108) {
        before = ":";
      } else if (code4 === 114) {
        after = ":";
      }
      let size = settings.alignDelimiters === false ? 1 : Math.max(
        1,
        longestCellByColumn[columnIndex] - before.length - after.length
      );
      const cell = before + "-".repeat(size) + after;
      if (settings.alignDelimiters !== false) {
        size = before.length + size + after.length;
        if (size > longestCellByColumn[columnIndex]) {
          longestCellByColumn[columnIndex] = size;
        }
        sizes[columnIndex] = size;
      }
      row[columnIndex] = cell;
    }
    cellMatrix.splice(1, 0, row);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    const lines = [];
    while (++rowIndex < cellMatrix.length) {
      const row2 = cellMatrix[rowIndex];
      const sizes2 = sizeMatrix[rowIndex];
      columnIndex = -1;
      const line = [];
      while (++columnIndex < mostCellsPerRow) {
        const cell = row2[columnIndex] || "";
        let before = "";
        let after = "";
        if (settings.alignDelimiters !== false) {
          const size = longestCellByColumn[columnIndex] - (sizes2[columnIndex] || 0);
          const code4 = alignments[columnIndex];
          if (code4 === 114) {
            before = " ".repeat(size);
          } else if (code4 === 99) {
            if (size % 2) {
              before = " ".repeat(size / 2 + 0.5);
              after = " ".repeat(size / 2 - 0.5);
            } else {
              before = " ".repeat(size / 2);
              after = before;
            }
          } else {
            after = " ".repeat(size);
          }
        }
        if (settings.delimiterStart !== false && !columnIndex) {
          line.push("|");
        }
        if (settings.padding !== false && // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) {
          line.push(" ");
        }
        if (settings.alignDelimiters !== false) {
          line.push(before);
        }
        line.push(cell);
        if (settings.alignDelimiters !== false) {
          line.push(after);
        }
        if (settings.padding !== false) {
          line.push(" ");
        }
        if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
          line.push("|");
        }
      }
      lines.push(
        settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join("")
      );
    }
    return lines.join("\n");
  }
  function serialize(value) {
    return value === null || value === void 0 ? "" : String(value);
  }
  function toAlignment(value) {
    const code4 = typeof value === "string" ? value.codePointAt(0) : 0;
    return code4 === 67 || code4 === 99 ? 99 : code4 === 76 || code4 === 108 ? 108 : code4 === 82 || code4 === 114 ? 114 : 0;
  }

  // node_modules/zwitch/index.js
  var own3 = {}.hasOwnProperty;
  function zwitch(key2, options) {
    const settings = options || {};
    function one3(value, ...parameters) {
      let fn = one3.invalid;
      const handlers2 = one3.handlers;
      if (value && own3.call(value, key2)) {
        const id = String(value[key2]);
        fn = own3.call(handlers2, id) ? handlers2[id] : one3.unknown;
      }
      if (fn) {
        return fn.call(this, value, ...parameters);
      }
    }
    one3.handlers = settings.handlers || {};
    one3.invalid = settings.invalid;
    one3.unknown = settings.unknown;
    return one3;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
  function blockquote(node2, _, state, info) {
    const exit3 = state.enter("blockquote");
    const tracker = state.createTracker(info);
    tracker.move("> ");
    tracker.shift(2);
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map
    );
    exit3();
    return value;
  }
  function map(line, _, blank) {
    return ">" + (blank ? "" : " ") + line;
  }

  // node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
  function patternInScope(stack, pattern) {
    return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
  }
  function listInScope(stack, list4, none) {
    if (typeof list4 === "string") {
      list4 = [list4];
    }
    if (!list4 || list4.length === 0) {
      return none;
    }
    let index2 = -1;
    while (++index2 < list4.length) {
      if (stack.includes(list4[index2])) {
        return true;
      }
    }
    return false;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/break.js
  function hardBreak(_, _1, state, info) {
    let index2 = -1;
    while (++index2 < state.unsafe.length) {
      if (state.unsafe[index2].character === "\n" && patternInScope(state.stack, state.unsafe[index2])) {
        return /[ \t]/.test(info.before) ? "" : " ";
      }
    }
    return "\\\n";
  }

  // node_modules/longest-streak/index.js
  function longestStreak(value, substring) {
    const source = String(value);
    let index2 = source.indexOf(substring);
    let expected = index2;
    let count = 0;
    let max = 0;
    if (typeof substring !== "string") {
      throw new TypeError("Expected substring");
    }
    while (index2 !== -1) {
      if (index2 === expected) {
        if (++count > max) {
          max = count;
        }
      } else {
        count = 1;
      }
      expected = index2 + substring.length;
      index2 = source.indexOf(substring, expected);
    }
    return max;
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
  function formatCodeAsIndented(node2, state) {
    return Boolean(
      state.options.fences === false && node2.value && // If there’s no info…
      !node2.lang && // And there’s a non-whitespace character…
      /[^ \r\n]/.test(node2.value) && // And the value doesn’t start or end in a blank…
      !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node2.value)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-fence.js
  function checkFence(state) {
    const marker = state.options.fence || "`";
    if (marker !== "`" && marker !== "~") {
      throw new Error(
        "Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/code.js
  function code(node2, _, state, info) {
    const marker = checkFence(state);
    const raw2 = node2.value || "";
    const suffix = marker === "`" ? "GraveAccent" : "Tilde";
    if (formatCodeAsIndented(node2, state)) {
      const exit4 = state.enter("codeIndented");
      const value2 = state.indentLines(raw2, map2);
      exit4();
      return value2;
    }
    const tracker = state.createTracker(info);
    const sequence = marker.repeat(Math.max(longestStreak(raw2, marker) + 1, 3));
    const exit3 = state.enter("codeFenced");
    let value = tracker.move(sequence);
    if (node2.lang) {
      const subexit = state.enter(`codeFencedLang${suffix}`);
      value += tracker.move(
        state.safe(node2.lang, {
          before: value,
          after: " ",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    if (node2.lang && node2.meta) {
      const subexit = state.enter(`codeFencedMeta${suffix}`);
      value += tracker.move(" ");
      value += tracker.move(
        state.safe(node2.meta, {
          before: value,
          after: "\n",
          encode: ["`"],
          ...tracker.current()
        })
      );
      subexit();
    }
    value += tracker.move("\n");
    if (raw2) {
      value += tracker.move(raw2 + "\n");
    }
    value += tracker.move(sequence);
    exit3();
    return value;
  }
  function map2(line, _, blank) {
    return (blank ? "" : "    ") + line;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-quote.js
  function checkQuote(state) {
    const marker = state.options.quote || '"';
    if (marker !== '"' && marker !== "'") {
      throw new Error(
        "Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/definition.js
  function definition2(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit3 = state.enter("definition");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("[");
    value += tracker.move(
      state.safe(state.associationId(node2), {
        before: value,
        after: "]",
        ...tracker.current()
      })
    );
    value += tracker.move("]: ");
    subexit();
    if (
      // If there’s no url, or…
      !node2.url || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : "\n",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
  function checkEmphasis(state) {
    const marker = state.options.emphasis || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
  function encodeCharacterReference(code4) {
    return "&#x" + code4.toString(16).toUpperCase() + ";";
  }

  // node_modules/mdast-util-to-markdown/lib/util/encode-info.js
  function encodeInfo(outside, inside, marker) {
    const outsideKind = classifyCharacter(outside);
    const insideKind = classifyCharacter(inside);
    if (outsideKind === void 0) {
      return insideKind === void 0 ? (
        // Letter inside:
        // we have to encode *both* letters for `_` as it is looser.
        // it already forms for `*` (and GFMs `~`).
        marker === "_" ? { inside: true, outside: true } : { inside: false, outside: false }
      ) : insideKind === 1 ? (
        // Whitespace inside: encode both (letter, whitespace).
        { inside: true, outside: true }
      ) : (
        // Punctuation inside: encode outer (letter)
        { inside: false, outside: true }
      );
    }
    if (outsideKind === 1) {
      return insideKind === void 0 ? (
        // Letter inside: already forms.
        { inside: false, outside: false }
      ) : insideKind === 1 ? (
        // Whitespace inside: encode both (whitespace).
        { inside: true, outside: true }
      ) : (
        // Punctuation inside: already forms.
        { inside: false, outside: false }
      );
    }
    return insideKind === void 0 ? (
      // Letter inside: already forms.
      { inside: false, outside: false }
    ) : insideKind === 1 ? (
      // Whitespace inside: encode inner (whitespace).
      { inside: true, outside: false }
    ) : (
      // Punctuation inside: already forms.
      { inside: false, outside: false }
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
  emphasis.peek = emphasisPeek;
  function emphasis(node2, _, state, info) {
    const marker = checkEmphasis(state);
    const exit3 = state.enter("emphasis");
    const tracker = state.createTracker(info);
    const before = tracker.move(marker);
    let between = tracker.move(
      state.containerPhrasing(node2, {
        after: marker,
        before,
        ...tracker.current()
      })
    );
    const betweenHead = between.charCodeAt(0);
    const open = encodeInfo(
      info.before.charCodeAt(info.before.length - 1),
      betweenHead,
      marker
    );
    if (open.inside) {
      between = encodeCharacterReference(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
      between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
    }
    const after = tracker.move(marker);
    exit3();
    state.attentionEncodeSurroundingInfo = {
      after: close.outside,
      before: open.outside
    };
    return before + between + after;
  }
  function emphasisPeek(_, _1, state) {
    return state.options.emphasis || "*";
  }

  // node_modules/unist-util-visit/lib/index.js
  function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
    let reverse;
    let test;
    let visitor;
    if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
      test = void 0;
      visitor = testOrVisitor;
      reverse = visitorOrReverse;
    } else {
      test = testOrVisitor;
      visitor = visitorOrReverse;
      reverse = maybeReverse;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node2, parents) {
      const parent = parents[parents.length - 1];
      const index2 = parent ? parent.children.indexOf(node2) : void 0;
      return visitor(node2, index2, parent);
    }
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
  function formatHeadingAsSetext(node2, state) {
    let literalWithBreak = false;
    visit(node2, function(node3) {
      if ("value" in node3 && /\r?\n|\r/.test(node3.value) || node3.type === "break") {
        literalWithBreak = true;
        return EXIT;
      }
    });
    return Boolean(
      (!node2.depth || node2.depth < 3) && toString(node2) && (state.options.setext || literalWithBreak)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/heading.js
  function heading(node2, _, state, info) {
    const rank = Math.max(Math.min(6, node2.depth || 1), 1);
    const tracker = state.createTracker(info);
    if (formatHeadingAsSetext(node2, state)) {
      const exit4 = state.enter("headingSetext");
      const subexit2 = state.enter("phrasing");
      const value2 = state.containerPhrasing(node2, {
        ...tracker.current(),
        before: "\n",
        after: "\n"
      });
      subexit2();
      exit4();
      return value2 + "\n" + (rank === 1 ? "=" : "-").repeat(
        // The whole size…
        value2.length - // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value2.lastIndexOf("\r"), value2.lastIndexOf("\n")) + 1)
      );
    }
    const sequence = "#".repeat(rank);
    const exit3 = state.enter("headingAtx");
    const subexit = state.enter("phrasing");
    tracker.move(sequence + " ");
    let value = state.containerPhrasing(node2, {
      before: "# ",
      after: "\n",
      ...tracker.current()
    });
    if (/^[\t ]/.test(value)) {
      value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
    }
    value = value ? sequence + " " + value : sequence;
    if (state.options.closeAtx) {
      value += " " + sequence;
    }
    subexit();
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/html.js
  html.peek = htmlPeek;
  function html(node2) {
    return node2.value || "";
  }
  function htmlPeek() {
    return "<";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/image.js
  image.peek = imagePeek;
  function image(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const exit3 = state.enter("image");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    value += tracker.move(
      state.safe(node2.alt, { before: value, after: "]", ...tracker.current() })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit3();
    return value;
  }
  function imagePeek() {
    return "!";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
  imageReference.peek = imageReferencePeek;
  function imageReference(node2, _, state, info) {
    const type = node2.referenceType;
    const exit3 = state.enter("imageReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("![");
    const alt = state.safe(node2.alt, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(alt + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit3();
    if (type === "full" || !alt || alt !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function imageReferencePeek() {
    return "!";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
  inlineCode.peek = inlineCodePeek;
  function inlineCode(node2, _, state) {
    let value = node2.value || "";
    let sequence = "`";
    let index2 = -1;
    while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) {
      sequence += "`";
    }
    if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) {
      value = " " + value + " ";
    }
    while (++index2 < state.unsafe.length) {
      const pattern = state.unsafe[index2];
      const expression = state.compilePattern(pattern);
      let match;
      if (!pattern.atBreak) continue;
      while (match = expression.exec(value)) {
        let position3 = match.index;
        if (value.charCodeAt(position3) === 10 && value.charCodeAt(position3 - 1) === 13) {
          position3--;
        }
        value = value.slice(0, position3) + " " + value.slice(match.index + 1);
      }
    }
    return sequence + value + sequence;
  }
  function inlineCodePeek() {
    return "`";
  }

  // node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
  function formatLinkAsAutolink(node2, state) {
    const raw2 = toString(node2);
    return Boolean(
      !state.options.resourceLink && // If there’s a url…
      node2.url && // And there’s a no title…
      !node2.title && // And the content of `node` is a single text node…
      node2.children && node2.children.length === 1 && node2.children[0].type === "text" && // And if the url is the same as the content…
      (raw2 === node2.url || "mailto:" + raw2 === node2.url) && // And that starts w/ a protocol…
      /^[a-z][a-z+.-]+:/i.test(node2.url) && // And that doesn’t contain ASCII control codes (character escapes and
      // references don’t work), space, or angle brackets…
      !/[\0- <>\u007F]/.test(node2.url)
    );
  }

  // node_modules/mdast-util-to-markdown/lib/handle/link.js
  link.peek = linkPeek;
  function link(node2, _, state, info) {
    const quote = checkQuote(state);
    const suffix = quote === '"' ? "Quote" : "Apostrophe";
    const tracker = state.createTracker(info);
    let exit3;
    let subexit;
    if (formatLinkAsAutolink(node2, state)) {
      const stack = state.stack;
      state.stack = [];
      exit3 = state.enter("autolink");
      let value2 = tracker.move("<");
      value2 += tracker.move(
        state.containerPhrasing(node2, {
          before: value2,
          after: ">",
          ...tracker.current()
        })
      );
      value2 += tracker.move(">");
      exit3();
      state.stack = stack;
      return value2;
    }
    exit3 = state.enter("link");
    subexit = state.enter("label");
    let value = tracker.move("[");
    value += tracker.move(
      state.containerPhrasing(node2, {
        before: value,
        after: "](",
        ...tracker.current()
      })
    );
    value += tracker.move("](");
    subexit();
    if (
      // If there’s no url but there is a title…
      !node2.url && node2.title || // If there are control characters or whitespace.
      /[\0- \u007F]/.test(node2.url)
    ) {
      subexit = state.enter("destinationLiteral");
      value += tracker.move("<");
      value += tracker.move(
        state.safe(node2.url, { before: value, after: ">", ...tracker.current() })
      );
      value += tracker.move(">");
    } else {
      subexit = state.enter("destinationRaw");
      value += tracker.move(
        state.safe(node2.url, {
          before: value,
          after: node2.title ? " " : ")",
          ...tracker.current()
        })
      );
    }
    subexit();
    if (node2.title) {
      subexit = state.enter(`title${suffix}`);
      value += tracker.move(" " + quote);
      value += tracker.move(
        state.safe(node2.title, {
          before: value,
          after: quote,
          ...tracker.current()
        })
      );
      value += tracker.move(quote);
      subexit();
    }
    value += tracker.move(")");
    exit3();
    return value;
  }
  function linkPeek(node2, _, state) {
    return formatLinkAsAutolink(node2, state) ? "<" : "[";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
  linkReference.peek = linkReferencePeek;
  function linkReference(node2, _, state, info) {
    const type = node2.referenceType;
    const exit3 = state.enter("linkReference");
    let subexit = state.enter("label");
    const tracker = state.createTracker(info);
    let value = tracker.move("[");
    const text7 = state.containerPhrasing(node2, {
      before: value,
      after: "]",
      ...tracker.current()
    });
    value += tracker.move(text7 + "][");
    subexit();
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter("reference");
    const reference = state.safe(state.associationId(node2), {
      before: value,
      after: "]",
      ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit3();
    if (type === "full" || !text7 || text7 !== reference) {
      value += tracker.move(reference + "]");
    } else if (type === "shortcut") {
      value = value.slice(0, -1);
    } else {
      value += tracker.move("]");
    }
    return value;
  }
  function linkReferencePeek() {
    return "[";
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
  function checkBullet(state) {
    const marker = state.options.bullet || "*";
    if (marker !== "*" && marker !== "+" && marker !== "-") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
  function checkBulletOther(state) {
    const bullet = checkBullet(state);
    const bulletOther = state.options.bulletOther;
    if (!bulletOther) {
      return bullet === "*" ? "-" : "*";
    }
    if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") {
      throw new Error(
        "Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
      );
    }
    if (bulletOther === bullet) {
      throw new Error(
        "Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different"
      );
    }
    return bulletOther;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
  function checkBulletOrdered(state) {
    const marker = state.options.bulletOrdered || ".";
    if (marker !== "." && marker !== ")") {
      throw new Error(
        "Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-rule.js
  function checkRule(state) {
    const marker = state.options.rule || "*";
    if (marker !== "*" && marker !== "-" && marker !== "_") {
      throw new Error(
        "Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/list.js
  function list2(node2, parent, state, info) {
    const exit3 = state.enter("list");
    const bulletCurrent = state.bulletCurrent;
    let bullet = node2.ordered ? checkBulletOrdered(state) : checkBullet(state);
    const bulletOther = node2.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
    let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
    if (!node2.ordered) {
      const firstListItem = node2.children ? node2.children[0] : void 0;
      if (
        // Bullet could be used as a thematic break marker:
        (bullet === "*" || bullet === "-") && // Empty first list item:
        firstListItem && (!firstListItem.children || !firstListItem.children[0]) && // Directly in two other list items:
        state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && // That are each the first child.
        state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0
      ) {
        useDifferentMarker = true;
      }
      if (checkRule(state) === bullet && firstListItem) {
        let index2 = -1;
        while (++index2 < node2.children.length) {
          const item = node2.children[index2];
          if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
            useDifferentMarker = true;
            break;
          }
        }
      }
    }
    if (useDifferentMarker) {
      bullet = bulletOther;
    }
    state.bulletCurrent = bullet;
    const value = state.containerFlow(node2, info);
    state.bulletLastUsed = bullet;
    state.bulletCurrent = bulletCurrent;
    exit3();
    return value;
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
  function checkListItemIndent(state) {
    const style = state.options.listItemIndent || "one";
    if (style !== "tab" && style !== "one" && style !== "mixed") {
      throw new Error(
        "Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
      );
    }
    return style;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/list-item.js
  function listItem(node2, parent, state, info) {
    const listItemIndent = checkListItemIndent(state);
    let bullet = state.bulletCurrent || checkBullet(state);
    if (parent && parent.type === "list" && parent.ordered) {
      bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node2)) + bullet;
    }
    let size = bullet.length + 1;
    if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node2.spread)) {
      size = Math.ceil(size / 4) * 4;
    }
    const tracker = state.createTracker(info);
    tracker.move(bullet + " ".repeat(size - bullet.length));
    tracker.shift(size);
    const exit3 = state.enter("listItem");
    const value = state.indentLines(
      state.containerFlow(node2, tracker.current()),
      map4
    );
    exit3();
    return value;
    function map4(line, index2, blank) {
      if (index2) {
        return (blank ? "" : " ".repeat(size)) + line;
      }
      return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
    }
  }

  // node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
  function paragraph(node2, _, state, info) {
    const exit3 = state.enter("paragraph");
    const subexit = state.enter("phrasing");
    const value = state.containerPhrasing(node2, info);
    subexit();
    exit3();
    return value;
  }

  // node_modules/mdast-util-phrasing/lib/index.js
  var phrasing = (
    /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
    convert([
      "break",
      "delete",
      "emphasis",
      // To do: next major: removed since footnotes were added to GFM.
      "footnote",
      "footnoteReference",
      "image",
      "imageReference",
      "inlineCode",
      // Enabled by `mdast-util-math`:
      "inlineMath",
      "link",
      "linkReference",
      // Enabled by `mdast-util-mdx`:
      "mdxJsxTextElement",
      // Enabled by `mdast-util-mdx`:
      "mdxTextExpression",
      "strong",
      "text",
      // Enabled by `mdast-util-directive`:
      "textDirective"
    ])
  );

  // node_modules/mdast-util-to-markdown/lib/handle/root.js
  function root(node2, _, state, info) {
    const hasPhrasing = node2.children.some(function(d) {
      return phrasing(d);
    });
    const container = hasPhrasing ? state.containerPhrasing : state.containerFlow;
    return container.call(state, node2, info);
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-strong.js
  function checkStrong(state) {
    const marker = state.options.strong || "*";
    if (marker !== "*" && marker !== "_") {
      throw new Error(
        "Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`"
      );
    }
    return marker;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/strong.js
  strong.peek = strongPeek;
  function strong(node2, _, state, info) {
    const marker = checkStrong(state);
    const exit3 = state.enter("strong");
    const tracker = state.createTracker(info);
    const before = tracker.move(marker + marker);
    let between = tracker.move(
      state.containerPhrasing(node2, {
        after: marker,
        before,
        ...tracker.current()
      })
    );
    const betweenHead = between.charCodeAt(0);
    const open = encodeInfo(
      info.before.charCodeAt(info.before.length - 1),
      betweenHead,
      marker
    );
    if (open.inside) {
      between = encodeCharacterReference(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
      between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
    }
    const after = tracker.move(marker + marker);
    exit3();
    state.attentionEncodeSurroundingInfo = {
      after: close.outside,
      before: open.outside
    };
    return before + between + after;
  }
  function strongPeek(_, _1, state) {
    return state.options.strong || "*";
  }

  // node_modules/mdast-util-to-markdown/lib/handle/text.js
  function text3(node2, _, state, info) {
    return state.safe(node2.value, info);
  }

  // node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
  function checkRuleRepetition(state) {
    const repetition = state.options.ruleRepetition || 3;
    if (repetition < 3) {
      throw new Error(
        "Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more"
      );
    }
    return repetition;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
  function thematicBreak2(_, _1, state) {
    const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
    return state.options.ruleSpaces ? value.slice(0, -1) : value;
  }

  // node_modules/mdast-util-to-markdown/lib/handle/index.js
  var handle = {
    blockquote,
    break: hardBreak,
    code,
    definition: definition2,
    emphasis,
    hardBreak,
    heading,
    html,
    image,
    imageReference,
    inlineCode,
    link,
    linkReference,
    list: list2,
    listItem,
    paragraph,
    root,
    strong,
    text: text3,
    thematicBreak: thematicBreak2
  };

  // node_modules/mdast-util-gfm-table/lib/index.js
  function gfmTableFromMarkdown() {
    return {
      enter: {
        table: enterTable,
        tableData: enterCell,
        tableHeader: enterCell,
        tableRow: enterRow
      },
      exit: {
        codeText: exitCodeText,
        table: exitTable,
        tableData: exit2,
        tableHeader: exit2,
        tableRow: exit2
      }
    };
  }
  function enterTable(token) {
    const align = token._align;
    ok(align, "expected `_align` on table");
    this.enter(
      {
        type: "table",
        align: align.map(function(d) {
          return d === "none" ? null : d;
        }),
        children: []
      },
      token
    );
    this.data.inTable = true;
  }
  function exitTable(token) {
    this.exit(token);
    this.data.inTable = void 0;
  }
  function enterRow(token) {
    this.enter({ type: "tableRow", children: [] }, token);
  }
  function exit2(token) {
    this.exit(token);
  }
  function enterCell(token) {
    this.enter({ type: "tableCell", children: [] }, token);
  }
  function exitCodeText(token) {
    let value = this.resume();
    if (this.data.inTable) {
      value = value.replace(/\\([\\|])/g, replace);
    }
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "inlineCode");
    node2.value = value;
    this.exit(token);
  }
  function replace($0, $1) {
    return $1 === "|" ? $1 : $0;
  }
  function gfmTableToMarkdown(options) {
    const settings = options || {};
    const padding = settings.tableCellPadding;
    const alignDelimiters = settings.tablePipeAlign;
    const stringLength = settings.stringLength;
    const around = padding ? " " : "|";
    return {
      unsafe: [
        { character: "\r", inConstruct: "tableCell" },
        { character: "\n", inConstruct: "tableCell" },
        // A pipe, when followed by a tab or space (padding), or a dash or colon
        // (unpadded delimiter row), could result in a table.
        { atBreak: true, character: "|", after: "[	 :-]" },
        // A pipe in a cell must be encoded.
        { character: "|", inConstruct: "tableCell" },
        // A colon must be followed by a dash, in which case it could start a
        // delimiter row.
        { atBreak: true, character: ":", after: "-" },
        // A delimiter row can also start with a dash, when followed by more
        // dashes, a colon, or a pipe.
        // This is a stricter version than the built in check for lists, thematic
        // breaks, and setex heading underlines though:
        // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
        { atBreak: true, character: "-", after: "[:|-]" }
      ],
      handlers: {
        inlineCode: inlineCodeWithTable,
        table: handleTable,
        tableCell: handleTableCell,
        tableRow: handleTableRow
      }
    };
    function handleTable(node2, _, state, info) {
      return serializeData(handleTableAsData(node2, state, info), node2.align);
    }
    function handleTableRow(node2, _, state, info) {
      const row = handleTableRowAsData(node2, state, info);
      const value = serializeData([row]);
      return value.slice(0, value.indexOf("\n"));
    }
    function handleTableCell(node2, _, state, info) {
      const exit3 = state.enter("tableCell");
      const subexit = state.enter("phrasing");
      const value = state.containerPhrasing(node2, {
        ...info,
        before: around,
        after: around
      });
      subexit();
      exit3();
      return value;
    }
    function serializeData(matrix, align) {
      return markdownTable(matrix, {
        align,
        // @ts-expect-error: `markdown-table` types should support `null`.
        alignDelimiters,
        // @ts-expect-error: `markdown-table` types should support `null`.
        padding,
        // @ts-expect-error: `markdown-table` types should support `null`.
        stringLength
      });
    }
    function handleTableAsData(node2, state, info) {
      const children = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = state.enter("table");
      while (++index2 < children.length) {
        result[index2] = handleTableRowAsData(children[index2], state, info);
      }
      subexit();
      return result;
    }
    function handleTableRowAsData(node2, state, info) {
      const children = node2.children;
      let index2 = -1;
      const result = [];
      const subexit = state.enter("tableRow");
      while (++index2 < children.length) {
        result[index2] = handleTableCell(children[index2], node2, state, info);
      }
      subexit();
      return result;
    }
    function inlineCodeWithTable(node2, parent, state) {
      let value = handle.inlineCode(node2, parent, state);
      if (state.stack.includes("tableCell")) {
        value = value.replace(/\|/g, "\\$&");
      }
      return value;
    }
  }

  // node_modules/mdast-util-gfm-task-list-item/lib/index.js
  function gfmTaskListItemFromMarkdown() {
    return {
      exit: {
        taskListCheckValueChecked: exitCheck,
        taskListCheckValueUnchecked: exitCheck,
        paragraph: exitParagraphWithTaskListItem
      }
    };
  }
  function gfmTaskListItemToMarkdown() {
    return {
      unsafe: [{ atBreak: true, character: "-", after: "[:|-]" }],
      handlers: { listItem: listItemWithTaskListItem }
    };
  }
  function exitCheck(token) {
    const node2 = this.stack[this.stack.length - 2];
    ok(node2.type === "listItem");
    node2.checked = token.type === "taskListCheckValueChecked";
  }
  function exitParagraphWithTaskListItem(token) {
    const parent = this.stack[this.stack.length - 2];
    if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
      const node2 = this.stack[this.stack.length - 1];
      ok(node2.type === "paragraph");
      const head2 = node2.children[0];
      if (head2 && head2.type === "text") {
        const siblings2 = parent.children;
        let index2 = -1;
        let firstParaghraph;
        while (++index2 < siblings2.length) {
          const sibling = siblings2[index2];
          if (sibling.type === "paragraph") {
            firstParaghraph = sibling;
            break;
          }
        }
        if (firstParaghraph === node2) {
          head2.value = head2.value.slice(1);
          if (head2.value.length === 0) {
            node2.children.shift();
          } else if (node2.position && head2.position && typeof head2.position.start.offset === "number") {
            head2.position.start.column++;
            head2.position.start.offset++;
            node2.position.start = Object.assign({}, head2.position.start);
          }
        }
      }
    }
    this.exit(token);
  }
  function listItemWithTaskListItem(node2, parent, state, info) {
    const head2 = node2.children[0];
    const checkable = typeof node2.checked === "boolean" && head2 && head2.type === "paragraph";
    const checkbox = "[" + (node2.checked ? "x" : " ") + "] ";
    const tracker = state.createTracker(info);
    if (checkable) {
      tracker.move(checkbox);
    }
    let value = handle.listItem(node2, parent, state, {
      ...info,
      ...tracker.current()
    });
    if (checkable) {
      value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
    }
    return value;
    function check($0) {
      return $0 + checkbox;
    }
  }

  // node_modules/mdast-util-gfm/lib/index.js
  function gfmFromMarkdown() {
    return [
      gfmAutolinkLiteralFromMarkdown(),
      gfmFootnoteFromMarkdown(),
      gfmStrikethroughFromMarkdown(),
      gfmTableFromMarkdown(),
      gfmTaskListItemFromMarkdown()
    ];
  }
  function gfmToMarkdown(options) {
    return {
      extensions: [
        gfmAutolinkLiteralToMarkdown(),
        gfmFootnoteToMarkdown(options),
        gfmStrikethroughToMarkdown(),
        gfmTableToMarkdown(options),
        gfmTaskListItemToMarkdown()
      ]
    };
  }

  // node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
  var wwwPrefix = {
    tokenize: tokenizeWwwPrefix,
    partial: true
  };
  var domain = {
    tokenize: tokenizeDomain,
    partial: true
  };
  var path = {
    tokenize: tokenizePath,
    partial: true
  };
  var trail = {
    tokenize: tokenizeTrail,
    partial: true
  };
  var emailDomainDotTrail = {
    tokenize: tokenizeEmailDomainDotTrail,
    partial: true
  };
  var wwwAutolink = {
    name: "wwwAutolink",
    tokenize: tokenizeWwwAutolink,
    previous: previousWww
  };
  var protocolAutolink = {
    name: "protocolAutolink",
    tokenize: tokenizeProtocolAutolink,
    previous: previousProtocol
  };
  var emailAutolink = {
    name: "emailAutolink",
    tokenize: tokenizeEmailAutolink,
    previous: previousEmail
  };
  var text4 = {};
  function gfmAutolinkLiteral() {
    return {
      text: text4
    };
  }
  var code2 = 48;
  while (code2 < 123) {
    text4[code2] = emailAutolink;
    code2++;
    if (code2 === 58) code2 = 65;
    else if (code2 === 91) code2 = 97;
  }
  text4[43] = emailAutolink;
  text4[45] = emailAutolink;
  text4[46] = emailAutolink;
  text4[95] = emailAutolink;
  text4[72] = [emailAutolink, protocolAutolink];
  text4[104] = [emailAutolink, protocolAutolink];
  text4[87] = [emailAutolink, wwwAutolink];
  text4[119] = [emailAutolink, wwwAutolink];
  function tokenizeEmailAutolink(effects, ok3, nok) {
    const self2 = this;
    let dot;
    let data;
    return start;
    function start(code4) {
      if (!gfmAtext(code4) || !previousEmail.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code4);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkEmail");
      return atext(code4);
    }
    function atext(code4) {
      if (gfmAtext(code4)) {
        effects.consume(code4);
        return atext;
      }
      if (code4 === 64) {
        effects.consume(code4);
        return emailDomain;
      }
      return nok(code4);
    }
    function emailDomain(code4) {
      if (code4 === 46) {
        return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code4);
      }
      if (code4 === 45 || code4 === 95 || asciiAlphanumeric(code4)) {
        data = true;
        effects.consume(code4);
        return emailDomain;
      }
      return emailDomainAfter(code4);
    }
    function emailDomainDot(code4) {
      effects.consume(code4);
      dot = true;
      return emailDomain;
    }
    function emailDomainAfter(code4) {
      if (data && dot && asciiAlpha(self2.previous)) {
        effects.exit("literalAutolinkEmail");
        effects.exit("literalAutolink");
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function tokenizeWwwAutolink(effects, ok3, nok) {
    const self2 = this;
    return wwwStart;
    function wwwStart(code4) {
      if (code4 !== 87 && code4 !== 119 || !previousWww.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
        return nok(code4);
      }
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkWww");
      return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code4);
    }
    function wwwAfter(code4) {
      effects.exit("literalAutolinkWww");
      effects.exit("literalAutolink");
      return ok3(code4);
    }
  }
  function tokenizeProtocolAutolink(effects, ok3, nok) {
    const self2 = this;
    let buffer = "";
    let seen = false;
    return protocolStart;
    function protocolStart(code4) {
      if ((code4 === 72 || code4 === 104) && previousProtocol.call(self2, self2.previous) && !previousUnbalanced(self2.events)) {
        effects.enter("literalAutolink");
        effects.enter("literalAutolinkHttp");
        buffer += String.fromCodePoint(code4);
        effects.consume(code4);
        return protocolPrefixInside;
      }
      return nok(code4);
    }
    function protocolPrefixInside(code4) {
      if (asciiAlpha(code4) && buffer.length < 5) {
        buffer += String.fromCodePoint(code4);
        effects.consume(code4);
        return protocolPrefixInside;
      }
      if (code4 === 58) {
        const protocol = buffer.toLowerCase();
        if (protocol === "http" || protocol === "https") {
          effects.consume(code4);
          return protocolSlashesInside;
        }
      }
      return nok(code4);
    }
    function protocolSlashesInside(code4) {
      if (code4 === 47) {
        effects.consume(code4);
        if (seen) {
          return afterProtocol;
        }
        seen = true;
        return protocolSlashesInside;
      }
      return nok(code4);
    }
    function afterProtocol(code4) {
      return code4 === null || asciiControl(code4) || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4) || unicodePunctuation(code4) ? nok(code4) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code4);
    }
    function protocolAfter(code4) {
      effects.exit("literalAutolinkHttp");
      effects.exit("literalAutolink");
      return ok3(code4);
    }
  }
  function tokenizeWwwPrefix(effects, ok3, nok) {
    let size = 0;
    return wwwPrefixInside;
    function wwwPrefixInside(code4) {
      if ((code4 === 87 || code4 === 119) && size < 3) {
        size++;
        effects.consume(code4);
        return wwwPrefixInside;
      }
      if (code4 === 46 && size === 3) {
        effects.consume(code4);
        return wwwPrefixAfter;
      }
      return nok(code4);
    }
    function wwwPrefixAfter(code4) {
      return code4 === null ? nok(code4) : ok3(code4);
    }
  }
  function tokenizeDomain(effects, ok3, nok) {
    let underscoreInLastSegment;
    let underscoreInLastLastSegment;
    let seen;
    return domainInside;
    function domainInside(code4) {
      if (code4 === 46 || code4 === 95) {
        return effects.check(trail, domainAfter, domainAtPunctuation)(code4);
      }
      if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4) || code4 !== 45 && unicodePunctuation(code4)) {
        return domainAfter(code4);
      }
      seen = true;
      effects.consume(code4);
      return domainInside;
    }
    function domainAtPunctuation(code4) {
      if (code4 === 95) {
        underscoreInLastSegment = true;
      } else {
        underscoreInLastLastSegment = underscoreInLastSegment;
        underscoreInLastSegment = void 0;
      }
      effects.consume(code4);
      return domainInside;
    }
    function domainAfter(code4) {
      if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
        return nok(code4);
      }
      return ok3(code4);
    }
  }
  function tokenizePath(effects, ok3) {
    let sizeOpen = 0;
    let sizeClose = 0;
    return pathInside;
    function pathInside(code4) {
      if (code4 === 40) {
        sizeOpen++;
        effects.consume(code4);
        return pathInside;
      }
      if (code4 === 41 && sizeClose < sizeOpen) {
        return pathAtPunctuation(code4);
      }
      if (code4 === 33 || code4 === 34 || code4 === 38 || code4 === 39 || code4 === 41 || code4 === 42 || code4 === 44 || code4 === 46 || code4 === 58 || code4 === 59 || code4 === 60 || code4 === 63 || code4 === 93 || code4 === 95 || code4 === 126) {
        return effects.check(trail, ok3, pathAtPunctuation)(code4);
      }
      if (code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
        return ok3(code4);
      }
      effects.consume(code4);
      return pathInside;
    }
    function pathAtPunctuation(code4) {
      if (code4 === 41) {
        sizeClose++;
      }
      effects.consume(code4);
      return pathInside;
    }
  }
  function tokenizeTrail(effects, ok3, nok) {
    return trail2;
    function trail2(code4) {
      if (code4 === 33 || code4 === 34 || code4 === 39 || code4 === 41 || code4 === 42 || code4 === 44 || code4 === 46 || code4 === 58 || code4 === 59 || code4 === 63 || code4 === 95 || code4 === 126) {
        effects.consume(code4);
        return trail2;
      }
      if (code4 === 38) {
        effects.consume(code4);
        return trailCharacterReferenceStart;
      }
      if (code4 === 93) {
        effects.consume(code4);
        return trailBracketAfter;
      }
      if (
        // `<` is an end.
        code4 === 60 || // So is whitespace.
        code4 === null || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)
      ) {
        return ok3(code4);
      }
      return nok(code4);
    }
    function trailBracketAfter(code4) {
      if (code4 === null || code4 === 40 || code4 === 91 || markdownLineEndingOrSpace(code4) || unicodeWhitespace(code4)) {
        return ok3(code4);
      }
      return trail2(code4);
    }
    function trailCharacterReferenceStart(code4) {
      return asciiAlpha(code4) ? trailCharacterReferenceInside(code4) : nok(code4);
    }
    function trailCharacterReferenceInside(code4) {
      if (code4 === 59) {
        effects.consume(code4);
        return trail2;
      }
      if (asciiAlpha(code4)) {
        effects.consume(code4);
        return trailCharacterReferenceInside;
      }
      return nok(code4);
    }
  }
  function tokenizeEmailDomainDotTrail(effects, ok3, nok) {
    return start;
    function start(code4) {
      effects.consume(code4);
      return after;
    }
    function after(code4) {
      return asciiAlphanumeric(code4) ? nok(code4) : ok3(code4);
    }
  }
  function previousWww(code4) {
    return code4 === null || code4 === 40 || code4 === 42 || code4 === 95 || code4 === 91 || code4 === 93 || code4 === 126 || markdownLineEndingOrSpace(code4);
  }
  function previousProtocol(code4) {
    return !asciiAlpha(code4);
  }
  function previousEmail(code4) {
    return !(code4 === 47 || gfmAtext(code4));
  }
  function gfmAtext(code4) {
    return code4 === 43 || code4 === 45 || code4 === 46 || code4 === 95 || asciiAlphanumeric(code4);
  }
  function previousUnbalanced(events) {
    let index2 = events.length;
    let result = false;
    while (index2--) {
      const token = events[index2][1];
      if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
        result = true;
        break;
      }
      if (token._gfmAutolinkLiteralWalkedInto) {
        result = false;
        break;
      }
    }
    if (events.length > 0 && !result) {
      events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
    }
    return result;
  }

  // node_modules/micromark-extension-gfm-footnote/lib/syntax.js
  var indent = {
    tokenize: tokenizeIndent2,
    partial: true
  };
  function gfmFootnote() {
    return {
      document: {
        [91]: {
          name: "gfmFootnoteDefinition",
          tokenize: tokenizeDefinitionStart,
          continuation: {
            tokenize: tokenizeDefinitionContinuation
          },
          exit: gfmFootnoteDefinitionEnd
        }
      },
      text: {
        [91]: {
          name: "gfmFootnoteCall",
          tokenize: tokenizeGfmFootnoteCall
        },
        [93]: {
          name: "gfmPotentialFootnoteCall",
          add: "after",
          tokenize: tokenizePotentialGfmFootnoteCall,
          resolveTo: resolveToPotentialGfmFootnoteCall
        }
      }
    };
  }
  function tokenizePotentialGfmFootnoteCall(effects, ok3, nok) {
    const self2 = this;
    let index2 = self2.events.length;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let labelStart;
    while (index2--) {
      const token = self2.events[index2][1];
      if (token.type === "labelImage") {
        labelStart = token;
        break;
      }
      if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") {
        break;
      }
    }
    return start;
    function start(code4) {
      if (!labelStart || !labelStart._balanced) {
        return nok(code4);
      }
      const id = normalizeIdentifier(self2.sliceSerialize({
        start: labelStart.end,
        end: self2.now()
      }));
      if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
        return nok(code4);
      }
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallLabelMarker");
      return ok3(code4);
    }
  }
  function resolveToPotentialGfmFootnoteCall(events, context) {
    let index2 = events.length;
    let labelStart;
    while (index2--) {
      if (events[index2][1].type === "labelImage" && events[index2][0] === "enter") {
        labelStart = events[index2][1];
        break;
      }
    }
    events[index2 + 1][1].type = "data";
    events[index2 + 3][1].type = "gfmFootnoteCallLabelMarker";
    const call = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, events[index2 + 3][1].start),
      end: Object.assign({}, events[events.length - 1][1].end)
    };
    const marker = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, events[index2 + 3][1].end),
      end: Object.assign({}, events[index2 + 3][1].end)
    };
    marker.end.column++;
    marker.end.offset++;
    marker.end._bufferIndex++;
    const string4 = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, marker.end),
      end: Object.assign({}, events[events.length - 1][1].start)
    };
    const chunk = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, string4.start),
      end: Object.assign({}, string4.end)
    };
    const replacement = [
      // Take the `labelImageMarker` (now `data`, the `!`)
      events[index2 + 1],
      events[index2 + 2],
      ["enter", call, context],
      // The `[`
      events[index2 + 3],
      events[index2 + 4],
      // The `^`.
      ["enter", marker, context],
      ["exit", marker, context],
      // Everything in between.
      ["enter", string4, context],
      ["enter", chunk, context],
      ["exit", chunk, context],
      ["exit", string4, context],
      // The ending (`]`, properly parsed and labelled).
      events[events.length - 2],
      events[events.length - 1],
      ["exit", call, context]
    ];
    events.splice(index2, events.length - index2 + 1, ...replacement);
    return events;
  }
  function tokenizeGfmFootnoteCall(effects, ok3, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let size = 0;
    let data;
    return start;
    function start(code4) {
      effects.enter("gfmFootnoteCall");
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallLabelMarker");
      return callStart;
    }
    function callStart(code4) {
      if (code4 !== 94) return nok(code4);
      effects.enter("gfmFootnoteCallMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteCallMarker");
      effects.enter("gfmFootnoteCallString");
      effects.enter("chunkString").contentType = "string";
      return callData;
    }
    function callData(code4) {
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code4 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code4 === null || code4 === 91 || markdownLineEndingOrSpace(code4)
      ) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteCallString");
        if (!defined.includes(normalizeIdentifier(self2.sliceSerialize(token)))) {
          return nok(code4);
        }
        effects.enter("gfmFootnoteCallLabelMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteCallLabelMarker");
        effects.exit("gfmFootnoteCall");
        return ok3;
      }
      if (!markdownLineEndingOrSpace(code4)) {
        data = true;
      }
      size++;
      effects.consume(code4);
      return code4 === 92 ? callEscape : callData;
    }
    function callEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return callData;
      }
      return callData(code4);
    }
  }
  function tokenizeDefinitionStart(effects, ok3, nok) {
    const self2 = this;
    const defined = self2.parser.gfmFootnotes || (self2.parser.gfmFootnotes = []);
    let identifier;
    let size = 0;
    let data;
    return start;
    function start(code4) {
      effects.enter("gfmFootnoteDefinition")._container = true;
      effects.enter("gfmFootnoteDefinitionLabel");
      effects.enter("gfmFootnoteDefinitionLabelMarker");
      effects.consume(code4);
      effects.exit("gfmFootnoteDefinitionLabelMarker");
      return labelAtMarker;
    }
    function labelAtMarker(code4) {
      if (code4 === 94) {
        effects.enter("gfmFootnoteDefinitionMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteDefinitionMarker");
        effects.enter("gfmFootnoteDefinitionLabelString");
        effects.enter("chunkString").contentType = "string";
        return labelInside;
      }
      return nok(code4);
    }
    function labelInside(code4) {
      if (
        // Too long.
        size > 999 || // Closing brace with nothing.
        code4 === 93 && !data || // Space or tab is not supported by GFM for some reason.
        // `\n` and `[` not being supported makes sense.
        code4 === null || code4 === 91 || markdownLineEndingOrSpace(code4)
      ) {
        return nok(code4);
      }
      if (code4 === 93) {
        effects.exit("chunkString");
        const token = effects.exit("gfmFootnoteDefinitionLabelString");
        identifier = normalizeIdentifier(self2.sliceSerialize(token));
        effects.enter("gfmFootnoteDefinitionLabelMarker");
        effects.consume(code4);
        effects.exit("gfmFootnoteDefinitionLabelMarker");
        effects.exit("gfmFootnoteDefinitionLabel");
        return labelAfter;
      }
      if (!markdownLineEndingOrSpace(code4)) {
        data = true;
      }
      size++;
      effects.consume(code4);
      return code4 === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code4) {
      if (code4 === 91 || code4 === 92 || code4 === 93) {
        effects.consume(code4);
        size++;
        return labelInside;
      }
      return labelInside(code4);
    }
    function labelAfter(code4) {
      if (code4 === 58) {
        effects.enter("definitionMarker");
        effects.consume(code4);
        effects.exit("definitionMarker");
        if (!defined.includes(identifier)) {
          defined.push(identifier);
        }
        return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
      }
      return nok(code4);
    }
    function whitespaceAfter(code4) {
      return ok3(code4);
    }
  }
  function tokenizeDefinitionContinuation(effects, ok3, nok) {
    return effects.check(blankLine, ok3, effects.attempt(indent, ok3, nok));
  }
  function gfmFootnoteDefinitionEnd(effects) {
    effects.exit("gfmFootnoteDefinition");
  }
  function tokenizeIndent2(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 4 + 1);
    function afterPrefix(code4) {
      const tail = self2.events[self2.events.length - 1];
      return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok3(code4) : nok(code4);
    }
  }

  // node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
  function gfmStrikethrough(options) {
    const options_ = options || {};
    let single = options_.singleTilde;
    const tokenizer = {
      name: "strikethrough",
      tokenize: tokenizeStrikethrough,
      resolveAll: resolveAllStrikethrough
    };
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      text: {
        [126]: tokenizer
      },
      insideSpan: {
        null: [tokenizer]
      },
      attentionMarkers: {
        null: [126]
      }
    };
    function resolveAllStrikethrough(events, context) {
      let index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][0] === "enter" && events[index2][1].type === "strikethroughSequenceTemporary" && events[index2][1]._close) {
          let open = index2;
          while (open--) {
            if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && // If the sizes are the same:
            events[index2][1].end.offset - events[index2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
              events[index2][1].type = "strikethroughSequence";
              events[open][1].type = "strikethroughSequence";
              const strikethrough2 = {
                type: "strikethrough",
                start: Object.assign({}, events[open][1].start),
                end: Object.assign({}, events[index2][1].end)
              };
              const text7 = {
                type: "strikethroughText",
                start: Object.assign({}, events[open][1].end),
                end: Object.assign({}, events[index2][1].start)
              };
              const nextEvents = [["enter", strikethrough2, context], ["enter", events[open][1], context], ["exit", events[open][1], context], ["enter", text7, context]];
              const insideSpan2 = context.parser.constructs.insideSpan.null;
              if (insideSpan2) {
                splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan2, events.slice(open + 1, index2), context));
              }
              splice(nextEvents, nextEvents.length, 0, [["exit", text7, context], ["enter", events[index2][1], context], ["exit", events[index2][1], context], ["exit", strikethrough2, context]]);
              splice(events, open - 1, index2 - open + 3, nextEvents);
              index2 = open + nextEvents.length - 2;
              break;
            }
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "strikethroughSequenceTemporary") {
          events[index2][1].type = "data";
        }
      }
      return events;
    }
    function tokenizeStrikethrough(effects, ok3, nok) {
      const previous4 = this.previous;
      const events = this.events;
      let size = 0;
      return start;
      function start(code4) {
        if (previous4 === 126 && events[events.length - 1][1].type !== "characterEscape") {
          return nok(code4);
        }
        effects.enter("strikethroughSequenceTemporary");
        return more(code4);
      }
      function more(code4) {
        const before = classifyCharacter(previous4);
        if (code4 === 126) {
          if (size > 1) return nok(code4);
          effects.consume(code4);
          size++;
          return more;
        }
        if (size < 2 && !single) return nok(code4);
        const token = effects.exit("strikethroughSequenceTemporary");
        const after = classifyCharacter(code4);
        token._open = !after || after === 2 && Boolean(before);
        token._close = !before || before === 2 && Boolean(after);
        return ok3(code4);
      }
    }
  }

  // node_modules/micromark-extension-gfm-table/lib/edit-map.js
  var EditMap = class {
    /**
     * Create a new edit map.
     */
    constructor() {
      this.map = [];
    }
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     * @param {number} remove
     * @param {Array<Event>} add
     * @returns {undefined}
     */
    add(index2, remove, add) {
      addImplementation(this, index2, remove, add);
    }
    // To do: add this when moving to `micromark`.
    // /**
    //  * Create an edit: but insert `add` before existing additions.
    //  *
    //  * @param {number} index
    //  * @param {number} remove
    //  * @param {Array<Event>} add
    //  * @returns {undefined}
    //  */
    // addBefore(index, remove, add) {
    //   addImplementation(this, index, remove, add, true)
    // }
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     * @returns {undefined}
     */
    consume(events) {
      this.map.sort(function(a, b) {
        return a[0] - b[0];
      });
      if (this.map.length === 0) {
        return;
      }
      let index2 = this.map.length;
      const vecs = [];
      while (index2 > 0) {
        index2 -= 1;
        vecs.push(events.slice(this.map[index2][0] + this.map[index2][1]), this.map[index2][2]);
        events.length = this.map[index2][0];
      }
      vecs.push(events.slice());
      events.length = 0;
      let slice = vecs.pop();
      while (slice) {
        for (const element3 of slice) {
          events.push(element3);
        }
        slice = vecs.pop();
      }
      this.map.length = 0;
    }
  };
  function addImplementation(editMap, at, remove, add) {
    let index2 = 0;
    if (remove === 0 && add.length === 0) {
      return;
    }
    while (index2 < editMap.map.length) {
      if (editMap.map[index2][0] === at) {
        editMap.map[index2][1] += remove;
        editMap.map[index2][2].push(...add);
        return;
      }
      index2 += 1;
    }
    editMap.map.push([at, remove, add]);
  }

  // node_modules/micromark-extension-gfm-table/lib/infer.js
  function gfmTableAlign(events, index2) {
    let inDelimiterRow = false;
    const align = [];
    while (index2 < events.length) {
      const event = events[index2];
      if (inDelimiterRow) {
        if (event[0] === "enter") {
          if (event[1].type === "tableContent") {
            align.push(events[index2 + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
          }
        } else if (event[1].type === "tableContent") {
          if (events[index2 - 1][1].type === "tableDelimiterMarker") {
            const alignIndex = align.length - 1;
            align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
          }
        } else if (event[1].type === "tableDelimiterRow") {
          break;
        }
      } else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") {
        inDelimiterRow = true;
      }
      index2 += 1;
    }
    return align;
  }

  // node_modules/micromark-extension-gfm-table/lib/syntax.js
  function gfmTable() {
    return {
      flow: {
        null: {
          name: "table",
          tokenize: tokenizeTable,
          resolveAll: resolveTable
        }
      }
    };
  }
  function tokenizeTable(effects, ok3, nok) {
    const self2 = this;
    let size = 0;
    let sizeB = 0;
    let seen;
    return start;
    function start(code4) {
      let index2 = self2.events.length - 1;
      while (index2 > -1) {
        const type = self2.events[index2][1].type;
        if (type === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
        type === "linePrefix") index2--;
        else break;
      }
      const tail = index2 > -1 ? self2.events[index2][1].type : null;
      const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
      if (next === bodyRowStart && self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      return next(code4);
    }
    function headRowBefore(code4) {
      effects.enter("tableHead");
      effects.enter("tableRow");
      return headRowStart(code4);
    }
    function headRowStart(code4) {
      if (code4 === 124) {
        return headRowBreak(code4);
      }
      seen = true;
      sizeB += 1;
      return headRowBreak(code4);
    }
    function headRowBreak(code4) {
      if (code4 === null) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        if (sizeB > 1) {
          sizeB = 0;
          self2.interrupt = true;
          effects.exit("tableRow");
          effects.enter("lineEnding");
          effects.consume(code4);
          effects.exit("lineEnding");
          return headDelimiterStart;
        }
        return nok(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, headRowBreak, "whitespace")(code4);
      }
      sizeB += 1;
      if (seen) {
        seen = false;
        size += 1;
      }
      if (code4 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        seen = true;
        return headRowBreak;
      }
      effects.enter("data");
      return headRowData(code4);
    }
    function headRowData(code4) {
      if (code4 === null || code4 === 124 || markdownLineEndingOrSpace(code4)) {
        effects.exit("data");
        return headRowBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? headRowEscape : headRowData;
    }
    function headRowEscape(code4) {
      if (code4 === 92 || code4 === 124) {
        effects.consume(code4);
        return headRowData;
      }
      return headRowData(code4);
    }
    function headDelimiterStart(code4) {
      self2.interrupt = false;
      if (self2.parser.lazy[self2.now().line]) {
        return nok(code4);
      }
      effects.enter("tableDelimiterRow");
      seen = false;
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterBefore, "linePrefix", self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code4);
      }
      return headDelimiterBefore(code4);
    }
    function headDelimiterBefore(code4) {
      if (code4 === 45 || code4 === 58) {
        return headDelimiterValueBefore(code4);
      }
      if (code4 === 124) {
        seen = true;
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        return headDelimiterCellBefore;
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterCellBefore(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code4);
      }
      return headDelimiterValueBefore(code4);
    }
    function headDelimiterValueBefore(code4) {
      if (code4 === 58) {
        sizeB += 1;
        seen = true;
        effects.enter("tableDelimiterMarker");
        effects.consume(code4);
        effects.exit("tableDelimiterMarker");
        return headDelimiterLeftAlignmentAfter;
      }
      if (code4 === 45) {
        sizeB += 1;
        return headDelimiterLeftAlignmentAfter(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        return headDelimiterCellAfter(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterLeftAlignmentAfter(code4) {
      if (code4 === 45) {
        effects.enter("tableDelimiterFiller");
        return headDelimiterFiller(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterFiller(code4) {
      if (code4 === 45) {
        effects.consume(code4);
        return headDelimiterFiller;
      }
      if (code4 === 58) {
        seen = true;
        effects.exit("tableDelimiterFiller");
        effects.enter("tableDelimiterMarker");
        effects.consume(code4);
        effects.exit("tableDelimiterMarker");
        return headDelimiterRightAlignmentAfter;
      }
      effects.exit("tableDelimiterFiller");
      return headDelimiterRightAlignmentAfter(code4);
    }
    function headDelimiterRightAlignmentAfter(code4) {
      if (markdownSpace(code4)) {
        return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code4);
      }
      return headDelimiterCellAfter(code4);
    }
    function headDelimiterCellAfter(code4) {
      if (code4 === 124) {
        return headDelimiterBefore(code4);
      }
      if (code4 === null || markdownLineEnding(code4)) {
        if (!seen || size !== sizeB) {
          return headDelimiterNok(code4);
        }
        effects.exit("tableDelimiterRow");
        effects.exit("tableHead");
        return ok3(code4);
      }
      return headDelimiterNok(code4);
    }
    function headDelimiterNok(code4) {
      return nok(code4);
    }
    function bodyRowStart(code4) {
      effects.enter("tableRow");
      return bodyRowBreak(code4);
    }
    function bodyRowBreak(code4) {
      if (code4 === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code4);
        effects.exit("tableCellDivider");
        return bodyRowBreak;
      }
      if (code4 === null || markdownLineEnding(code4)) {
        effects.exit("tableRow");
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return factorySpace(effects, bodyRowBreak, "whitespace")(code4);
      }
      effects.enter("data");
      return bodyRowData(code4);
    }
    function bodyRowData(code4) {
      if (code4 === null || code4 === 124 || markdownLineEndingOrSpace(code4)) {
        effects.exit("data");
        return bodyRowBreak(code4);
      }
      effects.consume(code4);
      return code4 === 92 ? bodyRowEscape : bodyRowData;
    }
    function bodyRowEscape(code4) {
      if (code4 === 92 || code4 === 124) {
        effects.consume(code4);
        return bodyRowData;
      }
      return bodyRowData(code4);
    }
  }
  function resolveTable(events, context) {
    let index2 = -1;
    let inFirstCellAwaitingPipe = true;
    let rowKind = 0;
    let lastCell = [0, 0, 0, 0];
    let cell = [0, 0, 0, 0];
    let afterHeadAwaitingFirstBodyRow = false;
    let lastTableEnd = 0;
    let currentTable;
    let currentBody;
    let currentCell;
    const map4 = new EditMap();
    while (++index2 < events.length) {
      const event = events[index2];
      const token = event[1];
      if (event[0] === "enter") {
        if (token.type === "tableHead") {
          afterHeadAwaitingFirstBodyRow = false;
          if (lastTableEnd !== 0) {
            flushTableEnd(map4, context, lastTableEnd, currentTable, currentBody);
            currentBody = void 0;
            lastTableEnd = 0;
          }
          currentTable = {
            type: "table",
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map4.add(index2, 0, [["enter", currentTable, context]]);
        } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
          inFirstCellAwaitingPipe = true;
          currentCell = void 0;
          lastCell = [0, 0, 0, 0];
          cell = [0, index2 + 1, 0, 0];
          if (afterHeadAwaitingFirstBodyRow) {
            afterHeadAwaitingFirstBodyRow = false;
            currentBody = {
              type: "tableBody",
              start: Object.assign({}, token.start),
              // Note: correct end is set later.
              end: Object.assign({}, token.end)
            };
            map4.add(index2, 0, [["enter", currentBody, context]]);
          }
          rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
        } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
          inFirstCellAwaitingPipe = false;
          if (cell[2] === 0) {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(map4, context, lastCell, rowKind, void 0, currentCell);
              lastCell = [0, 0, 0, 0];
            }
            cell[2] = index2;
          }
        } else if (token.type === "tableCellDivider") {
          if (inFirstCellAwaitingPipe) {
            inFirstCellAwaitingPipe = false;
          } else {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(map4, context, lastCell, rowKind, void 0, currentCell);
            }
            lastCell = cell;
            cell = [lastCell[1], index2, 0, 0];
          }
        }
      } else if (token.type === "tableHead") {
        afterHeadAwaitingFirstBodyRow = true;
        lastTableEnd = index2;
      } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
        lastTableEnd = index2;
        if (lastCell[1] !== 0) {
          cell[0] = cell[1];
          currentCell = flushCell(map4, context, lastCell, rowKind, index2, currentCell);
        } else if (cell[1] !== 0) {
          currentCell = flushCell(map4, context, cell, rowKind, index2, currentCell);
        }
        rowKind = 0;
      } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
        cell[3] = index2;
      }
    }
    if (lastTableEnd !== 0) {
      flushTableEnd(map4, context, lastTableEnd, currentTable, currentBody);
    }
    map4.consume(context.events);
    index2 = -1;
    while (++index2 < context.events.length) {
      const event = context.events[index2];
      if (event[0] === "enter" && event[1].type === "table") {
        event[1]._align = gfmTableAlign(context.events, index2);
      }
    }
    return events;
  }
  function flushCell(map4, context, range, rowKind, rowEnd, previousCell) {
    const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
    const valueName = "tableContent";
    if (range[0] !== 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
      map4.add(range[0], 0, [["exit", previousCell, context]]);
    }
    const now = getPoint(context.events, range[1]);
    previousCell = {
      type: groupName,
      start: Object.assign({}, now),
      // Note: correct end is set later.
      end: Object.assign({}, now)
    };
    map4.add(range[1], 0, [["enter", previousCell, context]]);
    if (range[2] !== 0) {
      const relatedStart = getPoint(context.events, range[2]);
      const relatedEnd = getPoint(context.events, range[3]);
      const valueToken = {
        type: valueName,
        start: Object.assign({}, relatedStart),
        end: Object.assign({}, relatedEnd)
      };
      map4.add(range[2], 0, [["enter", valueToken, context]]);
      if (rowKind !== 2) {
        const start = context.events[range[2]];
        const end = context.events[range[3]];
        start[1].end = Object.assign({}, end[1].end);
        start[1].type = "chunkText";
        start[1].contentType = "text";
        if (range[3] > range[2] + 1) {
          const a = range[2] + 1;
          const b = range[3] - range[2] - 1;
          map4.add(a, b, []);
        }
      }
      map4.add(range[3] + 1, 0, [["exit", valueToken, context]]);
    }
    if (rowEnd !== void 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
      map4.add(rowEnd, 0, [["exit", previousCell, context]]);
      previousCell = void 0;
    }
    return previousCell;
  }
  function flushTableEnd(map4, context, index2, table2, tableBody) {
    const exits = [];
    const related = getPoint(context.events, index2);
    if (tableBody) {
      tableBody.end = Object.assign({}, related);
      exits.push(["exit", tableBody, context]);
    }
    table2.end = Object.assign({}, related);
    exits.push(["exit", table2, context]);
    map4.add(index2 + 1, 0, exits);
  }
  function getPoint(events, index2) {
    const event = events[index2];
    const side = event[0] === "enter" ? "start" : "end";
    return event[1][side];
  }

  // node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
  var tasklistCheck = {
    name: "tasklistCheck",
    tokenize: tokenizeTasklistCheck
  };
  function gfmTaskListItem() {
    return {
      text: {
        [91]: tasklistCheck
      }
    };
  }
  function tokenizeTasklistCheck(effects, ok3, nok) {
    const self2 = this;
    return open;
    function open(code4) {
      if (
        // Exit if there’s stuff before.
        self2.previous !== null || // Exit if not in the first content that is the first child of a list
        // item.
        !self2._gfmTasklistFirstContentOfListItem
      ) {
        return nok(code4);
      }
      effects.enter("taskListCheck");
      effects.enter("taskListCheckMarker");
      effects.consume(code4);
      effects.exit("taskListCheckMarker");
      return inside;
    }
    function inside(code4) {
      if (markdownLineEndingOrSpace(code4)) {
        effects.enter("taskListCheckValueUnchecked");
        effects.consume(code4);
        effects.exit("taskListCheckValueUnchecked");
        return close;
      }
      if (code4 === 88 || code4 === 120) {
        effects.enter("taskListCheckValueChecked");
        effects.consume(code4);
        effects.exit("taskListCheckValueChecked");
        return close;
      }
      return nok(code4);
    }
    function close(code4) {
      if (code4 === 93) {
        effects.enter("taskListCheckMarker");
        effects.consume(code4);
        effects.exit("taskListCheckMarker");
        effects.exit("taskListCheck");
        return after;
      }
      return nok(code4);
    }
    function after(code4) {
      if (markdownLineEnding(code4)) {
        return ok3(code4);
      }
      if (markdownSpace(code4)) {
        return effects.check({
          tokenize: spaceThenNonSpace
        }, ok3, nok)(code4);
      }
      return nok(code4);
    }
  }
  function spaceThenNonSpace(effects, ok3, nok) {
    return factorySpace(effects, after, "whitespace");
    function after(code4) {
      return code4 === null ? nok(code4) : ok3(code4);
    }
  }

  // node_modules/micromark-extension-gfm/index.js
  function gfm(options) {
    return combineExtensions([
      gfmAutolinkLiteral(),
      gfmFootnote(),
      gfmStrikethrough(options),
      gfmTable(),
      gfmTaskListItem()
    ]);
  }

  // node_modules/remark-gfm/lib/index.js
  var emptyOptions2 = {};
  function remarkGfm(options) {
    const self2 = (
      /** @type {Processor<Root>} */
      this
    );
    const settings = options || emptyOptions2;
    const data = self2.data();
    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
    const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
    const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
    micromarkExtensions.push(gfm(settings));
    fromMarkdownExtensions.push(gfmFromMarkdown());
    toMarkdownExtensions.push(gfmToMarkdown(settings));
  }

  // node_modules/scule/dist/index.mjs
  var NUMBER_CHAR_RE = /\d/;
  var STR_SPLITTERS = ["-", "_", "/", "."];
  function isUppercase(char = "") {
    if (NUMBER_CHAR_RE.test(char)) {
      return void 0;
    }
    return char !== char.toLowerCase();
  }
  function splitByCase(str, separators) {
    const splitters = separators ?? STR_SPLITTERS;
    const parts = [];
    if (!str || typeof str !== "string") {
      return parts;
    }
    let buff = "";
    let previousUpper;
    let previousSplitter;
    for (const char of str) {
      const isSplitter = splitters.includes(char);
      if (isSplitter === true) {
        parts.push(buff);
        buff = "";
        previousUpper = void 0;
        continue;
      }
      const isUpper = isUppercase(char);
      if (previousSplitter === false) {
        if (previousUpper === false && isUpper === true) {
          parts.push(buff);
          buff = char;
          previousUpper = isUpper;
          continue;
        }
        if (previousUpper === true && isUpper === false && buff.length > 1) {
          const lastChar = buff.at(-1);
          parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
          buff = lastChar + char;
          previousUpper = isUpper;
          continue;
        }
      }
      buff += char;
      previousUpper = isUpper;
      previousSplitter = isSplitter;
    }
    parts.push(buff);
    return parts;
  }
  function kebabCase(str, joiner) {
    return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p2) => p2.toLowerCase()).join(joiner ?? "-") : "";
  }

  // node_modules/yaml/browser/dist/nodes/identity.js
  var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
  var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
  var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
  var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
  var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
  var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
  var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
  var isAlias = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === ALIAS;
  var isDocument = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === DOC;
  var isMap = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === MAP;
  var isPair = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === PAIR;
  var isScalar = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === SCALAR;
  var isSeq = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === SEQ;
  function isCollection(node2) {
    if (node2 && typeof node2 === "object")
      switch (node2[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return true;
      }
    return false;
  }
  function isNode(node2) {
    if (node2 && typeof node2 === "object")
      switch (node2[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return true;
      }
    return false;
  }
  var hasAnchor = (node2) => (isScalar(node2) || isCollection(node2)) && !!node2.anchor;

  // node_modules/yaml/browser/dist/visit.js
  var BREAK = /* @__PURE__ */ Symbol("break visit");
  var SKIP2 = /* @__PURE__ */ Symbol("skip children");
  var REMOVE = /* @__PURE__ */ Symbol("remove node");
  function visit2(node2, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node2)) {
      const cd = visit_(null, node2.contents, visitor_, Object.freeze([node2]));
      if (cd === REMOVE)
        node2.contents = null;
    } else
      visit_(null, node2, visitor_, Object.freeze([]));
  }
  visit2.BREAK = BREAK;
  visit2.SKIP = SKIP2;
  visit2.REMOVE = REMOVE;
  function visit_(key2, node2, visitor, path2) {
    const ctrl = callVisitor(key2, node2, visitor, path2);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key2, path2, ctrl);
      return visit_(key2, ctrl, visitor, path2);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node2)) {
        path2 = Object.freeze(path2.concat(node2));
        for (let i = 0; i < node2.items.length; ++i) {
          const ci = visit_(i, node2.items[i], visitor, path2);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node2.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node2)) {
        path2 = Object.freeze(path2.concat(node2));
        const ck = visit_("key", node2.key, visitor, path2);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node2.key = null;
        const cv = visit_("value", node2.value, visitor, path2);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node2.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node2, visitor) {
    const visitor_ = initVisitor(visitor);
    if (isDocument(node2)) {
      const cd = await visitAsync_(null, node2.contents, visitor_, Object.freeze([node2]));
      if (cd === REMOVE)
        node2.contents = null;
    } else
      await visitAsync_(null, node2, visitor_, Object.freeze([]));
  }
  visitAsync.BREAK = BREAK;
  visitAsync.SKIP = SKIP2;
  visitAsync.REMOVE = REMOVE;
  async function visitAsync_(key2, node2, visitor, path2) {
    const ctrl = await callVisitor(key2, node2, visitor, path2);
    if (isNode(ctrl) || isPair(ctrl)) {
      replaceNode(key2, path2, ctrl);
      return visitAsync_(key2, ctrl, visitor, path2);
    }
    if (typeof ctrl !== "symbol") {
      if (isCollection(node2)) {
        path2 = Object.freeze(path2.concat(node2));
        for (let i = 0; i < node2.items.length; ++i) {
          const ci = await visitAsync_(i, node2.items[i], visitor, path2);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node2.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (isPair(node2)) {
        path2 = Object.freeze(path2.concat(node2));
        const ck = await visitAsync_("key", node2.key, visitor, path2);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node2.key = null;
        const cv = await visitAsync_("value", node2.value, visitor, path2);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node2.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    }
    return visitor;
  }
  function callVisitor(key2, node2, visitor, path2) {
    if (typeof visitor === "function")
      return visitor(key2, node2, path2);
    if (isMap(node2))
      return visitor.Map?.(key2, node2, path2);
    if (isSeq(node2))
      return visitor.Seq?.(key2, node2, path2);
    if (isPair(node2))
      return visitor.Pair?.(key2, node2, path2);
    if (isScalar(node2))
      return visitor.Scalar?.(key2, node2, path2);
    if (isAlias(node2))
      return visitor.Alias?.(key2, node2, path2);
    return void 0;
  }
  function replaceNode(key2, path2, node2) {
    const parent = path2[path2.length - 1];
    if (isCollection(parent)) {
      parent.items[key2] = node2;
    } else if (isPair(parent)) {
      if (key2 === "key")
        parent.key = node2;
      else
        parent.value = node2;
    } else if (isDocument(parent)) {
      parent.contents = node2;
    } else {
      const pt = isAlias(parent) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${pt} parent`);
    }
  }

  // node_modules/yaml/browser/dist/doc/directives.js
  var escapeChars = {
    "!": "%21",
    ",": "%2C",
    "[": "%5B",
    "]": "%5D",
    "{": "%7B",
    "}": "%7D"
  };
  var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
  var Directives = class _Directives {
    constructor(yaml, tags) {
      this.docStart = null;
      this.docEnd = false;
      this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
      this.tags = Object.assign({}, _Directives.defaultTags, tags);
    }
    clone() {
      const copy = new _Directives(this.yaml, this.tags);
      copy.docStart = this.docStart;
      return copy;
    }
    /**
     * During parsing, get a Directives instance for the current document and
     * update the stream state according to the current version's spec.
     */
    atDocument() {
      const res = new _Directives(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = true;
          break;
        case "1.2":
          this.atNextDocument = false;
          this.yaml = {
            explicit: _Directives.defaultYaml.explicit,
            version: "1.2"
          };
          this.tags = Object.assign({}, _Directives.defaultTags);
          break;
      }
      return res;
    }
    /**
     * @param onError - May be called even if the action was successful
     * @returns `true` on success
     */
    add(line, onError) {
      if (this.atNextDocument) {
        this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
        this.tags = Object.assign({}, _Directives.defaultTags);
        this.atNextDocument = false;
      }
      const parts = line.trim().split(/[ \t]+/);
      const name = parts.shift();
      switch (name) {
        case "%TAG": {
          if (parts.length !== 2) {
            onError(0, "%TAG directive should contain exactly two parts");
            if (parts.length < 2)
              return false;
          }
          const [handle3, prefix] = parts;
          this.tags[handle3] = prefix;
          return true;
        }
        case "%YAML": {
          this.yaml.explicit = true;
          if (parts.length !== 1) {
            onError(0, "%YAML directive should contain exactly one part");
            return false;
          }
          const [version] = parts;
          if (version === "1.1" || version === "1.2") {
            this.yaml.version = version;
            return true;
          } else {
            const isValid = /^\d+\.\d+$/.test(version);
            onError(6, `Unsupported YAML version ${version}`, isValid);
            return false;
          }
        }
        default:
          onError(0, `Unknown directive ${name}`, true);
          return false;
      }
    }
    /**
     * Resolves a tag, matching handles to those defined in %TAG directives.
     *
     * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
     *   `'!local'` tag, or `null` if unresolvable.
     */
    tagName(source, onError) {
      if (source === "!")
        return "!";
      if (source[0] !== "!") {
        onError(`Not a valid tag: ${source}`);
        return null;
      }
      if (source[1] === "<") {
        const verbatim = source.slice(2, -1);
        if (verbatim === "!" || verbatim === "!!") {
          onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
          return null;
        }
        if (source[source.length - 1] !== ">")
          onError("Verbatim tags must end with a >");
        return verbatim;
      }
      const [, handle3, suffix] = source.match(/^(.*!)([^!]*)$/s);
      if (!suffix)
        onError(`The ${source} tag has no suffix`);
      const prefix = this.tags[handle3];
      if (prefix) {
        try {
          return prefix + decodeURIComponent(suffix);
        } catch (error) {
          onError(String(error));
          return null;
        }
      }
      if (handle3 === "!")
        return source;
      onError(`Could not resolve tag: ${source}`);
      return null;
    }
    /**
     * Given a fully resolved tag, returns its printable string form,
     * taking into account current tag prefixes and defaults.
     */
    tagString(tag) {
      for (const [handle3, prefix] of Object.entries(this.tags)) {
        if (tag.startsWith(prefix))
          return handle3 + escapeTagName(tag.substring(prefix.length));
      }
      return tag[0] === "!" ? tag : `!<${tag}>`;
    }
    toString(doc) {
      const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
      const tagEntries = Object.entries(this.tags);
      let tagNames;
      if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
        const tags = {};
        visit2(doc.contents, (_key, node2) => {
          if (isNode(node2) && node2.tag)
            tags[node2.tag] = true;
        });
        tagNames = Object.keys(tags);
      } else
        tagNames = [];
      for (const [handle3, prefix] of tagEntries) {
        if (handle3 === "!!" && prefix === "tag:yaml.org,2002:")
          continue;
        if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
          lines.push(`%TAG ${handle3} ${prefix}`);
      }
      return lines.join("\n");
    }
  };
  Directives.defaultYaml = { explicit: false, version: "1.2" };
  Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

  // node_modules/yaml/browser/dist/doc/anchors.js
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      const sa = JSON.stringify(anchor);
      const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
      throw new Error(msg);
    }
    return true;
  }
  function anchorNames(root4) {
    const anchors = /* @__PURE__ */ new Set();
    visit2(root4, {
      Value(_key, node2) {
        if (node2.anchor)
          anchors.add(node2.anchor);
      }
    });
    return anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!exclude.has(name))
        return name;
    }
  }
  function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = /* @__PURE__ */ new Map();
    let prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source);
        prevAnchors ?? (prevAnchors = anchorNames(doc));
        const anchor = findNewAnchor(prefix, prevAnchors);
        prevAnchors.add(anchor);
        return anchor;
      },
      /**
       * With circular references, the source node is only resolved after all
       * of its child nodes are. This is why anchors are set only after all of
       * the nodes have been created.
       */
      setAnchors: () => {
        for (const source of aliasObjects) {
          const ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
            ref.node.anchor = ref.anchor;
          } else {
            const error = new Error("Failed to resolve repeated object (this should not happen)");
            error.source = source;
            throw error;
          }
        }
      },
      sourceObjects
    };
  }

  // node_modules/yaml/browser/dist/doc/applyReviver.js
  function applyReviver(reviver, obj, key2, val) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; ++i) {
          const v0 = val[i];
          const v1 = applyReviver(reviver, val, String(i), v0);
          if (v1 === void 0)
            delete val[i];
          else if (v1 !== v0)
            val[i] = v1;
        }
      } else if (val instanceof Map) {
        for (const k of Array.from(val.keys())) {
          const v0 = val.get(k);
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            val.delete(k);
          else if (v1 !== v0)
            val.set(k, v1);
        }
      } else if (val instanceof Set) {
        for (const v0 of Array.from(val)) {
          const v1 = applyReviver(reviver, val, v0, v0);
          if (v1 === void 0)
            val.delete(v0);
          else if (v1 !== v0) {
            val.delete(v0);
            val.add(v1);
          }
        }
      } else {
        for (const [k, v0] of Object.entries(val)) {
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === void 0)
            delete val[k];
          else if (v1 !== v0)
            val[k] = v1;
        }
      }
    }
    return reviver.call(obj, key2, val);
  }

  // node_modules/yaml/browser/dist/nodes/toJS.js
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !hasAnchor(value))
        return value.toJSON(arg, ctx);
      const data = { aliasCount: 0, count: 1, res: void 0 };
      ctx.anchors.set(value, data);
      ctx.onCreate = (res2) => {
        data.res = res2;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }

  // node_modules/yaml/browser/dist/nodes/Node.js
  var NodeBase = class {
    constructor(type) {
      Object.defineProperty(this, NODE_TYPE, { value: type });
    }
    /** Create a copy of this node.  */
    clone() {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    /** A plain JavaScript representation of this node. */
    toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      if (!isDocument(doc))
        throw new TypeError("A document argument is required");
      const ctx = {
        anchors: /* @__PURE__ */ new Map(),
        doc,
        keep: true,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS(this, "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res: res2 } of ctx.anchors.values())
          onAnchor(res2, count);
      return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
    }
  };

  // node_modules/yaml/browser/dist/nodes/Alias.js
  var Alias = class extends NodeBase {
    constructor(source) {
      super(ALIAS);
      this.source = source;
      Object.defineProperty(this, "tag", {
        set() {
          throw new Error("Alias nodes cannot have tags");
        }
      });
    }
    /**
     * Resolve the value of this alias within `doc`, finding the last
     * instance of the `source` anchor before this node.
     */
    resolve(doc, ctx) {
      if (ctx?.maxAliasCount === 0)
        throw new ReferenceError("Alias resolution is disabled");
      let nodes;
      if (ctx?.aliasResolveCache) {
        nodes = ctx.aliasResolveCache;
      } else {
        nodes = [];
        visit2(doc, {
          Node: (_key, node2) => {
            if (isAlias(node2) || hasAnchor(node2))
              nodes.push(node2);
          }
        });
        if (ctx)
          ctx.aliasResolveCache = nodes;
      }
      let found = void 0;
      for (const node2 of nodes) {
        if (node2 === this)
          break;
        if (node2.anchor === this.source)
          found = node2;
      }
      return found;
    }
    toJSON(_arg, ctx) {
      if (!ctx)
        return { source: this.source };
      const { anchors, doc, maxAliasCount } = ctx;
      const source = this.resolve(doc, ctx);
      if (!source) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new ReferenceError(msg);
      }
      let data = anchors.get(source);
      if (!data) {
        toJS(source, null, ctx);
        data = anchors.get(source);
      }
      if (data?.res === void 0) {
        const msg = "This should not happen: Alias anchor was not resolved?";
        throw new ReferenceError(msg);
      }
      if (maxAliasCount >= 0) {
        data.count += 1;
        if (data.aliasCount === 0)
          data.aliasCount = getAliasCount(doc, source, anchors);
        if (data.count * data.aliasCount > maxAliasCount) {
          const msg = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(msg);
        }
      }
      return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
      const src = `*${this.source}`;
      if (ctx) {
        anchorIsValid(this.source);
        if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new Error(msg);
        }
        if (ctx.implicitKey)
          return `${src} `;
      }
      return src;
    }
  };
  function getAliasCount(doc, node2, anchors) {
    if (isAlias(node2)) {
      const source = node2.resolve(doc);
      const anchor = anchors && source && anchors.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (isCollection(node2)) {
      let count = 0;
      for (const item of node2.items) {
        const c = getAliasCount(doc, item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (isPair(node2)) {
      const kc = getAliasCount(doc, node2.key, anchors);
      const vc = getAliasCount(doc, node2.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }

  // node_modules/yaml/browser/dist/nodes/Scalar.js
  var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
  var Scalar = class extends NodeBase {
    constructor(value) {
      super(SCALAR);
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  };
  Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
  Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
  Scalar.PLAIN = "PLAIN";
  Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

  // node_modules/yaml/browser/dist/doc/createNode.js
  var defaultTagPrefix = "tag:yaml.org,2002:";
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) ?? match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t) => t.identify?.(value) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (isDocument(value))
      value = value.contents;
    if (isNode(value))
      return value;
    if (isPair(value)) {
      const map4 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
      map4.items.push(value);
      return map4;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
      value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
    let ref = void 0;
    if (aliasDuplicateObjects && value && typeof value === "object") {
      ref = sourceObjects.get(value);
      if (ref) {
        ref.anchor ?? (ref.anchor = onAnchor(value));
        return new Alias(ref.anchor);
      } else {
        ref = { anchor: null, node: null };
        sourceObjects.set(value, ref);
      }
    }
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema4.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      if (!value || typeof value !== "object") {
        const node3 = new Scalar(value);
        if (ref)
          ref.node = node3;
        return node3;
      }
      tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const node2 = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
    if (tagName)
      node2.tag = tagName;
    else if (!tagObj.default)
      node2.tag = tagObj.tag;
    if (ref)
      ref.node = node2;
    return node2;
  }

  // node_modules/yaml/browser/dist/nodes/Collection.js
  function collectionFromPath(schema4, path2, value) {
    let v = value;
    for (let i = path2.length - 1; i >= 0; --i) {
      const k = path2[i];
      if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        v = /* @__PURE__ */ new Map([[k, v]]);
      }
    }
    return createNode(v, void 0, {
      aliasDuplicateObjects: false,
      keepUndefined: false,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: schema4,
      sourceObjects: /* @__PURE__ */ new Map()
    });
  }
  var isEmptyPath = (path2) => path2 == null || typeof path2 === "object" && !!path2[Symbol.iterator]().next().done;
  var Collection = class extends NodeBase {
    constructor(type, schema4) {
      super(type);
      Object.defineProperty(this, "schema", {
        value: schema4,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    /**
     * Create a copy of this collection.
     *
     * @param schema - If defined, overwrites the original's schema
     */
    clone(schema4) {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (schema4)
        copy.schema = schema4;
      copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    /**
     * Adds a value to the collection. For `!!map` and `!!omap` the value must
     * be a Pair instance or a `{ key, value }` object, which may not have a key
     * that already exists in the map.
     */
    addIn(path2, value) {
      if (isEmptyPath(path2))
        this.add(value);
      else {
        const [key2, ...rest] = path2;
        const node2 = this.get(key2, true);
        if (isCollection(node2))
          node2.addIn(rest, value);
        else if (node2 === void 0 && this.schema)
          this.set(key2, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
      }
    }
    /**
     * Removes a value from the collection.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path2) {
      const [key2, ...rest] = path2;
      if (rest.length === 0)
        return this.delete(key2);
      const node2 = this.get(key2, true);
      if (isCollection(node2))
        return node2.deleteIn(rest);
      else
        throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path2, keepScalar) {
      const [key2, ...rest] = path2;
      const node2 = this.get(key2, true);
      if (rest.length === 0)
        return !keepScalar && isScalar(node2) ? node2.value : node2;
      else
        return isCollection(node2) ? node2.getIn(rest, keepScalar) : void 0;
    }
    hasAllNullValues(allowScalar) {
      return this.items.every((node2) => {
        if (!isPair(node2))
          return false;
        const n = node2.value;
        return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     */
    hasIn(path2) {
      const [key2, ...rest] = path2;
      if (rest.length === 0)
        return this.has(key2);
      const node2 = this.get(key2, true);
      return isCollection(node2) ? node2.hasIn(rest) : false;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path2, value) {
      const [key2, ...rest] = path2;
      if (rest.length === 0) {
        this.set(key2, value);
      } else {
        const node2 = this.get(key2, true);
        if (isCollection(node2))
          node2.setIn(rest, value);
        else if (node2 === void 0 && this.schema)
          this.set(key2, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key2}. Remaining path: ${rest}`);
      }
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyComment.js
  var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
  function indentComment(comment2, indent2) {
    if (/^\n+$/.test(comment2))
      return comment2.substring(1);
    return indent2 ? comment2.replace(/^(?! *$)/gm, indent2) : comment2;
  }
  var lineComment = (str, indent2, comment2) => str.endsWith("\n") ? indentComment(comment2, indent2) : comment2.includes("\n") ? "\n" + indentComment(comment2, indent2) : (str.endsWith(" ") ? "" : " ") + comment2;

  // node_modules/yaml/browser/dist/stringify/foldFlowLines.js
  var FOLD_FLOW = "flow";
  var FOLD_BLOCK = "block";
  var FOLD_QUOTED = "quoted";
  function foldFlowLines(text7, indent2, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
      return text7;
    if (lineWidth < minContentWidth)
      minContentWidth = 0;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent2.length);
    if (text7.length <= endStep)
      return text7;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent2.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = void 0;
    let prev = void 0;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text7, i, indent2.length);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch; ch = text7[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text7[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === "\n") {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text7, i, indent2.length);
        end = i + indent2.length + endStep;
        split = void 0;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
          const next = text7[i + 1];
          if (next && next !== " " && next !== "\n" && next !== "	")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = void 0;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "	") {
              prev = ch;
              ch = text7[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text7;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = void 0;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text7;
    if (onFold)
      onFold();
    let res = text7.slice(0, folds[0]);
    for (let i2 = 0; i2 < folds.length; ++i2) {
      const fold = folds[i2];
      const end2 = folds[i2 + 1] || text7.length;
      if (fold === 0)
        res = `
${indent2}${text7.slice(0, end2)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text7[fold]}\\`;
        res += `
${indent2}${text7.slice(fold + 1, end2)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text7, i, indent2) {
    let end = i;
    let start = i + 1;
    let ch = text7[start];
    while (ch === " " || ch === "	") {
      if (i < start + indent2) {
        ch = text7[++i];
      } else {
        do {
          ch = text7[++i];
        } while (ch && ch !== "\n");
        end = i;
        start = i + 1;
        ch = text7[start];
      }
    }
    return end;
  }

  // node_modules/yaml/browser/dist/stringify/stringifyString.js
  var getFoldOptions = (ctx, isBlock2) => ({
    indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
  });
  var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
      if (str[i] === "\n") {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent2 = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code4 = json.substr(i + 2, 4);
              switch (code4) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code4.substr(0, 2) === "00")
                    str += "\\x" + code4.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + "\n\n";
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += "\n";
                i += 2;
              }
              str += indent2;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines(str, indent2, FOLD_QUOTED, getFoldOptions(ctx, false));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    const indent2 = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent2}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent2, FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
      qs = doubleQuotedString;
    else {
      const hasDouble = value.includes('"');
      const hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  var blockEndNewlines;
  try {
    blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
  } catch {
    blockEndNewlines = /\n+(?!\n|$)/g;
  }
  function blockString({ comment: comment2, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote: blockQuote2, commentString, lineWidth } = ctx.options;
    if (!blockQuote2 || /\n[\t ]+$/.test(value)) {
      return quotedString(value, ctx);
    }
    const indent2 = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const literal = blockQuote2 === "literal" ? true : blockQuote2 === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent2.length);
    if (!value)
      return literal ? "|\n" : ">\n";
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
      const ch = value[endStart - 1];
      if (ch !== "\n" && ch !== "	" && ch !== " ")
        break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf("\n");
    if (endNlPos === -1) {
      chomp = "-";
    } else if (value === end || endNlPos !== end.length - 1) {
      chomp = "+";
      if (onChompKeep)
        onChompKeep();
    } else {
      chomp = "";
    }
    if (end) {
      value = value.slice(0, -end.length);
      if (end[end.length - 1] === "\n")
        end = end.slice(0, -1);
      end = end.replace(blockEndNewlines, `$&${indent2}`);
    }
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
      const ch = value[startEnd];
      if (ch === " ")
        startWithSpace = true;
      else if (ch === "\n")
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
      value = value.substring(start.length);
      start = start.replace(/\n+/g, `$&${indent2}`);
    }
    const indentSize = indent2 ? "2" : "1";
    let header = (startWithSpace ? indentSize : "") + chomp;
    if (comment2) {
      header += " " + commentString(comment2.replace(/ ?[\r\n]+/g, " "));
      if (onComment)
        onComment();
    }
    if (!literal) {
      const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent2}`);
      let literalFallback = false;
      const foldOptions = getFoldOptions(ctx, true);
      if (blockQuote2 !== "folded" && type !== Scalar.BLOCK_FOLDED) {
        foldOptions.onOverflow = () => {
          literalFallback = true;
        };
      }
      const body3 = foldFlowLines(`${start}${foldedValue}${end}`, indent2, FOLD_BLOCK, foldOptions);
      if (!literalFallback)
        return `>${header}
${indent2}${body3}`;
    }
    value = value.replace(/\n+/g, `$&${indent2}`);
    return `|${header}
${indent2}${start}${value}${end}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent: indent2, indentStep, inFlow } = ctx;
    if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
      return quotedString(value, ctx);
    }
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
      if (indent2 === "") {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      } else if (implicitKey && indent2 === indentStep) {
        return quotedString(value, ctx);
      }
    }
    const str = value.replace(/\n+/g, `$&
${indent2}`);
    if (actualString) {
      const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
      const { compat, tags } = ctx.doc.schema;
      if (tags.some(test) || compat?.some(test))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines(str, indent2, FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
      switch (_type) {
        case Scalar.BLOCK_FOLDED:
        case Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    let res = _stringify(type);
    if (res === null) {
      const { defaultKeyType, defaultStringType } = ctx.options;
      const t = implicitKey && defaultKeyType || defaultStringType;
      res = _stringify(t);
      if (res === null)
        throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
  }

  // node_modules/yaml/browser/dist/stringify/stringify.js
  function createStringifyContext(doc, options) {
    const opt = Object.assign({
      blockQuote: true,
      commentString: stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: true,
      indentSeq: true,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: false,
      singleQuote: null,
      trailingComma: false,
      trueStr: "true",
      verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = false;
        break;
      case "flow":
        inFlow = true;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: /* @__PURE__ */ new Set(),
      doc,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) ?? match[0];
    }
    let tagObj = void 0;
    let obj;
    if (isScalar(item)) {
      obj = item.value;
      let match = tags.filter((t) => t.identify?.(obj));
      if (match.length > 1) {
        const testMatch = match.filter((t) => t.test);
        if (testMatch.length > 0)
          match = testMatch;
      }
      tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node2, tagObj, { anchors, doc }) {
    if (!doc.directives)
      return "";
    const props = [];
    const anchor = (isScalar(node2) || isCollection(node2)) && node2.anchor;
    if (anchor && anchorIsValid(anchor)) {
      anchors.add(anchor);
      props.push(`&${anchor}`);
    }
    const tag = node2.tag ?? (tagObj.default ? null : tagObj.tag);
    if (tag)
      props.push(doc.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    if (isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item)) {
        throw new TypeError(`Cannot stringify circular structure without alias nodes`);
      } else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = void 0;
    const node2 = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
    tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node2));
    const props = stringifyProps(node2, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node2, ctx, onComment, onChompKeep) : isScalar(node2) ? stringifyString(node2, ctx, onComment, onChompKeep) : node2.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return isScalar(node2) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }

  // node_modules/yaml/browser/dist/stringify/stringifyPair.js
  function stringifyPair({ key: key2, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent: indent2, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = isNode(key2) && key2.comment || null;
    if (simpleKeys) {
      if (keyComment) {
        throw new Error("With simple keys, key nodes cannot have comments");
      }
      if (isCollection(key2) || !isNode(key2) && typeof key2 === "object") {
        const msg = "With simple keys, collection cannot be used as a key value";
        throw new Error(msg);
      }
    }
    let explicitKey = !simpleKeys && (!key2 || keyComment && value == null && !ctx.inFlow || isCollection(key2) || (isScalar(key2) ? key2.type === Scalar.BLOCK_FOLDED || key2.type === Scalar.BLOCK_LITERAL : typeof key2 === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: false,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent2 + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify(key2, ctx, () => keyCommentDone = true, () => chompKeep = true);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = true;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      str = `? ${str}`;
      if (keyComment && !keyCommentDone) {
        str += lineComment(str, ctx.indent, commentString(keyComment));
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent2}:`;
    } else {
      str = `${str}:`;
      if (keyComment)
        str += lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (isNode(value)) {
      vsb = !!value.spaceBefore;
      vcb = value.commentBefore;
      valueComment = value.comment;
    } else {
      vsb = false;
      vcb = null;
      valueComment = null;
      if (value && typeof value === "object")
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && isScalar(value))
      ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
      ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
    let ws = " ";
    if (keyComment || vsb || vcb) {
      ws = vsb ? "\n" : "";
      if (vcb) {
        const cs = commentString(vcb);
        ws += `
${indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === "\n" && valueComment)
          ws = "\n\n";
      } else {
        ws += `
${ctx.indent}`;
      }
    } else if (!explicitKey && isCollection(value)) {
      const vs0 = valueStr[0];
      const nl0 = valueStr.indexOf("\n");
      const hasNewline = nl0 !== -1;
      const flow3 = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow3) {
        let hasPropsLine = false;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          }
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = true;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === "\n") {
      ws = "";
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone) {
      str += lineComment(str, ctx.indent, commentString(valueComment));
    } else if (chompKeep && onChompKeep) {
      onChompKeep();
    }
    return str;
  }

  // node_modules/yaml/browser/dist/log.js
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn") {
      console.warn(warning);
    }
  }

  // node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
  var MERGE_KEY = "<<";
  var merge = {
    identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
    default: "key",
    tag: "tag:yaml.org,2002:merge",
    test: /^<<$/,
    resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
      addToJSMap: addMergeToJSMap
    }),
    stringify: () => MERGE_KEY
  };
  var isMergeKey = (ctx, key2) => (merge.identify(key2) || isScalar(key2) && (!key2.type || key2.type === Scalar.PLAIN) && merge.identify(key2.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
  function addMergeToJSMap(ctx, map4, value) {
    const source = resolveAliasValue(ctx, value);
    if (isSeq(source))
      for (const it of source.items)
        mergeValue(ctx, map4, it);
    else if (Array.isArray(source))
      for (const it of source)
        mergeValue(ctx, map4, it);
    else
      mergeValue(ctx, map4, source);
  }
  function mergeValue(ctx, map4, value) {
    const source = resolveAliasValue(ctx, value);
    if (!isMap(source))
      throw new Error("Merge sources must be maps or map aliases");
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key2, value2] of srcMap) {
      if (map4 instanceof Map) {
        if (!map4.has(key2))
          map4.set(key2, value2);
      } else if (map4 instanceof Set) {
        map4.add(key2);
      } else if (!Object.prototype.hasOwnProperty.call(map4, key2)) {
        Object.defineProperty(map4, key2, {
          value: value2,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return map4;
  }
  function resolveAliasValue(ctx, value) {
    return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
  }

  // node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
  function addPairToJSMap(ctx, map4, { key: key2, value }) {
    if (isNode(key2) && key2.addToJSMap)
      key2.addToJSMap(ctx, map4, value);
    else if (isMergeKey(ctx, key2))
      addMergeToJSMap(ctx, map4, value);
    else {
      const jsKey = toJS(key2, "", ctx);
      if (map4 instanceof Map) {
        map4.set(jsKey, toJS(value, jsKey, ctx));
      } else if (map4 instanceof Set) {
        map4.add(jsKey);
      } else {
        const stringKey = stringifyKey(key2, jsKey, ctx);
        const jsValue = toJS(value, stringKey, ctx);
        if (stringKey in map4)
          Object.defineProperty(map4, stringKey, {
            value: jsValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map4[stringKey] = jsValue;
      }
    }
    return map4;
  }
  function stringifyKey(key2, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (isNode(key2) && ctx?.doc) {
      const strCtx = createStringifyContext(ctx.doc, {});
      strCtx.anchors = /* @__PURE__ */ new Set();
      for (const node2 of ctx.anchors.keys())
        strCtx.anchors.add(node2.anchor);
      strCtx.inFlow = true;
      strCtx.inStringifyKey = true;
      const strKey = key2.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
        ctx.mapKeyWarned = true;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }

  // node_modules/yaml/browser/dist/nodes/Pair.js
  function createPair(key2, value, ctx) {
    const k = createNode(key2, void 0, ctx);
    const v = createNode(value, void 0, ctx);
    return new Pair(k, v);
  }
  var Pair = class _Pair {
    constructor(key2, value = null) {
      Object.defineProperty(this, NODE_TYPE, { value: PAIR });
      this.key = key2;
      this.value = value;
    }
    clone(schema4) {
      let { key: key2, value } = this;
      if (isNode(key2))
        key2 = key2.clone(schema4);
      if (isNode(value))
        value = value.clone(schema4);
      return new _Pair(key2, value);
    }
    toJSON(_, ctx) {
      const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
      return addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyCollection.js
  function stringifyCollection(collection, ctx, options) {
    const flow3 = ctx.inFlow ?? collection.flow;
    const stringify6 = flow3 ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify6(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment: comment2, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent: indent2, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment3 = null;
      if (isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
        if (item.comment)
          comment3 = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = false;
      let str2 = stringify(item, itemCtx, () => comment3 = null, () => chompKeep = true);
      if (comment3)
        str2 += lineComment(str2, itemIndent, commentString(comment3));
      if (chompKeep && comment3)
        chompKeep = false;
      lines.push(blockItemPrefix + str2);
    }
    let str;
    if (lines.length === 0) {
      str = flowChars.start + flowChars.end;
    } else {
      str = lines[0];
      for (let i = 1; i < lines.length; ++i) {
        const line = lines[i];
        str += line ? `
${indent2}${line}` : "\n";
      }
    }
    if (comment2) {
      str += "\n" + indentComment(commentString(comment2), indent2);
      if (onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
    const { indent: indent2, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: true,
      type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      let comment2 = null;
      if (isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, false);
        if (item.comment)
          comment2 = item.comment;
      } else if (isPair(item)) {
        const ik = isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, false);
          if (ik.comment)
            reqNewline = true;
        }
        const iv = isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment2 = iv.comment;
          if (iv.commentBefore)
            reqNewline = true;
        } else if (item.value == null && ik?.comment) {
          comment2 = ik.comment;
        }
      }
      if (comment2)
        reqNewline = true;
      let str = stringify(item, itemCtx, () => comment2 = null);
      reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
      if (i < items.length - 1) {
        str += ",";
      } else if (ctx.options.trailingComma) {
        if (ctx.options.lineWidth > 0) {
          reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
        }
        if (reqNewline) {
          str += ",";
        }
      }
      if (comment2)
        str += lineComment(str, itemIndent, commentString(comment2));
      lines.push(str);
      linesAtValue = lines.length;
    }
    const { start, end } = flowChars;
    if (lines.length === 0) {
      return start + end;
    } else {
      if (!reqNewline) {
        const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (const line of lines)
          str += line ? `
${indentStep}${indent2}${line}` : "\n";
        return `${str}
${indent2}${end}`;
      } else {
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
      }
    }
  }
  function addCommentBefore({ indent: indent2, options: { commentString } }, lines, comment2, chompKeep) {
    if (comment2 && chompKeep)
      comment2 = comment2.replace(/^\n+/, "");
    if (comment2) {
      const ic = indentComment(commentString(comment2), indent2);
      lines.push(ic.trimStart());
    }
  }

  // node_modules/yaml/browser/dist/nodes/YAMLMap.js
  function findPair(items, key2) {
    const k = isScalar(key2) ? key2.value : key2;
    for (const it of items) {
      if (isPair(it)) {
        if (it.key === key2 || it.key === k)
          return it;
        if (isScalar(it.key) && it.key.value === k)
          return it;
      }
    }
    return void 0;
  }
  var YAMLMap = class extends Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(schema4) {
      super(MAP, schema4);
      this.items = [];
    }
    /**
     * A generic collection parsing method that can be extended
     * to other node classes that inherit from YAMLMap
     */
    static from(schema4, obj, ctx) {
      const { keepUndefined, replacer } = ctx;
      const map4 = new this(schema4);
      const add = (key2, value) => {
        if (typeof replacer === "function")
          value = replacer.call(obj, key2, value);
        else if (Array.isArray(replacer) && !replacer.includes(key2))
          return;
        if (value !== void 0 || keepUndefined)
          map4.items.push(createPair(key2, value, ctx));
      };
      if (obj instanceof Map) {
        for (const [key2, value] of obj)
          add(key2, value);
      } else if (obj && typeof obj === "object") {
        for (const key2 of Object.keys(obj))
          add(key2, obj[key2]);
      }
      if (typeof schema4.sortMapEntries === "function") {
        map4.items.sort(schema4.sortMapEntries);
      }
      return map4;
    }
    /**
     * Adds a value to the collection.
     *
     * @param overwrite - If not set `true`, using a key that is already in the
     *   collection will throw. Otherwise, overwrites the previous value.
     */
    add(pair, overwrite) {
      let _pair;
      if (isPair(pair))
        _pair = pair;
      else if (!pair || typeof pair !== "object" || !("key" in pair)) {
        _pair = new Pair(pair, pair?.value);
      } else
        _pair = new Pair(pair.key, pair.value);
      const prev = findPair(this.items, _pair.key);
      const sortEntries = this.schema?.sortMapEntries;
      if (prev) {
        if (!overwrite)
          throw new Error(`Key ${_pair.key} already set`);
        if (isScalar(prev.value) && isScalarValue(_pair.value))
          prev.value.value = _pair.value;
        else
          prev.value = _pair.value;
      } else if (sortEntries) {
        const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
        if (i === -1)
          this.items.push(_pair);
        else
          this.items.splice(i, 0, _pair);
      } else {
        this.items.push(_pair);
      }
    }
    delete(key2) {
      const it = findPair(this.items, key2);
      if (!it)
        return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }
    get(key2, keepScalar) {
      const it = findPair(this.items, key2);
      const node2 = it?.value;
      return (!keepScalar && isScalar(node2) ? node2.value : node2) ?? void 0;
    }
    has(key2) {
      return !!findPair(this.items, key2);
    }
    set(key2, value) {
      this.add(new Pair(key2, value), true);
    }
    /**
     * @param ctx - Conversion context, originally set in Document#toJS()
     * @param {Class} Type - If set, forces the returned collection type
     * @returns Instance of Type, Map, or Object
     */
    toJSON(_, ctx, Type) {
      const map4 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
      if (ctx?.onCreate)
        ctx.onCreate(map4);
      for (const item of this.items)
        addPairToJSMap(ctx, map4, item);
      return map4;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (const item of this.items) {
        if (!isPair(item))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }
      if (!ctx.allNullValues && this.hasAllNullValues(false))
        ctx = Object.assign({}, ctx, { allNullValues: true });
      return stringifyCollection(this, ctx, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: ctx.indent || "",
        onChompKeep,
        onComment
      });
    }
  };

  // node_modules/yaml/browser/dist/schema/common/map.js
  var map3 = {
    collection: "map",
    default: true,
    nodeClass: YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve(map4, onError) {
      if (!isMap(map4))
        onError("Expected a mapping for this tag");
      return map4;
    },
    createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
  };

  // node_modules/yaml/browser/dist/nodes/YAMLSeq.js
  var YAMLSeq = class extends Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(schema4) {
      super(SEQ, schema4);
      this.items = [];
    }
    add(value) {
      this.items.push(value);
    }
    /**
     * Removes a value from the collection.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     *
     * @returns `true` if the item was found and removed.
     */
    delete(key2) {
      const idx = asItemIndex(key2);
      if (typeof idx !== "number")
        return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }
    get(key2, keepScalar) {
      const idx = asItemIndex(key2);
      if (typeof idx !== "number")
        return void 0;
      const it = this.items[idx];
      return !keepScalar && isScalar(it) ? it.value : it;
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    has(key2) {
      const idx = asItemIndex(key2);
      return typeof idx === "number" && idx < this.items.length;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     *
     * If `key` does not contain a representation of an integer, this will throw.
     * It may be wrapped in a `Scalar`.
     */
    set(key2, value) {
      const idx = asItemIndex(key2);
      if (typeof idx !== "number")
        throw new Error(`Expected a valid index, not ${key2}.`);
      const prev = this.items[idx];
      if (isScalar(prev) && isScalarValue(value))
        prev.value = value;
      else
        this.items[idx] = value;
    }
    toJSON(_, ctx) {
      const seq2 = [];
      if (ctx?.onCreate)
        ctx.onCreate(seq2);
      let i = 0;
      for (const item of this.items)
        seq2.push(toJS(item, String(i++), ctx));
      return seq2;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return stringifyCollection(this, ctx, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (ctx.indent || "") + "  ",
        onChompKeep,
        onComment
      });
    }
    static from(schema4, obj, ctx) {
      const { replacer } = ctx;
      const seq2 = new this(schema4);
      if (obj && Symbol.iterator in Object(obj)) {
        let i = 0;
        for (let it of obj) {
          if (typeof replacer === "function") {
            const key2 = obj instanceof Set ? it : String(i++);
            it = replacer.call(obj, key2, it);
          }
          seq2.items.push(createNode(it, void 0, ctx));
        }
      }
      return seq2;
    }
  };
  function asItemIndex(key2) {
    let idx = isScalar(key2) ? key2.value : key2;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }

  // node_modules/yaml/browser/dist/schema/common/seq.js
  var seq = {
    collection: "seq",
    default: true,
    nodeClass: YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve(seq2, onError) {
      if (!isSeq(seq2))
        onError("Expected a sequence for this tag");
      return seq2;
    },
    createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
  };

  // node_modules/yaml/browser/dist/schema/common/string.js
  var string3 = {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({ actualString: true }, ctx);
      return stringifyString(item, ctx, onComment, onChompKeep);
    }
  };

  // node_modules/yaml/browser/dist/schema/common/null.js
  var nullTag = {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar(null),
    stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
  };

  // node_modules/yaml/browser/dist/schema/core/bool.js
  var boolTag = {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
    stringify({ source, value }, ctx) {
      if (source && boolTag.test.test(source)) {
        const sv = source[0] === "t" || source[0] === "T";
        if (value === sv)
          return source;
      }
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyNumber.js
  function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    const num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }

  // node_modules/yaml/browser/dist/schema/core/float.js
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify(node2) {
      const num = Number(node2.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber(node2);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
      const node2 = new Scalar(parseFloat(str));
      const dot = str.indexOf(".");
      if (dot !== -1 && str[str.length - 1] === "0")
        node2.minFractionDigits = str.length - dot - 1;
      return node2;
    },
    stringify: stringifyNumber
  };

  // node_modules/yaml/browser/dist/schema/core/int.js
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
  function intStringify(node2, radix, prefix) {
    const { value } = node2;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber(node2);
  }
  var intOct = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: (node2) => intStringify(node2, 8, "0o")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber
  };
  var intHex = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node2) => intStringify(node2, 16, "0x")
  };

  // node_modules/yaml/browser/dist/schema/core/schema.js
  var schema = [
    map3,
    seq,
    string3,
    nullTag,
    boolTag,
    intOct,
    int,
    intHex,
    floatNaN,
    floatExp,
    float
  ];

  // node_modules/yaml/browser/dist/schema/json/schema.js
  function intIdentify2(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON = ({ value }) => JSON.stringify(value);
  var jsonScalars = [
    {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify: stringifyJSON
    },
    {
      identify: (value) => value == null,
      createNode: () => new Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^null$/,
      resolve: () => null,
      stringify: stringifyJSON
    },
    {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^true$|^false$/,
      resolve: (str) => str === "true",
      stringify: stringifyJSON
    },
    {
      identify: intIdentify2,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
      stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
    },
    {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: (str) => parseFloat(str),
      stringify: stringifyJSON
    }
  ];
  var jsonError = {
    default: true,
    tag: "",
    test: /^/,
    resolve(str, onError) {
      onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
      return str;
    }
  };
  var schema2 = [map3, seq].concat(jsonScalars, jsonError);

  // node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
  var binary = {
    identify: (value) => value instanceof Uint8Array,
    // Buffer inherits from Uint8Array
    default: false,
    tag: "tag:yaml.org,2002:binary",
    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve(src, onError) {
      if (typeof atob === "function") {
        const str = atob(src.replace(/[\n\r]/g, ""));
        const buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        onError("This environment does not support reading binary tags; either Buffer or atob is required");
        return src;
      }
    },
    stringify({ comment: comment2, type, value }, ctx, onComment, onChompKeep) {
      if (!value)
        return "";
      const buf = value;
      let str;
      if (typeof btoa === "function") {
        let s = "";
        for (let i = 0; i < buf.length; ++i)
          s += String.fromCharCode(buf[i]);
        str = btoa(s);
      } else {
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      }
      type ?? (type = Scalar.BLOCK_LITERAL);
      if (type !== Scalar.QUOTE_DOUBLE) {
        const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
        const n = Math.ceil(str.length / lineWidth);
        const lines = new Array(n);
        for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
          lines[i] = str.substr(o, lineWidth);
        }
        str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
      }
      return stringifyString({ comment: comment2, type, value: str }, ctx, onComment, onChompKeep);
    }
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
  function resolvePairs(seq2, onError) {
    if (isSeq(seq2)) {
      for (let i = 0; i < seq2.items.length; ++i) {
        let item = seq2.items[i];
        if (isPair(item))
          continue;
        else if (isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          const pair = item.items[0] || new Pair(new Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            const cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq2.items[i] = isPair(item) ? item : new Pair(item);
      }
    } else
      onError("Expected a sequence for this tag");
    return seq2;
  }
  function createPairs(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const pairs2 = new YAMLSeq(schema4);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i++), it);
        let key2, value;
        if (Array.isArray(it)) {
          if (it.length === 2) {
            key2 = it[0];
            value = it[1];
          } else
            throw new TypeError(`Expected [key, value] tuple: ${it}`);
        } else if (it && it instanceof Object) {
          const keys2 = Object.keys(it);
          if (keys2.length === 1) {
            key2 = keys2[0];
            value = it[key2];
          } else {
            throw new TypeError(`Expected tuple with one key, not ${keys2.length} keys`);
          }
        } else {
          key2 = it;
        }
        pairs2.items.push(createPair(key2, value, ctx));
      }
    return pairs2;
  }
  var pairs = {
    collection: "seq",
    default: false,
    tag: "tag:yaml.org,2002:pairs",
    resolve: resolvePairs,
    createNode: createPairs
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
  var YAMLOMap = class _YAMLOMap extends YAMLSeq {
    constructor() {
      super();
      this.add = YAMLMap.prototype.add.bind(this);
      this.delete = YAMLMap.prototype.delete.bind(this);
      this.get = YAMLMap.prototype.get.bind(this);
      this.has = YAMLMap.prototype.has.bind(this);
      this.set = YAMLMap.prototype.set.bind(this);
      this.tag = _YAMLOMap.tag;
    }
    /**
     * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
     * but TypeScript won't allow widening the signature of a child method.
     */
    toJSON(_, ctx) {
      if (!ctx)
        return super.toJSON(_);
      const map4 = /* @__PURE__ */ new Map();
      if (ctx?.onCreate)
        ctx.onCreate(map4);
      for (const pair of this.items) {
        let key2, value;
        if (isPair(pair)) {
          key2 = toJS(pair.key, "", ctx);
          value = toJS(pair.value, key2, ctx);
        } else {
          key2 = toJS(pair, "", ctx);
        }
        if (map4.has(key2))
          throw new Error("Ordered maps must not include duplicate keys");
        map4.set(key2, value);
      }
      return map4;
    }
    static from(schema4, iterable, ctx) {
      const pairs2 = createPairs(schema4, iterable, ctx);
      const omap2 = new this();
      omap2.items = pairs2.items;
      return omap2;
    }
  };
  YAMLOMap.tag = "tag:yaml.org,2002:omap";
  var omap = {
    collection: "seq",
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: "tag:yaml.org,2002:omap",
    resolve(seq2, onError) {
      const pairs2 = resolvePairs(seq2, onError);
      const seenKeys = [];
      for (const { key: key2 } of pairs2.items) {
        if (isScalar(key2)) {
          if (seenKeys.includes(key2.value)) {
            onError(`Ordered maps must not include duplicate keys: ${key2.value}`);
          } else {
            seenKeys.push(key2.value);
          }
        }
      }
      return Object.assign(new YAMLOMap(), pairs2);
    },
    createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
  function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag = {
    identify: (value) => value === true,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar(true),
    stringify: boolStringify
  };
  var falseTag = {
    identify: (value) => value === false,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
    resolve: () => new Scalar(false),
    stringify: boolStringify
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
  var floatNaN2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber
  };
  var floatExp2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify(node2) {
      const num = Number(node2.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber(node2);
    }
  };
  var float2 = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
      const node2 = new Scalar(parseFloat(str.replace(/_/g, "")));
      const dot = str.indexOf(".");
      if (dot !== -1) {
        const f = str.substring(dot + 1).replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node2.minFractionDigits = f.length;
      }
      return node2;
    },
    stringify: stringifyNumber
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
  var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve2(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === "-" || sign === "+")
      offset += 1;
    str = str.substring(offset).replace(/_/g, "");
    if (intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n2 = BigInt(str);
      return sign === "-" ? BigInt(-1) * n2 : n2;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify2(node2, radix, prefix) {
    const { value } = node2;
    if (intIdentify3(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber(node2);
  }
  var intBin = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
    stringify: (node2) => intStringify2(node2, 2, "0b")
  };
  var intOct2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
    stringify: (node2) => intStringify2(node2, 8, "0")
  };
  var int2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
    stringify: stringifyNumber
  };
  var intHex2 = {
    identify: intIdentify3,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
    stringify: (node2) => intStringify2(node2, 16, "0x")
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
  var YAMLSet = class _YAMLSet extends YAMLMap {
    constructor(schema4) {
      super(schema4);
      this.tag = _YAMLSet.tag;
    }
    add(key2) {
      let pair;
      if (isPair(key2))
        pair = key2;
      else if (key2 && typeof key2 === "object" && "key" in key2 && "value" in key2 && key2.value === null)
        pair = new Pair(key2.key, null);
      else
        pair = new Pair(key2, null);
      const prev = findPair(this.items, pair.key);
      if (!prev)
        this.items.push(pair);
    }
    /**
     * If `keepPair` is `true`, returns the Pair matching `key`.
     * Otherwise, returns the value of that Pair's key.
     */
    get(key2, keepPair) {
      const pair = findPair(this.items, key2);
      return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
    }
    set(key2, value) {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = findPair(this.items, key2);
      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new Pair(key2));
      }
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues(true))
        return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
      else
        throw new Error("Set items must all have null values");
    }
    static from(schema4, iterable, ctx) {
      const { replacer } = ctx;
      const set2 = new this(schema4);
      if (iterable && Symbol.iterator in Object(iterable))
        for (let value of iterable) {
          if (typeof replacer === "function")
            value = replacer.call(iterable, value, value);
          set2.items.push(createPair(value, null, ctx));
        }
      return set2;
    }
  };
  YAMLSet.tag = "tag:yaml.org,2002:set";
  var set = {
    collection: "map",
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: "tag:yaml.org,2002:set",
    createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
    resolve(map4, onError) {
      if (isMap(map4)) {
        if (map4.hasAllNullValues(true))
          return Object.assign(new YAMLSet(), map4);
        else
          onError("Set items must all have null values");
      } else
        onError("Expected a mapping for this tag");
      return map4;
    }
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
  function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts.replace(/_/g, "").split(":").reduce((res2, p2) => res2 * num(60) + num(p2), num(0));
    return sign === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node2) {
    let { value } = node2;
    let num = (n) => n;
    if (typeof value === "bigint")
      num = (n) => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber(node2);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = (value - parts[0]) / _60;
      parts.unshift(value % _60);
      if (value >= 60) {
        value = (value - parts[0]) / _60;
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
  }
  var intTime = {
    identify: (value) => typeof value === "bigint" || Number.isInteger(value),
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
  };
  var floatTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: (str) => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
  };
  var timestamp = {
    identify: (value) => value instanceof Date,
    default: true,
    tag: "tag:yaml.org,2002:timestamp",
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
    resolve(str) {
      const match = str.match(timestamp.test);
      if (!match)
        throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
      const [, year, month, day, hour, minute, second] = match.map(Number);
      const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
      const tz = match[8];
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz, false);
        if (Math.abs(d) < 30)
          d *= 60;
        date -= 6e4 * d;
      }
      return new Date(date);
    },
    stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
  };

  // node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
  var schema3 = [
    map3,
    seq,
    string3,
    nullTag,
    trueTag,
    falseTag,
    intBin,
    intOct2,
    int2,
    intHex2,
    floatNaN2,
    floatExp2,
    float2,
    binary,
    merge,
    omap,
    pairs,
    set,
    intTime,
    floatTime,
    timestamp
  ];

  // node_modules/yaml/browser/dist/schema/tags.js
  var schemas = /* @__PURE__ */ new Map([
    ["core", schema],
    ["failsafe", [map3, seq, string3]],
    ["json", schema2],
    ["yaml11", schema3],
    ["yaml-1.1", schema3]
  ]);
  var tagsByName = {
    binary,
    bool: boolTag,
    float,
    floatExp,
    floatNaN,
    floatTime,
    int,
    intHex,
    intOct,
    intTime,
    map: map3,
    merge,
    null: nullTag,
    omap,
    pairs,
    seq,
    set,
    timestamp
  };
  var coreKnownTags = {
    "tag:yaml.org,2002:binary": binary,
    "tag:yaml.org,2002:merge": merge,
    "tag:yaml.org,2002:omap": omap,
    "tag:yaml.org,2002:pairs": pairs,
    "tag:yaml.org,2002:set": set,
    "tag:yaml.org,2002:timestamp": timestamp
  };
  function getTags(customTags, schemaName, addMergeTag) {
    const schemaTags = schemas.get(schemaName);
    if (schemaTags && !customTags) {
      return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
    }
    let tags = schemaTags;
    if (!tags) {
      if (Array.isArray(customTags))
        tags = [];
      else {
        const keys2 = Array.from(schemas.keys()).filter((key2) => key2 !== "yaml11").map((key2) => JSON.stringify(key2)).join(", ");
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys2} or define customTags array`);
      }
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags = tags.concat(tag);
    } else if (typeof customTags === "function") {
      tags = customTags(tags.slice());
    }
    if (addMergeTag)
      tags = tags.concat(merge);
    return tags.reduce((tags2, tag) => {
      const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
      if (!tagObj) {
        const tagName = JSON.stringify(tag);
        const keys2 = Object.keys(tagsByName).map((key2) => JSON.stringify(key2)).join(", ");
        throw new Error(`Unknown custom tag ${tagName}; use one of ${keys2}`);
      }
      if (!tags2.includes(tagObj))
        tags2.push(tagObj);
      return tags2;
    }, []);
  }

  // node_modules/yaml/browser/dist/schema/Schema.js
  var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  var Schema = class _Schema {
    constructor({ compat, customTags, merge: merge3, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
      this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
      this.name = typeof schema4 === "string" && schema4 || "core";
      this.knownTags = resolveKnownTags ? coreKnownTags : {};
      this.tags = getTags(customTags, this.name, merge3);
      this.toStringOptions = toStringDefaults ?? null;
      Object.defineProperty(this, MAP, { value: map3 });
      Object.defineProperty(this, SCALAR, { value: string3 });
      Object.defineProperty(this, SEQ, { value: seq });
      this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
    }
    clone() {
      const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
      copy.tags = this.tags.slice();
      return copy;
    }
  };

  // node_modules/yaml/browser/dist/stringify/stringifyDocument.js
  function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
      const dir = doc.directives.toString(doc);
      if (dir) {
        lines.push(dir);
        hasDirectives = true;
      } else if (doc.directives.docStart)
        hasDirectives = true;
    }
    if (hasDirectives)
      lines.push("---");
    const ctx = createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      const cs = commentString(doc.commentBefore);
      lines.unshift(indentComment(cs, ""));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
      if (isNode(doc.contents)) {
        if (doc.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc.contents.commentBefore) {
          const cs = commentString(doc.contents.commentBefore);
          lines.push(indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc.comment;
        contentComment = doc.contents.comment;
      }
      const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
      let body3 = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body3 += lineComment(body3, "", commentString(contentComment));
      if ((body3[0] === "|" || body3[0] === ">") && lines[lines.length - 1] === "---") {
        lines[lines.length - 1] = `--- ${body3}`;
      } else
        lines.push(body3);
    } else {
      lines.push(stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
      if (doc.comment) {
        const cs = commentString(doc.comment);
        if (cs.includes("\n")) {
          lines.push("...");
          lines.push(indentComment(cs, ""));
        } else {
          lines.push(`... ${cs}`);
        }
      } else {
        lines.push("...");
      }
    } else {
      let dc = doc.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(indentComment(commentString(dc), ""));
      }
    }
    return lines.join("\n") + "\n";
  }

  // node_modules/yaml/browser/dist/doc/Document.js
  var Document = class _Document {
    constructor(value, replacer, options) {
      this.commentBefore = null;
      this.comment = null;
      this.errors = [];
      this.warnings = [];
      Object.defineProperty(this, NODE_TYPE, { value: DOC });
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
        replacer = void 0;
      }
      const opt = Object.assign({
        intAsBigInt: false,
        keepSourceTokens: false,
        logLevel: "warn",
        prettyErrors: true,
        strict: true,
        stringKeys: false,
        uniqueKeys: true,
        version: "1.2"
      }, options);
      this.options = opt;
      let { version } = opt;
      if (options?._directives) {
        this.directives = options._directives.atDocument();
        if (this.directives.yaml.explicit)
          version = this.directives.yaml.version;
      } else
        this.directives = new Directives({ version });
      this.setSchema(version, options);
      this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
      const copy = Object.create(_Document.prototype, {
        [NODE_TYPE]: { value: DOC }
      });
      copy.commentBefore = this.commentBefore;
      copy.comment = this.comment;
      copy.errors = this.errors.slice();
      copy.warnings = this.warnings.slice();
      copy.options = Object.assign({}, this.options);
      if (this.directives)
        copy.directives = this.directives.clone();
      copy.schema = this.schema.clone();
      copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    /** Adds a value to the document. */
    add(value) {
      if (assertCollection(this.contents))
        this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path2, value) {
      if (assertCollection(this.contents))
        this.contents.addIn(path2, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node2, name) {
      if (!node2.anchor) {
        const prev = anchorNames(this);
        node2.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
      }
      return new Alias(node2.anchor);
    }
    createNode(value, replacer, options) {
      let _replacer = void 0;
      if (typeof replacer === "function") {
        value = replacer.call({ "": value }, "", value);
        _replacer = replacer;
      } else if (Array.isArray(replacer)) {
        const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
        const asStr = replacer.filter(keyToStr).map(String);
        if (asStr.length > 0)
          replacer = replacer.concat(asStr);
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
        replacer = void 0;
      }
      const { aliasDuplicateObjects, anchorPrefix, flow: flow3, keepUndefined, onTagObj, tag } = options ?? {};
      const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
        this,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        anchorPrefix || "a"
      );
      const ctx = {
        aliasDuplicateObjects: aliasDuplicateObjects ?? true,
        keepUndefined: keepUndefined ?? false,
        onAnchor,
        onTagObj,
        replacer: _replacer,
        schema: this.schema,
        sourceObjects
      };
      const node2 = createNode(value, tag, ctx);
      if (flow3 && isCollection(node2))
        node2.flow = true;
      setAnchors();
      return node2;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key2, value, options = {}) {
      const k = this.createNode(key2, null, options);
      const v = this.createNode(value, null, options);
      return new Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key2) {
      return assertCollection(this.contents) ? this.contents.delete(key2) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path2) {
      if (isEmptyPath(path2)) {
        if (this.contents == null)
          return false;
        this.contents = null;
        return true;
      }
      return assertCollection(this.contents) ? this.contents.deleteIn(path2) : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key2, keepScalar) {
      return isCollection(this.contents) ? this.contents.get(key2, keepScalar) : void 0;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path2, keepScalar) {
      if (isEmptyPath(path2))
        return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
      return isCollection(this.contents) ? this.contents.getIn(path2, keepScalar) : void 0;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key2) {
      return isCollection(this.contents) ? this.contents.has(key2) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path2) {
      if (isEmptyPath(path2))
        return this.contents !== void 0;
      return isCollection(this.contents) ? this.contents.hasIn(path2) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key2, value) {
      if (this.contents == null) {
        this.contents = collectionFromPath(this.schema, [key2], value);
      } else if (assertCollection(this.contents)) {
        this.contents.set(key2, value);
      }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path2, value) {
      if (isEmptyPath(path2)) {
        this.contents = value;
      } else if (this.contents == null) {
        this.contents = collectionFromPath(this.schema, Array.from(path2), value);
      } else if (assertCollection(this.contents)) {
        this.contents.setIn(path2, value);
      }
    }
    /**
     * Change the YAML version and schema used by the document.
     * A `null` version disables support for directives, explicit tags, anchors, and aliases.
     * It also requires the `schema` option to be given as a `Schema` instance value.
     *
     * Overrides all previously set schema options.
     */
    setSchema(version, options = {}) {
      if (typeof version === "number")
        version = String(version);
      let opt;
      switch (version) {
        case "1.1":
          if (this.directives)
            this.directives.yaml.version = "1.1";
          else
            this.directives = new Directives({ version: "1.1" });
          opt = { resolveKnownTags: false, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives)
            this.directives.yaml.version = version;
          else
            this.directives = new Directives({ version });
          opt = { resolveKnownTags: true, schema: "core" };
          break;
        case null:
          if (this.directives)
            delete this.directives;
          opt = null;
          break;
        default: {
          const sv = JSON.stringify(version);
          throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
        }
      }
      if (options.schema instanceof Object)
        this.schema = options.schema;
      else if (opt)
        this.schema = new Schema(Object.assign(opt, options));
      else
        throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      const ctx = {
        anchors: /* @__PURE__ */ new Map(),
        doc: this,
        keep: !json,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS(this.contents, jsonArg ?? "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res: res2 } of ctx.anchors.values())
          onAnchor(res2, count);
      return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
      return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
        const s = JSON.stringify(options.indent);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      return stringifyDocument(this, options);
    }
  };
  function assertCollection(contents) {
    if (isCollection(contents))
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }

  // node_modules/yaml/browser/dist/errors.js
  var YAMLError = class extends Error {
    constructor(name, pos, code4, message) {
      super();
      this.name = name;
      this.code = code4;
      this.message = message;
      this.pos = pos;
    }
  };
  var YAMLParseError = class extends YAMLError {
    constructor(pos, code4, message) {
      super("YAMLParseError", pos, code4, message);
    }
  };
  var YAMLWarning = class extends YAMLError {
    constructor(pos, code4, message) {
      super("YAMLWarning", pos, code4, message);
    }
  };
  var prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
      return;
    error.linePos = error.pos.map((pos) => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
    if (ci >= 60 && lineStr.length > 80) {
      const trimStart = Math.min(ci - 39, lineStr.length - 79);
      lineStr = "\u2026" + lineStr.substring(trimStart);
      ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
      lineStr = lineStr.substring(0, 79) + "\u2026";
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
      let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
      if (prev.length > 80)
        prev = prev.substring(0, 79) + "\u2026\n";
      lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
      let count = 1;
      const end = error.linePos[1];
      if (end?.line === line && end.col > col) {
        count = Math.max(1, Math.min(end.col - col, 80 - ci));
      }
      const pointer = " ".repeat(ci) + "^".repeat(count);
      error.message += `:

${lineStr}
${pointer}
`;
    }
  };

  // node_modules/yaml/browser/dist/compose/resolve-props.js
  function resolveProps(tokens, { flow: flow3, indicator, next, offset, onError, parentIndent, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment2 = "";
    let commentSep = "";
    let hasNewline = false;
    let reqSpace = false;
    let tab2 = null;
    let anchor = null;
    let tag = null;
    let newlineAfterProp = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = false;
      }
      if (tab2) {
        if (atNewline && token.type !== "comment" && token.type !== "newline") {
          onError(tab2, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        }
        tab2 = null;
      }
      switch (token.type) {
        case "space":
          if (!flow3 && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
            tab2 = token;
          }
          hasSpace = true;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = token.source.substring(1) || " ";
          if (!comment2)
            comment2 = cb;
          else
            comment2 += commentSep + cb;
          commentSep = "";
          atNewline = false;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment2)
              comment2 += token.source;
            else if (!found || indicator !== "seq-item-ind")
              spaceBefore = true;
          } else
            commentSep += token.source;
          atNewline = true;
          hasNewline = true;
          if (anchor || tag)
            newlineAfterProp = token;
          hasSpace = true;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
          anchor = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow3 ?? "collection"}`);
          found = token;
          atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
          hasSpace = false;
          break;
        case "comma":
          if (flow3) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow3}`);
            comma = token;
            atNewline = false;
            hasSpace = false;
            break;
          }
        // else fallthrough
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
          atNewline = false;
          hasSpace = false;
      }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    }
    if (tab2 && (atNewline && tab2.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
      onError(tab2, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma,
      found,
      spaceBefore,
      comment: comment2,
      hasNewline,
      anchor,
      tag,
      newlineAfterProp,
      end,
      start: start ?? end
    };
  }

  // node_modules/yaml/browser/dist/compose/util-contains-newline.js
  function containsNewline(key2) {
    if (!key2)
      return null;
    switch (key2.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key2.source.includes("\n"))
          return true;
        if (key2.end) {
          for (const st of key2.end)
            if (st.type === "newline")
              return true;
        }
        return false;
      case "flow-collection":
        for (const it of key2.items) {
          for (const st of it.start)
            if (st.type === "newline")
              return true;
          if (it.sep) {
            for (const st of it.sep)
              if (st.type === "newline")
                return true;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return true;
        }
        return false;
      default:
        return true;
    }
  }

  // node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
  function flowIndentCheck(indent2, fc, onError) {
    if (fc?.type === "flow-collection") {
      const end = fc.end[0];
      if (end.indent === indent2 && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
        const msg = "Flow end indicator should be more indented than parent";
        onError(end, "BAD_INDENT", msg, true);
      }
    }
  }

  // node_modules/yaml/browser/dist/compose/util-map-includes.js
  function mapIncludes(ctx, items, search2) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
      return false;
    const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
    return items.some((pair) => isEqual(pair.key, search2));
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-map.js
  var startColMsg = "All mapping items must start at the same column";
  function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLMap;
    const map4 = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
      const { start, key: key2, sep, value } = collItem;
      const keyProps = resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key2 ?? sep?.[0],
        offset,
        onError,
        parentIndent: bm.indent,
        startOnNewline: true
      });
      const implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key2) {
          if (key2.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key2 && key2.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep) {
          commentEnd = keyProps.end;
          if (keyProps.comment) {
            if (map4.comment)
              map4.comment += "\n" + keyProps.comment;
            else
              map4.comment = keyProps.comment;
          }
          continue;
        }
        if (keyProps.newlineAfterProp || containsNewline(key2)) {
          onError(key2 ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        }
      } else if (keyProps.found?.indent !== bm.indent) {
        onError(offset, "BAD_INDENT", startColMsg);
      }
      ctx.atKey = true;
      const keyStart = keyProps.end;
      const keyNode = key2 ? composeNode2(ctx, key2, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, key2, onError);
      ctx.atKey = false;
      if (mapIncludes(ctx, map4.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      const valueProps = resolveProps(sep ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: bm.indent,
        startOnNewline: !key2 || key2.type === "block-scalar"
      });
      offset = valueProps.end;
      if (valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
        if (ctx.schema.compat)
          flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map4.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map4.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    map4.range = [bm.offset, offset, commentEnd ?? offset];
    return map4;
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-seq.js
  function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLSeq;
    const seq2 = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
      const props = resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        parentIndent: bs.indent,
        startOnNewline: true
      });
      if (!props.found) {
        if (props.anchor || props.tag || value) {
          if (value?.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        } else {
          commentEnd = props.end;
          if (props.comment)
            seq2.comment = props.comment;
          continue;
        }
      }
      const node2 = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bs.indent, value, onError);
      offset = node2.range[2];
      seq2.items.push(node2);
    }
    seq2.range = [bs.offset, offset, commentEnd ?? offset];
    return seq2;
  }

  // node_modules/yaml/browser/dist/compose/resolve-end.js
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment2 = "";
    if (end) {
      let hasSpace = false;
      let sep = "";
      for (const token of end) {
        const { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = true;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = source.substring(1) || " ";
            if (!comment2)
              comment2 = cb;
            else
              comment2 += sep + cb;
            sep = "";
            break;
          }
          case "newline":
            if (comment2)
              sep += source;
            hasSpace = true;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment: comment2, offset };
  }

  // node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
  var blockMsg = "Block collections are not allowed within flow collections";
  var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
  function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
    const isMap2 = fc.start.source === "{";
    const fcName = isMap2 ? "flow map" : "flow sequence";
    const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
    const coll = new NodeClass(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0; i < fc.items.length; ++i) {
      const collItem = fc.items[i];
      const { start, key: key2, sep, value } = collItem;
      const props = resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key2 ?? sep?.[0],
        offset,
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep && !value) {
          if (i === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment) {
            if (coll.comment)
              coll.comment += "\n" + props.comment;
            else
              coll.comment = props.comment;
          }
          offset = props.end;
          continue;
        }
        if (!isMap2 && ctx.options.strict && containsNewline(key2))
          onError(
            key2,
            // checked by containsNewline()
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys of flow sequence pairs need to be on a single line"
          );
      }
      if (i === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop: for (const st of start) {
            switch (st.type) {
              case "comma":
              case "space":
                break;
              case "comment":
                prevItemComment = st.source.substring(1);
                break loop;
              default:
                break loop;
            }
          }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += "\n" + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap2 && !sep && !props.found) {
        const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
        coll.items.push(valueNode);
        offset = valueNode.range[2];
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        ctx.atKey = true;
        const keyStart = props.end;
        const keyNode = key2 ? composeNode2(ctx, key2, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
        if (isBlock(key2))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        ctx.atKey = false;
        const valueProps = resolveProps(sep ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (valueProps.found) {
          if (!isMap2 && !props.found && ctx.options.strict) {
            if (sep)
              for (const st of sep) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value) {
          if ("source" in value && value.source?.[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        }
        const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += "\n" + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap2) {
          const map4 = coll;
          if (mapIncludes(ctx, map4.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map4.items.push(pair);
        } else {
          const map4 = new YAMLMap(ctx.schema);
          map4.flow = true;
          map4.items.push(pair);
          const endRange = (valueNode ?? keyNode).range;
          map4.range = [keyNode.range[0], endRange[1], endRange[2]];
          coll.items.push(map4);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    const expectedEnd = isMap2 ? "}" : "]";
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce?.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      const name = fcName[0].toUpperCase() + fcName.substring(1);
      const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
      if (ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment) {
        if (coll.comment)
          coll.comment += "\n" + end.comment;
        else
          coll.comment = end.comment;
      }
      coll.range = [fc.offset, cePos, end.offset];
    } else {
      coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
  }

  // node_modules/yaml/browser/dist/compose/compose-collection.js
  function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
    const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
    const Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName) {
      coll.tag = Coll.tagName;
      return coll;
    }
    if (tagName)
      coll.tag = tagName;
    return coll;
  }
  function composeCollection(CN2, ctx, token, props, onError) {
    const tagToken = props.tag;
    const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (token.type === "block-seq") {
      const { anchor, newlineAfterProp: nl } = props;
      const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
      if (lastProp && (!nl || nl.offset < lastProp.offset)) {
        const message = "Missing newline after block sequence props";
        onError(lastProp, "MISSING_CHAR", message);
      }
    }
    const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
    if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
    if (!tag) {
      const kt = ctx.schema.knownTags[tagName];
      if (kt?.collection === expType) {
        ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
        tag = kt;
      } else {
        if (kt) {
          onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
        } else {
          onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
        }
        return resolveCollection(CN2, ctx, token, onError, tagName);
      }
    }
    const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
    const node2 = isNode(res) ? res : new Scalar(res);
    node2.range = coll.range;
    node2.tag = tagName;
    if (tag?.format)
      node2.format = tag.format;
    return node2;
  }

  // node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
  function resolveBlockScalar(ctx, scalar, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
      const content3 = lines[i][1];
      if (content3 === "" || content3 === "\r")
        chompStart = i;
      else
        break;
    }
    if (chompStart === 0) {
      const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
      let end2 = start + header.length;
      if (scalar.source)
        end2 += scalar.source.length;
      return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
    }
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
      const [indent2, content3] = lines[i];
      if (content3 === "" || content3 === "\r") {
        if (header.indent === 0 && indent2.length > trimIndent)
          trimIndent = indent2.length;
      } else {
        if (indent2.length < trimIndent) {
          const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
          onError(offset + indent2.length, "MISSING_CHAR", message);
        }
        if (header.indent === 0)
          trimIndent = indent2.length;
        contentStart = i;
        if (trimIndent === 0 && !ctx.atRoot) {
          const message = "Block scalar values in collections must be indented";
          onError(offset, "BAD_INDENT", message);
        }
        break;
      }
      offset += indent2.length + content3.length + 1;
    }
    for (let i = lines.length - 1; i >= chompStart; --i) {
      if (lines[i][0].length > trimIndent)
        chompStart = i + 1;
    }
    let value = "";
    let sep = "";
    let prevMoreIndented = false;
    for (let i = 0; i < contentStart; ++i)
      value += lines[i][0].slice(trimIndent) + "\n";
    for (let i = contentStart; i < chompStart; ++i) {
      let [indent2, content3] = lines[i];
      offset += indent2.length + content3.length + 1;
      const crlf = content3[content3.length - 1] === "\r";
      if (crlf)
        content3 = content3.slice(0, -1);
      if (content3 && indent2.length < trimIndent) {
        const src = header.indent ? "explicit indentation indicator" : "first line";
        const message = `Block scalar lines must not be less indented than their ${src}`;
        onError(offset - content3.length - (crlf ? 2 : 1), "BAD_INDENT", message);
        indent2 = "";
      }
      if (type === Scalar.BLOCK_LITERAL) {
        value += sep + indent2.slice(trimIndent) + content3;
        sep = "\n";
      } else if (indent2.length > trimIndent || content3[0] === "	") {
        if (sep === " ")
          sep = "\n";
        else if (!prevMoreIndented && sep === "\n")
          sep = "\n\n";
        value += sep + indent2.slice(trimIndent) + content3;
        sep = "\n";
        prevMoreIndented = true;
      } else if (content3 === "") {
        if (sep === "\n")
          value += "\n";
        else
          sep = "\n";
      } else {
        value += sep + content3;
        sep = " ";
        prevMoreIndented = false;
      }
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i = chompStart; i < lines.length; ++i)
          value += "\n" + lines[i][0].slice(trimIndent);
        if (value[value.length - 1] !== "\n")
          value += "\n";
        break;
      default:
        value += "\n";
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header") {
      onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
      return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent2 = 0;
    let chomp = "";
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
      const ch = source[i];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        const n = Number(ch);
        if (!indent2 && n)
          indent2 = n;
        else if (error === -1)
          error = offset + i;
      }
    }
    if (error !== -1)
      onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment2 = "";
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
      const token = props[i];
      switch (token.type) {
        case "space":
          hasSpace = true;
        // fallthrough
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace) {
            const message = "Comments must be separated from other tokens by white space characters";
            onError(token, "MISSING_CHAR", message);
          }
          length += token.source.length;
          comment2 = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message);
          length += token.source.length;
          break;
        /* istanbul ignore next should not happen */
        default: {
          const message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          const ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent: indent2, chomp, comment: comment2, length };
  }
  function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
      lines.push([split[i], split[i + 1]]);
    return lines;
  }

  // node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
  function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code4, msg) => onError(offset + rel, code4, msg);
    switch (type) {
      case "scalar":
        _type = Scalar.PLAIN;
        value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type = Scalar.QUOTE_SINGLE;
        value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type = Scalar.QUOTE_DOUBLE;
        value = doubleQuotedValue(source, _onError);
        break;
      /* istanbul ignore next should not happen */
      default:
        onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
        return {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    const valueEnd = offset + source.length;
    const re2 = resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type,
      comment: re2.comment,
      range: [offset, valueEnd, re2.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      /* istanbul ignore next should not happen */
      case "	":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return foldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function foldLines(source) {
    let first, line;
    try {
      first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
      line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
    } catch {
      first = /(.*?)[ \t]*\r?\n/sy;
      line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
      return source;
    let res = match[1];
    let sep = " ";
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while (match = line.exec(source)) {
      if (match[1] === "") {
        if (sep === "\n")
          res += sep;
        else
          sep = "\n";
      } else {
        res += sep + match[1];
        sep = " ";
      }
      pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i = 1; i < source.length - 1; ++i) {
      const ch = source[i];
      if (ch === "\r" && source[i + 1] === "\n")
        continue;
      if (ch === "\n") {
        const { fold, offset } = foldNewline(source, i);
        res += fold;
        i = offset;
      } else if (ch === "\\") {
        let next = source[++i];
        const cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === "\n") {
          next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "\r" && source[i + 1] === "\n") {
          next = source[++i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          const length = next === "x" ? 2 : next === "u" ? 4 : 8;
          res += parseCharCode(source, i + 1, length, onError);
          i += length;
        } else {
          const raw2 = source.substr(i - 1, 2);
          onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw2}`);
          res += raw2;
        }
      } else if (ch === " " || ch === "	") {
        const wsStart = i;
        let next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
        if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
          res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
      } else {
        res += ch;
      }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "";
    let ch = source[offset + 1];
    while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== "\n")
        break;
      if (ch === "\n")
        fold += "\n";
      offset += 1;
      ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  var escapeCodes = {
    "0": "\0",
    // null character
    a: "\x07",
    // bell character
    b: "\b",
    // backspace
    e: "\x1B",
    // escape character
    f: "\f",
    // form feed
    n: "\n",
    // line feed
    r: "\r",
    // carriage return
    t: "	",
    // horizontal tab
    v: "\v",
    // vertical tab
    N: "\x85",
    // Unicode next line
    _: "\xA0",
    // Unicode non-breaking space
    L: "\u2028",
    // Unicode line separator
    P: "\u2029",
    // Unicode paragraph separator
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "	": "	"
  };
  function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok3 = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code4 = ok3 ? parseInt(cc, 16) : NaN;
    try {
      return String.fromCodePoint(code4);
    } catch {
      const raw2 = source.substr(offset - 2, length + 2);
      onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw2}`);
      return raw2;
    }
  }

  // node_modules/yaml/browser/dist/compose/compose-scalar.js
  function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment: comment2, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
    let tag;
    if (ctx.options.stringKeys && ctx.atKey) {
      tag = ctx.schema[SCALAR];
    } else if (tagName)
      tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
    else if (token.type === "scalar")
      tag = findScalarTagByTest(ctx, value, token, onError);
    else
      tag = ctx.schema[SCALAR];
    let scalar;
    try {
      const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = isScalar(res) ? res : new Scalar(res);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
      scalar = new Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment2)
      scalar.comment = comment2;
    return scalar;
  }
  function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema4[SCALAR];
    const matchWithTest = [];
    for (const tag of schema4.tags) {
      if (!tag.collection && tag.tag === tagName) {
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
      }
    }
    for (const tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    const kt = schema4.knownTags[tagName];
    if (kt && !kt.collection) {
      schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
      return kt;
    }
    onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
    return schema4[SCALAR];
  }
  function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
    const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
    if (schema4.compat) {
      const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
      if (tag.tag !== compat.tag) {
        const ts = directives.tagString(tag.tag);
        const cs = directives.tagString(compat.tag);
        const msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, true);
      }
    }
    return tag;
  }

  // node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      pos ?? (pos = before.length);
      for (let i = pos - 1; i >= 0; --i) {
        let st = before[i];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i];
        while (st?.type === "space") {
          offset += st.source.length;
          st = before[++i];
        }
        break;
      }
    }
    return offset;
  }

  // node_modules/yaml/browser/dist/compose/compose-node.js
  var CN = { composeNode, composeEmptyNode };
  function composeNode(ctx, token, props, onError) {
    const atKey = ctx.atKey;
    const { spaceBefore, comment: comment2, anchor, tag } = props;
    let node2;
    let isSrcToken = true;
    switch (token.type) {
      case "alias":
        node2 = composeAlias(ctx, token, onError);
        if (anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        node2 = composeScalar(ctx, token, tag, onError);
        if (anchor)
          node2.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          node2 = composeCollection(CN, ctx, token, props, onError);
          if (anchor)
            node2.anchor = anchor.source.substring(1);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          onError(token, "RESOURCE_EXHAUSTION", message);
        }
        break;
      default: {
        const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message);
        isSrcToken = false;
      }
    }
    node2 ?? (node2 = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
    if (anchor && node2.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (atKey && ctx.options.stringKeys && (!isScalar(node2) || typeof node2.value !== "string" || node2.tag && node2.tag !== "tag:yaml.org,2002:str")) {
      const msg = "With stringKeys, all keys must be strings";
      onError(tag ?? token, "NON_STRING_KEY", msg);
    }
    if (spaceBefore)
      node2.spaceBefore = true;
    if (comment2) {
      if (token.type === "scalar" && token.source === "")
        node2.comment = comment2;
      else
        node2.commentBefore = comment2;
    }
    if (ctx.options.keepSourceTokens && isSrcToken)
      node2.srcToken = token;
    return node2;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment: comment2, anchor, tag, end }, onError) {
    const token = {
      type: "scalar",
      offset: emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    };
    const node2 = composeScalar(ctx, token, tag, onError);
    if (anchor) {
      node2.anchor = anchor.source.substring(1);
      if (node2.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node2.spaceBefore = true;
    if (comment2) {
      node2.comment = comment2;
      node2.range[2] = end;
    }
    return node2;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
    const valueEnd = offset + source.length;
    const re2 = resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re2.offset];
    if (re2.comment)
      alias.comment = re2.comment;
    return alias;
  }

  // node_modules/yaml/browser/dist/compose/compose-doc.js
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document(void 0, opts);
    const ctx = {
      atKey: false,
      atRoot: true,
      directives: doc.directives,
      options: doc.options,
      schema: doc.schema
    };
    const props = resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      parentIndent: 0,
      startOnNewline: true
    });
    if (props.found) {
      doc.directives.docStart = true;
      if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re2 = resolveEnd(end, contentEnd, false, onError);
    if (re2.comment)
      doc.comment = re2.comment;
    doc.range = [offset, contentEnd, re2.offset];
    return doc;
  }

  // node_modules/yaml/browser/dist/compose/composer.js
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment2 = "";
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
      const source = prelude[i];
      switch (source[0]) {
        case "#":
          comment2 += (comment2 === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
          atComment = true;
          afterEmptyLine = false;
          break;
        case "%":
          if (prelude[i + 1]?.[0] !== "#")
            i += 1;
          atComment = false;
          break;
        default:
          if (!atComment)
            afterEmptyLine = true;
          atComment = false;
      }
    }
    return { comment: comment2, afterEmptyLine };
  }
  var Composer = class {
    constructor(options = {}) {
      this.doc = null;
      this.atDirectives = false;
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
      this.onError = (source, code4, message, warning) => {
        const pos = getErrorPos(source);
        if (warning)
          this.warnings.push(new YAMLWarning(pos, code4, message));
        else
          this.errors.push(new YAMLParseError(pos, code4, message));
      };
      this.directives = new Directives({ version: options.version || "1.2" });
      this.options = options;
    }
    decorate(doc, afterDoc) {
      const { comment: comment2, afterEmptyLine } = parsePrelude(this.prelude);
      if (comment2) {
        const dc = doc.contents;
        if (afterDoc) {
          doc.comment = doc.comment ? `${doc.comment}
${comment2}` : comment2;
        } else if (afterEmptyLine || doc.directives.docStart || !dc) {
          doc.commentBefore = comment2;
        } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
          let it = dc.items[0];
          if (isPair(it))
            it = it.key;
          const cb = it.commentBefore;
          it.commentBefore = cb ? `${comment2}
${cb}` : comment2;
        } else {
          const cb = dc.commentBefore;
          dc.commentBefore = cb ? `${comment2}
${cb}` : comment2;
        }
      }
      if (afterDoc) {
        for (let i = 0; i < this.errors.length; ++i)
          doc.errors.push(this.errors[i]);
        for (let i = 0; i < this.warnings.length; ++i)
          doc.warnings.push(this.warnings[i]);
      } else {
        doc.errors = this.errors;
        doc.warnings = this.warnings;
      }
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
    }
    /**
     * Current stream status information.
     *
     * Mostly useful at the end of input for an empty stream.
     */
    streamInfo() {
      return {
        comment: parsePrelude(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      };
    }
    /**
     * Compose tokens into documents.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *compose(tokens, forceDoc = false, endOffset = -1) {
      for (const token of tokens)
        yield* this.next(token);
      yield* this.end(forceDoc, endOffset);
    }
    /** Advance the composer by one CST token. */
    *next(token) {
      switch (token.type) {
        case "directive":
          this.directives.add(token.source, (offset, message, warning) => {
            const pos = getErrorPos(token);
            pos[0] += offset;
            this.onError(pos, "BAD_DIRECTIVE", message, warning);
          });
          this.prelude.push(token.source);
          this.atDirectives = true;
          break;
        case "document": {
          const doc = composeDoc(this.options, this.directives, token, this.onError);
          if (this.atDirectives && !doc.directives.docStart)
            this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          this.decorate(doc, false);
          if (this.doc)
            yield this.doc;
          this.doc = doc;
          this.atDirectives = false;
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(token.source);
          break;
        case "error": {
          const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
          const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
          if (this.atDirectives || !this.doc)
            this.errors.push(error);
          else
            this.doc.errors.push(error);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            const msg = "Unexpected doc-end without preceding document";
            this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
            break;
          }
          this.doc.directives.docEnd = true;
          const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
          this.decorate(this.doc, true);
          if (end.comment) {
            const dc = this.doc.comment;
            this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
          }
          this.doc.range[2] = end.offset;
          break;
        }
        default:
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
      }
    }
    /**
     * Call at end of input to yield any remaining document.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *end(forceDoc = false, endOffset = -1) {
      if (this.doc) {
        this.decorate(this.doc, true);
        yield this.doc;
        this.doc = null;
      } else if (forceDoc) {
        const opts = Object.assign({ _directives: this.directives }, this.options);
        const doc = new Document(void 0, opts);
        if (this.atDirectives)
          this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
        doc.range = [0, endOffset, endOffset];
        this.decorate(doc, false);
        yield doc;
      }
    }
  };

  // node_modules/yaml/browser/dist/parse/cst-visit.js
  var BREAK2 = /* @__PURE__ */ Symbol("break visit");
  var SKIP3 = /* @__PURE__ */ Symbol("skip children");
  var REMOVE2 = /* @__PURE__ */ Symbol("remove item");
  function visit3(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  visit3.BREAK = BREAK2;
  visit3.SKIP = SKIP3;
  visit3.REMOVE = REMOVE2;
  visit3.itemAtPath = (cst, path2) => {
    let item = cst;
    for (const [field, index2] of path2) {
      const tok = item?.[field];
      if (tok && "items" in tok) {
        item = tok.items[index2];
      } else
        return void 0;
    }
    return item;
  };
  visit3.parentCollection = (cst, path2) => {
    const parent = visit3.itemAtPath(cst, path2.slice(0, -1));
    const field = path2[path2.length - 1][0];
    const coll = parent?.[field];
    if (coll && "items" in coll)
      return coll;
    throw new Error("Parent collection not found");
  };
  function _visit(path2, item, visitor) {
    let ctrl = visitor(item, path2);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (const field of ["key", "value"]) {
      const token = item[field];
      if (token && "items" in token) {
        for (let i = 0; i < token.items.length; ++i) {
          const ci = _visit(Object.freeze(path2.concat([[field, i]])), token.items[i], visitor);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK2)
            return BREAK2;
          else if (ci === REMOVE2) {
            token.items.splice(i, 1);
            i -= 1;
          }
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path2);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path2) : ctrl;
  }

  // node_modules/yaml/browser/dist/parse/cst.js
  var BOM = "\uFEFF";
  var DOCUMENT = "";
  var FLOW_END = "";
  var SCALAR2 = "";
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR2:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case "\n":
      case "\r\n":
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "	":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }

  // node_modules/yaml/browser/dist/parse/lexer.js
  function isEmpty(ch) {
    switch (ch) {
      case void 0:
      case " ":
      case "\n":
      case "\r":
      case "	":
        return true;
      default:
        return false;
    }
  }
  var hexDigits = new Set("0123456789ABCDEFabcdef");
  var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
  var flowIndicatorChars = new Set(",[]{}");
  var invalidAnchorChars = new Set(" ,[]{}\n\r	");
  var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
  var Lexer = class {
    constructor() {
      this.atEnd = false;
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      this.buffer = "";
      this.flowKey = false;
      this.flowLevel = 0;
      this.indentNext = 0;
      this.indentValue = 0;
      this.lineEndPos = null;
      this.next = null;
      this.pos = 0;
    }
    /**
     * Generate YAML tokens from the `source` string. If `incomplete`,
     * a part of the last line may be left as a buffer for the next call.
     *
     * @returns A generator of lexical tokens
     */
    *lex(source, incomplete = false) {
      if (source) {
        if (typeof source !== "string")
          throw TypeError("source is not a string");
        this.buffer = this.buffer ? this.buffer + source : source;
        this.lineEndPos = null;
      }
      this.atEnd = !incomplete;
      let next = this.next ?? "stream";
      while (next && (incomplete || this.hasChars(1)))
        next = yield* this.parseNext(next);
    }
    atLineEnd() {
      let i = this.pos;
      let ch = this.buffer[i];
      while (ch === " " || ch === "	")
        ch = this.buffer[++i];
      if (!ch || ch === "#" || ch === "\n")
        return true;
      if (ch === "\r")
        return this.buffer[i + 1] === "\n";
      return false;
    }
    charAt(n) {
      return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
      let ch = this.buffer[offset];
      if (this.indentNext > 0) {
        let indent2 = 0;
        while (ch === " ")
          ch = this.buffer[++indent2 + offset];
        if (ch === "\r") {
          const next = this.buffer[indent2 + offset + 1];
          if (next === "\n" || !next && !this.atEnd)
            return offset + indent2 + 1;
        }
        return ch === "\n" || indent2 >= this.indentNext || !ch && !this.atEnd ? offset + indent2 : -1;
      }
      if (ch === "-" || ch === ".") {
        const dt2 = this.buffer.substr(offset, 3);
        if ((dt2 === "---" || dt2 === "...") && isEmpty(this.buffer[offset + 3]))
          return -1;
      }
      return offset;
    }
    getLine() {
      let end = this.lineEndPos;
      if (typeof end !== "number" || end !== -1 && end < this.pos) {
        end = this.buffer.indexOf("\n", this.pos);
        this.lineEndPos = end;
      }
      if (end === -1)
        return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[end - 1] === "\r")
        end -= 1;
      return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
      return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
      this.buffer = this.buffer.substring(this.pos);
      this.pos = 0;
      this.lineEndPos = null;
      this.next = state;
      return null;
    }
    peek(n) {
      return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
      switch (next) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let line = this.getLine();
      if (line === null)
        return this.setNext("stream");
      if (line[0] === BOM) {
        yield* this.pushCount(1);
        line = line.substring(1);
      }
      if (line[0] === "%") {
        let dirEnd = line.length;
        let cs = line.indexOf("#");
        while (cs !== -1) {
          const ch = line[cs - 1];
          if (ch === " " || ch === "	") {
            dirEnd = cs - 1;
            break;
          } else {
            cs = line.indexOf("#", cs + 1);
          }
        }
        while (true) {
          const ch = line[dirEnd - 1];
          if (ch === " " || ch === "	")
            dirEnd -= 1;
          else
            break;
        }
        const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
        yield* this.pushCount(line.length - n);
        this.pushNewline();
        return "stream";
      }
      if (this.atLineEnd()) {
        const sp = yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - sp);
        yield* this.pushNewline();
        return "stream";
      }
      yield DOCUMENT;
      return yield* this.parseLineStart();
    }
    *parseLineStart() {
      const ch = this.charAt(0);
      if (!ch && !this.atEnd)
        return this.setNext("line-start");
      if (ch === "-" || ch === ".") {
        if (!this.atEnd && !this.hasChars(4))
          return this.setNext("line-start");
        const s = this.peek(3);
        if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
          yield* this.pushCount(3);
          this.indentValue = 0;
          this.indentNext = 0;
          return s === "---" ? "doc" : "stream";
        }
      }
      this.indentValue = yield* this.pushSpaces(false);
      if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      const [ch0, ch1] = this.peek(2);
      if (!ch1 && !this.atEnd)
        return this.setNext("block-start");
      if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
        const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
        this.indentNext = this.indentValue + 1;
        this.indentValue += n;
        return "block-start";
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(true);
      const line = this.getLine();
      if (line === null)
        return this.setNext("doc");
      let n = yield* this.pushIndicators();
      switch (line[n]) {
        case "#":
          yield* this.pushCount(line.length - n);
        // fallthrough
        case void 0:
          yield* this.pushNewline();
          return yield* this.parseLineStart();
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel = 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          return "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          n += yield* this.parseBlockScalarHeader();
          n += yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - n);
          yield* this.pushNewline();
          return yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let nl, sp;
      let indent2 = -1;
      do {
        nl = yield* this.pushNewline();
        if (nl > 0) {
          sp = yield* this.pushSpaces(false);
          this.indentValue = indent2 = sp;
        } else {
          sp = 0;
        }
        sp += yield* this.pushSpaces(true);
      } while (nl + sp > 0);
      const line = this.getLine();
      if (line === null)
        return this.setNext("flow");
      if (indent2 !== -1 && indent2 < this.indentNext && line[0] !== "#" || indent2 === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
        const atFlowEndMarker = indent2 === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
        if (!atFlowEndMarker) {
          this.flowLevel = 0;
          yield FLOW_END;
          return yield* this.parseLineStart();
        }
      }
      let n = 0;
      while (line[n] === ",") {
        n += yield* this.pushCount(1);
        n += yield* this.pushSpaces(true);
        this.flowKey = false;
      }
      n += yield* this.pushIndicators();
      switch (line[n]) {
        case void 0:
          return "flow";
        case "#":
          yield* this.pushCount(line.length - n);
          return "flow";
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel += 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          this.flowKey = true;
          this.flowLevel -= 1;
          return this.flowLevel ? "flow" : "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "flow";
        case '"':
        case "'":
          this.flowKey = true;
          return yield* this.parseQuotedScalar();
        case ":": {
          const next = this.charAt(1);
          if (this.flowKey || isEmpty(next) || next === ",") {
            this.flowKey = false;
            yield* this.pushCount(1);
            yield* this.pushSpaces(true);
            return "flow";
          }
        }
        // fallthrough
        default:
          this.flowKey = false;
          return yield* this.parsePlainScalar();
      }
    }
    *parseQuotedScalar() {
      const quote = this.charAt(0);
      let end = this.buffer.indexOf(quote, this.pos + 1);
      if (quote === "'") {
        while (end !== -1 && this.buffer[end + 1] === "'")
          end = this.buffer.indexOf("'", end + 2);
      } else {
        while (end !== -1) {
          let n = 0;
          while (this.buffer[end - 1 - n] === "\\")
            n += 1;
          if (n % 2 === 0)
            break;
          end = this.buffer.indexOf('"', end + 1);
        }
      }
      const qb = this.buffer.substring(0, end);
      let nl = qb.indexOf("\n", this.pos);
      if (nl !== -1) {
        while (nl !== -1) {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = qb.indexOf("\n", cs);
        }
        if (nl !== -1) {
          end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
        }
      }
      if (end === -1) {
        if (!this.atEnd)
          return this.setNext("quoted-scalar");
        end = this.buffer.length;
      }
      yield* this.pushToIndex(end + 1, false);
      return this.flowLevel ? "flow" : "doc";
    }
    *parseBlockScalarHeader() {
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      let i = this.pos;
      while (true) {
        const ch = this.buffer[++i];
        if (ch === "+")
          this.blockScalarKeep = true;
        else if (ch > "0" && ch <= "9")
          this.blockScalarIndent = Number(ch) - 1;
        else if (ch !== "-")
          break;
      }
      return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
    }
    *parseBlockScalar() {
      let nl = this.pos - 1;
      let indent2 = 0;
      let ch;
      loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
        switch (ch) {
          case " ":
            indent2 += 1;
            break;
          case "\n":
            nl = i2;
            indent2 = 0;
            break;
          case "\r": {
            const next = this.buffer[i2 + 1];
            if (!next && !this.atEnd)
              return this.setNext("block-scalar");
            if (next === "\n")
              break;
          }
          // fallthrough
          default:
            break loop;
        }
      }
      if (!ch && !this.atEnd)
        return this.setNext("block-scalar");
      if (indent2 >= this.indentNext) {
        if (this.blockScalarIndent === -1)
          this.indentNext = indent2;
        else {
          this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
        }
        do {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = this.buffer.indexOf("\n", cs);
        } while (nl !== -1);
        if (nl === -1) {
          if (!this.atEnd)
            return this.setNext("block-scalar");
          nl = this.buffer.length;
        }
      }
      let i = nl + 1;
      ch = this.buffer[i];
      while (ch === " ")
        ch = this.buffer[++i];
      if (ch === "	") {
        while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
          ch = this.buffer[++i];
        nl = i - 1;
      } else if (!this.blockScalarKeep) {
        do {
          let i2 = nl - 1;
          let ch2 = this.buffer[i2];
          if (ch2 === "\r")
            ch2 = this.buffer[--i2];
          const lastChar = i2;
          while (ch2 === " ")
            ch2 = this.buffer[--i2];
          if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent2 > lastChar)
            nl = i2;
          else
            break;
        } while (true);
      }
      yield SCALAR2;
      yield* this.pushToIndex(nl + 1, true);
      return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
      const inFlow = this.flowLevel > 0;
      let end = this.pos - 1;
      let i = this.pos - 1;
      let ch;
      while (ch = this.buffer[++i]) {
        if (ch === ":") {
          const next = this.buffer[i + 1];
          if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
            break;
          end = i;
        } else if (isEmpty(ch)) {
          let next = this.buffer[i + 1];
          if (ch === "\r") {
            if (next === "\n") {
              i += 1;
              ch = "\n";
              next = this.buffer[i + 1];
            } else
              end = i;
          }
          if (next === "#" || inFlow && flowIndicatorChars.has(next))
            break;
          if (ch === "\n") {
            const cs = this.continueScalar(i + 1);
            if (cs === -1)
              break;
            i = Math.max(i, cs - 2);
          }
        } else {
          if (inFlow && flowIndicatorChars.has(ch))
            break;
          end = i;
        }
      }
      if (!ch && !this.atEnd)
        return this.setNext("plain-scalar");
      yield SCALAR2;
      yield* this.pushToIndex(end + 1, true);
      return inFlow ? "flow" : "doc";
    }
    *pushCount(n) {
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos += n;
        return n;
      }
      return 0;
    }
    *pushToIndex(i, allowEmpty) {
      const s = this.buffer.slice(this.pos, i);
      if (s) {
        yield s;
        this.pos += s.length;
        return s.length;
      } else if (allowEmpty)
        yield "";
      return 0;
    }
    *pushIndicators() {
      let n = 0;
      loop: while (true) {
        switch (this.charAt(0)) {
          case "!":
            n += yield* this.pushTag();
            n += yield* this.pushSpaces(true);
            continue loop;
          case "&":
            n += yield* this.pushUntil(isNotAnchorChar);
            n += yield* this.pushSpaces(true);
            continue loop;
          case "-":
          // this is an error
          case "?":
          // this is an error outside flow collections
          case ":": {
            const inFlow = this.flowLevel > 0;
            const ch1 = this.charAt(1);
            if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
              if (!inFlow)
                this.indentNext = this.indentValue + 1;
              else if (this.flowKey)
                this.flowKey = false;
              n += yield* this.pushCount(1);
              n += yield* this.pushSpaces(true);
              continue loop;
            }
          }
        }
        break loop;
      }
      return n;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let i = this.pos + 2;
        let ch = this.buffer[i];
        while (!isEmpty(ch) && ch !== ">")
          ch = this.buffer[++i];
        return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
      } else {
        let i = this.pos + 1;
        let ch = this.buffer[i];
        while (ch) {
          if (tagChars.has(ch))
            ch = this.buffer[++i];
          else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
            ch = this.buffer[i += 3];
          } else
            break;
        }
        return yield* this.pushToIndex(i, false);
      }
    }
    *pushNewline() {
      const ch = this.buffer[this.pos];
      if (ch === "\n")
        return yield* this.pushCount(1);
      else if (ch === "\r" && this.charAt(1) === "\n")
        return yield* this.pushCount(2);
      else
        return 0;
    }
    *pushSpaces(allowTabs) {
      let i = this.pos - 1;
      let ch;
      do {
        ch = this.buffer[++i];
      } while (ch === " " || allowTabs && ch === "	");
      const n = i - this.pos;
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos = i;
      }
      return n;
    }
    *pushUntil(test) {
      let i = this.pos;
      let ch = this.buffer[i];
      while (!test(ch))
        ch = this.buffer[++i];
      return yield* this.pushToIndex(i, false);
    }
  };

  // node_modules/yaml/browser/dist/parse/line-counter.js
  var LineCounter = class {
    constructor() {
      this.lineStarts = [];
      this.addNewLine = (offset) => this.lineStarts.push(offset);
      this.linePos = (offset) => {
        let low = 0;
        let high = this.lineStarts.length;
        while (low < high) {
          const mid = low + high >> 1;
          if (this.lineStarts[mid] < offset)
            low = mid + 1;
          else
            high = mid;
        }
        if (this.lineStarts[low] === offset)
          return { line: low + 1, col: 1 };
        if (low === 0)
          return { line: 0, col: offset };
        const start = this.lineStarts[low - 1];
        return { line: low, col: offset - start + 1 };
      };
    }
  };

  // node_modules/yaml/browser/dist/parse/parser.js
  function includesToken(list4, type) {
    for (let i = 0; i < list4.length; ++i)
      if (list4[i].type === type)
        return true;
    return false;
  }
  function findNonEmptyIndex(list4) {
    for (let i = 0; i < list4.length; ++i) {
      switch (list4[i].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i;
      }
    }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return true;
      default:
        return false;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        const it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      /* istanbul ignore next should not happen */
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i = prev.length;
    loop: while (--i >= 0) {
      switch (prev[i].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break loop;
      }
    }
    while (prev[++i]?.type === "space") {
    }
    return prev.splice(i, prev.length);
  }
  function arrayPushArray(target, source) {
    if (source.length < 1e5)
      Array.prototype.push.apply(target, source);
    else
      for (let i = 0; i < source.length; ++i)
        target.push(source[i]);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (const it of fc.items) {
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          delete it.key;
          if (isFlowToken(it.value)) {
            if (it.value.end)
              arrayPushArray(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          } else
            arrayPushArray(it.start, it.sep);
          delete it.sep;
        }
      }
    }
  }
  var Parser = class {
    /**
     * @param onNewLine - If defined, called separately with the start position of
     *   each new line (in `parse()`, including the start of input).
     */
    constructor(onNewLine) {
      this.atNewLine = true;
      this.atScalar = false;
      this.indent = 0;
      this.offset = 0;
      this.onKeyLine = false;
      this.stack = [];
      this.source = "";
      this.type = "";
      this.lexer = new Lexer();
      this.onNewLine = onNewLine;
    }
    /**
     * Parse `source` as a YAML stream.
     * If `incomplete`, a part of the last line may be left as a buffer for the next call.
     *
     * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
     *
     * @returns A generator of tokens representing each directive, document, and other structure.
     */
    *parse(source, incomplete = false) {
      if (this.onNewLine && this.offset === 0)
        this.onNewLine(0);
      for (const lexeme of this.lexer.lex(source, incomplete))
        yield* this.next(lexeme);
      if (!incomplete)
        yield* this.end();
    }
    /**
     * Advance the parser by the `source` of one lexical token.
     */
    *next(source) {
      this.source = source;
      if (this.atScalar) {
        this.atScalar = false;
        yield* this.step();
        this.offset += source.length;
        return;
      }
      const type = tokenType(source);
      if (!type) {
        const message = `Not a YAML token: ${source}`;
        yield* this.pop({ type: "error", offset: this.offset, message, source });
        this.offset += source.length;
      } else if (type === "scalar") {
        this.atNewLine = false;
        this.atScalar = true;
        this.type = "scalar";
      } else {
        this.type = type;
        yield* this.step();
        switch (type) {
          case "newline":
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine)
              this.onNewLine(this.offset + source.length);
            break;
          case "space":
            if (this.atNewLine && source[0] === " ")
              this.indent += source.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine)
              this.indent += source.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = false;
        }
        this.offset += source.length;
      }
    }
    /** Call at end of input to push out any remaining constructions */
    *end() {
      while (this.stack.length > 0)
        yield* this.pop();
    }
    get sourceToken() {
      const st = {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
      return st;
    }
    *step() {
      const top = this.peek(1);
      if (this.type === "doc-end" && top?.type !== "doc-end") {
        while (this.stack.length > 0)
          yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source
        });
        return;
      }
      if (!top)
        return yield* this.stream();
      switch (top.type) {
        case "document":
          return yield* this.document(top);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(top);
        case "block-scalar":
          return yield* this.blockScalar(top);
        case "block-map":
          return yield* this.blockMap(top);
        case "block-seq":
          return yield* this.blockSequence(top);
        case "flow-collection":
          return yield* this.flowCollection(top);
        case "doc-end":
          return yield* this.documentEnd(top);
      }
      yield* this.pop();
    }
    peek(n) {
      return this.stack[this.stack.length - n];
    }
    *pop(error) {
      const token = error ?? this.stack.pop();
      if (!token) {
        const message = "Tried to pop an empty stack";
        yield { type: "error", offset: this.offset, source: "", message };
      } else if (this.stack.length === 0) {
        yield token;
      } else {
        const top = this.peek(1);
        if (token.type === "block-scalar") {
          token.indent = "indent" in top ? top.indent : 0;
        } else if (token.type === "flow-collection" && top.type === "document") {
          token.indent = 0;
        }
        if (token.type === "flow-collection")
          fixFlowSeqItems(token);
        switch (top.type) {
          case "document":
            top.value = token;
            break;
          case "block-scalar":
            top.props.push(token);
            break;
          case "block-map": {
            const it = top.items[top.items.length - 1];
            if (it.value) {
              top.items.push({ start: [], key: token, sep: [] });
              this.onKeyLine = true;
              return;
            } else if (it.sep) {
              it.value = token;
            } else {
              Object.assign(it, { key: token, sep: [] });
              this.onKeyLine = !it.explicitKey;
              return;
            }
            break;
          }
          case "block-seq": {
            const it = top.items[top.items.length - 1];
            if (it.value)
              top.items.push({ start: [], value: token });
            else
              it.value = token;
            break;
          }
          case "flow-collection": {
            const it = top.items[top.items.length - 1];
            if (!it || it.value)
              top.items.push({ start: [], key: token, sep: [] });
            else if (it.sep)
              it.value = token;
            else
              Object.assign(it, { key: token, sep: [] });
            return;
          }
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.pop(token);
        }
        if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
          const last = token.items[token.items.length - 1];
          if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
            if (top.type === "document")
              top.end = last.start;
            else
              top.items.push({ start: last.start });
            token.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          const doc = {
            type: "document",
            offset: this.offset,
            start: []
          };
          if (this.type === "doc-start")
            doc.start.push(this.sourceToken);
          this.stack.push(doc);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source
      };
    }
    *document(doc) {
      if (doc.value)
        return yield* this.lineEnd(doc);
      switch (this.type) {
        case "doc-start": {
          if (findNonEmptyIndex(doc.start) !== -1) {
            yield* this.pop();
            yield* this.step();
          } else
            doc.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          doc.start.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(doc);
      if (bv)
        this.stack.push(bv);
      else {
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
      }
    }
    *scalar(scalar) {
      if (this.type === "map-value-ind") {
        const prev = getPrevProps(this.peek(2));
        const start = getFirstKeyStartProps(prev);
        let sep;
        if (scalar.end) {
          sep = scalar.end;
          sep.push(this.sourceToken);
          delete scalar.end;
        } else
          sep = [this.sourceToken];
        const map4 = {
          type: "block-map",
          offset: scalar.offset,
          indent: scalar.indent,
          items: [{ start, key: scalar, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map4;
      } else
        yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          scalar.props.push(this.sourceToken);
          return;
        case "scalar":
          scalar.source = this.source;
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine) {
            let nl = this.source.indexOf("\n") + 1;
            while (nl !== 0) {
              this.onNewLine(this.offset + nl);
              nl = this.source.indexOf("\n", nl) + 1;
            }
          }
          yield* this.pop();
          break;
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop();
          yield* this.step();
      }
    }
    *blockMap(map4) {
      const it = map4.items[map4.items.length - 1];
      switch (this.type) {
        case "newline":
          this.onKeyLine = false;
          if (it.value) {
            const end = "end" in it.value ? it.value.end : void 0;
            const last = Array.isArray(end) ? end[end.length - 1] : void 0;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              map4.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "space":
        case "comment":
          if (it.value) {
            map4.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            if (this.atIndentedComment(it.start, map4.indent)) {
              const prev = map4.items[map4.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                arrayPushArray(end, it.start);
                end.push(this.sourceToken);
                map4.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= map4.indent) {
        const atMapIndent = !this.onKeyLine && this.indent === map4.indent;
        const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
        let start = [];
        if (atNextItem && it.sep && !it.value) {
          const nl = [];
          for (let i = 0; i < it.sep.length; ++i) {
            const st = it.sep[i];
            switch (st.type) {
              case "newline":
                nl.push(i);
                break;
              case "space":
                break;
              case "comment":
                if (st.indent > map4.indent)
                  nl.length = 0;
                break;
              default:
                nl.length = 0;
            }
          }
          if (nl.length >= 2)
            start = it.sep.splice(nl[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map4.items.push({ start });
              this.onKeyLine = true;
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "explicit-key-ind":
            if (!it.sep && !it.explicitKey) {
              it.start.push(this.sourceToken);
              it.explicitKey = true;
            } else if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map4.items.push({ start, explicitKey: true });
            } else {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: true }]
              });
            }
            this.onKeyLine = true;
            return;
          case "map-value-ind":
            if (it.explicitKey) {
              if (!it.sep) {
                if (includesToken(it.start, "newline")) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else {
                  const start2 = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                  });
                }
              } else if (it.value) {
                map4.items.push({ start: [], key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key: null, sep: [this.sourceToken] }]
                });
              } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                const start2 = getFirstKeyStartProps(it.start);
                const key2 = it.key;
                const sep = it.sep;
                sep.push(this.sourceToken);
                delete it.key;
                delete it.sep;
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key: key2, sep }]
                });
              } else if (start.length > 0) {
                it.sep = it.sep.concat(start, this.sourceToken);
              } else {
                it.sep.push(this.sourceToken);
              }
            } else {
              if (!it.sep) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else if (it.value || atNextItem) {
                map4.items.push({ start, key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [], key: null, sep: [this.sourceToken] }]
                });
              } else {
                it.sep.push(this.sourceToken);
              }
            }
            this.onKeyLine = true;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (atNextItem || it.value) {
              map4.items.push({ start, key: fs, sep: [] });
              this.onKeyLine = true;
            } else if (it.sep) {
              this.stack.push(fs);
            } else {
              Object.assign(it, { key: fs, sep: [] });
              this.onKeyLine = true;
            }
            return;
          }
          default: {
            const bv = this.startBlockValue(map4);
            if (bv) {
              if (bv.type === "block-seq") {
                if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source
                  });
                  return;
                }
              } else if (atMapIndent) {
                map4.items.push({ start });
              }
              this.stack.push(bv);
              return;
            }
          }
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *blockSequence(seq2) {
      const it = seq2.items[seq2.items.length - 1];
      switch (this.type) {
        case "newline":
          if (it.value) {
            const end = "end" in it.value ? it.value.end : void 0;
            const last = Array.isArray(end) ? end[end.length - 1] : void 0;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              seq2.items.push({ start: [this.sourceToken] });
          } else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            seq2.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(it.start, seq2.indent)) {
              const prev = seq2.items[seq2.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                arrayPushArray(end, it.start);
                end.push(this.sourceToken);
                seq2.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (it.value || this.indent <= seq2.indent)
            break;
          it.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== seq2.indent)
            break;
          if (it.value || includesToken(it.start, "seq-item-ind"))
            seq2.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
      }
      if (this.indent > seq2.indent) {
        const bv = this.startBlockValue(seq2);
        if (bv) {
          this.stack.push(bv);
          return;
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *flowCollection(fc) {
      const it = fc.items[fc.items.length - 1];
      if (this.type === "flow-error-end") {
        let top;
        do {
          yield* this.pop();
          top = this.peek(1);
        } while (top?.type === "flow-collection");
      } else if (fc.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!it || it.sep)
              fc.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!it || it.value)
              fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!it || it.value)
              fc.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (!it || it.value)
              fc.items.push({ start: [], key: fs, sep: [] });
            else if (it.sep)
              this.stack.push(fs);
            else
              Object.assign(it, { key: fs, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            fc.end.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(fc);
        if (bv)
          this.stack.push(bv);
        else {
          yield* this.pop();
          yield* this.step();
        }
      } else {
        const parent = this.peek(2);
        if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
          yield* this.pop();
          yield* this.step();
        } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          fixFlowSeqItems(fc);
          const sep = fc.end.splice(1, fc.end.length);
          sep.push(this.sourceToken);
          const map4 = {
            type: "block-map",
            offset: fc.offset,
            indent: fc.indent,
            items: [{ start, key: fc, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map4;
        } else {
          yield* this.lineEnd(fc);
        }
      }
    }
    flowScalar(type) {
      if (this.onNewLine) {
        let nl = this.source.indexOf("\n") + 1;
        while (nl !== 0) {
          this.onNewLine(this.offset + nl);
          nl = this.source.indexOf("\n", nl) + 1;
        }
      }
      return {
        type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    startBlockValue(parent) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: ""
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: []
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }]
          };
        case "explicit-key-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          start.push(this.sourceToken);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, explicitKey: true }]
          };
        }
        case "map-value-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, key: null, sep: [this.sourceToken] }]
          };
        }
      }
      return null;
    }
    atIndentedComment(start, indent2) {
      if (this.type !== "comment")
        return false;
      if (this.indent <= indent2)
        return false;
      return start.every((st) => st.type === "newline" || st.type === "space");
    }
    *documentEnd(docEnd) {
      if (this.type !== "doc-mode") {
        if (docEnd.end)
          docEnd.end.push(this.sourceToken);
        else
          docEnd.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
      }
    }
    *lineEnd(token) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop();
          yield* this.step();
          break;
        case "newline":
          this.onKeyLine = false;
        // fallthrough
        case "space":
        case "comment":
        default:
          if (token.end)
            token.end.push(this.sourceToken);
          else
            token.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
      }
    }
  };

  // node_modules/yaml/browser/dist/public-api.js
  function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
    return { lineCounter, prettyErrors };
  }
  function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser = new Parser(lineCounter?.addNewLine);
    const composer = new Composer(options);
    let doc = null;
    for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
      if (!doc)
        doc = _doc;
      else if (doc.options.logLevel !== "silent") {
        doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    }
    if (prettyErrors && lineCounter) {
      doc.errors.forEach(prettifyError(source, lineCounter));
      doc.warnings.forEach(prettifyError(source, lineCounter));
    }
    return doc;
  }
  function stringify3(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
    }
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      const indent2 = Math.round(options);
      options = indent2 < 1 ? void 0 : indent2 > 8 ? { indent: 8 } : { indent: indent2 };
    }
    if (value === void 0) {
      const { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return void 0;
    }
    if (isDocument(value) && !_replacer)
      return value.toString(options);
    return new Document(value, _replacer, options).toString(options);
  }

  // node_modules/flat/index.js
  function isBuffer(obj) {
    return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function keyIdentity(key2) {
    return key2;
  }
  function flatten(target, opts) {
    opts = opts || {};
    const delimiter = opts.delimiter || ".";
    const maxDepth = opts.maxDepth;
    const transformKey = opts.transformKey || keyIdentity;
    const output = {};
    function step(object, prev, currentDepth) {
      currentDepth = currentDepth || 1;
      Object.keys(object).forEach(function(key2) {
        const value = object[key2];
        const isarray = opts.safe && Array.isArray(value);
        const type = Object.prototype.toString.call(value);
        const isbuffer = isBuffer(value);
        const isobject = type === "[object Object]" || type === "[object Array]";
        const newKey = prev ? prev + delimiter + transformKey(key2) : transformKey(key2);
        if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) {
          return step(value, newKey, currentDepth + 1);
        }
        output[newKey] = value;
      });
    }
    step(target);
    return output;
  }
  function unflatten(target, opts) {
    opts = opts || {};
    const delimiter = opts.delimiter || ".";
    const overwrite = opts.overwrite || false;
    const transformKey = opts.transformKey || keyIdentity;
    const result = {};
    const isbuffer = isBuffer(target);
    if (isbuffer || Object.prototype.toString.call(target) !== "[object Object]") {
      return target;
    }
    function getkey(key2) {
      const parsedKey = Number(key2);
      return isNaN(parsedKey) || key2.indexOf(".") !== -1 || opts.object ? key2 : parsedKey;
    }
    function addKeys(keyPrefix, recipient, target2) {
      return Object.keys(target2).reduce(function(result2, key2) {
        result2[keyPrefix + delimiter + key2] = target2[key2];
        return result2;
      }, recipient);
    }
    function isEmpty2(val) {
      const type = Object.prototype.toString.call(val);
      const isArray = type === "[object Array]";
      const isObject = type === "[object Object]";
      if (!val) {
        return true;
      } else if (isArray) {
        return !val.length;
      } else if (isObject) {
        return !Object.keys(val).length;
      }
    }
    target = Object.keys(target).reduce(function(result2, key2) {
      const type = Object.prototype.toString.call(target[key2]);
      const isObject = type === "[object Object]" || type === "[object Array]";
      if (!isObject || isEmpty2(target[key2])) {
        result2[key2] = target[key2];
        return result2;
      } else {
        return addKeys(
          key2,
          result2,
          flatten(target[key2], opts)
        );
      }
    }, {});
    Object.keys(target).forEach(function(key2) {
      const split = key2.split(delimiter).map(transformKey);
      let key1 = getkey(split.shift());
      let key22 = getkey(split[0]);
      let recipient = result;
      while (key22 !== void 0) {
        if (key1 === "__proto__") {
          return;
        }
        const type = Object.prototype.toString.call(recipient[key1]);
        const isobject = type === "[object Object]" || type === "[object Array]";
        if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") {
          return;
        }
        if (overwrite && !isobject || !overwrite && recipient[key1] == null) {
          recipient[key1] = typeof key22 === "number" && !opts.object ? [] : {};
        }
        recipient = recipient[key1];
        if (split.length > 0) {
          key1 = getkey(split.shift());
          key22 = getkey(split[0]);
        }
      }
      recipient[key1] = unflatten(target[key2], opts);
    });
    return result;
  }

  // node_modules/stringify-entities/lib/core.js
  var defaultSubsetRegex = /["&'<>`]/g;
  var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var controlCharactersRegex = (
    // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
    /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
  );
  var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
  var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
  function core(value, options) {
    value = value.replace(
      options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
      basic
    );
    if (options.subset || options.escapeOnly) {
      return value;
    }
    return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
    function surrogate(pair, index2, all3) {
      return options.format(
        (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
        all3.charCodeAt(index2 + 2),
        options
      );
    }
    function basic(character, index2, all3) {
      return options.format(
        character.charCodeAt(0),
        all3.charCodeAt(index2 + 1),
        options
      );
    }
  }
  function charactersToExpressionCached(subset) {
    let cached = subsetToRegexCache.get(subset);
    if (!cached) {
      cached = charactersToExpression(subset);
      subsetToRegexCache.set(subset, cached);
    }
    return cached;
  }
  function charactersToExpression(subset) {
    const groups = [];
    let index2 = -1;
    while (++index2 < subset.length) {
      groups.push(subset[index2].replace(regexEscapeRegex, "\\$&"));
    }
    return new RegExp("(?:" + groups.join("|") + ")", "g");
  }

  // node_modules/stringify-entities/lib/util/to-hexadecimal.js
  var hexadecimalRegex = /[\dA-Fa-f]/;
  function toHexadecimal(code4, next, omit) {
    const value = "&#x" + code4.toString(16).toUpperCase();
    return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/stringify-entities/lib/util/to-decimal.js
  var decimalRegex = /\d/;
  function toDecimal(code4, next, omit) {
    const value = "&#" + String(code4);
    return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
  }

  // node_modules/character-entities-legacy/index.js
  var characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];

  // node_modules/character-entities-html4/index.js
  var characterEntitiesHtml4 = {
    nbsp: "\xA0",
    iexcl: "\xA1",
    cent: "\xA2",
    pound: "\xA3",
    curren: "\xA4",
    yen: "\xA5",
    brvbar: "\xA6",
    sect: "\xA7",
    uml: "\xA8",
    copy: "\xA9",
    ordf: "\xAA",
    laquo: "\xAB",
    not: "\xAC",
    shy: "\xAD",
    reg: "\xAE",
    macr: "\xAF",
    deg: "\xB0",
    plusmn: "\xB1",
    sup2: "\xB2",
    sup3: "\xB3",
    acute: "\xB4",
    micro: "\xB5",
    para: "\xB6",
    middot: "\xB7",
    cedil: "\xB8",
    sup1: "\xB9",
    ordm: "\xBA",
    raquo: "\xBB",
    frac14: "\xBC",
    frac12: "\xBD",
    frac34: "\xBE",
    iquest: "\xBF",
    Agrave: "\xC0",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Atilde: "\xC3",
    Auml: "\xC4",
    Aring: "\xC5",
    AElig: "\xC6",
    Ccedil: "\xC7",
    Egrave: "\xC8",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Euml: "\xCB",
    Igrave: "\xCC",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Iuml: "\xCF",
    ETH: "\xD0",
    Ntilde: "\xD1",
    Ograve: "\xD2",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Otilde: "\xD5",
    Ouml: "\xD6",
    times: "\xD7",
    Oslash: "\xD8",
    Ugrave: "\xD9",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Uuml: "\xDC",
    Yacute: "\xDD",
    THORN: "\xDE",
    szlig: "\xDF",
    agrave: "\xE0",
    aacute: "\xE1",
    acirc: "\xE2",
    atilde: "\xE3",
    auml: "\xE4",
    aring: "\xE5",
    aelig: "\xE6",
    ccedil: "\xE7",
    egrave: "\xE8",
    eacute: "\xE9",
    ecirc: "\xEA",
    euml: "\xEB",
    igrave: "\xEC",
    iacute: "\xED",
    icirc: "\xEE",
    iuml: "\xEF",
    eth: "\xF0",
    ntilde: "\xF1",
    ograve: "\xF2",
    oacute: "\xF3",
    ocirc: "\xF4",
    otilde: "\xF5",
    ouml: "\xF6",
    divide: "\xF7",
    oslash: "\xF8",
    ugrave: "\xF9",
    uacute: "\xFA",
    ucirc: "\xFB",
    uuml: "\xFC",
    yacute: "\xFD",
    thorn: "\xFE",
    yuml: "\xFF",
    fnof: "\u0192",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    bull: "\u2022",
    hellip: "\u2026",
    prime: "\u2032",
    Prime: "\u2033",
    oline: "\u203E",
    frasl: "\u2044",
    weierp: "\u2118",
    image: "\u2111",
    real: "\u211C",
    trade: "\u2122",
    alefsym: "\u2135",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lArr: "\u21D0",
    uArr: "\u21D1",
    rArr: "\u21D2",
    dArr: "\u21D3",
    hArr: "\u21D4",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    int: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    lang: "\u2329",
    rang: "\u232A",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    permil: "\u2030",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    euro: "\u20AC"
  };

  // node_modules/stringify-entities/lib/constant/dangerous.js
  var dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];

  // node_modules/stringify-entities/lib/util/to-named.js
  var own4 = {}.hasOwnProperty;
  var characters = {};
  var key;
  for (key in characterEntitiesHtml4) {
    if (own4.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  var notAlphanumericRegex = /[^\dA-Za-z]/;
  function toNamed(code4, next, omit, attribute) {
    const character = String.fromCharCode(code4);
    if (own4.call(characters, character)) {
      const name = characters[character];
      const value = "&" + name;
      if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
        return value;
      }
      return value + ";";
    }
    return "";
  }

  // node_modules/stringify-entities/lib/util/format-smart.js
  function formatSmart(code4, next, options) {
    let numeric = toHexadecimal(code4, next, options.omitOptionalSemicolons);
    let named;
    if (options.useNamedReferences || options.useShortestReferences) {
      named = toNamed(
        code4,
        next,
        options.omitOptionalSemicolons,
        options.attribute
      );
    }
    if ((options.useShortestReferences || !named) && options.useShortestReferences) {
      const decimal = toDecimal(code4, next, options.omitOptionalSemicolons);
      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
    return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
  }

  // node_modules/stringify-entities/lib/util/format-basic.js
  function formatBasic(code4) {
    return "&#x" + code4.toString(16).toUpperCase() + ";";
  }

  // node_modules/stringify-entities/lib/index.js
  function stringifyEntities(value, options) {
    return core(value, Object.assign({ format: formatSmart }, options));
  }
  function stringifyEntitiesLight(value, options) {
    return core(value, Object.assign({ format: formatBasic }, options));
  }

  // node_modules/character-reference-invalid/index.js
  var characterReferenceInvalid = {
    0: "\uFFFD",
    128: "\u20AC",
    130: "\u201A",
    131: "\u0192",
    132: "\u201E",
    133: "\u2026",
    134: "\u2020",
    135: "\u2021",
    136: "\u02C6",
    137: "\u2030",
    138: "\u0160",
    139: "\u2039",
    140: "\u0152",
    142: "\u017D",
    145: "\u2018",
    146: "\u2019",
    147: "\u201C",
    148: "\u201D",
    149: "\u2022",
    150: "\u2013",
    151: "\u2014",
    152: "\u02DC",
    153: "\u2122",
    154: "\u0161",
    155: "\u203A",
    156: "\u0153",
    158: "\u017E",
    159: "\u0178"
  };

  // node_modules/is-decimal/index.js
  function isDecimal(character) {
    const code4 = typeof character === "string" ? character.charCodeAt(0) : character;
    return code4 >= 48 && code4 <= 57;
  }

  // node_modules/is-hexadecimal/index.js
  function isHexadecimal(character) {
    const code4 = typeof character === "string" ? character.charCodeAt(0) : character;
    return code4 >= 97 && code4 <= 102 || code4 >= 65 && code4 <= 70 || code4 >= 48 && code4 <= 57;
  }

  // node_modules/is-alphabetical/index.js
  function isAlphabetical(character) {
    const code4 = typeof character === "string" ? character.charCodeAt(0) : character;
    return code4 >= 97 && code4 <= 122 || code4 >= 65 && code4 <= 90;
  }

  // node_modules/is-alphanumerical/index.js
  function isAlphanumerical(character) {
    return isAlphabetical(character) || isDecimal(character);
  }

  // node_modules/parse-entities/lib/index.js
  var messages = [
    "",
    /* 1: Non terminated (named) */
    "Named character references must be terminated by a semicolon",
    /* 2: Non terminated (numeric) */
    "Numeric character references must be terminated by a semicolon",
    /* 3: Empty (named) */
    "Named character references cannot be empty",
    /* 4: Empty (numeric) */
    "Numeric character references cannot be empty",
    /* 5: Unknown (named) */
    "Named character references must be known",
    /* 6: Disallowed (numeric) */
    "Numeric character references cannot be disallowed",
    /* 7: Prohibited (numeric) */
    "Numeric character references cannot be outside the permissible Unicode range"
  ];
  function parseEntities(value, options) {
    const settings = options || {};
    const additional = typeof settings.additional === "string" ? settings.additional.charCodeAt(0) : settings.additional;
    const result = [];
    let index2 = 0;
    let lines = -1;
    let queue = "";
    let point4;
    let indent2;
    if (settings.position) {
      if ("start" in settings.position || "indent" in settings.position) {
        indent2 = settings.position.indent;
        point4 = settings.position.start;
      } else {
        point4 = settings.position;
      }
    }
    let line = (point4 ? point4.line : 0) || 1;
    let column = (point4 ? point4.column : 0) || 1;
    let previous4 = now();
    let character;
    index2--;
    while (++index2 <= value.length) {
      if (character === 10) {
        column = (indent2 ? indent2[lines] : 0) || 1;
      }
      character = value.charCodeAt(index2);
      if (character === 38) {
        const following = value.charCodeAt(index2 + 1);
        if (following === 9 || following === 10 || following === 12 || following === 32 || following === 38 || following === 60 || Number.isNaN(following) || additional && following === additional) {
          queue += String.fromCharCode(character);
          column++;
          continue;
        }
        const start = index2 + 1;
        let begin = start;
        let end = start;
        let type;
        if (following === 35) {
          end = ++begin;
          const following2 = value.charCodeAt(end);
          if (following2 === 88 || following2 === 120) {
            type = "hexadecimal";
            end = ++begin;
          } else {
            type = "decimal";
          }
        } else {
          type = "named";
        }
        let characterReferenceCharacters = "";
        let characterReference2 = "";
        let characters2 = "";
        const test = type === "named" ? isAlphanumerical : type === "decimal" ? isDecimal : isHexadecimal;
        end--;
        while (++end <= value.length) {
          const following2 = value.charCodeAt(end);
          if (!test(following2)) {
            break;
          }
          characters2 += String.fromCharCode(following2);
          if (type === "named" && characterEntitiesLegacy.includes(characters2)) {
            characterReferenceCharacters = characters2;
            characterReference2 = decodeNamedCharacterReference(characters2);
          }
        }
        let terminated = value.charCodeAt(end) === 59;
        if (terminated) {
          end++;
          const namedReference = type === "named" ? decodeNamedCharacterReference(characters2) : false;
          if (namedReference) {
            characterReferenceCharacters = characters2;
            characterReference2 = namedReference;
          }
        }
        let diff = 1 + end - start;
        let reference = "";
        if (!terminated && settings.nonTerminated === false) {
        } else if (!characters2) {
          if (type !== "named") {
            warning(4, diff);
          }
        } else if (type === "named") {
          if (terminated && !characterReference2) {
            warning(5, 1);
          } else {
            if (characterReferenceCharacters !== characters2) {
              end = begin + characterReferenceCharacters.length;
              diff = 1 + end - begin;
              terminated = false;
            }
            if (!terminated) {
              const reason = characterReferenceCharacters ? 1 : 3;
              if (settings.attribute) {
                const following2 = value.charCodeAt(end);
                if (following2 === 61) {
                  warning(reason, diff);
                  characterReference2 = "";
                } else if (isAlphanumerical(following2)) {
                  characterReference2 = "";
                } else {
                  warning(reason, diff);
                }
              } else {
                warning(reason, diff);
              }
            }
          }
          reference = characterReference2;
        } else {
          if (!terminated) {
            warning(2, diff);
          }
          let referenceCode = Number.parseInt(
            characters2,
            type === "hexadecimal" ? 16 : 10
          );
          if (prohibited(referenceCode)) {
            warning(7, diff);
            reference = String.fromCharCode(
              65533
              /* `�` */
            );
          } else if (referenceCode in characterReferenceInvalid) {
            warning(6, diff);
            reference = characterReferenceInvalid[referenceCode];
          } else {
            let output = "";
            if (disallowed(referenceCode)) {
              warning(6, diff);
            }
            if (referenceCode > 65535) {
              referenceCode -= 65536;
              output += String.fromCharCode(
                referenceCode >>> (10 & 1023) | 55296
              );
              referenceCode = 56320 | referenceCode & 1023;
            }
            reference = output + String.fromCharCode(referenceCode);
          }
        }
        if (reference) {
          flush();
          previous4 = now();
          index2 = end - 1;
          column += end - start + 1;
          result.push(reference);
          const next = now();
          next.offset++;
          if (settings.reference) {
            settings.reference.call(
              settings.referenceContext || void 0,
              reference,
              { start: previous4, end: next },
              value.slice(start - 1, end)
            );
          }
          previous4 = next;
        } else {
          characters2 = value.slice(start - 1, end);
          queue += characters2;
          column += characters2.length;
          index2 = end - 1;
        }
      } else {
        if (character === 10) {
          line++;
          lines++;
          column = 0;
        }
        if (Number.isNaN(character)) {
          flush();
        } else {
          queue += String.fromCharCode(character);
          column++;
        }
      }
    }
    return result.join("");
    function now() {
      return {
        line,
        column,
        offset: index2 + ((point4 ? point4.offset : 0) || 0)
      };
    }
    function warning(code4, offset) {
      let position3;
      if (settings.warning) {
        position3 = now();
        position3.column += offset;
        position3.offset += offset;
        settings.warning.call(
          settings.warningContext || void 0,
          messages[code4],
          position3,
          code4
        );
      }
    }
    function flush() {
      if (queue) {
        result.push(queue);
        if (settings.text) {
          settings.text.call(settings.textContext || void 0, queue, {
            start: previous4,
            end: now()
          });
        }
        queue = "";
      }
    }
  }
  function prohibited(code4) {
    return code4 >= 55296 && code4 <= 57343 || code4 > 1114111;
  }
  function disallowed(code4) {
    return code4 >= 1 && code4 <= 8 || code4 === 11 || code4 >= 13 && code4 <= 31 || code4 >= 127 && code4 <= 159 || code4 >= 64976 && code4 <= 65007 || (code4 & 65535) === 65535 || (code4 & 65535) === 65534;
  }

  // node_modules/remark-mdc/dist/index.mjs
  var FRONTMATTER_DELIMITER_DEFAULT = "---";
  var FRONTMATTER_DELIMITER_CODEBLOCK_STYLE = "```yaml [props]";
  var LF = "\n";
  var CR = "\r";
  function stringifyYAML(data, options) {
    if (!data || !Object.keys(data).length) return "";
    if (options?.preserveOrder && data.__order__) {
      const newDoc = new Document();
      newDoc.contents = buildFromOrdered(data.__order__);
      return String(newDoc).trim();
    }
    Reflect.deleteProperty(data, "__order__");
    data = unflatten(data || {}, {});
    return [
      options?.prefix || "",
      stringify3(data, options).trim(),
      options?.suffix || ""
    ].join("\n").trim();
  }
  function stringifyFrontMatter(data, content3 = "", options) {
    const str = stringifyYAML(data, {
      prefix: FRONTMATTER_DELIMITER_DEFAULT,
      suffix: FRONTMATTER_DELIMITER_DEFAULT,
      ...options
    });
    return [str, "", content3.trim()].join("\n").trim() + "\n";
  }
  function stringifyCodeBlockProps(data, content3 = "", options) {
    const str = stringifyYAML(data, {
      prefix: FRONTMATTER_DELIMITER_CODEBLOCK_STYLE,
      suffix: "```",
      ...options
    });
    return [str, content3.trim()].join("\n").trim() + "\n";
  }
  function parseFrontMatter(content3, options) {
    let data = {};
    if (content3.startsWith(FRONTMATTER_DELIMITER_DEFAULT)) {
      const idx = content3.indexOf(LF + FRONTMATTER_DELIMITER_DEFAULT);
      if (idx !== -1) {
        const hasCarriageReturn = content3[idx - 1] === CR;
        const frontmatter = content3.slice(4, idx - (hasCarriageReturn ? 1 : 0));
        if (frontmatter) {
          const document4 = parseDocument(frontmatter, options);
          data = document4.toJSON();
          if (options?.preserveOrder) {
            data.__order__ = extractOrdered(document4.contents);
          }
          content3 = content3.slice(idx + 4 + (hasCarriageReturn ? 1 : 0));
        }
      }
    }
    return {
      content: content3,
      // unflatten frontmatter data. convert `parent.child` keys into `parent: { child: ... }`
      data: unflatten(data || {}, {})
    };
  }
  function extractOrdered(valueNode) {
    if (isMap(valueNode)) {
      const map4 = [];
      for (const item of valueNode.items) {
        map4.push([item.key.value, extractOrdered(item.value)]);
      }
      return { type: "map", value: map4 };
    }
    if (isSeq(valueNode)) {
      return { type: "seq", value: valueNode.items.map((item) => extractOrdered(item)) };
    }
    if (isScalar(valueNode)) {
      return { type: "scalar", value: valueNode.value };
    }
    return { type: "scalar", value: null };
  }
  function buildFromOrdered(orderedNode) {
    if (orderedNode.type === "map") {
      const map4 = new YAMLMap();
      for (const [key2, value] of orderedNode.value) {
        map4.items.push(new Pair(new Scalar(key2), buildFromOrdered(value)));
      }
      return map4;
    }
    if (orderedNode.type === "seq") {
      const seq2 = new YAMLSeq();
      for (const item of orderedNode.value) {
        seq2.items.push(buildFromOrdered(item));
      }
      return seq2;
    }
    return new Scalar(orderedNode.value);
  }
  function track(options_) {
    const options = options_ || {};
    const now = options.now || {};
    let lineShift = options.lineShift || 0;
    let line = now.line || 1;
    let column = now.column || 1;
    return { move, current, shift };
    function current() {
      return { now: { line, column }, lineShift };
    }
    function shift(value) {
      lineShift += value;
    }
    function move(value = "") {
      const chunks = value.split(/\r?\n|\r/g);
      const tail = chunks[chunks.length - 1];
      line += chunks.length - 1;
      column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
      return value;
    }
  }
  function inlineContainerFlow(parent, context, safeOptions = {}) {
    const indexStack = context.indexStack;
    const children = parent.children || [];
    const tracker = track(safeOptions);
    const results = [];
    let index2 = -1;
    indexStack.push(-1);
    while (++index2 < children.length) {
      const child = children[index2];
      indexStack[indexStack.length - 1] = index2;
      results.push(
        tracker.move(
          context.handle(child, parent, context, {
            before: "",
            after: "",
            ...tracker.current()
          })
        )
      );
    }
    indexStack.pop();
    return results.join("");
  }
  function containerFlow(parent, context, safeOptions = {}) {
    const indexStack = context.indexStack;
    const children = parent.children || [];
    const tracker = track(safeOptions);
    const results = [];
    let index2 = -1;
    indexStack.push(-1);
    while (++index2 < children.length) {
      const child = children[index2];
      indexStack[indexStack.length - 1] = index2;
      results.push(
        tracker.move(
          context.handle(child, parent, context, {
            before: "\n",
            after: "\n",
            ...tracker.current()
          })
        )
      );
      if (child.type !== "list") {
        context.bulletLastUsed = void 0;
      }
      if (index2 < children.length - 1) {
        results.push(tracker.move(between(child, children[index2 + 1])));
      }
    }
    indexStack.pop();
    return results.join("");
    function between(left, right) {
      let index22 = context.join.length;
      while (index22--) {
        const result = context.join[index22](left, right, parent, context);
        if (result === true || result === 1) {
          break;
        }
        if (typeof result === "number") {
          return "\n".repeat(1 + result);
        }
        if (result === false) {
          return "\n\n<!---->\n\n";
        }
      }
      return "\n\n";
    }
  }
  function containerPhrasing(parent, context, safeOptions) {
    const indexStack = context.indexStack;
    const children = parent.children || [];
    const results = [];
    let index2 = -1;
    let before = safeOptions.before;
    indexStack.push(-1);
    let tracker = track(safeOptions);
    while (++index2 < children.length) {
      const child = children[index2];
      let after;
      indexStack[indexStack.length - 1] = index2;
      if (index2 + 1 < children.length) {
        let handle3 = context.handle.handlers[children[index2 + 1].type];
        if (handle3 && handle3.peek) {
          handle3 = handle3.peek;
        }
        after = "";
        if (handle3) {
          after = handle3(
            children[index2 + 1],
            parent,
            context,
            {
              before: "",
              after: "",
              ...tracker.current()
            }
          ).charAt(0);
        }
      } else {
        after = safeOptions.after;
      }
      if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
        results[results.length - 1] = results[results.length - 1].replace(
          /(\r?\n|\r)$/,
          " "
        );
        before = " ";
        tracker = track(safeOptions);
        tracker.move(results.join(""));
      }
      results.push(
        tracker.move(
          context.handle(child, parent, context, {
            ...tracker.current(),
            before,
            after
          })
        )
      );
      before = results[results.length - 1].slice(-1);
    }
    indexStack.pop();
    return results.join("");
  }
  function checkQuote2(context) {
    const marker = context.options.quote || '"';
    if (marker !== '"' && marker !== "'") {
      throw new Error(
        "Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`"
      );
    }
    return marker;
  }
  var CONTAINER_NODE_TYPES = /* @__PURE__ */ new Set([
    "componentContainerSection",
    "containerComponent",
    "leafComponent"
  ]);
  var NON_UNWRAPPABLE_TYPES = /* @__PURE__ */ new Set([
    "componentContainerSection",
    "componentContainerDataSection",
    "containerComponent",
    "leafComponent",
    "table",
    "pre",
    "code",
    "textComponent",
    "heading"
  ]);
  function convertHtmlEntitiesToChars(text7) {
    return text7.replace(/&#x([0-9A-Fa-f]+);/g, (_, hexCode) => {
      return String.fromCodePoint(Number.parseInt(hexCode, 16));
    });
  }
  var shortcut = /^[^\t\n\r "'.<=>`}]+$/;
  var baseFence = 2;
  function compilePattern(pattern) {
    if (!pattern._compiled) {
      const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
      pattern._compiled = new RegExp(
        (before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""),
        "g"
      );
    }
    return pattern._compiled;
  }
  var toMarkdown = (opts = {}) => {
    const applyAutomaticUnwrap = (node2, _options) => {
      if (!CONTAINER_NODE_TYPES.has(node2.type)) {
        return;
      }
      const isSafe = (type) => ["paragraph"].includes(type) || NON_UNWRAPPABLE_TYPES.has(type);
      const safeChildrens = node2.children.filter((child) => !isSafe(child.type));
      if (safeChildrens.length === 0) {
        return;
      }
      node2.children = [
        {
          type: "paragraph",
          children: safeChildrens
        },
        ...node2.children.filter((child) => isSafe(child.type))
      ];
    };
    const frontmatter = (node2) => {
      const entries = Object.entries(node2.fmAttributes || {});
      if (entries.length === 0) {
        return "";
      }
      const attrs = entries.sort(([key1], [key2]) => key1.localeCompare(key2)).reduce((acc, [key2, value2]) => {
        if (key2?.startsWith(":") && isValidJSON(value2)) {
          try {
            value2 = JSON.parse(value2);
          } catch {
          }
          key2 = key2.slice(1);
        }
        acc[key2] = value2;
        return acc;
      }, {});
      return "\n" + (opts?.attributes?.yamlCodeBlock ? stringifyCodeBlockProps(attrs).trim() : stringifyFrontMatter(attrs).trim());
    };
    const processNode = (node2) => {
      if (opts.autoUnwrap) {
        applyAutomaticUnwrap(node2, typeof opts.autoUnwrap === "boolean" ? {} : opts.autoUnwrap);
      }
    };
    function componentContainerSection(node2, _, context) {
      context.indexStack = context.stack;
      processNode(node2);
      return `#${node2.name}${attributes2(node2, context)}
${content3(node2, context)}`.trim();
    }
    function textComponent(node2, _, context) {
      let value;
      context.indexStack = context.stack;
      const exit3 = context.enter(node2.type);
      if (node2.name === "span") {
        value = `[${content3(node2, context)}]${attributes2(node2, context)}`;
      } else if (node2.name === "binding") {
        const attrs = node2.attributes || {};
        value = attrs.defaultValue ? `{{ ${attrs.value} || '${attrs.defaultValue}' }}` : `{{ ${attrs.value} }}`;
      } else {
        value = ":" + (node2.name || "") + label2(node2, context) + attributes2(node2, context);
      }
      exit3();
      return value;
    }
    let nest = 0;
    function containerComponent(node2, _, context) {
      context.indexStack = context.stack;
      const prefix = ":".repeat(baseFence + nest);
      nest += 1;
      const exit3 = context.enter(node2.type);
      context.bulletLastUsed = void 0;
      let value = prefix + (node2.name || "") + label2(node2, context);
      const defaultSlotChildren = node2.children.filter((child) => child.type !== "componentContainerSection");
      const slots = node2.children.filter((child) => child.type === "componentContainerSection");
      node2.children = [
        ...defaultSlotChildren,
        ...slots
      ];
      node2.fmAttributes = node2.fmAttributes || {};
      const attributesText = attributes2(node2, context);
      const attributesEntries = Object.entries(node2.attributes || {});
      if ((value + attributesText).length > (opts?.attributes?.maxLength || 80) || Object.keys(node2.fmAttributes).length > 0 || attributesEntries.length > 3 || attributesEntries.some(([_2, value2]) => typeof value2 === "object") || attributesText.match(/(=['"][{[]|\n)/) || node2.children?.some((child) => child.type === "componentContainerSection")) {
        Object.assign(node2.fmAttributes, node2.attributes);
        node2.attributes = [];
      }
      processNode(node2);
      value += attributes2(node2, context);
      value += frontmatter(node2);
      let subvalue;
      if (node2.type === "containerComponent") {
        subvalue = content3(node2, context);
        if (subvalue) {
          value += "\n" + subvalue;
        }
        value += "\n" + prefix;
        if (nest > 1) {
          value = value.split("\n").map((line) => line.length > 0 ? "  " + line : line).join("\n");
        }
      }
      nest -= 1;
      exit3();
      return value;
    }
    containerComponent.peek = function peekComponent() {
      return ":";
    };
    function label2(node2, context) {
      let label22 = node2;
      if (node2.type === "containerComponent") {
        if (!inlineComponentLabel(node2)) {
          return "";
        }
        label22 = node2.children[0];
      }
      const exit3 = context.enter("label");
      const subexit = context.enter(node2.type + "Label");
      const value = containerPhrasing(label22, context, { before: "[", after: "]" });
      subexit();
      exit3();
      return value ? "[" + value + "]" : "";
    }
    const isValidJSON = (str) => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    };
    function attributes2(node2, context) {
      const quote = checkQuote2(context);
      const subset = node2.type === "textComponent" ? [quote] : [quote, "\n", "\r"];
      const attributes22 = node2.attributes || {};
      const attrs = opts.attributes?.preserveOrder && attributes22.__order__ ? attributes22.__order__?.value : Object.entries(attributes22).sort(([key1], [key2]) => key1.localeCompare(key2));
      const values = [];
      let id;
      let classesFull = "";
      let classes = "";
      let index2;
      for (const attr of attrs) {
        const key2 = attr[0];
        let value;
        if (attr[1] != null) {
          value = String(attr[1]);
          if (key2 === "id") {
            id = shortcut.test(value) ? "#" + value : quoted("id", value);
          } else if (key2 === "class" || key2 === "className") {
            value = Array.isArray(attrs[key2]) ? attrs[key2].join(" ") : value;
            value = value.split(/[\t\n\r ]+/g).filter(Boolean);
            classesFull = [];
            classes = [];
            index2 = -1;
            while (++index2 < value.length) {
              (shortcut.test(value[index2]) ? classes : classesFull).push(value[index2]);
            }
            classesFull = classesFull.length ? quoted("class", classesFull.join(" ")) : "";
            classes = classes.length ? "." + classes.join(".") : "";
          } else if (key2.startsWith(":") && value === "true") {
            values.push(key2.slice(1));
          } else if (key2.startsWith(":") && isValidJSON(value)) {
            values.push(`${key2}='${value.replace(/([^/])'/g, "$1\\'")}'`);
          } else if (typeof attr[1] === "object") {
            values.push(quoted(key2, JSON.stringify(value)));
          } else {
            values.push(quoted(key2, value));
          }
        }
      }
      if (classesFull) {
        values.unshift(classesFull);
      }
      if (classes) {
        values.unshift(classes);
      }
      if (id) {
        values.unshift(id);
      }
      return values.length ? "{" + values.join(" ") + "}" : "";
      function quoted(key2, value) {
        return key2 + "=" + quote + stringifyEntitiesLight(value, { subset }) + quote;
      }
    }
    function content3(node2, context) {
      const content22 = inlineComponentLabel(node2) ? Object.assign({}, node2, { children: node2.children.slice(1) }) : node2;
      let result = node2.type === "textComponent" ? inlineContainerFlow(content22, context) : containerFlow(content22, context);
      if (result.includes("&#x")) {
        result = convertHtmlEntitiesToChars(result);
      }
      return result;
    }
    function inlineComponentLabel(node2) {
      return node2.children && node2.children[0] && node2.children[0].data && node2.children[0].data.componentLabel;
    }
    return {
      compilePattern,
      unsafe: [
        {
          character: "\r",
          inConstruct: ["leafComponentLabel", "containerComponentLabel"]
        },
        {
          character: "\n",
          inConstruct: ["leafComponentLabel", "containerComponentLabel"]
        },
        {
          before: "[^:]",
          character: ":",
          after: "[A-Za-z]",
          inConstruct: ["phrasing"]
        },
        { atBreak: true, character: ":", after: ":" }
      ],
      handlers: {
        containerComponent,
        textComponent,
        componentContainerSection,
        image: (node2, _, state, info) => {
          return handle.image(node2, _, state, info) + attributes2(node2, state);
        },
        link: (node2, _, state, info) => {
          const andPattern = state.unsafe.find((pattern) => pattern.character === "&");
          const defaultNotInConstruct = andPattern?.notInConstruct || [];
          if (andPattern) {
            andPattern.notInConstruct = "destinationRaw";
          }
          const result = handle.link(node2, _, state, info) + attributes2(node2, state);
          if (andPattern) {
            andPattern.notInConstruct = defaultNotInConstruct;
          }
          return result;
        },
        linkReference: (node2, _, state, info) => {
          return handle.linkReference(node2, _, state, info) + attributes2(node2, state);
        },
        strong: (node2, _, state, info) => {
          return handle.strong(node2, _, state, info) + attributes2(node2, state);
        },
        inlineCode: (node2, _, state) => {
          state.compilePattern = state.compilePattern || compilePattern;
          return handle.inlineCode(node2, _, state) + attributes2(node2, state);
        },
        emphasis: (node2, _, state, info) => {
          return handle.emphasis(node2, _, state, info) + attributes2(node2, state);
        }
      }
    };
  };
  var fromMarkdown2 = (opts = {}) => {
    const canContainEols = ["textComponent"];
    const applyYamlCodeBlockProps = (node2) => {
      const firstSection = node2.children[0];
      if (firstSection && firstSection.children?.length && firstSection.children[0]?.type === "code" && firstSection.children[0]?.lang === "yaml" && firstSection.children[0]?.meta === "[props]") {
        node2.rawData = firstSection.children[0].value;
        node2.mdc = node2.mdc || {};
        node2.mdc.codeBlockProps = true;
        firstSection.children.splice(0, 1);
      }
    };
    const applyAutomaticUnwrap = (node2, _options) => {
      if (!CONTAINER_NODE_TYPES.has(node2.type)) {
        return;
      }
      const nonSlotChildren = node2.children.filter((child2) => child2.type !== "componentContainerSection");
      if (nonSlotChildren.length !== 1) {
        return;
      }
      const child = nonSlotChildren[0];
      if (child.type !== "paragraph") {
        return;
      }
      const childIndex = node2.children.indexOf(child);
      node2.children.splice(childIndex, 1, ...child?.children || []);
    };
    const processNode = (node2) => {
      if (opts.attributes?.yamlCodeBlock) {
        applyYamlCodeBlockProps(node2);
      }
      if (opts.autoUnwrap) {
        applyAutomaticUnwrap(node2, typeof opts.autoUnwrap === "boolean" ? {} : opts.autoUnwrap);
      }
    };
    const enter = {
      componentContainer: enterContainer,
      componentContainerSection: enterContainerSection,
      componentContainerDataSection: enterContainerDataSection,
      componentContainerAttributes: enterAttributes,
      componentContainerLabel: enterContainerLabel,
      bindingContent: enterBindingContent,
      componentLeaf: enterLeaf,
      componentLeafAttributes: enterAttributes,
      componentText: enterText,
      textSpan: enterTextSpan,
      componentTextAttributes: enterAttributes
    };
    const exit3 = {
      bindingContent: exitBindingContent,
      componentContainerSectionTitle: exitContainerSectionTitle,
      listUnordered: conditionalExit,
      listOrdered: conditionalExit,
      listItem: conditionalExit,
      componentContainerSection: exitContainerSection,
      componentContainerDataSection: exitContainerDataSection,
      componentContainer: exitContainer,
      componentContainerAttributeClassValue: exitAttributeClassValue,
      componentContainerAttributeIdValue: exitAttributeIdValue,
      componentContainerAttributeName: exitAttributeName,
      componentContainerAttributeValue: exitAttributeValue,
      componentContainerAttributes: exitAttributes,
      componentContainerLabel: exitContainerLabel,
      componentContainerName,
      componentContainerAttributeInitializerMarker() {
        const attributes2 = this.data.componentAttributes;
        attributes2[attributes2.length - 1][1] = "";
      },
      componentLeaf: exitToken,
      componentLeafAttributeClassValue: exitAttributeClassValue,
      componentLeafAttributeIdValue: exitAttributeIdValue,
      componentLeafAttributeName: exitAttributeName,
      componentLeafAttributeValue: exitAttributeValue,
      componentLeafAttributes: exitAttributes,
      componentLeafName: exitName,
      componentText: exitToken,
      textSpan: exitToken,
      componentTextAttributeClassValue: exitAttributeClassValue,
      componentTextAttributeIdValue: exitAttributeIdValue,
      componentTextAttributeName: exitAttributeName,
      componentTextAttributeValue: exitAttributeValue,
      componentTextAttributes: exitAttributes,
      componentTextName: componentContainerName
    };
    function enterBindingContent(token) {
      const regex = /([^|]*)(?:\|\|\s*'(.*)')?/;
      const values = regex.exec(this.sliceSerialize(token));
      this.enter({
        type: "textComponent",
        name: "binding",
        attributes: {
          value: values?.[1]?.trim(),
          defaultValue: values?.[2]
        }
      }, token);
    }
    function exitBindingContent(token) {
      this.exit(token);
    }
    function enterContainer(token) {
      enterToken.call(this, "containerComponent", token);
    }
    function exitContainer(token) {
      const container = this.stack[this.stack.length - 1];
      if (container.children.length > 1) {
        const dataSection = container.children.find((child) => child.rawData);
        container.rawData = dataSection?.rawData;
      }
      processNode(container);
      container.children = container.children.flatMap((child) => {
        if (child.rawData) {
          return [];
        }
        if (child.name === "default" && Object.keys(child.attributes).length === 0 || !child.name) {
          if (child.mdc?.unwrapped) {
            container.mdc = container.mdc || {};
            container.mdc.unwrapped = child.mdc?.unwrapped;
          }
          return child.children;
        }
        child.data = {
          hName: "component-slot",
          hProperties: {
            ...child.attributes,
            [`v-slot:${child.name}`]: ""
          }
        };
        return child;
      });
      this.exit(token);
    }
    function enterContainerSection(token) {
      enterToken.call(this, "componentContainerSection", token);
    }
    function enterContainerDataSection(token) {
      enterToken.call(this, "componentContainerDataSection", token);
    }
    function exitContainerSection(token) {
      const section = this.stack[this.stack.length - 1];
      attemptClosingOpenListSection.call(this, section);
      processNode(section);
      this.exit(token);
    }
    function exitContainerDataSection(token) {
      let section = this.stack[this.stack.length - 1];
      section = attemptClosingOpenListSection.call(this, section);
      if (section.type === "componentContainerDataSection") {
        section.rawData = this.sliceSerialize(token);
        this.exit(token);
      }
    }
    function exitContainerSectionTitle(token) {
      this.stack[this.stack.length - 1].name = this.sliceSerialize(token)?.trim();
    }
    function enterLeaf(token) {
      enterToken.call(this, "leafComponent", token);
    }
    function enterTextSpan(token) {
      this.enter({ type: "textComponent", name: "span", attributes: {}, children: [] }, token);
    }
    function enterText(token) {
      enterToken.call(this, "textComponent", token);
    }
    function enterToken(type, token) {
      this.enter({ type, name: "", attributes: {}, children: [] }, token);
    }
    function componentContainerName(token) {
      this.stack[this.stack.length - 1].name = kebabCase(this.sliceSerialize(token));
    }
    function exitName(token) {
      this.stack[this.stack.length - 1].name = this.sliceSerialize(token);
    }
    function enterContainerLabel(token) {
      this.enter({ type: "paragraph", data: { componentLabel: true }, children: [] }, token);
    }
    function exitContainerLabel(token) {
      this.exit(token);
    }
    function enterAttributes() {
      this.data.componentAttributes = [];
      this.buffer();
    }
    function exitAttributeIdValue(token) {
      this.data.componentAttributes.push(["id", parseEntities(this.sliceSerialize(token))]);
    }
    function exitAttributeClassValue(token) {
      this.data.componentAttributes.push(["class", parseEntities(this.sliceSerialize(token))]);
    }
    function exitAttributeValue(token) {
      const attributes2 = this.data.componentAttributes;
      const lastAttribute = attributes2[attributes2.length - 1];
      lastAttribute[1] = (typeof lastAttribute[1] === "string" ? lastAttribute[1] : "") + parseEntities(this.sliceSerialize(token));
    }
    function exitAttributeName(token) {
      this.data.componentAttributes.push([this.sliceSerialize(token), true]);
    }
    function exitAttributes() {
      const attributes2 = this.data.componentAttributes;
      const cleaned = {};
      let index2 = -1;
      let attribute;
      while (++index2 < attributes2.length) {
        attribute = attributes2[index2];
        const name = kebabCase(attribute[0]);
        if (name === "class" && cleaned.class) {
          cleaned.class += " " + attribute[1];
        } else {
          cleaned[name] = attribute[1];
        }
      }
      this.data.componentAttributes = attributes2;
      this.resume();
      let stackTop = this.stack[this.stack.length - 1];
      if (stackTop?.type !== "textComponent" || stackTop?.name === "span") {
        while (!stackTop?.position?.end && stackTop.children?.length > 0) {
          stackTop = stackTop.children[stackTop.children.length - 1];
        }
      }
      stackTop.attributes = opts.attributes?.preserveOrder ? { __order__: { type: "map", value: attributes2 }, ...cleaned } : cleaned;
    }
    function exitToken(token) {
      this.exit(token);
    }
    function conditionalExit(token) {
      const [section] = this.tokenStack[this.tokenStack.length - 1];
      if (section.type === token.type) {
        this.exit(token);
      }
    }
    function attemptClosingOpenListSection(section) {
      while (section.type === "listItem" || section.type === "list") {
        const [stackToken] = this.tokenStack[this.tokenStack.length - 1];
        this.exit(stackToken);
        section = this.stack[this.stack.length - 1];
      }
      return section;
    }
    return {
      canContainEols,
      enter,
      exit: exit3
    };
  };
  var ContainerSequenceSize = 2;
  var SectionSequenceSize = 3;
  var slotSeparatorCode = 35;
  var slotSeparatorLength = 1;
  var Codes = {
    /**
     * null
     */
    EOF: null,
    /**
     * ' '
     */
    space: 32,
    /**
     * '"'
     */
    quotationMark: 34,
    /**
     * '#'
     */
    hash: 35,
    /**
     * ' ' '
     */
    apostrophe: 39,
    /**
     * '('
     */
    openingParentheses: 40,
    /**
     * '*'
     */
    star: 42,
    /**
     * '-'
     */
    dash: 45,
    /**
     * '.'
     */
    dot: 46,
    /**
     * ':'
     */
    colon: 58,
    /**
     * '<'
     */
    LessThan: 60,
    /**
     * '='
     */
    equals: 61,
    /**
     * '>'
     */
    greaterThan: 62,
    /**
     * 'X'
     */
    uppercaseX: 88,
    /**
     * '['
     */
    openingSquareBracket: 91,
    /**
     * '\'
     */
    backSlash: 92,
    /**
     * ']'
     */
    closingSquareBracket: 93,
    /**
     * '_'
     */
    underscore: 95,
    /**
     * '`'
     */
    backTick: 96,
    /**
     * 'x'
     */
    lowercaseX: 120,
    /**
     * '{'
     */
    openingCurlyBracket: 123,
    /**
     * '}'
     */
    closingCurlyBracket: 125,
    /**
     * '~'
     */
    tilde: 126
  };
  function createLabel(effects, ok3, nok, type, markerType, stringType, disallowEol) {
    let size = 0;
    let balance = 0;
    return start;
    function start(code4) {
      if (code4 !== Codes.openingSquareBracket) {
        throw new Error("expected `[`");
      }
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code4);
      effects.exit(markerType);
      return afterStart;
    }
    function afterStart(code4) {
      if (code4 === Codes.closingSquareBracket) {
        effects.enter(markerType);
        effects.consume(code4);
        effects.exit(markerType);
        effects.exit(type);
        return ok3;
      }
      effects.enter(stringType);
      return atBreak(code4);
    }
    function atBreak(code4) {
      if (code4 === Codes.EOF || size > 999) {
        return nok(code4);
      }
      if (code4 === Codes.closingSquareBracket && !balance--) {
        return atClosingBrace(code4);
      }
      if (markdownLineEnding(code4)) {
        if (disallowEol) {
          return nok(code4);
        }
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return atBreak;
      }
      effects.enter("chunkText", { contentType: "text" });
      return label2(code4);
    }
    function label2(code4) {
      if (code4 === Codes.EOF || markdownLineEnding(code4) || size > 999) {
        effects.exit("chunkText");
        return atBreak(code4);
      }
      if (code4 === Codes.openingSquareBracket && ++balance > 3) {
        return nok(code4);
      }
      if (code4 === Codes.closingSquareBracket && !balance--) {
        effects.exit("chunkText");
        return atClosingBrace(code4);
      }
      effects.consume(code4);
      return code4 === Codes.backSlash ? labelEscape : label2;
    }
    function atClosingBrace(code4) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code4);
      effects.exit(markerType);
      effects.exit(type);
      return ok3;
    }
    function labelEscape(code4) {
      if (code4 === Codes.openingSquareBracket || code4 === Codes.backSlash || code4 === Codes.closingSquareBracket) {
        effects.consume(code4);
        size++;
        return label2;
      }
      return label2(code4);
    }
  }
  var label$2 = { tokenize: tokenizeLabel$2, partial: true };
  var gfmCheck = { tokenize: checkGfmTaskCheckbox, partial: true };
  var doubleBracketCheck = { tokenize: checkDoubleBracket, partial: true };
  function tokenize$6(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 !== Codes.openingSquareBracket) {
        throw new Error("expected `[`");
      }
      if (self2.previous === Codes.EOF && self2._gfmTasklistFirstContentOfListItem) {
        return effects.check(gfmCheck, nok, attemptLabel)(code4);
      }
      if (self2.previous === Codes.openingSquareBracket) {
        return nok(code4);
      }
      return effects.check(doubleBracketCheck, nok, attemptLabel)(code4);
    }
    function attemptLabel(code4) {
      effects.enter("textSpan");
      return effects.attempt(label$2, exit3, nok)(code4);
    }
    function exit3(code4) {
      if (code4 === Codes.openingParentheses || code4 === Codes.openingSquareBracket) {
        return nok(code4);
      }
      return exitOK(code4);
    }
    function exitOK(code4) {
      effects.exit("textSpan");
      return ok3(code4);
    }
  }
  function tokenizeLabel$2(effects, ok3, nok) {
    return createLabel(effects, ok3, nok, "componentTextLabel", "componentTextLabelMarker", "componentTextLabelString");
  }
  var tokenizeSpan = {
    tokenize: tokenize$6
  };
  function checkGfmTaskCheckbox(effects, ok3, nok) {
    return enter;
    function enter(code4) {
      effects.enter("formGfmTaskCheckbox");
      effects.consume(code4);
      return check;
    }
    function check(code4) {
      if (markdownSpace(code4)) {
        effects.consume(code4);
        return check;
      }
      if (code4 === Codes.uppercaseX || code4 === Codes.lowercaseX) {
        effects.consume(code4);
        return check;
      }
      if (code4 === Codes.closingSquareBracket) {
        effects.exit("formGfmTaskCheckbox");
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function checkDoubleBracket(effects, ok3, nok) {
    return enter;
    function enter(code4) {
      effects.enter("doubleBracket");
      effects.consume(code4);
      return check;
    }
    function check(code4) {
      if (code4 !== Codes.openingSquareBracket) {
        return nok(code4);
      }
      effects.exit("doubleBracket");
      return ok3(code4);
    }
  }
  function createAttributes(effects, ok3, nok, attributesType, attributesMarkerType, attributeType, attributeIdType, attributeClassType, attributeNameType, attributeInitializerType, attributeValueLiteralType, attributeValueType, attributeValueMarker, attributeValueData, disallowEol) {
    let type;
    let marker;
    let isBindAttribute = false;
    return start;
    function start(code4) {
      effects.enter(attributesType);
      effects.enter(attributesMarkerType);
      effects.consume(code4);
      effects.exit(attributesMarkerType);
      return between;
    }
    function between(code4) {
      if (code4 === Codes.hash) {
        type = attributeIdType;
        return shortcutStart(code4);
      }
      if (code4 === Codes.dot) {
        type = attributeClassType;
        return shortcutStart(code4);
      }
      if (code4 === Codes.colon || code4 === Codes.underscore || asciiAlpha(code4)) {
        effects.enter(attributeType);
        effects.enter(attributeNameType);
        effects.consume(code4);
        isBindAttribute = code4 === Codes.colon;
        return code4 === Codes.colon ? bindAttributeName : name;
      }
      if (disallowEol && markdownSpace(code4)) {
        return factorySpace(effects, between, "whitespace")(code4);
      }
      if (!disallowEol && markdownLineEndingOrSpace(code4)) {
        return factoryWhitespace(effects, between)(code4);
      }
      return end(code4);
    }
    function shortcutStart(code4) {
      effects.enter(attributeType);
      effects.enter(type);
      effects.enter(type + "Marker");
      effects.consume(code4);
      effects.exit(type + "Marker");
      return shortcutStartAfter;
    }
    function shortcutStartAfter(code4) {
      if (code4 === Codes.EOF || code4 === Codes.quotationMark || code4 === Codes.hash || code4 === Codes.apostrophe || code4 === Codes.dot || code4 === Codes.LessThan || code4 === Codes.equals || code4 === Codes.greaterThan || code4 === Codes.backTick || code4 === Codes.closingCurlyBracket || markdownLineEndingOrSpace(code4)) {
        return nok(code4);
      }
      effects.enter(type + "Value");
      effects.consume(code4);
      return shortcut2;
    }
    function shortcut2(code4) {
      if (code4 === Codes.EOF || code4 === Codes.quotationMark || code4 === Codes.apostrophe || code4 === Codes.LessThan || code4 === Codes.equals || code4 === Codes.greaterThan || code4 === Codes.backTick) {
        return nok(code4);
      }
      if (code4 === Codes.dot || code4 === Codes.closingCurlyBracket || markdownLineEndingOrSpace(code4)) {
        effects.exit(type + "Value");
        effects.exit(type);
        effects.exit(attributeType);
        return between(code4);
      }
      effects.consume(code4);
      return shortcut2;
    }
    function bindAttributeName(code4) {
      if (code4 === Codes.dash || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return bindAttributeName;
      }
      effects.exit(attributeNameType);
      if (disallowEol && markdownSpace(code4)) {
        return factorySpace(effects, bindAttributeNameAfter, "whitespace")(code4);
      }
      if (!disallowEol && markdownLineEndingOrSpace(code4)) {
        return factoryWhitespace(effects, bindAttributeNameAfter)(code4);
      }
      return bindAttributeNameAfter(code4);
    }
    function bindAttributeNameAfter(code4) {
      if (code4 === Codes.equals) {
        effects.enter(attributeInitializerType);
        effects.consume(code4);
        effects.exit(attributeInitializerType);
        return valueBefore;
      }
      effects.exit(attributeType);
      return nok(code4);
    }
    function name(code4) {
      if (code4 === Codes.dash || code4 === Codes.dot || code4 === Codes.colon || code4 === Codes.underscore || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return name;
      }
      effects.exit(attributeNameType);
      if (disallowEol && markdownSpace(code4)) {
        return factorySpace(effects, nameAfter, "whitespace")(code4);
      }
      if (!disallowEol && markdownLineEndingOrSpace(code4)) {
        return factoryWhitespace(effects, nameAfter)(code4);
      }
      return nameAfter(code4);
    }
    function nameAfter(code4) {
      if (code4 === Codes.equals) {
        effects.enter(attributeInitializerType);
        effects.consume(code4);
        effects.exit(attributeInitializerType);
        return valueBefore;
      }
      effects.exit(attributeType);
      return between(code4);
    }
    function valueBefore(code4) {
      if (code4 === Codes.EOF || code4 === Codes.LessThan || code4 === Codes.equals || code4 === Codes.greaterThan || code4 === Codes.backTick || code4 === Codes.closingCurlyBracket || disallowEol && markdownLineEnding(code4)) {
        return nok(code4);
      }
      if (code4 === Codes.quotationMark || code4 === Codes.apostrophe) {
        effects.enter(attributeValueLiteralType);
        effects.enter(attributeValueMarker);
        effects.consume(code4);
        effects.exit(attributeValueMarker);
        marker = code4;
        return valueQuotedStart;
      }
      if (disallowEol && markdownSpace(code4)) {
        return factorySpace(effects, valueBefore, "whitespace")(code4);
      }
      if (!disallowEol && markdownLineEndingOrSpace(code4)) {
        return factoryWhitespace(effects, valueBefore)(code4);
      }
      effects.enter(attributeValueType);
      effects.enter(attributeValueData);
      effects.consume(code4);
      marker = void 0;
      return valueUnquoted;
    }
    function valueUnquoted(code4) {
      if (code4 === Codes.EOF || code4 === Codes.quotationMark || code4 === Codes.apostrophe || code4 === Codes.LessThan || code4 === Codes.equals || code4 === Codes.greaterThan || code4 === Codes.backTick) {
        return nok(code4);
      }
      if (code4 === Codes.closingCurlyBracket || markdownLineEndingOrSpace(code4)) {
        effects.exit(attributeValueData);
        effects.exit(attributeValueType);
        effects.exit(attributeType);
        return between(code4);
      }
      effects.consume(code4);
      return valueUnquoted;
    }
    function valueQuotedStart(code4) {
      if (code4 === marker) {
        effects.enter(attributeValueMarker);
        effects.consume(code4);
        effects.exit(attributeValueMarker);
        effects.exit(attributeValueLiteralType);
        effects.exit(attributeType);
        return valueQuotedAfter;
      }
      effects.enter(attributeValueType);
      return valueQuotedBetween(code4);
    }
    function valueQuotedBetween(code4) {
      if (code4 === marker) {
        effects.exit(attributeValueType);
        return valueQuotedStart(code4);
      }
      if (code4 === Codes.EOF) {
        return nok(code4);
      }
      if (markdownLineEnding(code4)) {
        return disallowEol ? nok(code4) : factoryWhitespace(effects, valueQuotedBetween)(code4);
      }
      effects.enter(attributeValueData);
      effects.consume(code4);
      return valueQuoted;
    }
    function valueQuoted(code4) {
      if (isBindAttribute && code4 === Codes.backSlash) {
        effects.exit(attributeValueData);
        effects.exit(attributeValueType);
        effects.enter("escapeCharacter");
        effects.consume(code4);
        effects.exit("escapeCharacter");
        effects.enter(attributeValueType);
        effects.enter(attributeValueData);
        return valueQuotedEscape;
      }
      if (code4 === marker || code4 === Codes.EOF || markdownLineEnding(code4)) {
        effects.exit(attributeValueData);
        return valueQuotedBetween(code4);
      }
      effects.consume(code4);
      return valueQuoted;
    }
    function valueQuotedEscape(code4) {
      effects.consume(code4);
      return valueQuoted;
    }
    function valueQuotedAfter(code4) {
      return code4 === Codes.closingCurlyBracket || markdownLineEndingOrSpace(code4) ? between(code4) : end(code4);
    }
    function end(code4) {
      if (code4 === Codes.closingCurlyBracket) {
        effects.enter(attributesMarkerType);
        effects.consume(code4);
        effects.exit(attributesMarkerType);
        effects.exit(attributesType);
        return ok3;
      }
      return nok(code4);
    }
  }
  var attributes$2 = { tokenize: tokenizeAttributes$2, partial: true };
  var validEvents = [
    /**
     * Span
     */
    "textSpan",
    /**
     * Bold & Italic
     */
    "attentionSequence",
    /**
     * Inline Code
     */
    "codeText",
    /**
     * Link
     */
    "link",
    /**
     * Image
     */
    "image"
  ];
  function tokenize$5(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 !== Codes.openingCurlyBracket) {
        throw new Error("expected `{`");
      }
      const event = self2.events[self2.events.length - 1];
      if (markdownLineEnding(self2.previous) || !event || !validEvents.includes(event[1].type)) {
        return nok(code4);
      }
      return effects.attempt(attributes$2, ok3, nok)(code4);
    }
  }
  function tokenizeAttributes$2(effects, ok3, nok) {
    return createAttributes(
      effects,
      ok3,
      nok,
      "componentTextAttributes",
      "componentTextAttributesMarker",
      "componentTextAttribute",
      "componentTextAttributeId",
      "componentTextAttributeClass",
      "componentTextAttributeName",
      "componentTextAttributeInitializerMarker",
      "componentTextAttributeValueLiteral",
      "componentTextAttributeValue",
      "componentTextAttributeValueMarker",
      "componentTextAttributeValueData"
    );
  }
  var tokenizeAttribute = {
    tokenize: tokenize$5
  };
  function attempClose(effects, ok3, nok) {
    return start;
    function start(code4) {
      if (code4 !== Codes.closingCurlyBracket) {
        return nok(code4);
      }
      effects.exit("bindingContent");
      effects.enter("bindingFence");
      effects.consume(code4);
      return secondBracket;
    }
    function secondBracket(code4) {
      if (code4 !== Codes.closingCurlyBracket) {
        return nok(code4);
      }
      effects.consume(code4);
      effects.exit("bindingFence");
      return ok3;
    }
  }
  function tokenize$4(effects, ok3, nok) {
    return start;
    function start(code4) {
      if (code4 !== Codes.openingCurlyBracket) {
        throw new Error("expected `{`");
      }
      effects.enter("bindingFence");
      effects.consume(code4);
      return secondBracket;
    }
    function secondBracket(code4) {
      if (code4 !== Codes.openingCurlyBracket) {
        return nok(code4);
      }
      effects.consume(code4);
      effects.exit("bindingFence");
      effects.enter("bindingContent");
      return content3;
    }
    function content3(code4) {
      if (code4 === Codes.closingCurlyBracket) {
        return effects.attempt({ tokenize: attempClose, partial: true }, close, (code22) => {
          effects.consume(code22);
          return content3;
        })(code4);
      }
      effects.consume(code4);
      return content3;
    }
    function close(code4) {
      return ok3(code4);
    }
  }
  var tokenizeBinding = {
    tokenize: tokenize$4
  };
  function createName(effects, ok3, nok, nameType) {
    const self2 = this;
    return start;
    function start(code4) {
      if (asciiAlpha(code4)) {
        effects.enter(nameType);
        effects.consume(code4);
        return name;
      }
      return nok(code4);
    }
    function name(code4) {
      if (code4 === Codes.dash || code4 === Codes.underscore || asciiAlphanumeric(code4)) {
        effects.consume(code4);
        return name;
      }
      effects.exit(nameType);
      return self2.previous === Codes.underscore ? nok(code4) : ok3(code4);
    }
  }
  var label$1 = { tokenize: tokenizeLabel$1, partial: true };
  var attributes$1 = { tokenize: tokenizeAttributes$1, partial: true };
  function previous3(code4) {
    return code4 !== Codes.colon || this.events[this.events.length - 1]?.[1]?.type === "characterEscape";
  }
  function tokenize$3(effects, ok3, nok) {
    const self2 = this;
    return start;
    function start(code4) {
      if (code4 !== Codes.colon) {
        throw new Error("expected `:`");
      }
      if (self2.previous !== null && !markdownLineEndingOrSpace(self2.previous) && ![Codes.openingSquareBracket, Codes.star, Codes.underscore, Codes.openingParentheses].includes(self2.previous)) {
        return nok(code4);
      }
      if (!previous3.call(self2, self2.previous)) {
        throw new Error("expected correct previous");
      }
      effects.enter("componentText");
      effects.enter("componentTextMarker");
      effects.consume(code4);
      effects.exit("componentTextMarker");
      return createName.call(self2, effects, afterName, nok, "componentTextName");
    }
    function afterName(code4) {
      if (code4 === Codes.colon) {
        return nok(code4);
      }
      if (code4 === Codes.openingSquareBracket) {
        return effects.attempt(label$1, afterLabel, afterLabel)(code4);
      }
      if (code4 === Codes.openingCurlyBracket) {
        return effects.attempt(attributes$1, afterAttributes, afterAttributes)(code4);
      }
      return exit3(code4);
    }
    function afterAttributes(code4) {
      if (code4 === Codes.openingSquareBracket) {
        return effects.attempt(label$1, afterLabel, afterLabel)(code4);
      }
      return exit3(code4);
    }
    function afterLabel(code4) {
      if (code4 === Codes.openingCurlyBracket) {
        return effects.attempt(attributes$1, exit3, exit3)(code4);
      }
      return exit3(code4);
    }
    function exit3(code4) {
      effects.exit("componentText");
      return ok3(code4);
    }
  }
  function tokenizeLabel$1(effects, ok3, nok) {
    return createLabel(effects, ok3, nok, "componentTextLabel", "componentTextLabelMarker", "componentTextLabelString");
  }
  function tokenizeAttributes$1(effects, ok3, nok) {
    return createAttributes(
      effects,
      ok3,
      nok,
      "componentTextAttributes",
      "componentTextAttributesMarker",
      "componentTextAttribute",
      "componentTextAttributeId",
      "componentTextAttributeClass",
      "componentTextAttributeName",
      "componentTextAttributeInitializerMarker",
      "componentTextAttributeValueLiteral",
      "componentTextAttributeValue",
      "componentTextAttributeValueMarker",
      "componentTextAttributeValueData"
    );
  }
  var tokenizeInline = {
    tokenize: tokenize$3,
    previous: previous3
  };
  function sizeChunks(chunks) {
    let index2 = -1;
    let size = 0;
    while (++index2 < chunks.length) {
      size += typeof chunks[index2] === "string" ? chunks[index2].length : 1;
    }
    return size;
  }
  function prefixSize(events, type) {
    const tail = events[events.length - 1];
    if (!tail || tail[1].type !== type) {
      return 0;
    }
    return sizeChunks(tail[2].sliceStream(tail[1]));
  }
  function linePrefixSize(events) {
    let size = 0;
    let index2 = events.length - 1;
    let tail = events[index2];
    while (index2 >= 0 && tail && tail[1].type === "linePrefix" && tail[0] === "exit") {
      size += sizeChunks(tail[2].sliceStream(tail[1]));
      index2 -= 1;
      tail = events[index2];
    }
    return size;
  }
  var useTokenState = (tokenName) => {
    const token = {
      isOpen: false,
      /**
       * Enter into token, close previous open token if any
       */
      enter: (effects) => {
        const initialState = token.isOpen;
        token.exit(effects);
        effects.enter(tokenName);
        token.isOpen = true;
        return () => {
          token.isOpen = initialState;
        };
      },
      /**
       * Enter into token only once, if token is already open, do nothing
       */
      enterOnce: (effects) => {
        const initialState = token.isOpen;
        if (!token.isOpen) {
          effects.enter(tokenName);
          token.isOpen = true;
        }
        return () => {
          token.isOpen = initialState;
        };
      },
      /**
       * Exit from token if it is open
       */
      exit: (effects) => {
        const initialState = token.isOpen;
        if (token.isOpen) {
          effects.exit(tokenName);
          token.isOpen = false;
        }
        return () => {
          token.isOpen = initialState;
        };
      }
    };
    return token;
  };
  var tokenizeCodeFence = { tokenize: checkCodeFenced, partial: true };
  function checkCodeFenced(effects, ok3, nok) {
    let backTickCount = 0;
    return start;
    function start(code4) {
      effects.enter("codeFenced");
      return after(code4);
    }
    function after(code4) {
      if (code4 === Codes.backTick || code4 === Codes.tilde) {
        backTickCount++;
        effects.consume(code4);
        return after;
      }
      effects.exit("codeFenced");
      if (backTickCount >= 3) {
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  function tokenizeFrontMatter(effects, ok3, _nok, next, initialPrefix) {
    let previous4;
    return effects.attempt({
      tokenize: tokenizeDataSection,
      partial: true
    }, dataSectionOpen, next);
    function tokenizeDataSection(effects2, ok22, nok) {
      const self2 = this;
      let size = 0;
      let sectionIndentSize = 0;
      return closingPrefixAfter;
      function dataLineFirstSpaces(code4) {
        if (markdownSpace(code4)) {
          effects2.consume(code4);
          sectionIndentSize += 1;
          return dataLineFirstSpaces;
        }
        effects2.exit("space");
        return closingPrefixAfter(code4);
      }
      function closingPrefixAfter(code4) {
        if (markdownSpace(code4)) {
          effects2.enter("space");
          return dataLineFirstSpaces(code4);
        }
        if (sectionIndentSize === 0) {
          sectionIndentSize = linePrefixSize(self2.events);
        }
        effects2.enter("componentContainerSectionSequence");
        return closingSectionSequence(code4);
      }
      function closingSectionSequence(code4) {
        if (code4 === Codes.dash || markdownSpace(code4)) {
          effects2.consume(code4);
          size++;
          return closingSectionSequence;
        }
        if (size < SectionSequenceSize) {
          return nok(code4);
        }
        if (sectionIndentSize !== initialPrefix) {
          return nok(code4);
        }
        if (!markdownLineEnding(code4)) {
          return nok(code4);
        }
        effects2.exit("componentContainerSectionSequence");
        return factorySpace(effects2, ok22, "whitespace")(code4);
      }
    }
    function dataSectionOpen(code4) {
      effects.enter("componentContainerDataSection");
      return effects.attempt({
        tokenize: tokenizeDataSection,
        partial: true
      }, dataSectionClose, dataChunkStart)(code4);
    }
    function dataChunkStart(code4) {
      if (code4 === null) {
        effects.exit("componentContainerDataSection");
        effects.exit("componentContainer");
        return ok3(code4);
      }
      const token = effects.enter("chunkDocument", {
        contentType: "document",
        previous: previous4
      });
      if (previous4) {
        previous4.next = token;
      }
      previous4 = token;
      return dataContentContinue(code4);
    }
    function dataContentContinue(code4) {
      if (code4 === null) {
        effects.exit("chunkDocument");
        effects.exit("componentContainerDataSection");
        effects.exit("componentContainer");
        return ok3(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        effects.exit("chunkDocument");
        return effects.attempt({
          tokenize: tokenizeDataSection,
          partial: true
        }, dataSectionClose, dataChunkStart);
      }
      effects.consume(code4);
      return dataContentContinue;
    }
    function dataSectionClose(code4) {
      effects.exit("componentContainerDataSection");
      return factorySpace(effects, next, "whitespace")(code4);
    }
  }
  var label = { tokenize: tokenizeLabel, partial: true };
  var attributes = { tokenize: tokenizeAttributes, partial: true };
  function tokenize$2(effects, ok3, nok) {
    const self2 = this;
    const initialPrefix = linePrefixSize(this.events);
    let sizeOpen = 0;
    let previous4;
    const childContainersSequenceSize = [];
    let containerFirstLine = true;
    let possibleIndentedComponent = false;
    let containerIndentSize = 0;
    let visitingCodeFenced = false;
    let codeFenceStripped = false;
    const section = useTokenState("componentContainerSection");
    return start;
    function start(code4) {
      if (code4 !== Codes.colon) {
        throw new Error("expected `:`");
      }
      effects.enter("componentContainer");
      effects.enter("componentContainerFence");
      effects.enter("componentContainerSequence");
      return sequenceOpen(code4);
    }
    function tokenizeSectionClosing(effects2, ok22, nok2) {
      let size = 0;
      let sectionIndentSize = 0;
      let revertSectionState;
      return closingPrefixAfter;
      function closingPrefixAfter(code4) {
        sectionIndentSize = linePrefixSize(self2.events);
        revertSectionState = section.exit(effects2);
        effects2.enter("componentContainerSectionSequence");
        return closingSectionSequence(code4);
      }
      function closingSectionSequence(code4) {
        if (code4 === slotSeparatorCode) {
          effects2.consume(code4);
          size++;
          return closingSectionSequence;
        }
        if (size !== slotSeparatorLength) {
          revertSectionState();
          return nok2(code4);
        }
        if (sectionIndentSize !== initialPrefix) {
          revertSectionState();
          return nok2(code4);
        }
        if (!asciiAlpha(code4)) {
          revertSectionState();
          return nok2(code4);
        }
        effects2.exit("componentContainerSectionSequence");
        return factorySpace(effects2, ok22, "whitespace")(code4);
      }
    }
    function sectionOpen(code4) {
      previous4 = void 0;
      section.enter(effects);
      if (markdownLineEnding(code4)) {
        return factorySpace(effects, lineStart, "whitespace")(code4);
      }
      effects.enter("componentContainerSectionTitle");
      return sectionTitle(code4);
    }
    function sectionTitle(code4) {
      if (code4 === Codes.openingCurlyBracket) {
        return effects.check(
          attributes,
          (code22) => {
            effects.exit("componentContainerSectionTitle");
            return effects.attempt(attributes, factorySpace(effects, lineStart, "linePrefix", 4), nok)(code22);
          },
          (code22) => {
            effects.consume(code22);
            return sectionTitle;
          }
        )(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.exit("componentContainerSectionTitle");
        return factorySpace(effects, lineStart, "linePrefix", 4)(code4);
      }
      effects.consume(code4);
      return sectionTitle;
    }
    function sequenceOpen(code4) {
      if (code4 === Codes.colon) {
        effects.consume(code4);
        sizeOpen++;
        return sequenceOpen;
      }
      if (sizeOpen < ContainerSequenceSize) {
        return nok(code4);
      }
      effects.exit("componentContainerSequence");
      return createName.call(self2, effects, afterName, nok, "componentContainerName")(code4);
    }
    function afterName(code4) {
      return code4 === Codes.openingSquareBracket ? effects.attempt(label, afterLabel, afterLabel)(code4) : afterLabel(code4);
    }
    function afterLabel(code4) {
      return code4 === Codes.openingCurlyBracket ? effects.attempt(attributes, afterAttributes, afterAttributes)(code4) : afterAttributes(code4);
    }
    function afterAttributes(code4) {
      return factorySpace(effects, openAfter, "whitespace")(code4);
    }
    function openAfter(code4) {
      effects.exit("componentContainerFence");
      if (code4 === null) {
        effects.exit("componentContainer");
        return ok3(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.enter("lineEnding");
        effects.consume(code4);
        effects.exit("lineEnding");
        return self2.interrupt ? ok3 : contentStart;
      }
      return nok(code4);
    }
    function contentStart(code4) {
      if (code4 === null) {
        effects.exit("componentContainer");
        return ok3(code4);
      }
      if (containerFirstLine && (code4 === Codes.dash || markdownSpace(code4))) {
        containerFirstLine = false;
        return tokenizeFrontMatter(effects, ok3, nok, contentStart, initialPrefix)(code4);
      }
      effects.enter("componentContainerContent");
      return lineStart(code4);
    }
    function lineStartAfterPrefix(code4) {
      if (code4 === null) {
        return after(code4);
      }
      if (code4 === Codes.backTick || code4 === Codes.tilde) {
        return effects.check(
          tokenizeCodeFence,
          (code22) => {
            if (visitingCodeFenced) {
              codeFenceStripped = false;
            }
            visitingCodeFenced = !visitingCodeFenced;
            return chunkStart(code22);
          },
          chunkStart
        )(code4);
      }
      if (visitingCodeFenced) {
        return chunkStart(code4);
      }
      if (!childContainersSequenceSize.length && (code4 === slotSeparatorCode || code4 === Codes.space)) {
        return effects.attempt(
          { tokenize: tokenizeSectionClosing, partial: true },
          sectionOpen,
          chunkStart
        )(code4);
      }
      if (code4 === Codes.colon) {
        return effects.attempt(
          { tokenize: tokenizeClosingFence, partial: true },
          after,
          chunkStart
        )(code4);
      }
      return chunkStart(code4);
    }
    function dentendIndentedCommponent(code4) {
      if (containerIndentSize) {
        if (visitingCodeFenced && !codeFenceStripped) {
          return lineStartAfterPrefix(code4);
        }
        const checkpoint = self2.events.length;
        return factorySpace(effects, (code22) => {
          if ((code22 === Codes.backTick || code22 === Codes.tilde) && !visitingCodeFenced) {
            codeFenceStripped = linePrefixSize(self2.events.slice(checkpoint)) >= containerIndentSize;
          }
          return lineStartAfterPrefix(code22);
        }, "linePrefix", containerIndentSize + 1)(code4);
      }
      return lineStartAfterPrefix(code4);
    }
    function attemptIntentedCommponent(code4) {
      if (containerIndentSize) {
        if (visitingCodeFenced && !codeFenceStripped) {
          return lineStartAfterPrefix(code4);
        }
        const checkpoint = self2.events.length;
        return factorySpace(effects, (code22) => {
          if ((code22 === Codes.backTick || code22 === Codes.tilde) && !visitingCodeFenced) {
            codeFenceStripped = linePrefixSize(self2.events.slice(checkpoint)) >= containerIndentSize;
          }
          return lineStartAfterPrefix(code22);
        }, "linePrefix", containerIndentSize + 1)(code4);
      }
      if (visitingCodeFenced) {
        return lineStartAfterPrefix(code4);
      }
      return effects.check(
        { tokenize: tokenizeContainerIndent, partial: true },
        dentendIndentedCommponent,
        lineStartAfterPrefix
      )(code4);
    }
    function lineStart(code4) {
      if (code4 === null) {
        return after(code4);
      }
      let nextState = dentendIndentedCommponent;
      if (possibleIndentedComponent) {
        nextState = attemptIntentedCommponent;
      }
      possibleIndentedComponent = markdownLineEnding(code4);
      return initialPrefix > 0 ? factorySpace(effects, nextState, "linePrefix", initialPrefix + 1)(code4) : nextState(code4);
    }
    function chunkStart(code4) {
      if (code4 === null) {
        return after(code4);
      }
      section.enterOnce(effects);
      const token = effects.enter("chunkDocument", {
        contentType: "document",
        previous: previous4
      });
      if (previous4) {
        previous4.next = token;
      }
      previous4 = token;
      return contentContinue(code4);
    }
    function contentContinue(code4) {
      if (code4 === null) {
        effects.exit("chunkDocument");
        return after(code4);
      }
      if (markdownLineEnding(code4)) {
        effects.consume(code4);
        effects.exit("chunkDocument");
        return lineStart;
      }
      effects.consume(code4);
      return contentContinue;
    }
    function after(code4) {
      section.exit(effects);
      effects.exit("componentContainerContent");
      effects.exit("componentContainer");
      return ok3(code4);
    }
    function tokenizeClosingFence(effects2, ok22, nok2) {
      let size = 0;
      return factorySpace(effects2, closingPrefixAfter, "linePrefix", 4);
      function closingPrefixAfter(code4) {
        effects2.enter("componentContainerFence");
        effects2.enter("componentContainerSequence");
        return closingSequence(code4);
      }
      function closingSequence(code4) {
        if (code4 === Codes.colon) {
          effects2.consume(code4);
          size++;
          return closingSequence;
        }
        if (childContainersSequenceSize.length) {
          if (size === childContainersSequenceSize[childContainersSequenceSize.length - 1]) {
            childContainersSequenceSize.pop();
          }
          return nok2(code4);
        }
        if (size !== sizeOpen) {
          return nok2(code4);
        }
        effects2.exit("componentContainerSequence");
        return factorySpace(effects2, closingSequenceEnd, "whitespace")(code4);
      }
      function closingSequenceEnd(code4) {
        if (code4 === null || markdownLineEnding(code4)) {
          effects2.exit("componentContainerFence");
          return ok22(code4);
        }
        childContainersSequenceSize.push(size);
        return nok2(code4);
      }
    }
    function tokenizeContainerIndent(effects2, ok22, nok2) {
      let size = 0;
      function start2(code4) {
        if (code4 !== Codes.space) {
          return nok2(code4);
        }
        return factory(code4);
      }
      function factory(code4) {
        effects2.enter("linePrefix");
        if (code4 === Codes.space) {
          effects2.consume(code4);
          size += 1;
          return factory;
        }
        return containerCheck(code4);
      }
      return start2;
      function containerCheck(code4) {
        if (code4 === Codes.colon && size > 0) {
          containerIndentSize = size;
          return ok22(code4);
        }
        if (markdownLineEnding(code4)) {
          possibleIndentedComponent = false;
          containerIndentSize = 0;
          return ok22(code4);
        }
        return nok2(code4);
      }
    }
  }
  function tokenizeLabel(effects, ok3, nok) {
    return createLabel(
      effects,
      ok3,
      nok,
      "componentContainerLabel",
      "componentContainerLabelMarker",
      "componentContainerLabelString",
      true
    );
  }
  function tokenizeAttributes(effects, ok3, nok) {
    return createAttributes(
      effects,
      ok3,
      nok,
      "componentContainerAttributes",
      "componentContainerAttributesMarker",
      "componentContainerAttribute",
      "componentContainerAttributeId",
      "componentContainerAttributeClass",
      "componentContainerAttributeName",
      "componentContainerAttributeInitializerMarker",
      "componentContainerAttributeValueLiteral",
      "componentContainerAttributeValue",
      "componentContainerAttributeValueMarker",
      "componentContainerAttributeValueData",
      true
    );
  }
  var tokenizeContainer2 = {
    tokenize: tokenize$2,
    concrete: true
  };
  function tokenize$1(effects, ok3, nok) {
    const self2 = this;
    return factorySpace(effects, lineStart, "linePrefix");
    function lineStart(code4) {
      if (prefixSize(self2.events, "linePrefix") < 4) {
        return nok(code4);
      }
      switch (code4) {
        case Codes.backTick:
          return codeFenced.tokenize.call(self2, effects, ok3, nok)(code4);
        case Codes.colon:
          return tokenizeContainer2.tokenize.call(self2, effects, ok3, nok)(code4);
        default:
          return nok(code4);
      }
    }
  }
  var tokenizeContainerIndented = {
    tokenize: tokenize$1
  };
  function tokenize(effects, ok3, nok) {
    const self2 = this;
    const tokenizeSugerSyntax = tokenizeInline.tokenize.call(
      self2,
      effects,
      factorySpace(effects, exit3, "linePrefix"),
      nok
    );
    return factorySpace(effects, lineStart, "linePrefix");
    function lineStart(code4) {
      if (code4 === Codes.colon) {
        return tokenizeSugerSyntax(code4);
      }
      return nok(code4);
    }
    function exit3(code4) {
      if (markdownLineEnding(code4) || code4 === Codes.EOF) {
        return ok3(code4);
      }
      return nok(code4);
    }
  }
  var tokenizeContainerSuger = {
    tokenize
  };
  function micromarkComponentsExtension() {
    return {
      text: {
        [Codes.colon]: tokenizeInline,
        [Codes.openingSquareBracket]: [tokenizeSpan],
        [Codes.openingCurlyBracket]: [tokenizeBinding, tokenizeAttribute]
      },
      flow: {
        [Codes.colon]: [tokenizeContainer2, tokenizeContainerSuger]
      },
      flowInitial: {
        "-2": tokenizeContainerIndented,
        "-1": tokenizeContainerIndented,
        [Codes.space]: tokenizeContainerIndented
      }
    };
  }
  var toFrontMatter = (yamlString) => `---
${yamlString}
---`;
  var remarkMDC = (function remarkMDC2(opts = {}) {
    const data = this.data();
    if (opts.autoUnwrap === void 0 && opts.experimental?.autoUnwrap) {
      opts.autoUnwrap = opts.experimental.autoUnwrap ? { safeTypes: [] } : false;
    }
    opts.attributes ||= {};
    opts.attributes.maxLength = opts.attributes.maxLength ?? opts.maxAttributesLength ?? 80;
    opts.attributes.yamlCodeBlock = opts.attributes.yamlCodeBlock ?? opts.yamlCodeBlockProps ?? opts.experimental?.componentCodeBlockYamlProps ?? false;
    add("micromarkExtensions", micromarkComponentsExtension());
    add("fromMarkdownExtensions", fromMarkdown2(opts));
    add("toMarkdownExtensions", toMarkdown(opts));
    function add(field, value) {
      if (!data[field]) {
        data[field] = [];
      }
      data[field].push(value);
    }
    if (opts?.components?.length) {
      return async (tree, { data: data2 }) => {
        const jobs = [];
        visit(tree, ["textComponent", "leafComponent", "containerComponent"], (node2) => {
          bindNode(node2, opts["frontmatter"]);
          const { instance: handler, options } = opts.components.find((c) => c.name === node2.name) || {};
          if (handler) {
            jobs.push(handler(options)(node2, data2));
          }
        });
        await Promise.all(jobs);
        return tree;
      };
    }
    return (tree) => {
      visit(tree, ["textComponent", "leafComponent", "containerComponent"], (node2) => {
        bindNode(node2, opts["frontmatter"]);
      });
    };
  });
  function bindNode(node2, options) {
    const nodeData = node2.data || (node2.data = {});
    node2.fmAttributes = getNodeData(node2, options);
    nodeData.hName = kebabCase(node2.name);
    nodeData.hProperties = bindData(
      {
        ...node2.attributes,
        // Parse data slots and retrieve data
        ...node2.fmAttributes
      }
    );
  }
  function getNodeData(node2, options) {
    if (node2.rawData) {
      const yaml = node2.rawData.replace(/\s-+$/, "");
      const { data } = parseFrontMatter(toFrontMatter(yaml), options);
      return data;
    }
    return {};
  }
  function bindData(data) {
    const entries = Object.entries(data).map(([key2, value]) => {
      if (key2.startsWith(":")) {
        return [key2, value];
      }
      if (typeof value === "string") {
        return [key2, value];
      }
      return [`:${key2}`, JSON.stringify(value)];
    });
    return Object.fromEntries(entries);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
  function blockquote2(state, node2) {
    const result = {
      type: "element",
      tagName: "blockquote",
      properties: {},
      children: state.wrap(state.all(node2), true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/break.js
  function hardBreak2(state, node2) {
    const result = { type: "element", tagName: "br", properties: {}, children: [] };
    state.patch(node2, result);
    return [state.applyData(node2, result), { type: "text", value: "\n" }];
  }

  // node_modules/mdast-util-to-hast/lib/handlers/code.js
  function code3(state, node2) {
    const value = node2.value ? node2.value + "\n" : "";
    const properties = {};
    const language = node2.lang ? node2.lang.split(/\s+/) : [];
    if (language.length > 0) {
      properties.className = ["language-" + language[0]];
    }
    let result = {
      type: "element",
      tagName: "code",
      properties,
      children: [{ type: "text", value }]
    };
    if (node2.meta) {
      result.data = { meta: node2.meta };
    }
    state.patch(node2, result);
    result = state.applyData(node2, result);
    result = { type: "element", tagName: "pre", properties: {}, children: [result] };
    state.patch(node2, result);
    return result;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/delete.js
  function strikethrough(state, node2) {
    const result = {
      type: "element",
      tagName: "del",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
  function emphasis2(state, node2) {
    const result = {
      type: "element",
      tagName: "em",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
  function footnoteReference2(state, node2) {
    const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
    const id = String(node2.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    const index2 = state.footnoteOrder.indexOf(id);
    let counter;
    let reuseCounter = state.footnoteCounts.get(id);
    if (reuseCounter === void 0) {
      reuseCounter = 0;
      state.footnoteOrder.push(id);
      counter = state.footnoteOrder.length;
    } else {
      counter = index2 + 1;
    }
    reuseCounter += 1;
    state.footnoteCounts.set(id, reuseCounter);
    const link3 = {
      type: "element",
      tagName: "a",
      properties: {
        href: "#" + clobberPrefix + "fn-" + safeId,
        id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
        dataFootnoteRef: true,
        ariaDescribedBy: ["footnote-label"]
      },
      children: [{ type: "text", value: String(counter) }]
    };
    state.patch(node2, link3);
    const sup = {
      type: "element",
      tagName: "sup",
      properties: {},
      children: [link3]
    };
    state.patch(node2, sup);
    return state.applyData(node2, sup);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/heading.js
  function heading2(state, node2) {
    const result = {
      type: "element",
      tagName: "h" + node2.depth,
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/html.js
  function html2(state, node2) {
    if (state.options.allowDangerousHtml) {
      const result = { type: "raw", value: node2.value };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }
    return void 0;
  }

  // node_modules/mdast-util-to-hast/lib/revert.js
  function revert(state, node2) {
    const subtype = node2.referenceType;
    let suffix = "]";
    if (subtype === "collapsed") {
      suffix += "[]";
    } else if (subtype === "full") {
      suffix += "[" + (node2.label || node2.identifier) + "]";
    }
    if (node2.type === "imageReference") {
      return [{ type: "text", value: "![" + node2.alt + suffix }];
    }
    const contents = state.all(node2);
    const head2 = contents[0];
    if (head2 && head2.type === "text") {
      head2.value = "[" + head2.value;
    } else {
      contents.unshift({ type: "text", value: "[" });
    }
    const tail = contents[contents.length - 1];
    if (tail && tail.type === "text") {
      tail.value += suffix;
    } else {
      contents.push({ type: "text", value: suffix });
    }
    return contents;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
  function imageReference2(state, node2) {
    const id = String(node2.identifier).toUpperCase();
    const definition3 = state.definitionById.get(id);
    if (!definition3) {
      return revert(state, node2);
    }
    const properties = { src: normalizeUri(definition3.url || ""), alt: node2.alt };
    if (definition3.title !== null && definition3.title !== void 0) {
      properties.title = definition3.title;
    }
    const result = { type: "element", tagName: "img", properties, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/image.js
  function image2(state, node2) {
    const properties = { src: normalizeUri(node2.url) };
    if (node2.alt !== null && node2.alt !== void 0) {
      properties.alt = node2.alt;
    }
    if (node2.title !== null && node2.title !== void 0) {
      properties.title = node2.title;
    }
    const result = { type: "element", tagName: "img", properties, children: [] };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
  function inlineCode2(state, node2) {
    const text7 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
    state.patch(node2, text7);
    const result = {
      type: "element",
      tagName: "code",
      properties: {},
      children: [text7]
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
  function linkReference2(state, node2) {
    const id = String(node2.identifier).toUpperCase();
    const definition3 = state.definitionById.get(id);
    if (!definition3) {
      return revert(state, node2);
    }
    const properties = { href: normalizeUri(definition3.url || "") };
    if (definition3.title !== null && definition3.title !== void 0) {
      properties.title = definition3.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/link.js
  function link2(state, node2) {
    const properties = { href: normalizeUri(node2.url) };
    if (node2.title !== null && node2.title !== void 0) {
      properties.title = node2.title;
    }
    const result = {
      type: "element",
      tagName: "a",
      properties,
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/list-item.js
  function listItem2(state, node2, parent) {
    const results = state.all(node2);
    const loose = parent ? listLoose(parent) : listItemLoose(node2);
    const properties = {};
    const children = [];
    if (typeof node2.checked === "boolean") {
      const head2 = results[0];
      let paragraph3;
      if (head2 && head2.type === "element" && head2.tagName === "p") {
        paragraph3 = head2;
      } else {
        paragraph3 = { type: "element", tagName: "p", properties: {}, children: [] };
        results.unshift(paragraph3);
      }
      if (paragraph3.children.length > 0) {
        paragraph3.children.unshift({ type: "text", value: " " });
      }
      paragraph3.children.unshift({
        type: "element",
        tagName: "input",
        properties: { type: "checkbox", checked: node2.checked, disabled: true },
        children: []
      });
      properties.className = ["task-list-item"];
    }
    let index2 = -1;
    while (++index2 < results.length) {
      const child = results[index2];
      if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
        children.push({ type: "text", value: "\n" });
      }
      if (child.type === "element" && child.tagName === "p" && !loose) {
        children.push(...child.children);
      } else {
        children.push(child);
      }
    }
    const tail = results[results.length - 1];
    if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
      children.push({ type: "text", value: "\n" });
    }
    const result = { type: "element", tagName: "li", properties, children };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function listLoose(node2) {
    let loose = false;
    if (node2.type === "list") {
      loose = node2.spread || false;
      const children = node2.children;
      let index2 = -1;
      while (!loose && ++index2 < children.length) {
        loose = listItemLoose(children[index2]);
      }
    }
    return loose;
  }
  function listItemLoose(node2) {
    const spread = node2.spread;
    return spread === null || spread === void 0 ? node2.children.length > 1 : spread;
  }

  // node_modules/mdast-util-to-hast/lib/handlers/list.js
  function list3(state, node2) {
    const properties = {};
    const results = state.all(node2);
    let index2 = -1;
    if (typeof node2.start === "number" && node2.start !== 1) {
      properties.start = node2.start;
    }
    while (++index2 < results.length) {
      const child = results[index2];
      if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
        properties.className = ["contains-task-list"];
        break;
      }
    }
    const result = {
      type: "element",
      tagName: node2.ordered ? "ol" : "ul",
      properties,
      children: state.wrap(results, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
  function paragraph2(state, node2) {
    const result = {
      type: "element",
      tagName: "p",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/root.js
  function root2(state, node2) {
    const result = { type: "root", children: state.wrap(state.all(node2)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/strong.js
  function strong2(state, node2) {
    const result = {
      type: "element",
      tagName: "strong",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/unist-util-position/lib/index.js
  var pointEnd = point3("end");
  var pointStart = point3("start");
  function point3(type) {
    return point4;
    function point4(node2) {
      const point5 = node2 && node2.position && node2.position[type] || {};
      if (typeof point5.line === "number" && point5.line > 0 && typeof point5.column === "number" && point5.column > 0) {
        return {
          line: point5.line,
          column: point5.column,
          offset: typeof point5.offset === "number" && point5.offset > -1 ? point5.offset : void 0
        };
      }
    }
  }
  function position2(node2) {
    const start = pointStart(node2);
    const end = pointEnd(node2);
    if (start && end) {
      return { start, end };
    }
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table.js
  function table(state, node2) {
    const rows = state.all(node2);
    const firstRow = rows.shift();
    const tableContent = [];
    if (firstRow) {
      const head2 = {
        type: "element",
        tagName: "thead",
        properties: {},
        children: state.wrap([firstRow], true)
      };
      state.patch(node2.children[0], head2);
      tableContent.push(head2);
    }
    if (rows.length > 0) {
      const body3 = {
        type: "element",
        tagName: "tbody",
        properties: {},
        children: state.wrap(rows, true)
      };
      const start = pointStart(node2.children[1]);
      const end = pointEnd(node2.children[node2.children.length - 1]);
      if (start && end) body3.position = { start, end };
      tableContent.push(body3);
    }
    const result = {
      type: "element",
      tagName: "table",
      properties: {},
      children: state.wrap(tableContent, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table-row.js
  function tableRow(state, node2, parent) {
    const siblings2 = parent ? parent.children : void 0;
    const rowIndex = siblings2 ? siblings2.indexOf(node2) : 1;
    const tagName = rowIndex === 0 ? "th" : "td";
    const align = parent && parent.type === "table" ? parent.align : void 0;
    const length = align ? align.length : node2.children.length;
    let cellIndex = -1;
    const cells2 = [];
    while (++cellIndex < length) {
      const cell = node2.children[cellIndex];
      const properties = {};
      const alignValue = align ? align[cellIndex] : void 0;
      if (alignValue) {
        properties.align = alignValue;
      }
      let result2 = { type: "element", tagName, properties, children: [] };
      if (cell) {
        result2.children = state.all(cell);
        state.patch(cell, result2);
        result2 = state.applyData(cell, result2);
      }
      cells2.push(result2);
    }
    const result = {
      type: "element",
      tagName: "tr",
      properties: {},
      children: state.wrap(cells2, true)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
  function tableCell(state, node2) {
    const result = {
      type: "element",
      tagName: "td",
      // Assume body cell.
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/trim-lines/index.js
  var tab = 9;
  var space = 32;
  function trimLines(value) {
    const source = String(value);
    const search2 = /\r?\n|\r/g;
    let match = search2.exec(source);
    let last = 0;
    const lines = [];
    while (match) {
      lines.push(
        trimLine(source.slice(last, match.index), last > 0, true),
        match[0]
      );
      last = match.index + match[0].length;
      match = search2.exec(source);
    }
    lines.push(trimLine(source.slice(last), last > 0, false));
    return lines.join("");
  }
  function trimLine(value, start, end) {
    let startIndex = 0;
    let endIndex = value.length;
    if (start) {
      let code4 = value.codePointAt(startIndex);
      while (code4 === tab || code4 === space) {
        startIndex++;
        code4 = value.codePointAt(startIndex);
      }
    }
    if (end) {
      let code4 = value.codePointAt(endIndex - 1);
      while (code4 === tab || code4 === space) {
        endIndex--;
        code4 = value.codePointAt(endIndex - 1);
      }
    }
    return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
  }

  // node_modules/mdast-util-to-hast/lib/handlers/text.js
  function text5(state, node2) {
    const result = { type: "text", value: trimLines(String(node2.value)) };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
  function thematicBreak3(state, node2) {
    const result = {
      type: "element",
      tagName: "hr",
      properties: {},
      children: []
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }

  // node_modules/mdast-util-to-hast/lib/handlers/index.js
  var handlers = {
    blockquote: blockquote2,
    break: hardBreak2,
    code: code3,
    delete: strikethrough,
    emphasis: emphasis2,
    footnoteReference: footnoteReference2,
    heading: heading2,
    html: html2,
    imageReference: imageReference2,
    image: image2,
    inlineCode: inlineCode2,
    linkReference: linkReference2,
    link: link2,
    listItem: listItem2,
    list: list3,
    paragraph: paragraph2,
    // @ts-expect-error: root is different, but hard to type.
    root: root2,
    strong: strong2,
    table,
    tableCell,
    tableRow,
    text: text5,
    thematicBreak: thematicBreak3,
    toml: ignore,
    yaml: ignore,
    definition: ignore,
    footnoteDefinition: ignore
  };
  function ignore() {
    return void 0;
  }

  // node_modules/@ungap/structured-clone/esm/types.js
  var VOID = -1;
  var PRIMITIVE = 0;
  var ARRAY = 1;
  var OBJECT = 2;
  var DATE = 3;
  var REGEXP = 4;
  var MAP2 = 5;
  var SET = 6;
  var ERROR = 7;
  var BIGINT = 8;

  // node_modules/@ungap/structured-clone/esm/deserialize.js
  var env = typeof self === "object" ? self : globalThis;
  var guard = (name, init) => {
    switch (name) {
      case "Function":
      case "SharedWorker":
      case "Worker":
      case "eval":
      case "setInterval":
      case "setTimeout":
        throw new TypeError("unable to deserialize " + name);
    }
    return new env[name](init);
  };
  var deserializer = ($, _) => {
    const as = (out, index2) => {
      $.set(index2, out);
      return out;
    };
    const unpair = (index2) => {
      if ($.has(index2))
        return $.get(index2);
      const [type, value] = _[index2];
      switch (type) {
        case PRIMITIVE:
        case VOID:
          return as(value, index2);
        case ARRAY: {
          const arr = as([], index2);
          for (const index3 of value)
            arr.push(unpair(index3));
          return arr;
        }
        case OBJECT: {
          const object = as({}, index2);
          for (const [key2, index3] of value)
            object[unpair(key2)] = unpair(index3);
          return object;
        }
        case DATE:
          return as(new Date(value), index2);
        case REGEXP: {
          const { source, flags } = value;
          return as(new RegExp(source, flags), index2);
        }
        case MAP2: {
          const map4 = as(/* @__PURE__ */ new Map(), index2);
          for (const [key2, index3] of value)
            map4.set(unpair(key2), unpair(index3));
          return map4;
        }
        case SET: {
          const set2 = as(/* @__PURE__ */ new Set(), index2);
          for (const index3 of value)
            set2.add(unpair(index3));
          return set2;
        }
        case ERROR: {
          const { name, message } = value;
          return as(
            typeof env[name] === "function" ? guard(name, message) : new Error(message),
            index2
          );
        }
        case BIGINT:
          return as(BigInt(value), index2);
        case "BigInt":
          return as(Object(BigInt(value)), index2);
        case "ArrayBuffer":
          return as(new Uint8Array(value).buffer, value);
        case "DataView": {
          const { buffer } = new Uint8Array(value);
          return as(new DataView(buffer), value);
        }
      }
      return as(guard(type, value), index2);
    };
    return unpair;
  };
  var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

  // node_modules/@ungap/structured-clone/esm/serialize.js
  var EMPTY = "";
  var { toString: toString2 } = {};
  var { keys } = Object;
  var typeOf = (value) => {
    const type = typeof value;
    if (type !== "object" || !value)
      return [PRIMITIVE, type];
    const asString = toString2.call(value).slice(8, -1);
    switch (asString) {
      case "Array":
        return [ARRAY, EMPTY];
      case "Object":
        return [OBJECT, EMPTY];
      case "Date":
        return [DATE, EMPTY];
      case "RegExp":
        return [REGEXP, EMPTY];
      case "Map":
        return [MAP2, EMPTY];
      case "Set":
        return [SET, EMPTY];
      case "DataView":
        return [ARRAY, asString];
    }
    if (asString.includes("Array"))
      return [ARRAY, asString];
    if (value instanceof Error)
      return [ERROR, value.name || "Error"];
    return [OBJECT, asString];
  };
  var shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
  var serializer = (strict, json, $, _) => {
    const as = (out, value) => {
      const index2 = _.push(out) - 1;
      $.set(value, index2);
      return index2;
    };
    const pair = (value) => {
      if ($.has(value))
        return $.get(value);
      let [TYPE, type] = typeOf(value);
      switch (TYPE) {
        case PRIMITIVE: {
          let entry = value;
          switch (type) {
            case "bigint":
              TYPE = BIGINT;
              entry = value.toString();
              break;
            case "function":
            case "symbol":
              if (strict)
                throw new TypeError("unable to serialize " + type);
              entry = null;
              break;
            case "undefined":
              return as([VOID], value);
          }
          return as([TYPE, entry], value);
        }
        case ARRAY: {
          if (type) {
            let spread = value;
            if (type === "DataView") {
              spread = new Uint8Array(value.buffer);
            } else if (type === "ArrayBuffer") {
              spread = new Uint8Array(value);
            }
            return as([type, [...spread]], value);
          }
          const arr = [];
          const index2 = as([TYPE, arr], value);
          for (const entry of value)
            arr.push(pair(entry));
          return index2;
        }
        case OBJECT: {
          if (type) {
            switch (type) {
              case "BigInt":
                return as([type, value.toString()], value);
              case "Boolean":
              case "Number":
              case "String":
                return as([type, value.valueOf()], value);
            }
          }
          if (json && "toJSON" in value)
            return pair(value.toJSON());
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const key2 of keys(value)) {
            if (strict || !shouldSkip(typeOf(value[key2])))
              entries.push([pair(key2), pair(value[key2])]);
          }
          return index2;
        }
        case DATE:
          return as([TYPE, isNaN(value.getTime()) ? EMPTY : value.toISOString()], value);
        case REGEXP: {
          const { source, flags } = value;
          return as([TYPE, { source, flags }], value);
        }
        case MAP2: {
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const [key2, entry] of value) {
            if (strict || !(shouldSkip(typeOf(key2)) || shouldSkip(typeOf(entry))))
              entries.push([pair(key2), pair(entry)]);
          }
          return index2;
        }
        case SET: {
          const entries = [];
          const index2 = as([TYPE, entries], value);
          for (const entry of value) {
            if (strict || !shouldSkip(typeOf(entry)))
              entries.push(pair(entry));
          }
          return index2;
        }
      }
      const { message } = value;
      return as([TYPE, { name: type, message }], value);
    };
    return pair;
  };
  var serialize2 = (value, { json, lossy } = {}) => {
    const _ = [];
    return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
  };

  // node_modules/@ungap/structured-clone/esm/index.js
  var esm_default = typeof structuredClone === "function" ? (
    /* c8 ignore start */
    (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize2(any, options)) : structuredClone(any)
  ) : (any, options) => deserialize(serialize2(any, options));

  // node_modules/mdast-util-to-hast/lib/footer.js
  function defaultFootnoteBackContent(_, rereferenceIndex) {
    const result = [{ type: "text", value: "\u21A9" }];
    if (rereferenceIndex > 1) {
      result.push({
        type: "element",
        tagName: "sup",
        properties: {},
        children: [{ type: "text", value: String(rereferenceIndex) }]
      });
    }
    return result;
  }
  function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
    return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
  }
  function footer(state) {
    const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
    const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
    const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
    const footnoteLabel = state.options.footnoteLabel || "Footnotes";
    const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
    const footnoteLabelProperties = state.options.footnoteLabelProperties || {
      className: ["sr-only"]
    };
    const listItems = [];
    let referenceIndex = -1;
    while (++referenceIndex < state.footnoteOrder.length) {
      const definition3 = state.footnoteById.get(
        state.footnoteOrder[referenceIndex]
      );
      if (!definition3) {
        continue;
      }
      const content3 = state.all(definition3);
      const id = String(definition3.identifier).toUpperCase();
      const safeId = normalizeUri(id.toLowerCase());
      let rereferenceIndex = 0;
      const backReferences = [];
      const counts = state.footnoteCounts.get(id);
      while (counts !== void 0 && ++rereferenceIndex <= counts) {
        if (backReferences.length > 0) {
          backReferences.push({ type: "text", value: " " });
        }
        let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
        if (typeof children === "string") {
          children = { type: "text", value: children };
        }
        backReferences.push({
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
            dataFootnoteBackref: "",
            ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
            className: ["data-footnote-backref"]
          },
          children: Array.isArray(children) ? children : [children]
        });
      }
      const tail = content3[content3.length - 1];
      if (tail && tail.type === "element" && tail.tagName === "p") {
        const tailTail = tail.children[tail.children.length - 1];
        if (tailTail && tailTail.type === "text") {
          tailTail.value += " ";
        } else {
          tail.children.push({ type: "text", value: " " });
        }
        tail.children.push(...backReferences);
      } else {
        content3.push(...backReferences);
      }
      const listItem3 = {
        type: "element",
        tagName: "li",
        properties: { id: clobberPrefix + "fn-" + safeId },
        children: state.wrap(content3, true)
      };
      state.patch(definition3, listItem3);
      listItems.push(listItem3);
    }
    if (listItems.length === 0) {
      return;
    }
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: true, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: footnoteLabelTagName,
          properties: {
            ...esm_default(footnoteLabelProperties),
            id: "footnote-label"
          },
          children: [{ type: "text", value: footnoteLabel }]
        },
        { type: "text", value: "\n" },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: state.wrap(listItems, true)
        },
        { type: "text", value: "\n" }
      ]
    };
  }

  // node_modules/mdast-util-to-hast/lib/state.js
  var own5 = {}.hasOwnProperty;
  var emptyOptions3 = {};
  function createState(tree, options) {
    const settings = options || emptyOptions3;
    const definitionById = /* @__PURE__ */ new Map();
    const footnoteById = /* @__PURE__ */ new Map();
    const footnoteCounts = /* @__PURE__ */ new Map();
    const handlers2 = { ...handlers, ...settings.handlers };
    const state = {
      all: all3,
      applyData,
      definitionById,
      footnoteById,
      footnoteCounts,
      footnoteOrder: [],
      handlers: handlers2,
      one: one3,
      options: settings,
      patch,
      wrap: wrap2
    };
    visit(tree, function(node2) {
      if (node2.type === "definition" || node2.type === "footnoteDefinition") {
        const map4 = node2.type === "definition" ? definitionById : footnoteById;
        const id = String(node2.identifier).toUpperCase();
        if (!map4.has(id)) {
          map4.set(id, node2);
        }
      }
    });
    return state;
    function one3(node2, parent) {
      const type = node2.type;
      const handle3 = state.handlers[type];
      if (own5.call(state.handlers, type) && handle3) {
        return handle3(state, node2, parent);
      }
      if (state.options.passThrough && state.options.passThrough.includes(type)) {
        if ("children" in node2) {
          const { children, ...shallow } = node2;
          const result = esm_default(shallow);
          result.children = state.all(node2);
          return result;
        }
        return esm_default(node2);
      }
      const unknown2 = state.options.unknownHandler || defaultUnknownHandler;
      return unknown2(state, node2, parent);
    }
    function all3(parent) {
      const values = [];
      if ("children" in parent) {
        const nodes = parent.children;
        let index2 = -1;
        while (++index2 < nodes.length) {
          const result = state.one(nodes[index2], parent);
          if (result) {
            if (index2 && nodes[index2 - 1].type === "break") {
              if (!Array.isArray(result) && result.type === "text") {
                result.value = trimMarkdownSpaceStart(result.value);
              }
              if (!Array.isArray(result) && result.type === "element") {
                const head2 = result.children[0];
                if (head2 && head2.type === "text") {
                  head2.value = trimMarkdownSpaceStart(head2.value);
                }
              }
            }
            if (Array.isArray(result)) {
              values.push(...result);
            } else {
              values.push(result);
            }
          }
        }
      }
      return values;
    }
  }
  function patch(from, to) {
    if (from.position) to.position = position2(from);
  }
  function applyData(from, to) {
    let result = to;
    if (from && from.data) {
      const hName = from.data.hName;
      const hChildren = from.data.hChildren;
      const hProperties = from.data.hProperties;
      if (typeof hName === "string") {
        if (result.type === "element") {
          result.tagName = hName;
        } else {
          const children = "children" in result ? result.children : [result];
          result = { type: "element", tagName: hName, properties: {}, children };
        }
      }
      if (result.type === "element" && hProperties) {
        Object.assign(result.properties, esm_default(hProperties));
      }
      if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
        result.children = hChildren;
      }
    }
    return result;
  }
  function defaultUnknownHandler(state, node2) {
    const data = node2.data || {};
    const result = "value" in node2 && !(own5.call(data, "hProperties") || own5.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
      type: "element",
      tagName: "div",
      properties: {},
      children: state.all(node2)
    };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  function wrap2(nodes, loose) {
    const result = [];
    let index2 = -1;
    if (loose) {
      result.push({ type: "text", value: "\n" });
    }
    while (++index2 < nodes.length) {
      if (index2) result.push({ type: "text", value: "\n" });
      result.push(nodes[index2]);
    }
    if (loose && nodes.length > 0) {
      result.push({ type: "text", value: "\n" });
    }
    return result;
  }
  function trimMarkdownSpaceStart(value) {
    let index2 = 0;
    let code4 = value.charCodeAt(index2);
    while (code4 === 9 || code4 === 32) {
      index2++;
      code4 = value.charCodeAt(index2);
    }
    return value.slice(index2);
  }

  // node_modules/mdast-util-to-hast/lib/index.js
  function toHast(tree, options) {
    const state = createState(tree, options);
    const node2 = state.one(tree, void 0);
    const foot = footer(state);
    const result = Array.isArray(node2) ? { type: "root", children: node2 } : node2 || { type: "root", children: [] };
    if (foot) {
      ok("children" in result);
      result.children.push({ type: "text", value: "\n" }, foot);
    }
    return result;
  }

  // node_modules/remark-rehype/lib/index.js
  function remarkRehype(destination, options) {
    if (destination && "run" in destination) {
      return async function(tree, file) {
        const hastTree = (
          /** @type {HastRoot} */
          toHast(tree, { file, ...options })
        );
        await destination.run(hastTree, file);
      };
    }
    return function(tree, file) {
      return (
        /** @type {HastRoot} */
        toHast(tree, { file, ...destination || options })
      );
    };
  }

  // node_modules/html-void-elements/index.js
  var htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];

  // node_modules/property-information/lib/util/schema.js
  var Schema2 = class {
    /**
     * @param {SchemaType['property']} property
     *   Property.
     * @param {SchemaType['normal']} normal
     *   Normal.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Schema.
     */
    constructor(property, normal, space2) {
      this.normal = normal;
      this.property = property;
      if (space2) {
        this.space = space2;
      }
    }
  };
  Schema2.prototype.normal = {};
  Schema2.prototype.property = {};
  Schema2.prototype.space = void 0;

  // node_modules/property-information/lib/util/merge.js
  function merge2(definitions, space2) {
    const property = {};
    const normal = {};
    for (const definition3 of definitions) {
      Object.assign(property, definition3.property);
      Object.assign(normal, definition3.normal);
    }
    return new Schema2(property, normal, space2);
  }

  // node_modules/property-information/lib/normalize.js
  function normalize2(value) {
    return value.toLowerCase();
  }

  // node_modules/property-information/lib/util/info.js
  var Info = class {
    /**
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @returns
     *   Info.
     */
    constructor(property, attribute) {
      this.attribute = attribute;
      this.property = property;
    }
  };
  Info.prototype.attribute = "";
  Info.prototype.booleanish = false;
  Info.prototype.boolean = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.defined = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.number = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.property = "";
  Info.prototype.spaceSeparated = false;
  Info.prototype.space = void 0;

  // node_modules/property-information/lib/util/types.js
  var types_exports = {};
  __export(types_exports, {
    boolean: () => boolean,
    booleanish: () => booleanish,
    commaOrSpaceSeparated: () => commaOrSpaceSeparated,
    commaSeparated: () => commaSeparated,
    number: () => number,
    overloadedBoolean: () => overloadedBoolean,
    spaceSeparated: () => spaceSeparated
  });
  var powers = 0;
  var boolean = increment();
  var booleanish = increment();
  var overloadedBoolean = increment();
  var number = increment();
  var spaceSeparated = increment();
  var commaSeparated = increment();
  var commaOrSpaceSeparated = increment();
  function increment() {
    return 2 ** ++powers;
  }

  // node_modules/property-information/lib/util/defined-info.js
  var checks = (
    /** @type {ReadonlyArray<keyof typeof types>} */
    Object.keys(types_exports)
  );
  var DefinedInfo = class extends Info {
    /**
     * @constructor
     * @param {string} property
     *   Property.
     * @param {string} attribute
     *   Attribute.
     * @param {number | null | undefined} [mask]
     *   Mask.
     * @param {Space | undefined} [space]
     *   Space.
     * @returns
     *   Info.
     */
    constructor(property, attribute, mask, space2) {
      let index2 = -1;
      super(property, attribute);
      mark(this, "space", space2);
      if (typeof mask === "number") {
        while (++index2 < checks.length) {
          const check = checks[index2];
          mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
        }
      }
    }
  };
  DefinedInfo.prototype.defined = true;
  function mark(values, key2, value) {
    if (value) {
      values[key2] = value;
    }
  }

  // node_modules/property-information/lib/util/create.js
  function create(definition3) {
    const properties = {};
    const normals = {};
    for (const [property, value] of Object.entries(definition3.properties)) {
      const info = new DefinedInfo(
        property,
        definition3.transform(definition3.attributes || {}, property),
        value,
        definition3.space
      );
      if (definition3.mustUseProperty && definition3.mustUseProperty.includes(property)) {
        info.mustUseProperty = true;
      }
      properties[property] = info;
      normals[normalize2(property)] = property;
      normals[normalize2(info.attribute)] = property;
    }
    return new Schema2(properties, normals, definition3.space);
  }

  // node_modules/property-information/lib/aria.js
  var aria = create({
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    },
    transform(_, property) {
      return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
    }
  });

  // node_modules/property-information/lib/util/case-sensitive-transform.js
  function caseSensitiveTransform(attributes2, attribute) {
    return attribute in attributes2 ? attributes2[attribute] : attribute;
  }

  // node_modules/property-information/lib/util/case-insensitive-transform.js
  function caseInsensitiveTransform(attributes2, property) {
    return caseSensitiveTransform(attributes2, property.toLowerCase());
  }

  // node_modules/property-information/lib/html.js
  var html3 = create({
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alpha: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      blocking: spaceSeparated,
      capture: null,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      closedBy: null,
      colorSpace: null,
      cols: number,
      colSpan: number,
      command: null,
      commandFor: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      fetchPriority: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: overloadedBoolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inert: boolean,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeToggle: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shadowRootClonable: boolean,
      shadowRootCustomElementRegistry: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
      shadowRootSerializable: boolean,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      writingSuggestions: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: spaceSeparated,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: number,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: number,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: boolean,
      // Lists. Use CSS to reduce space between items instead
      declare: boolean,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: number,
      // `<img>` and `<object>`
      leftMargin: number,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: number,
      // `<body>`
      marginWidth: number,
      // `<body>`
      noResize: boolean,
      // `<frame>`
      noHref: boolean,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: boolean,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: boolean,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: number,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: booleanish,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: number,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: number,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      credentialless: boolean,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      exportParts: commaSeparated,
      part: spaceSeparated,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    },
    space: "html",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/svg.js
  var svg = create({
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      maskType: "mask-type",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      transformOrigin: "transform-origin",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      // These were camelcased in Tiny. Now lowercased in SVG 2
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      // SEMI_COLON_SEPARATED
      keySplines: null,
      // SEMI_COLON_SEPARATED
      keyTimes: null,
      // SEMI_COLON_SEPARATED
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskType: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      transformOrigin: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    },
    space: "svg",
    transform: caseSensitiveTransform
  });

  // node_modules/property-information/lib/xlink.js
  var xlink = create({
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    },
    space: "xlink",
    transform(_, property) {
      return "xlink:" + property.slice(5).toLowerCase();
    }
  });

  // node_modules/property-information/lib/xmlns.js
  var xmlns = create({
    attributes: { xmlnsxlink: "xmlns:xlink" },
    properties: { xmlnsXLink: null, xmlns: null },
    space: "xmlns",
    transform: caseInsensitiveTransform
  });

  // node_modules/property-information/lib/xml.js
  var xml = create({
    properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
    space: "xml",
    transform(_, property) {
      return "xml:" + property.slice(3).toLowerCase();
    }
  });

  // node_modules/property-information/lib/find.js
  var cap = /[A-Z]/g;
  var dash = /-[a-z]/g;
  var valid = /^data[-\w.:]+$/i;
  function find(schema4, value) {
    const normal = normalize2(value);
    let property = value;
    let Type = Info;
    if (normal in schema4.normal) {
      return schema4.property[schema4.normal[normal]];
    }
    if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
      if (value.charAt(4) === "-") {
        const rest = value.slice(5).replace(dash, camelcase);
        property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
      } else {
        const rest = value.slice(4);
        if (!dash.test(rest)) {
          let dashes = rest.replace(cap, kebab);
          if (dashes.charAt(0) !== "-") {
            dashes = "-" + dashes;
          }
          value = "data" + dashes;
        }
      }
      Type = DefinedInfo;
    }
    return new Type(property, value);
  }
  function kebab($0) {
    return "-" + $0.toLowerCase();
  }
  function camelcase($0) {
    return $0.charAt(1).toUpperCase();
  }

  // node_modules/property-information/index.js
  var html4 = merge2([aria, html3, xlink, xmlns, xml], "html");
  var svg2 = merge2([aria, svg, xlink, xmlns, xml], "svg");

  // node_modules/hast-util-to-html/lib/handle/comment.js
  var htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
  var bogusCommentEntitySubset = [">"];
  var commentEntitySubset = ["<", ">"];
  function comment(node2, _1, _2, state) {
    return state.settings.bogusComments ? "<?" + stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: bogusCommentEntitySubset
      })
    ) + ">" : "<!--" + node2.value.replace(htmlCommentRegex, encode) + "-->";
    function encode($0) {
      return stringifyEntities(
        $0,
        Object.assign({}, state.settings.characterReferences, {
          subset: commentEntitySubset
        })
      );
    }
  }

  // node_modules/hast-util-to-html/lib/handle/doctype.js
  function doctype(_1, _2, _3, state) {
    return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
  }

  // node_modules/comma-separated-tokens/index.js
  function stringify4(values, options) {
    const settings = options || {};
    const input = values[values.length - 1] === "" ? [...values, ""] : values;
    return input.join(
      (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
    ).trim();
  }

  // node_modules/space-separated-tokens/index.js
  function stringify5(values) {
    return values.join(" ").trim();
  }

  // node_modules/hast-util-whitespace/lib/index.js
  var re = /[ \t\n\f\r]/g;
  function whitespace(thing) {
    return typeof thing === "object" ? thing.type === "text" ? empty2(thing.value) : false : empty2(thing);
  }
  function empty2(value) {
    return value.replace(re, "") === "";
  }

  // node_modules/hast-util-to-html/lib/omission/util/siblings.js
  var siblingAfter = siblings(1);
  var siblingBefore = siblings(-1);
  var emptyChildren = [];
  function siblings(increment2) {
    return sibling;
    function sibling(parent, index2, includeWhitespace) {
      const siblings2 = parent ? parent.children : emptyChildren;
      let offset = (index2 || 0) + increment2;
      let next = siblings2[offset];
      if (!includeWhitespace) {
        while (next && whitespace(next)) {
          offset += increment2;
          next = siblings2[offset];
        }
      }
      return next;
    }
  }

  // node_modules/hast-util-to-html/lib/omission/omission.js
  var own6 = {}.hasOwnProperty;
  function omission(handlers2) {
    return omit;
    function omit(node2, index2, parent) {
      return own6.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
    }
  }

  // node_modules/hast-util-to-html/lib/omission/closing.js
  var closing = omission({
    body,
    caption: headOrColgroupOrCaption,
    colgroup: headOrColgroupOrCaption,
    dd,
    dt,
    head: headOrColgroupOrCaption,
    html: html5,
    li,
    optgroup,
    option,
    p,
    rp: rubyElement,
    rt: rubyElement,
    tbody,
    td: cells,
    tfoot,
    th: cells,
    thead,
    tr
  });
  function headOrColgroupOrCaption(_, index2, parent) {
    const next = siblingAfter(parent, index2, true);
    return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
  }
  function html5(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function body(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type !== "comment";
  }
  function p(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
    !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
  }
  function li(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "li";
  }
  function dt(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return Boolean(
      next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd")
    );
  }
  function dd(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
  }
  function rubyElement(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
  }
  function optgroup(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "optgroup";
  }
  function option(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
  }
  function thead(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return Boolean(
      next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot")
    );
  }
  function tbody(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
  }
  function tfoot(_, index2, parent) {
    return !siblingAfter(parent, index2);
  }
  function tr(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && next.tagName === "tr";
  }
  function cells(_, index2, parent) {
    const next = siblingAfter(parent, index2);
    return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
  }

  // node_modules/hast-util-to-html/lib/omission/opening.js
  var opening = omission({
    body: body2,
    colgroup,
    head,
    html: html6,
    tbody: tbody2
  });
  function html6(node2) {
    const head2 = siblingAfter(node2, -1);
    return !head2 || head2.type !== "comment";
  }
  function head(node2) {
    const seen = /* @__PURE__ */ new Set();
    for (const child2 of node2.children) {
      if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
        if (seen.has(child2.tagName)) return false;
        seen.add(child2.tagName);
      }
    }
    const child = node2.children[0];
    return !child || child.type === "element";
  }
  function body2(node2) {
    const head2 = siblingAfter(node2, -1, true);
    return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
  }
  function colgroup(node2, index2, parent) {
    const previous4 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1, true);
    if (parent && previous4 && previous4.type === "element" && previous4.tagName === "colgroup" && closing(previous4, parent.children.indexOf(previous4), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
  }
  function tbody2(node2, index2, parent) {
    const previous4 = siblingBefore(parent, index2);
    const head2 = siblingAfter(node2, -1);
    if (parent && previous4 && previous4.type === "element" && (previous4.tagName === "thead" || previous4.tagName === "tbody") && closing(previous4, parent.children.indexOf(previous4), parent)) {
      return false;
    }
    return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
  }

  // node_modules/hast-util-to-html/lib/handle/element.js
  var constants = {
    // See: <https://html.spec.whatwg.org/#attribute-name-state>.
    name: [
      ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
      [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
    unquoted: [
      ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
      ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\0&'".split(""), "\0\"&'`".split("")]
    ],
    // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\0"&'.split(""), "\0\"&'`".split("")]
    ]
  };
  function element2(node2, index2, parent, state) {
    const schema4 = state.schema;
    const omit = schema4.space === "svg" ? false : state.settings.omitOptionalTags;
    let selfClosing = schema4.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node2.tagName.toLowerCase());
    const parts = [];
    let last;
    if (schema4.space === "html" && node2.tagName === "svg") {
      state.schema = svg2;
    }
    const attributes2 = serializeAttributes(state, node2.properties);
    const content3 = state.all(
      schema4.space === "html" && node2.tagName === "template" ? node2.content : node2
    );
    state.schema = schema4;
    if (content3) selfClosing = false;
    if (attributes2 || !omit || !opening(node2, index2, parent)) {
      parts.push("<", node2.tagName, attributes2 ? " " + attributes2 : "");
      if (selfClosing && (schema4.space === "svg" || state.settings.closeSelfClosing)) {
        last = attributes2.charAt(attributes2.length - 1);
        if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
          parts.push(" ");
        }
        parts.push("/");
      }
      parts.push(">");
    }
    parts.push(content3);
    if (!selfClosing && (!omit || !closing(node2, index2, parent))) {
      parts.push("</" + node2.tagName + ">");
    }
    return parts.join("");
  }
  function serializeAttributes(state, properties) {
    const values = [];
    let index2 = -1;
    let key2;
    if (properties) {
      for (key2 in properties) {
        if (properties[key2] !== null && properties[key2] !== void 0) {
          const value = serializeAttribute(state, key2, properties[key2]);
          if (value) values.push(value);
        }
      }
    }
    while (++index2 < values.length) {
      const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : void 0;
      if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
        values[index2] += " ";
      }
    }
    return values.join("");
  }
  function serializeAttribute(state, key2, value) {
    const info = find(state.schema, key2);
    const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
    const y = state.settings.allowDangerousCharacters ? 0 : 1;
    let quote = state.quote;
    let result;
    if (info.overloadedBoolean && (value === info.attribute || value === "")) {
      value = true;
    } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
      value = Boolean(value);
    }
    if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
      return "";
    }
    const name = stringifyEntities(
      info.attribute,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: constants.name[x][y]
      })
    );
    if (value === true) return name;
    value = Array.isArray(value) ? (info.commaSeparated ? stringify4 : stringify5)(value, {
      padLeft: !state.settings.tightCommaSeparatedLists
    }) : String(value);
    if (state.settings.collapseEmptyAttributes && !value) return name;
    if (state.settings.preferUnquoted) {
      result = stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          attribute: true,
          subset: constants.unquoted[x][y]
        })
      );
    }
    if (result !== value) {
      if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
        quote = state.alternative;
      }
      result = quote + stringifyEntities(
        value,
        Object.assign({}, state.settings.characterReferences, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[x][y],
          attribute: true
        })
      ) + quote;
    }
    return name + (result ? "=" + result : result);
  }

  // node_modules/hast-util-to-html/lib/handle/text.js
  var textEntitySubset = ["<", "&"];
  function text6(node2, _, parent, state) {
    return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(
      node2.value,
      Object.assign({}, state.settings.characterReferences, {
        subset: textEntitySubset
      })
    );
  }

  // node_modules/hast-util-to-html/lib/handle/raw.js
  function raw(node2, index2, parent, state) {
    return state.settings.allowDangerousHtml ? node2.value : text6(node2, index2, parent, state);
  }

  // node_modules/hast-util-to-html/lib/handle/root.js
  function root3(node2, _1, _2, state) {
    return state.all(node2);
  }

  // node_modules/hast-util-to-html/lib/handle/index.js
  var handle2 = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment, doctype, element: element2, raw, root: root3, text: text6 }
  });
  function invalid(node2) {
    throw new Error("Expected node, not `" + node2 + "`");
  }
  function unknown(node_) {
    const node2 = (
      /** @type {Nodes} */
      node_
    );
    throw new Error("Cannot compile unknown node `" + node2.type + "`");
  }

  // node_modules/hast-util-to-html/lib/index.js
  var emptyOptions4 = {};
  var emptyCharacterReferences = {};
  var emptyChildren2 = [];
  function toHtml(tree, options) {
    const options_ = options || emptyOptions4;
    const quote = options_.quote || '"';
    const alternative = quote === '"' ? "'" : '"';
    if (quote !== '"' && quote !== "'") {
      throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
    }
    const state = {
      one: one2,
      all: all2,
      settings: {
        omitOptionalTags: options_.omitOptionalTags || false,
        allowParseErrors: options_.allowParseErrors || false,
        allowDangerousCharacters: options_.allowDangerousCharacters || false,
        quoteSmart: options_.quoteSmart || false,
        preferUnquoted: options_.preferUnquoted || false,
        tightAttributes: options_.tightAttributes || false,
        upperDoctype: options_.upperDoctype || false,
        tightDoctype: options_.tightDoctype || false,
        bogusComments: options_.bogusComments || false,
        tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
        tightSelfClosing: options_.tightSelfClosing || false,
        collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
        allowDangerousHtml: options_.allowDangerousHtml || false,
        voids: options_.voids || htmlVoidElements,
        characterReferences: options_.characterReferences || emptyCharacterReferences,
        closeSelfClosing: options_.closeSelfClosing || false,
        closeEmptyElements: options_.closeEmptyElements || false
      },
      schema: options_.space === "svg" ? svg2 : html4,
      quote,
      alternative
    };
    return state.one(
      Array.isArray(tree) ? { type: "root", children: tree } : tree,
      void 0,
      void 0
    );
  }
  function one2(node2, index2, parent) {
    return handle2(node2, index2, parent, this);
  }
  function all2(parent) {
    const results = [];
    const children = parent && parent.children || emptyChildren2;
    let index2 = -1;
    while (++index2 < children.length) {
      results[index2] = this.one(children[index2], index2, parent);
    }
    return results.join("");
  }

  // node_modules/rehype-stringify/lib/index.js
  function rehypeStringify(options) {
    const self2 = this;
    const settings = { ...self2.data("settings"), ...options };
    self2.compiler = compiler2;
    function compiler2(tree) {
      return toHtml(tree, settings);
    }
  }

  // entry.js
  function componentHandler(state, node2) {
    const properties = { ...node2.attributes || {} };
    delete properties.__order__;
    return {
      type: "element",
      tagName: node2.name || "div",
      properties,
      children: state.all(node2)
    };
  }
  var mdcHandlers = {
    containerComponent: componentHandler,
    leafComponent: componentHandler,
    textComponent(state, node2) {
      if (!node2.name || node2.name === "text") {
        return { type: "text", value: node2.value || "" };
      }
      return componentHandler(state, node2);
    },
    "component-slot": componentHandler
  };
  var processor = unified().use(remarkParse).use(remarkGfm).use(remarkMDC).use(remarkRehype, { allowDangerousHtml: true, handlers: mdcHandlers }).use(rehypeStringify, { allowDangerousHtml: true });
  function parse3(markdown) {
    return processor.processSync(markdown).toString();
  }
  return __toCommonJS(entry_exports);
})();
