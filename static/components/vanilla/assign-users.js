;
(function () {
  var searchQuery,
    preLazyLoad,
    userPickerTmpl,
    userRowTmpl,
    CLASSES,
    MODAL_OPTIONS;

  userPickerTmpl = Handlebars.compile(`
    <div id="user-picker">
      <div class="row">
          <div class="col col-12 nested-grid">
              <div class="input-group">
                  <input type="text" id="search-query" placeholder="{{searchPlaceholder}}" autofocus class="replay-safe">
              </div>
              {{#if canFilterGuest}}
                  <div class="row">
                      <div class="col-12 col filters">
                          <div class="input-group">
                              <input type="checkbox" id="guest-filter">
                              <label for="guest-filter" >{{i18nMsg "arrange_and_approve_only_guest" }}</label>
                          </div>
                      </div>
                  </div>
              {{/if}}
          </div>
      </div>
      <div class="row">
          <div class="col col-12">
              <div class="inline-tabs box-theme tabs-stretch user-picker-content">
                  <ul class="tabs">
                      <li class="tab active" data-tab="{{tabs.first.id}}">
                          <a href="{{tabs.first.url}}" class="{{#if tabs.first.selected}}on{{/if}}">{{tabs.first.name}}</a>
                      </li>
                  </ul>
                  <div class="tabs-container current full-height">
                      <div class="table-container tab-pane full-height {{#if tabs.first.selected}}on{{/if}}" id="{{tabs.first.id}}">
                          <header>
                              <span id="{{tabs.first.id}}-count">&nbsp;</span>                   
                          </header>
                          <div id="{{tabs.first.id}}-results">
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="loader-container middled">
        <span class="loader loading"></span>
      </div>
  </div>
  `);


  userRowTmpl = Handlebars.compile(`<div class="input-group">
    <input type="checkbox" class="user-selection replay-safe" data-user-id="{{this.user_id}}" value="{{this.user_id}}" id="{{../type}}-{{this.user_id}}" {{#if selected}}checked{{/if}}>
        <label for="{{../type}}-{{this.user_id}}">
      <div class="flex-parent space-between align-start user-info">
        <div class="label-text no-text-overflow user-name" title="{{{this.first_name}}} {{{this.last_name}}}">
          {{{this.first_name}}} {{{this.last_name}}}
                </div>
        {{#if this.isGuest}}
                    <span class="sub-text guest-user right">{{ i18nMsg "arrange_and_approve_guest_users" }}</span>
        {{/if}}
            </div>
      <div class="label-text no-text-overflow email" title="{{{this.email}}}">{{{this.email}}}</div>
    </label>
  </div>`);

  CLASSES = {
    inProgress: 'in-progress'
  };
  MODAL_OPTIONS = {
    modalId: 'user-picker',
    title: 'Title',
    panel: true,
    confirm: true,
    panelSize: 'small',
    confirmText: uitk.i18n.msg('profile_save'),
    content: userPickerTmpl()
  };

  function AssignUsers(params) {
    this.$container = '';
    this.$elem = '';
    this.$target = '';

    this.canSearch = params.canSearch;
    this.dataAdapter = params.dataAdapter;
    this.rowTmpl = params.rowTemplate || userRowTmpl;
    this.page = {
      start: 0,
      current: 0
    };

    this.search = _.extend({
      placeholder: uitk.i18n.msg('contact_tm_search'),
      limit: 1
    }, params.search);

    this.methods = {
      onSave: params.onSave || function () {}
    };

    preLazyLoad = params.preLazyLoad || function ($container, $table) {
      $container.css('height', 'calc(100vh - 66px - 63px - 48px)');
      $table.css('height', 'calc(100vh - 427px)');
    };

    this.modalOptions = _.extend({}, MODAL_OPTIONS, params.modalOptions);
    this.modalOptions.content = userPickerTmpl({
      canSearch: this.canSearch,
      searchPlaceholder: this.search.placeholder
    });

    this.templateData = params.templateData || {
      title: uitk.i18n.msg('profile_title'),
      content: {}
    };
  }

  AssignUsers.prototype.addListeners = function () {
    var self;

    self = this;

    uitk.unsubscribe('modal.confirm');
    uitk.subscribe('modal.confirm', function (event) {
      self.onModalSubmit();
    });

    uitk.unsubscribe('modal.close');
    uitk.subscribe('modal.close', function (event) {
      self.onModalCancel();
    });

    uitk.unsubscribe('tables.loadMore');
    uitk.subscribe('tables.loadMore', function (evt, elem) {
      self.onLoadMore(evt, elem);
    });

    this.$elem
      .off('keyup', '#search-query')
      .on('keyup', '#search-query', function (evt) {
        self.onSearch(evt);
      });
  };

  AssignUsers.prototype.showUsers = function (onLoad) {
    var modal;

    modal = uitk.modal.create(this.modalOptions);

    modal.open();

    this.$elem = $('#user-picker');
    this.$container = $('#user-picker-content');
    this.resetPagination();

    this.addListeners();

    onLoad(this.$container);
  };

  AssignUsers.prototype.hideLoader = function () {
    this.$elem.removeClass(CLASSES.inProgress);
  };

  AssignUsers.prototype.showLoader = function () {
    this.$elem.addClass(CLASSES.inProgress);
  };

  AssignUsers.prototype.setResultsContainer = function (elemId) {
    this.$target = $(elemId);
  };

  AssignUsers.prototype.setDataAdapter = function (dataAdapter) {
    if (!dataAdapter) {
      return;
    }

    this.dataAdapter = dataAdapter;
  };

  AssignUsers.prototype.render = function (users) {
    var usersHtml;

    usersHtml = [];

    if (!users || users.length < 1) {
      this.$target.html('<div class="col col-12">' + uitk.i18n.msg('users_selected', {
        arg0: '0'
      }) + '</div>');
      return;
    }

    _.each(users, function (user) {
      usersHtml.push(this.rowTmpl(user));
    }.bind(this));

    this.$target.html(usersHtml.join(''));
    setupForLazyLoading(this.$container);
  };

  AssignUsers.prototype._appendResults = function (users, $table) {
    var usersHtml, noResultsMsg;

    usersHtml = [];
    noResultsMsg = '<td>' + uitk.i18n.msg('arrange_and_approve_no_more_results_to_load') + '</td>';

    if (users.length < 1) {
      $table.find('.table-msg-container').html(noResultsMsg);
      return;
    }

    _.each(users, function (user) {
      usersHtml.push(this.rowTmpl(user));
    }.bind(this));

    uitk.publish(
      'tables.loadFinish', {
        tableElem: $table,
        tableData: usersHtml,
      },
      'down'
    );
  };

  AssignUsers.prototype.resetPagination = function () {
    this.page = {
      start: 0,
      current: 0
    };
  };

  AssignUsers.prototype.onSearch = function (evt) {
    var self,
      query;

    query = evt.target.value.trim();
    self = this;

    if (searchQuery === query) {
      return;
    }

    searchQuery = query;
    this.resetPagination();

    if (query.length < 1) {
      this.dataAdapter
        .getAllUsers()
        .then(function (users) {
          self.render(users);
        });

      return;
    }

    if (!query || query.length < this.search.limit) {
      return;
    }

    this.dataAdapter
      .getUsersByQuery(query)
      .then(function (users) {
        self.render(users);
      });
  };

  AssignUsers.prototype.onLoadMore = function (evt, $table) {
    this.page.start = getNextPage(this.page.start);
    this.page.current = getNextPageNumber(this.page.current);

    this.dataAdapter
      .getMoreUsers({
        query: searchQuery,
        start: this.page.start,
        currentPage: this.page.current
      })
      .then(function (users) {
        this._appendResults(users, $table);
      }.bind(this));
  };

  AssignUsers.prototype.onModalCancel = function () {

  };

  AssignUsers.prototype.onModalSubmit = function () {
    this.methods.onSave();
  };

  // Local methods
  function setupForLazyLoading($container) {
    var $lazyLoadTable;

    $lazyLoadTable = $container.find('.data-table-lazyload');
    $lazyLoadTable.off('scroll');

    preLazyLoad($container, $lazyLoadTable);

    // setTimeout(function () {
    $lazyLoadTable.on('scroll', function () {
      var $this = $(this),
        $table = $(this).find('.data-table'),
        innerHeight = $this.height(),
        scrollTop = $this.scrollTop(),
        scrollHeight = $this[0].scrollHeight;

      if (scrollTop + innerHeight >= scrollHeight) {
        $table['uitk_table']('addLoadMsg', $table, 'down');
      }
    });
    // }, 100);
  }

  function getNextPage(currentPage) {
    return currentPage + 20;
  }

  function getNextPageNumber(currentPage) {
    return currentPage + 1;
  }

  window.AssignUsers = AssignUsers;
})();
