/*!

 handlebars v4.0.5

Copyright (C) 2011-2015 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Handlebars"] = factory();
	else
		root["Handlebars"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(1)['default'];

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;

	var _handlebarsBase = __webpack_require__(3);

	var base = _interopRequireWildcard(_handlebarsBase);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _handlebarsSafeString = __webpack_require__(17);

	var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

	var _handlebarsException = __webpack_require__(5);

	var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

	var _handlebarsUtils = __webpack_require__(4);

	var Utils = _interopRequireWildcard(_handlebarsUtils);

	var _handlebarsRuntime = __webpack_require__(18);

	var runtime = _interopRequireWildcard(_handlebarsRuntime);

	var _handlebarsNoConflict = __webpack_require__(19);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _handlebarsSafeString2['default'];
	  hb.Exception = _handlebarsException2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};

	    if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }

	    newObj["default"] = obj;
	    return newObj;
	  }
	};

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;

	var _utils = __webpack_require__(4);

	var _exception = __webpack_require__(5);

	var _exception2 = _interopRequireDefault(_exception);

	var _helpers = __webpack_require__(6);

	var _decorators = __webpack_require__(14);

	var _logger = __webpack_require__(16);

	var _logger2 = _interopRequireDefault(_logger);

	var VERSION = '4.0.5';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 7;

	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1',
	  7: '>= 4.0.0'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials, decorators) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	  this.decorators = decorators || {};

	  _helpers.registerDefaultHelpers(this);
	  _decorators.registerDefaultDecorators(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: _logger2['default'],
	  log: _logger2['default'].log,

	  registerHelper: function registerHelper(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple helpers');
	      }
	      _utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (_utils.toString.call(name) === objectType) {
	      _utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  },

	  registerDecorator: function registerDecorator(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple decorators');
	      }
	      _utils.extend(this.decorators, name);
	    } else {
	      this.decorators[name] = fn;
	    }
	  },
	  unregisterDecorator: function unregisterDecorator(name) {
	    delete this.decorators[name];
	  }
	};

	var log = _logger2['default'].log;

	exports.log = log;
	exports.createFrame = _utils.createFrame;
	exports.logger = _logger2['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.createFrame = createFrame;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/* eslint-disable func-style */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	exports.isFunction = isFunction;

	/* eslint-enable func-style */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};

	exports.isArray = isArray;
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function createFrame(object) {
	  var frame = extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  /* istanbul ignore else */
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  if (loc) {
	    this.lineNumber = line;
	    this.column = column;
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;
	exports.registerDefaultHelpers = registerDefaultHelpers;

	var _helpersBlockHelperMissing = __webpack_require__(7);

	var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

	var _helpersEach = __webpack_require__(8);

	var _helpersEach2 = _interopRequireDefault(_helpersEach);

	var _helpersHelperMissing = __webpack_require__(9);

	var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

	var _helpersIf = __webpack_require__(10);

	var _helpersIf2 = _interopRequireDefault(_helpersIf);

	var _helpersLog = __webpack_require__(11);

	var _helpersLog2 = _interopRequireDefault(_helpersLog);

	var _helpersLookup = __webpack_require__(12);

	var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

	var _helpersWith = __webpack_require__(13);

	var _helpersWith2 = _interopRequireDefault(_helpersWith);

	function registerDefaultHelpers(instance) {
	  _helpersBlockHelperMissing2['default'](instance);
	  _helpersEach2['default'](instance);
	  _helpersHelperMissing2['default'](instance);
	  _helpersIf2['default'](instance);
	  _helpersLog2['default'](instance);
	  _helpersLookup2['default'](instance);
	  _helpersWith2['default'](instance);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	exports['default'] = function (instance) {
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (_utils.isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	var _exception = __webpack_require__(5);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = _utils.createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (_utils.isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          if (i in context) {
	            execIteration(i, i, i === context.length - 1);
	          }
	        }
	      } else {
	        var priorKey = undefined;

	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey !== undefined) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey !== undefined) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;

	var _exception = __webpack_require__(5);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('helperMissing', function () /* [args, ]options */{
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} construct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	exports['default'] = function (instance) {
	  instance.registerHelper('if', function (conditional, options) {
	    if (_utils.isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('log', function () /* message, options */{
	    var args = [undefined],
	        options = arguments[arguments.length - 1];
	    for (var i = 0; i < arguments.length - 1; i++) {
	      args.push(arguments[i]);
	    }

	    var level = 1;
	    if (options.hash.level != null) {
	      level = options.hash.level;
	    } else if (options.data && options.data.level != null) {
	      level = options.data.level;
	    }
	    args[0] = level;

	    instance.log.apply(instance, args);
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('lookup', function (obj, field) {
	    return obj && obj[field];
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	exports['default'] = function (instance) {
	  instance.registerHelper('with', function (context, options) {
	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!_utils.isEmpty(context)) {
	      var data = options.data;
	      if (options.data && options.ids) {
	        data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
	      }

	      return fn(context, {
	        data: data,
	        blockParams: _utils.blockParams([context], [data && data.contextPath])
	      });
	    } else {
	      return options.inverse(this);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;
	exports.registerDefaultDecorators = registerDefaultDecorators;

	var _decoratorsInline = __webpack_require__(15);

	var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

	function registerDefaultDecorators(instance) {
	  _decoratorsInline2['default'](instance);
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	exports['default'] = function (instance) {
	  instance.registerDecorator('inline', function (fn, props, container, options) {
	    var ret = fn;
	    if (!props.partials) {
	      props.partials = {};
	      ret = function (context, options) {
	        // Create a new partials stack frame prior to exec.
	        var original = container.partials;
	        container.partials = _utils.extend({}, original, props.partials);
	        var ret = fn(context, options);
	        container.partials = original;
	        return ret;
	      };
	    }

	    props.partials[options.args[0]] = options.fn;

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(4);

	var logger = {
	  methodMap: ['debug', 'info', 'warn', 'error'],
	  level: 'info',

	  // Maps a given level value to the `methodMap` indexes above.
	  lookupLevel: function lookupLevel(level) {
	    if (typeof level === 'string') {
	      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
	      if (levelMap >= 0) {
	        level = levelMap;
	      } else {
	        level = parseInt(level, 10);
	      }
	    }

	    return level;
	  },

	  // Can be overridden in the host environment
	  log: function log(level) {
	    level = logger.lookupLevel(level);

	    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
	      var method = logger.methodMap[level];
	      if (!console[method]) {
	        // eslint-disable-line no-console
	        method = 'log';
	      }

	      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        message[_key - 1] = arguments[_key];
	      }

	      console[method].apply(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports['default'] = logger;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	// Build out our basic SafeString type
	'use strict';

	exports.__esModule = true;
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = __webpack_require__(1)['default'];

	var _interopRequireDefault = __webpack_require__(2)['default'];

	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;

	var _utils = __webpack_require__(4);

	var Utils = _interopRequireWildcard(_utils);

	var _exception = __webpack_require__(5);

	var _exception2 = _interopRequireDefault(_exception);

	var _base = __webpack_require__(3);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _base.COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
	          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
	      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  templateSpec.main.decorator = templateSpec.main_d;

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	      if (options.ids) {
	        options.ids[0] = true;
	      }
	    }

	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      var ret = templateSpec[i];
	      ret.decorator = templateSpec[i + '_d'];
	      return ret;
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      if (options.depths) {
	        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
	      } else {
	        depths = [context];
	      }
	    }

	    function main(context /*, options*/) {
	      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
	    }
	    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
	    return main(context, options);
	  }
	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);

	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	      if (templateSpec.usePartial || templateSpec.useDecorators) {
	        container.decorators = container.merge(options.decorators, env.decorators);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	      container.decorators = options.decorators;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var currentDepths = depths;
	    if (depths && context !== depths[0]) {
	      currentDepths = [context].concat(depths);
	    }

	    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
	  }

	  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    if (options.name === '@partial-block') {
	      partial = options.data['partial-block'];
	    } else {
	      partial = options.partials[options.name];
	    }
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  options.partial = true;
	  if (options.ids) {
	    options.data.contextPath = options.ids[0] || options.data.contextPath;
	  }

	  var partialBlock = undefined;
	  if (options.fn && options.fn !== noop) {
	    options.data = _base.createFrame(options.data);
	    partialBlock = options.data['partial-block'] = options.fn;

	    if (partialBlock.partials) {
	      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
	    }
	  }

	  if (partial === undefined && partialBlock) {
	    partial = partialBlock;
	  }

	  if (partial === undefined) {
	    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _base.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

	function executeDecorators(fn, prog, container, depths, data, blockParams) {
	  if (fn.decorator) {
	    var props = {};
	    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
	    Utils.extend(prog, props);
	  }
	  return prog;
	}

/***/ },
/* 19 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';

	exports.__esModule = true;

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	    return Handlebars;
	  };
	};

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
/**
 * Include a partial with any params you want.
 * {{include "partial" a="hello" b="world"}}
 */
Handlebars.registerHelper('include', function (partial, options) {
    var result, content;

    // When used as a block helper, e.g. {{#include "partial"}}<p>inner content</p>{{/include}}
    if (options.fn) {
        content = options.hash.content || options.fn(options.hash);  //allows for a 'content' arg or using inner markup as 'content'
        options.hash.content = content;
    }

    if(Handlebars.templates[partial]){
        result = Handlebars.templates[partial](options.hash);
    } else {
        result = "";
    }
    return new Handlebars.SafeString(result);
});


/**
 * Strips whitespace...I think. Expedia made this and there was no documentation.
 */
Handlebars.registerHelper('compress', function (options) {
    var html = options.fn(this);
    html = html.replace(/>\s+</g, "><"); // Remove whitespace between tags
    return html;
});


/**
 * Takes in minutes, returns string like "1h 29m" or "0h 2m"
 */
Handlebars.registerHelper('duration', function () {
    var value = arguments[0];
    var options = arguments[--arguments.length],
    duration = uitk.i18n.duration(value, options.hash);
    return new Handlebars.SafeString(duration);
});


/**
 * Gets translated message. Supports args:
 * {{i18nMsg "key" "first arg" "second arg"}}
 */
Handlebars.registerHelper('i18nMsg', function () {
    var message = uitk.i18n.msg.apply(this, arguments);
    return new Handlebars.SafeString(message);
});


/**
 * Converts date to localized date format.
 */
Handlebars.registerHelper('i18nDate', function () {
    var date = arguments[0], // The date value to be localized
        options = {},
        len = arguments.length - 1,
        options = arguments[len];

    if (date) {
        return uitk.i18n.date(date, options.hash);
    }
});


/**
 * Converts time to localized time format.
 */
Handlebars.registerHelper('i18nTime', function () {
    var date = arguments[0], //the value to be localized
        options = {},
        len = arguments.length - 1,
        options = arguments[len];

    return uitk.i18n.time(date, options.hash);
});


/**
 * Converts number to localized number format.
 */
Handlebars.registerHelper('i18nNumber', function () {
    var number = arguments[0], //the value to be localized
        options = {},
        options = arguments[--arguments.length];

    return uitk.i18n.number(number, options.hash);
});

/**
 * Converts amount to localized currency format.
 */
Handlebars.registerHelper('i18nCurrency', function () {
    var amount = arguments[0],
        options = {},
        options = arguments[--arguments.length];

    return uitk.i18n.currency(amount, options.hash);
});


/**
 * Returns the native url for invoking native app actions (for use when the page is being used inside a WebView)
 */
Handlebars.registerHelper('actionMapper', function(options) {
    var url = options.hash.url || '';
    var action = options.hash.action;
    var mappedAction = '';

    // Should map to a native action
    if (action && uitk.adapt.webView) {
        mappedAction = uitk.adapt.getNativeActionUrl(action) + url.substring(url.indexOf('?')); // Appends any query string from the url
    }
    else {
        mappedAction = url;
    }

    return 'href="' + mappedAction + '"';
});


/**
 * Wraps the given form element in label markup and other classes for icons, invalid state, etc.
 */
Handlebars.registerHelper('form', function () {
    var inputType = arguments[0], // the type of input being created, e.g. radio, select, text
        options = arguments[--arguments.length],
        result;

    var SELECT = "select", PASSWORD = "password", TEXT = "text", RANGE = "range", RADIO = "radio", TEXTAREA = "textarea", CHECKBOX = "checkbox";
    var classes = getInputTypeAndOtherClasses();
    var labelText = options.hash.label ? uitk.i18n.msg(options.hash.label, options) : "";
    var msg = options.hash.msg || "";
    var position = getLabelPosition();
    var inputElement = options.fn(this, options);

    function getLabelPosition() {
        if (options.hash.inlineLabel) {
            return "inline-label ";
        } else if (inputType == RADIO || inputType == CHECKBOX) {
            return "inline-label ";
        } else {
            return "";
        }
    }

    // Should the input's label come before or after
    function isLabelBefore() {
        if (options.hash.labelAfter) {
            return false;
        } else if (inputType == RADIO || inputType == CHECKBOX) {
            return false;
        } else {
            return true;
        }
    }

    // Figure out all the classes that should be added based on input type and other options
    function getInputTypeAndOtherClasses() {
        var classes = "input-group ";

        // Selects still need this extra class
        if (inputType == SELECT) {
            classes += "select ";
        }

        // Add classes for other options
        if (options.hash.disabled) {
            classes += "disabled ";
        }
        if (options.hash.invalid) {
            classes += "invalid ";
        }
        if (options.hash.icon) {
            classes += "icon-before ";
        }
        if (options.hash.iconAfter || options.hash.clear) {
            classes += "icon-after ";
        }
        if (options.hash.classes) {
            classes += options.hash.classes + " ";
        }

        return classes;
    }

    // START to create the markup...
    // TODO use a template
    result = "<div class=\"" + classes + "\">";

    // Has a label
    if (labelText) {
        if (isLabelBefore()) {
            result += "<label class=\"" + position + "\">" + labelText + "</label>";
            result += inputElement;
        } else {
            result += inputElement;
            result += "<label class=\"" + position + "\">" + labelText + "</label>";
        }
    }
    // No label
    else {
        result += inputElement;
    }

    // Add icon...
    if (options.hash.icon) {
        result += "<i class=\"icon icon-before-pos icon-" + options.hash.icon + "\"></i>";
    }

    // Add clear...
    if (options.hash.clear) {
        result += "<i class=\"input-clear icon icon-after-pos icon-close\"></i>";
    }

    // Add iconAfter...
    if (options.hash.iconAfter) {
            result += "<i class=\"icon icon-after-pos icon-" + options.hash.iconAfter + "\"></i>";
    }

    // Add message...
    result += "<div class=\"input-message\">" + msg + "</div>";

    // FINISH and close up the markup.
    result += "</div>";

    return result;
});
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['partials/uitk/action-bar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"action-bar\"></div>";
},"useData":true});
templates['partials/uitk/agent-toolbar-tags'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script>\n// Ideally Agent Toolbar used <meta> tags and we could just do the same as Tealeaf (see tealeaf-tags.hbs).\n// But it doesn't and implementing Agent Toolbar across all apps would require each team to add the 'agent-toolbar' partial to their layout.\n// We can avoid that by dynamically adding the partial to the page.\n(function(callback) {\n    // jQuery is not yet available here, have to use vanilla js instead of 'ready' event\n    document.readyState != 'complete' ? document.addEventListener('DOMContentLoaded', callback) : callback();\n})(function() {\n    var tuid, rgtuid, arrangeeCount;\n\n    // DOM is now ready and js dependencies should be available\n    if (EG && EG.globalContext) {\n        arrangeeCount = EG.globalContext.arrangees.length;\n\n        if (arrangeeCount == 0) {\n            rgtuid = tuid = EG.user.userId;\n        }\n        else if (arrangeeCount == 1) {\n            rgtuid = tuid = EG.globalContext.arrangees.at(0).get('userId');\n        }\n        else if (arrangeeCount > 1) {\n            tuid = EG.user.userId;\n            rgtuid = EG.globalContext.arrangees.pluck('userId').join();\n        }\n\n        $('body').append(Handlebars.templates['partials/uitk/agent-toolbar']({tuid: tuid, rgtuid: rgtuid}));\n    }\n\n    // Programmatically append the comment tag to the head tag after page load\n    // due to the comment tag in the head tag will push rest of code to the body tag\n    $('head').append('<comment id=\"PageId\" title=\""
    + container.escapeExpression(((helper = (helper = helpers.pageTitle || (depth0 != null ? depth0.pageTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageTitle","hash":{},"data":data}) : helper)))
    + "\"></comment>');\n});\n</script>\n";
},"useData":true});
templates['partials/uitk/agent-toolbar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div style=\"display: none;\">\n    <form name=\"toolbar\">\n        <input type=\"hidden\" id=\"tuid\" value=\""
    + alias4(((helper = (helper = helpers.tuid || (depth0 != null ? depth0.tuid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tuid","hash":{},"data":data}) : helper)))
    + "\">\n        <input type=\"hidden\" id=\"rgtuid\" value=\""
    + alias4(((helper = (helper = helpers.rgtuid || (depth0 != null ? depth0.rgtuid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rgtuid","hash":{},"data":data}) : helper)))
    + "\">\n    </form>\n</div>";
},"useData":true});
templates['partials/uitk/alert-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"type","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    return "info";
},"7":function(container,depth0,helpers,partials,data) {
    return "gray";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-dismiss="
    + container.escapeExpression(((helper = (helper = helpers.dismiss || (depth0 != null ? depth0.dismiss : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dismiss","hash":{},"data":data}) : helper)));
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i>";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"type","hash":{},"data":data}) : helper)))
    + "alt\"></i>";
},"15":function(container,depth0,helpers,partials,data) {
    return "<h6 class=\"alert-title sub-header\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.titleLabel : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</h6>";
},"17":function(container,depth0,helpers,partials,data) {
    return "        <button class=\"btn-close alert-remove\" type=\"button\">\n            <span class=\"icon icon-close\" aria-hidden=\"true\"></span>\n        </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"alert alert-"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bgColorAlt : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + alias4(((helper = (helper = helpers.cssClasses || (depth0 != null ? depth0.cssClasses : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cssClasses","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-control=\"alert\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dismiss : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "\n    <div class=\"alert-message\">\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.titleLabel : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <p>"
    + alias4((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,(depth0 != null ? depth0.msgLabel : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</p>\n    </div>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.preventClose : depth0),{"name":"unless","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
templates['partials/uitk/autocomplete-no-results'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h5>"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper)))
    + "</h5>";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p class=\"secondary\">"
    + container.escapeExpression(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"body","hash":{},"data":data}) : helper)))
    + "</p>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"autocomplete-no-results text\">\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.body : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>";
},"useData":true});
templates['partials/uitk/autocomplete-results-by-category'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <dt class=\"category-name\">"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</dt>\n        <dd class=\"category-results\">\n            <ul class=\"results\">\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n        </dd>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <li class=\"results-item\">\n                        <a href=\"#\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.category : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + " data-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" data-result=\""
    + alias4(((helper = (helper = helpers.result || (depth0 != null ? depth0.result : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"result","hash":{},"data":data}) : helper)))
    + "\" data-autocomplete-id=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].autocompleteId : depths[1]), depth0))
    + "\">\n                            <div class=\"details\">"
    + ((stack1 = ((helper = (helper = helpers.display_value || (depth0 != null ? depth0.display_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"display_value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.opt_display_value : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                        </a>\n                    </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-type=\""
    + container.escapeExpression(((helper = (helper = helpers.category || (depth0 != null ? depth0.category : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"category","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "data-type=\"OTHER\"";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"optional-details\">"
    + ((stack1 = ((helper = (helper = helpers.opt_display_value || (depth0 != null ? depth0.opt_display_value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"opt_display_value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<dl>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.resultsByCategory : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</dl>";
},"useData":true,"useDepths":true});
templates['partials/uitk/autocomplete-results'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li class=\"results-item\">\n            <a href=\"#\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.category : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + " data-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" data-result=\""
    + alias4(((helper = (helper = helpers.result || (depth0 != null ? depth0.result : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"result","hash":{},"data":data}) : helper)))
    + "\"  data-autocomplete-id=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].autocompleteId : depths[1]), depth0))
    + "\">\n                <div class=\"details "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.child : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = helpers.display_value || (depth0 != null ? depth0.display_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"display_value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.opt_display_value : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </a>\n        </li>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[2] != null ? depths[2].highlightFirst : depths[2]),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    return "highlight";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-type=\""
    + container.escapeExpression(((helper = (helper = helpers.category || (depth0 != null ? depth0.category : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"category","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "data-type=\"OTHER\"";
},"9":function(container,depth0,helpers,partials,data) {
    return "child-suggestion";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"optional-details\">"
    + ((stack1 = ((helper = (helper = helpers.opt_display_value || (depth0 != null ? depth0.opt_display_value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"opt_display_value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<ul class=\"results\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.results : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true,"useDepths":true});
templates['partials/uitk/autocomplete'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"input-group autocomplete autocomplete-wrap cf "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tags : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <input\n            id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"\n            name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n            type=\"text\"\n            class=\"text autocomplete-input "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.invalid : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n            placeholder=\""
    + ((stack1 = (helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,(depth0 != null ? depth0.placeholder : depth0),{"name":"i18nMsg","hash":{},"data":data})) != null ? stack1 : "")
    + "\"\n            value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            data-control=\"typeahead\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tags : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.noResultsTitle : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.noResultsBody : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.taglimit : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            data-selected-item-id=\""
    + alias4(((helper = (helper = helpers.selectedItemId || (depth0 != null ? depth0.selectedItemId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selectedItemId","hash":{},"data":data}) : helper)))
    + "\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.source : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.validate : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.min : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.abtest : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.regiontype : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cdd : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.locale : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.clientId : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.features : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.sortcriteria : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.useDefaultResults : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.userId : depth0),{"name":"if","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.companyId : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.essQueryParams : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            data-highlight-first=\""
    + alias4(((helper = (helper = helpers.highlightFirst || (depth0 != null ? depth0.highlightFirst : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"highlightFirst","hash":{},"data":data}) : helper)))
    + "\"\n            data-template=\"partials/uitk/autocomplete-results"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.categorized : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n            data-js-theme=\"typeahead\"\n            data-tooltip-id=\"typeaheadDataPlain\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.autofocus : depth0),{"name":"if","hash":{},"fn":container.program(57, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            data-autoselect=\"touch\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"/>\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tags : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"input-message\">"
    + ((stack1 = ((helper = (helper = helpers.inputMsg || (depth0 != null ? depth0.inputMsg : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputMsg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n\n    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "input-icon-left";
},"4":function(container,depth0,helpers,partials,data) {
    return "            <label>"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</label>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "            <div class=\"input autocomplete-tags\">\n                <span class=\"tag-group\" data-group-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.tags : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </span>\n                <span class=\"autocomplete-tags-wrap\">\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                        "
    + container.escapeExpression((helpers.include || (depth0 && depth0.include) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"partials/uitk/tag",{"name":"include","hash":{"autocomplete":true,"label":(depth0 != null ? depth0.value : depth0),"value":(depth0 != null ? depth0.value : depth0),"type":(depth0 != null ? depth0.category : depth0),"id":(depth0 != null ? depth0.id : depth0)},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "invalid";
},"11":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-tags=\""
    + container.escapeExpression(((helper = (helper = helpers.tags || (depth0 != null ? depth0.tags : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tags","hash":{},"data":data}) : helper)))
    + "\"";
},"15":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-no-results-title=\""
    + container.escapeExpression(((helper = (helper = helpers.noResultsTitle || (depth0 != null ? depth0.noResultsTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noResultsTitle","hash":{},"data":data}) : helper)))
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-no-results-body=\""
    + container.escapeExpression(((helper = (helper = helpers.noResultsBody || (depth0 != null ? depth0.noResultsBody : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noResultsBody","hash":{},"data":data}) : helper)))
    + "\"";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-taglimit=\""
    + container.escapeExpression(((helper = (helper = helpers.taglimit || (depth0 != null ? depth0.taglimit : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"taglimit","hash":{},"data":data}) : helper)))
    + "\"";
},"21":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-autocomplete-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-url=\""
    + container.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"url","hash":{},"data":data}) : helper)))
    + "\"";
},"25":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-source=\""
    + container.escapeExpression(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"source","hash":{},"data":data}) : helper)))
    + "\"";
},"27":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-validate=\""
    + container.escapeExpression(((helper = (helper = helpers.validate || (depth0 != null ? depth0.validate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"validate","hash":{},"data":data}) : helper)))
    + "\"";
},"29":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-minchar=\""
    + container.escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"min","hash":{},"data":data}) : helper)))
    + "\"";
},"31":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-maxitems=\""
    + container.escapeExpression(((helper = (helper = helpers.items || (depth0 != null ? depth0.items : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"items","hash":{},"data":data}) : helper)))
    + "\"";
},"33":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-abtest=\""
    + container.escapeExpression(((helper = (helper = helpers.abtest || (depth0 != null ? depth0.abtest : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"abtest","hash":{},"data":data}) : helper)))
    + "\"";
},"35":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-regiontype=\""
    + container.escapeExpression(((helper = (helper = helpers.regiontype || (depth0 != null ? depth0.regiontype : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"regiontype","hash":{},"data":data}) : helper)))
    + "\"";
},"37":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-cdd=\""
    + container.escapeExpression(((helper = (helper = helpers.cdd || (depth0 != null ? depth0.cdd : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cdd","hash":{},"data":data}) : helper)))
    + "\"";
},"39":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-locale=\""
    + container.escapeExpression(((helper = (helper = helpers.locale || (depth0 != null ? depth0.locale : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"locale","hash":{},"data":data}) : helper)))
    + "\"";
},"41":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-client-id=\""
    + container.escapeExpression(((helper = (helper = helpers.clientId || (depth0 != null ? depth0.clientId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clientId","hash":{},"data":data}) : helper)))
    + "\"";
},"43":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-features=\""
    + container.escapeExpression(((helper = (helper = helpers.features || (depth0 != null ? depth0.features : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"features","hash":{},"data":data}) : helper)))
    + "\"";
},"45":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-sortcriteria=\""
    + container.escapeExpression(((helper = (helper = helpers.sortcriteria || (depth0 != null ? depth0.sortcriteria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sortcriteria","hash":{},"data":data}) : helper)))
    + "\"";
},"47":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-use-default-results=\""
    + container.escapeExpression(((helper = (helper = helpers.useDefaultResults || (depth0 != null ? depth0.useDefaultResults : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"useDefaultResults","hash":{},"data":data}) : helper)))
    + "\"";
},"49":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-user-id=\""
    + container.escapeExpression(((helper = (helper = helpers.userId || (depth0 != null ? depth0.userId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"userId","hash":{},"data":data}) : helper)))
    + "\"";
},"51":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-company-id=\""
    + container.escapeExpression(((helper = (helper = helpers.companyId || (depth0 != null ? depth0.companyId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"companyId","hash":{},"data":data}) : helper)))
    + "\"";
},"53":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-ess-query-params=\""
    + container.escapeExpression(((helper = (helper = helpers.essQueryParams || (depth0 != null ? depth0.essQueryParams : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"essQueryParams","hash":{},"data":data}) : helper)))
    + "\"";
},"55":function(container,depth0,helpers,partials,data) {
    return "-by-category";
},"57":function(container,depth0,helpers,partials,data) {
    return "data-autofocus";
},"59":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i>";
},"61":function(container,depth0,helpers,partials,data) {
    return "                </span>\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
templates['partials/uitk/badge'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "badge-"
    + container.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"type","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    return "default";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),(depth0 != null ? depth0.value : depth0),{"name":"i18nMsg","hash":{},"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return container.escapeExpression((helpers.i18nNumber || (depth0 && depth0.i18nNumber) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"i18nNumber","hash":{},"data":data}))
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"badge "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</span>\n";
},"useData":true});
templates['partials/uitk/box-bumper'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"box-bumper\">\n    <button class=\"btn btn-text-sub-action btn-med\" data-control=\"toggle\" data-expand-text=\"<span class='btn-label'>Show More</span>\" data-collapse-text=\"<span class='btn-label'>Show Less</span>\" data-content-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        <span class=\"btn-label\">Show More</span>\n    </button>\n</div>\n";
},"useData":true});
templates['partials/uitk/box-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " id=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <header class=\"box-title\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.typeIsSimple : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subTitle : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </header>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <h3 class=\"title-main\">"
    + ((stack1 = container.lambda((depth0 != null ? depth0.title : depth0), depth0)) != null ? stack1 : "")
    + "</h3>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <h4 class=\"title-main\">"
    + ((stack1 = container.lambda((depth0 != null ? depth0.title : depth0), depth0)) != null ? stack1 : "")
    + "</h4>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <p class=\"title-sub\">"
    + ((stack1 = container.lambda((depth0 != null ? depth0.subTitle : depth0), depth0)) != null ? stack1 : "")
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\""
    + alias2(alias1((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? depth0.classes : depth0), depth0))
    + "\""
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    "
    + ((stack1 = alias1((depth0 != null ? depth0.content : depth0), depth0)) != null ? stack1 : "")
    + "\n</div>";
},"useData":true});
templates['partials/uitk/button-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    <a\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <button\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return " tabIndex="
    + container.escapeExpression(((helper = (helper = helpers.tabIndex || (depth0 != null ? depth0.tabIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tabIndex","hash":{},"data":data}) : helper)));
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return " href=\""
    + container.escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return " type=\""
    + container.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"type","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return " title=\""
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper)))
    + "\"";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-control=\"remove\" data-target-id=\""
    + container.escapeExpression(((helper = (helper = helpers.targetId || (depth0 != null ? depth0.targetId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"targetId","hash":{},"data":data}) : helper)))
    + "\"";
},"15":function(container,depth0,helpers,partials,data) {
    return " disabled";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"21":function(container,depth0,helpers,partials,data) {
    return "    </a>\n";
},"23":function(container,depth0,helpers,partials,data) {
    return "    </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isLink : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tabIndex : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.isLink : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.btnTypeClose : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\nclass=\""
    + alias4(((helper = (helper = helpers.cssClass || (depth0 != null ? depth0.cssClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cssClass","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isDisabledLink : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isDisabledButton : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dataAttributes : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n        <span class=\"btn-label\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isLink : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.program(23, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['partials/uitk/calendar-day'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "class=\"date-offset-"
    + container.escapeExpression(((helper = (helper = helpers.firstDayOffset || (depth0 != null ? depth0.firstDayOffset : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"firstDayOffset","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.firstDayOffset : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "><a href=\"#\" data-year=\""
    + alias4(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper)))
    + "\" data-month=\""
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "\" data-day=\""
    + alias4(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"day","hash":{},"data":data}) : helper)))
    + "\"><div class=cal-day data-year=\""
    + alias4(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper)))
    + "\" data-month=\""
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "\" data-day=\""
    + alias4(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"day","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"day","hash":{},"data":data}) : helper)))
    + "</div></a></li>";
},"useData":true});
templates['partials/uitk/calendar'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.startDateId : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.endDateId : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div class=\"date-range cf "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\">\n                <div class=\"input-group "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " input-icon-left\">\n                    <input id=\""
    + alias4(((helper = (helper = helpers.startDateId || (depth0 != null ? depth0.startDateId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateId","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"cal-text-input\" size=\"12\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_start\" placeholder=\""
    + alias4((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_calendar_placeholder_date",{"name":"i18nMsg","hash":{},"data":data}))
    + "\"\n                        value=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.startDateValue : depth0),{"name":"i18nDate","hash":{"style":"short"},"data":data}))
    + "\"\n                        data-iso-date=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.startDateValue : depth0),{"name":"i18nDate","hash":{"style":"iso"},"data":data}))
    + "\"\n                        data-control=\"calendar\"\n                        data-first-valid-date=\""
    + alias4(((helper = (helper = helpers.firstValidDate || (depth0 != null ? depth0.firstValidDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstValidDate","hash":{},"data":data}) : helper)))
    + "\"\n                        data-last-valid-date=\""
    + alias4(((helper = (helper = helpers.lastValidDate || (depth0 != null ? depth0.lastValidDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastValidDate","hash":{},"data":data}) : helper)))
    + "\"\n                        data-date-range=\"true\"\n                        data-end-date=\"#"
    + alias4(((helper = (helper = helpers.endDateId || (depth0 != null ? depth0.endDateId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endDateId","hash":{},"data":data}) : helper)))
    + "\"\n                        data-default-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bookingLength : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-max-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.maxBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-min-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.minBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-annual=\""
    + alias4(((helper = (helper = helpers.annual || (depth0 != null ? depth0.annual : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"annual","hash":{},"data":data}) : helper)))
    + "\"\n                        data-time-picker-id=\""
    + alias4(((helper = (helper = helpers.timePickerId || (depth0 != null ? depth0.timePickerId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timePickerId","hash":{},"data":data}) : helper)))
    + "\"\n                        data-tooltip-id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tooltipId : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.smallScreen : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                    <i class=\"icon icon-calendar\"></i>\n                </div>\n                <div class=\"input-group "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " input-icon-left\">\n                    <input id=\""
    + alias4(((helper = (helper = helpers.endDateId || (depth0 != null ? depth0.endDateId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endDateId","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"cal-text-input\" size=\"12\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_end\" placeholder=\""
    + alias4((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_calendar_placeholder_date",{"name":"i18nMsg","hash":{},"data":data}))
    + "\"\n                        value=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.endDateValue : depth0),{"name":"i18nDate","hash":{"style":"short"},"data":data}))
    + "\"\n                        data-iso-date=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.endDateValue : depth0),{"name":"i18nDate","hash":{"style":"iso"},"data":data}))
    + "\"\n                        data-control=\"calendar\"\n                        data-first-valid-date=\""
    + alias4(((helper = (helper = helpers.firstValidDate || (depth0 != null ? depth0.firstValidDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstValidDate","hash":{},"data":data}) : helper)))
    + "\"\n                        data-last-valid-date=\""
    + alias4(((helper = (helper = helpers.lastValidDate || (depth0 != null ? depth0.lastValidDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastValidDate","hash":{},"data":data}) : helper)))
    + "\"\n                        data-date-range=\"true\"\n                        data-start-date=\"#"
    + alias4(((helper = (helper = helpers.startDateId || (depth0 != null ? depth0.startDateId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDateId","hash":{},"data":data}) : helper)))
    + "\"\n                        data-default-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bookingLength : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-max-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.maxBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-min-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.minBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        data-annual=\""
    + alias4(((helper = (helper = helpers.annual || (depth0 != null ? depth0.annual : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"annual","hash":{},"data":data}) : helper)))
    + "\"\n                        data-time-picker-id=\""
    + alias4(((helper = (helper = helpers.timePickerId || (depth0 != null ? depth0.timePickerId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timePickerId","hash":{},"data":data}) : helper)))
    + "\"\n                        data-tooltip-id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tooltipId : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.smallSreen : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                    <i class=\"icon icon-calendar\"></i>\n                </div>\n                <div class=\"input-message\">"
    + ((stack1 = ((helper = (helper = helpers.inputMsg || (depth0 != null ? depth0.inputMsg : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputMsg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.bookingLength || (depth0 != null ? depth0.bookingLength : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bookingLength","hash":{},"data":data}) : helper)));
},"6":function(container,depth0,helpers,partials,data) {
    return "2";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.maxBookingLength || (depth0 != null ? depth0.maxBookingLength : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"maxBookingLength","hash":{},"data":data}) : helper)));
},"10":function(container,depth0,helpers,partials,data) {
    return "60";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.minBookingLength || (depth0 != null ? depth0.minBookingLength : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"minBookingLength","hash":{},"data":data}) : helper)));
},"14":function(container,depth0,helpers,partials,data) {
    return "1";
},"16":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.tooltipId || (depth0 != null ? depth0.tooltipId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tooltipId","hash":{},"data":data}) : helper)));
},"18":function(container,depth0,helpers,partials,data) {
    return "calendartooltip";
},"20":function(container,depth0,helpers,partials,data) {
    return " readonly";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.inline : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.program(26, data, 0),"data":data})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <div  class=\"cal-inline\">\n            <div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-control=\"calendar\" data-inline=\"true\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "></div>\n        </div>\n";
},"24":function(container,depth0,helpers,partials,data) {
    return "data-value=\""
    + container.escapeExpression((helpers.i18nDate || (depth0 && depth0.i18nDate) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),{"name":"i18nDate","hash":{"style":"short"},"data":data}))
    + "\"";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div class=\"input-group "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " input-icon-left\">\n            <input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"cal-text-input "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.invalid : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" placeholder=\""
    + alias4((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_calendar_placeholder_date",{"name":"i18nMsg","hash":{},"data":data}))
    + "\"\n                value=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"i18nDate","hash":{"style":"short"},"data":data}))
    + "\"\n                data-iso-date=\""
    + alias4((helpers.i18nDate || (depth0 && depth0.i18nDate) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"i18nDate","hash":{"style":"iso"},"data":data}))
    + "\"\n                data-control=\"calendar\"\n                data-first-valid-date=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.firstValidDate : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n                data-last-valid-date=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.lastValidDate : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.endDateId : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.startDateId : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                data-default-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bookingLength : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                data-max-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.maxBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                data-min-booking-length=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.minBookingLength : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                data-tooltip-id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tooltipId : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                data-annual=\""
    + alias4(((helper = (helper = helpers.annual || (depth0 != null ? depth0.annual : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"annual","hash":{},"data":data}) : helper)))
    + "\"\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n            <i class=\"icon icon-calendar\"></i>\n            <div class=\"input-message\">"
    + ((stack1 = ((helper = (helper = helpers.inputMsg || (depth0 != null ? depth0.inputMsg : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputMsg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n        </div>\n";
},"27":function(container,depth0,helpers,partials,data) {
    return "invalid";
},"29":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.firstValidDate || (depth0 != null ? depth0.firstValidDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"firstValidDate","hash":{},"data":data}) : helper)));
},"31":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.lastValidDate || (depth0 != null ? depth0.lastValidDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lastValidDate","hash":{},"data":data}) : helper)));
},"33":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-end-date=\"#"
    + container.escapeExpression(((helper = (helper = helpers.endDateId || (depth0 != null ? depth0.endDateId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"endDateId","hash":{},"data":data}) : helper)))
    + "\"";
},"35":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-start-date=\"#"
    + container.escapeExpression(((helper = (helper = helpers.startDateId || (depth0 != null ? depth0.startDateId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"startDateId","hash":{},"data":data}) : helper)))
    + "\"";
},"37":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.dateRange : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(22, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['partials/uitk/checkout-bar'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.amount || (depth0 != null ? depth0.amount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"amount","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    return "0";
},"5":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nCurrency || (depth0 && depth0.i18nCurrency) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.amount : depth0),{"name":"i18nCurrency","hash":{"code":(depth0 != null ? depth0.code : depth0)},"data":data}));
},"7":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nCurrency || (depth0 && depth0.i18nCurrency) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),0,{"name":"i18nCurrency","hash":{"code":(depth0 != null ? depth0.code : depth0)},"data":data}));
},"9":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"11":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.confirmLabel : depth0),{"name":"i18nMsg","hash":{},"data":data}));
},"13":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_book",{"name":"i18nMsg","hash":{},"data":data}));
},"15":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.saveLabel : depth0),{"name":"i18nMsg","hash":{},"data":data}));
},"17":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_save",{"name":"i18nMsg","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"checkout-bar\" data-control=\"checkout-bar\">\n    <div class=\"site-content\">\n        <div class=\"row\">\n            <div class=\"col col-4\">\n                <h5 class=\"checkout-bar-title sub-header\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(alias1,"uitk_total",{"name":"i18nMsg","hash":{},"data":data}))
    + "</h5>\n                <h1 id=\"checkout-bar-total\" data-amount=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.amount : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.amount : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</h1>\n            </div>\n            <div class=\"col col-8\">\n                <button id=\"checkout-bar-confirm\" class=\"btn btn-action btn-round btn-med success "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                    <span class=\"btn-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.confirmLabel : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "</span><i class=\"icon icon-arrow90\"></i>\n                </button>\n                <button id=\"checkout-bar-save\" class=\"btn btn-text-action btn-med\">\n                    <span class=\"btn-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.saveLabel : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "</span>\n                </button>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['partials/uitk/content-slider-controls'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "            <li><button type=\"button\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isCurrent : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "><span class=\"visuallyhidden\">page number "
    + container.escapeExpression(((helper = (helper = helpers.pageNum || (depth0 != null ? depth0.pageNum : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"pageNum","hash":{},"data":data}) : helper)))
    + "</span></button></li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "class=\"current\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"content-slider-controls\">\n    <ul class=\"content-slider-nav\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</section>";
},"useData":true});
templates['partials/uitk/content-slider'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"content-slider "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-control=\"content-slider\">\n    <button class=\"btn btn-utility btn-med btn-round btn-no-margin prev\">\n        <span class=\"btn-label\"><i class=\"icon icon-toggle270\"></i></span>\n    </button>\n    <button class=\"btn btn-utility btn-med btn-round btn-no-margin next\">\n        <span class=\"btn-label\"><i class=\"icon icon-toggle90\"></i></span>\n    </button>\n    <section class=\"content-slider-mask\">\n        <div class=\"row\">"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n    </section>\n</div>";
},"usePartial":true,"useData":true});
templates['partials/uitk/core-css'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.includeLess || (depth0 && depth0.includeLess) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"includeLess","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"stylesheet":"uitk-core"},"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});
templates['partials/uitk/core-js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<script>\n    // Set up EG with EG from server\n    window.EG = "
    + alias3((helpers.json || (depth0 && depth0.json) || alias2).call(alias1,(depth0 != null ? depth0.EG : depth0),{"name":"json","hash":{},"data":data}))
    + " || {};\n\n    // Set up uitk with uitk from server (the rest of uitk is merged by uitk.js)\n    window.uitk = "
    + alias3((helpers.json || (depth0 && depth0.json) || alias2).call(alias1,(depth0 != null ? depth0.uitk : depth0),{"name":"json","hash":{},"data":data}))
    + " || {};\n\n    // Need to set this before any lib tries to do i18n. I18n.js has been modified as a result.\n    var I18n = I18n || {};\n    I18n.locale = EG.currentLocale;\n</script>\n\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-required-libs"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-backbone"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-handlebars"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-core"},"data":data})) != null ? stack1 : "")
    + "\n\n"
    + alias3((helpers.i18nJs || (depth0 && depth0.i18nJs) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.currentLocale : stack1),{"name":"i18nJs","hash":{},"data":data}))
    + "\n\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-libs"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-vendors"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-core-app"},"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || alias2).call(alias1,{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"bundleName":"uitk-analytics"},"data":data})) != null ? stack1 : "")
    + "\n\n";
},"useData":true});
templates['partials/uitk/favicon'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<!-- Favicon -->\n<link rel=\"icon\" type=\"image/png\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/favicon-16x16.png\" sizes=\"16x16\">\n<link rel=\"icon\" type=\"image/png\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/favicon-32x32.png\" sizes=\"32x32\">\n<link rel=\"icon\" type=\"image/png\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/favicon-96x96.png\" sizes=\"96x96\">\n\n<!-- Apple (and others) web app icons for saving to Home screen and/or Favorites screen and other random places -->\n<meta name=\"apple-mobile-web-app-title\" content=\"Egencia\">\n<link rel=\"apple-touch-icon-precomposed\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/favicon.png\">\n<link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-57x57.png\">\n<link rel=\"apple-touch-icon\" sizes=\"60x60\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-60x60.png\">\n<link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-72x72.png\">\n<link rel=\"apple-touch-icon\" sizes=\"76x76\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-76x76.png\">\n<link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-114x114.png\">\n<link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-120x120.png\">\n<link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-144x144.png\">\n<link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-152x152.png\">\n\n<!-- Microsoft -->\n<meta name=\"application-name\" content=\"Egencia\">\n<meta name=\"msapplication-TileColor\" content=\" #152835\">\n<meta name=\"msapplication-TileImage\" content=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-144x144.png\">\n<meta name=\"msapplication-square70x70logo\" content=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-72x72.png\">\n<meta name=\"msapplication-square150x150logo\" content=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-152x152.png\">\n<meta name=\"msapplication-wide310x150logo\" content=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-152x152.png\">\n<meta name=\"msapplication-square310x310logo\" content=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.uitkHostedAssetPath : stack1), depth0))
    + "/images/bookmark-icon-152x152.png\">";
},"useData":true});
templates['partials/uitk/figure-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <figure\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            class=\""
    + alias4(((helper = (helper = helpers.cssClass || (depth0 != null ? depth0.cssClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cssClass","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\"\n            "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.isYouTube : depth0),{"name":"unless","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mediaId : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mediaOptions : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.lazy : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.late : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.downgrade : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.path : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.src : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.srcSet : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isImage : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.aspectRatio : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.svgFallback : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.videoParameters : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            data-class=\"tile-media\"\n        "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isImage : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.caption : depth0),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.useMediaLoader : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </figure>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-media-type=\""
    + container.escapeExpression(((helper = (helper = helpers.mediaType || (depth0 != null ? depth0.mediaType : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"mediaType","hash":{},"data":data}) : helper)))
    + "\"";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "data-control=\"media\" data-media-id=\""
    + alias4(((helper = (helper = helpers.mediaId || (depth0 != null ? depth0.mediaId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaId","hash":{},"data":data}) : helper)))
    + "\" data-media-type=\""
    + alias4(((helper = (helper = helpers.mediaType || (depth0 != null ? depth0.mediaType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaType","hash":{},"data":data}) : helper)))
    + "\"";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-media-options=\""
    + container.escapeExpression(((helper = (helper = helpers.mediaOptions || (depth0 != null ? depth0.mediaOptions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"mediaOptions","hash":{},"data":data}) : helper)))
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-lazy=\""
    + container.escapeExpression(((helper = (helper = helpers.lazy || (depth0 != null ? depth0.lazy : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lazy","hash":{},"data":data}) : helper)))
    + "\"";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-late=\""
    + container.escapeExpression(((helper = (helper = helpers.late || (depth0 != null ? depth0.late : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"late","hash":{},"data":data}) : helper)))
    + "\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-downgrade=\""
    + container.escapeExpression(((helper = (helper = helpers.downgrade || (depth0 != null ? depth0.downgrade : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"downgrade","hash":{},"data":data}) : helper)))
    + "\"";
},"16":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-path=\""
    + container.escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"path","hash":{},"data":data}) : helper)))
    + "\"";
},"18":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-src=\""
    + container.escapeExpression(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"src","hash":{},"data":data}) : helper)))
    + "\"";
},"20":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-srcset=\""
    + container.escapeExpression(((helper = (helper = helpers.srcSet || (depth0 != null ? depth0.srcSet : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"srcSet","hash":{},"data":data}) : helper)))
    + "\"";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.alt : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-alt=\""
    + container.escapeExpression(((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alt","hash":{},"data":data}) : helper)))
    + "\"";
},"25":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-aspect-ratio=\""
    + container.escapeExpression(((helper = (helper = helpers.aspectRatio || (depth0 != null ? depth0.aspectRatio : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"aspectRatio","hash":{},"data":data}) : helper)))
    + "\"";
},"27":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-svgfallback=\""
    + container.escapeExpression(((helper = (helper = helpers.svgFallback || (depth0 != null ? depth0.svgFallback : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"svgFallback","hash":{},"data":data}) : helper)))
    + "\"";
},"29":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-video-parameters=\""
    + container.escapeExpression(((helper = (helper = helpers.videoParameters || (depth0 != null ? depth0.videoParameters : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"videoParameters","hash":{},"data":data}) : helper)))
    + "\"";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.src : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.lazyIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.program(36, data, 0),"data":data})) != null ? stack1 : "");
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                    <noscript>\n                        <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"src","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alt : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" class=\"tile-media\" />\n                    </noscript>\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alt","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                    <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.src || (depth0 != null ? depth0.src : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"src","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alt : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" class=\"tile-media\"/>\n";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "            <figcaption class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.captionClass : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.program(41, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"caption","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</figcaption>\n";
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.captionClass || (depth0 != null ? depth0.captionClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"captionClass","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"41":function(container,depth0,helpers,partials,data) {
    return "image-caption";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["with"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.mediaLoader : depth0),{"name":"with","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <span class=\"media-loader\">"
    + ((stack1 = container.invokePartial(partials["partials/uitk/loader-tag"],depth0,{"name":"partials/uitk/loader-tag","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"usePartial":true,"useData":true});
templates['partials/uitk/filter-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    return " checked";
},"5":function(container,depth0,helpers,partials,data) {
    return " last";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>\n  <label"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"check"
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\">\n    <input type=\"checkbox\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selectedIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n    <span class=\"inline-label tab"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n  </label>\n</li>";
},"useData":true});
templates['partials/uitk/filters'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "filtered";
},"3":function(container,depth0,helpers,partials,data) {
    return "data-mode=\"submit\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "data-filtered=\"true\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "                    <span>"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_filter_menu_txt",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "                <li id=\""
    + alias3(((helper = (helper = helpers.categoryId || (depth0 != null ? depth0.categoryId : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"categoryId","hash":{},"data":data}) : helper)))
    + "\" class=\"filter-category "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.filtered : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                    <h5 class=\"filter-label sub-header\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</h5>\n                </li>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "            <div data-content-category-id=\""
    + container.escapeExpression(((helper = (helper = helpers.categoryId || (depth0 != null ? depth0.categoryId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"categoryId","hash":{},"data":data}) : helper)))
    + "\" class=\"filter-content box-padded\">\n                "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n            </div>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_filter_reset_all",{"name":"i18nMsg","hash":{},"data":data}));
},"15":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_filter_reset",{"name":"i18nMsg","hash":{},"data":data}));
},"17":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"filter-apply right btn btn-text-action btn-med btn-no-margin\">\n                    <span class=\"btn-label\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_filter_apply",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n                </button>\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"filter-close right btn btn-text-action btn-med btn-no-margin\">\n                    <span class=\"btn-label\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uitk_filter_done",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n                </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"filters box "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.filtered : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-control=\"filters\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.submit : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.filtered : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n    <div class=\"filter-menu-wrapper box-header\">\n        <ul class=\"filter-menu\">\n            <li class=\"filter-menu-icon\">\n                <i class=\"icon icon-filteralt\"></i>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.wantFiltersText : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </li>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.filters : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n    <div class=\"filter-body\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.filters : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"filter-body-menu cf box-footer\">\n            <button class=\"filter-reset left btn btn-text-sub-action btn-med btn-no-margin\">\n                <span class=\"btn-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.submit : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "</span>\n            </button>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.submit : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</div>";
},"useData":true});
templates['partials/uitk/footer'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div id=\"footer\" class=\"cf\">\n        <div class=\"site-navigation row\">\n            <div class=\"col col-12 align-center\">\n                <ul class=\"cf\">\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.aboutEgenciaId : stack1),{"name":"with","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.privacyPolicyId : stack1),{"name":"with","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.promiseId : stack1),{"name":"with","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.termsOfUseId : stack1),{"name":"with","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.mobileId : stack1),{"name":"with","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col col-12 align-center\">\n                <div id=\"footer-copyright\">\n                    <h6>"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.footer : depth0)) != null ? stack1.copyrightId : stack1)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</h6>\n                    <div><i class=\"icon icon-egencia-birdalt\"></i></div>\n                </div>\n            </div>\n        </div>\n    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <li>\n                            <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                        </li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <li>\n                            <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"><span class=\"hide-small-screen\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span><span class=\"hide-large-screen hide-medium-screen\">"
    + alias4(((helper = (helper = helpers.labelalt || (depth0 != null ? depth0.labelalt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelalt","hash":{},"data":data}) : helper)))
    + "</span></a>\n                        </li>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <li class=\"hide-small-screen\">\n                            <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                        </li>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <li>\n                            <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"><span class=\"hide-small-screen\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span><span class=\"hide-large-screen hide-medium-screen\">"
    + alias4(((helper = (helper = helpers.labelalt || (depth0 != null ? depth0.labelalt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"labelalt","hash":{},"data":data}) : helper)))
    + "</a>\n                        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? depths[1].webView : depths[1]),{"name":"unless","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['partials/uitk/head-tags'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n<meta charset=\"UTF-8\"/>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n<!--[if lte IE 9]>\n        "
    + ((stack1 = (helpers.includeJsBundle || (depth0 && depth0.includeJsBundle) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"includeJsBundle","hash":{"hostedAssetPath":(depth0 != null ? depth0.uitkHostedAssetPath : depth0),"outputType":"script","bundleName":"uitk-ie-hacks"},"data":data})) != null ? stack1 : "")
    + "\n<![endif]-->\n"
    + ((stack1 = container.invokePartial(partials["partials/uitk/favicon"],depth0,{"name":"partials/uitk/favicon","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["partials/uitk/tealeaf-tags"],depth0,{"name":"partials/uitk/tealeaf-tags","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["partials/uitk/agent-toolbar-tags"],depth0,{"name":"partials/uitk/agent-toolbar-tags","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['partials/uitk/header-account-nav-large'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <ul id=\"user-menu-profiles\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.profiles : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <li class=\"user-menu-profile user-layout\"><span>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span><a id=\""
    + alias4(((helper = (helper = helpers.productId || (depth0 != null ? depth0.productId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productId","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-text-sub-action btn-small btn-no-margin right\">\n                    <span class=\"btn-label\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span>\n                </a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<a id=\"account-nav-desktop-toggle\" href=\"#\" class=\"account-nav-toggle last nav-item\" data-control=\"tooltip\" data-content-id=\"account-nav-desktop\" data-pos=\"bc\" data-prevent-flip=\"true\">\n    <div class=\"left\">\n        <div>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.firstname || (depth0 != null ? depth0.firstname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstname","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.lastname || (depth0 != null ? depth0.lastname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastname","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"secondary\">"
    + alias4(((helper = (helper = helpers.companyName || (depth0 != null ? depth0.companyName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyName","hash":{},"data":data}) : helper)))
    + "</div>\n    </div>\n    <i class=\"icon icon-caret180\"></i>\n</a>\n\n<div id=\"account-nav-desktop\" class=\"visuallyhidden\">\n    <div class=\"account-nav\">\n        <div class=\"user-control-bar cf\">\n            <div id=\"user-menu-username\" class=\"left secondary\">\n                <div id=\"user-name\">\n                    <b>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.firstname || (depth0 != null ? depth0.firstname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstname","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.lastname || (depth0 != null ? depth0.lastname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastname","hash":{},"data":data}) : helper)))
    + "</b>\n                    <span>("
    + alias4(((helper = (helper = helpers.pos || (depth0 != null ? depth0.pos : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pos","hash":{},"data":data}) : helper)))
    + ")</span>\n                </div>\n                <div id=\"company-name\">"
    + alias4(((helper = (helper = helpers.companyName || (depth0 != null ? depth0.companyName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyName","hash":{},"data":data}) : helper)))
    + "</div>\n            </div>\n            <div class=\"secondary right\">\n                <a id=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" href=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" class=\"btn btn-text-sub-action btn-small btn-no-margin\">\n                    <span class=\"btn-label\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span>\n                </a>\n            </div>\n        </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.profiles : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"cf\">\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.logout : depth0),{"name":"with","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</div>";
},"useData":true});
templates['partials/uitk/header-account-nav-small'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <ul id=\"user-menu-profiles\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.profiles : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <li class=\"user-menu-profile user-layout\"><span>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span><a id=\""
    + alias4(((helper = (helper = helpers.productId || (depth0 != null ? depth0.productId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productId","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <a id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-no-margin\">\n                <span class=\"btn-label\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span>\n            </a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<a id=\"account-nav-mobile-toggle\" href=\"#\" class=\"account-nav-toggle\">\n    <i class=\"icon icon-traveleralt\"></i>\n</a>\n\n<div id=\"account-nav-mobile\" class=\"account-nav\">\n    <div class=\"user-control-bar cf\">\n        <div class=\"user-menu-username left secondary\">\n            <h2 class=\"user-name\">\n                "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.firstname || (depth0 != null ? depth0.firstname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstname","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.lastname || (depth0 != null ? depth0.lastname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastname","hash":{},"data":data}) : helper)))
    + "\n                <span>("
    + alias4(((helper = (helper = helpers.pos || (depth0 != null ? depth0.pos : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pos","hash":{},"data":data}) : helper)))
    + ")</span>\n            </h2>\n            <div class=\"company-name\">"
    + alias4(((helper = (helper = helpers.companyName || (depth0 != null ? depth0.companyName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"companyName","hash":{},"data":data}) : helper)))
    + "</div>\n        </div>\n        <div class=\"secondary right\">\n            <a id=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" href=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.url : stack1), depth0))
    + "\">"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.profile : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n        </div>\n    </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.profiles : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"cf\">\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.logout : depth0),{"name":"with","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>";
},"useData":true});
templates['partials/uitk/header-primary-nav-large'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li class=\"menu-item menu-item-has-children\">\n                <a id=\"primary-nav-book\" href=\"#\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                <ul id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"submenu list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                        <li class=\"menu-item\"><a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" class=\"medium\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li class=\"menu-item\">\n                <a id=\"primary-nav-trips\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n            </li>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "            <li>\n                <a id=\"primary-nav-expense\" href=\"/expense\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"Expense",{"name":"i18nMsg","hash":{},"data":data}))
    + " <span class=\"badge badge-info h6 sub-header\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"New",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span></a>\n            </li>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li class=\"menu-item menu-item-has-children\">\n                <a id=\"primary-nav-tools\" href=\"#\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                <div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"submenu multi-list\">\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"with","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </div>\n            </li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                        <div class=\"submenu-group\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.generalMenuId : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.expenseMenuId : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.travMgmtMenuId : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n                        <div class=\"submenu-group\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.travPolicyMenuId : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.userMgmtMenuId : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n                        <div class=\"submenu-group\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.compMgmtMenuId : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.reportingMenuId : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.generalMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.generalMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                        <li class=\"menu-item\"><a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.opensNewWindow : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "target=“_blank”";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.expenseMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.expenseMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.travMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.travMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.travPolicyMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.travPolicyMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.userMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.userMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.compMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.compMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                <h4 class=\"category-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.reportingMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</h4>\n                                <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.reportingMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["with"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"with","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <li class=\"menu-item menu-item-has-children\">\n                    <a id=\"primary-nav-admin\" class=\"agent-only\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                    <ul id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"submenu list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n                </li>\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                            <li class=\"menu-item\">\n                                <a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" class=\"medium\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.opensNewWindow : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a>\n                            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<nav id=\"primary-nav-desktop\" class=\"primary-nav\">\n    <ul>\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.bookMenuId : stack1),{"name":"with","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.tripMenuId : stack1),{"name":"with","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.expense : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.toolMenuId : stack1),{"name":"with","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</nav>";
},"useData":true});
templates['partials/uitk/header-primary-nav-small'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <!-- Book -->\n            <h4 class=\"category-title\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</h4>\n            <ul id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"submenu submenu-primary list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n            <!-- Manage -->\n            <h4 class=\"category-title\">Manage</h4>\n            <ul class=\"submenu submenu-primary list\">\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.tripMenuId : stack1),{"name":"with","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.expense : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.toolMenuId : stack1),{"name":"with","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                    <li><a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" class=\"medium\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <li>\n                        <a id=\"primary-nav-trips\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                    </li>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "                    <li>\n                        <a id=\"primary-nav-expense\" href=\"/expense\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"Expense",{"name":"i18nMsg","hash":{},"data":data}))
    + " <span class=\"badge badge-info h6 sub-header\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"New",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span></a>\n                    </li>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <li>\n                        <a id=\"primary-nav-tools\" data-menu-id=\"tool-menu\" class=\"has-submenu icon icon-toggle90\">"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                    </li>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["with"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"with","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                        <li>\n                            <a id=\"primary-nav-admin\" data-menu-id=\"admin-menu\" class=\"has-submenu icon icon-toggle90 agent-only\">"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n                        </li>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-menu-wrapper\">\n                <h4 class=\"category-title\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</h4>\n                <ul class=\"submenu submenu-secondary multi-list\">\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"with","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.generalMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.expenseMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.travMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.travPolicyMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.userMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.compMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.reportingMenuId : depth0)) != null ? stack1.items : stack1),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-general\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.generalMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-general\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.generalMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                        <li><a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.opensNewWindow : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "target=“_blank”";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-expense\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.expenseMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-expense\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.expenseMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-travel-mgmt\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.travMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-travel-mgmt\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.travMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-travel-policy\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.travPolicyMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-travel-policy\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.travPolicyMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-user-mgmt\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.userMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-user-mgmt\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.userMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-comp-mgmt\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.compMgmtMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-comp-mgmt\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.compMgmtMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n                                <a href=\"#menu-reporting\" data-control=\"toggle\" class=\"toggle icon icon-caret180\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.reportingMenuId : depth0)) != null ? stack1.label : stack1), depth0))
    + "</a>\n                                <ul id=\"menu-reporting\" class=\"toggle-pane\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.reportingMenuId : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                </ul>\n                            </li>\n";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["with"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"with","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-menu-wrapper\">\n                    <h4 id=\"primary-nav-admin\" class=\"category-title agent-only\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</h4>\n                    <ul class=\"submenu submenu-secondary list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n                </div>\n";
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                            <li>\n                                <a id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" href=\""
    + alias2(alias1((depth0 != null ? depth0.url : depth0), depth0))
    + "\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.opensNewWindow : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a>\n                            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<a id=\"primary-nav-toggle\"><span>Menu</span></a>\n<nav id=\"primary-nav-mobile\" class=\"primary-nav\">\n    <div class=\"nav-wrapper\">\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.bookMenuId : stack1),{"name":"with","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"nav-panel-close\">\n        <div class=\"icon icon-arrow270\"></div>\n    </div>\n\n    <!-- Submenu Panels -->\n    <div class=\"nav-panel\">\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.toolMenuId : stack1),{"name":"with","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.menus : depth0)) != null ? stack1.adminMenuId : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</nav>";
},"useData":true});
templates['partials/uitk/header'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div id=\"global-header\">\n    <div class=\"site-content\">\n        <div class=\"site-navigation\">\n            <div id=\"site-logo\">\n                <a id=\"primary-nav-home\" href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" class=\"first\">\n                    <span class=\"visuallyhidden\">Egencia</span>\n                </a>\n            </div>\n"
    + ((stack1 = container.invokePartial(partials["partials/uitk/header-primary-nav-small"],depth0,{"name":"partials/uitk/header-primary-nav-small","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["partials/uitk/header-primary-nav-large"],depth0,{"name":"partials/uitk/header-primary-nav-large","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? depths[1].globalSearch : depths[1]),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["partials/uitk/header-account-nav-small"],depth0,{"name":"partials/uitk/header-account-nav-small","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["partials/uitk/header-account-nav-large"],depth0,{"name":"partials/uitk/header-account-nav-large","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</div>\n<div id=\"global-header-ghost-wrapper\"></div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                <a id=\"global-search\" class=\"left nav-item\" href=\"#\" data-control=\"modal\" data-modal-id=\"global-search\"><i class=\"icon icon-searchalt\"></i></a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? depths[1].webView : depths[1]),{"name":"unless","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true});
templates['partials/uitk/image-gallery-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "                        "
    + ((stack1 = ((helper = (helper = helpers.preTemplateContent || (depth0 != null ? depth0.preTemplateContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"preTemplateContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.templateContent : depth0),{"name":"with","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        "
    + ((stack1 = ((helper = (helper = helpers.postTemplateContent || (depth0 != null ? depth0.postTemplateContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postTemplateContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <li>\n                                "
    + ((stack1 = ((helper = (helper = helpers.ifHelper || (depth0 != null ? depth0.ifHelper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ifHelper","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                                <a data-image=\""
    + alias4(((helper = (helper = helpers.isImage || (depth0 != null ? depth0.isImage : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"isImage","hash":{},"data":data}) : helper)))
    + "\" href=\"http://www.youtube.com/embed/"
    + ((stack1 = ((helper = (helper = helpers.mediaId || (depth0 != null ? depth0.mediaId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "?enablejsapi=1"
    + ((stack1 = helpers["if"].call(alias1,{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-video-parameters=\""
    + alias4(((helper = (helper = helpers.videoParameters || (depth0 != null ? depth0.videoParameters : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"videoParameters","hash":{},"data":data}) : helper)))
    + "\" data-media-type=\""
    + alias4(((helper = (helper = helpers.mediaType || (depth0 != null ? depth0.mediaType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaType","hash":{},"data":data}) : helper)))
    + "\" data-media-id=\""
    + alias4(((helper = (helper = helpers.mediaId || (depth0 != null ? depth0.mediaId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaId","hash":{},"data":data}) : helper)))
    + "\" class=\"video "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n                                    <img src=\""
    + alias4(((helper = (helper = helpers.thumb || (depth0 != null ? depth0.thumb : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumb","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + ((stack1 = ((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alt","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"/>\n                                    <span class=\"icon icon-play\"></span>\n                                </a>\n                                "
    + ((stack1 = ((helper = (helper = helpers.ifHelperElse || (depth0 != null ? depth0.ifHelperElse : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ifHelperElse","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                                <a data-image=\""
    + alias4(((helper = (helper = helpers.isImage || (depth0 != null ? depth0.isImage : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"isImage","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.classes : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " data-media-type=\"image\""
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.srcSet : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.caption : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                                    <img src=\""
    + alias4(((helper = (helper = helpers.thumb || (depth0 != null ? depth0.thumb : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumb","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + ((stack1 = ((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alt","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"/>\n                                </a>\n                                "
    + ((stack1 = ((helper = (helper = helpers.ifHelperIf || (depth0 != null ? depth0.ifHelperIf : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ifHelperIf","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                            </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.videoParameters || (depth0 != null ? depth0.videoParameters : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"videoParameters","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return " class=\""
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"classes","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-srcset=\""
    + container.escapeExpression(((helper = (helper = helpers.srcSet || (depth0 != null ? depth0.srcSet : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"srcSet","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-caption=\""
    + ((stack1 = ((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"caption","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.slides : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                            <li>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isVideo : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "                            </li>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                    <a href=\"http://www.youtube.com/embed/"
    + ((stack1 = ((helper = (helper = helpers.mediaId || (depth0 != null ? depth0.mediaId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "?enablejsapi=1"
    + ((stack1 = helpers["if"].call(alias1,{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-video-parameters=\""
    + alias4(((helper = (helper = helpers.videoParameters || (depth0 != null ? depth0.videoParameters : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"videoParameters","hash":{},"data":data}) : helper)))
    + "\" data-media-type=\""
    + alias4(((helper = (helper = helpers.mediaType || (depth0 != null ? depth0.mediaType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaType","hash":{},"data":data}) : helper)))
    + "\" data-media-id=\""
    + alias4(((helper = (helper = helpers.mediaId || (depth0 != null ? depth0.mediaId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mediaId","hash":{},"data":data}) : helper)))
    + "\" class=\"video "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n                                        <img src=\""
    + alias4(((helper = (helper = helpers.thumb || (depth0 != null ? depth0.thumb : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumb","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + ((stack1 = ((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alt","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"/>\n                                        <span class=\"icon icon-play\"></span>\n                                    </a>\n";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                    <a href=\""
    + alias4(((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper)))
    + "\" data-media-type=\"image\"\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.classes : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.path : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.srcSet : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.downgradeIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.caption : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                                        "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                                        data-thumb-src=\""
    + alias4(((helper = (helper = helpers.thumb || (depth0 != null ? depth0.thumb : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumb","hash":{},"data":data}) : helper)))
    + "\"\n                                        data-thumb-alt=\""
    + alias4(((helper = (helper = helpers.alt || (depth0 != null ? depth0.alt : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alt","hash":{},"data":data}) : helper)))
    + "\"></a>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-path=\""
    + container.escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"path","hash":{},"data":data}) : helper)))
    + "\"";
},"18":function(container,depth0,helpers,partials,data) {
    return " data-downgrade=\"true\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"media-viewer-wrapper\">\n    <div class=\"media-viewer-wrap\">\n        <button class=\"media-viewer-open\"><i class=\"icon icon-noimagealt\"></i> "
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.slides : depth0)) != null ? stack1.length : stack1), depth0))
    + "</button>\n        <section class=\"media-viewer resize-shrink"
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-control=\"media-viewer\" data-slider-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" aria-live=\"polite\" "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n            <button class=\"media-viewer-close hidden btn-no-margin\"><i class=\"icon icon-close\"></i></button>\n            <button class=\"image-slider-control prev\">\n                <span class=\"icon icon-toggle270\" aria-hidden=\"true\"></span>\n                <span class=\"visuallyhidden\">Previous image</span>\n            </button>\n            <button class=\"image-slider-control next\">\n                <span class=\"visuallyhidden\">Next image</span>\n                <span class=\"icon icon-toggle90\" aria-hidden=\"true\"></span>\n            </button>\n            <div class=\"media-collection\"></div>\n            <span class=\"media-loader animated\">"
    + ((stack1 = container.invokePartial(partials["partials/uitk/loader-tag"],(depth0 != null ? depth0.loaderTag : depth0),{"name":"partials/uitk/loader-tag","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</span>\n        </section>\n        <section class=\"image-slider hidden\" data-control=\"image-slider\" data-slider-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" aria-controls=\"media-viewer\">\n            <div class=\"image-slider-mask\">\n                <ul class=\"image-slider-thumbs\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.outputTemplate : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n        </section>\n    </div>\n</div>";
},"usePartial":true,"useData":true});
templates['partials/uitk/interstitial'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"interstitial\">\n    <div class=\"interstitial-message\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n</div>";
},"useData":true});
templates['partials/uitk/layover'] = template({"1":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.duration || (depth0 && depth0.duration) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.duration : depth0),{"name":"duration","hash":{"full":(depth0 != null ? depth0.full : depth0),"hideZeros":(depth0 != null ? depth0.hideZeros : depth0)},"data":data}));
},"3":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"layover\">\n    <div class=\"layover-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.duration : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n</div>\n";
},"useData":true});
templates['partials/uitk/loader-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.overlayIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  <span "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      class=\"loader"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.overlayIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " title=\"Loading...\">\n  </span>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.overlayIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "<div class=\"loader-overlay loading\">";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"6":function(container,depth0,helpers,partials,data) {
    return " loader-dark";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return " "
    + container.escapeExpression(((helper = (helper = helpers.cssClass || (depth0 != null ? depth0.cssClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cssClass","hash":{},"data":data}) : helper)));
},"10":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
templates['partials/uitk/map-infowindow'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=map-infowindow>"
    + ((stack1 = ((helper = (helper = helpers.secondaryContent || (depth0 != null ? depth0.secondaryContent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"secondaryContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
templates['partials/uitk/map-marker-cdd'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"theme-map-marker marker marker-tooltip marker-cdd\">\n	<i class=\"icon-stack\">\n		<i class=\"icon icon-circle-filled\"></i>\n    	<i class=\"icon icon-destinationalt\"></i>\n    </i>\n</div>\n";
},"useData":true});
templates['partials/uitk/map-marker-dot'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " marker-price";
},"3":function(container,depth0,helpers,partials,data) {
    return " marker-sold-out";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"uitk-tooltip active-tooltip theme-map-marker show-arrow on top center marker marker-dot\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.price : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.soldOut : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n</div>\n";
},"useData":true});
templates['partials/uitk/map-marker-pin'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<span class=\"theme-map-marker marker marker-tooltip marker-pin\"></span>";
},"useData":true});
templates['partials/uitk/map-marker-tooltip'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " marker-price";
},"3":function(container,depth0,helpers,partials,data) {
    return " oop";
},"5":function(container,depth0,helpers,partials,data) {
    return " preferred";
},"7":function(container,depth0,helpers,partials,data) {
    return " marker-sold-out";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.i18nCurrency || (depth0 && depth0.i18nCurrency) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.price : depth0)) != null ? stack1.amount : stack1),{"name":"i18nCurrency","hash":{"round":true,"code":((stack1 = (depth0 != null ? depth0.price : depth0)) != null ? stack1.currency : stack1)},"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"uitk-tooltip active-tooltip theme-map-marker show-arrow on top center marker marker-tooltip\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.price : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.oop : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.preferred : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.soldOut : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n    <div class=\"tooltip-inner\">\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.price : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        <div class=\"info-window\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n    </div>\n    <span class='tooltip-arrow'></span>\n</div>\n";
},"useData":true});
templates['partials/uitk/map'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.fullscreen : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(25, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "        <a href=\"javascript:void(0)\" data-control=\"map\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.classes : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mapDataId : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.center : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.zoom : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.zoomToFitIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fullscreen : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mapType : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.legendIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.legendContent : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n            "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return " class=\""
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" ";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-config-id=\""
    + container.escapeExpression(((helper = (helper = helpers.mapDataId || (depth0 != null ? depth0.mapDataId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"mapDataId","hash":{},"data":data}) : helper)))
    + "\" ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-center=\""
    + ((stack1 = ((helper = (helper = helpers.center || (depth0 != null ? depth0.center : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"center","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-title=\""
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-subtitle=\""
    + ((stack1 = ((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subtitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-zoom=\""
    + ((stack1 = ((helper = (helper = helpers.zoom || (depth0 != null ? depth0.zoom : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"zoom","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    return " data-zoom-to-fit=\"true\" ";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-fullscreen=\""
    + container.escapeExpression(((helper = (helper = helpers.fullscreen || (depth0 != null ? depth0.fullscreen : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"fullscreen","hash":{},"data":data}) : helper)))
    + "\" ";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-map-type=\""
    + container.escapeExpression(((helper = (helper = helpers.mapType || (depth0 != null ? depth0.mapType : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"mapType","hash":{},"data":data}) : helper)))
    + "\" ";
},"21":function(container,depth0,helpers,partials,data) {
    return " data-legend=\"true\" ";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-legend-content=\""
    + ((stack1 = ((helper = (helper = helpers.legendContent || (depth0 != null ? depth0.legendContent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"legendContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"25":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <figure data-control=\"map\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"map-inline "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\"\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mapDataId : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.coordinates : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.center : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.zoom : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.zoomToFitIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mapType : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </figure>\n";
},"26":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "            data-coordinates=\"\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.coordinates : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n            data-center=\"\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.coordinates : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n";
},"27":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "                    "
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(28, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    "
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(30, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                ";
},"28":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = container.lambda(depths[1], depth0)) != null ? stack1 : "");
},"30":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ","
    + ((stack1 = container.lambda(depths[1], depth0)) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "            data-center=\"\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.center : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            <figcaption class=\"map-heading\">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</figcaption>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true,"useDepths":true});
templates['partials/uitk/modal-alert'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon-stack\"><i class=\"modal-alert-icon icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.alertIcon || (depth0 != null ? depth0.alertIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alertIcon","hash":{},"data":data}) : helper)))
    + "\"></i></i>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<header class=\"modal-alert alert-text-"
    + alias4(((helper = (helper = helpers.alert || (depth0 != null ? depth0.alert : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alert","hash":{},"data":data}) : helper)))
    + "\">\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alertIcon : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    <h1 class=\"modal-alert-title\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-title\">"
    + alias4(((helper = (helper = helpers.alertTitle || (depth0 != null ? depth0.alertTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alertTitle","hash":{},"data":data}) : helper)))
    + "</h1>\n</header>";
},"useData":true});
templates['partials/uitk/modal-background'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " modal-dismiss";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return " theme-"
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"theme","hash":{},"data":data}) : helper)));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"modal-background "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dismiss : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.theme : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"></div>";
},"useData":true});
templates['partials/uitk/modal-footer'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <div class=\"modal-footer-btns\">\n            <button id=\"modal-cancel\" class=\"btn btn-text-sub-action btn-med btn-no-margin\">\n                <span class=\"btn-label\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_cancel",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n            </button>\n            <button id=\"modal-confirm\" class=\"btn btn-action btn-med btn-no-margin\">\n                <span class=\"btn-label\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,(depth0 != null ? depth0.confirmText : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n            </button>\n        </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <div class=\"input-group opt-out\">\n            <input id=\"modal-opt-out\" name=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-opt-out\" type=\"checkbox\">\n            <label for=\"modal-opt-out\" class=\"modal-opt-out-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.optOutText : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "</label>\n        </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.optOutText : depth0),{"name":"i18nMsg","hash":{},"data":data}));
},"6":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Don't show this again",{"name":"i18nMsg","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<footer class=\"modal-footer cf\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.confirm : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.optOut : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</footer>";
},"useData":true});
templates['partials/uitk/modal-inner'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "modal-dismiss";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "panel panel-"
    + container.escapeExpression(((helper = (helper = helpers.panelSize || (depth0 != null ? depth0.panelSize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"panelSize","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    return "modal-with-title";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return " aria-labelledby=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "-title\"";
},"9":function(container,depth0,helpers,partials,data) {
    return " aria-busy=\"true\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/modal-alert"],depth0,{"name":"partials/uitk/modal-alert","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/modal-title"],depth0,{"name":"partials/uitk/modal-title","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/modal-footer"],depth0,{"name":"partials/uitk/modal-footer","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.panel : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    return "            <i class=\"modal-close icon icon-close\"></i>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"modal-inner "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dismiss : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.panel : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" role=\"dialog\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.content : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alert : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"modal-body cf\"></div>\n    <div class=\"modal-loader\">\n        <p>\n            <span class=\"loader loader-light loader-secondary loading\" title=\"Loading...\"></span>\n        </p>\n    </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.footer : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.confirm : depth0),{"name":"unless","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});
templates['partials/uitk/modal-template'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " modal-dismiss";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return " theme-"
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"theme","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/modal-inner"],depth0,{"name":"partials/uitk/modal-inner","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/modal-background"],depth0,{"name":"partials/uitk/modal-background","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"modal-wrap"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dismiss : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.theme : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"modal-"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["with"].call(alias1,depth0,{"name":"with","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.background : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['partials/uitk/modal-title'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.titleIcon || (depth0 != null ? depth0.titleIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"titleIcon","hash":{},"data":data}) : helper)))
    + " modal-title-icon\"></i>";
},"3":function(container,depth0,helpers,partials,data) {
    return "<i class=\"modal-close icon icon-close\"></i>";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <p class=\"modal-subtitle\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-subtitle\">"
    + alias4(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<header class=\"modal-header\">\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.titleIcon : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    <h4 class=\"modal-title\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.panel : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</h4>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</header>";
},"useData":true});
templates['partials/uitk/modal'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.linkContent : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "        <a data-control=\"modal\"\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.ajaxUrl : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.linkClasses : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.defaultTheme : depth0),{"name":"unless","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dismissIsFalse : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.backgroundIsFalse : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alert : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alertTitle : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alertIcon : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.titleIcon : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.footer : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.panel : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.panelSize : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.confirm : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.confirmText : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.closeBtnIsFalse : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.closeText : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.optOut : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.optOutText : depth0),{"name":"if","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.manual : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.state : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n            "
    + ((stack1 = ((helper = (helper = helpers.linkContent || (depth0 != null ? depth0.linkContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return " href=\""
    + container.escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return " href=\"#\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return " href=\""
    + container.escapeExpression(((helper = (helper = helpers.ajaxUrl || (depth0 != null ? depth0.ajaxUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ajaxUrl","hash":{},"data":data}) : helper)))
    + "\" data-ajax=\"true\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return " class=\""
    + container.escapeExpression(((helper = (helper = helpers.linkClasses || (depth0 != null ? depth0.linkClasses : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"linkClasses","hash":{},"data":data}) : helper)))
    + "\" ";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-modal-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-js-theme=\""
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"theme","hash":{},"data":data}) : helper)))
    + "\" ";
},"17":function(container,depth0,helpers,partials,data) {
    return " data-dismiss=\"false\" ";
},"19":function(container,depth0,helpers,partials,data) {
    return " data-background=\"false\" ";
},"21":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-alert=\""
    + container.escapeExpression(((helper = (helper = helpers.alert || (depth0 != null ? depth0.alert : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alert","hash":{},"data":data}) : helper)))
    + "\" ";
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-alert-title=\""
    + container.escapeExpression(((helper = (helper = helpers.alertTitle || (depth0 != null ? depth0.alertTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alertTitle","hash":{},"data":data}) : helper)))
    + "\" ";
},"25":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-alert-icon=\""
    + container.escapeExpression(((helper = (helper = helpers.alertIcon || (depth0 != null ? depth0.alertIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"alertIcon","hash":{},"data":data}) : helper)))
    + "\"";
},"27":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-title=\""
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper)))
    + "\" ";
},"29":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-subtitle=\""
    + container.escapeExpression(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\" ";
},"31":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-title-icon=\""
    + container.escapeExpression(((helper = (helper = helpers.titleIcon || (depth0 != null ? depth0.titleIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"titleIcon","hash":{},"data":data}) : helper)))
    + "\"";
},"33":function(container,depth0,helpers,partials,data) {
    return " data-footer=\"true\" ";
},"35":function(container,depth0,helpers,partials,data) {
    return " data-panel=\"true\" ";
},"37":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-panel-size=\""
    + container.escapeExpression(((helper = (helper = helpers.panelSize || (depth0 != null ? depth0.panelSize : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"panelSize","hash":{},"data":data}) : helper)))
    + "\"";
},"39":function(container,depth0,helpers,partials,data) {
    return " data-confirm=\"true\" ";
},"41":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-confirm-text=\""
    + container.escapeExpression(((helper = (helper = helpers.confirmText || (depth0 != null ? depth0.confirmText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"confirmText","hash":{},"data":data}) : helper)))
    + "\"";
},"43":function(container,depth0,helpers,partials,data) {
    return " data-close-btn=\"false\"";
},"45":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-close-text=\""
    + container.escapeExpression(((helper = (helper = helpers.closeText || (depth0 != null ? depth0.closeText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"closeText","hash":{},"data":data}) : helper)))
    + "\"";
},"47":function(container,depth0,helpers,partials,data) {
    return " data-opt-out=\"true\" ";
},"49":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-opt-out-text=\""
    + container.escapeExpression(((helper = (helper = helpers.optOutText || (depth0 != null ? depth0.optOutText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"optOutText","hash":{},"data":data}) : helper)))
    + "\"";
},"51":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-manual=\""
    + container.escapeExpression(((helper = (helper = helpers.manual || (depth0 != null ? depth0.manual : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"manual","hash":{},"data":data}) : helper)))
    + "\"";
},"53":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-state=\""
    + container.escapeExpression(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"state","hash":{},"data":data}) : helper)))
    + "\"";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div id=\"modal-content-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"visuallyhidden "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" aria-hidden=\"true\">\n            <div class=\"modal-content\">"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"usePartial":true,"useData":true});
templates['partials/uitk/pill'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div class=\"pill "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.theme : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.msg : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "pill-"
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"theme","hash":{},"data":data}) : helper)));
},"4":function(container,depth0,helpers,partials,data) {
    return "pill-default";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <i class=\"icon icon-"
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"url","hash":{},"data":data}) : helper)))
    + "\"/>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <span>"
    + container.escapeExpression(((helper = (helper = helpers.msg || (depth0 != null ? depth0.msg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"msg","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "            <span>"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
templates['partials/uitk/pricing-button'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"btn-wrapper\">\n    <"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"btn btn-no-margin btn-price "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.oop : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.corporateFare : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <span class=\"btn-label\">\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.oop : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.sup : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </span>\n    </"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.msg : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "a";
},"4":function(container,depth0,helpers,partials,data) {
    return "button";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "href=\""
    + container.escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data}) : helper)))
    + "\"";
},"8":function(container,depth0,helpers,partials,data) {
    return "out-of-policy";
},"10":function(container,depth0,helpers,partials,data) {
    return "corporate-fare";
},"12":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"14":function(container,depth0,helpers,partials,data) {
    return "<i class=\"icon icon-flagalt small\"></i> ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data})) != null ? stack1 : "")
    + " ";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = (helpers.i18nCurrency || (depth0 && depth0.i18nCurrency) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.amount : depth0),{"name":"i18nCurrency","hash":{"round":(depth0 != null ? depth0.round : depth0),"code":(depth0 != null ? depth0.code : depth0),"locale":(depth0 != null ? depth0.locale : depth0)},"data":data})) != null ? stack1 : "");
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<sup>"
    + ((stack1 = ((helper = (helper = helpers.sup || (depth0 != null ? depth0.sup : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sup","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</sup>";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"btn-message\">"
    + ((stack1 = (helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.msg : depth0),{"name":"i18nMsg","hash":{},"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
templates['partials/uitk/progress-bar'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"progress-bar\">\n    <div class=\"progress-indicator\"></div>\n</div>";
},"useData":true});
templates['partials/uitk/results-list-tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "    <ul"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"segmented-list results-list"
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.preTemplateContent : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.templateContent : depth0),{"name":"with","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.postTemplateContent : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " "
    + ((stack1 = ((helper = (helper = helpers.preTemplateContent || (depth0 != null ? depth0.preTemplateContent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"preTemplateContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/results-segment"],depth0,{"name":"partials/uitk/results-segment","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " "
    + ((stack1 = ((helper = (helper = helpers.postTemplateContent || (depth0 != null ? depth0.postTemplateContent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"postTemplateContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " ";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.segments : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    return "    </ul>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.includeTemplateOuterWrapIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.outputTemplate : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.includeTemplateOuterWrapIsTrue : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['partials/uitk/results-segment'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<li"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    class=\"segment segment-result"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.segmentInfoPane : depth0)) != null ? stack1.toggle : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.segmentInfoPane : depth0)) != null ? stack1.animation : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return " id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    return " toggle";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.segmentInfoPane : depth0)) != null ? stack1.animation : stack1), depth0));
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.target || (depth0 != null ? depth0.target : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"target","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.linkedTarget : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"target\">\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return " target=\""
    + container.escapeExpression(((helper = (helper = helpers.linkedTarget || (depth0 != null ? depth0.linkedTarget : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"linkedTarget","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", buffer = "";

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : alias2),(options={"name":"compress","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n      </article>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "      <article"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n          class=\"segment-info info cf"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.toggle : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\"\n          "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.toggle : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n          "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.togglePaneID : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n          "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.animationNotFade : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " id=\""
    + ((stack1 = ((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"15":function(container,depth0,helpers,partials,data) {
    return " target toggle-trigger";
},"17":function(container,depth0,helpers,partials,data) {
    return " data-control=\"toggle\" ";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-content-id=\""
    + ((stack1 = ((helper = (helper = helpers.togglePaneID || (depth0 != null ? depth0.togglePaneID : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"togglePaneID","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " data-transition=\""
    + ((stack1 = ((helper = (helper = helpers.animation || (depth0 != null ? depth0.animation : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"animation","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "      <section"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.segmentInfoPane : depth0)) != null ? stack1.togglePaneID : stack1),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.segmentTogglePane : depth0),{"name":"with","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </section>\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " id=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.segmentInfoPane : depth0)) != null ? stack1.togglePaneID : stack1), depth0)) != null ? stack1 : "")
    + "\"";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "          class=\"segment-toggle info toggle-pane"
    + ((stack1 = ((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = helpers.dataAttributes || (depth0 != null ? depth0.dataAttributes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n            "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"29":function(container,depth0,helpers,partials,data) {
    return "    </a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", buffer = "";

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : alias2),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.target : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.segmentInfoPane : depth0),{"name":"with","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.segmentTogglePane : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.target : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</li>";
},"useData":true});
templates['partials/uitk/search-bar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<div id=\"search-bar\" data-control=\"search-bar\">\n    <div id=\"search-bar-display\">\n        <div class=\"right\">\n            <button id=\"search-bar-change-search\" class=\"btn btn-text-action btn-med btn-no-margin\">\n                <span id=\"search-bar-change-search-btn\" class=\"btn-label\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_change_search",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n                <span id=\"search-bar-change-search-icon\" class=\"btn-label\"><i class=\"icon icon-searchalt\"></i></span>\n            </button>\n        </div>\n        <div id=\"search-bar-responsive-wrap-outer\" class=\"text\">\n            <h2 id=\"search-bar-content-primary\">"
    + ((stack1 = ((helper = (helper = helpers.primary || (depth0 != null ? depth0.primary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"primary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h2>\n            <div id=\"search-bar-responsive-wrap-inner\">\n                <h5 id=\"search-bar-content-secondary\" class=\"text-shade1\">"
    + ((stack1 = ((helper = (helper = helpers.secondary || (depth0 != null ? depth0.secondary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"secondary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h5>\n                <h5 id=\"search-bar-content-tertiary\" class=\"text-shade2\">"
    + ((stack1 = ((helper = (helper = helpers.tertiary || (depth0 != null ? depth0.tertiary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tertiary","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h5>\n            </div>\n        </div>\n    </div>\n    <div id=\"search-bar-edit\" class=\"hidden\">"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n</div>\n";
},"usePartial":true,"useData":true});
templates['partials/uitk/slider'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "data-range=\"true\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-step=\""
    + container.escapeExpression(((helper = (helper = helpers.step || (depth0 != null ? depth0.step : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"step","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "data-price=\"true\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "data-duration=\"true\"";
},"9":function(container,depth0,helpers,partials,data) {
    return "data-time=\"true\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-weekday=\""
    + container.escapeExpression(((helper = (helper = helpers.weekday || (depth0 != null ? depth0.weekday : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"weekday","hash":{},"data":data}) : helper)))
    + "\"";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-currency=\""
    + container.escapeExpression(((helper = (helper = helpers.currency || (depth0 != null ? depth0.currency : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"currency","hash":{},"data":data}) : helper)))
    + "\"";
},"15":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-min=\""
    + container.escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"min","hash":{},"data":data}) : helper)))
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-max=\""
    + container.escapeExpression(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"max","hash":{},"data":data}) : helper)))
    + "\"";
},"19":function(container,depth0,helpers,partials,data) {
    return "data-plus=\"true\"";
},"21":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-value=\""
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-values=\""
    + container.escapeExpression(((helper = (helper = helpers.values || (depth0 != null ? depth0.values : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"values","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-control=\"slider\"\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.twoWay : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.step : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.price : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.duration : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.time : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.weekday : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.currency : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.min : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.max : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.plus : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n</div>\n";
},"useData":true});
templates['partials/uitk/star-ratings-filter'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " class=\"visuallyhidden\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    return "star";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)));
},"9":function(container,depth0,helpers,partials,data) {
    return "starRating";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<fieldset class=\"star-ratings-filter\">\n	<legend"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.legendHidden : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_legend",{"name":"i18nMsg","hash":{},"data":data}))
    + "</legend>\n\n	<div class=\"star-input-wrapper\">\n		<input type=\"radio\" class=\"star-rating unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-5\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"5\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-5\" class=\"star-label unlabel\">\n			<span class=\"visuallyhidden\">5 "
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_text",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n		</label>\n\n		<input type=\"radio\" class=\"star-rating unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-4\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"4\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-4\" class=\"star-label unlabel\">\n			<span class=\"visuallyhidden\">4 "
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_text",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n		</label>\n\n		<input type=\"radio\" class=\"star-rating unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-3\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"3\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-3\" class=\"star-label unlabel\">\n			<span class=\"visuallyhidden\">3 "
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_text",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n		</label>\n\n		<input type=\"radio\" class=\"star-rating unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-2\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"2\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-2\" class=\"star-label unlabel\">\n			<span class=\"visuallyhidden\">2 "
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_text",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n		</label>\n\n		<input type=\"radio\" class=\"star-rating unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-1\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"1\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-1\" class=\"star-label unlabel\">\n			<span class=\"visuallyhidden\">1 "
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_rating_stars_text",{"name":"i18nMsg","hash":{},"data":data}))
    + "</span>\n		</label>\n\n		<input type=\"radio\" class=\"unradio visuallyhidden\" id=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-clear\" name=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\" value=\"0\" checked=\"checked\" />\n		<label for=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "-clear\" class=\"clear-label unlabel\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_filter_reset",{"name":"i18nMsg","hash":{},"data":data}))
    + "</label>\n	</div>\n</fieldset>\n";
},"useData":true});
templates['partials/uitk/stepper'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.min : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"min","hash":{},"data":data}) : helper)));
},"8":function(container,depth0,helpers,partials,data) {
    return "0";
},"10":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-value=\""
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-step=\""
    + container.escapeExpression(((helper = (helper = helpers.step || (depth0 != null ? depth0.step : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"step","hash":{},"data":data}) : helper)))
    + "\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-min=\""
    + container.escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"min","hash":{},"data":data}) : helper)))
    + "\"";
},"16":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-max=\""
    + container.escapeExpression(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"max","hash":{},"data":data}) : helper)))
    + "\"";
},"18":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"stepper\">\n    <span class=\"input stepper-control stepper-btn stepper-down"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><i class='icon icon-subtract'></i></span>\n    <input type=\"text\" class=\"input stepper-control stepper-input\" data-control=\"stepper\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.step : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.min : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.max : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n    <span class=\"input stepper-control stepper-btn stepper-up"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><i class='icon icon-add'></i></span>\n</div>";
},"useData":true});
templates['partials/uitk/tab-pane'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"tab-pane\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " \">\n"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
templates['partials/uitk/tab-panes'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"tabs-container\">\n"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div></div>\n";
},"usePartial":true,"useData":true});
templates['partials/uitk/tab'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"url","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "#"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    return "data-initial-tab=\"true\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "on";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"icon "
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"tab\">\n	<a href=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-tab\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\">\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <span class=\"tab-label\">"
    + ((stack1 = (helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"i18nMsg","hash":{},"data":data})) != null ? stack1 : "")
    + "</span>\n        <div class=\"tab-indicator\"></div>\n    </a>\n</li>\n";
},"useData":true});
templates['partials/uitk/table-total'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<tfoot>\n<tr>\n    <td colspan=\"2\" class=\"align-right table-total\">\n        <hr class=\"hr-small hr-right\">\n        <h6 class=\"sub-header\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_total",{"name":"i18nMsg","hash":{},"data":data}))
    + "</h6>\n        <h2 class=\"font-light\">"
    + alias3((helpers.i18nCurrency || (depth0 && depth0.i18nCurrency) || alias2).call(alias1,(depth0 != null ? depth0.amount : depth0),{"name":"i18nCurrency","hash":{"round":(depth0 != null ? depth0.round : depth0),"code":(depth0 != null ? depth0.code : depth0),"locale":(depth0 != null ? depth0.locale : depth0)},"data":data}))
    + "</h2>\n    </td>\n</tr>\n</tfoot>";
},"useData":true});
templates['partials/uitk/tabs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return " "
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"theme","hash":{},"data":data}) : helper)))
    + "-theme";
},"3":function(container,depth0,helpers,partials,data) {
    return " box-theme";
},"5":function(container,depth0,helpers,partials,data) {
    return " tabs-large";
},"7":function(container,depth0,helpers,partials,data) {
    return " tabs-stretch";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "style=\"width:"
    + container.escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"width","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-tab-state=\""
    + container.escapeExpression(((helper = (helper = helpers.state || (depth0 != null ? depth0.state : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"state","hash":{},"data":data}) : helper)))
    + "\"";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return " data-history=\""
    + container.escapeExpression(((helper = (helper = helpers.history || (depth0 != null ? depth0.history : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"history","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"inline-tabs"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.theme : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.large : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.stretch : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n     "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.width : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n     data-control=\"tabs\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.state : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.history : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n    <ul class=\"tabs\">\n"
    + ((stack1 = container.invokePartial(partials["@partial-block"],depth0,{"name":"@partial-block","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </ul>\n";
},"usePartial":true,"useData":true});
templates['partials/uitk/tag'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <span id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" class=\"tag"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bgColor : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + alias4(((helper = (helper = helpers.cssClass || (depth0 != null ? depth0.cssClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cssClass","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + "\">\n        <span class=\"tag-title\">\n            "
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </span>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.remove : depth0),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </span>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.bgColor || (depth0 != null ? depth0.bgColor : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bgColor","hash":{},"data":data}) : helper)));
},"4":function(container,depth0,helpers,partials,data) {
    return " tag-color-gray";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <i class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.autocomplete : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "tag-remove\"></i>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "autocomplete-";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.compress || (depth0 != null ? depth0.compress : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"compress","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.compress) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['partials/uitk/tealeaf-tags'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return container.escapeExpression(((helper = (helper = helpers.userId || (depth0 != null ? depth0.userId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"userId","hash":{},"data":data}) : helper)))
    + ((stack1 = helpers.unless.call(alias1,(data && data.last),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda;

  return "\n<!--tlPageName:"
    + alias2(((helper = (helper = helpers.pageName || (depth0 != null ? depth0.pageName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"pageName","hash":{},"data":data}) : helper)))
    + "-->\n<!--tlSessionID:"
    + alias2(alias3(((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.sessionId : stack1), depth0))
    + "-->\n\n<!--tlUserID:"
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.user : stack1)) != null ? stack1.userId : stack1), depth0))
    + "-->\n<!--tlCompanyID:"
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.user : stack1)) != null ? stack1.companyId : stack1), depth0))
    + "-->\n<!--tlProductID:"
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.user : stack1)) != null ? stack1.productId : stack1), depth0))
    + "-->\n<!--tlArrangeeIDs:"
    + ((stack1 = helpers.each.call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.globalContext : stack1)) != null ? stack1.arrangees : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n\n<!--tlAuthenticatedUserID:"
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? depth0.EG : depth0)) != null ? stack1.authenticatedEntity : stack1)) != null ? stack1.userId : stack1), depth0))
    + "-->";
},"useData":true});
templates['partials/uitk/timepicker'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.escapeExpression;

  return "            <option value=\""
    + alias1(container.lambda(depth0, depth0))
    + "\">"
    + alias1((helpers.i18nTime || (depth0 && depth0.i18nTime) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"i18nTime","hash":{},"data":data}))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"timepicker input-group select\">\n    <label>"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</label>\n    <select id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-control=\"timepicker\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.times : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n</div>";
},"useData":true});
templates['partials/uitk/uitk-calendar-template'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "annual";
},"3":function(container,depth0,helpers,partials,data) {
    return "annual-";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <section class=\"cal-section-year\">\n            <div class=\"year-control\">\n                <button class=\"btn btn-text-sub-action btn-med next-year\">\n                    <span class=\"btn-label\"><i class=\"icon icon-toggle0\"></i><span class=\"visuallyhidden\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"uitk_calendar_next_month",{"name":"i18nMsg","hash":{"bundle":"uitk"},"data":data}))
    + "</span></span>\n                </button>\n                <h1 class=\"font-light year\">"
    + alias3(((helper = (helper = helpers.year1 || (depth0 != null ? depth0.year1 : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"year1","hash":{},"data":data}) : helper)))
    + "</h1>\n                <button class=\"btn btn-text-sub-action btn-med prev-year\">\n                    <span class=\"btn-label\"><i class=\"icon icon-toggle180\"></i><span class=\"visuallyhidden\">"
    + alias3((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || alias2).call(alias1,"calendar_prev_month",{"name":"i18nMsg","hash":{"bundle":"uitk"},"data":data}))
    + "</span></span>\n                </button>\n            </div>\n        </section>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "            <button class=\"btn btn-text-sub-action btn-small prev\">\n                <span class=\"btn-label\"><span class=\"icon icon-toggle270\"></span><span class=\"visuallyhidden\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"calendar_prev_month",{"name":"i18nMsg","hash":{"bundle":"uitk"},"data":data}))
    + "</span></span>\n            </button>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "            <button class=\"btn btn-text-sub-action btn-small next\">\n                <span class=\"btn-label\"><span class=\"icon icon-toggle90\"></span><span class=\"visuallyhidden\">"
    + container.escapeExpression((helpers.i18nMsg || (depth0 && depth0.i18nMsg) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"calendar_next_month",{"name":"i18nMsg","hash":{"bundle":"uitk"},"data":data}))
    + "</span></span>\n            </button>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"cal-timepicker\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.time : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/timepicker"],(depth0 != null ? depth0.time : depth0),{"name":"partials/uitk/timepicker","data":data,"indent":"                    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.startTime : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.endTime : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/timepicker"],(depth0 != null ? depth0.startTime : depth0),{"name":"partials/uitk/timepicker","data":data,"indent":"                        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/timepicker"],(depth0 != null ? depth0.endTime : depth0),{"name":"partials/uitk/timepicker","data":data,"indent":"                        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"cal "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.annual : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-js-theme=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.annual : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "calendar\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.annual : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"cal-section-wrapper\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prevButton : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.nextButton : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <section class=\"cal-section\">\n            <header>\n                <h5>\n                    <span class=\"month\">"
    + alias4(((helper = (helper = helpers.month1 || (depth0 != null ? depth0.month1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month1","hash":{},"data":data}) : helper)))
    + "</span>\n                    <span class=\"year\">"
    + alias4(((helper = (helper = helpers.year1 || (depth0 != null ? depth0.year1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year1","hash":{},"data":data}) : helper)))
    + "</span>\n                </h5>\n                <ul class=\"cal-days medium\">\n                    "
    + ((stack1 = ((helper = (helper = helpers.calDays || (depth0 != null ? depth0.calDays : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"calDays","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                </ul>\n            </header>\n            <ul class=\"cal-dates medium\">\n                "
    + ((stack1 = ((helper = (helper = helpers.calDates1 || (depth0 != null ? depth0.calDates1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"calDates1","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n            </ul>\n        </section>\n        <hr class=\"vertical-divider "
    + alias4(((helper = (helper = helpers.newYear || (depth0 != null ? depth0.newYear : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newYear","hash":{},"data":data}) : helper)))
    + "\">\n        <section class=\"cal-section "
    + alias4(((helper = (helper = helpers.newYear || (depth0 != null ? depth0.newYear : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newYear","hash":{},"data":data}) : helper)))
    + "\">\n            <header>\n                <h5>\n                    <span class=\"month\">"
    + alias4(((helper = (helper = helpers.month2 || (depth0 != null ? depth0.month2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month2","hash":{},"data":data}) : helper)))
    + "</span>\n                    <span class=\"year\">"
    + alias4(((helper = (helper = helpers.year2 || (depth0 != null ? depth0.year2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year2","hash":{},"data":data}) : helper)))
    + "</span>\n                </h5>\n                <ul class=\"cal-days medium\">\n                    "
    + ((stack1 = ((helper = (helper = helpers.calDays || (depth0 != null ? depth0.calDays : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"calDays","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                </ul>\n            </header>\n            <ul class=\"cal-dates medium\">\n                "
    + ((stack1 = ((helper = (helper = helpers.calDates2 || (depth0 != null ? depth0.calDates2 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"calDates2","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n            </ul>\n        </section>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.timepicker : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>";
},"usePartial":true,"useData":true});
templates['partials/uitk/uitk-map-template'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " legend";
},"3":function(container,depth0,helpers,partials,data) {
    return " subtitle";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return " aria-labelledby=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "-title\"";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["partials/uitk/button-tag"],depth0,{"name":"partials/uitk/button-tag","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<h2 class=\"h2 map-heading\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-title\">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h2>";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<p class=\"subtitle\">"
    + ((stack1 = ((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subtitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <div id=\"legend\" class=\"legend\">\n      "
    + ((stack1 = ((helper = (helper = helpers.legendcontent || (depth0 != null ? depth0.legendcontent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"legendcontent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"map-overlay"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.legend : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" role=\"dialog\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <header class=\"map-header\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-header\">\n"
    + ((stack1 = helpers["with"].call(alias1,(depth0 != null ? depth0.closeButton : depth0),{"name":"with","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  </header>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.legend : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <div id=\""
    + alias4(((helper = (helper = helpers.canvasid || (depth0 != null ? depth0.canvasid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"canvasid","hash":{},"data":data}) : helper)))
    + "\" class=\"map-canvas\"></div>\n</div>\n";
},"usePartial":true,"useData":true});
})();
// The precompiler doesn't put them in both places (the old maven one did and so we need this)
Handlebars.partials = Handlebars.templates;