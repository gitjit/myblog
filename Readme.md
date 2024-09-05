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


