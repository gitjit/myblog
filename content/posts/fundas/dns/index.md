
+++
title = 'Understanding DNS: How It Works with a Real Example'
date = 2024-09-05
categories = ["Foundation"]
toc = true
+++



Have you ever wondered what happens behind the scenes when you type a URL like jithesh.blog into your browser? You simply expect to see the website, but there’s an entire system working in the background to make that happen. This system is called the Domain Name System (DNS).

In this post, I’ll walk you through how DNS works, using my own blog (jithesh.blog) as an example. By the end, you’ll understand how DNS translates a domain name into an IP address and connects you to the right server. 

<img src="dns.webp" alt="DNS Image Example" style="width:60%; height:auto;">

## What is DNS ?  
DNS stands for Domain Name System, and it’s often referred to as the “phonebook of the internet.” Just like how a phonebook matches names to phone numbers, DNS matches domain names (like jithesh.blog) to IP addresses (like 185.199.108.153), which are the “addresses” of servers on the internet.  

Without DNS, we would need to remember long, difficult-to-read IP addresses instead of simple domain names.  

## How DNS Works: A Step-by-Step Example  
Let’s break down how DNS works with a practical example of what happens when you type jithesh.blog into your browser and hit "Enter."  

**Step 1: The User Enters jithesh.blog in Their Browser**  
The process starts when someone enters jithesh.blog into their browser. The browser doesn’t immediately know how to find the website, so it first needs to resolve the domain into an IP address.  

**Step 2: The DNS Query Begins**
The browser sends a request to something called a DNS resolver. This resolver is usually provided by your internet service provider (ISP), or it could be a custom one like Google’s DNS (8.8.8.8). The resolver’s job is to find the IP address for jithesh.blog.  

**Step 3: The DNS Resolver Queries the Root DNS Servers**  
If the resolver doesn’t have the answer in its cache, it starts the process by asking the root DNS servers. These root servers are like the top of the DNS hierarchy, and they know which servers to ask next for more specific information.  

The root server doesn't know the IP for jithesh.blog, but it knows which server is responsible for the .blog top-level domain (TLD). 

**Step 4: Querying the TLD Name Server**
The resolver is then directed to a TLD name server (in this case, for .blog). The .blog TLD server knows which authoritative DNS server is responsible for jithesh.blog.  

**Step 5: Querying the Authoritative DNS Server (Square Domain)**
Now, the resolver is directed to the authoritative DNS servers for jithesh.blog. In this case, these are the Square servers (since Square is where I registered my domain).  

At Square, I’ve configured the following DNS records:

* A Records: These records point my domain (jithesh.blog) to GitHub Pages' IP addresses.
* CNAME Record: This record is for the subdomain www.jithesh.blog, pointing it to username.github.io, which is GitHub's domain for serving Pages.  

Square returns these DNS records to the resolver:  

* A Record: Maps jithesh.blog to GitHub Pages’ IP addresses (e.g., 185.199.108.153).
* CNAME Record: Maps www.jithesh.blog to username.github.io (replace username with your GitHub username).

**Step 6: Returning the IP Address to the Browser**  
The authoritative DNS server returns the IP address (185.199.108.153) for jithesh.blog to the resolver, which passes it back to the user’s browser. Now the browser knows the IP address of the server that hosts the content for jithesh.blog.  

**Step 7: The Browser Connects to the Server**
With the IP address in hand, the browser sends a request to GitHub’s servers (at 185.199.108.153). GitHub Pages then serves the content of my blog to the user’s browser.  

**Step 8: GitHub Resolves the Request for jithesh.blog**  
Once the request reaches GitHub's servers, GitHub needs to ensure that it's serving the correct content for jithesh.blog. Here’s how it does that:

* In my GitHub repository (username.github.io), I have a CNAME file that contains my custom domain (jithesh.blog). This file tells GitHub Pages that this repository is associated with jithesh.blog.

* GitHub checks the CNAME file and recognizes that the request is targeting jithesh.blog. It then serves the content from my repository accordingly.  

This step is critical because GitHub Pages can host multiple sites for different users. The CNAME file ensures that requests to jithesh.blog are mapped to the correct repository. GitHub does not receive or handle the CNAME record directly. Instead, it uses the Host header and the CNAME file in your repository to serve the correct content.

**Step 9: The Blog is Displayed**  
Finally, the user’s browser renders my blog (jithesh.blog) for them to see. All of this happens in a fraction of a second!  

## What are A Records and CNAME Records?

When configuring a custom domain like jithesh.blog for a service like GitHub Pages, several types of DNS records are involved. Let’s go over the most important ones:

**A Records**: These are the key records that point a domain to an IP address. In my case, I have set multiple A records for jithesh.blog, pointing to GitHub’s IP addresses:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

```  
These records ensure that any request to jithesh.blog is routed to GitHub’s servers.

**CNAME Records**: A CNAME (Canonical Name) record maps one domain name to another. In my setup, I use a CNAME record to map www.jithesh.blog to username.github.io. This means that when someone types www.jithesh.blog, the DNS system understands that this is an alias for username.github.io, and the request is routed to my GitHub Pages site.

## DNS Caching: Why It’s Fast 
To speed up the whole process, DNS uses caching. Both the resolver and your browser will temporarily store DNS responses for domains that have already been looked up. This means that the next time you (or someone else) visits jithesh.blog, the DNS query might not need to go through all of those steps again—it can be answered from the cache, making the process even faster.  

## HTTPS: Securing the Connection
Once DNS has resolved the domain name to an IP address, and the browser has connected to the server, GitHub Pages also provides an SSL certificate to secure the connection. This enables HTTPS, ensuring that the data exchanged between the user’s browser and my blog is encrypted.

GitHub automatically provides free SSL certificates via Let’s Encrypt, so I don’t need to purchase one separately. All I had to do was enable HTTPS in my GitHub Pages settings.  

## Conclusion  
DNS is one of the most fundamental systems of the internet, translating human-readable domain names into IP addresses that computers can understand. By using DNS, I was able to set up a custom domain for my blog, jithesh.blog, and host it on GitHub Pages.

Square, as my DNS provider, returns both A records (pointing my domain to GitHub’s IP addresses) and a CNAME record (for www.jithesh.blog). GitHub Pages then resolves the request and serves the correct content for jithesh.blog, ensuring that the website is accessible to anyone around the world.

The next time you type a URL into your browser, remember that there’s a whole network of DNS servers working in the background to get you to the right place!

