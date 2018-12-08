[docsite]: https://wwwegenciacom.int-maui.sb.karmalab.net/uitoolkit-doc-site/

# Protokit Static App

This version of **Protokit** was created to get you up and running without any development build steps. With this version, you can:

* Create a static HTML prototype right out of the box. No build steps necessary.
* Add custom styles and scripts directly into the prototype file.
* Use the UIToolkit components as presented on the [UIToolkit Doc Site][docsite]

## Get Started

Open the `index.html` file in the main folder to get going. Insert your HTML inside of the script with the id of `prototype-template`:

```
<!-- Begin prototype -->
  // Your prototype HTML
<!-- End prototype -->
```

**NOTE:** You can add HTML outside of this script template, but this HTML would be completely static and cannot access any Handlebars context data or partial files.

*Looking for an example of a static prototype? Check out the `example.html` file!*

## Using Partials

Some components can be created using Handlebars partials. To use them in your file, review use cases on the [UIToolkit Doc Site][docsite].

## Prototype Data

If you want to add data to use inside of your handlebars file, update the `prototypeData` object. For example:

```
var prototypeData = {
  pageTitle: "Hello there",
  description: "This is my description",
  user: {
    firstName: "Jane",
    lastName: "Smith",
    company: "The Protokit Company",
    type: "Traveler"
  }
};
```

Inside the `prototype-template`, you can now access these values with your markup. Open `example.html` to see an illustration of this.

## Important Changes

In order to compile Handlebars on the client-side and have access to UITK partials, the `uitk-handlebars.js` file was altered to the full version of Handlebars. This custom file can be found in `assets/js/prototype/prototype-handlebars.js`.