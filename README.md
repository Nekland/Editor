Nekland Editor
==============

[![Gitter chat](https://badges.gitter.im/Nekland/Editor.png)](https://gitter.im/Nekland/Editor)

Warning: This script is currently in hard-development (in facts, you can talk about "heavy dev").
![Nekland Editor Logo](https://files.nekland.fr/editor-logo.webp)

Why the fuck dev one more WYSIWYG ?
-----------------------------------

1) For now, the best editor is RedactorJS. Take a look to his price...

2) There is no (good) other editor fully working with HTML5

3) There is no (good) other editor that provide clean HTML to you


Features
--------

Nekland editor is

  * Clean
  * Light
  * Easy to use
  * Easy to extends
  * Easy to improve
  * Documented (see docs folder)

Nekland editor is not

  * Compatible with old browsers
  * Perfect (for now)

![Screenshot](https://raw.github.com/Nekland/Editor/master/screenshot.png)


Compile me
----------

There is a simple way to compile this project:

```bash
cd Editor
npm install
grunt
```

Compiled files are available in the release directory.


Try the demo
------------

Since there is a picture upload, you should probably test it with PHP. Open your terminal and use the following commands:

```bash
cd Editor
php -S localhost:8000
```

Then go to [http://localhost:8000/demo/](http://localhost:8000/demo/).


Test me
-------

To launch functionnals tests you will need to install phantomjs and casperjs.

Then just launch like that:

```bash
./test.sh all
```

