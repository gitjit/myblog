## MyBlog 

This blog is based on hugo and deployed to Github pages. Its not using Github actions.
So once you create a post. Use the front matter from an existing post. This post is using leaf packaging to ensure images and markdown files are side by side. The theme we are using is 'hugo-blog-awesome' and its created as a git submodule. So don't check-in that. Also we have overrided themes in our layouts. 

## Front Matter

```toml
+++
title = 'Hugo Essentials'
date = 2024-09-02
categories = ["Hugo"]
toc = true
+++

```

## Publishing 

For local run use command

```sh
hugo server -disableFastRender

```
For publishing , first ensure the blog is running is as expected locally then run following command.

```sh
hugo --minify 
```
This command will generate all the public files and images to docs folder. Then commit the changes including docs folder and push to github.
wait for few minutes for github to take the changes and redeploy.

## Customization  

## Customizing the Category  

To customize how categories are displayed, you created a terms.html file and placed it in your site's _default layout folder to override the theme's default layout.

Create the terms.html file: 

File path: layouts/_default/terms.html.
This file is responsible for rendering the list of categories (terms) on the categories page.  

Adding and Customizing CSS for Categories :
To apply custom styling for categories, you created a custom.scss file, placed it in the assets/scss folder, and referenced it in the head.html file.

To ensure that the custom CSS is applied, you copied the head.html file from the theme and modified it to include your custom SCSS file. You placed the modified head.html in the layouts/partials folder in your site. 

```js
{{- $style := resources.Get "sass/main.scss" | resources.ExecuteAsTemplate "style.scss" . | toCSS (dict "targetPath" "style.css") | minify | fingerprint }}
<link href="{{ $style.RelPermalink }}" rel="stylesheet">

<!-- Add custom SCSS file -->
{{- $customStyle := resources.Get "scss/custom.scss" | toCSS | minify | fingerprint }}
<link href="{{ $customStyle.RelPermalink }}" rel="stylesheet">
```
## Adjusting Content Width  
To adjust the width of your site,I copied the main.scss from the theme and changed width. Then I updated head.html to use this local main.scss than from theme.
