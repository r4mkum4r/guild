// I18n.js
// =======
//
// This small library provides the Rails I18n API on the Javascript.
// You don't actually have to use Rails (or even Ruby) to use I18n.js.
// Just make sure you export all translations in an object like this:
//
//     I18n.translations.en = {
//       hello: "Hello World"
//     };
//
// See tests for specific formatting like numbers and dates.
//

// Using UMD pattern from
// https://github.com/umdjs/umd#regular-module
// `returnExports.js` version
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define("i18n", function(){ return factory(root);});
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(root);
    } else {
        // Browser globals (root is window)
        root.I18n = factory(root);
    }
}(this, function(global) {
    "use strict";

    // Use previously defined object if exists in current scope
    var I18n = global && global.I18n || {};

    // Just cache the Array#slice function.
    var slice = Array.prototype.slice;

    // Apply number padding.
    var padding = function(number) {
        return ("0" + number.toString()).substr(-2);
    };

    // Improved toFixed number rounding function with support for unprecise floating points
    // JavaScript's standard toFixed function does not round certain numbers correctly (for example 0.105 with precision 2).
    var toFixed = function(number, precision) {
        return decimalAdjust('round', number, -precision).toFixed(precision);
    };

    // Is a given variable an object?
    // Borrowed from Underscore.js
    var isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object'
    };

    var isFunction = function(func) {
        var type = typeof func;
        return type === 'function'
    };

    // Check if value is different than undefined and null;
    var isSet = function(value) {
        return typeof(value) !== 'undefined' && value !== null;
    };

    // Is a given value an array?
    // Borrowed from Underscore.js
    var isArray = function(val) {
        if (Array.isArray) {
            return Array.isArray(val);
        };
        return Object.prototype.toString.call(val) === '[object Array]';
    };

    var isString = function(val) {
        return typeof value == 'string' || Object.prototype.toString.call(val) === '[object String]';
    };

    var isNumber = function(val) {
        return typeof val == 'number' || Object.prototype.toString.call(val) === '[object Number]';
    };

    var isBoolean = function(val) {
        return val === true || val === false;
    };

    var decimalAdjust = function(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    var lazyEvaluate = function(message, scope) {
        if (isFunction(message)) {
            return message(scope);
        } else {
            return message;
        }
    }

    var merge = function (dest, obj) {
        var key, value;
        for (key in obj) if (obj.hasOwnProperty(key)) {
            value = obj[key];
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                dest[key] = value;
            } else {
                if (dest[key] == null) dest[key] = {};
                merge(dest[key], value);
            }
        }
        return dest;
    };

    // Set default days/months translations.
    var DATE = {
        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        , abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        , month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        , abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        , meridian: ["AM", "PM"]
    };

    // Set default number format.
    var NUMBER_FORMAT = {
        precision: 3
        , separator: "."
        , delimiter: ","
        , strip_insignificant_zeros: false
    };

    // Set default currency format.
    var CURRENCY_FORMAT = {
        unit: "$"
        , precision: 2
        , format: "%u%n"
        , sign_first: true
        , delimiter: ","
        , separator: "."
    };

    // Set default percentage format.
    var PERCENTAGE_FORMAT = {
        unit: "%"
        , precision: 3
        , format: "%n%u"
        , separator: "."
        , delimiter: ""
    };

    // Set default size units.
    var SIZE_UNITS = [null, "kb", "mb", "gb", "tb"];

    // Other default options
    var DEFAULT_OPTIONS = {
        // Set default locale. This locale will be used when fallback is enabled and
        // the translation doesn't exist in a particular locale.
        defaultLocale: "en"
        // Set the current locale to `en`.
        , locale: "en"
        // Set the translation key separator.
        , defaultSeparator: "."
        // Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
        , placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm
        // Set if engine should fallback to the default locale when a translation
        // is missing.
        , fallbacks: true
        // Set the default translation object.
        , translations: {}
        // Set missing translation behavior. 'message' will display a message
        // that the translation is missing, 'guess' will try to guess the string
        , missingBehaviour: 'message'
        // if you use missingBehaviour with 'message', but want to know that the
        // string is actually missing for testing purposes, you can prefix the
        // guessed string by setting the value here. By default, no prefix!
        , missingTranslationPrefix: ''
    };

    // Set default locale. This locale will be used when fallback is enabled and
    // the translation doesn't exist in a particular locale.
    I18n.reset = function() {
        var key;
        for (key in DEFAULT_OPTIONS) {
            this[key] = DEFAULT_OPTIONS[key];
        }
    };

    // Much like `reset`, but only assign options if not already assigned
    I18n.initializeOptions = function() {
        var key;
        for (key in DEFAULT_OPTIONS) if (!isSet(this[key])) {
            this[key] = DEFAULT_OPTIONS[key];
        }
    };
    I18n.initializeOptions();

    // Return a list of all locales that must be tried before returning the
    // missing translation message. By default, this will consider the inline option,
    // current locale and fallback locale.
    //
    //     I18n.locales.get("de-DE");
    //     // ["de-DE", "de", "en"]
    //
    // You can define custom rules for any locale. Just make sure you return a array
    // containing all locales.
    //
    //     // Default the Wookie locale to English.
    //     I18n.locales["wk"] = function(locale) {
    //       return ["en"];
    //     };
    //
    I18n.locales = {};

    // Retrieve locales based on inline locale, current locale or default to
    // I18n's detection.
    I18n.locales.get = function(locale) {
        var result = this[locale] || this[I18n.locale] || this["default"];

        if (isFunction(result)) {
            result = result(locale);
        }

        if (isArray(result) === false) {
            result = [result];
        }

        return result;
    };

    // The default locale list.
    I18n.locales["default"] = function(locale) {
        var locales = []
            , list = []
            , countryCode
            , count
        ;

        // Handle the inline locale option that can be provided to
        // the `I18n.t` options.
        if (locale) {
            locales.push(locale);
        }

        // Add the current locale to the list.
        if (!locale && I18n.locale) {
            locales.push(I18n.locale);
        }

        // Add the default locale if fallback strategy is enabled.
        if (I18n.fallbacks && I18n.defaultLocale) {
            locales.push(I18n.defaultLocale);
        }

        // Compute each locale with its country code.
        // So this will return an array containing both
        // `de-DE` and `de` locales.
        locales.forEach(function(locale) {
            countryCode = locale.split("-")[0];

            if (!~list.indexOf(locale)) {
                list.push(locale);
            }

            if (I18n.fallbacks && countryCode && countryCode !== locale && !~list.indexOf(countryCode)) {
                list.push(countryCode);
            }
        });

        // No locales set? English it is.
        if (!locales.length) {
            locales.push("en");
        }

        return list;
    };

    // Hold pluralization rules.
    I18n.pluralization = {};

    // Return the pluralizer for a specific locale.
    // If no specify locale is found, then I18n's default will be used.
    I18n.pluralization.get = function(locale) {
        return this[locale] || this[I18n.locale] || this["default"];
    };

    // The default pluralizer rule.
    // It detects the `zero`, `one`, and `other` scopes.
    I18n.pluralization["default"] = function(count) {
        switch (count) {
            case 0: return ["zero", "other"];
            case 1: return ["one"];
            default: return ["other"];
        }
    };

    // Return current locale. If no locale has been set, then
    // the current locale will be the default locale.
    I18n.currentLocale = function() {
        return this.locale || this.defaultLocale;
    };

    // Check if value is different than undefined and null;
    I18n.isSet = isSet;

    // Find and process the translation using the provided scope and options.
    // This is used internally by some functions and should not be used as an
    // public API.
    I18n.lookup = function(scope, options) {
        options = options || {}

        var locales = this.locales.get(options.locale).slice()
            , requestedLocale = locales[0]
            , locale
            , scopes
            , fullScope
            , translations
        ;

        fullScope = this.getFullScope(scope, options);

        while (locales.length) {
            locale = locales.shift();
            scopes = fullScope.split(this.defaultSeparator);
            translations = this.translations[locale];

            if (!translations) {
                continue;
            }
            while (scopes.length) {
                translations = translations[scopes.shift()];

                if (translations === undefined || translations === null) {
                    break;
                }
            }

            if (translations !== undefined && translations !== null) {
                return translations;
            }
        }

        if (isSet(options.defaultValue)) {
            return lazyEvaluate(options.defaultValue, scope);
        }
    };

    // lookup pluralization rule key into translations
    I18n.pluralizationLookupWithoutFallback = function(count, locale, translations) {
        var pluralizer = this.pluralization.get(locale)
            , pluralizerKeys = pluralizer(count)
            , pluralizerKey
            , message;

        if (isObject(translations)) {
            while (pluralizerKeys.length) {
                pluralizerKey = pluralizerKeys.shift();
                if (isSet(translations[pluralizerKey])) {
                    message = translations[pluralizerKey];
                    break;
                }
            }
        }

        return message;
    };

    // Lookup dedicated to pluralization
    I18n.pluralizationLookup = function(count, scope, options) {
        options = options || {}
        var locales = this.locales.get(options.locale).slice()
            , requestedLocale = locales[0]
            , locale
            , scopes
            , translations
            , message
        ;
        scope = this.getFullScope(scope, options);

        while (locales.length) {
            locale = locales.shift();
            scopes = scope.split(this.defaultSeparator);
            translations = this.translations[locale];

            if (!translations) {
                continue;
            }

            while (scopes.length) {
                translations = translations[scopes.shift()];
                if (!isObject(translations)) {
                    break;
                }
                if (scopes.length == 0) {
                    message = this.pluralizationLookupWithoutFallback(count, locale, translations);
                }
            }
            if (message != null && message != undefined) {
                break;
            }
        }

        if (message == null || message == undefined) {
            if (isSet(options.defaultValue)) {
                if (isObject(options.defaultValue)) {
                    message = this.pluralizationLookupWithoutFallback(count, options.locale, options.defaultValue);
                } else {
                    message = options.defaultValue;
                }
                translations = options.defaultValue;
            }
        }

        return { message: message, translations: translations };
    };

    // Rails changed the way the meridian is stored.
    // It started with `date.meridian` returning an array,
    // then it switched to `time.am` and `time.pm`.
    // This function abstracts this difference and returns
    // the correct meridian or the default value when none is provided.
    I18n.meridian = function() {
        var time = this.lookup("time");
        var date = this.lookup("date");

        if (time && time.am && time.pm) {
            return [time.am, time.pm];
        } else if (date && date.meridian) {
            return date.meridian;
        } else {
            return DATE.meridian;
        }
    };

    // Merge serveral hash options, checking if value is set before
    // overwriting any value. The precedence is from left to right.
    //
    //     I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
    //     #=> {name: "John Doe", role: "user"}
    //
    I18n.prepareOptions = function() {
        var args = slice.call(arguments)
            , options = {}
            , subject
        ;

        while (args.length) {
            subject = args.shift();

            if (typeof(subject) != "object") {
                continue;
            }

            for (var attr in subject) {
                if (!subject.hasOwnProperty(attr)) {
                    continue;
                }

                if (isSet(options[attr])) {
                    continue;
                }

                options[attr] = subject[attr];
            }
        }

        return options;
    };

    // Generate a list of translation options for default fallbacks.
    // `defaultValue` is also deleted from options as it is returned as part of
    // the translationOptions array.
    I18n.createTranslationOptions = function(scope, options) {
        var translationOptions = [{scope: scope}];

        // Defaults should be an array of hashes containing either
        // fallback scopes or messages
        if (isSet(options.defaults)) {
            translationOptions = translationOptions.concat(options.defaults);
        }

        // Maintain support for defaultValue. Since it is always a message
        // insert it in to the translation options as such.
        if (isSet(options.defaultValue)) {
            translationOptions.push({ message: options.defaultValue });
        }

        return translationOptions;
    };

    // Translate the given scope with the provided options.
    I18n.translate = function(scope, options) {
        options = options || {}

        var translationOptions = this.createTranslationOptions(scope, options);

        var translation;

        var optionsWithoutDefault = this.prepareOptions(options)
        delete optionsWithoutDefault.defaultValue

        // Iterate through the translation options until a translation
        // or message is found.
        var translationFound =
            translationOptions.some(function(translationOption) {
                if (isSet(translationOption.scope)) {
                    translation = this.lookup(translationOption.scope, optionsWithoutDefault);
                } else if (isSet(translationOption.message)) {
                    translation = lazyEvaluate(translationOption.message, scope);
                }

                if (translation !== undefined && translation !== null) {
                    return true;
                }
            }, this);

        if (!translationFound) {
            return this.missingTranslation(scope, options);
        }

        if (typeof(translation) === "string") {
            translation = this.interpolate(translation, options);
        } else if (isObject(translation) && isSet(options.count)) {
            translation = this.pluralize(options.count, scope, options);
        }

        return translation;
    };

    // This function interpolates the all variables in the given message.
    I18n.interpolate = function(message, options) {
        options = options || {}
        var matches = message.match(this.placeholder)
            , placeholder
            , value
            , name
            , regex
        ;

        if (!matches) {
            return message;
        }

        var value;

        while (matches.length) {
            placeholder = matches.shift();
            name = placeholder.replace(this.placeholder, "$1");

            if (isSet(options[name])) {
                value = options[name].toString().replace(/\$/gm, "_#$#_");
            } else if (name in options) {
                value = this.nullPlaceholder(placeholder, message, options);
            } else {
                value = this.missingPlaceholder(placeholder, message, options);
            }

            regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
            message = message.replace(regex, value);
        }

        return message.replace(/_#\$#_/g, "$");
    };

    // Pluralize the given scope using the `count` value.
    // The pluralized translation may have other placeholders,
    // which will be retrieved from `options`.
    I18n.pluralize = function(count, scope, options) {
        options = this.prepareOptions({count: String(count)}, options)
        var pluralizer, message, result;

        result = this.pluralizationLookup(count, scope, options);
        if (result.translations == undefined || result.translations == null) {
            return this.missingTranslation(scope, options);
        }

        if (result.message != undefined && result.message != null) {
            return this.interpolate(result.message, options);
        }
        else {
            pluralizer = this.pluralization.get(options.locale);
            return this.missingTranslation(scope + '.' + pluralizer(count)[0], options);
        }
    };

    // Return a missing translation message for the given parameters.
    I18n.missingTranslation = function(scope, options) {
        //guess intended string
        if(this.missingBehaviour == 'guess'){
            //get only the last portion of the scope
            var s = scope.split('.').slice(-1)[0];
            //replace underscore with space && camelcase with space and lowercase letter
            return (this.missingTranslationPrefix.length > 0 ? this.missingTranslationPrefix : '') +
                s.replace('_',' ').replace(/([a-z])([A-Z])/g,
                    function(match, p1, p2) {return p1 + ' ' + p2.toLowerCase()} );
        }

        var localeForTranslation = (options != null && options.locale != null) ? options.locale : this.currentLocale();
        var fullScope           = this.getFullScope(scope, options);
        var fullScopeWithLocale = [localeForTranslation, fullScope].join(this.defaultSeparator);

        return '[missing "' + fullScopeWithLocale + '" translation]';
    };

    // Return a missing placeholder message for given parameters
    I18n.missingPlaceholder = function(placeholder, message, options) {
        return "[missing " + placeholder + " value]";
    };

    I18n.nullPlaceholder = function() {
        return I18n.missingPlaceholder.apply(I18n, arguments);
    };

    // Format number using localization rules.
    // The options will be retrieved from the `number.format` scope.
    // If this isn't present, then the following options will be used:
    //
    // - `precision`: `3`
    // - `separator`: `"."`
    // - `delimiter`: `","`
    // - `strip_insignificant_zeros`: `false`
    //
    // You can also override these options by providing the `options` argument.
    //
    I18n.toNumber = function(number, options) {
        options = this.prepareOptions(
            options
            , this.lookup("number.format")
            , NUMBER_FORMAT
        );

        var negative = number < 0
            , string = toFixed(Math.abs(number), options.precision).toString()
            , parts = string.split(".")
            , precision
            , buffer = []
            , formattedNumber
            , format = options.format || "%n"
            , sign = negative ? "-" : ""
        ;

        number = parts[0];
        precision = parts[1];

        while (number.length > 0) {
            buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
            number = number.substr(0, number.length -3);
        }

        formattedNumber = buffer.join(options.delimiter);

        if (options.strip_insignificant_zeros && precision) {
            precision = precision.replace(/0+$/, "");
        }

        if (options.precision > 0 && precision) {
            formattedNumber += options.separator + precision;
        }

        if (options.sign_first) {
            format = "%s" + format;
        }
        else {
            format = format.replace("%n", "%s%n");
        }

        formattedNumber = format
            .replace("%u", options.unit)
            .replace("%n", formattedNumber)
            .replace("%s", sign)
        ;

        return formattedNumber;
    };

    // Format currency with localization rules.
    // The options will be retrieved from the `number.currency.format` and
    // `number.format` scopes, in that order.
    //
    // Any missing option will be retrieved from the `I18n.toNumber` defaults and
    // the following options:
    //
    // - `unit`: `"$"`
    // - `precision`: `2`
    // - `format`: `"%u%n"`
    // - `delimiter`: `","`
    // - `separator`: `"."`
    //
    // You can also override these options by providing the `options` argument.
    //
    I18n.toCurrency = function(number, options) {
        options = this.prepareOptions(
            options
            , this.lookup("number.currency.format")
            , this.lookup("number.format")
            , CURRENCY_FORMAT
        );

        return this.toNumber(number, options);
    };

    // Localize several values.
    // You can provide the following scopes: `currency`, `number`, or `percentage`.
    // If you provide a scope that matches the `/^(date|time)/` regular expression
    // then the `value` will be converted by using the `I18n.toTime` function.
    //
    // It will default to the value's `toString` function.
    //
    I18n.localize = function(scope, value, options) {
        options || (options = {});

        switch (scope) {
            case "currency":
                return this.toCurrency(value);
            case "number":
                scope = this.lookup("number.format");
                return this.toNumber(value, scope);
            case "percentage":
                return this.toPercentage(value);
            default:
                var localizedValue;

                if (scope.match(/^(date|time)/)) {
                    localizedValue = this.toTime(scope, value);
                } else {
                    localizedValue = value.toString();
                }

                return this.interpolate(localizedValue, options);
        }
    };

    // Parse a given `date` string into a JavaScript Date object.
    // This function is time zone aware.
    //
    // The following string formats are recognized:
    //
    //    yyyy-mm-dd
    //    yyyy-mm-dd[ T]hh:mm::ss
    //    yyyy-mm-dd[ T]hh:mm::ss
    //    yyyy-mm-dd[ T]hh:mm::ssZ
    //    yyyy-mm-dd[ T]hh:mm::ss+0000
    //    yyyy-mm-dd[ T]hh:mm::ss+00:00
    //    yyyy-mm-dd[ T]hh:mm::ss.123Z
    //
    I18n.parseDate = function(date) {
        var matches, convertedDate, fraction;
        // we have a date, so just return it.
        if (typeof(date) == "object") {
            return date;
        };

        //matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/); // Original source
        matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z)?/); // Modified source. See EGE-74812, although newer I18n.js version may have fixed this...

        if (matches) {
            for (var i = 1; i <= 6; i++) {
                matches[i] = parseInt(matches[i], 10) || 0;
            }

            // month starts on 0
            matches[2] -= 1;

            fraction = matches[7] ? 1000 * ("0" + matches[7]) : null;

            if (matches[8]) {
                convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction));
            } else {
                convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], fraction);
            }
        } else if (typeof(date) == "number") {
            // UNIX timestamp
            convertedDate = new Date();
            convertedDate.setTime(date);
        } else if (date.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/)) {
            // This format `Wed Jul 20 13:03:39 +0000 2011` is parsed by
            // webkit/firefox, but not by IE, so we must parse it manually.
            convertedDate = new Date();
            convertedDate.setTime(Date.parse([
                RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$6, RegExp.$4, RegExp.$5
            ].join(" ")));
        } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
            // a valid javascript format with timezone info
            convertedDate = new Date();
            convertedDate.setTime(Date.parse(date));
        } else {
            // an arbitrary javascript string
            convertedDate = new Date();
            convertedDate.setTime(Date.parse(date));
        }

        return convertedDate;
    };

    // Formats time according to the directives in the given format string.
    // The directives begins with a percent (%) character. Any text not listed as a
    // directive will be passed through to the output string.
    //
    // The accepted formats are:
    //
    //     %a  - The abbreviated weekday name (Sun)
    //     %A  - The full weekday name (Sunday)
    //     %b  - The abbreviated month name (Jan)
    //     %B  - The full month name (January)
    //     %c  - The preferred local date and time representation
    //     %d  - Day of the month (01..31)
    //     %-d - Day of the month (1..31)
    //     %H  - Hour of the day, 24-hour clock (00..23)
    //     %-H - Hour of the day, 24-hour clock (0..23)
    //     %I  - Hour of the day, 12-hour clock (01..12)
    //     %-I - Hour of the day, 12-hour clock (1..12)
    //     %m  - Month of the year (01..12)
    //     %-m - Month of the year (1..12)
    //     %M  - Minute of the hour (00..59)
    //     %-M - Minute of the hour (0..59)
    //     %p  - Meridian indicator (AM  or  PM)
    //     %S  - Second of the minute (00..60)
    //     %-S - Second of the minute (0..60)
    //     %w  - Day of the week (Sunday is 0, 0..6)
    //     %y  - Year without a century (00..99)
    //     %-y - Year without a century (0..99)
    //     %Y  - Year with century
    //     %z  - Timezone offset (+0545)
    //
    I18n.strftime = function(date, format) {
        var options = this.lookup("date")
            , meridianOptions = I18n.meridian()
        ;

        if (!options) {
            options = {};
        }

        options = this.prepareOptions(options, DATE);

        if (isNaN(date.getTime())) {
            throw new Error('I18n.strftime() requires a valid date object, but received an invalid date.');
        }

        var weekDay = date.getDay()
            , day = date.getDate()
            , year = date.getFullYear()
            , month = date.getMonth() + 1
            , hour = date.getHours()
            , hour12 = hour
            , meridian = hour > 11 ? 1 : 0
            , secs = date.getSeconds()
            , mins = date.getMinutes()
            , offset = date.getTimezoneOffset()
            , absOffsetHours = Math.floor(Math.abs(offset / 60))
            , absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60)
            , timezoneoffset = (offset > 0 ? "-" : "+") +
            (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) +
            (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
        ;

        if (hour12 > 12) {
            hour12 = hour12 - 12;
        } else if (hour12 === 0) {
            hour12 = 12;
        }

        format = format.replace("%a", options.abbr_day_names[weekDay]);
        format = format.replace("%A", options.day_names[weekDay]);
        format = format.replace("%b", options.abbr_month_names[month]);
        format = format.replace("%B", options.month_names[month]);
        format = format.replace("%d", padding(day));
        format = format.replace("%e", day);
        format = format.replace("%-d", day);
        format = format.replace("%H", padding(hour));
        format = format.replace("%-H", hour);
        format = format.replace("%I", padding(hour12));
        format = format.replace("%-I", hour12);
        format = format.replace("%m", padding(month));
        format = format.replace("%-m", month);
        format = format.replace("%M", padding(mins));
        format = format.replace("%-M", mins);
        format = format.replace("%p", meridianOptions[meridian]);
        format = format.replace("%S", padding(secs));
        format = format.replace("%-S", secs);
        format = format.replace("%w", weekDay);
        format = format.replace("%y", padding(year));
        format = format.replace("%-y", padding(year).replace(/^0+/, ""));
        format = format.replace("%Y", year);
        format = format.replace("%z", timezoneoffset);

        return format;
    };

    // Convert the given dateString into a formatted date.
    I18n.toTime = function(scope, dateString) {
        var date = this.parseDate(dateString)
            , format = this.lookup(scope)
        ;

        if (date.toString().match(/invalid/i)) {
            return date.toString();
        }

        if (!format) {
            return date.toString();
        }

        return this.strftime(date, format);
    };

    // Convert a number into a formatted percentage value.
    I18n.toPercentage = function(number, options) {
        options = this.prepareOptions(
            options
            , this.lookup("number.percentage.format")
            , this.lookup("number.format")
            , PERCENTAGE_FORMAT
        );

        return this.toNumber(number, options);
    };

    // Convert a number into a readable size representation.
    I18n.toHumanSize = function(number, options) {
        var kb = 1024
            , size = number
            , iterations = 0
            , unit
            , precision
        ;

        while (size >= kb && iterations < 4) {
            size = size / kb;
            iterations += 1;
        }

        if (iterations === 0) {
            unit = this.t("number.human.storage_units.units.byte", {count: size});
            precision = 0;
        } else {
            unit = this.t("number.human.storage_units.units." + SIZE_UNITS[iterations]);
            precision = (size - Math.floor(size) === 0) ? 0 : 1;
        }

        options = this.prepareOptions(
            options
            , {unit: unit, precision: precision, format: "%n%u", delimiter: ""}
        );

        return this.toNumber(size, options);
    };

    I18n.getFullScope = function(scope, options) {
        options = options || {}

        // Deal with the scope as an array.
        if (isArray(scope)) {
            scope = scope.join(this.defaultSeparator);
        }

        // Deal with the scope option provided through the second argument.
        //
        //    I18n.t('hello', {scope: 'greetings'});
        //
        if (options.scope) {
            scope = [options.scope, scope].join(this.defaultSeparator);
        }

        return scope;
    };
    /**
     * Merge obj1 with obj2 (shallow merge), without modifying inputs
     * @param {Object} obj1
     * @param {Object} obj2
     * @returns {Object} Merged values of obj1 and obj2
     *
     * In order to support ES3, `Object.prototype.hasOwnProperty.call` is used
     * Idea is from:
     * https://stackoverflow.com/questions/8157700/object-has-no-hasownproperty-method-i-e-its-undefined-ie8
     */
    I18n.extend = function ( obj1, obj2 ) {
        if (typeof(obj1) === "undefined" && typeof(obj2) === "undefined") {
            return {};
        }
        return merge(obj1, obj2);
    };

    // Set aliases, so we can save some typing.
    I18n.t = I18n.translate;
    I18n.l = I18n.localize;
    I18n.p = I18n.pluralize;

    return I18n;
}));
//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

