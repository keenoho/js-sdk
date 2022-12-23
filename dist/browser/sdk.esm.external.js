import axios from 'axios';
import { v4 } from 'uuid';
import CryptoJS from 'crypto-js';

function makeResponse(data) {
  var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ok';
  var res = {
    data: data,
    code: code,
    msg: msg
  };
  return res;
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  makeResponse: makeResponse
});

function getConfig() {
  var appConf;
  var mode = window.MODE || 'production';
  var env = window.ENV || 'production';
  if (window.APPCONF) {
    appConf = JSON.parse(decodeURIComponent(atob(window.APPCONF)));
  }
  return {
    appConf: appConf,
    mode: mode,
    env: env
  };
}
function setConfig(config) {
  window.MODE = config.mode;
  window.ENV = config.env;
  window.APPCONF = window.btoa(JSON.stringify(config.appConf));
}

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getConfig: getConfig,
  setConfig: setConfig
});

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function defaultErrorHandler(err, reqOpts) {
  var _err$response, _err$response$data, _err$data, _err$response2, _err$response2$data, _err$data2;
  var showError = reqOpts.showError;
  var msg = (err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.msg) || (err === null || err === void 0 ? void 0 : (_err$data = err.data) === null || _err$data === void 0 ? void 0 : _err$data.msg) || (err === null || err === void 0 ? void 0 : err.msg) || (err === null || err === void 0 ? void 0 : err.message) || '网络错误';
  var code = (err === null || err === void 0 ? void 0 : (_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : _err$response2$data.code) || (err === null || err === void 0 ? void 0 : (_err$data2 = err.data) === null || _err$data2 === void 0 ? void 0 : _err$data2.code) || (err === null || err === void 0 ? void 0 : err.code) || (err === null || err === void 0 ? void 0 : err.code) || -1;
  if (showError && typeof this.handleMap.showErrorFunc === 'function') {
    this.handleMap.showErrorFunc(msg);
  }
  if (code >= 20000 && code < 30000 && code != 20005) {
    if (typeof this.handleMap.setSignatureFunc === 'function') {
      this.handleMap.setSignatureFunc(null);
    }
    if (typeof this.handleMap.goToLoginFunc === 'function') {
      this.handleMap.goToLoginFunc();
    }
  }
  if (_typeof(err) !== 'object') {
    return err;
  } else {
    var _err$response3;
    var data = (err === null || err === void 0 ? void 0 : (_err$response3 = err.response) === null || _err$response3 === void 0 ? void 0 : _err$response3.data) || (err === null || err === void 0 ? void 0 : err.data) || err;
    return data;
  }
}
var Request = /*#__PURE__*/function () {
  function Request(_ref) {
    var _ref$baseURL = _ref.baseURL,
      baseURL = _ref$baseURL === void 0 ? '' : _ref$baseURL,
      getSignatureFunc = _ref.getSignatureFunc,
      setSignatureFunc = _ref.setSignatureFunc,
      goToLoginFunc = _ref.goToLoginFunc,
      showErrorFunc = _ref.showErrorFunc,
      getAppFunc = _ref.getAppFunc,
      _ref$errorhandler = _ref.errorhandler,
      errorhandler = _ref$errorhandler === void 0 ? defaultErrorHandler : _ref$errorhandler;
    _classCallCheck(this, Request);
    this.baseURL = baseURL;
    this.handleMap = {
      getSignatureFunc: getSignatureFunc,
      setSignatureFunc: setSignatureFunc,
      goToLoginFunc: goToLoginFunc,
      showErrorFunc: showErrorFunc,
      getAppFunc: getAppFunc
    };
    this.errorHandler = errorhandler;
  }
  _createClass(Request, [{
    key: "send",
    value: function send(options) {
      var _this = this;
      var _options$method = options.method,
        method = _options$method === void 0 ? 'GET' : _options$method,
        url = options.url,
        data = options.data,
        params = options.params,
        baseURL = options.baseURL,
        _options$targetCode = options.targetCode,
        targetCode = _options$targetCode === void 0 ? 0 : _options$targetCode,
        _options$targetStatus = options.targetStatus,
        targetStatus = _options$targetStatus === void 0 ? 200 : _options$targetStatus,
        _options$takeInnerDat = options.takeInnerData,
        takeInnerData = _options$takeInnerDat === void 0 ? false : _options$takeInnerDat,
        _options$validResult = options.validResult,
        validResult = _options$validResult === void 0 ? true : _options$validResult,
        _options$needApp = options.needApp,
        needApp = _options$needApp === void 0 ? true : _options$needApp,
        _options$needSignatur = options.needSignature,
        needSignature = _options$needSignatur === void 0 ? true : _options$needSignatur,
        headerApp = options.headerApp,
        headerSignature = options.headerSignature,
        _options$headers = options.headers,
        headers = _options$headers === void 0 ? {} : _options$headers;
      return new Promise(function (resolve, reject) {
        if (needApp) {
          headers['X-APP'] = headerApp || _this.handleMap.getAppFunc() || '';
        }
        if (needApp && !headers['X-APP']) {
          reject(_this.errorHandler(makeResponse(null, -1, 'app缺失'), options));
          return;
        }
        if (needSignature) {
          headers['X-SIGNATURE'] = headerSignature || _this.handleMap.getSignatureFunc() || '';
        }
        if (needSignature && !headers['X-SIGNATURE']) {
          reject(_this.errorHandler(makeResponse(null, -1, '签名缺失'), options));
          return;
        }
        axios({
          method: method,
          baseURL: baseURL || _this.baseURL || '',
          url: url,
          data: data,
          params: params,
          headers: headers
        }).then(function (res) {
          var data = res.data,
            status = res.status;
          if (status !== targetStatus) {
            throw res;
          }
          if (_typeof(data) !== 'object') {
            return resolve(data);
          }
          if (!validResult) {
            return resolve(data);
          }
          var code = data.code;
          if (code !== targetCode) {
            throw res;
          }
          var finalData = (data === null || data === void 0 ? void 0 : data.data) || data;
          if (takeInnerData) {
            resolve(finalData);
          } else {
            resolve(data);
          }
        })["catch"](function (err) {
          reject(_this.errorHandler(err, options));
        });
      });
    }
  }, {
    key: "get",
    value: function get(options) {
      return this.send(_objectSpread2(_objectSpread2({}, options), {}, {
        method: 'GET'
      }));
    }
  }, {
    key: "post",
    value: function post(options) {
      return this.send(_objectSpread2(_objectSpread2({}, options), {}, {
        method: 'POST'
      }));
    }
  }]);
  return Request;
}();
var storeRequest;
function createRequestInstance(options) {
  storeRequest = new Request(options);
  return storeRequest;
}
function getStoreRequest() {
  return storeRequest;
}

var request = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Request: Request,
  createRequestInstance: createRequestInstance,
  getStoreRequest: getStoreRequest
});

