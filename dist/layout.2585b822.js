// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"api/auth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUserProfile = fetchUserProfile;
exports.fetchWithToken = fetchWithToken;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.refreshAccessToken = refreshAccessToken;
exports.registerUser = registerUser;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var API_BASE_URL = "https://goldsilkaws.metashopping.kr/"; // API 기본 URL
var AUTH_URL = "".concat(API_BASE_URL, "/auth"); // 인증 관련 URL

// **회원가입**
function registerUser(_x) {
  return _registerUser.apply(this, arguments);
} // **로그인**
function _registerUser() {
  _registerUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(userData) {
    var response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return fetch("".concat(AUTH_URL, "/register"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
            },
            body: JSON.stringify(userData)
          });
        case 3:
          response = _context.sent;
          if (response.ok) {
            _context.next = 6;
            break;
          }
          throw new Error("Failed to register user: ".concat(response.status));
        case 6:
          _context.next = 8;
          return response.json();
        case 8:
          return _context.abrupt("return", _context.sent);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("Error registering user:", _context.t0.message);
          return _context.abrupt("return", null);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _registerUser.apply(this, arguments);
}
function loginUser(_x2) {
  return _loginUser.apply(this, arguments);
} // **사용자 정보 가져오기**
function _loginUser() {
  _loginUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(credentials) {
    var response, result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return fetch("".concat(AUTH_URL, "/login"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
            },
            body: JSON.stringify(credentials)
          });
        case 3:
          response = _context2.sent;
          if (response.ok) {
            _context2.next = 6;
            break;
          }
          throw new Error("Failed to login: ".concat(response.status));
        case 6:
          _context2.next = 8;
          return response.json();
        case 8:
          result = _context2.sent;
          localStorage.setItem("access_token", result.token); // 액세스 토큰 저장
          localStorage.setItem("refresh_token", result.refresh_token); // 리프레시 토큰 저장
          return _context2.abrupt("return", result);
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error("Error logging in:", _context2.t0.message);
          return _context2.abrupt("return", null);
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 14]]);
  }));
  return _loginUser.apply(this, arguments);
}
function fetchUserProfile() {
  return _fetchUserProfile.apply(this, arguments);
} // **로그아웃**
function _fetchUserProfile() {
  _fetchUserProfile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          token = localStorage.getItem("access_token");
          if (token) {
            _context3.next = 3;
            break;
          }
          return _context3.abrupt("return", null);
        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return fetch("".concat(AUTH_URL, "/me"), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token),
              "ngrok-skip-browser-warning": "69420"
            }
          });
        case 6:
          response = _context3.sent;
          if (!(response.status === 403 || response.status === 401)) {
            _context3.next = 11;
            break;
          }
          console.warn("Token is invalid or expired.");
          logoutUser(); // 로그아웃 처리
          return _context3.abrupt("return", null);
        case 11:
          if (response.ok) {
            _context3.next = 13;
            break;
          }
          throw new Error("Failed to fetch user profile: ".concat(response.status));
        case 13:
          _context3.next = 15;
          return response.json();
        case 15:
          return _context3.abrupt("return", _context3.sent);
        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](3);
          console.error("Error fetching user profile:", _context3.t0.message);
          return _context3.abrupt("return", null);
        case 22:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 18]]);
  }));
  return _fetchUserProfile.apply(this, arguments);
}
function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  console.log("User logged out.");
}

// **토큰 갱신**
function refreshAccessToken() {
  return _refreshAccessToken.apply(this, arguments);
} // **토큰이 필요한 API 요청 처리**
function _refreshAccessToken() {
  _refreshAccessToken = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var refreshToken, response, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            _context4.next = 4;
            break;
          }
          console.warn("No refresh token found. User must log in again.");
          throw new Error("Refresh token not found.");
        case 4:
          _context4.prev = 4;
          _context4.next = 7;
          return fetch("".concat(AUTH_URL, "/refresh-token"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            })
          });
        case 7:
          response = _context4.sent;
          if (response.ok) {
            _context4.next = 10;
            break;
          }
          throw new Error("Failed to refresh access token.");
        case 10:
          _context4.next = 12;
          return response.json();
        case 12:
          result = _context4.sent;
          localStorage.setItem("access_token", result.token); // 새 액세스 토큰 저장
          return _context4.abrupt("return", result.token);
        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](4);
          console.error("Error refreshing access token:", _context4.t0.message);
          throw _context4.t0;
        case 21:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[4, 17]]);
  }));
  return _refreshAccessToken.apply(this, arguments);
}
function fetchWithToken(_x3) {
  return _fetchWithToken.apply(this, arguments);
}
function _fetchWithToken() {
  _fetchWithToken = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(url) {
    var options,
      token,
      response,
      newToken,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          options = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
          token = localStorage.getItem("access_token");
          _context5.next = 4;
          return fetch(url, _objectSpread(_objectSpread({}, options), {}, {
            headers: _objectSpread(_objectSpread({}, options.headers), {}, {
              Authorization: "Bearer ".concat(token),
              "ngrok-skip-browser-warning": "69420"
            })
          }));
        case 4:
          response = _context5.sent;
          if (!(response.status === 401)) {
            _context5.next = 18;
            break;
          }
          _context5.prev = 6;
          _context5.next = 9;
          return refreshAccessToken();
        case 9:
          newToken = _context5.sent;
          return _context5.abrupt("return", fetch(url, _objectSpread(_objectSpread({}, options), {}, {
            headers: _objectSpread(_objectSpread({}, options.headers), {}, {
              Authorization: "Bearer ".concat(newToken),
              "ngrok-skip-browser-warning": "69420"
            })
          })));
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](6);
          console.error("Failed to refresh token or retry request:", _context5.t0.message);
          logoutUser(); // 로그아웃 처리
          window.location.href = "/login"; // 로그인 페이지로 이동
        case 18:
          return _context5.abrupt("return", response);
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[6, 13]]);
  }));
  return _fetchWithToken.apply(this, arguments);
}
},{}],"components/layout/HeaderComponent.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _auth = require("../../api/auth.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var HeaderComponent = /*#__PURE__*/function (_HTMLElement) {
  function HeaderComponent() {
    _classCallCheck(this, HeaderComponent);
    return _callSuper(this, HeaderComponent, arguments);
  }
  _inherits(HeaderComponent, _HTMLElement);
  return _createClass(HeaderComponent, [{
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var menuItems, profileLink, cartLink, isLoggedIn, user, hamburgerIcon, mobileMenu;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              menuItems = [{
                name: "BRAND",
                link: "/brand.html"
              }, {
                name: "혼주한복",
                link: "/product/honju.html"
              }, {
                name: "신랑신부한복",
                link: "/product/wedding.html"
              }, {
                name: "여성한복",
                link: "/product/women.html"
              }, {
                name: "아동한복",
                link: "/product/children.html"
              }, {
                name: "돌잔치한복",
                link: "product/firstbirthday.html"
              }, {
                name: "맞춤한복",
                link: "product/custom.html"
              }, {
                name: "생활한복",
                link: "product/daily.html"
              }, {
                name: "화보촬영",
                link: "photoshoot.html"
              }, {
                name: "협찬",
                link: "sponsorship.html"
              }, {
                name: "COMMUNITY",
                link: "community.html"
              }];
              profileLink = "user/login.html"; // 기본 로그인 링크 설정
              cartLink = "cart/cart.html"; // 기본 장바구니 링크 설정
              isLoggedIn = false; // 로그인 여부
              // 로그인 상태 확인
              _context.prev = 4;
              _context.next = 7;
              return (0, _auth.fetchUserProfile)();
            case 7:
              user = _context.sent;
              if (user) {
                profileLink = "user/profile.html"; // 로그인된 경우 프로필 페이지
                isLoggedIn = true;
              }
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](4);
              console.warn("User not logged in or session expired.");
            case 14:
              this.innerHTML = "\n      <div class=\"header\">\n        <div class=\"inner\">\n          <!-- \uB85C\uACE0 -->\n          <a href=\"/\" class=\"logo-wrapper\">\n            <img src=\"public/logo.jpg\" alt=\"logo\" class=\"logo\" />\n          </a>\n\n          <!-- \uB370\uC2A4\uD06C\uD1B1 \uBA54\uB274 -->\n          <nav class=\"menu\">\n            ".concat(menuItems.map(function (item) {
                return "<a href=\"".concat(item.link, "\" class=\"innerHeader\">").concat(item.name, "</a>");
              }).join(""), "\n          </nav>\n\n          <!-- \uC0AC\uC6A9\uC790 \uC544\uC774\uCF58 -->\n          <a class=\"user-icon\" href=\"").concat(isLoggedIn ? profileLink : "user/login.html", "\">\n            ").concat(isLoggedIn ? '<i class="fa-regular fa-user"></i>' : '<i class="fa-solid fa-user-plus"></i>', "\n          </a>\n\n          <!-- \uC7A5\uBC14\uAD6C\uB2C8 \uC544\uC774\uCF58 -->\n          <a class=\"user-icon\" href=\"").concat(isLoggedIn ? cartLink : "user/login.html", "\">\n            <i class=\"fa-solid fa-cart-shopping\"></i>\n          </a>\n\n          <!-- \uD584\uBC84\uAC70 \uBA54\uB274 -->\n          <div class=\"hamburger-icon\">\n            <span></span>\n            <span></span>\n            <span></span>\n          </div>\n        </div>\n\n        <!-- \uBAA8\uBC14\uC77C \uBA54\uB274 -->\n        <div class=\"mobile-menu\">\n          ").concat(menuItems.map(function (item) {
                return "<a href=\"".concat(item.link, "\" class=\"mobile-menu-item\">").concat(item.name, "</a>");
              }).join(""), "\n        </div>\n      </div>\n    ");

              // 햄버거 메뉴 클릭 이벤트
              hamburgerIcon = this.querySelector(".hamburger-icon");
              mobileMenu = this.querySelector(".mobile-menu");
              hamburgerIcon.addEventListener("click", function () {
                mobileMenu.classList.toggle("open");
              });

              // 메뉴 외부 클릭 시 메뉴 닫기
              document.addEventListener("click", function (event) {
                var isClickInsideMenu = mobileMenu.contains(event.target) || hamburgerIcon.contains(event.target);
                if (!isClickInsideMenu) {
                  mobileMenu.classList.remove("open");
                }
              });
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[4, 11]]);
      }));
      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }
      return connectedCallback;
    }()
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("header-component", HeaderComponent);

