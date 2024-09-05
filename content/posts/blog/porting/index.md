+++
title = 'Porting from Jekyll to Hugo'
date = 2024-09-05
categories = ["Hugo"]
toc = true
+++

## Introduction  
Migrating blog posts from one platform to another can be a daunting task, especially when you have years of content. In this post, I will walk through how I ported my existing Jekyll blog posts to Hugo by converting Markdown files, extracting images, updating image tags, and replacing Jekyll's front matter with Hugo-compatible front matter. This process allows for a seamless transition and ensures that all your content is properly formatted in the new environment.  

<img src="jekyl-hugo.webp" alt="Hugo Image Example" style="width:50%; height:auto;">

## Why migrate from Jekyll to Hugo?  
Jekyll and Hugo are both static site generators, but Hugo is known for its speed and flexibility, especially when dealing with large sites. Hugo’s templating system and the ability to use leaf and branch bundles make content organization simple.

This blog will focus on porting Markdown files, as well as how we used Python to automate the conversion.  

## Extracting Images from Markdown    
Jekyll blog posts often have images embedded in Markdown files using relative paths. When migrating to Hugo, these images need to be extracted and relocated to a consistent directory structure.   
We wrote a Python script to extract image paths from the Markdown files, copy the images to a new folder, and update the image tags in the Markdown files.


```python 

import os
import re
import shutil

def extract_images(markdown_file, root_image_folder):
    # Get the base name of the markdown file (without extension)
    markdown_filename = os.path.basename(markdown_file)
    folder_name = os.path.splitext(markdown_filename)[0]

    # Set the destination folder to store extracted images
    destination_folder = os.path.join(os.getcwd(), folder_name)
    os.makedirs(destination_folder, exist_ok=True)

    # Read the markdown file
    with open(markdown_file, 'r', encoding='utf-8') as file:
        markdown_content = file.read()

    # Regular expression to find both Markdown and HTML image references
    image_pattern = r'!\[.*?\]\((.*?)\)|<img.*?src=["\'](.*?)["\']'
    image_paths = re.findall(image_pattern, markdown_content)

    # Copy the images and update image paths in markdown
    updated_image_paths = {}
    for img in image_paths:
        image_path = img[0] if img[0] else img[1]
        full_image_path = os.path.join(root_image_folder, os.path.basename(image_path))
        if os.path.exists(full_image_path):
            new_image_path = os.path.join(destination_folder, os.path.basename(full_image_path))
            shutil.copy(full_image_path, new_image_path)
            updated_image_paths[image_path] = os.path.basename(new_image_path)

    # Update image paths in the markdown content
    for old_path, new_path in updated_image_paths.items():
        markdown_content = markdown_content.replace(old_path, new_path)

    # Write the updated markdown content back to file
    with open(markdown_file, 'w', encoding='utf-8') as file:
        file.write(markdown_content)

```


The script uses regular expressions to find image paths in Markdown files.It copies the images to a new folder and updates the Markdown files to point to the new image paths.  

## Replacing the Front Matter  
Jekyll posts use YAML front matter (---), while Hugo supports TOML (+++) and YAML. Additionally, we need to adjust fields like categories to fit Hugo’s front matter structure. We wrote a Python script to replace Jekyll’s front matter with Hugo-compatible front matter.This script extracts the YAML front matter used by Jekyll and replaces it with Hugo-compatible TOML front matter. The tags field in Jekyll becomes categories in Hugo.

```python
import re
import yaml

def replace_front_matter(markdown_file):
    with open(markdown_file, 'r', encoding='utf-8') as file:
        markdown_content = file.read()

    # Regex to capture front matter in Jekyll
    front_matter_match = re.match(r'^---\s*[\n\r]+(.*?)\s*---\s*[\n\r]+', markdown_content, re.DOTALL)
    if front_matter_match:
        front_matter_yaml = front_matter_match.group(1)
        front_matter = yaml.safe_load(front_matter_yaml)
        title = front_matter.get('title', 'Untitled')
        date = front_matter.get('date', '')
        categories = front_matter.get('tags', [])
        # Generate Hugo front matter
        new_front_matter = f"+++\ntitle = '{title}'\ndate = {date}\ncategories = {categories}\n+++\n"
        # Remove old front matter and replace it with Hugo's
        markdown_body = re.sub(r'^---\s*[\n\r]+.*?\s*---\s*[\n\r]+', '', markdown_content, flags=re.DOTALL)
        updated_markdown = new_front_matter + markdown_body

        # Write updated markdown
        with open(markdown_file, 'w', encoding='utf-8') as file:
            file.write(updated_markdown)

```  

## Structuring Posts as Leaf Bundles in Hugo  
In Hugo, content is structured into leaf bundles (a directory with an index.md file and other resources like images) for better organization of blog post. We need to convert Jekyll posts into leaf bundles.  
For each Markdown file, we place it into a folder (named after the post) and name the Markdown file index.md to follow Hugo’s leaf bundle structure.  

```python
import os
import shutil

def create_leaf_bundle(markdown_file):
    # Get the base name of the markdown file (without extension)
    markdown_filename = os.path.basename(markdown_file)
    folder_name = os.path.splitext(markdown_filename)[0]

    # Create a folder for the leaf bundle
    leaf_bundle_folder = os.path.join(os.getcwd(), folder_name)
    os.makedirs(leaf_bundle_folder, exist_ok=True)

    # Move the markdown file into the leaf bundle folder and rename it to index.md
    new_md_path = os.path.join(leaf_bundle_folder, 'index.md')
    shutil.move(markdown_file, new_md_path)

```  
This script renames each Markdown file to index.md and moves it into a dedicated folder to create a leaf bundle.Hugo will treat each of these folders as a self-contained post, complete with its images.  

## Automatic the full process 
Here’s the full Python script that combines the image extraction, front matter replacement, and leaf bundle creation processes  

```python 
def process_markdown_file(markdown_file, image_folder):
    extract_images(markdown_file, image_folder)
    replace_front_matter(markdown_file)
    create_leaf_bundle(markdown_file)

# Loop through all markdown files in a folder
for markdown_file in os.listdir('path_to_markdown_files'):
    if markdown_file.endswith(".md"):
        process_markdown_file(os.path.join('path_to_markdown_files', markdown_file), 'path_to_images')

```  
This script handles everything: extracting images, replacing front matter, and converting the posts to Hugo-compatible leaf bundles. 

```sh
python img_util/md_img.py "C:/path/to/markdown-folder" "C:/path/to/images"
```

## Conclusion  
Migrating from Jekyll to Hugo can be automated using Python scripts to extract images, update Markdown files, and replace front matter. With these tools, I was able to quickly port my entire blog, maintaining the structure and content integrity. Hugo’s speed and flexible templating system make it a great choice for managing large static sites.