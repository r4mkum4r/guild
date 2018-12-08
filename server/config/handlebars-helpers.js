// handlebars-helpers.js
var Handlebars = require('handlebars');

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
    var minutes = arguments[0],
        options = {},
        options = arguments[--arguments.length],
        duration = "";
    duration = uitk.i18n.duration(minutes, options.hash);
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

/**
 * Testing that these handlebars helpers are working
 */
Handlebars.registerHelper('testHelpers', function() {
    return "A test sentence to see if helpers are being registered";
});

module.exports = Handlebars.helpers;