// 스크롤 이벤트
window.addEventListener("scroll", function () {
  var headerLayout = document.querySelector("header-component");
  var header = document.querySelector(".header");

  // DOM 요소 존재 여부 확인
  if (!header || !headerLayout) {
    console.warn("Header or header-layout not found in DOM.");
    return; // 요소가 없으면 작업 중단
  }
  if (window.scrollY > 80) {
    header.classList.add("headerFixed");
    headerLayout.classList.remove("headerPlace");
    headerLayout.classList.add("headerPlaceFixed");
  } else {
    header.classList.remove("headerFixed");
    headerLayout.classList.add("headerPlace");
    headerLayout.classList.remove("headerPlaceFixed");
  }
});
var _default = exports.default = HeaderComponent;
},{"../../api/auth.js":"api/auth.js"}],"components/layout/FooterCoponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var FooterComponent = /*#__PURE__*/function (_HTMLElement) {
  function FooterComponent() {
    _classCallCheck(this, FooterComponent);
    return _callSuper(this, FooterComponent, arguments);
  }
  _inherits(FooterComponent, _HTMLElement);
  return _createClass(FooterComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.innerHTML = "\n                <div class=\"footer\">\n                <div class=\"footer-content\">\n                  <div class=\"footer-container\">\n                    <span>ABOUT US</span>\n                    <div class=\"footer-menu\">\n                      <span>Company : \uD669\uAE08\uB2E8  CEO : \uAC15\uC601\uAE30</span>\n                      <span>Company Reg.No : 712-88-02701 [\uC0AC\uC5C5\uC790\uC815\uBCF4\uD655\uC778] Network Reg.No \uC81C 2024-\uC548\uC591\uB3D9\uC548-0324\uD638</span>\n                      <span>Tel : 02-2269-1008 Fax : 02-516-6004</span>\n                      <span>Add : 14055 \uACBD\uAE30\uB3C4 \uC548\uC591\uC2DC \uB3D9\uC548\uAD6C \uC2DC\uBBFC\uB300\uB85C327\uBC88\uAE38 11-41 9\uCE35 909\uD638</span>\n                      <span>Add : 06065 \uC11C\uC6B8 \uAC15\uB0A8\uAD6C \uC120\uB989\uB85C134\uAE38 6 1\uCE35 (\uC11C\uC6B8\uBCF8\uC810-\uC804\uC2DC\uC7A5)</span>\n                      <span>Cpo_email : \uAC15\uC601\uAE30(goldsilkcop@gmail.com) Hosting by CAFE24</span>\n                      <span>Copyright \xA9 \uD669\uAE08\uB2E8. All rights reserved. \uB514\uC790\uC778\uC800\uC791\uAD8C\uC790:\uC704\uC2A4\uD0A8</span>\n                    </div>\n                  </div>\n                  <div class=\"footer-container\">\n                    <span>BANK ACCOUNT</span>\n                    <div class=\"footer-menu\">\n                      <span>\uD558\uB098\uC740\uD589 : 404-910019-20304</span>\n                      <span>\uC608\uAE08\uC8FC : \uC8FC\uC2DD\uD68C\uC0AC\uD669\uAE08\uB2E8</span>\n                    </div>\n                  </div>\n                  <div class=\"footer-container\">\n                    <span>CS CENTER</span>\n                    <div class=\"footer-menu\">\n                      <span>02-517-6004</span>\n                      <span>02-2269-1008</span>\n                      <span>\uD3C9\uC77C AM10:00 ~PM18:00</span>\n                      <span></span>\n                    </div>\n                  </div>\n                </div>\n                \n  \n  \n                </div>\n            ";
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("footer-component", FooterComponent);
var _default = exports.default = FooterComponent;
},{}],"components/layout/AdBanner.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var AdBannerComponent = /*#__PURE__*/function (_HTMLElement) {
  function AdBannerComponent() {
    _classCallCheck(this, AdBannerComponent);
    return _callSuper(this, AdBannerComponent, arguments);
  }
  _inherits(AdBannerComponent, _HTMLElement);
  return _createClass(AdBannerComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // 광고 배너 데이터
      var banners = ["한복을 디자인하는 전문기업", "전통과 현대의 조화를 이루는 한복 전문 쇼핑몰"];

      // HTML 구조 생성
      this.innerHTML = "\n        <div class=\"ad-banner-container\">\n          <button class=\"ad-banner-close\" aria-label=\"\uB2EB\uAE30 \uBC84\uD2BC\">\xD7</button>\n          <div class=\"swiper ad-banner-swiper\">\n            <div class=\"swiper-wrapper\">\n              ".concat(banners.map(function (text) {
        return "\n                <div class=\"swiper-slide ad-banner-slide\">\n                  ".concat(text, "\n                </div>\n              ");
      }).join(""), "\n            </div>\n          </div>\n        </div>\n      ");

      // Swiper 초기화
      var swiper = new Swiper(".ad-banner-swiper", {
        direction: "vertical",
        // 세로 방향
        loop: true,
        // 무한 루프
        autoplay: {
          delay: 3000,
          // 3초마다 자동 슬라이드
          disableOnInteraction: false // 사용자가 조작해도 autoplay 유지
        },
        mousewheel: true // 마우스 휠로 슬라이드 제어
      });

      // 닫기 버튼 이벤트
      var closeButton = this.querySelector(".ad-banner-close");
      var container = this.querySelector(".ad-banner-container");
      closeButton.addEventListener("click", function () {
        container.style.display = "none"; // 배너 숨기기
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 등록
if (!customElements.get("ad-banner-component")) {
  customElements.define("ad-banner-component", AdBannerComponent);
}
var _default = exports.default = AdBannerComponent;
},{}],"components/layout/Widget.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var WidgetComponent = /*#__PURE__*/function (_HTMLElement) {
  function WidgetComponent() {
    _classCallCheck(this, WidgetComponent);
    return _callSuper(this, WidgetComponent, arguments);
  }
  _inherits(WidgetComponent, _HTMLElement);
  return _createClass(WidgetComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // HTML 구조 생성
      this.innerHTML = "\n          <div class=\"widget\">\n            <div class=\"widget-button\" data-action=\"kakao\"><i class=\"fa-regular fa-comment\"></i></div>\n            <div class=\"widget-button\" data-action=\"instagram\"><i class=\"fa-brands fa-instagram\"></i></div>\n            <div class=\"widget-button\" data-action=\"blog\"><i class=\"fa-brands fa-blogger\"></i></div>\n            <div class=\"widget-button\" data-action=\"youtube\"><i class=\"fa-brands fa-youtube\"></i></div>\n            <div class=\"widget-button\" data-action=\"scroll-top\"><i class=\"fa-solid fa-arrow-up\"></i></div>\n            <div class=\"widget-button\" data-action=\"scroll-bottom\"><i class=\"fa-solid fa-arrow-down\"></i></div>\n          </div>\n        ";

      // 스크롤 이동 함수
      var smoothScroll = function smoothScroll(target, callback) {
        var currentScroll = window.scrollY;
        var distance = target - currentScroll;
        var step = distance / 30; // 스크롤 단계
        var currentStep = 0;
        var scrollInterval = setInterval(function () {
          if (currentStep >= 30 || Math.abs(window.scrollY - target) < Math.abs(step)) {
            clearInterval(scrollInterval);
            window.scrollTo({
              top: target
            });
            if (callback) callback(); // 콜백 호출
          } else {
            window.scrollBy(0, step);
            currentStep++;
          }
        }, 30);
      };

      // 이벤트 리스너 등록
      this.querySelectorAll(".widget-button").forEach(function (button) {
        button.addEventListener("click", function (e) {
          var action = e.currentTarget.dataset.action;
          switch (action) {
            case "kakao":
              alert("카카오톡 버튼 클릭");
              break;
            case "instagram":
              alert("인스타그램 버튼 클릭");
              break;
            case "blog":
              alert("네이버 블로그 버튼 클릭");
              break;
            case "youtube":
              alert("유튜브 버튼 클릭");
              break;
            case "scroll-top":
              smoothScroll(0);
              break;
            case "scroll-bottom":
              smoothScroll(document.body.scrollHeight);
              break;
            default:
              console.log("알 수 없는 동작");
          }
        });
      });

      // 스크롤 이벤트 등록
      var widget = this.querySelector(".widget");
      var widgetVisible = false; // 위젯 상태 플래그
      var isScrolling = false; // 스크롤 동작 중인지 여부

      var updateWidgetVisibility = function updateWidgetVisibility() {
        if (!isScrolling) {
          if (window.scrollY > 100) {
            if (!widgetVisible) {
              widget.style.display = "flex"; // 위젯 표시
              widgetVisible = true;
            }
          } else {
            if (widgetVisible) {
              widget.style.display = "none"; // 위젯 숨김
              widgetVisible = false;
            }
          }
        }
      };

      // 스크롤 이벤트 핸들러
      window.addEventListener("scroll", updateWidgetVisibility);

      // 스크롤 중 플래그 처리
      var setScrollingFlag = function setScrollingFlag(isScroll) {
        isScrolling = isScroll;
        if (!isScroll) updateWidgetVisibility(); // 플래그 해제 시 위젯 상태 확인
      };

      // Smooth Scroll에 플래그 처리
      this.querySelectorAll("[data-action='scroll-top'], [data-action='scroll-bottom']").forEach(function (button) {
        button.addEventListener("click", function () {
          setScrollingFlag(true);
          smoothScroll(button.dataset.action === "scroll-top" ? 0 : document.body.scrollHeight, function () {
            return setScrollingFlag(false);
          });
        });
      });

      // 초기 위젯 상태 설정
      updateWidgetVisibility();
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 등록
if (!customElements.get("widget-component")) {
  customElements.define("widget-component", WidgetComponent);
}
var _default = exports.default = WidgetComponent;
},{}],"components/slides/Banner.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var BannerComponent = /*#__PURE__*/function (_HTMLElement) {
  // Shadow DOM 비활성화 (CSS 파일 적용을 위해)
  function BannerComponent() {
    _classCallCheck(this, BannerComponent);
    return _callSuper(this, BannerComponent);
  }
  _inherits(BannerComponent, _HTMLElement);
  return _createClass(BannerComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // 배너 데이터
      var banners = [{
        image: "public/banner/main_banner01.jpg",
        title: "이벤트&프로모션",
        description: "황금단 이벤트 및 프로모션 안내입니다."
      }, {
        image: "public/banner/main_banner02.jpg",
        title: "상품문의",
        description: "궁금하신 사항은 언제든지 문의해주세요."
      }, {
        image: "public/banner/main_banner03.jpg",
        title: "고객후기",
        description: "고객님들의 후기 게시판입니다."
      }];

      // HTML 구조 생성
      this.innerHTML = "\n          <div class=\"banner\">\n            ".concat(banners.map(function (banner) {
        return "\n              <div class=\"banner-container\">\n                <img src=\"".concat(banner.image, "\" alt=\"").concat(banner.title, "\" class=\"banner-image\">\n                <div class=\"banner-text\">\n                  <span>").concat(banner.title, "</span>\n                  <span>").concat(banner.description, "</span>\n                </div>\n              </div>\n            ");
      }).join(""), "\n          </div>\n        ");
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("banner-component", BannerComponent);
var _default = exports.default = BannerComponent;
},{}],"api/api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToCart = addToCart;
exports.clearCart = clearCart;
exports.createProduct = createProduct;
exports.deleteCartItem = deleteCartItem;
exports.deleteProduct = deleteProduct;
exports.fetchCart = fetchCart;
exports.fetchProductById = fetchProductById;
exports.fetchProducts = fetchProducts;
exports.filterProducts = filterProducts;
exports.searchProducts = searchProducts;
exports.updateCartItem = updateCartItem;
exports.updateProduct = updateProduct;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var PRODUCTS_BASE_URL = "https://goldsilkaws.metashopping.kr/products"; // 수정된 URL
var CART_BASE_URL = "https://goldsilkaws.metashopping.kr/cart"; // 수정된 URL

