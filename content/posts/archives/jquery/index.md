+++
title = 'JQuery : Basics'
date = 2015-03-03
categories = ['Web']
+++
This post covers some basic JQuery. JQuery is a Javascript library which is actually a large single.js file that
has many prebuilt methods and objects that can simplify your workflow, specifically interaction with DOM and making HTTP
requests (AJAX). We can understand this with a simple example as shown below..

Let us make a Javascript and equivalent JQuery call to select all div's in a web page.   

``` javascript
// Javascript
var divs = document.querySelectorAll('div');

//JQuery 
var divs = $('div')

```

Now let edit style in both in an element el.

```javascript
//JQuery
$(el).css('border-width', '20px')

//javascript
el.style.borderWidth = '20px'

$('h2').css('color','blue')

$('h2').css('background','yellow')	

newCss = {'color' : 'blue', 'background' : 'green', 'border' : '2px solid red'}
$('h2').css(newCss)

listItems = $("li")
listItems.css('color', 'blue')
listItems.eq(1).css('color', 'red')

```  
Now let us change text and html using JQuery

```jquery
$("h2").text()
"This is to learn Jquery in console."
$("h2").text("New Text from JQuery")

$("h2").html()
"New Text from JQuery"
$("h2").html("<em>New Text from JQ html </em>")


```

Now let us change some attributes using JQuery.

```jquery
$("a").attr("href","http://www.amazon.com")  

$("input").attr('type','checkbox') 

$("input").val("jj@gmail.com")

```

Events in JQuery

```javascript 

$('h1').click(function(){
    $(this).text("Changed h1")
})

$('li').eq(1).click(function(){
    $(this).text("First Li clicked !")
})

$('h2').on('click', function(){
    $(this).toggleClass("turnRed")
})

```



_Coding is fun enjoy..._  