// base
function SignatureGet(request, params) {
  return request.get({
    url: '/v1/signature',
    params: params,
    needSignature: false
  });
}
function SignatureCheck(request) {
  return request.get({
    url: '/v1/signature/check'
  });
}
function SignatureRefresh(request) {
  return request.get({
    url: '/v1/signature/refresh'
  });
}
function SignatureAuth(request, data) {
  return request.post({
    url: '/v1/signature/auth',
    data: data
  });
}
function UserInfo(request, params) {
  return request.get({
    url: '/v1/user/info',
    params: params
  });
}
function UserRole(request, params) {
  return request.get({
    url: '/v1/user/role',
    params: params
  });
}
function UserPermission(request, params) {
  return request.get({
    url: '/v1/user/permission',
    params: params
  });
}

// tools
function ToolTransferMail(request, data) {
  return request.post({
    url: '/v1/mail/transfer',
    data: data
  });
}

var _excluded$2 = ["request"];

// 计算sig
function computeSig(app, nonce, ts, ttl, data, secretkey) {
  var str = "".concat(app).concat(nonce).concat(ts).concat(ttl).concat(data).split('').sort(function (a, b) {
    return String(a).charCodeAt(0) - String(b).charCodeAt(0);
  }).join('');
  var sig = CryptoJS.HmacSHA1(str, secretkey);
  var sigStr = CryptoJS.enc.Hex.stringify(sig);
  return sigStr;
}

// 获取签名
function getSignature(_x) {
  return _getSignature.apply(this, arguments);
}

// 检查签名
function _getSignature() {
  _getSignature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(options) {
    var app, secretkey, _options$request2, request, ts, ttl, nonce, data, sig, signature;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = options.app, secretkey = options.secretkey, _options$request2 = options.request, request = _options$request2 === void 0 ? getStoreRequest() : _options$request2;
            ts = Date.now();
            ttl = 14400;
            nonce = v4();
            data = '';
            sig = computeSig(app, nonce, ts, ttl, data, secretkey);
            _context.next = 8;
            return SignatureGet(request, {
              app: app,
              nonce: nonce,
              ts: ts,
              ttl: ttl,
              data: data,
              sig: sig
            });
          case 8:
            signature = _context.sent;
            return _context.abrupt("return", signature);
          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getSignature.apply(this, arguments);
}
function checkSignature(options) {
  var _ref = options || {},
    _ref$request = _ref.request,
    request = _ref$request === void 0 ? getStoreRequest() : _ref$request;
  return SignatureCheck(request);
}

// 刷新签名
function refreshSignature(options) {
  var _ref2 = options || {},
    _ref2$request = _ref2.request,
    request = _ref2$request === void 0 ? getStoreRequest() : _ref2$request;
  return SignatureRefresh(request);
}

// 授权签名
function authSignature(options) {
  var _options$request = options.request,
    request = _options$request === void 0 ? getStoreRequest() : _options$request,
    data = _objectWithoutProperties(options, _excluded$2);
  return SignatureAuth(request, data);
}

// 完整初始化签名过程
function initSignature(_x2) {
  return _initSignature.apply(this, arguments);
}
function _initSignature() {
  _initSignature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(options) {
    var app, secretkey, getSignatureFunc, setSignatureFunc, _options$request3, request, signature, data, flag;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = options.app, secretkey = options.secretkey, getSignatureFunc = options.getSignatureFunc, setSignatureFunc = options.setSignatureFunc, _options$request3 = options.request, request = _options$request3 === void 0 ? getStoreRequest() : _options$request3;
            if (!(typeof getSignatureFunc === 'function' && getSignatureFunc())) {
              _context2.next = 11;
              break;
            }
            _context2.next = 4;
            return checkSignature({
              request: request
            }).then(function (res) {
              if (res && res.data) {
                data = res.data;
                if (Date.now > res.data.expired) {
                  return false;
                }
                return true;
              } else {
                return false;
              }
            })["catch"](function () {
              return false;
            });
          case 4:
            flag = _context2.sent;
            if (!flag) {
              _context2.next = 11;
              break;
            }
            _context2.next = 8;
            return refreshSignature({
              request: request
            });
          case 8:
            signature = _context2.sent;
            setSignatureFunc(signature);
            return _context2.abrupt("return", {
              signature: signature,
              data: data
            });
          case 11:
            _context2.next = 13;
            return getSignature({
              app: app,
              secretkey: secretkey,
              request: request
            });
          case 13:
            signature = _context2.sent;
            if (typeof setSignatureFunc === 'function') {
              setSignatureFunc(signature);
            }
            return _context2.abrupt("return", {
              signature: signature,
              data: data
            });
          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _initSignature.apply(this, arguments);
}

var signature = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getSignature: getSignature,
  checkSignature: checkSignature,
  refreshSignature: refreshSignature,
  authSignature: authSignature,
  initSignature: initSignature
});

