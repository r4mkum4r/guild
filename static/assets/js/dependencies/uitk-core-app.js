EG.Models = EG.Models || {};

EG.Models.Cdd = Backbone.Model.extend({
    defaults: {
        "display_name": "", // Required
        "geo_location": [], // Required, [latitude, longitude]
        "address": "", // Optional
        "radius": {
            "value": null, // Required
            "unit": "" // Required
        },
        "locale": "" // Optional
    }
});

EG.Models.CddCollection = Backbone.Collection.extend({
    model: EG.Models.Cdd,

    initialize: function () {
        // Init with bootstrapped data if it exists
        if (EG.bootstrapped.cdds) {
            this.reset(EG.bootstrapped.cdds, {silent: true});
        }
    },

    url: "/location-service/v1/locations/custom",

    lob: "HOTEL", // Default line of business

    parse: function (response) {
        return response.locations;
    },

    // Returns matching CDDs in Autocomplete format
    getAutocompleteResults: function (query, opts) {
        var parts = query.trim().split(" ").filter(function (part) { return part; });

        if (query) {
            return this.chain()
                .filter(byQuery)
                .sortBy(beginsWithQuery)
                .map(toAutocompleteFormat)
                .first(opts.max)
                .value();
        }

        function byQuery(model) {
            var matchValue = true;
            var filterCriteria = model.get('display_name') + " " + model.get('address'); // build search criteria data
            var queryCriteria;

            for (var i = 0; parts.length > i; i++) {
                queryCriteria = new RegExp(escapeSpecialRegexChars(parts[i]), 'ig');
                matchValue = matchValue && filterCriteria.match(queryCriteria) !== null; // Does it contain a part of the query?
                filterCriteria = matchValue ? filterCriteria.replace(queryCriteria, '') : filterCriteria; // clean up the filter
            }

            filterCriteria = undefined; // clear out criteria data after looking for a match
            queryCriteria = undefined;

            return matchValue;
        }

        function beginsWithQuery(model) {
            // sorts from lower to higher. if there is a match, then it will put the result higher up in the list
            //  matching criteria is ^query (if the model's display_name starts with the query)
            return model.get('display_name').match(new RegExp('^' + escapeSpecialRegexChars(query), 'ig')) != null ? 0 : 1;
        }

        function toAutocompleteFormat(model) {
            var displayVal = model.get('display_name');
            var optDisplayVal = model.get('address');

            for (var i = 0; parts.length > i; i++) {
                // passing in a function so the casing is respected and not changed. (Check MDN String.prototype.replace)
                displayVal = displayVal.replace(new RegExp(escapeSpecialRegexChars(parts[i]) + '(?!>)', 'ig'), function(match) {
                    return "<b>" + match + "</b>";
                });

                optDisplayVal = optDisplayVal.replace(new RegExp(escapeSpecialRegexChars(parts[i]) + '(?!>)', 'ig'), function(match) {
                    return "<b>" + match + "</b>";
                });
            }

            return {id: model.get('id'), result: JSON.stringify(model), value: model.get('display_name'),
                    display_value: displayVal, category: "CUSTOM_DEST", opt_display_value: optDisplayVal};
        }

        function escapeSpecialRegexChars(part) {
            return part.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // we have to escape regex pattern matching characters so users can search for them
        }
    }

});


EG.Models = EG.Models || {};

EG.Models.GlobalContext = Backbone.Model.extend({

    initialize: function () {
        // Expose Arrangees as a Collection and keep the two in sync.
        this.arrangees = new EG.Models.ArrangeeCollection(this.get('arrangees') || []);
        this.arrangees.on('update reset', function() { this.set('arrangees', this.arrangees.toJSON()); }, this); // Will cause 'change' in GlobalContext, which then saves

        // Create/update cookies with changes from the server
        this.save();

        // Ensure cookies stay updated
        this.on('change', this.save);
    },

    cookieName: 'egencia_globalcontext',
    cookieLegacyName: 'legacy_globalcontext',
    // Updates cookies. This is called on init and on every change, so it never needs to be called by a web app.
    save: function() {
        uitk.createCookie(this.cookieName, JSON.stringify(this));
        uitk.createCookie(this.cookieLegacyName, JSON.stringify(this.getLegacyData()));
    },

    destroy: function() {
        uitk.deleteCookie(this.cookieName);
        uitk.deleteCookie(this.cookieLegacyName);
    },

    // Legacy can only take a subset of GlobalContext, so we maintain this other stripped-down data set to share with them
    getLegacyData: function() {
        // Picks a whitelist for legacy
        var data = this.pick(['managedCompanyId', 'tripId', 'tripItemId', 'requisitionId', 'requisitionSource', 'meetingId', 'arrangees']);

        // Overwrites with only those Arrangee attributes that are supported by legacy
        if (data.arrangees && data.arrangees.length > 0) {
            data.arrangees = this.arrangees.map(function (arrangee) {
                var data = {};
                if (arrangee.get('isGuest')) {
                    data = arrangee.pick(['isGuest', 'title', 'firstName', 'lastName']); // Guest attrs only for legacy
                }
                data.userId = arrangee.id;
                return data;
            });
        }

        return data
    }

});

EG.Models = EG.Models || {};

EG.Models.Arrangee = Backbone.Model.extend({
    idAttribute: 'userId'
});

EG.Models.ArrangeeCollection = Backbone.Collection.extend({
    model: EG.Models.Arrangee
});
/* This presenter does the few things that all Egencia web apps need. */
(function () {
    "use strict";

    //----- Init -----
    var $delegate = $('body');
    uitk.init(); // Required to use UITK API and components
    EG.globalContext = new EG.Models.GlobalContext(EG.globalContext);

    //----- User events -----
    $delegate.on('focus', '.site-navigation a', toggleSubmenu);
    $delegate.on('change', '#locale-chooser', setLocale);
    $delegate.on('click', '#primary-nav-feedback', showFeedbackMenu);
    $delegate.on('click', '#log-out', logOut);

    //----- Private functions -----
    function toggleSubmenu() {
        $('.menu-item-has-children').removeClass('is-focused');

        // The focused <a> is an immediate sibling of .submenu or is inside a .submenu?
        if($(this).next('.submenu').length !== 0 || $(this).parents('.submenu')) {
            $(this).parents('.menu-item-has-children').addClass('is-focused'); // .parent() instead of .parents()?
        }
    }

    function setLocale() {
        uitk.createCookie('egencia_locale', this.value);
        location.reload(true);
    }

    function showFeedbackMenu(e) {
        // Prevent following the href
        e.preventDefault();

        // This line of code is supplied by the OpinionLab people. We do this instead of an 'onClick' handler in our template
        if (OOo) OOo.oo_launch(e.originalEvent, 'oo_feedback')
    }

    function logOut() {
        EG.globalContext.destroy();
    }

})();