// 모든 상품 가져오기
function fetchProducts() {
  return _fetchProducts.apply(this, arguments);
} // 특정 상품 가져오기 (ID 기반)
function _fetchProducts() {
  _fetchProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return fetch(PRODUCTS_BASE_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            }
          });
        case 3:
          response = _context.sent;
          if (response.ok) {
            _context.next = 6;
            break;
          }
          throw new Error("Failed to fetch products: ".concat(response.status));
        case 6:
          _context.next = 8;
          return response.json();
        case 8:
          return _context.abrupt("return", _context.sent);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching products:", _context.t0.message);
          return _context.abrupt("return", []);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _fetchProducts.apply(this, arguments);
}
function fetchProductById(_x) {
  return _fetchProductById.apply(this, arguments);
} // 새로운 상품 추가
function _fetchProductById() {
  _fetchProductById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(product_id) {
    var response;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return fetch("".concat(PRODUCTS_BASE_URL, "/").concat(product_id), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            }
          });
        case 3:
          response = _context2.sent;
          if (response.ok) {
            _context2.next = 6;
            break;
          }
          throw new Error("Failed to fetch product with ID ".concat(product_id, ": ").concat(response.status));
        case 6:
          _context2.next = 8;
          return response.json();
        case 8:
          return _context2.abrupt("return", _context2.sent);
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching product with ID ".concat(product_id, ":"), _context2.t0.message);
          return _context2.abrupt("return", null);
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return _fetchProductById.apply(this, arguments);
}
function createProduct(_x2) {
  return _createProduct.apply(this, arguments);
} // 상품 업데이트
function _createProduct() {
  _createProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(productData) {
    var response, createdProduct;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return fetch(PRODUCTS_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            },
            body: JSON.stringify(productData)
          });
        case 3:
          response = _context3.sent;
          if (response.ok) {
            _context3.next = 6;
            break;
          }
          throw new Error("Failed to create product: ".concat(response.status));
        case 6:
          _context3.next = 8;
          return response.json();
        case 8:
          createdProduct = _context3.sent;
          return _context3.abrupt("return", createdProduct);
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error("Error creating product:", _context3.t0.message);
          return _context3.abrupt("return", null);
        case 16:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 12]]);
  }));
  return _createProduct.apply(this, arguments);
}
function updateProduct(_x3, _x4) {
  return _updateProduct.apply(this, arguments);
} // 상품 삭제
function _updateProduct() {
  _updateProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(product_id, productData) {
    var response, updatedProduct;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return fetch("".concat(PRODUCTS_BASE_URL, "/").concat(product_id), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            },
            body: JSON.stringify(productData)
          });
        case 3:
          response = _context4.sent;
          if (response.ok) {
            _context4.next = 6;
            break;
          }
          throw new Error("Failed to update product with ID ".concat(product_id, ": ").concat(response.status));
        case 6:
          _context4.next = 8;
          return response.json();
        case 8:
          updatedProduct = _context4.sent;
          return _context4.abrupt("return", updatedProduct);
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error("Error updating product with ID ".concat(product_id, ":"), _context4.t0.message);
          return _context4.abrupt("return", null);
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 12]]);
  }));
  return _updateProduct.apply(this, arguments);
}
function deleteProduct(_x5) {
  return _deleteProduct.apply(this, arguments);
} // 검색(Search) 상품 가져오기
function _deleteProduct() {
  _deleteProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(product_id) {
    var response;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return fetch("".concat(PRODUCTS_BASE_URL, "/").concat(product_id), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            }
          });
        case 3:
          response = _context5.sent;
          if (response.ok) {
            _context5.next = 6;
            break;
          }
          throw new Error("Failed to delete product with ID ".concat(product_id, ": ").concat(response.status));
        case 6:
          return _context5.abrupt("return", true);
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting product with ID ".concat(product_id, ":"), _context5.t0.message);
          return _context5.abrupt("return", false);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return _deleteProduct.apply(this, arguments);
}
function searchProducts(_x6) {
  return _searchProducts.apply(this, arguments);
} // 필터(Filter) 상품 가져오기
function _searchProducts() {
  _searchProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(query) {
    var response, products;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return fetch("".concat(PRODUCTS_BASE_URL, "/search?query=").concat(encodeURIComponent(query)), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            }
          });
        case 3:
          response = _context6.sent;
          if (response.ok) {
            _context6.next = 6;
            break;
          }
          throw new Error("Failed to search products: ".concat(response.status));
        case 6:
          _context6.next = 8;
          return response.json();
        case 8:
          products = _context6.sent;
          return _context6.abrupt("return", products);
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error("Error searching products:", _context6.t0.message);
          return _context6.abrupt("return", []);
        case 16:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return _searchProducts.apply(this, arguments);
}
function filterProducts(_x7) {
  return _filterProducts.apply(this, arguments);
} // 장바구니 데이터 가져오기
function _filterProducts() {
  _filterProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(filters) {
    var queryString, response, products;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          queryString = new URLSearchParams(filters).toString();
          _context7.next = 4;
          return fetch("".concat(PRODUCTS_BASE_URL, "/filter?").concat(queryString), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(localStorage.getItem("access_token")) // 인증 추가
            }
          });
        case 4:
          response = _context7.sent;
          if (response.ok) {
            _context7.next = 7;
            break;
          }
          throw new Error("Failed to filter products: ".concat(response.status));
        case 7:
          _context7.next = 9;
          return response.json();
        case 9:
          products = _context7.sent;
          return _context7.abrupt("return", products);
        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.error("Error filtering products:", _context7.t0.message);
          return _context7.abrupt("return", []);
        case 17:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 13]]);
  }));
  return _filterProducts.apply(this, arguments);
}
function fetchCart() {
  return _fetchCart.apply(this, arguments);
} // 장바구니에 상품 추가
function _fetchCart() {
  _fetchCart = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var token, response, data;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          token = localStorage.getItem("access_token");
          if (token) {
            _context8.next = 6;
            break;
          }
          alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          window.location.href = "/user/login.html";
          return _context8.abrupt("return", []);
        case 6:
          _context8.next = 8;
          return fetch(CART_BASE_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(token)
            }
          });
        case 8:
          response = _context8.sent;
          if (response.ok) {
            _context8.next = 17;
            break;
          }
          _context8.t0 = response.status;
          _context8.next = _context8.t0 === 401 ? 13 : 16;
          break;
        case 13:
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/user/login.html";
          return _context8.abrupt("return", []);
        case 16:
          throw new Error("Failed to fetch cart items: ".concat(response.status));
        case 17:
          _context8.next = 19;
          return response.json();
        case 19:
          data = _context8.sent;
          if (Array.isArray(data)) {
            _context8.next = 22;
            break;
          }
          throw new Error("Unexpected response format.");
        case 22:
          return _context8.abrupt("return", data);
        case 25:
          _context8.prev = 25;
          _context8.t1 = _context8["catch"](0);
          console.error("Error fetching cart items:", _context8.t1.message);
          alert("장바구니 조회 중 오류가 발생했습니다.");
          return _context8.abrupt("return", []);
        case 30:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 25]]);
  }));
  return _fetchCart.apply(this, arguments);
}
function addToCart(_x8, _x9) {
  return _addToCart.apply(this, arguments);
} // 장바구니 항목 삭제
function _addToCart() {
  _addToCart = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(product_Id, quantity) {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          token = localStorage.getItem("access_token");
          if (token) {
            _context9.next = 6;
            break;
          }
          alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          window.location.href = "/user/login.html";
          return _context9.abrupt("return", null);
        case 6:
          _context9.next = 8;
          return fetch(CART_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(token)
            },
            body: JSON.stringify({
              product_id: product_Id,
              quantity: quantity
            })
          });
        case 8:
          response = _context9.sent;
          if (response.ok) {
            _context9.next = 11;
            break;
          }
          throw new Error("Failed to add item to cart: ".concat(response.status));
        case 11:
          _context9.next = 13;
          return response.json();
        case 13:
          return _context9.abrupt("return", _context9.sent);
        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](0);
          console.error("Error adding item to cart:", _context9.t0.message);
          alert("장바구니 추가 중 오류가 발생했습니다.");
          return _context9.abrupt("return", null);
        case 21:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 16]]);
  }));
  return _addToCart.apply(this, arguments);
}
function deleteCartItem(_x10) {
  return _deleteCartItem.apply(this, arguments);
} // 장바구니 항목 수량 업데이트
function _deleteCartItem() {
  _deleteCartItem = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(cart_Id) {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          token = localStorage.getItem("access_token");
          if (token) {
            _context10.next = 4;
            break;
          }
          throw new Error("로그인이 필요합니다.");
        case 4:
          _context10.next = 6;
          return fetch("".concat(CART_BASE_URL, "/").concat(cart_Id), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(token) // JWT 토큰
            }
          });
        case 6:
          response = _context10.sent;
          if (response.ok) {
            _context10.next = 9;
            break;
          }
          throw new Error("Failed to delete cart item");
        case 9:
          _context10.next = 11;
          return response.json();
        case 11:
          return _context10.abrupt("return", _context10.sent);
        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](0);
          console.error("Error deleting cart item:", _context10.t0.message);
          throw _context10.t0;
        case 18:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 14]]);
  }));
  return _deleteCartItem.apply(this, arguments);
}
function updateCartItem(_x11, _x12) {
  return _updateCartItem.apply(this, arguments);
} // 장바구니 비우기
function _updateCartItem() {
  _updateCartItem = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(cart_Id, quantity) {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          token = localStorage.getItem("access_token");
          if (token) {
            _context11.next = 4;
            break;
          }
          throw new Error("로그인이 필요합니다.");
        case 4:
          _context11.next = 6;
          return fetch("".concat(CART_BASE_URL, "/").concat(cart_Id), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(token) // JWT 토큰
            },
            body: JSON.stringify({
              quantity: quantity
            })
          });
        case 6:
          response = _context11.sent;
          if (response.ok) {
            _context11.next = 9;
            break;
          }
          throw new Error("Failed to update cart item");
        case 9:
          _context11.next = 11;
          return response.json();
        case 11:
          return _context11.abrupt("return", _context11.sent);
        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](0);
          console.error("Error updating cart item:", _context11.t0.message);
          throw _context11.t0;
        case 18:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 14]]);
  }));
  return _updateCartItem.apply(this, arguments);
}
function clearCart() {
  return _clearCart.apply(this, arguments);
}
function _clearCart() {
  _clearCart = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          token = localStorage.getItem("access_token");
          if (token) {
            _context12.next = 4;
            break;
          }
          throw new Error("로그인이 필요합니다.");
        case 4:
          _context12.next = 6;
          return fetch(CART_BASE_URL, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
              Authorization: "Bearer ".concat(token) // JWT 토큰
            }
          });
        case 6:
          response = _context12.sent;
          if (response.ok) {
            _context12.next = 9;
            break;
          }
          throw new Error("Failed to clear cart");
        case 9:
          _context12.next = 11;
          return response.json();
        case 11:
          return _context12.abrupt("return", _context12.sent);
        case 14:
          _context12.prev = 14;
          _context12.t0 = _context12["catch"](0);
          console.error("Error clearing cart:", _context12.t0.message);
          throw _context12.t0;
        case 18:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 14]]);
  }));
  return _clearCart.apply(this, arguments);
}
},{}],"components/utils/image.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatImagePath = formatImagePath;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function formatImagePath(_x) {
  return _formatImagePath.apply(this, arguments);
}
function _formatImagePath() {
  _formatImagePath = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(imagePath) {
    var baseURL, fullURL, response, blob;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (imagePath) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", "placeholder.jpg");
        case 2:
          baseURL = "https://goldsilkaws.metashopping.kr"; // 서버의 base URL
          // 이미지 경로에 /images/가 포함되지 않으면 경로를 추가
          if (!imagePath.includes("/images/")) {
            imagePath = "/images".concat(imagePath.startsWith("/") ? "" : "/").concat(imagePath);
          }
          fullURL = "".concat(baseURL).concat(imagePath); // 최종 이미지 URL
          _context.prev = 5;
          _context.next = 8;
          return fetch(fullURL, {
            method: "GET"
          });
        case 8:
          response = _context.sent;
          if (response.ok) {
            _context.next = 12;
            break;
          }
          console.error("Failed to load image:", fullURL);
          return _context.abrupt("return", "placeholder.jpg");
        case 12:
          _context.next = 14;
          return response.blob();
        case 14:
          blob = _context.sent;
          return _context.abrupt("return", URL.createObjectURL(blob));
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](5);
          console.error("Error fetching image:", _context.t0.message);
          return _context.abrupt("return", "placeholder.jpg");
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 18]]);
  }));
  return _formatImagePath.apply(this, arguments);
}
},{}],"components/slides/Best.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _api = require("../../api/api.js");
var _image = require("../utils/image.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); } // JSON 데이터를 가져오는 API 함수
var BestProductComponent = /*#__PURE__*/function (_HTMLElement) {
  function BestProductComponent() {
    var _this;
    _classCallCheck(this, BestProductComponent);
    _this = _callSuper(this, BestProductComponent);
    _this.products = [];
    return _this;
  }
  _inherits(BestProductComponent, _HTMLElement);
  return _createClass(BestProductComponent, [{
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var allProducts;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _api.fetchProducts)();
            case 3:
              allProducts = _context.sent;
              // "BEST" 태그 필터링
              this.products = allProducts.filter(function (product) {
                return Array.isArray(product.tags) && product.tags.includes("BEST");
              }).slice(0, 10); // 최대 10개 상품만 가져오기
              _context.next = 7;
              return this.render();
            case 7:
              // 비동기 렌더링
              this.addEventListeners();
              _context.next = 14;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              console.error("Failed to load best products:", _context.t0);
              this.innerHTML = "<p>\uBCA0\uC2A4\uD2B8\uC140\uB7EC \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.</p>";
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 10]]);
      }));
      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }
      return connectedCallback;
    }() // 렌더링 함수
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = "\n      <div class=\"best-product-container\">\n        <!-- \uC81C\uBAA9 -->\n        <div class=\"swiper-text\">\n          <span>\uBCA0\uC2A4\uD2B8\uC140\uB7EC</span>\n          <span>\uD669\uAE08\uB2E8\uC5D0\uC11C \uC778\uAE30\uC788\uB294 \uC0C1\uD488</span>\n        </div>\n        \n        <!-- \uC0C1\uD488 \uB9AC\uC2A4\uD2B8 -->\n        <div class=\"Products\">\n          ";
              _context2.next = 3;
              return this.renderProducts();
            case 3:
              _context2.t1 = _context2.sent;
              this.innerHTML = _context2.t0.concat.call(_context2.t0, _context2.t1, "\n        </div>\n      </div>\n    ");
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function render() {
        return _render.apply(this, arguments);
      }
      return render;
    }() // 베스트셀러 상품 렌더링
  }, {
    key: "renderProducts",
    value: function () {
      var _renderProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var renderedProducts;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(this.products.length === 0)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", "<p>\uB4F1\uB85D\uB41C \uBCA0\uC2A4\uD2B8\uC140\uB7EC \uC0C1\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>");
            case 2:
              _context4.next = 4;
              return Promise.all(this.products.map(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(product) {
                  var _product$images, _product$tags;
                  var imagePath;
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _image.formatImagePath)((_product$images = product.images) === null || _product$images === void 0 ? void 0 : _product$images[0]);
                      case 2:
                        imagePath = _context3.sent;
                        return _context3.abrupt("return", "\n          <div class=\"product-card\" data-id=\"".concat(product.product_id || "N/A", "\">\n            <div class=\"product-image-wrapper\">\n              <img src=\"").concat(imagePath, "\" alt=\"").concat(product.name || "상품 이미지", "\" class=\"product-image\" />\n              <div class=\"hover-icons\">\n                <i class=\"fa fa-heart wish-icon\"></i>\n                <i class=\"fa-solid fa-cart-plus cart-icon\" data-id=\"").concat(product.product_id, "\"></i>\n              </div>\n            </div>\n            \n            <div class=\"product-info\">\n              <span class=\"product-name\">").concat(product.name || "상품명 없음", "</span>          \n              <span class=\"price\">").concat(product.price ? product.price.toLocaleString() + " 원" : "가격 정보 없음", "</span>\n              ").concat((_product$tags = product.tags) !== null && _product$tags !== void 0 && _product$tags.includes("BEST") ? "<span class=\"bestTag\">BEST</span>" : "", "\n            </div>\n          </div>\n        "));
                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }, _callee3);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 4:
              renderedProducts = _context4.sent;
              return _context4.abrupt("return", renderedProducts.join(""));
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function renderProducts() {
        return _renderProducts.apply(this, arguments);
      }
      return renderProducts;
    }() // 이벤트 추가
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      // 상품 카드 클릭 이벤트
      var bestProductElements = this.querySelectorAll(".product-card");
      bestProductElements.forEach(function (productElement) {
        productElement.addEventListener("click", function (e) {
          var productId = e.currentTarget.dataset.id;
          if (productId) {
            window.location.href = "product.html?product_id=".concat(productId);
          }
        });
      });

      // 장바구니 아이콘 클릭 이벤트
      var cartIcons = this.querySelectorAll(".cart-icon");
      cartIcons.forEach(function (cartIcon) {
        cartIcon.addEventListener("click", /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(e) {
            var productId;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 방지
                  productId = e.currentTarget.dataset.id;
                  if (!(!productId || productId === "N/A")) {
                    _context5.next = 5;
                    break;
                  }
                  alert("유효하지 않은 상품입니다.");
                  return _context5.abrupt("return");
                case 5:
                  _context5.prev = 5;
                  _context5.next = 8;
                  return (0, _api.addToCart)(productId, 1);
                case 8:
                  // API 호출로 장바구니에 추가
                  alert("장바구니에 상품이 추가되었습니다!");
                  _context5.next = 15;
                  break;
                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](5);
                  console.error("Error adding to cart:", _context5.t0.message);
                  alert("장바구니 추가에 실패했습니다.");
                case 15:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, null, [[5, 11]]);
          }));
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("best-product-component", BestProductComponent);
var _default = exports.default = BestProductComponent;
},{"../../api/api.js":"api/api.js","../utils/image.js":"components/utils/image.js"}],"components/slides/Instagram.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var InstagramComponent = /*#__PURE__*/function (_HTMLElement) {
  function InstagramComponent() {
    _classCallCheck(this, InstagramComponent);
    return _callSuper(this, InstagramComponent, arguments);
  }
  _inherits(InstagramComponent, _HTMLElement);
  return _createClass(InstagramComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // 인스타그램 데이터 (이미지 URL)
      var images = ["https://picsum.photos/200/200"];

      // HTML 구조 생성
      this.innerHTML = "\n                   <div class=\"swiper-text\">\n            <span><i class=\"fa-brands fa-instagram\" style=\"color: #353535;font-size:24px\"></i> INSTAGRAM</span>\n            <span>\uC0C1\uD488\uC744 \uC774\uC6A9\uD558\uC2E0 \uACE0\uAC1D\uB2D8\uB4E4\uC758 \uB9AC\uC5BC \uD6C4\uAE30\uC785\uB2C8\uB2E4!</span>\n            </div>\n        <div class=\"instagram-grid\">\n          ".concat(images.map(function (image) {
        return "\n            <div class=\"instagram-item\">\n              <img src=\"".concat(image, "\" alt=\"Instagram Post\" class=\"instagram-image\" />\n              <div class=\"instagram-overlay\">\n                <i class=\"fa-brands fa-instagram\"></i>\n              </div>\n            </div>\n          ");
      }).join(""), "\n        </div>\n      ");
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 등록
if (!customElements.get("instagram-component")) {
  customElements.define("instagram-component", InstagramComponent);
}

// Intersection Observer로 컴포넌트 애니메이션 적용
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible"); // 컴포넌트가 보이면 애니메이션 클래스 추가
    } else {
      entry.target.classList.remove("fade-in-visible"); // 보이지 않으면 클래스 제거
    }
  });
}, {
  threshold: 0.1 // 10%만 보이면 애니메이션 실행
});
var _default = exports.default = InstagramComponent;
},{}],"components/slides/NewProduct.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _api = require("../../api/api.js");
var _image = require("../utils/image.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); } // JSON 데이터를 가져오는 API 함수
var NewProductComponent = /*#__PURE__*/function (_HTMLElement) {
  function NewProductComponent() {
    var _this;
    _classCallCheck(this, NewProductComponent);
    _this = _callSuper(this, NewProductComponent);
    _this.products = [];
    return _this;
  }
  _inherits(NewProductComponent, _HTMLElement);
  return _createClass(NewProductComponent, [{
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var allProducts;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _api.fetchProducts)();
            case 3:
              allProducts = _context.sent;
              // "NEW" 태그 필터링
              this.products = allProducts.filter(function (product) {
                return Array.isArray(product.tags) && product.tags.includes("NEW");
              }).slice(0, 10); // 최신 10개 상품만 가져오기
              _context.next = 7;
              return this.render();
            case 7:
              // 비동기 렌더링
              this.addEventListeners();
              _context.next = 14;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              console.error("Failed to load new products:", _context.t0);
              this.innerHTML = "<p>\uC2E0\uC0C1\uD488 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.</p>";
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 10]]);
      }));
      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }
      return connectedCallback;
    }() // 비동기 렌더링 함수
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = "\n      <div class=\"new-product-container\">\n        <!-- \uC81C\uBAA9 -->\n        <div class=\"swiper-text\">\n          <span>\uC2E0\uC0C1\uD488</span>\n          <span>\uD669\uAE08\uB2E8\uC5D0\uC11C \uC120\uBCF4\uC774\uB294 \uC2E0\uC0C1\uD488</span>\n        </div>\n        \n        <!-- \uC0C1\uD488 \uB9AC\uC2A4\uD2B8 -->\n        <div class=\"Products\">\n          ";
              _context2.next = 3;
              return this.renderProducts();
            case 3:
              _context2.t1 = _context2.sent;
              this.innerHTML = _context2.t0.concat.call(_context2.t0, _context2.t1, "\n        </div>\n      </div>\n    ");
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function render() {
        return _render.apply(this, arguments);
      }
      return render;
    }() // 신상품 리스트 렌더링 (비동기 이미지 처리)
  }, {
    key: "renderProducts",
    value: function () {
      var _renderProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var renderedProducts;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(this.products.length === 0)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", "<p>\uB4F1\uB85D\uB41C \uC2E0\uC0C1\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>");
            case 2:
              _context4.next = 4;
              return Promise.all(this.products.map(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(product) {
                  var _product$images, _product$tags;
                  var imagePath;
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _image.formatImagePath)((_product$images = product.images) === null || _product$images === void 0 ? void 0 : _product$images[0]);
                      case 2:
                        imagePath = _context3.sent;
                        return _context3.abrupt("return", "\n          <div class=\"product-card\" data-id=\"".concat(product.product_id || "N/A", "\">\n            <div class=\"product-image-wrapper\">\n              <img src=\"").concat(imagePath, "\" alt=\"").concat(product.name || "상품 이미지", "\" class=\"product-image\" />\n              <div class=\"hover-icons\">\n                <i class=\"fa fa-heart wish-icon\"></i>\n                <i class=\"fa-solid fa-cart-plus cart-icon\" data-id=\"").concat(product.product_id, "\"></i>\n              </div>\n            </div>\n            \n            <div class=\"product-info\">\n              <span class=\"product-name\">").concat(product.name || "상품명 없음", "</span>          \n              <span class=\"price\">").concat(product.price ? product.price.toLocaleString() + " 원" : "가격 정보 없음", "</span>\n              ").concat((_product$tags = product.tags) !== null && _product$tags !== void 0 && _product$tags.includes("NEW") ? "<span class=\"newTag\">NEW</span>" : "", "\n            </div>\n          </div>\n        "));
                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }, _callee3);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 4:
              renderedProducts = _context4.sent;
              return _context4.abrupt("return", renderedProducts.join(""));
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function renderProducts() {
        return _renderProducts.apply(this, arguments);
      }
      return renderProducts;
    }() // 이벤트 추가
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      // 상품 카드 클릭 이벤트
      var productElements = this.querySelectorAll(".product-card");
      productElements.forEach(function (productElement) {
        productElement.addEventListener("click", function (e) {
          var productId = e.currentTarget.dataset.id;
          if (productId) {
            window.location.href = "product.html?product_id=".concat(productId);
          }
        });
      });

      // 장바구니 아이콘 클릭 이벤트
      var cartIcons = this.querySelectorAll(".cart-icon");
      cartIcons.forEach(function (cartIcon) {
        cartIcon.addEventListener("click", /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(e) {
            var productId;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                  productId = e.currentTarget.dataset.id;
                  if (!(!productId || productId === "N/A")) {
                    _context5.next = 5;
                    break;
                  }
                  alert("유효하지 않은 상품입니다.");
                  return _context5.abrupt("return");
                case 5:
                  _context5.prev = 5;
                  _context5.next = 8;
                  return (0, _api.addToCart)(productId, 1);
                case 8:
                  // API 호출로 장바구니에 추가
                  alert("장바구니에 상품이 추가되었습니다!");
                  _context5.next = 15;
                  break;
                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](5);
                  console.error("Error adding to cart:", _context5.t0.message);
                  alert("장바구니 추가에 실패했습니다.");
                case 15:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, null, [[5, 11]]);
          }));
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("new-product-component", NewProductComponent);
var _default = exports.default = NewProductComponent;
},{"../../api/api.js":"api/api.js","../utils/image.js":"components/utils/image.js"}],"components/slides/Recommend.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _api = require("../../api/api.js");
var _image = require("../utils/image.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); } // JSON 데이터를 가져오는 API 함수
var RecommendComponent = /*#__PURE__*/function (_HTMLElement) {
  function RecommendComponent() {
    _classCallCheck(this, RecommendComponent);
    return _callSuper(this, RecommendComponent, arguments);
  }
  _inherits(RecommendComponent, _HTMLElement);
  return _createClass(RecommendComponent, [{
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var allProducts, products;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _api.fetchProducts)();
            case 3:
              allProducts = _context.sent;
              // "BEST" 태그를 가진 상품만 필터링
              products = allProducts.filter(function (product) {
                return Array.isArray(product.tags) && product.tags.includes("BEST");
              }).slice(0, 10); // 최신 10개 상품만 가져오기
              // 데이터가 비어있을 경우 처리
              if (!(products.length === 0)) {
                _context.next = 8;
                break;
              }
              this.innerHTML = "<p>\uCD94\uCC9C\uD560 \uC0C1\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>";
              return _context.abrupt("return");
            case 8:
              _context.next = 10;
              return this.renderProducts(products);
            case 10:
              // Swiper.js 초기화
              new Swiper(".swiper", {
                slidesPerView: 5,
                spaceBetween: 20,
                loop: true,
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev"
                },
                pagination: {
                  el: ".swiper-pagination",
                  clickable: true
                },
                autoplay: {
                  delay: 3000,
                  disableOnInteraction: false
                }
              });

              // 상품 클릭 이벤트 추가
              this.addEventListeners();
              _context.next = 18;
              break;
            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](0);
              console.error("Failed to load recommended products:", _context.t0);
              this.innerHTML = "<p>\uCD94\uCC9C \uC0C1\uD488 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.</p>";
            case 18:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 14]]);
      }));
      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }
      return connectedCallback;
    }() // 상품 리스트 HTML 생성 (비동기 이미지 처리)
  }, {
    key: "renderProducts",
    value: function () {
      var _renderProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(products) {
        var renderedProducts;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Promise.all(products.map(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(product) {
                  var _product$images, _product$tags;
                  var imagePath;
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _image.formatImagePath)((_product$images = product.images) === null || _product$images === void 0 ? void 0 : _product$images[0]);
                      case 2:
                        imagePath = _context2.sent;
                        return _context2.abrupt("return", "\n          <div class=\"swiper-slide\">\n            <div class=\"product\" data-id=\"".concat(product.product_id || "N/A", "\">\n              <div class=\"product-image-wrapper\">\n                <img src=\"").concat(imagePath, "\" alt=\"").concat(product.name || "상품 이미지", "\" class=\"product-image\">\n\n                <div class=\"product-overlay\">\n                  <div class=\"product-info\">\n                    <span>").concat(product.name || "상품명 없음", "</span>          \n                    <span class=\"price\">").concat(product.price ? product.price.toLocaleString() + " 원" : "가격 정보 없음", "</span>\n                    <div class=\"tagBox\">\n                      ").concat(((_product$tags = product.tags) === null || _product$tags === void 0 ? void 0 : _product$tags.map(function (tag) {
                          return "<span class=\"".concat(tag === "NEW" ? "newTag" : "bestTag", "\">").concat(tag, "</span>");
                        }).join("")) || "", "\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        "));
                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 2:
              renderedProducts = _context3.sent;
              this.innerHTML = "\n      <div class=\"swiper\">\n        <div class=\"swiper-text\">\n          <span>\uCD94\uCC9C\uC0C1\uD488</span>\n          <span>\uD669\uAE08\uB2E8\uC774 \uCD94\uCC9C\uD558\uB294 \uC0C1\uD488</span>\n        </div>\n        <div class=\"swiper-wrapper\">\n          ".concat(renderedProducts.join(""), "\n        </div>\n        <div class=\"swiper-button-prev\"></div>\n        <div class=\"swiper-button-next\"></div>\n        <div class=\"swiper-pagination\"></div>\n      </div>\n    ");
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function renderProducts(_x) {
        return _renderProducts.apply(this, arguments);
      }
      return renderProducts;
    }() // 클릭 이벤트 추가
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.querySelectorAll(".product").forEach(function (productElement) {
        productElement.addEventListener("click", function (e) {
          var productId = e.currentTarget.dataset.id;
          console.log("Clicked Product ID:", productId); // product_id 가져오기
          if (productId && productId !== "N/A") {
            window.location.href = "./product.html?product_id=".concat(productId);
          } else {
            alert("유효하지 않은 상품입니다.");
          }
        });
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 정의
customElements.define("recommend-component", RecommendComponent);
var _default = exports.default = RecommendComponent;
},{"../../api/api.js":"api/api.js","../utils/image.js":"components/utils/image.js"}],"components/slides/Review.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var ReviewSliderComponent = /*#__PURE__*/function (_HTMLElement) {
  function ReviewSliderComponent() {
    _classCallCheck(this, ReviewSliderComponent);
    return _callSuper(this, ReviewSliderComponent, arguments);
  }
  _inherits(ReviewSliderComponent, _HTMLElement);
  return _createClass(ReviewSliderComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // 후기 데이터
      var reviews = [{
        id: 1,
        image: "public/product/product01.jpg",
        title: "Excellent Service",
        content: "The service was fantastic, and the quality of the product exceeded my expectations!",
        name: "John Doe",
        stars: 5
      }, {
        id: 2,
        image: "public/product/product02.jpg",
        title: "Amazing Experience",
        content: "I highly recommend this to anyone looking for great service and support.",
        name: "Jane Smith",
        stars: 5
      }, {
        id: 3,
        image: "public/product/product03.jpg",
        title: "Very Satisfied",
        content: "Absolutely loved it! The team was helpful, and the product is top-notch.",
        name: "Emily Johnson",
        stars: 5
      }, {
        id: 4,
        image: "public/product/product04.jpg",
        title: "Highly Recommend",
        content: "Great service, amazing products! Will definitely come back again.",
        name: "Michael Brown",
        stars: 5
      }
      // 필요한 경우 더 많은 리뷰 추가
      ];

      // 최신 10개 리뷰만 가져오기
      var limitedReviews = reviews.slice(0, 10);

      // HTML 구조 생성
      this.innerHTML = "\n      <div class=\"swiper-text\">\n        <span>\uACE0\uAC1D\uD6C4\uAE30</span>\n        <span>\uC0C1\uD488\uC744 \uC774\uC6A9\uD558\uC2E0 \uACE0\uAC1D\uB2D8\uB4E4\uC758 \uB9AC\uC5BC \uD6C4\uAE30\uC785\uB2C8\uB2E4!</span>\n      </div>\n      <div class=\"swiper review-slider\">\n        <div class=\"swiper-wrapper\">\n          ".concat(limitedReviews.map(function (review) {
        return "\n            <div class=\"swiper-slide review\">\n              <div class=\"review-image-wrapper\">\n                <img src=\"".concat(review.image || "public/default-image.jpg", "\" alt=\"").concat(review.name || "고객님", "\" class=\"review-image\" />\n              </div>\n              <div class=\"review-text\">\n                <span class=\"review-title\">").concat(review.title || "제목 없음", "</span>\n                <span class=\"review-content\">").concat(review.content || "후기 내용이 없습니다.", "</span>\n                <span class=\"review-name\">").concat(review.name || "익명의 고객", "</span>\n              </div>\n              <div class=\"review-name-line\"></div>\n              <div class=\"review-stars\">\n                ").concat("★".repeat(review.stars || 0)).concat("☆".repeat(5 - (review.stars || 0)), "\n              </div>\n            </div>\n          ");
      }).join(""), "\n        </div>\n        <!-- \uB124\uBE44\uAC8C\uC774\uC158 \uBC84\uD2BC -->\n        <div class=\"swiper-button-prev\"></div>\n        <div class=\"swiper-button-next\"></div>\n      </div>\n    ");

      // Swiper 초기화
      new Swiper(".review-slider", {
        slidesPerView: 3,
        // 한 화면에 보이는 슬라이드 수
        spaceBetween: 20,
        // 슬라이드 간 간격
        loop: true,
        // 무한 루프
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        autoplay: {
          delay: 4000,
          // 4초 간격으로 슬라이드 전환
          disableOnInteraction: false
        }
      });
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 등록
if (!customElements.get("review-slider-component")) {
  customElements.define("review-slider-component", ReviewSliderComponent);
}
var _default = exports.default = ReviewSliderComponent;
},{}],"components/slides/Slider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var SliderComponent = /*#__PURE__*/function (_HTMLElement) {
  function SliderComponent() {
    _classCallCheck(this, SliderComponent);
    return _callSuper(this, SliderComponent, arguments);
  }
  _inherits(SliderComponent, _HTMLElement);
  return _createClass(SliderComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // 슬라이드 이미지 데이터
      var images = ["public/slide/main_img01.jpg", "public/slide/main_img02.jpg", "public/slide/main_img03.jpg"];
      this.innerHTML = "\n          <div class=\"slider\">\n            <div class=\"slides\">\n              ".concat(images.map(function (src) {
        return "<img src=\"".concat(src, "\" alt=\"Slide\">");
      }).join(""), "\n            </div>\n            <button class=\"prev\">\n            <i class=\"fa-solid fa-circle-chevron-left\"></i>\n            </button>\n            <button class=\"next\">\n            <i class=\"fa-solid fa-circle-chevron-right\"></i>\n            </button>\n            <div class=\"pagination\">\n              <span class=\"page-indicator\">1 / ").concat(images.length, "</span>\n            </div>\n          </div>\n        ");

      // 요소 선택
      var slides = this.querySelector(".slides");
      var totalSlides = images.length;
      var prevButton = this.querySelector(".prev");
      var nextButton = this.querySelector(".next");
      var pageIndicator = this.querySelector(".page-indicator");
      var currentIndex = 0;

      // 슬라이드 업데이트 함수
      var updateSlider = function updateSlider() {
        slides.style.transform = "translateX(-".concat(currentIndex * 100, "%)");
        pageIndicator.textContent = "".concat(currentIndex + 1, " / ").concat(totalSlides);
      };

      // 이전 버튼 이벤트
      prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
        resetAutoSlide(); // 자동 슬라이드 초기화
      });

      // 다음 버튼 이벤트
      nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
        resetAutoSlide(); // 자동 슬라이드 초기화
      });

      // 자동 슬라이드
      var autoSlide = function autoSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
      };

      // 자동 슬라이드 타이머 설정
      var autoSlideInterval = 6000; // 6000ms = 6초
      var slideTimer = setInterval(autoSlide, autoSlideInterval);

      // 자동 슬라이드 초기화 함수
      var resetAutoSlide = function resetAutoSlide() {
        clearInterval(slideTimer); // 기존 타이머 정지
        slideTimer = setInterval(autoSlide, autoSlideInterval); // 새로운 타이머 시작
      };

      // 초기 슬라이드 표시
      updateSlider();
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)); // 컴포넌트 정의
customElements.define("slider-component", SliderComponent);
var _default = exports.default = SliderComponent;
},{}],"components/BrandInfo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var BrandInfoComponent = /*#__PURE__*/function (_HTMLElement) {
  function BrandInfoComponent() {
    _classCallCheck(this, BrandInfoComponent);
    return _callSuper(this, BrandInfoComponent, arguments);
  }
  _inherits(BrandInfoComponent, _HTMLElement);
  return _createClass(BrandInfoComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.innerHTML = "\n  <div class=\"longBanner-text\">\n          <span>Brand Information</span>\n          <span\n            >\uD669\uAE08\uB2E8\uC740 \uC804\uD1B5 \uD55C\uBCF5 \uD2B9\uC720\uC758 \uC544\uB984\uB2E4\uC6C0\uC5D0 \uB3C5\uCC3D\uC801\uC778 \uB514\uC790\uC778\uC744 \uC811\uBAA9\uD574,\n            <br />\n            \uC624\uD2B8\uCFE0\uD280\uB974\uB97C \uD45C\uBC29\uD558\uB294 \uD55C\uAD6D \uC804\uD1B5 \uBE0C\uB79C\uB4DC\uC785\uB2C8\uB2E4.</span\n          >\n          <button class=\"moreBtn\">\n            <p>More</p>\n            <i class=\"fa-solid fa-arrow-right\"></i>\n          </button>\n        </div>\n              ";
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define("brand-info-component", BrandInfoComponent);
var _default = exports.default = BrandInfoComponent;
},{}],"components/layout.js":[function(require,module,exports) {
"use strict";

var _HeaderComponent = _interopRequireDefault(require("./layout/HeaderComponent.js"));
var _FooterCoponent = _interopRequireDefault(require("./layout/FooterCoponent.js"));
var _AdBanner = _interopRequireDefault(require("./layout/AdBanner.js"));
var _Widget = _interopRequireDefault(require("./layout/Widget.js"));
var _Banner = _interopRequireDefault(require("./slides/Banner.js"));
var _Best = _interopRequireDefault(require("./slides/Best.js"));
var _Instagram = _interopRequireDefault(require("./slides/Instagram.js"));
var _NewProduct = _interopRequireDefault(require("./slides/NewProduct.js"));
var _Recommend = _interopRequireDefault(require("./slides/Recommend.js"));
var _Review = _interopRequireDefault(require("./slides/Review.js"));
var _Slider = _interopRequireDefault(require("./slides/Slider.js"));
var _BrandInfo = _interopRequireDefault(require("./BrandInfo.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* 위젯 */

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible"); // 컴포넌트가 보이면 애니메이션 클래스 추가
    } else {
      entry.target.classList.remove("fade-in-visible"); // 보이지 않으면 클래스 제거
    }
  });
}, {
  threshold: 0.1 // 10%만 보이면 애니메이션 실행
});
document.querySelectorAll("new-product-component").forEach(function (component) {
  return observer.observe(component);
});
document.querySelectorAll("best-product-component").forEach(function (component) {
  return observer.observe(component);
});
document.querySelectorAll("review-slider-component").forEach(function (component) {
  return observer.observe(component);
});
document.querySelectorAll(".longBanner-text").forEach(function (component) {
  return observer.observe(component);
});
document.querySelectorAll("brandInfo-component").forEach(function (component) {
  return observer.observe(component);
});
},{"./layout/HeaderComponent.js":"components/layout/HeaderComponent.js","./layout/FooterCoponent.js":"components/layout/FooterCoponent.js","./layout/AdBanner.js":"components/layout/AdBanner.js","./layout/Widget.js":"components/layout/Widget.js","./slides/Banner.js":"components/slides/Banner.js","./slides/Best.js":"components/slides/Best.js","./slides/Instagram.js":"components/slides/Instagram.js","./slides/NewProduct.js":"components/slides/NewProduct.js","./slides/Recommend.js":"components/slides/Recommend.js","./slides/Review.js":"components/slides/Review.js","./slides/Slider.js":"components/slides/Slider.js","./BrandInfo.js":"components/BrandInfo.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62345" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","components/layout.js"], null)
//# sourceMappingURL=/layout.2585b822.js.map