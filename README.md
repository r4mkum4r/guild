# Protokit

[dropbox]: https://www.dropbox.com/sh/xocj0qbfdweevy1/AADiZPbVmDRGk3zN_YE8jkW-a?dl=0
[bitbucket]: https://stash.sea.corp.expecn.com/projects/EGES/repos/protokit/browse
[uitk doc site]: https://wwwegenciacom.int-maui.sb.karmalab.net/uitoolkit-doc-site/
[introduction]: #introduction
[get started]: #get-started
[setup machine]: #setup-machine
[start prototype]: #start-prototype
[gulp]: #gulp
[less]: #write-less
[sync uitk]: #sync-uitk
[issues]: #issues
[changelog]: #changelog
[todo]: #todo

* [Introduction][introduction]
* [Get Started][get started]
* [Setup Your local machine][setup machine]
* [Start a new prototype][start prototype]
* [Working with gulp][gulp]
* [Writing less][less]
* [Sync UITK components][sync uitk]
* [User issues][issues]
* [Changelog][changelog]
* [Todo][todo]

<a name="introduction"></a>
## Introduction

The Egencia design team strives to provide HTML prototypes as soft deliverables for internal review, testing, and iteration. This allows other teams to not only examine new components in their native web environment but also analyze module behavior and user interaction. **Protokit** affords the design team a way to test responsive presentation and how components will restructure across multiple devices and screen sizes.