// This is done to register the method called with moment()
// without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    var some$1 = some;

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

// Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

// compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var keys$1 = keys;

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

// MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

// format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    var indexOf$1 = indexOf;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

// FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

// ALIASES

    addUnitAlias('month', 'M');

// PRIORITY

    addUnitPriority('month', 8);

// PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

// LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

// MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

// FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

    addUnitAlias('year', 'y');

// PRIORITIES

    addUnitPriority('year', 1);

// PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

// HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

// HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

// MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

// start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

// FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

// PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

// PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

// HELPERS

// LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

// MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

// FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

// PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

// PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

// HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

// LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

// MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

// FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

// ALIASES

    addUnitAlias('hour', 'h');

// PRIORITY
    addUnitPriority('hour', 13);

// PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

// LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
    var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

// internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    if (!localeFamilies[config.parentLocale]) {
                        localeFamilies[config.parentLocale] = [];
                    }
                    localeFamilies[config.parentLocale].push({
                        name: name,
                        config: config
                    });
                    return null;
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

// returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys$1(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                    a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                        a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                                    a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                                        -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

// iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
    function configFromRFC2822(config) {
        var string, match, dayFormat,
            dateFormat, timeFormat, tzFormat;
        var timezones = {
            ' GMT': ' +0000',
            ' EDT': ' -0400',
            ' EST': ' -0500',
            ' CDT': ' -0500',
            ' CST': ' -0600',
            ' MDT': ' -0600',
            ' MST': ' -0700',
            ' PDT': ' -0700',
            ' PST': ' -0800'
        };
        var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
        var timezone, timezoneIndex;

        string = config._i
            .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
            .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
            .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
        match = basicRfcRegex.exec(string);

        if (match) {
            dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
            dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
            timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            if (match[1]) { // day of week given
                var momentDate = new Date(match[2]);
                var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

                if (match[1].substr(0,3) !== momentDay) {
                    getParsingFlags(config).weekdayMismatch = true;
                    config._isValid = false;
                    return;
                }
            }

            switch (match[5].length) {
                case 2: // military
                    if (timezoneIndex === 0) {
                        timezone = ' +0000';
                    } else {
                        timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                        timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                            (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                    }
                    break;
                case 4: // Zone
                    timezone = timezones[match[5]];
                    break;
                default: // UT or +/-9999
                    timezone = timezones[' GMT'];
            }
            match[5] = timezone;
            config._i = match.splice(1).join('');
            tzFormat = ' ZZ';
            config._f = dayFormat + dateFormat + timeFormat + tzFormat;
            configFromStringAndFormat(config);
            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

// date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

// Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

// constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

// date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

// date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

// TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

// FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

// PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
            0 :
            parts[0] === '+' ? minutes : -minutes;
    }

// Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

// ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

// TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                    'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                        diff < 2 ? 'nextDay' :
                            diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                    units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                        units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString() {
        if (!this.isValid()) {
            return null;
        }
        var m = this.clone().utc();
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            return this.toDate().toISOString();
        }
        return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
            createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
            createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
            /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
            /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
            /* falls through */
            case 'hour':
                this.minutes(0);
            /* falls through */
            case 'minute':
                this.seconds(0);
            /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

// FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


// PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

// MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

// FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

    addUnitAlias('quarter', 'Q');

// PRIORITY

    addUnitPriority('quarter', 7);

// PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

// MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

// FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

    addUnitAlias('date', 'D');

// PRIOROITY
    addUnitPriority('date', 9);

// PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
            (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
            locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

// MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

    addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
    addUnitPriority('dayOfYear', 4);

// PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

// HELPERS

// MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

// FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

    addUnitAlias('minute', 'm');

// PRIORITY

    addUnitPriority('minute', 14);

// PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

    addUnitAlias('second', 's');

// PRIORITY

    addUnitPriority('second', 15);

// PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

// MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


// ALIASES

    addUnitAlias('millisecond', 'ms');

// PRIORITY

    addUnitPriority('millisecond', 16);

// PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
// MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;

// Year
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;

// Week Year
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;

// Quarter
    proto.quarter = proto.quarters = getSetQuarter;

// Month
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;

// Week
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;

// Day
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;

// Hour
    proto.hour = proto.hours = getSetHour;

// Minute
    proto.minute = proto.minutes = getSetMinute;

// Second
    proto.second = proto.seconds = getSetSecond;

// Millisecond
    proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;

// Timezone
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;

// Deprecations
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

// Month
    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;

// Week
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                        (b === 2) ? 'nd' :
                            (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

// Side effect imports
    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

// supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

// supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

// TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

// This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

// This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

// Deprecations
    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

// Side effect imports

// FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

// PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

// Side effect imports


    hooks.version = '2.18.1';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    return hooks;

})));
// The moment locale does not get set as i18n does and so we are doing it here.
moment.locale(EG.currentLocale);
/*
 date.js imposes some limitations on 'date.format'. It only handles "yymmdd" and "ddmmyy" and mmddyy", so no "yyyymmdd", "mmddyyyy", or other variations.
 i18n.js imposes a limitation on currency codes. It allows for a 'unit', which you can put the symbol or code in, but no support for both. I18n.js also doesn't normally support "abbr_day_names_short", I modified the library to support it.
 calendar.js and i18n.js handle dates a little differently. This is why 'month_name' does NOT start with 0.
 */
I18n.translations = I18n.translations || {};

