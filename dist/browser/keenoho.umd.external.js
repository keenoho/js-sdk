(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('crypto-js'), require('uuid'), require('axios')) :
  typeof define === 'function' && define.amd ? define(['crypto-js', 'uuid', 'axios'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Keenoho = factory(global.CryptoJS, global.uuid, global.axios));
})(this, (function (CryptoJS, uuid, axios) { 'use strict';

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
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
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

  var PLATFORM_NODE = 'node';
  var PLATFORM_BROWSER = 'browser';

  function judgePlatform() {
    return typeof document === 'undefined' ? PLATFORM_NODE : PLATFORM_BROWSER;
  }

  var storeConfig = {
    platform: judgePlatform(),
    app: undefined,
    signature: undefined,
    publicKey: undefined,
    env: 'production',
    mode: 'production',
    apiHost: undefined,
    ttl: 3200
  };
  function loadBrowserConfig() {}
  function loadNodeConfig() {}
  function loadConfig() {
  }
  function getConfig(key) {
    if (key in storeConfig) {
      return storeConfig[key];
    }
    return storeConfig;
  }
  function setConfig(key, value) {
    if (arguments.length == 1 && _typeof(arguments[0]) === 'object') {
      for (var k in arguments[0]) {
        storeConfig[k] = arguments[0][k];
      }
    } else if (arguments.length == 2) {
      storeConfig[key] = value;
    }
  }
  function checkConfig() {
    var checkSignature = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!storeConfig.app || !storeConfig.publicKey) {
      throw new Error('the app or publicKey is not set in config, please use setConfig to set the values');
    }
    if (checkSignature && !storeConfig.signature) {
      throw new Error('the signature has not sign, please use signature.sign to sign');
    }
  }

  var config = /*#__PURE__*/Object.freeze({
    __proto__: null,
    checkConfig: checkConfig,
    getConfig: getConfig,
    loadBrowserConfig: loadBrowserConfig,
    loadConfig: loadConfig,
    loadNodeConfig: loadNodeConfig,
    setConfig: setConfig
  });

  var defaultAxiosOptions = {
    url: '',
    baseURL: '',
    params: undefined,
    data: undefined,
    header: undefined,
    method: 'GET',
    cancelToken: undefined
  };
  var defaultRequestOption = {
    needApp: true,
    needSignature: true,
    needSessionId: true,
    targetCode: 0,
    takeInnerData: false
  };
  var Request = axios.create();
  Request.interceptors.request.use(function (config) {
    var _config$requestOption = config.requestOptions,
      requestOptions = _config$requestOption === void 0 ? defaultRequestOption : _config$requestOption;
    var _getConfig = getConfig(),
      app = _getConfig.app,
      signature = _getConfig.signature,
      apiHost = _getConfig.apiHost;
    if (!config.baseURL && apiHost) {
      config.baseURL = apiHost;
    }
    if (!config.headers) {
      config.headers = {};
    }
    if (requestOptions.needApp) {
      config.headers['x-app'] = app;
    }
    if (requestOptions.needSignature) {
      config.headers['x-signature'] = signature;
    }
    if (requestOptions.needSessionId) {
      var u = new URL(config.url.indexOf('http') > -1 ? config.url : config.baseURL + config.url);
      var pathname = u.pathname;
      config.headers['x-session-id'] = computeSession(app, pathname, signature);
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  Request.interceptors.response.use(function (response) {
    var _response$config$requ = response.config.requestOptions,
      requestOptions = _response$config$requ === void 0 ? defaultRequestOption : _response$config$requ;
    var data = response.data;
    if (_typeof(data) === 'object' && 'code' in data && 'msg' in data) {
      var code = data.code;
      if (code !== requestOptions.targetCode) {
        throw data;
      }
    }
    var finalData = data;
    if (requestOptions.takeInnerData && _typeof(data) === 'object' && 'data' in data) {
      finalData = data.data;
    }
    return finalData;
  }, function (error) {
    if (error instanceof axios.AxiosError) {
      var response = error.response;
      if (!response) {
        return Promise.reject(error);
      }
      var _response$config$requ2 = response.config.requestOptions,
        requestOptions = _response$config$requ2 === void 0 ? defaultRequestOption : _response$config$requ2;
      var data = response.data;
      if (_typeof(data) === 'object' && 'code' in data && 'msg' in data) {
        var code = data.code;
        if (code !== requestOptions.targetCode) {
          return Promise.reject(data);
        }
      }
      var finalData = data;
      if (requestOptions.takeInnerData && _typeof(data) === 'object' && 'data' in data) {
        finalData = data.data;
      }
      return Promise.reject(finalData);
    }
    return Promise.reject(error);
  });
  function request() {
    var axiosOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAxiosOptions;
    var requestOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRequestOption;
    axiosOptions = Object.assign({}, defaultAxiosOptions, axiosOptions);
    requestOptions = Object.assign({}, defaultRequestOption, requestOptions);
    return Request(_objectSpread2(_objectSpread2({}, axiosOptions), {}, {
      requestOptions: requestOptions
    }));
  }
  function get() {
    var axiosOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAxiosOptions;
    var requestOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRequestOption;
    axiosOptions.method = 'GET';
    return request(axiosOptions, requestOptions);
  }
  function post() {
    var axiosOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAxiosOptions;
    var requestOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRequestOption;
    axiosOptions.method = 'POST';
    return request(axiosOptions, requestOptions);
  }

  var request$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get: get,
    post: post,
    request: request
  });

  var apiMap = {
    v1: {
      SignatureSign: '/v1/signature/sign',
      SignatureCheck: '/v1/signature/check',
      SignatureRefresh: '/v1/signature/refresh'
    }
  };
  function computeSign(app, ts, ttl, uid, publicKey) {
    var str = "".concat(app).concat(ts).concat(ttl).concat(uid).split('').sort().join('');
    return CryptoJS.HmacSHA1(str, publicKey);
  }
  function computeSession(app, path, sign) {
    var str = "".concat(app, ":").concat(path).split('').sort().join('');
    return CryptoJS.HmacSHA1(str, sign);
  }
  function sign() {
    return _sign.apply(this, arguments);
  }
  function _sign() {
    _sign = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _getConfig, app, publicKey, ttl, ts, uid, sig, res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            checkConfig();
            _getConfig = getConfig(), app = _getConfig.app, publicKey = _getConfig.publicKey, ttl = _getConfig.ttl;
            ts = Date.now();
            uid = uuid.v4();
            sig = computeSign(app, ts, ttl, uid, publicKey);
            _context.next = 7;
            return get({
              url: apiMap.v1.SignatureSign,
              params: {
                app: app,
                ts: ts,
                ttl: ttl,
                sig: sig,
                randomId: uid
              }
            }, {
              needApp: false,
              needSignature: false,
              needSessionId: false
            });
          case 7:
            res = _context.sent;
            if (res && res.code === 0) {
              setConfig('signature', res.data);
            }
            return _context.abrupt("return", res);
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _sign.apply(this, arguments);
  }
  function check() {
    return _check.apply(this, arguments);
  }
  function _check() {
    _check = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            checkConfig();
            _context2.next = 3;
            return get({
              url: apiMap.v1.SignatureCheck,
              params: {}
            });
          case 3:
            return _context2.abrupt("return", _context2.sent);
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _check.apply(this, arguments);
  }
  function refresh() {
    return _refresh.apply(this, arguments);
  }
  function _refresh() {
    _refresh = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            checkConfig();
            _context3.next = 3;
            return get({
              url: apiMap.v1.SignatureRefresh,
              params: {}
            });
          case 3:
            return _context3.abrupt("return", _context3.sent);
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _refresh.apply(this, arguments);
  }

  var signature = /*#__PURE__*/Object.freeze({
    __proto__: null,
    check: check,
    computeSession: computeSession,
    computeSign: computeSign,
    refresh: refresh,
    sign: sign
  });

  var EventEmitter = /*#__PURE__*/function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);
      _defineProperty(this, "callbacks", {});
    }
    _createClass(EventEmitter, [{
      key: "addEventListener",
      value: function addEventListener(type, callback) {
        this.callbacks[type] = callback;
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type) {
        delete this.callbacks[type];
      }
    }, {
      key: "emit",
      value: function emit(type) {
        if (typeof this.callbacks[type] === 'function') {
          var _this$callbacks;
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          (_this$callbacks = this.callbacks)[type].apply(_this$callbacks, args);
        }
      }
    }]);
    return EventEmitter;
  }();

  var storeKeyMap = {
    signature: 'keenoho_signature',
    app: 'keenoho_app',
    publicKey: 'keenoho_publicKey'
  };
  var SDK = /*#__PURE__*/function (_ref) {
    _inherits(SDK, _ref);
    var _super = _createSuper(SDK);
    function SDK() {
      var _this;
      _classCallCheck(this, SDK);
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "config", {});
      _this.initConfig();
      _this.initSignature();
      return _this;
    }
    _createClass(SDK, [{
      key: "config",
      value: function config(valueMap) {
        setConfig(valueMap);
        this.config = Object.assign(this.config, getConfig());
      }
    }, {
      key: "ready",
      value: function ready(callback) {
        this.addEventListener('ready', callback);
      }
    }, {
      key: "error",
      value: function error(callback) {
        this.addEventListener('error', callback);
      }
    }, {
      key: "initConfig",
      value: function initConfig() {
        var storeApp = localStorage.getItem(storeKeyMap.app);
        var storePublicKey = localStorage.getItem(storeKeyMap.publicKey);
        this.config = Object.assign({}, getConfig());
        if (storeApp) {
          setConfig('app', +storeApp || undefined);
          this.config.app = +storeApp || undefined;
        }
        if (storePublicKey) {
          setConfig('publicKey', storePublicKey);
          this.config.publicKey = storePublicKey;
        }
      }
    }, {
      key: "initSignature",
      value: function () {
        var _initSignature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var storeSignature, checkRes, refreshRes;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                storeSignature = localStorage.getItem(storeKeyMap.signature);
                if (!storeSignature) {
                  _context.next = 12;
                  break;
                }
                setConfig('signature', storeSignature);
                _context.next = 5;
                return check().then(function () {
                  return true;
                })["catch"](function () {
                  setConfig('signature', undefined);
                  return false;
                });
              case 5:
                checkRes = _context.sent;
                if (!checkRes) {
                  _context.next = 12;
                  break;
                }
                _context.next = 9;
                return refresh().then(function () {
                  return true;
                })["catch"](function () {
                  setConfig('signature', undefined);
                  return false;
                });
              case 9:
                refreshRes = _context.sent;
                if (!refreshRes) {
                  _context.next = 12;
                  break;
                }
                return _context.abrupt("return");
              case 12:
                _context.next = 14;
                return sign().then(function (res) {
                  if (res && res.code == 0 && res.data) {
                    return res.data;
                  }
                  throw res;
                }).then(function (res) {
                  localStorage.setItem(storeKeyMap.signature, res);
                })["catch"](function (err) {
                  setConfig('signature', undefined);
                  return err;
                });
              case 14:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        function initSignature() {
          return _initSignature.apply(this, arguments);
        }
        return initSignature;
      }()
    }, {
      key: "addPlugin",
      value: function addPlugin(pluginFunc) {
        pluginFunc.call(this);
      }
    }, {
      key: "sendRequest",
      value: function sendRequest(axiosOptions, requestOptions) {
        return request(axiosOptions, requestOptions);
      }
    }]);
    return SDK;
  }((EventEmitter));

  var index = {
    config: config,
    signature: signature,
    request: request$1,
    SDK: SDK
  };

  return index;

}));
//# sourceMappingURL=keenoho.umd.external.js.map
