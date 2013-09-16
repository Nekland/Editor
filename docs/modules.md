How modules work
================


If you create a new module, it must implement the following interface
```javascript
var ModuleInterface = {
	getTemplateBefore: 'function',
	getTemplateAfter:  'function'
	// Not complete.
};
```
Notice that you juste have to implements theses methods, nothing more (since javascript doesn't support interfaces).

```javascript
window.nekland.Editor.modules.push(myModule);
```