//Czech
I18n.translations['cs'] = $.extend(true, I18n.translations['cs'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d.%-m.%Y",
            "short": "%-d.%-m.%Y",
            "medium": "%-d.%-m.%Y",
            "long": "%-d. %B %Y",
            "full": "%A, %-d. %B %Y"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
        "abbr_day_names": ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        "abbr_day_names_short": ["N", "P", "Ú", "S", "Č", "P", "S"],
        "month_names": [0, "leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
        "abbr_month_names": [0, "led.", "ún.", "břez.", "dub.", "květ.", "červ.", "červen.", "srp.", "zár.", "ríj.", "list.", "pros."],
        "abbr_month_names_short": [0, "L", "Ú", "B", "D", "K", "C", "J", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "Kč",
                "code": "CZK",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Danish
I18n.translations['da'] = $.extend(true, I18n.translations['da'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%It %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d-%m-%Y",
            "short": "%d-%m-%Y",
            "medium": "%d-%m-%Y",
            "long": "%-d. %B %Y",
            "full": "%-d. %B %Y"
        },
        "format": "ddmmyy",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"],
        "abbr_day_names": ["sø", "ma", "ti", "on", "to", "fr", "lø"],
        "abbr_day_names_short": ["S", "M", "T", "o", "T", "F", "L"],
        "month_names": [0, "januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
        "abbr_month_names": [0, "jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sept", "okt", "nov", "dec"],
        "abbr_month_names_short": [0, "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "kr",
                "code": "DKK",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});

//German - Germany
I18n.translations['de'] = $.extend(true, I18n.translations['de'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d.%m.%Y",
            "short": "%d.%m.%Y",
            "medium": "%d.%m.%Y",
            "long": "%-d. %B %Y",
            "full": "%A, %-d. %B %Y"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "abbr_day_names": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        "abbr_day_names_short": ["S", "M", "D", "M", "D", "F", "S"],
        "month_names": [0, "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        "abbr_month_names": [0, "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dez"],
        "abbr_month_names_short": [0, "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//German - Austria
I18n.translations['de-AT'] = $.extend(true, I18n.translations['de-AT'], I18n.translations['de']); // Pick up all the properties from default 'de'
I18n.translations['de-AT'] = $.extend(true, I18n.translations['de-AT'], { // Override what is necessary
    "number": {
        "currency": {
            "format": {
                "format": "%u %n"
            }
        }
    }
});

//German - Switzerland
I18n.translations['de-CH'] = $.extend(true, I18n.translations['de-CH'], I18n.translations['de']); // Pick up all the properties from default 'de'
I18n.translations['de-CH'] = $.extend(true, I18n.translations['de-CH'], { // Override what is necessary
    "number": {
        "format": {
            "separator": ".",
            "delimiter": "'"
        },
        "currency": {
            "format": {
                "unit": "SFr.",
                "code": "CHF",
                "format": "%u %n"
            }
        }
    }
});

//English - Global default actually similar to 'en_GB' since most english-speaking countries apply UK formatting
I18n.translations['en'] = $.extend(true, I18n.translations['en'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d-%b-%Y",
            "short": "%d/%m/%Y",
            "medium": "%d-%b-%Y",
            "long": "%d %B %Y",
            "full": "%A, %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "abbr_day_names": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "abbr_day_names_short": ["S", "M", "T", "W", "T", "F", "S"],
        "month_names": [0, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "abbr_month_names": [0, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        "abbr_month_names_short": [0, "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "£",
                "code": "GBP",
                "precision": 2,
                "format": "%u%n"
            }
        }
    }
});

//English - Australia
I18n.translations['en-AU'] = $.extend(true, I18n.translations['en-AU'], I18n.translations['en']); // Pick up all the properties from default 'en'
I18n.translations['en-AU'] = $.extend(true, I18n.translations['en-AU'], { // Override what is necessary
    "time": {
        "formats": {
            "default": "%-I:%M %p"
        }
    }
});

//English - Canada
I18n.translations['en-CA'] = $.extend(true, I18n.translations['en-CA'], I18n.translations['en']); // Pick up all the properties from default 'en'
I18n.translations['en-CA'] = $.extend(true, I18n.translations['en-CA'], { // Override what is necessary
    "time": {
        "patterns": {
            "duration": "%-Ih %Mm"
        },
        "formats": {
            "default": "%-I:%M %p"
        }
    },
    "date": {
        "formats": {
            "default": "%-d-%b-%Y",
            "medium": "%-d-%b-%Y",
            "long": "%B %-d, %Y",
            "full": "%A, %B %-d, %Y"
        },
        "start_of_week": 0
    },
    "number": {
        "currency": {
            "format": {
                "unit": "$",
                "code": "CAD"
            }
        }
    }
});

//English - Ireland
I18n.translations['en-IE'] = $.extend(true, I18n.translations['en-IE'], I18n.translations['en']); // Pick up all the properties from default 'en'
I18n.translations['en-IE'] = $.extend(true, I18n.translations['en-IE'], { // Override what is necessary
    "date": {
        "formats": {
            "full": "%d %B %Y"
        }
    },
    "number": {
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR"
            }
        }
    }
});

//English - India
I18n.translations['en-IN'] = $.extend(true, I18n.translations['en-IN'], I18n.translations['en']); // Pick up all the properties from default 'en'
I18n.translations['en-IN'] = $.extend(true, I18n.translations['en-IN'], { // Override what is necessary
    "time": {
        "formats": {
            "default": "%-I:%M %p"
        }
    },
    "date": {
        "formats": {
            "default": "%-d %b, %Y",
            "short": "%-d/%-m/%Y",
            "medium": "%-d %b, %Y",
            "long": "%-d %B, %Y",
            "full": "%A, %-d %B, %Y"
        }
    },
    "number": {
        "currency": {
            "format": {
                "unit": "Rs.",
                "code": "INR"
            }
        }
    }
});

//English - US
I18n.translations['en-US'] = $.extend(true, I18n.translations['en-US'], I18n.translations['en']); // Pick up all the properties from default 'en'
I18n.translations['en-US'] = $.extend(true, I18n.translations['en-US'], { // Override what is necessary
    "time": {
        "patterns": {
            "duration": "%-Ih %Mm"
        },
        "formats": {
            "default": "%-I:%M %p"
        }
    },
    "date": {
        "formats": {
            "default": "%b %-d, %Y",
            "short": "%-m/%-d/%Y",
            "medium": "%b %-d, %Y",
            "long": "%B %-d, %Y",
            "full": "%A, %B %-d, %Y"
        },
        "format": "mmddyy",
        "separator": "/",
        "start_of_week": 0
    },
    "number": {
        "currency": {
            "format": {
                "unit": "$",
                "code": "USD",
                "format": "%u%n"
            }
        }
    }
});

//Spanish - Spain (Traditional)
I18n.translations['es'] = $.extend(true, I18n.translations['es'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d-%b-%Y",
            "short": "%-d/%m/%Y",
            "medium": "%d-%b-%Y",
            "long": "%-d de %B de %Y",
            "full": "%A %-d de %B de %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["domingo","lunes","martes", "miércoles", "jueves", "viernes","sábado"],
        "abbr_day_names": ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
        "abbr_day_names_short": ["D", "L", "M", "M", "J", "V", "S"],
        "month_names": [0, "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        "abbr_month_names": [0, "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
        "abbr_month_names_short": [0, "E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Spanish - Argentina
I18n.translations['es-AR'] = $.extend(true, I18n.translations['es-AR'], I18n.translations['es']); // Pick up all the properties from default 'es'
I18n.translations['es-AR'] = $.extend(true, I18n.translations['es-AR'], { // Override what is necessary
    "date": {
        "formats": {
            "default": "%d/%m/%Y",
            "short": "%d/%m/%Y",
            "medium": "%d/%m/%Y"
        },
        "abbr_day_names": ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"]
    },
    "number": {
        "currency": {
            "format": {
                "unit": "$",
                "code": "ARS",
                "format": "%u %n"
            }
        }
    }
});

//Spanish - Mexico
I18n.translations['es-MX'] = $.extend(true, I18n.translations['es-MX'], I18n.translations['es']); // Pick up all the properties from default 'es'
I18n.translations['es-MX'] = $.extend(true, I18n.translations['es-MX'], { // Override what is necessary
    "time": {
        "patterns": {
            "duration": "%-Ih %Mm"
        },
        "formats": {
            "default": "%I:%M %p"
        }
    },
    "date": {
        "formats": {
            "default": "%-d/%m/%Y",
            "medium": "%-d/%m/%Y"
        }
    },
    "number": {
        "format": {
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "$",
                "code": "MXN",
                "format": "%u %n"
            }
        }
    }
});

//Finnish
I18n.translations['fi'] = $.extend(true, I18n.translations['fi'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d.%-m.%Y",
            "short": "%-d.%-m.%Y",
            "medium": "%-d.%-m.%Y",
            "long": "%-d. %B %Y",
            "full": "%-d. %B %Y"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviiko", "Torstai", "Perjantai", "Lauantai"],
        "abbr_day_names": ["su", "ma", "ti", "ke", "to", "pe", "la"],
        "abbr_day_names_short": ["S", "M", "T", "K", "T", "P", "L"],
        "month_names": [0, "tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
        "abbr_month_names": [0, "tammi", "helmi", "maalis", "huhti", "touko", "kesä", "heinä", "elo", "syys", "loka", "marras", "joulu"],
        "abbr_month_names_short": [0, "T", "H", "M", "H", "T", "K", "H", "E", "S", "L", "M", "J"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//French - France
I18n.translations['fr'] = $.extend(true, I18n.translations['fr'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d %b %Y",
            "short": "%d/%m/%Y",
            "medium": "%-d %b %Y",
            "long": "%-d %B %Y",
            "full": "%A %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
        "abbr_day_names": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
        "abbr_day_names_short": ["D", "L", "M", "M", "J", "V", "S"],
        "month_names": [0, "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
        "abbr_month_names": [0, "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
        "abbr_month_names_short": [0, "j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
        "order": [":day", ":month", ":year"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//French - Belgium
I18n.translations['fr-BE'] = $.extend(true, I18n.translations['fr-BE'], I18n.translations['fr']); // Pick up all the properties from default 'fr'
I18n.translations['fr-BE'] = $.extend(true, I18n.translations['fr-BE'], { // Override what is necessary
    "time": {
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "formats": {
            "default": "%b-%-d-%Y",
            "short": "%-d/%-m/%Y",
            "medium": "%b-%-d-%Y",
            "long": "%B %-d %Y",
            "full": "%A, %B %-d %Y"
        },
        "start_of_week": 1
    }
});

//French - Canada
I18n.translations['fr-CA'] = $.extend(true, I18n.translations['fr-CA'], I18n.translations['fr']); // Pick up all the properties from default 'fr'
I18n.translations['fr-CA'] = $.extend(true, I18n.translations['fr-CA'], { // Override what is necessary
    "date": {
        "formats": {
            "default": "%Y-%m-%d",
            "short": "%Y-%m-%d",
            "medium": "%Y-%m-%d"
        },
        "start_of_week": 0,
        "format": "yymmdd",
        "separator": "-"
    },
    "number": {
        "currency": {
            "format": {
                "unit": "$",
                "code": "CAD"
            }
        }
    }
});

//French - Switzerland
I18n.translations['fr-CH'] = $.extend(true, I18n.translations['fr-CH'], I18n.translations['fr']); // Pick up all the properties from default 'fr'
I18n.translations['fr-CH'] = $.extend(true, I18n.translations['fr-CH'], { // Override what is necessary
    "date": {
        "formats": {
            "short": "%d.%m.%Y",
            "long": "%-d. %B %Y",
            "full": "%A, %-d. %B %Y"
        }
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": "'"
        },
        "currency": {
            "format": {
                "unit": "SFr.",
                "code": "CHF",
                "format": "%u %n"
            }
        }
    }
});

//Italian - Italy
I18n.translations['it'] = $.extend(true, I18n.translations['it'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default":"%-H.%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d-%b-%Y",
            "short": "%d/%m/%Y",
            "medium": "%-d-%b-%Y",
            "long": "%-d %B %Y",
            "full": "%A %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
        "abbr_day_names": ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
        "abbr_day_names_short": ["d", "l", "m", "m", "g", "v", "s"],
        "month_names": [0, "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
        "abbr_month_names": [0, "gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
        "abbr_month_names_short": [0, "g", "f", "m", "a", "m", "g", "l", "a", "s", "o", "n", "d"],
        "order": [":day", ":month", ":year"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});

//Italian - Switzerland
I18n.translations['it-CH'] = $.extend(true, I18n.translations['it-CH'], I18n.translations['it']); // Pick up all the properties from default 'it'
I18n.translations['it-CH'] = $.extend(true, I18n.translations['it-CH'], { // Override what is necessary
    "time": {
        "formats": {
            "default":"%H:%M"
        }
    },
    "date": {
        "formats": {
            "short": "%d.%m.%Y",
            "long": "%-d. %B %Y",
            "full": "%A, %-d. %B %Y"
        }
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": "'"
        },
        "currency": {
            "format": {
                "unit": "SFr.",
                "code": "CHF"
            }
        }
    }
});

//Japanese
I18n.translations['ja'] = $.extend(true, I18n.translations['ja'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%Y/%m/%d",
            "short": "%Y/%m/%d",
            "medium": "%Y/%m/%d",
            "long": "%Y/%m/%d",
            "full": "%Y年%-m月%-d日"
        },
        "format": "yymmdd",
        "separator": "/",
        "start_of_week": 0,
        "day_names": ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
        "abbr_day_names": ["日", "月", "火", "水", "木", "金", "土"],
        "abbr_day_names_short": ["日", "月", "火", "水", "木", "金", "土"],
        "month_names": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "abbr_month_names": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "abbr_month_names_short": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "meridian": ["午前", "午後"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "¥",
                "code": "JPY",
                "precision": 0,
                "format": "%u %n"
            }
        }
    }
});


//Korean - Korea
I18n.translations['ko'] = $.extend(true, I18n.translations['ko'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%p %-I:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%Y. %-m. %-d",
            "short": "%Y. %-m. %-d",
            "medium": "%Y. %-m. %-d",
            "long": "%Y년 %-m월 %-d일 (%a)",
            "full": "%Y년 %-m월 %-d일 %A"
        },
        "format": "yymmdd",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        "abbr_day_names": ["일", "월", "화", "수", "목", "금", "토"],
        "abbr_day_names_short": ["일", "월", "화", "수", "목", "금", "토"],
        "month_names": [0, "일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"],
        "abbr_month_names": [0, "일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"],
        "abbr_month_names_short": [0, "일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"],
        "meridian": ["오전", "오후"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "₩",
                "code": "KRW",
                "precision": 0,
                "format": "%u %n"
            }
        }
    }
});

//Malay - Malaysia
I18n.translations['ms'] = $.extend(true, I18n.translations['ms'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-I:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d %B %Y",
            "short": "%d/%m/%Y",
            "medium": "%d %B %Y",
            "long": "%d %B %Y",
            "full": "%A %d %b %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
        "abbr_day_names": ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
        "abbr_day_names_short": ["1", "2", "3", "4", "5", "6", "7"],
        "month_names": [0, "Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
        "abbr_month_names": [0, "Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"],
        "abbr_month_names_short": [0, "J", "F", "M", "A", "M", "J", "J", "O", "S", "O", "N", "D"],
        "meridian": ["AM", "PM"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "RM",
                "code": "MYR",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});


//Norwegian Bokmål (Norway)
I18n.translations['nb'] = $.extend(true, I18n.translations['nb'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d.%b.%Y",
            "short": "%d.%m.%Y",
            "medium": "%d.%b.%Y",
            "long": "%-d. %B %Y",
            "full": "%-d. %B %Y"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"],
        "abbr_day_names": ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."],
        "abbr_day_names_short": ["s", "m", "t", "o", "t", "f", "l"],
        "month_names": [0, "januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
        "abbr_month_names": [0, "jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"],
        "abbr_month_names_short": [0, "j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
        "meridian": ["AM", "PM"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "kr",
                "code": "NOK",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});

//Dutch (Netherlands)
I18n.translations['nl'] = $.extend(true, I18n.translations['nl'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d-%b-%Y",
            "short": "%-d-%-m-%Y",
            "medium": "%-d-%b-%Y",
            "long": "%-d %B %Y",
            "full": "%A %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["zondag","maandag","dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
        "abbr_day_names": ["zo", "ma", "di", "wo", "do", "vr", "za"],
        "abbr_day_names_short": ["z", "m", "d", "w", "d", "v", "z"],
        "month_names": [0, "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        "abbr_month_names": [0, "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
        "abbr_month_names_short": [0, "j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});

//Dutch (Belgium)
I18n.translations['nl-BE'] = $.extend(true, I18n.translations['nl-BE'], I18n.translations['nl']); // Pick up all the properties from default 'nl'
I18n.translations['nl-BE'] = $.extend(true, I18n.translations['nl-BE'], { // Override what is necessary
    "date": {
        "formats": {
            "short": "%-d/%m/%Y"
        }
    },
    "number": {
        "format": {
            "delimiter": " "
        },
        "currency": {
            "format": {
                "format": "%n %u"
            }
        }
    }
});

//Portuguese (Portugal)
I18n.translations['pt'] = $.extend(true, I18n.translations['pt'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d/%b/%Y",
            "short": "%d-%m-%Y",
            "medium": "%-d/%b/%Y",
            "long": "%-d de %B de %Y",
            "full": "%A, %-d de %B de %Y"
        },
        "format": "ddmmyy",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["Domingo","Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        "abbr_day_names": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        "abbr_day_names_short": ["D", "S", "T", "Q", "Q", "S", "S"],
        "month_names": [0, "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        "abbr_month_names": [0, "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        "abbr_month_names_short": [0, "j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "€",
                "code": "EUR",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Polish - Poland
I18n.translations['pl'] = $.extend(true, I18n.translations['pl'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%Y-%m-%d",
            "short": "%d.%m.%Y",
            "medium": "%Y-%m-%d",
            "long": "%-d %B %Y",
            "full": "%A, %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"],
        "abbr_day_names": ["ni", "po", "wt", "śr", "cz", "pi", "so"],
        "abbr_day_names_short": ["N", "P", "W", "Ś", "C", "P", "S"],      
        "month_names": [0, "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
        "abbr_month_names": [0, "stycz.", "luty", "mar.", "kwiec.", "maj", "czerw.", "lip.", "sierp.", "wrzes.", "pazdz.", "listop.", "grudz."],
        "abbr_month_names_short": [0, "S", "L", "M", "K", "M", "C", "L", "S", "W", "P", "L", "G"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "zł",
                "code": "PLN",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Swedish - Sweden
I18n.translations['sv'] = $.extend(true, I18n.translations['sv'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%It %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%Y-%b-%d",
            "short": "%Y-%m-%d",
            "medium": "%Y-%b-%d",
            "long": "den %-d %B %Y",
            "full": "den %-d %B %Y"
        },
        "format": "yymmdd",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
        "abbr_day_names": ["sön", "mån", "tis", "ons", "tors", "fre", "lör"],
        "abbr_day_names_short": ["s", "m", "t", "o", "t", "f", "l"],
        "month_names": [0, "januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
        "abbr_month_names": [0, "jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sept", "okt", "nov", "dec"],
        "abbr_month_names_short": [0, "j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": " "
        },
        "currency": {
            "format": {
                "unit": "kr",
                "code": "SEK",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Thai (Thailand)
I18n.translations['th'] = $.extend(true, I18n.translations['th'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%-I:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%-d %b %Y",
            "short": "%-d/%-m/%Y",
            "medium": "%-d %b %Y",
            "long": "%-d %B %Y",
            "full": "%A %-d %B %Y"
        },
        "format": "ddmmyy",
        "separator": "/",
        "start_of_week": 1,
        "day_names": ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบด", "วันศุกร์", "วันเสาร์"],
        "abbr_day_names": ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
        "abbr_day_names_short": ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
        "month_names": [0, "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
        "abbr_month_names": [0, "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
        "abbr_month_names_short": [0, "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
        "meridian": ["ก่อนเที่ยง", "หลังเที่ยง"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "฿",
                "code": "THB",
                "precision": 2,
                "format": "%u %n"
            }
        }
    }
});

//Turkish - Turkey
I18n.translations['tr'] = $.extend(true, I18n.translations['tr'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d.%b.%Y",
            "short": "%d.%m.%Y",
            "medium": "%d.%b.%Y",
            "long": "%d %B %Y %A",
            "full": "%d %B %Y %A"
        },
        "format": "ddmmyy",
        "separator": ".",
        "start_of_week": 1,
        "day_names": ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        "abbr_day_names": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "abbr_day_names_short": ["S", "M", "T", "W", "T", "F", "S"],
        "month_names": [0, "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        "abbr_month_names": [0, "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        "abbr_month_names_short": [0, "J", "F", "M", "A", "M", "J", "T", "A", "S", "O", "N", "D"],
        "meridian": ["am", "pm"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "TL",
                "code": "TRL",
                "precision": 2,
                "format": "%n %u"
            }
        }
    }
});

//Vietnamese (Vietnam)
I18n.translations['vi'] = $.extend(true, I18n.translations['vi'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%H:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%d-%m-%Y",
            "short": "%d/%m/%Y",
            "medium": "%d-%m-%Y",
            "long": "Ngày %d tháng %-m năm %Y",
            "full": "%A, ngày %d %B năm %Y"
        },
        "format": "ddmmyy",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
        "abbr_day_names": ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"],
        "abbr_day_names_short": ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"],
        "month_names": [0, "tháng một", "tháng hai", "tháng ba", "tháng tư", "tháng năm", "tháng sáu", "tháng bảy", "tháng tám", "tháng chín", "tháng mười", "tháng mười một", "tháng mười hai"],
        "abbr_month_names": [0, "thg 1", "thg 2", "thg 3", "thg 4", "thg 5", "thg 6", "thg 7", "thg 8", "thg 9", "thg 10", "thg 11", "thg 12"],
        "abbr_month_names_short": [0, "thg 1", "thg 2", "thg 3", "thg 4", "thg 5", "thg 6", "thg 7", "thg 8", "thg 9", "thg 10", "thg 11", "thg 12"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ",",
            "delimiter": "."
        },
        "currency": {
            "format": {
                "unit": "₫",
                "code": "VND",
                "precision": 0,
                "format": "%n %u"
            }
        }
    }
});

//Chinese (China)
I18n.translations['zh'] = $.extend(true, I18n.translations['zh'], {
    "time": {
        "patterns": {
            "ampm": "%-I:%M%p",
            "duration": "%Ih %Mm"
        },
        "formats": {
            "default": "%p%-I:%M"
        }
    },
    "date": {
        "patterns": {
            "small": "%b %-d",
            "medium": "%a, %b %-d",
            "large": "%a, %b %-d, %Y"
        },
        "formats": {
            "default": "%Y-%-m-%-d",
            "short": "%Y-%-m-%-d",
            "medium": "%Y-%-m-%-d",
            "long": "%Y年%-m月%-d日",
            "full": "%Y年%-m月%-d日 %A"
        },
        "format": "yymmdd",
        "separator": "-",
        "start_of_week": 1,
        "day_names": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        "abbr_day_names": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        "abbr_day_names_short": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        "month_names": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "abbr_month_names": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "abbr_month_names_short": [0, "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "meridian": ["上午", "下午"]
    },
    "number": {
        "format": {
            "precision": 2,
            "separator": ".",
            "delimiter": ","
        },
        "currency": {
            "format": {
                "unit": "￥",
                "code": "CNY",
                "precision": 2,
                "format": "%u%n"
            }
        }
    }
});

//Chinese (Hong Kong)
I18n.translations['zh-HK'] = $.extend(true, I18n.translations['zh-HK'], I18n.translations['zh']); // Pick up all the properties from default 'zh'
I18n.translations['zh-HK'] = $.extend(true, I18n.translations['zh-HK'], { // Override what is necessary
    "date": {
        "formats": {
            "default": "%Y年%-m月%-d日",
            "short": "%Y年%-m月%-d日",
            "medium": "%Y年%-m月%-d日",
            "long": "%Y年%m月%d日 %A",
            "full": "%Y年%m月%d日 %A"
        },
        "abbr_day_names": ["日", "一", "二", "三", "四", "五", "六"],
        "abbr_day_names_short": ["日", "一", "二", "三", "四", "五", "六"]
    },
    "number": {
        "currency": {
            "format": {
                "unit": "HK$",
                "code": "HKD"
            }
        }
    }
});

//Chinese (Taiwan)
I18n.translations['zh-TW'] = $.extend(true, I18n.translations['zh-TW'], I18n.translations['zh']); // Pick up all the properties from default 'zh'
I18n.translations['zh-TW'] = $.extend(true, I18n.translations['zh-TW'], { // Override what is necessary
    "time": {
        "formats": {
            "default": "%p %-I:%M"
        }
    },
    "date": {
        "formats": {
            "default": "%Y/%-m/%-d",
            "medium": "%Y/%-m/%-d"
        },
        "separator": "/"
    },
    "number": {
        "currency": {
            "format": {
                "unit": "NT$",
                "code": "TWD"
            }
        }
    }
});

/*
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice - https://github.com/jamesallardice/Placeholders.js
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * -----------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Placeholders is a simple polyfill for the HTML5 "placeholder" attribute. The placeholder attribute can be used on input elements of certain types
 * and provides a short hint (such as a sample value or a brief description) intended to aid the user with data entry. This polyfill has been tested
 * and functions correctly in Internet Explorer 6 and above, Firefox 3.6 and above, Safari 3.2 and above, Opera 9 and above and Chrome 16 and above.
 * The script will be tested in further browsers in due course and the above list edited accordingly.
 *
 * User agents should display the value of the placeholder attribute when the element's value is the empty string and the element does not
 * have focus. The user agents that have implemented support for this attribute all display the placeholder inside the element, as if it were
 * the element's value, in a light grey colour to differentiate between placeholder text and value text.
 *
 * The Placeholders polyfill attempts to replicate the functionality of compliant user agents so that non-compliant user agents will still function
 * as expected when faced with a "placeholder" attribute.
 *
 * The script is unobtrusive and will only apply if the placeholder attribute is not supported by the user agent in which it is running. To use a placeholder
 * simply add the "placeholder" attribute to a supporting input element:
 *
 * <input type="text" placeholder="Placeholder text">
 *
 * To get this placeholder to function in non-supporting user agents simply call the init method when appropriate (the DOM must be ready for manipulation,
 * unless the `live` option is true):
 *
 * Placeholders.init();
 *
 * The init method accepts one argument, `options`. It's an object that contains settings to control the behaviour of the polyfill. Currently, only 2 options
 * are available:
 *
 * `live` - If truthy, the polyfill will apply to all supported input elements now and in the future, and dynamic
 * changes to the placeholder attribute value will be reflected. If falsy, the polyfill will only apply to those elements with a placeholder attribute
 * value in the DOM at the time the method is executed. If the live option is not used, the placeholders can be refreshed manually by calling `Placeholders.refresh()`.
 *
 * `hideOnFocus` - If truthy, the placeholder text will not disappear when the field receives focus. This option is relatively new to the spec, but is
 * starting to be implemented in browsers (e.g. Safari, and now Chrome). This option is set to `true` by default, since that's where browsers seem to be heading.
 */

/*jslint browser: true */

var Placeholders = (function () {

    "use strict";

    /* List of input types that support the placeholder attribute. We only want to modify input elements with one of these types.
     * WARNING: If an input type is not supported by a browser, the browser will choose the default type (text) and the placeholder shim will
     * apply */
    var validTypes = [
            "text",
            "search",
            "url",
            "tel",
            "email",
            "password",
            "number",
            "textarea"
        ],

    //Default options, can be overridden by passing object to `init`
        settings = {
            live:           false,
            hideOnFocus:    false,
            className:      'placeholderspolyfill', // placeholder class name to apply to form fields
            textColor:      '#999',                 // default placeholder text color
            styleImportant: true                    // add !important flag to placeholder style
        },

    //Keycodes that are not allowed when the placeholder is visible and `hideOnFocus` is `false`
        badKeys = [37, 38, 39, 40],

    //Used if `live` options is `true`
        interval,

    //Stores the input value on keydown (used when `hideOnFocus` option is `false`)
        valueKeyDown,

    // polyfill class name regexp
        classNameRegExp = new RegExp('\\b' + settings.className + '\\b');

    // The cursorToStart function attempts to jump the cursor to before the first character of input
    function cursorToStart(elem) {
        var range;
        if (elem.createTextRange) {
            range = elem.createTextRange();
            range.move("character", 0);
            range.select();
        } else if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(0, 0);
        }
    }

    /* The focusHandler function is executed when input elements with placeholder attributes receive a focus event. If necessary, the placeholder
     * and its associated styles are removed from the element. Must be bound to an element. */
    function focusHandler() {

        var type;

        //If the placeholder is currently visible, remove it and its associated styles
        if (this.value === this.getAttribute("placeholder")) {

            if (!settings.hideOnFocus) {
                cursorToStart(this);
            } else {
                /* Remove the placeholder class name. Use a regular expression to ensure the string being searched for is a complete word, and not part of a longer
                 * string, on the off-chance a class name including that string also exists on the element */
                this.className = this.className.replace(classNameRegExp, "");
                this.value = "";

                // Check if we need to switch the input type (this is the case if it's a password input)
                type = this.getAttribute("data-placeholdertype");
                if (type) {
                    this.type = type;
                }
            }
        }
    }

    /* The blurHandler function is executed when input elements with placeholder attributes receive a blur event. If necessary, the placeholder
     * and its associated styles are applied to the element. Must be bound to an element. */
    function blurHandler() {

        var type;

        //If the input value is the empty string, apply the placeholder and its associated styles
        if (this.value === "") {
            this.className = this.className + " " + settings.className;
            this.value = this.getAttribute("placeholder");

            // Check if we need to switch the input type (this is the case if it's a password input)
            type = this.getAttribute("data-placeholdertype");
            if (type) {
                this.type = "text";
            }
        }
    }

    /* The submitHandler function is executed when the containing form, if any, of a given input element is submitted. If necessary, placeholders on any
     * input element descendants of the form are removed so that the placeholder value is not submitted as the element value. */
    function submitHandler() {
        var inputs = this.getElementsByTagName("input"),
            textareas = this.getElementsByTagName("textarea"),
            numInputs = inputs.length,
            num = numInputs + textareas.length,
            element,
            placeholder,
            i;
        //Iterate over all descendant input elements and remove placeholder if necessary
        for (i = 0; i < num; i += 1) {
            element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];
            placeholder = element.getAttribute("placeholder");

            //If the value of the input is equal to the value of the placeholder attribute we need to clear the value
            if (element.value === placeholder) {
                element.value = "";
            }
        }
    }

    /* The keydownHandler function is executed when the input elements with placeholder attributes receive a keydown event. It simply stores the current
     * value of the input (so we can kind-of simulate the poorly-supported `input` event). Used when `hideOnFocus` option is `false`. Must be bound to an element. */
    function keydownHandler(event) {
        valueKeyDown = this.value;

        //Prevent the use of the arrow keys (try to keep the cursor before the placeholder)
        return !(valueKeyDown === this.getAttribute("placeholder") && badKeys.indexOf(event.keyCode) > -1);
    }

    /* The keyupHandler function is executed when the input elements with placeholder attributes receive a keyup event. It kind-of simulates the native but
     * poorly-supported `input` event by checking if the key press has changed the value of the element. Used when `hideOnFocus` option is `false`. Must be bound to an element. */
    function keyupHandler() {

        var type;

        if (this.value !== valueKeyDown) {

            // Remove the placeholder
            this.className = this.className.replace(classNameRegExp, "");
            this.value = this.value.replace(this.getAttribute("placeholder"), "");

            // Check if we need to switch the input type (this is the case if it's a password input)
            type = this.getAttribute("data-placeholdertype");
            if (type) {
                this.type = type;
            }
        }
        if (this.value === "") {

            blurHandler.call(this);
            cursorToStart(this);
        }
    }

    //The addEventListener function binds an event handler with the context of an element to a specific event on that element. Handles old-IE and modern browsers.
    function addEventListener(element, event, fn) {
        if (element.addEventListener) {
            return element.addEventListener(event, fn.bind(element), false);
        }
        if (element.attachEvent) {
            return element.attachEvent("on" + event, fn.bind(element));
        }
    }

    //The addEventListeners function binds the appropriate (depending on options) event listeners to the specified input or textarea element.
    function addEventListeners(element) {
        if (!settings.hideOnFocus) {
            addEventListener(element, "keydown", keydownHandler);
            addEventListener(element, "keyup", keyupHandler);
        }
        //addEventListener(element, "focus", focusHandler);
        addEventListener(element, "focusin", focusHandler); // Use focusin to clear the value from input field before focus trigger
        addEventListener(element, "blur", blurHandler);
    }

    /* The updatePlaceholders function checks all input and textarea elements and updates the placeholder if necessary. Elements that have been added to the DOM since the call to
     * createPlaceholders will not function correctly until this function is executed. The same goes for any existing elements whose placeholder property has been changed (via
     * element.setAttribute("placeholder", "new") for example) */
    function updatePlaceholders() {

        //Declare variables, get references to all input and textarea elements
        var inputs = document.getElementsByTagName("input"),
            textareas = document.getElementsByTagName("textarea"),
            numInputs = inputs.length,
            num = numInputs + textareas.length,
            i,
            form,
            element,
            oldPlaceholder,
            newPlaceholder;

        //Iterate over all input and textarea elements and apply/update the placeholder polyfill if necessary
        for (i = 0; i < num; i += 1) {

            //Get the next element from either the input NodeList or the textarea NodeList, depending on how many elements we've already looped through
            element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];

            //Get the value of the placeholder attribute
            newPlaceholder = element.getAttribute("placeholder");

            //Check whether the current input element is of a type that supports the placeholder attribute
            if (validTypes.indexOf(element.type) > -1) {

                //The input type does support the placeholder attribute. Check whether the placeholder attribute has a value
                if (newPlaceholder) {

                    //The placeholder attribute has a value. Get the value of the current placeholder data-* attribute
                    oldPlaceholder = element.getAttribute("data-currentplaceholder");

                    //Check whether the placeholder attribute value has changed
                    if (newPlaceholder !== oldPlaceholder) {

                        //The placeholder attribute value has changed so we need to update. Check whether the placeholder should currently be visible.
                        if (element.value === oldPlaceholder || element.value === newPlaceholder || !element.value) {

                            //The placeholder should be visible so change the element value to that of the placeholder attribute and set placeholder styles
                            element.value = newPlaceholder;
                            element.className = element.className + " " + settings.className;
                        }

                        //If the current placeholder data-* attribute has no value the element wasn't present in the DOM when event handlers were bound, so bind them now
                        if (!oldPlaceholder) {
                            //If the element has a containing form bind to the submit event so we can prevent placeholder values being submitted as actual values
                            if (element.form) {

                                //Get a reference to the containing form element (if present)
                                form = element.form;

                                //The placeholdersubmit data-* attribute is set if this form has already been dealt with
                                if (!form.getAttribute("data-placeholdersubmit")) {

                                    //The placeholdersubmit attribute wasn't set, so attach a submit event handler
                                    addEventListener(form, "submit", submitHandler);

                                    //Set the placeholdersubmit attribute so we don't repeatedly bind event handlers to this form element
                                    form.setAttribute("data-placeholdersubmit", "true");
                                }
                            }
                            addEventListeners(element);
                        }

                        //Update the value of the current placeholder data-* attribute to reflect the new placeholder value
                        element.setAttribute("data-currentplaceholder", newPlaceholder);
                    }
                }
            }
        }
    }

    /* The createPlaceholders function checks all input and textarea elements currently in the DOM for the placeholder attribute. If the attribute
     * is present, and the element is of a type (e.g. text) that allows the placeholder attribute, it attaches the appropriate event listeners
     * to the element and if necessary sets its value to that of the placeholder attribute */
    function createPlaceholders() {

        //Declare variables and get references to all input and textarea elements
        var inputs = document.getElementsByTagName("input"),
            textareas = document.getElementsByTagName("textarea"),
            numInputs = inputs.length,
            num = numInputs + textareas.length,
            i,
            element,
            form,
            placeholder;

        //Iterate over all input elements and apply placeholder polyfill if necessary
        for (i = 0; i < num; i += 1) {

            //Get the next element from either the input NodeList or the textarea NodeList, depending on how many elements we've already looped through
            element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];

            //Get the value of the placeholder attribute
            placeholder = element.getAttribute("placeholder");

            //Check whether or not the current element is of a type that allows the placeholder attribute
            if (validTypes.indexOf(element.type) > -1) {

                //The input type does support placeholders. Check that the placeholder attribute has been given a value
                if (placeholder) {

                    // If the element type is "password", attempt to change it to "text" so we can display the placeholder value in plain text
                    if (element.type === "password") {

                        // The `type` property is read-only in IE < 9, so in those cases we just move on. The placeholder will be displayed masked
                        try {
                            element.type = "text";
                            element.setAttribute("data-placeholdertype", "password");
                        } catch (e) {}
                    }

                    //The placeholder attribute has a value. Keep track of the current placeholder value in an HTML5 data-* attribute
                    element.setAttribute("data-currentplaceholder", placeholder);

                    //If the value of the element is the empty string set the value to that of the placeholder attribute and apply the placeholder styles
                    if (element.value === "" || element.value === placeholder) {
                        element.className = element.className + " " + settings.className;
                        element.value = placeholder;
                    }

                    //If the element has a containing form bind to the submit event so we can prevent placeholder values being submitted as actual values
                    if (element.form) {

                        //Get a reference to the containing form element (if present)
                        form = element.form;

                        //The placeholdersubmit data-* attribute is set if this form has already been dealt with
                        if (!form.getAttribute("data-placeholdersubmit")) {

                            //The placeholdersubmit attribute wasn't set, so attach a submit event handler
                            addEventListener(form, "submit", submitHandler);

                            //Set the placeholdersubmit attribute so we don't repeatedly bind event handlers to this form element
                            form.setAttribute("data-placeholdersubmit", "true");
                        }
                    }

                    //Attach event listeners to this element
                    addEventListeners(element);
                }
            }
        }
    }

    /* The init function checks whether or not we need to polyfill the placeholder functionality. If we do, it sets up various things
     * needed throughout the script and then calls createPlaceholders to setup initial placeholders */
    function init(opts) {

        //Create an input element to test for the presence of the placeholder property. If the placeholder property exists, stop.
        var test = document.createElement("input"),
            opt,
            styleElem,
            styleRules,
            i,
            j;

        //Test input element for presence of placeholder property. If it doesn't exist, the browser does not support HTML5 placeholders
        if (typeof test.placeholder === "undefined") {
            //HTML5 placeholder attribute not supported.

            //Set the options (or use defaults)
            for (opt in opts) {
                if (opts.hasOwnProperty(opt)) {
                    settings[opt] = opts[opt];
                }
            }

            //Create style element for placeholder styles
            styleElem = document.createElement("style");
            styleElem.type = "text/css";

            //Create style rules as text node
            var importantValue = (settings.styleImportant) ? "!important" : "";
            styleRules = document.createTextNode("." + settings.className + " { color:" + settings.textColor  + importantValue + "; }");

            //Append style rules to newly created stylesheet
            if (styleElem.styleSheet) {
                styleElem.styleSheet.cssText = styleRules.nodeValue;
            } else {
                styleElem.appendChild(styleRules);
            }

            //Append new style element to the head
            document.getElementsByTagName("head")[0].appendChild(styleElem);

            //We use Array.prototype.indexOf later, so make sure it exists
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (obj, start) {
                    for (i = (start || 0), j = this.length; i < j; i += 1) {
                        if (this[i] === obj) { return i; }
                    }
                    return -1;
                };
            }

            /* We use Function.prototype.bind later, so make sure it exists. This is the MDN implementation, slightly modified to pass JSLint. See
             * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind */
            if (!Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== "function") {
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                    }
                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        FNop = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof FNop
                                    ? this
                                    : oThis,
                                aArgs.concat(Array.prototype.slice.call(arguments)));
                        };
                    FNop.prototype = this.prototype;
                    fBound.prototype = new FNop();
                    return fBound;
                };
            }

            //Create placeholders for input elements currently part of the DOM
            createPlaceholders();

            /* If the `live` option is truthy, call updatePlaceholders repeatedly to keep up to date with any DOM changes.
             * We use an interval over events such as DOMAttrModified (which are used in some other implementations of the placeholder attribute)
             * since the DOM level 2 mutation events are deprecated in the level 3 spec. */
            if (settings.live) {
                interval = setInterval(updatePlaceholders, 100);
            }

            //Placeholder attribute was successfully polyfilled :)
            return true;
        }

        //Placeholder attribute already supported by browser :)
        return false;
    }

    //Expose public methods
    return {
        init: init,
        refresh: updatePlaceholders
    };
}());



var uitk = (function($, bootstrapped) {

    "use strict";

    var init,
        readyState = false, //test for ready state by running "typeof uitk!='undefined' && uitk.readyState" (false if not ready, true when ready)
        hasTouch = Modernizr.touch,
        hasWin8Touch = Modernizr.win8touch,
        supportsChecked = Modernizr.checkedselector,
        isResponsive = Modernizr.mediaqueries,
        clickEvent,
        placeholderSupport = Modernizr.placeholder,
        isTouchDevice = (hasTouch || hasWin8Touch),
        locale,
        keyDownHash={},
        $body = $('body'),
        eventNames = {
            transitionEnd: 'transitionend'
        },
        focusableElement = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',

        adapt,
    //methods
        pubsub,
        validate,
        remove,
        addNode,
        customToggle,
        cookieHandling,
        videoHelpers,
        placeholdersPolyfill,
        createUniqueId,
        getCompiledTemplate,
        throttledEvents,
        inputAutoSelect,
        mediaquery,
        redirect,
        dataOnclickHandler,
        runOnclickFunction,
        checkme,
        iosVersion,
        iosScaleFix,
        logErrorExp,
        Logger,
        getPosition,
        corePath,
        prepFields,
        focusElement,
        focusableElements,
        isFocusableElement,
        keyIsDown,
        liveAnnounce,
        i18nMsg,
        i18nDate,
        i18nTime,
        i18nDuration,
        i18nNumber,
        i18nCurrency;

    //code to be run on page load
    init = function(){
        // Init the Placeholders if the placeholders function is present
        placeholdersPolyfill.init();

        // Debounced version of window resize event
        var resizeTimeout;
        $(window).resize(function () {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                uitk.publish('debounced.resize');
            }, 100);
        });

        // Init event throttle
        throttledEvents();

        // Init auto select inputs
        inputAutoSelect();

        // Init mediaquery
        mediaquery.init();

        // Set readystate to true
        uitk.readyState = true;
        
        // Log info (remove the check post-IE9) 
        console.log('-- UITK Info --\nBOM version: ' + uitk.version + '\nAssets url: ' + uitk.hostedAssetsUrl + ' (note that asset version may differ from BOM, this is expected)\nRunmode: ' + uitk.runMode);

    };


    createUniqueId = (function(){
        var idNum = 0;

        return function(){

            idNum++;

            return 'uitkId'+idNum;

        };
    }());


    //UITK CLICK AND TOUCHEND SPECIAL EVENTS

    //setting uitk click event
    if(window.uitkUseNativeEvents) {
        clickEvent = "click";
    } else if(hasWin8Touch) {
        clickEvent = "uitkMSPointerUpClick";
    }else{
        clickEvent = "uitkTouchendClick";
    }

    var globalTouchEventTimeout,
        globalTouchEventFlag,
        getEventStorage,
        preventDoubleClick,
        flagTouchEvent;


    getEventStorage = function(event){

        //if eventId isn't included in the event return false
        if (!event.data || (event.data && !event.data.eventId)){return false;}

        var eventId = event.data.eventId,
            $elem = event.handleObj.selector ? $(event.target).closest(event.handleObj.selector) : $(event.currentTarget),
            data = $elem.data('eventStorage');

        if(!data) {
            data = {};
        }

        if(!data[eventId]) {
            data[eventId] = {preventDoubleClick: false};
        }

        $elem.data('eventStorage', data);

        return data[eventId];
    };

    //prevent a click after a touchend / MSPointerUp
    flagTouchEvent =  function(storage){

        //set up a global flags for mouseenter and leave events
        //clear the time out the resets the touch event flag
        clearTimeout(globalTouchEventTimeout);

        //set the touch event flag to true
        globalTouchEventFlag = true;

        //create a timeout to reset the touch event flag to false
        globalTouchEventTimeout = setTimeout(function(){
            globalTouchEventFlag = false;
        }, 1000);


        //set up an event specific flag for touchend / click events. This is required to stop the # appearing in the
        //URL on touch devices
        //clear the time out the resets the touch event flag
        clearTimeout(storage.touchEventTimeout);

        //set the touch event flag to true
        storage.touchEventFlag = true;

        //create a timeout to reset the touch event flag to false
        storage.touchEventTimeout = setTimeout(function(){
            storage.touchEventFlag = false;
        }, 1000);
    };

    //used to stop multiple click / touchend events firing in quick succession
    preventDoubleClick = function(storage, event){

        //set preventDoubleClick to true to stop multiple click events firing quickly
        storage.preventDoubleClick = true;

        //set preventDoubleClick to false after a time out to false so
        setTimeout(function(){
            storage.preventDoubleClick = false;
        }, 200);
    };

    // Documentation on Special event hooks
    // https://learn.jquery.com/events/event-extensions/#special-event-hooks
    $.event.special.uitkTouchstart = {
        bindType: 'touchstart',
        delegateType: 'touchstart',
        handle: function( event ) {

            var storage = getEventStorage(event);

            storage.startPos = {};

            var data = event.data || {},
                scrollDirection = data.scrollDirection || "both",
                scrollHorizontal = scrollDirection !== 'vertical',
                scrollVertical = scrollDirection !== 'horizontal',
                startPos = {x:0,y:0},
                origEvent = event.originalEvent,
                ret = null;

            //store scroll position at the start
            if (scrollHorizontal) {
                startPos.x = origEvent.touches[0].clientX;
            }
            if (scrollVertical) {
                startPos.y = origEvent.touches[0].clientY;
            }

            storage.startPos.x = startPos.x;
            storage.startPos.y = startPos.y;

            return ret;
        }
    };

    $.event.special.uitkTouchend = {
        bindType: 'touchend',
        delegateType: 'touchend',
        handle: function( event ) {
            var handleObj = event.handleObj,
                origEvent = event.originalEvent,
                storage = getEventStorage(event),
                startPos = storage.startPos || {x:0,y:0},
                dragThreshold = 44,
                endPos = {x: 0, y: 0},
                dragDistance = {x: 0, y: 0},
                ret = null;

            endPos.x = origEvent.changedTouches[0].clientX;

            dragDistance.x = Math.abs(startPos.x - endPos.x);

            endPos.y = origEvent.changedTouches[0].clientY;
            dragDistance.y = Math.abs(startPos.y - endPos.y);

            if (storage.preventDoubleClick) {
                flagTouchEvent(storage);

                //need to set preventDefault to stop click
                storage.preventDefault = true;

            } else if (dragDistance.x < dragThreshold && dragDistance.y < dragThreshold) {

                if (event.data.preventDoubleClick) {
                    preventDoubleClick(storage);
                }

                flagTouchEvent(storage);

                //overwrite preventDefault so we can catch if it was called and take the same
                //action on the click event
                storage.preventDefault = false;
                event.preventDefault = function () {
                    storage.preventDefault = true;
                    $.Event.prototype.preventDefault.call(event);
                };

                //overwrite stopPropagation so we can catch if it was called and take the same
                //action on the click event
                storage.stopPropagation = false;
                event.stopPropagation = function () {
                    storage.stopPropagation = true;
                    $.Event.prototype.stopPropagation.call(event);
                };

                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = handleObj.type;
            }

            return ret;
        }
    };

    $.event.special.uitkMSPointerUp = {
        bindType: 'MSPointerUp',
        delegateType: 'MSPointerUp',
        handle: function( event ) {

            var handleObj = event.handleObj,
                storage = getEventStorage(event),
                ret = null;

            if (storage.preventDoubleClick) {

                flagTouchEvent(storage);

                //need to set preventDefault to stop click
                storage.preventDefault = true;

            } else {
                if (event.data.preventDoubleClick) {
                    preventDoubleClick(storage);
                }

                flagTouchEvent(storage);

                //overwrite preventDefault so we can catch if it was called and take the same
                //action on the click event
                storage.preventDefault = false;
                event.preventDefault = function () {
                    storage.preventDefault = true;
                    $.Event.prototype.preventDefault.call(event);
                };

                //overwrite stopPropagation so we can catch if it was called and take the same
                //action on the click event
                storage.stopPropagation = false;
                event.stopPropagation = function () {
                    storage.stopPropagation = true;
                    $.Event.prototype.stopPropagation.call(event);
                };

                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = handleObj.type;
            }

            return ret;
        }
    };

    $.event.special.uitkClick = {
        bindType: 'click',
        delegateType: 'click',
        handle: function (event) {
            var handleObj = event.handleObj,
                ret = null,
                storage = getEventStorage(event);

            //don't run click event if touchEvent has just fired or device is using MSPointerEvents
            if (!storage.touchEventFlag) {
                //check is click has just been fired (this can't apply to inputs as labels wrapping inputs can cause double clicks on inputs)
                if (storage.preventDoubleClick) {

                    //stop a double click
                    event.preventDefault();
                } else {
                    //prevent click from firing twice in quick succession
                    if (event.data.preventDoubleClick) {
                        preventDoubleClick(storage);
                    }

                    //run event handler
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = handleObj.type;
                }
            } else {
                //check is preventDefault was called be touchend or MSPointerUp
                if (storage.preventDefault) {
                    event.preventDefault();
                }

                //check is stopPropagation was called be touchend or MSPointerUp
                if (storage.stopPropagation) {
                    event.stopPropagation();
                }
            }

            return ret;
        }
    };

    $.event.special.uitkMouseenter = {
        bindType: 'mouseover',
        delegateType: 'mouseover',
        handle: function (event) {

            var ret = null,
                storage = getEventStorage(event),
                touchEventFlag = storage ? storage.touchEventFlag : globalTouchEventFlag;

            //only do mouseenter if link has just been 'touched'
            if (!touchEventFlag) {
                //handle event using the built in special event 'mouseleave'
                //doing this stops event firing multiple times if element has a child
                ret = $.event.special.mouseenter.handle.call(this, event);
            }

            return ret;
        }
    };

    $.event.special.uitkMouseleave = {
        bindType: 'mouseout',
        delegateType: 'mouseout',
        handle: function (event) {

            var ret = null,
                storage = getEventStorage(event) || {},
                touchEventFlag = storage ? storage.touchEventFlag : globalTouchEventFlag;

            //only do mouseleave if link has just been 'touched'
            if (!touchEventFlag) {
                //handle event using the built in special event 'mouseleave'
                //doing this stops event firing multiple times if element has a child
                ret = $.event.special.mouseleave.handle.call(this, event);
            }

            return ret;
        }
    };

    $.event.special.uitkTouchendClick = {
        add: function (handleObj) {
            var data = handleObj.data || {},
                namespace = handleObj.namespace ? '.' + handleObj.namespace : "";

            if (data.eventId === undefined) {
                data.eventId = createUniqueId();
            }

            $(this).on('uitkTouchstart' + namespace + ' uitkTouchend' + namespace + ' uitkClick' + namespace, handleObj.selector, data, handleObj.handler);
        },
        remove: function (handleObj) {
            var namespace = handleObj.namespace ? '.' + handleObj.namespace : "";

            $(this).off('uitkTouchstart' + namespace + ' uitkTouchend' + namespace + ' uitkClick' + namespace, handleObj.selector);
        }
    };

    $.event.special.uitkMSPointerUpClick = {
        add: function (handleObj) {
            var data = handleObj.data || {},
                namespace = handleObj.namespace ? '.' + handleObj.namespace : "";

            if (data.eventId === undefined) {
                data.eventId = createUniqueId();
            }

            $(this).on('uitkMSPointerUp' + namespace + ' uitkClick' + namespace, handleObj.selector, data, handleObj.handler);
        },
        remove: function (handleObj) {
            var namespace = handleObj.namespace ? '.' + handleObj.namespace : "";

            $(this).off('uitkMSPointerUp' + namespace + ' uitkClick' + namespace, handleObj.selector);
        }
    };




    // data-onclick Listener
    redirect = function (href) {
        //timeout required to make it work on surface when using touch
        setTimeout(function(){window.location.href = href;}, 0);
    };

    runOnclickFunction = function(func, $elem, event){
        var href = $elem.attr('href'),
            funcReturn = new Function(func).call($elem[0]),
            optionDown=uitk.utils.keyIsDown(91) || uitk.utils.keyIsDown(17) || (event && event.metaKey),
            hrefDefined=href && href !== '#' && href !== '';

        if (funcReturn === false || !hrefDefined){
            event && event.preventDefault();
            return false;
        }else{
            if ( !optionDown ){
                event && event.preventDefault();
                uitk.redirect(href);
                return funcReturn;
            }else{
                // let the user agent do whatever it wants in this case
                return funcReturn;
            }
        }
    };

    dataOnclickHandler = function(e){
        var $target = $(e.target).closest('[data-onclick]');
        uitk.dataOnclick.runOnclickFunction($target.data('onclick'), $target,e);
    };

    $body.on(clickEvent + '.onclick', '[data-onclick]', dataOnclickHandler);

    // Function to check/uncheck radio buttons
    // Used in Sort bar
    // TODO: Refactor pagination and on/off toggle to utilise this method
    // @var elem: expecting  $(e.currentTarget) from calling plugin
    // @var parent: expects class or id string of module parent
    checkme = function(elem, parent) {
        var inputs = elem.closest(parent).find('input');
        inputs.removeClass("checked");
        inputs.filter(':checked').addClass("checked");
    };

    //custom toggle helper
    customToggle = function(selector, beforeOpen, afterOpen, beforeClose, afterClose){

        var togglePlugin = "uitk_toggle";

        $body.on(clickEvent + '.toggle', selector, {preventDoubleClick:true}, function(e){

            var $target = $(e.target).closest(selector),
                subscribeToken,
                currentState;

            e.preventDefault();

            //init toggle if it isn't already inited (this test is built in to the plugin)
            $target[togglePlugin]();

            //get state and init toggle
            currentState = $target.data(togglePlugin).state;

            if (currentState === "closed") {

                if (beforeOpen) {
                    beforeOpen($target);
                }

                $target[togglePlugin]('open');

                if (afterOpen) {
                    afterOpen($target);
                }

            } else if (currentState === "open") {

                if (beforeClose){beforeClose($target);}

                if (afterClose) {
                    subscribeToken = uitk.subscribe('toggle.closed', function (topic, elem) {

                        if (elem[0] === $target[0]) {
                            afterClose($target);
                            uitk.unsubscribe('toggle.closed', subscribeToken);
                        }
                    });
                }

                $target[togglePlugin]('close');
            }

        });
    };

    //PUB SUB (private methods)
    pubsub = {

        topics: {},
        lastToken: 0,

        // Create or retrieve a topic
        // @param topic The topic to create or retrieve
        topic: function (topic) {
            var topics = this.topics;

            //create topic if it doesn't already exist
            if (!topics[topic]) {
                topics[topic] = [];
            }

            return topics[topic];
        },

        // Publish a topic
        // @param topic The topic to subscribe to
        // @param {args} Additional arguments are passed to the subscriber's callback
        publish: function (topic, args) {
            var subs = pubsub.topics[topic],
                subsLength,
                argLength = arguments.length,
                data = [],
                sub,
                context,
                callback,
                i;

            //check to see if there are any subscriptions
            if (subs) {
                //put arguments in to an array
                for (i = 0; i < argLength; i = i + 1) {
                    data.push(arguments[i]);
                }

                //loop through subscriptions passing the arguments to the callbacks
                //Using i-1 rather the i+1 so that an error isn't thrown if unsubscribe is used with a callback
                subsLength = subs.length;
                for (i = subsLength - 1; i >= 0; i = i - 1) {
                    sub = subs[i];
                    context = sub.context;
                    callback = sub.callback;

                    //run callback
                    if (typeof callback === 'function') {
                        callback.apply(context, data);
                    }
                }
            }
        },

        // Subscribe to a topic
        // @param {topic} The topic to subscribe to
        // @param {context} (optional) The value of this provided to the callbacks
        // @param {args} Additional arguments are callbacks to be subscribed to the topic - add as many callbacks as you like
        subscribe: function (topic, context, args) {
            var argLength = arguments.length,
                callback,
                subs,
                subsLength,
                argNum = 2,
                callbackContext = context,
                token = pubsub.lastToken++,
                i;

            if (typeof context === 'function') {
                callbackContext = null;
                argNum = 1;
            }

            //subscribe each callback
            if (arguments.length > argNum) {
                for (i = argNum; i < argLength; i = i + 1) {
                    callback = arguments[i];

                    if (typeof callback === 'function') {
                        subs = pubsub.topic(topic);
                        subsLength = subs.length;

                        subs.push({context: callbackContext, callback: arguments[i], token: token.toString()});
                    }
                }
            }

            return token.toString();
        },

        // Unsubscribe from a topic
        // @param topic The topic to unsubscribe from
        // @param {args} Additional arguments are callbacks to be unsubscribed from the topic - add as many callbacks as you like.
        //               if no additional arguments are provided the all subscriptions to the topic will be unsubscribed
        unsubscribe: function (topic, args) {
            var subs = pubsub.topics[topic],
                subsLength,
                argLength = arguments.length,
                callbackOrToken,
                i, s;

            //subscribe each callback
            if (argLength > 1 && subs) {

                for (i = 1; i < argLength; i = i + 1) {
                    subsLength = subs.length;
                    callbackOrToken = arguments[i];

                    if (typeof callbackOrToken === 'function') {
                        for (s = subsLength - 1; s >= 0; s = s - 1) {
                            if (subs[s].callback === callbackOrToken) {
                                subs.splice(s, 1);
                            }
                        }
                    } else if (typeof callbackOrToken === 'string') {
                        for (s = subsLength - 1; s >= 0; s = s - 1) {
                            if (subs[s].token === callbackOrToken) {
                                subs.splice(s, 1);
                            }
                        }
                    }
                }
            } else if (argLength === 1 && subs) {
                delete pubsub.topics[topic];
            }
        }
    };


    // Validation library
    validate = {
        // Default matching Regex rules
        patterns: {
            // Regex for checking valid email address
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
            // regex for checking valid password
            // (?=.*\d) at least one digit,
            // (?=.*[a-z]) at least one lower case,
            // (?=.*[A-Z]) at least one upper case,
            // (?=.*[@#$%]) at least one of specific characters
            // [0-9a-zA-Z@#$%]{8,15} only allow 0 to 9, a to z, A to Z, @#$%, and 8 to 15 characters long
            password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])[0-9a-zA-Z@#$%]{8,15}$/,
            phone: {
                // Regex for accepting only digit 0 to 9, space, and ().+- within a string
                isValidNumber: /^[0-9 \(\)\.\-\+]+$/,
                // Phone number length included area code but not country code)
                isValidLength: function(locale) {
                    switch (locale) {
                        case "da": // Denmark (8 digits)
                        case "nb": // Norway (8 digits)
                            return /^[0-9]{8}$/;
                            break;
                        case "cs": // Czech (9 digits)
                        case "de-ch": // Switzerland (9 digits)
                        case "fr-ch": // Switzerland (9 digits)
                        case "it-ch": // Switzerland (9 digits)
                        case "es": // Spain (9 digits)
                        case "fr": // France (9 digits)
                        case "nl": // Netherlands (9 digits)
                        case "pl": // Poland (9 digits)
                        case "pt": // Portugal (9 digits)
                        case "en-au": // Australia (9 digits)
                            return /^[0-9]{9}$/;
                            break;
                        case "en-ca": // Canada (10 digits)
                        case "fr-ca": // Canada (10 digits)
                        case "en-gb": // United Kingdom (10 digits)
                        case "en-in": // India (10 digits)
                        case "en-us": // United State (10 digits)
                        case "tr": // Turkey (10 digits)
                        case "es-ar": // Argentina (10 digits)
                        case "es-mx": // Mexico (10 digits)
                            return /^[0-9]{10}$/;
                            break;
                        case "de": // Germany (5 to 10 digits landline, 10 or 11 digits cell phone)
                            return /^([0-9]{5,11})$/;
                            break;
                        case "de-at": // Austria (no standard length; minimum 4 and maximum 13 digits)
                            return /^([0-9]{4,13})$/;
                            break;
                        case "en-ie": // Ireland (7 to 9 digits landline, 9 digits cell phones)
                            return /^[0-9]{7,9}$/;
                            break;
                        case "fi": // Finland (5 to 12 digits landline, mostly 9 digits cell phone)
                            return /^[0-9]{5,12}$/;
                            break;
                        case "fr-be": // Belgium (8 digits landline, 9 digits cell phone)
                        case "nl-be": // Belgium (8 digits landline, 9 digits cell phone)
                            return /^[0-9]{8,9}$/;
                            break;
                        case "it": // Italy (6 to 10 digits landline, 10 digits cell phone)
                            return /^[0-9]{6,10}$/;
                            break;
                        case "sv": // Sweden (7 to 9 digits landline, 9 digits cell phone)
                            return /^[0-9]{7,9}$/;
                            break;
                        case "zh": // China (8 to 12 digits landline, 11 digits cell phone)
                            return /^[0-9]{8,12}$/;
                            break;
                        default:
                            return false;
                    }
                }
            }
        },

        email: function (val) {
            if(typeof val !== 'string') return false;
            var reg = new RegExp(this.patterns.email);
            return reg.test($.trim(val));
        },

        password: function(val) {
            if(typeof val !== 'string') return false;
            var reg = new RegExp(this.patterns.password);
            return reg.test($.trim(val));
        },

        phone: function(val, locale) {
            if(typeof val !== 'string' && !locale && typeof locale !=='string' ) return false;
            var regValidNumber = new RegExp(this.patterns.phone.isValidNumber);
            if(this.patterns.phone.isValidLength(locale.toLowerCase())) {
                var regValidLength = new RegExp(isValidLength);
            } else {
                return false;
            }

            function removeSpecialChar(val) {
                return val.replace(/[ \(\)\.\-\+]/g, '');
            }

            return regValidNumber.test(val) ? regValidLength.test(removeSpecialChar(val)) : false;
        },

        isIsoDateTime: function(date) {
            if(typeof date !== 'string') return false;
            return moment(date, "YYYY-MM-DDTHH:mm:ss.sssZ", true).isValid();
        },
        isIsoDate: function(date) {
            if(typeof date !== 'string') return false;
            return moment(date, "YYYY-MM-DD", true).isValid();
        }
    };


    //REMOVE METHOD
    remove = function ($target, opts) {

        var defaults = {
                transition: 'fade',
                publish: true
            },
            options = opts ? $.extend(true, {}, defaults, opts) : defaults,
            publish,
            $currentFocus,
            hasTransitions = Modernizr.csstransitions;


        publish = function () {
            //publish topics using pub/sub system
            if (typeof uitk.publish === 'function') {
                //publish remove topic
                if (options.publish) {
                    uitk.publish('remove', $target);
                }

                //publish additional topic
                if (options.topic) {
                    uitk.publish(options.topic, $target);
                }
            }
        };

        //check if focus is the element or is inside the element to be removed (Accessibility)
//        $currentFocus = $(document.activeElement);
//        if($target.is($currentFocus) || $target.find($currentFocus).length > 0){
//
//            var $nextElem = $target.next(),
//
//            //set new focus to next element if available.
//            //else set new focus to parent element
//                $newFocus = $nextElem.length > 0 ? $nextElem : $target.parent();
//
//            //blur the current target
//            $target.blur();
//
//            //add the focus to the new focus element
//            //uitk.utils.focusElement($newFocus) //causes unwanted blue focus outline, can be fixed by CSS but want to confirm we should do this first
//        }



        //remove element
        if (options.transition === 'none' || !hasTransitions) {
            $target.empty().remove();
            publish();
        } else {
            //set up animation
            $target.addClass('remove-animated animated-fade');

            //once animation has completed remove object from dom
            $target.one(uitk.topics.transitionEnd, function (e) {
                $target.empty().remove();
                publish();
            });
        }

    };

    $body.on(clickEvent + '.remove', '[data-control=remove]', function (e) {
        var $control = $(e.target).closest('[data-control=remove]'),
            options = $control.data(),
            $target = options.targetId ? $('#' + options.targetId) : $(this);

        e.preventDefault();

        uitk.remove($target, options);
    });

    // Bind click on X in the text inputs
    $body.on(clickEvent, '.input-clear', function(e) {
        var input = $(this).siblings('input')[0];
        input.value = "";
        uitk.publish('input.clear', {id: input.id});
    });

    //ADD NODE METHOD
    addNode = function (templateId, opts) {
        var options = opts || {};

        uitk.publish('addNode', templateId, options);
    };

    $body.on(clickEvent + '.add', '[data-control=add]', function (e) {
        var $control = $(e.target).closest('[data-control=add]'),
            options = $control.data(),
            templateId = options.templateId;

        e.preventDefault();

        uitk.addNode(templateId, options);
    });


    //PLACEHOLDER POLYFILL HELPER FUNCTIONS
    //functions are blank if polyfill isn't required
    placeholdersPolyfill = (function () {
        var placeholderObj = {},
            placeholderClass = 'placeholderspolyfill';

        if (typeof Placeholders != "undefined" && !placeholderSupport) {
            placeholderObj.init = function () {
                Placeholders.init({styleImportant: false, hideOnFocus: true});
            };

            //init the placeholder polyfill for any placeholder that hasn't been inited,
            //should be run after new elements are added to the page.
            placeholderObj.refresh = function () {
                Placeholders.refresh();
            };

            //remove placeholder class
            placeholderObj.updateClass = function ($inputs) {
                $inputs.each(function () {
                    var $this = $(this);

                    if ($this.attr('placeholder') !== $this.attr('value')) {
                        $this.removeClass(placeholderClass);
                    } else {
                        $this.addClass(placeholderClass);
                    }
                });
            };

            placeholderObj.getInputValue = function ($input) {
                return $input.val() === $input.attr("placeholder") ? "" : $input.val();
            };

            placeholderObj.updateInputValue = function ($input, value) {
                if (value) {
                    $input.val(value);
                    $input.removeClass(placeholderClass);
                }
                else {
                    $input.val($input.attr("placeholder"));
                    $input.addClass(placeholderClass);
                }
            };

        } else {
            placeholderObj.init = function(){};
            placeholderObj.refresh = function(){};
            placeholderObj.updateClass = function(){};
            placeholderObj.getInputValue = function($input){ return $input.val(); };
            placeholderObj.updateInputValue = function($input, value){ $input.val(value); };
        }

        return placeholderObj;
    })();

    //PREP FIELDS
    //used to prepare fields that are added to the page after page load
    prepFields = function () {
        uitk.initPlaceholders();
        uitk.initCalendarInputs();
        uitk.initStepper();
    };


    //COOKIE HANDLING (private methods)
    //based on http://www.quirksmode.org/js/cookies.html
    cookieHandling = {
        //GET EXPIRY DATE STRING
        getFutureDateAsString: function (baseDate, days) {
            baseDate.setTime(baseDate.getTime() + (days * 24 * 60 * 60 * 1000));

            return (baseDate.toGMTString());
        },

        //CREATE COOKIE
        //name {string} Name of cookie for retrieval at a later date
        //value {string} Value to store in the cookie
        //days {int} (optional) Number of days before the cookie expires. If days is < 0 the cookie will be deleted
        createCookie: function (name, value, days) {
            var date,
                dateString,
                expires;

            //generate the expiry date or set to "" if no days are given
            //a cookie without an expiry date will expire at the end of the session
            if (days) {
                date = new Date();
                dateString = uitk.getFutureDateAsString(date, days);

                expires = "; expires=" + dateString;
            } else {
                expires = "";
            }

            //create cookie
            // We want the cookie stored to have all special chearacters escaped
            // because the server expects them to be. The value reported can be what
            // the client expects
            document.cookie = name + "=" + cookieHandling.formatCookie(value) + expires + "; path=/";

            //publish cookie.deleted or cookie.created along with object containing cookie's properties
            if (days && days < 0) {
                uitk.publish('cookie.deleted', name);
            } else {
                uitk.publish('cookie.created', {
                    name: name,
                    value: value,
                    days: days,
                    expires: dateString
                });
            }
        },

        //READ COOKIE
        readCookie: function (name) {
            var nameEQ = name + "=",
                cookieArray = document.cookie.split(';'),
                cookieArrayLength = cookieArray.length,
                i = 0,
                currentCookie;

            //loop through all cookies
            for (i = 0; i < cookieArrayLength; i++) {
                //select a cookie
                currentCookie = cookieArray[i];

                //remove any spaces from the front of the currently selected cookie
                while (currentCookie.charAt(0) === ' ') {
                    currentCookie = currentCookie.substring(1, currentCookie.length);
                }

                //check if the current cookie is the one requested by checking
                //if the name with equals sign is at index 0
                if (currentCookie.indexOf(nameEQ) === 0) {
                    //return the value of the cookie
                    return decodeURIComponent(currentCookie.substring(nameEQ.length, currentCookie.length)); // decodeURIComponent decodes more stuff than encodeURIComponent
                }
            }

            //if cookie isn't found return null
            return null;
        },

        //DELETE COOKIE
        deleteCookie: function (name) {
            //set the cookie to have a life span of -1 days in order to remove it
            uitk.createCookie(name, "", -1);
        },

        // FORMAT COOKIE
        formatCookie: function (cookieStr) {
            var encodedCookie; 
            encodedCookie = encodeURIComponent(cookieStr);                          // encode the cookie
            encodedCookie = encodedCookie.replace(/\(/g, "%28").replace(/\)/g, "%29");  // guest arrangees last name is set to '(GUEST)' and encodeURIComponent doesn't escape '(' and ')'
            return encodedCookie;
        }

    };

    videoHelpers = {
        publishState: function (state, videoType, videoId) {
            var topic = 'media.' + state;

            uitk.publish(topic, videoType, videoId);
        },

        embedVideo: function (type) {
            var args = arguments,
                videoEmbed;

            switch (type) {
                case 'youtube':
                    videoEmbed = videoHelpers.embedYoutube(args[1], args[2], args[3], args[4]);
                    break;
                default:
                    return;
            }

            return videoEmbed;
        },

        loadYoutubeApi: function () {
            //make a defer
            uitk.youtubeApiDefer = $.Deferred();

            var url = "//www.youtube.com/iframe_api",
                tag = document.createElement('script'),
                firstScriptTag = document.getElementsByTagName('script')[0];

            //add source url to new script tag
            tag.src = "//www.youtube.com/iframe_api";

            //add tag to page
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },

        embedYoutube: function (videoId, videoOptions, id, playerReady) {

            var player,
                defaults,
                def = $.Deferred(),
                onStateChange,
                onError;

            if (!uitk.youtubeApiDefer) {
                videoHelpers.loadYoutubeApi();
            }

            defaults = {
                autohide: 1, //hide the video controls after video begins
                showinfo: 1, //show title of video on mouse over
                fs: 1, //show fullscreen button (only in flash player)
                modestbranding: 1, //hide the YouTube logo
                rel: 0, //stop related videos displaying at the end
                theme: 'light', //use the 'light' theme
                enablejsapi: 1
            };


            if (videoOptions) {
                videoOptions = $.extend(true, {}, defaults, videoOptions);
            } else {
                videoOptions = defaults;
            }

            onStateChange = function (data) {
                var state = data.data;

                switch (state) {
                    case 1:
                        //started
                        videoHelpers.publishState('started', 'youtube', videoId);
                        break;
                    case 0:
                        //ended
                        videoHelpers.publishState('ended', 'youtube', videoId);
                        break;
                    default:
                    //don't do anything
                }
            };

            //wait for youtube api to be ready
            uitk.youtubeApiDefer.done(function () {
                player = new YT.Player(id, {
                    height: '',
                    width: '',
                    videoId: videoId,
                    playerVars: videoOptions,
                    events: {
                        onReady: playerReady,
                        onStateChange: onStateChange
                    }
                });

                //resolves the defer passing the video player as an argument
                def.resolve(player);
            });

            //returns a defer. The player can't be deferred directly as it isn't built until
            //the api is ready
            return def.promise();
        },

        createVideoObject: function (mediaType, videoObj) {
            var video;

            switch (mediaType) {
                case 'youtube':
                    video = {
                        videoObj: videoObj,
                        type: mediaType,
                        playVideo: function () {
                            videoObj.playVideo();
                        },
                        rewindVideo: function () {
                            if (videoObj.getPlayerState() !== 5) {
                                videoObj.seekTo(0, true);
                            }
                        },
                        pauseVideo: function () {
                            videoObj.pauseVideo();
                        },
                        stopVideo: function () {
                            videoObj.stopVideo();
                        }
                    };
                    break;
                default:
                    video = {};
            }

            return video;
        }
    };

    //MEDIAQUERY - publish when new media query is reached
    mediaquery = (function () {

        var retina = Modernizr.highres,
            matchMedia = window.matchMedia || window.msMatchMedia,
            $window = $(window),
            hasMediaQueries = Modernizr.mediaqueries,
            modernizrMq = Modernizr.mq,
            mediaQueries = {},

            publish,
            publishAgain,
            checkMediaQuery,
            checkAllMediaQueries,
            register,
            registerSingle,
            init,
            getData,
            getMediaQueries,
            storeMediaQuery;


        getData = function (mql, key) {
            return {
                mediaQuery: mql.media,
                key: key,
                retina: retina,
                screenWidth: $window.width(),
                orientation: window.orientation
            };
        };

        getMediaQueries = function () {
            return mediaQueries;
        };

        storeMediaQuery = function (mql, key) {
            mediaQueries[key] = mql;
        };

        publish = function (data) {
            uitk.publish('mediaquery.matched', data);
        };


        //forces the media queries to be published again
        publishAgain = function () {
            checkAllMediaQueries(true);
        };

        //used to check a media query and publish if valid
        checkMediaQuery = function (mql, key) {
            if (modernizrMq(mql.media)) {
                publish(getData(mql, key));
            }
        };

        //check all media querie
        checkAllMediaQueries = function (force) {

            var key,
                mql,
                match,
                mediaQueries = getMediaQueries();

            for (key in mediaQueries) {
                if (mediaQueries.hasOwnProperty(key)) {
                    mql = mediaQueries[key];
                    match = modernizrMq(mql.media);

                    if (match && (mql.currentMatch !== true || force === true)) {
                        publish(getData(mql, key));
                        mql.currentMatch = true;
                    } else if (!match) {
                        mql.currentMatch = false;
                    }
                }
            }
        };

        //self invoking function that returns the current register function depending on
        //matchMedia functionality in the browser
        registerSingle = (function () {

            var registerSingle;

            // register function for browsers that support matchmedia
            if (matchMedia) {
                registerSingle = function (mq, key) {

                    var mql,
                        handleChange,
                        handleTimeout,
                        mediaQueries = getMediaQueries();

                    //make sure each key is only used once
                    if (mediaQueries[key]) {
                        mql = mediaQueries[key];
                    } else {
                        mql = matchMedia(mq);
                        storeMediaQuery(mql, key);
                    }

                    handleChange = function () {
                        if (matchMedia(mql.media).matches) {
                            clearTimeout(handleTimeout);
                            handleTimeout = setTimeout(function () {
                                checkMediaQuery(mql, key);
                            }, 100);
                        }
                    };

                    //listen for change of media query
                    mql.addListener(handleChange);

                    //needed for Android (Nexus 7) as addListener doesn't work
                    if (window.orientation !== undefined && window.addEventListener) {
                        window.addEventListener('orientationchange', handleChange);
                    }

                    //check the mediaquery on register to see if it is currently valid
                    checkMediaQuery(mql, key);
                };

                // register function for browsers that don't support matchmedia
            } else if (hasMediaQueries) {

                //subscribe
                pubsub.subscribe('debounced.resize', checkAllMediaQueries);

                registerSingle = function (mq, key) {
                    var mql,
                        mediaQueries = getMediaQueries();

                    //make sure each key is only used once
                    if (mediaQueries[key]) {
                        mql = mediaQueries[key];
                    } else {
                        mql = {media: mq, currentMatch: false};
                        storeMediaQuery(mql, key);
                    }

                    checkMediaQuery(mql, key);
                };

                // checkMediaQuery function for browsers that don't support mediaqueries (does nothing)
            } else {
                registerSingle = function(mq, key){};
            }

            return registerSingle;

        })();

        register = function () {

            var numOfArgs = arguments.length,
                firstArg = arguments[0],
                prob;

            //register single media query
            if (numOfArgs === 2) {
                uitk.mediaquery.registerSingle(firstArg, arguments[1]);

                //register multiple media queries at once using an object
            } else if (numOfArgs === 1 && typeof firstArg === 'object') {
                for (prob in firstArg) {
                    if (firstArg.hasOwnProperty(prob)) {
                        uitk.mediaquery.registerSingle(firstArg[prob], prob);
                    }
                }
            }

        };

        init = function () {
            //register media queries
            if (hasMediaQueries) {
                register({
                    desktop: '(min-width: 960px)',
                    tablet: '(min-width: 726px) and (max-width: 959px)',
                    smallTablet: '(max-width: 725px)'
                });
            } else {
                var mql = {};

                mql.media = '(min-width: 960px)';

                //for browsers that don't support mediaqueries, default to desktop
                publish(mql, 'desktop');
            }
        };

        return {
            //public methods
            init: init,
            register: register,
            registerSingle: registerSingle,
            getData: getData,
            getMediaQueries: getMediaQueries,
            publish: publish,
            publishAgain: publishAgain
        };

    })();


    // Returns a compiled template
    getCompiledTemplate = function (templateId) {
        var tmpls = Handlebars.templates;
        if (tmpls[templateId]) {
            return tmpls[templateId];
        }
        else if (tmpls["partials/uitk/" + templateId]) {
            return tmpls["partials/uitk/" + templateId];
        }
        else {
            console.log('ERROR: No template found for: ' + templateId);
        }
    };
    
    //Throttled Events
    throttledEvents = function () {
        var resizeThreshold = 100,
            resizeTimeout,
            lastResize;


        $(window).resize(function () {
            var now = new Date().getTime();

            if (lastResize && now < lastResize + resizeThreshold) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    uitk.publish('throttled.resize');
                    lastResize = now;
                }, resizeThreshold);
            } else {
                uitk.publish('throttled.resize');
                lastResize = now;
            }
        });
    };

    //AUTOSELECT INPUTS (data-autoselect=none|touch)
    //target[0].setSelectionRange(0, 9999); is required for touch devices as select() doesn't work
    inputAutoSelect = function () {

        var selector = 'input[data-autoselect="touch"], input[data-autoselect="all"]';

        //add listen for 'touch' or 'notouch' and 'all'
        if (isTouchDevice) {
            $body.on('focus', selector, function (e) {
                var target = $(e.target).closest(selector);

                if (target) {
                    //timeout required to make it work on the Kindle Fire (time can be 0)
                    //and also supresses copy/paste/select all pop up on iPad (time needs to be > 50)
                    setTimeout(function () {
                        target[0].setSelectionRange(0, 9999);
                    }, 50);
                }
            });

            //required to fix bug on some browsers including (iOS and Firefox)
            $body.on('mouseup', selector, function (e) {
                e.preventDefault();
            });
        }
    };

    // this is exposed because it's used in Pagination due to iOS5 bug
    iosVersion = function() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        } else { return []; }
    };

    // Fix for iOS Zoom Rotate Bug - keeping it for iOS5 or less only
    iosScaleFix = (function() {
        var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'),
            ua = navigator.userAgent,
            gestureStart = function() {viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';};

        if (viewportmeta && iosVersion()[0] <= 5 && !/Opera Mini/.test(ua)) {
            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', gestureStart, false);
        }
    })();

    // API for logging app errors with a custom message
    Logger = {
        info: function (message) {
            this._log('info', message);
        },

        warn: function (message) {
            this._log('warn', message);
        },

        error: function (message) {
            this._log('error', message);
        },

        _log: function (level, message) {
            var url = EG.contextPath + '/logger/' + level;
            var data = {
                message: message || "No message was provided.",
                page_url: window.location.href,
                page_title: document.title,
                user_agent: navigator.userAgent,
                referrer_url: document.referrer
            };

            // Log to Kibana proxy
            $.post(url, data);
        }
    };

    // Similar to UitkAdapt.java. Merges with bootstrapped values from an instance of UitkAdaptModel.java
    adapt = {
        // Returns the native app action url
        getNativeActionUrl: function (action) {
            var mappedAction = '';

            if (this.iOSPlatform && this.iOSActions[action]) {
                mappedAction = this.iOSActions[action];
            }
            else if (this.androidPlatform && this.androidActions[action]) {
                mappedAction = this.androidActions[action];
            }

            return mappedAction;
        }
    };

    // getting position using JS due to jquery bug
    // todo: this is a temporary fix for modals in iPad1. When we upgrade to jQuery1.9 check to see if this code is still needed. PD 13/11/13
    getPosition = function ($elem) {
        var debug = $elem[0],
            obj = debug,
            curleft = 0,
            curtop = 0,
            fixedPosition = false,
            topBorderWidth = parseInt($body.css('border-top-width')) || 0,
            $html = $('html'),
            thisOS;

        // Get offsets for element's nearest positioned parent (for absolute position?)
        for (obj = debug; obj != null; obj = obj.offsetParent)
        {
            curleft += Math.floor(obj.offsetLeft);
            curtop += Math.floor(obj.offsetTop);

            if ($(obj).css("position") === "fixed") {
                fixedPosition = true;
            }
        }

        //Subtract the scroll offsets of all parent elements.
        var currentParent = debug.parentNode,
            totalScrollLeft = 0,
            totalScrollTop = 0;

        while (!$(currentParent).is('body')) {
            totalScrollLeft += currentParent.scrollLeft;
            totalScrollTop += currentParent.scrollTop;
            currentParent = currentParent.parentNode;
        }

        curleft = curleft - totalScrollLeft;
        curtop = curtop - totalScrollTop;


        // IE8 fix for specific OS versions
        if ($html.hasClass('ie8')) {
            var version = navigator.appVersion;

            // using navigator to dertermine OS
            if (version.search("NT 5.1") !== -1) {
                thisOS = "xp";
            }

            if (version.search("NT 6.0") !== -1) {
                thisOS = "vista";
            }

            if (version.search("NT 6.1") !== -1) {
                thisOS = "7";
            }

        }

        if (fixedPosition) {
            curtop += $(window).scrollTop();
        }

        if ((fixedPosition && thisOS !== "vista") || (thisOS == "7") || (thisOS == "xp") || ( !$html.hasClass('lt-ie10') && !$html.hasClass('ie10') )) {
            // CSS positioning is offset by the branding yellow border at the top of each page
            // if it exists, here we are compensating for the difference in values.
            curtop -= topBorderWidth;
        }

        return{
            left: curleft,
            top: curtop
        }
    };

    // utility function to return the current path to static assets
    corePath = function() {
//        var versionArray = uitk.version.split("."),
//            path,
//            majVer = versionArray[0].replace("v",""),
//            minVer = versionArray[1],
//            ghHash = versionArray[3];
//        if (versionArray[3] === "local") {
//            // path without version
//            path = "/static/core/";
//        } else if (versionArray[4] === "SNAPSHOT"){
//            // For SNAPSHOT builds
//            path = "//a.travel-assets.com/uitoolkit/SNAPSHOT/"+majVer+"-"+minVer+"/"+ghHash+"/core/";
//        } else {
//            // path with version
//            path = "//a.travel-assets.com/uitoolkit/"+majVer+"-"+minVer+"/"+ghHash+"/core/";
//        }
//        return path;
        return EG.assetPath + "/";
    };
    
    // utility function for setting focus on an element
    focusElement = function($elem) {
        if (!$elem.is(focusableElement)) {
            $elem.attr('tabindex','-1').addClass('no-outline');
        }
        $elem.focus();
        return $elem;
    };

    focusableElements = function($elem){
        return $elem.find(focusableElement).filter(':visible:not([tabindex=-1])');
    };

    isFocusableElement = function($elem){
        // need to check $elem isn't the document (a non focusable element) before checking if it is a focusable element
        // to stop "TypeError: a.getAttributeNode is not a function" in Firefox - https://jira/jira/browse/CSE-1088
        if (!$elem.is(document) && $elem.is(focusableElement)) {
            return true;
        }
        return false;
    };

    keyIsDown = function(key){
        if ( isNaN(key) ){
            key = parseInt(key);
        }
        return !!keyDownHash[key.toString()];
    };

    // utility function for adding messages to a hidden aria-live region
    liveAnnounce = function(msg, level){
        var $liveRegion = $('#uitk-live-announce');
        level = level || 'assertive';

        // first make sure the aria-live region exists
        if ($liveRegion.length > 0) {
            $liveRegion.empty('');
            $liveRegion.attr('aria-live', level);
            if (typeof msg === 'string') {
                $('<p>').text(msg).appendTo($liveRegion);
            } else {
                msg.clone().appendTo($liveRegion);
            }
            return $liveRegion;
        } else {
            return false;
        }
    };

    // Localizes messages
    i18nMsg = function() {
        var messageKey = arguments[0],
            options = {},
            len = arguments.length - 1,
            options = arguments[len],
            message;

        for (var i = 1; i < len; i++) {
            options['arg' + (i - 1)] = arguments[i];
        }

        if (options.locale) {
            options.locale = options.locale.replace("_", "-");
        }

        // I18n.t() will handle invalid locales, which is what we want, but it doesn't handle missing keys
        // We can't just check for an existing bundle before checking for a missing key because there are many cases where the bundle will be missing and that's acceptable (we don't include everything from all the locales the user doesn't need)
        // TODO How do we check for a missing key on valid and invalid (non-existent bundles)?
        if (I18n.translations[options.locale || I18n.currentLocale()] && I18n.translations[options.locale || I18n.currentLocale()][messageKey]) {
            message = I18n.t(messageKey, options);
            message = _.unescape(message);
        }
        // No message found, show the key
        else if (messageKey) {
            message = messageKey.replace("uitk_", " ").replace("_", " ");
            message = message.charAt(0).toUpperCase() + message.slice(1);
        }
        else {
            message = "";
        }

        return message;
    };

    // Localizes dates
    i18nDate = function(date, options) {
        var options = options || {},
            style = options.style || "default",
            tmpLocale,
            cal,
            val;

        if (options.locale) {
            tmpLocale = I18n.currentLocale();
            var locale = options.locale.replace("_", "-");
            I18n.locale = locale;
            moment.locale(locale);
        }

        if (options.pattern) {
            // TODO remove the switch and just do the default case once Trip stops using the old deprecated patterns
            switch(options.pattern) {
                case 'small':
                case 'medium':
                case 'large':
                    val = I18n.toTime("date.patterns." + options.pattern, date);
                    break;
                default:
                    if(typeof date === 'string' || date instanceof String) {
                        date = date.substring(0,10);
                    }

                    val = moment(date).format(options.pattern);
            }
        }
        else if (style === 'iso') {
            cal = exp.core.date.Calendar();
            val = cal.getIsoDateString(date);
        }
        else {
            val = I18n.toTime("date.formats." + style, date);
        }

        if (tmpLocale) {
            I18n.locale = tmpLocale;
            moment.locale(tmpLocale);
        }

        return val;
    };

    // Localizes times
    i18nTime = function(time, options) {
        var options = options || {},
            tempTime,
            tmpLocale,
            val = "";


        if (options.locale) {
            tmpLocale = I18n.currentLocale();
            I18n.locale = options.locale.replace("_", "-");
        }

        // Ensure time string is valid
        if (typeof time === 'string' || time instanceof String) {

            // Match: 0:00 - 23:59 OR 00:00 - 23:59 OR T0:00 - T23:59 OR T0:00 - T23:59
            // Regex: T OR no T (0-9 digit OR 0 + digit 0-9 OR 1 + digit 0-9 OR 2 + digit 0-3) : digit 0-5 + digit 0-9)
            if(time.match(/^[T](\d|0\d|1\d|2[0-3]):[0-5][0-9]$|^(\d|0\d|1\d|2[0-3]):[0-5][0-9]$/)) {

                // Time with Leading T will not work so removes it
                time = time.replace("T", "");

                // Reconstruct time into valid format
                time = time.split(':');
                tempTime = new Date();
                tempTime.setHours(time[0]);
                tempTime.setMinutes(time[1]);
                time = tempTime;
            }

            if (options.pattern) {
                val = I18n.toTime("time.patterns." + options.pattern, time);
            }
            else {
                val = I18n.toTime("time.formats.default", time); //only default time style supported at this time (matches Joda "short" style)
            }

            if (tmpLocale) {
                I18n.locale = tmpLocale;
            }
        }

        return val;
    };

    // Localizes durations
    i18nDuration = function(value, options) {
        var days, hours, mins, secs;
        var options = options || {};
        var duration = "";
        var hoursSuffixLong = I18n.t("uitk_layover_hours_suffix_long", options).replace("&amp;nbsp;", "&nbsp;");
        var minsSuffixLong = I18n.t("uitk_layover_mins_suffix_long", options).replace("&amp;nbsp;", "&nbsp;");
        var secsSuffixLong = I18n.t("uitk_layover_secs_suffix_long", options).replace("&amp;nbsp;", "&nbsp;");
        var hoursSuffix = I18n.t("uitk_layover_hours_suffix", options).replace("&amp;nbsp;", "&nbsp;");
        var minsSuffix = I18n.t("uitk_layover_mins_suffix", options).replace("&amp;nbsp;", "&nbsp;");
        var secsSuffix = I18n.t("uitk_layover_secs_suffix", options).replace("&amp;nbsp;", "&nbsp;");

        if (options.locale) {
            options.locale = options.locale.replace("_", "-");
        }

        // Calculate duration values
        if (options.seconds) {
            days = Math.floor(value / (3600*24));
            hours = Math.floor(value / 3600);
            mins = Math.floor((value - (hours * 3600)) / 60);
            secs = value - (hours * 3600) - (mins * 60);
        }
        // value is minutes
        else {
            days = Math.floor(value / (60*24));
            hours = Math.floor(value / 60);
            mins = value % 60;
        }

        // Determine how to label the values
        // 1h 1m 1s or 1h 1s or 1m or 1s or 1m 1s
        if (options.hideZeros) {
            if (hours > 0 && mins > 0) {
                duration = hours + hoursSuffix + " " + mins + minsSuffix;
                if (options.seconds && secs > 0) {
                    duration += " " + secs + secsSuffix;
                }
            }
            else if (hours > 0 && mins == 0) {
                if (options.seconds && secs > 0) {
                    duration = hours + hoursSuffix + " " + secs + secsSuffix;
                }
                else {
                    duration = hours + " " + hoursSuffixLong;
                }
            }
            else if (hours == 0 && mins > 0) {
                if (options.seconds && secs > 0) {
                    duration = mins + minsSuffix + " " + secs + secsSuffix;
                }
                else {
                    duration = mins + " " + minsSuffixLong;
                }
            }
            else if (hours == 0 && mins == 0) {
                if (options.seconds && secs > 0) {
                    duration = secs + " " + secsSuffixLong;
                }
                else {
                    duration = mins + " " + minsSuffixLong;
                }
            }
        }
        else if (options.full) {
            if (hours > 0 && mins > 0) {
                duration = hours + " " + hoursSuffixLong + " " + mins + " " + minsSuffixLong;
            }
            else if (hours > 0 && mins == 0) {
                duration = hours + " " + hoursSuffixLong;
            }
            else if (hours == 0 && mins > 0) {
                duration = mins + " " + minsSuffixLong;
            }
            else if (hours == 0 && mins == 0) {
                duration = mins + " " + minsSuffixLong;
            }
            
            if (options.seconds && secs > 0){
                if (hours == 0 && mins == 0) {
                    duration = secs + " " + secsSuffixLong;
                }
                else {
                    duration += " " + secs + " " + secsSuffixLong;
                }
            }
        }
        else {
            if (options.seconds) {
                duration = hours + hoursSuffix + " " + mins + minsSuffix + " " + secs + secsSuffix;
            }
            else {
                duration = hours + hoursSuffix + " " + mins + minsSuffix;
            }
        }

        return duration;
    };

    // Localizes numbers
    i18nNumber = function(number, options) {
        var options = options || {},
            tmpLocale,
            val;

        if ($.isNumeric(number)) {
            if (options.locale) {
                tmpLocale = I18n.currentLocale();
                I18n.locale = options.locale.replace("_", "-");
            }

            if(!options.zeros) {
                options.strip_insignificant_zeros = true;
            }

            val = I18n.toNumber(number, options);


            if (tmpLocale) {
                I18n.locale = tmpLocale;
            }

            return val;
        } else {
            return "";
        }
    };

    // Localizes currencies
    i18nCurrency = function(amount, options) {
        var options = options || {},
            currencyCode = options.code,
            round = options.round || false,
            localeOverride = options.locale ? options.locale.replace("_", "-") : undefined,
            localOverridedCurrencyCode,
            prevLocale,
            currencyOptions = {},
            val,
            defaultCode = I18n.t('number.currency.format.code');

        if ($.isNumeric(amount)) {
            // If no code & no locale, we're going default (do nothing)
            // No locale but code
            if (currencyCode && !localeOverride) {
                // If the code matches, we're going default (do nothing)
                // No match, then it's foreign currency
                if (currencyCode != defaultCode) {
                    currencyOptions = {unit:currencyCode};
                }
            }
            // If code & locale
            else if (currencyCode && localeOverride) {
                toggleCurrentLocale(true);
                localOverridedCurrencyCode = I18n.t("number.currency.format.code", I18n.local);
                // If the code matches, we're going default (do nothing)
                // No match, then it's foreign currency
                if(currencyCode != localOverridedCurrencyCode) {
                    currencyOptions = {unit:currencyCode};
                }
            }
            // If no code but locale, overrides defaults
            else if (!currencyCode && localeOverride) {
                toggleCurrentLocale(true);
            }

            // If round and JPY (Japanese Yen does not have fractions)
            // The config in date-and-currency.js is not used in cases where the locale and currency code are not the same
            // e.g. locale en-US with code JPY which en-US number format is used and has correct precision of 2
            // but we need to override that back to precision 0 for JPY.
            if (round || currencyCode == "JPY") {
                currencyOptions.precision = 0;
            }

            val = I18n.toCurrency(amount, currencyOptions);

            if (prevLocale) {
                toggleCurrentLocale(false);
            }

            return val;
        } else {
            return "";
        }


        function toggleCurrentLocale(override) {
            if (override) {
                prevLocale = I18n.currentLocale();
                I18n.locale = localeOverride;
            }
            else {
                I18n.locale = prevLocale;
            }
        }
    };


    var api = {
        //init
        init: init,

        supportsChecked: supportsChecked,
        checkme: checkme,

        readyState: readyState,
        locale: locale,

        //redirect
        redirect: redirect,

        //DATA-ONCLICK
        dataOnclick: {runOnclickFunction: runOnclickFunction, dataOnclickHandler: dataOnclickHandler},

        //PUB SUB (public method)
        publish: pubsub.publish,
        subscribe: pubsub.subscribe,
        unsubscribe: pubsub.unsubscribe,

        //VALIDATION LIBRARY
        validate: validate,

        //REMOVE NODE FROM DOM
        remove: remove,

        //ADD NODE TO DOM
        addNode: addNode,

        //COOKIE HANDLING
        getFutureDateAsString: cookieHandling.getFutureDateAsString,
        createCookie: cookieHandling.createCookie,
        readCookie: cookieHandling.readCookie,
        deleteCookie: cookieHandling.deleteCookie,

        //CUSTOM TOGGLE
        customToggle: customToggle,

        //PLACEHOLDERS
        initPlaceholders: placeholdersPolyfill.init,
        refreshPlaceholders: placeholdersPolyfill.refresh,
        updatePlaceholderClass: placeholdersPolyfill.updateClass,
        updatePlaceholderValue: placeholdersPolyfill.updateInputValue,
        getPlaceholderValue: placeholdersPolyfill.getInputValue,

        //PREP FORM
        prepFields: prepFields,

        //VIDEO HELPERS
        embedVideo: videoHelpers.embedVideo,
        createVideoObject: videoHelpers.createVideoObject,

        //CREATE UNIQUE ID
        createUniqueId: createUniqueId,

        //IS TOUCH DEVICE (includes windows 8)
        isTouchDevice: isTouchDevice,

        //GET COMPILED HANDLEBARS TEMPLATE
        getCompiledTemplate: getCompiledTemplate,

        //click event
        hasTouch: hasTouch,
        clickEvent: clickEvent,
        getEventStorage: getEventStorage,

        //is responsive
        isResponsive: isResponsive,

        //iOS version
        iosVersion: iosVersion,

        //mediaquery
        mediaquery: mediaquery,

        //logError
        logError: logErrorExp,
        corePath: corePath,
        getPosition: getPosition,

        //create object to expose modules
        modules: {},
        
        //create object to expose utilities
        utils: {
            //setting focus
            focusElement: focusElement,
            focusableElements: focusableElements,
            isFocusableElement:isFocusableElement,
            keyIsDown:keyIsDown,
            liveAnnounce: liveAnnounce
        },

        i18n: {
            msg: i18nMsg,
            date: i18nDate,
            time: i18nTime,
            duration: i18nDuration,
            number: i18nNumber,
            currency: i18nCurrency
        },

        adapt: adapt,
        logger: Logger,

        // Event Names
        topics: eventNames

    };
    //end UI Toolkit

    // Merge bootstrapped and API
    return $.extend(true, bootstrapped, api);

})(jQuery, window.uitk || {});
