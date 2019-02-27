# Phan-mark

K.I.S.S application for keeping track of custom bookmarks.

### Running

Use an http server of your choice or go to LINK

### Why

To fulfill requirements made by a mysterious collective called Phantom.

More importantly to:
* Provide user with the ability to add/remove bookmarks on a friendly and easy to use site
* Allow the user to access the app without any need for server-interaction (aka fully front-end)

### Solution

A vanilla HTML/CSS/JS app, written in a compact format keeping to low use of any cutting-edge JavaScript syntax in 
order to help compatibility. SEO and CSS optimisation was omitted as the product is not public-facing. 

The app heavily relies on localStorage and JSON for its data structure. The solution is simple, fast, and legible.
Using the `<template>` element the app is able to cleanly copy elements and insert them without then need for ugly
HTML strings in the JavaScript code. We hold all bookmarks in a single array as objects, which are then converted to strings
and held in localStorage (think redis key). 

Because the data is stored in-browser the speeds are fast and reliable.

### Limitations

The short span of development means there are plenty of avenues to improve on. Given more time a better solution would have
been to use a front-end library such as Angular or Vue.js to provide a back-bone of code structure. 
The JavaScript code has many flaws, editing was omitted due to lack of time but could easily be implemented.
Validation isn't being done for string limits, the user could theoretically cause issues with extremely large strings or urls.
URL validation is done via regex which, paired with the string length issue, could cause some interesting interactions. (Freezing, CPU usage)

From a UX/UI point of view the app should have better interaction. Dragging bookmarks would be a great option,
favourite bookmarks that stick to the front would be a nice addition.
