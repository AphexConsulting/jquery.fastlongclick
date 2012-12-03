# jquery.fastlongclick

Attach an event handler for fast clicks and long clicks to selected elements.

Fast clicks avoid the 300ms timeout in most touch devices.

Long clicks are for cases when you want multiple activities in the same element - usually with touch devices. With long click you can attach a handler for the case when the user holds their finger on the element for one second or longer.

## Installing

1. Clone the repository
1. Place `jquery.fastlongclick.js` to your project's JavaScript folder
1. Use a `<script type="text/javascript" src="js/jquery.fastlongclick.js"></script>` to your HTML
1. Add a script that registers your handler function with .fastclick() or .longclick().

## Example

```JavaScript
$('#id').removefastlongclicks();
$('#id').fastclick(function() {
  // handler for element with id #id for normal clicks
});
$('#id').longclick(function() {
  // handler for element with id #id for long clicks
});
```

## Known issues

On Android in some situations the tocuhstart event is not always fired. For some reason running the following code before registering the fastlongclick events solves the issue. If you know a fix for this problem, please contact me.

```JavaScript
var events = 'mousedown touchstart mouseup touchend click mousemove touchmove touchcancel mouseout';
$(document).off(events);
$(document).on(events, function(e) { });
```

# License

The library is licensed under the MIT-license:

> Copyright (C) 2012 Aphex Consulting Oy

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
