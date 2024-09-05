+++
title = 'Apache Pig - XML Parsing(XPath)'
date = 2013-08-20
categories = ['Data Engineering']
+++
<a href="http://pig.apache.org/" target="_blank">Apache Pig</a> is a tool used to analyze large amounts of data by representing them as data flows. Using the Pig Latin scripting language operations like ETL (Extract, Transform and Load), adhoc data analysis and iterative processing can be easily achieved. Pig is an abstraction over MapReduce. In other words, all Pig scripts internally are converted into Map and Reduce tasks to get the task done. Pig was built to make programming MapReduce applications easier. Before Pig, Java was the only way to process the data stored on HDFS. Pig was first built in Yahoo! and later became a top level Apache project.

<span style="text-decoration: underline;"><strong>Feeding the Pig with XML</strong></span>
Its always tough to parse XML, especially when it comes to PIG. Here I am explaining two approaches to parse an XML file in PIG.

1. Using Regular Expression
2. Using XPath

For simplicity I am taking a sample XML as shown below. This file should be in HDFS for processing.
<pre class="lang:xhtml decode:true">&lt;CATALOG&gt;
&lt;BOOK&gt;
&lt;TITLE&gt;Hadoop Defnitive Guide&lt;/TITLE&gt;
&lt;AUTHOR&gt;Tom White&lt;/AUTHOR&gt;
&lt;COUNTRY&gt;US&lt;/COUNTRY&gt;
&lt;COMPANY&gt;CLOUDERA&lt;/COMPANY&gt;
&lt;PRICE&gt;24.90&lt;/PRICE&gt;
&lt;YEAR&gt;2012&lt;/YEAR&gt;
&lt;/BOOK&gt;
&lt;BOOK&gt;
&lt;TITLE&gt;Programming Pig&lt;/TITLE&gt;
&lt;AUTHOR&gt;Alan Gates&lt;/AUTHOR&gt;
&lt;COUNTRY&gt;USA&lt;/COUNTRY&gt;
&lt;COMPANY&gt;Horton Works&lt;/COMPANY&gt;
&lt;PRICE&gt;30.90&lt;/PRICE&gt;
&lt;YEAR&gt;2013&lt;/YEAR&gt;
&lt;/BOOK&gt;
&lt;/CATALOG&gt;</pre>
<span style="text-decoration: underline;"><strong>Using Regular Expressions</strong></span>

I am using the XMLLoader() in piggy bank UDF to load the xml, so ensure that Piggy Bank UDF is registered.  Then I am using regular expression to parse the XML.
<pre class="lang:default decode:true" title="XML Parsing using Regular Expressions">REGISTER piggybank.jar

A =  LOAD 'xmls/hadoop_books.xml' using org.apache.pig.piggybank.storage.XMLLoader('BOOK') as (x:chararray);

B = foreach A GENERATE FLATTEN(REGEX_EXTRACT_ALL(x,'&lt;BOOK&gt;\\s*&lt;TITLE&gt;(.*)&lt;/TITLE&gt;\\s*&lt;AUTHOR&gt;(.*)&lt;/AUTHOR&gt;\\s*&lt;COUNTRY&gt;(.*)&lt;/COUNTRY&gt;\\s*&lt;COMPANY&gt;(.*)&lt;/COMPANY&gt;\\s*&lt;PRICE&gt;(.*)&lt;/PRICE&gt;\\s*&lt;YEAR&gt;(.*)&lt;/YEAR&gt;\\s*&lt;/BOOK&gt;'));

dump B;</pre>
Output:
<pre class="lang:default decode:true" title="output">(Hadoop Defnitive Guide,Tom White,US,CLOUDERA,24.90,2012)
(Programming Pig,Alan Gates,USA,Horton Works,30.90,2013)</pre>
<span style="text-decoration: underline;"><strong>Using XPath</strong></span>

<span class="cm"><a href="http://en.wikipedia.org/wiki/XPath" target="_blank">XPath</a> is a function that allows text extraction from xml</span>. Starting PIG 0.13 , Piggy bank UDF comes with XPath support. It eases the XML parsing in PIG scripts.  A sample script using XPath is as shown below.
<pre class="lang:default decode:true" title="Using XPath">REGISTER piggybank.jar
DEFINE XPath org.apache.pig.piggybank.evaluation.xml.XPath();

A =  LOAD 'xmls/hadoop_books.xml' using org.apache.pig.piggybank.storage.XMLLoader('BOOK') as (x:chararray);

B = FOREACH A GENERATE XPath(x, 'BOOK/AUTHOR'), XPath(x, 'BOOK/PRICE');
dump B;</pre>
Output:
<pre class="lang:default decode:true" title="output">(Tom White,24.90)
(Alan Gates,30.90)</pre>
Future enhancements:

If you check the XPath UDF <a href="https://github.com/apache/pig/blob/branch-0.14/contrib/piggybank/java/src/main/java/org/apache/pig/piggybank/evaluation/xml/XPath.java" target="_blank">source code</a>  , you can see that input to Xpath is a Tuple and it always returns a String. But there will be cases in which we might want XPath to return a Tuple instead of String. So there is scope to extend XPath with this feature and contribute to community.

Now start feeding the Pig !