Creating HTML prototypes helps the Egencia design team adhere to the principles of the [RITE Method](https://en.wikipedia.org/wiki/RITE_Method) or Rapid Iterative Testing and Evaluation. The team can quickly test alternative styles, colors, etc., as well as update component layouts and code structure. Protokit serves as a boilerplate for creating new prototypes quickly, attempting to make the process as easy as possible.

Protokit utilizes assets provided by Egencia's internal UI Toolkit (**UITK**). These assets are automatically updated as new versions of UITK are released.


<a name="get-started"></a>
## Get Started

You can access Protokit with either Stash (Bitbucket) or Dropbox. You will need to install git and node on your computer before forking the Stash repo. Learn how to [setup your local machine][setup machine].

### Static and Server Setups

There are two different iterations of Protokit available:

* **Static** - A static version of Protokit gives you a bare bones boilerplate to work from. The *index.html* file contains all the necessary css/js provided by UITK. This is useful for throwing together quick, static HTML templates or components.
* **Server** - The server-based version is built upon the [Sails.js](http://sailsjs.com/) framework, allowing you to create robust prototype workflows. Read through the [Sails.js documentation](http://sailsjs.com/documentation/reference).

### Protokit Links
Get started with Protokit:

* [Protokit static app on Dropbox][dropbox]
* [Protokit repo on Bitbucket][bitbucket]


<a name="setup-machine"></a>
## Setup Your local machine

If you haven't done so already, there are a few steps you'll need to take to get up and running with the tools used in Protokit if you're forking the repo.

### Install npm

*"[npm](https://docs.npmjs.com/getting-started/what-is-npm) makes it easy for JavaScript developers to share and reuse code, and it makes it easy to update the code that you're sharing."*

Follow the [getting started](https://docs.npmjs.com/getting-started/installing-node) instructions to get your local machine setup with npm.

### Create a Stash account and install git

If you don't have a user account with Stash (Egencia's git repository software which is now known at [Bitbucket](https://www.atlassian.com/software/bitbucket/server)) and [git installed](https://www.atlassian.com/git/tutorials/install-git/) on your computer, you will need to take care of both so that you can then [clone the Protokit repo](https://confluence.atlassian.com/bitbucketserver/clone-a-repository-790632786.html).

Follow these steps:

1. [Install git](https://www.atlassian.com/git/tutorials/install-git) locally.
2. Clone the [Protokit repo](https://confluence.atlassian.com/bitbucketserver/clone-a-repository-790632786.html).
3. Add Protokit dependencies ([read more below](#add-dependencies))
4. Review Atlassian's documentation on [getting started with Bitbucket](https://confluence.atlassian.com/bitbucketserver/getting-started-776640896.html).

> *"Oh boy. This is too technical for me. I don't really know what I'm doing..."*
	
That's OK! Ask a developer to assist you if you feel overwhelmed with the process. They should be happy to help. We've all been in your shoes at some point :)

> *"But I just need to create a quick prototype using components from UITK..."*

No problem! You can copy the Protokit app directory from Dropbox and work with the static boilerplate. It has access to all of the latest UITK assets so you can begin the assembly of your prototype.

### Download the Heroku CLI

*This needs clear documentation*

You will need to use the [Heroku Command Line Interface (CLI)](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) to manage your applications on Heroku.

Read more about [Sails.js deployment to Heroku](https://vort3x.me/sailsjs-heroku/).

<a name="add-dependencies"></a>
### Add Protokit dependencies

Open up a terminal window and `cd` into the `protokit` directory. In this root directory, run:

- `npm install`
- `bower install`

These commands will download all of the packages that Protokit depends on. If you're curious about which packages are being installed, you can browse the `packages.json` and `bower.json` files. These packages are ignored inside the `.gitignore` since they can add bloat to the repo.

<a name="start-prototype"></a>
## Start a new prototype

### Static version

1. [Download Protokit from Dropbox][dropbox], duplicate the `protokit-static-app` directory and move this copy to your desktop (or directory of choice).
2. Rename this folder.
3. Open this directory in your text editor.
4. The `index.html` is a boilerplate that includes all of the js/css dependencies. You can now begin editing this file. Since it's just HTML, you can open the file in your browser to see your changes.

### Server version

1. [Clone the Protokit repository](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone) to your local machine if you haven’t already.
2. Duplicate the entire directory and rename it to whatever suits the prototype you will be working on. **Note:** If you already have the main repo on your local machine, do a `git pull` on this directory before duplicating to ensure Protokit is up-to-date.
3. Consider removing this README and generating one specific to this prototype. Including any information about what is being presented can benefit others when working on these files.
4. Navigate to your prototype's server directory. Type `sails lift` to start up your app.
5. Once lifted, [BrowserSync](https://www.browsersync.io/docs) will open a new browser window with your prototype. Any changes you save will be automatically reflected in your browser window.
6. You can begin building your prototype in the `views/prototype.hbs` file. You can create partials and add them in the `partials/include` directory.
7. If you want to take your prototype to the next level, then you may want to learn about the [anatomy of a sails.js application](http://sailsjs.com/documentation/anatomy).

### Add Protokit dependencies

See information about Protokit dependencies in the [setup process][start prototype].


<a name="write-less"></a>
## Writing Less

What is [less](http://lesscss.org/), you ask?

*"Less is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themeable and extendable."*

When writing your less code, consider following best practices outlined on the [UITK doc site][uitk doc site]. This will allow your prototype handoffs to be as close as possible to delivering production-ready code. Developers will love you for it.

### Mixins and Utility Classes

Have a look through the available [mixins](https://uitk-lab.sb.karmalab.net/uitk-doc-site/base/mixins) and [utility classes](https://uitk-lab.sb.karmalab.net/uitk-doc-site/base/utility-classes) provided by UITK. You will be happy you did.


<a name="sync-uitk"></a>
## Sync UITK Components

**NOTE: This has been deprecated. A [protokit-updater](https://stash/projects/EGES/repos/protokit-updater/browse) will fetch UITK assets every time a new release is deployed from master.**

There may be times that it will become necessary to update your local UITK component files. It could be that UITK developers introduced a new less mixin, additional brand value variables, new handlebar templates, and so on. Well lucky for us: there's a Gulp task for that!

Simply run `gulp uitkupdate` in your terminal window. This will gather the following assets:

* From **uitoolkit-doc-site** repo:
	* `templates.js` (renamed `uitk-templates.js`)
	* `uitk-core.css`
	* `images` directory assets
* From **uitoolkit-core** repo:
	* `mixins.less`
	* `brand-values.less`
	* `fonts` directory assets
	
These files will be updated in their respective directories. Now you're ready to use that gorgeous new mixin that your favorite UITK developer has been raving about.

<a name="issues"></a>
## User issues

When issues arise and are solved, mapping the steps to the solution can benefit others. Add them to this list.

| Issue | Solution |
|:--|:--|
| *Write a description of the issue (include and steps taken, browser information, etc)* | *Explain how this issue can be solved by following these steps* |
| | |
| | |


<a name="changelog"></a>
## Changelog

The changelog is exposed in this README to provide details on any changes made to Protokit. Keep your peers (and yourself) in the know!

### 1.0.0 - Hummingbird

- Create beta release of prototyping environment
- Add process documentation


<a name="todo"></a>
## Todo

* **Test handlebar partials are working**
	* How will data be added to a partial
		* i.e. *header.json* data added to *header.hbs* template
	* `uitk is not defined` - uitk object not available in handlebars templates when compiled*
	* Test JSON data
* Create/test paginated workflow
* Ability to fork other repos and pull in sandbox components
* Git commit message styles/rules
* Walk through Protokit setup process
* Templates need to render client side
	* Higher learning curve
* Grunt task - git archive, copy files
* Check to see if assets exist inside the repo or if we have to get them from assets.egencia

git filter-branch --prune-empty --tree-filter '
if [[ ! -e spring-mvc-webapp-archetype ]]; then
    mkdir -p spring-mvc-webapp-archetype
    git ls-tree --name-only $GIT_COMMIT | xargs -I files mv files spring-mvc-webapp-archetype
fi'