var _excluded$1 = ["request", "baseSignature"],
  _excluded2 = ["id", "request"],
  _excluded3 = ["id", "request"],
  _excluded4 = ["id", "request"];
function login(options) {
  var _request$handleMap;
  var _options$request = options.request,
    request = _options$request === void 0 ? getStoreRequest() : _options$request,
    baseSignature = options.baseSignature,
    data = _objectWithoutProperties(options, _excluded$1);
  var signature = baseSignature || (request === null || request === void 0 ? void 0 : (_request$handleMap = request.handleMap) === null || _request$handleMap === void 0 ? void 0 : _request$handleMap.getSignatureFunc()) || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return SignatureAuth(request, data);
}
function getUserInfo(options) {
  var _request$handleMap2;
  var _ref = options || {},
    id = _ref.id,
    _ref$request = _ref.request,
    request = _ref$request === void 0 ? getStoreRequest() : _ref$request,
    params = _objectWithoutProperties(_ref, _excluded2);
  var signature = (request === null || request === void 0 ? void 0 : (_request$handleMap2 = request.handleMap) === null || _request$handleMap2 === void 0 ? void 0 : _request$handleMap2.getSignatureFunc()) || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserInfo(request, _objectSpread2({
    id: id
  }, params));
}
function getUserRole(options) {
  var _request$handleMap3;
  var _ref2 = options || {},
    id = _ref2.id,
    _ref2$request = _ref2.request,
    request = _ref2$request === void 0 ? getStoreRequest() : _ref2$request,
    params = _objectWithoutProperties(_ref2, _excluded3);
  var signature = (request === null || request === void 0 ? void 0 : (_request$handleMap3 = request.handleMap) === null || _request$handleMap3 === void 0 ? void 0 : _request$handleMap3.getSignatureFunc()) || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserRole(request, _objectSpread2({
    id: id
  }, params));
}
function getUserPermission(options) {
  var _request$handleMap4;
  var _ref3 = options || {},
    id = _ref3.id,
    _ref3$request = _ref3.request,
    request = _ref3$request === void 0 ? getStoreRequest() : _ref3$request,
    params = _objectWithoutProperties(_ref3, _excluded4);
  var signature = (request === null || request === void 0 ? void 0 : (_request$handleMap4 = request.handleMap) === null || _request$handleMap4 === void 0 ? void 0 : _request$handleMap4.getSignatureFunc()) || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserPermission(request, _objectSpread2({
    id: id
  }, params));
}

var user = /*#__PURE__*/Object.freeze({
  __proto__: null,
  login: login,
  getUserInfo: getUserInfo,
  getUserRole: getUserRole,
  getUserPermission: getUserPermission
});

var _excluded = ["request"];

// 转发邮件
function transferMail(options) {
  var _request$handleMap;
  var _options$request = options.request,
    request = _options$request === void 0 ? getStoreRequest() : _options$request,
    data = _objectWithoutProperties(options, _excluded);
  var signature = (request === null || request === void 0 ? void 0 : (_request$handleMap = request.handleMap) === null || _request$handleMap === void 0 ? void 0 : _request$handleMap.getSignatureFunc()) || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return ToolTransferMail(request, data);
}

var tool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  transferMail: transferMail
});

var index = {
  utils: utils,
  config: config,
  request: request,
  signature: signature,
  user: user,
  tool: tool
};

export { index as default };
//# sourceMappingURL=sdk.esm.external.js.map
