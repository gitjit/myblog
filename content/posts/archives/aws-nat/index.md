+++
title = 'AWS Essentials :NAT Instance and NAT Gateway'
date = 2020-01-05
categories = ['AWS']
+++
In our previous post, we created a private instance and we set up a Bastion host to connect to the private instance. In this post, we will see how we can securely enable external internet access from this private host using NAT. Let's get started. 

There are two ways, you can add NAT support in AWS.  

<img src="2020-11-17-10-30-13.png" class="img-responsive"/>

As mentioned above, NAT instance is old school and should be used only for smaller use cases.  

At this stage, we know that the route table of our private instance has only local entries. Let us see how we can set up NAT.  

### Set up NAT Gateway  
 Nat Gateway is hardware you provision in your public subnet,it gets an Elastic IP and you will update your private subnet route table with the NAT gateway address for external routing. 

<img src="2020-11-17-10-35-11.png" class="img-responsive"/>

Let us create a NAT gateway. Go to the VPC console and → Create NAT Gateway  

<img src="2020-11-17-10-37-05.png" class="img-responsive"/>

Select a public subnet.  

<img src="2020-11-17-10-37-54.png" class="img-responsive"/>

Now select the route table we created for private route table and add new route.   

<img src="2020-11-17-10-38-30.png" class="img-responsive"/>

Add NAT Gateway for all non local destinations.  

<img src="2020-11-17-10-39-23.png" class="img-responsive"/>

Our new routes for private subnet looks like this.   

<img src="2020-11-17-10-40-09.png" class="img-responsive"/>

Now let us try to do a ping from our private instance and see.  

<img src="2020-11-17-10-41-26.png" class="img-responsive"/>

### Set up  NAT Instance  

Ensure you delete the NAT Gateway and disassociate the Elastic IP first. Then let us create a new NAT Instance.  (Its basically an EC2 Instance and there are few specific AMI's to be used for NAT Instance). 

Now our route table shows black hole since we don't have NAT Gateway.    

<img src="2020-11-17-10-43-13.png" class="img-responsive"/>  

Now if you ping, it will fail , since no NAT configured in our route table. Let us fix this by creating a NAT instance. 

This would be what we will be doing and we can also use this NAT Instance as a jump host too.

<img src="2020-11-17-10-44-27.png" class="img-responsive"/>  

Launch Instance → Community AMI  

<img src="2020-11-17-10-45-08.png" class="img-responsive"/>  

<img src="2020-11-17-10-45-41.png" class="img-responsive"/>  

We need port forwarding for this to work , so go to the new instance you created (ensure in public subnet).  

<img src="2020-11-17-10-46-18.png" class="img-responsive"/>  

<img src="2020-11-17-10-46-44.png" class="img-responsive"/>  

Now note down the instance ID and edit route table of your private instance and provide the instance id of the new NAT instance we created.  

<img src="2020-11-17-10-47-21.png" class="img-responsive"/>  

Ensure you provide ping support in inbound rule of the security group you created.  

<img src="2020-11-17-10-47-52.png" class="img-responsive"/>  

Now our private instance can ping successfully to outside world using the NAT instance we created.