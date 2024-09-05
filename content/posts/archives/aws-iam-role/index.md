+++
title = 'AWS Essentials : IAM Roles'
date = 2020-01-07
categories = ['AWS']
+++
In this post, we will discuss about AWS IAM roles and how it secure our AWS resource and how to set it up.

Let us consider a scenario in which you have an S3 Bucket and your EC2 instance needs to access the S3 Bucket.  The quickest and dirtiest way to do this is to store the access keys in EC2 instance and access the buckets. 

<img src="2020-11-21-11-30-46.png" class="img-responsive"/>

Given below shows how to store the AWS credentials in EC2 Instance and then access the S3 bucket.

<img src="2020-11-21-11-31-34.png" class="img-responsive"/>

The drawback with this approach is your AWS key pairs are out in the EC2 instance and not secure.  

<img src="2020-11-21-11-33-36.png" class="img-responsive"/>  

So best way to do this is to create a role with a policy to read the S3 buckets and assign the role to EC2 Instance. So when EC2 requires to access the S3 Bucket, it will assume this role and requests a temporary credentials and access the S3 bucket. (No access keys / secrets) are involved.  

<img src="2020-11-21-11-35-04.png" class="img-responsive"/>  

Go to IAM → Create a Role → EC2→ Select following predefined policy  

<img src="2020-11-21-11-36-19.png" class="img-responsive"/>  

<img src="2020-11-21-11-37-22.png" class="img-responsive"/>  

<img src="2020-11-21-11-38-07.png" class="img-responsive"/>  

Now to EC2 instance → Attach/Replace IAM Role  

<img src="2020-11-21-11-38-46.png" class="img-responsive"/>  

Now S3 can list the buckets with out storing any key / secrets in it.  

<img src="2020-11-21-11-39-27.png" class="img-responsive"/>  

Happy Clouding...