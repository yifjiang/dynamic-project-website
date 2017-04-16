drop database if exists group30db;
create database group30db;
use group30db;
CREATE TABLE user(username varchar(20) primary key, password varchar(256));
CREATE TABLE people(people_id int auto_increment primary key, firstname varchar(50), lastname varchar(50), people_website varchar(1000));
CREATE TABLE projects(project_id int auto_increment primary key, projectName varchar(255), subtitle varchar(255), summary varchar(30000), project_website varchar(1000), corp ENUM('current', 'past') DEFAULT 'current');
CREATE TABLE publications(publication_id int auto_increment primary key, publication_name varchar(255), conference varchar(255), location varchar(255), dates varchar(255), link varchar(255));
CREATE TABLE projectPeople(project_id int, people_id int, primary key(project_id, people_id), foreign key (project_id) references projects(project_id) on delete cascade, foreign key (people_id) references people(people_id) on delete cascade);
CREATE TABLE projectPublication(project_id int, publication_id int, primary key(project_id, publication_id), foreign key (project_id) references projects(project_id) on delete cascade, foreign key (publication_id) references publications(publication_id) on delete cascade);
CREATE TABLE publicationPeople(publication_id int, people_id int, primary key(publication_id, people_id), foreign key (publication_id) references publications(publication_id) on delete cascade, foreign key (people_id) references people(people_id) on delete cascade);
CREATE TABLE news(news_id int auto_increment primary key, title varchar(1000), summary varchar(10000), project_id int, foreign key (project_id) references projects(project_id) on delete cascade);
create table photo(picid int auto_increment primary key, picName varchar(255), project_id int not null, foreign key (project_id) references projects(project_id));
INSERT INTO projects(projectName, subtitle, project_website, summary,corp) values
('High-Performance Complex Event Processing', null, null, "Complex Event Processing (CEP) is a broad term, referring to any application that involves searching for complex patterns among raw events to infer higher-level concepts. Examples include high-frequency trading (a certain correlation in stock prices that triggers a purchase), intrusion detection (a series of network activities that indicate an attack), inventory management (moving patterns using RFID or GPS readings), click stream analysis (a sequence of clicks that trigger an ad), and electronic health systems (a combination of sensor readings raising an alert). CEP applications have created a fast-growing market, with an annual growth rate of 30% (see Celent report). This growing market has led database vendors to add new constructs (called MATCH_RECOGNIZE) to the SQL language that allow for expressing sequential patterns among the rows in a table.

Seeking richer abstractions for supporting CEP applications, we have introduced constructs based on Kleene-closure expressions and showed that they are significantly more powerful than those proposed by database vendors (which are provably incapable of expressing many important CEP queries). We have designed the first two database query languages that used nested word automata (NWA) as their underlying computational model: K*SQL with a relational interface, and XSeq with an XML interface. NWAs are recent advances in the field of automata theory that generalize the notion of regular languages to capture data that has both sequential and hierarchical structures. Examples of such data are XML, JSON files, RNA proteins, and traces of procedural programs.

K*SQL solves the long-standing problem of providing a unified query engine for both relational and hierarchical data. Similarly, despite 15 years of previous research where using tree automata for XML optimization was the status quo, XSeq translates XML queries into NWAs (which are then optimized using my algorithms) and outperformes the state-of-the-art XML engines by several orders of magnitude. XSeq received the SIGMOD's best paper award in 2012.",'past'),
('CliffGuard','A Principled Framework for Applying Robust Optimization Theory to Database Systems','http://cliffguard.org', 'A fundamental problem in database systems is choosing the best physical design, i.e., a small set of auxiliary structures that enable the fastest execution of future queries. Modern databases come with designer tools that create a number of indices or materialized views, but they find designs that are sub-optimal and remarkably brittle. This is because future workload is often not known a priori and these tools optimize for past workloads in hopes that future queries and data will be similar. In practice, these input parameters are often noisy or missing.

CliffGuard is a practical framework that creates robust designs that are immune to parameter uncertainties as much as desired. CliffGuard is the first attempt at applying robust optimization theory in Operations Research to building a practical framework for solving one of the most fundamental problems in databases, namely finding the best physical design.','current');
INSERT INTO people(firstname, lastname, people_website) values 
('Barzan', 'Mozafari', 'http://web.eecs.umich.edu/~mozafari/'), 
('Yifan', 'Jiang', null);

INSERT INTO projectPeople(project_id, people_id) values (2,1), (1,1), (2,2);

INSERT INTO publications(publication_name, conference, location, dates, link) values 
('High-Performance Complex Event Processing over Hierarchical Data', "In ACM TODS's Special Issue on", null, 'December, 2013', 'http://web.eecs.umich.edu/~mozafari/php/data/uploads/tods_2013.pdf'),
('CliffGuard: A Principled Framework for Finding Robust Database Designs', 'In Proceedings of the ACM SIGMOD 2015 Conference','Melbourne, VIC, Australia','May 31 - June 04, 2015','http://web.eecs.umich.edu/~mozafari/php/data/uploads/sigmod_2015.pdf')
;

INSERT INTO projectPublication(project_id, publication_id) values (2,2),(1,1);

INSERT INTO publicationPeople(publication_id, people_id) values (1,1),(2,2), (2,1);

INSERT INTO user(username,password) values ('mozafari', 'sha512$4bfb70a7ebb340e48fa5d21c77c7866b$8a916eb2db90096e096d9989b5c48a89faa7efdf4ef18d48daec7ac3a7b64c0601ebc98facd7c885aa6464019c04f84d7fa7a13fc880478c3e9580c6afcc6baa');

INSERT INTO news(title, summary, project_id) values ('Our comments were adopted into the US position for the next edition of SQL!', 'On March 13, 2013 most of my comments for the changes to the SQL standard (which were based on the papers we published in this area) were approved and adopted by the DM32.2 committee! The DM32.2 Task Group on Database develops standards for the syntax and semantics of database languages. This Task Group is the U.S. TAG to ISO/IEC JTC1/SC32/WG3 & WG4 and provides recommendations on U.S. positions to INCITS. I have been informed that (thanks to Fred Zemke) 3 out of my 4 comments on the recenetly proposed changes to SQL have been approved by the DM32.2 committee and will be deployed for the next edition of SQL standard. My comments are numbered 34, 35, and 36 in the following document. I am now an official contributor to the international SQL standards process!', 1);