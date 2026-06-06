export type OracleQuestionKey = string;
export type OracleAnswerText = string;
export type OracleQaBank = Readonly<
	Record<OracleQuestionKey, OracleAnswerText>
>;

/**
 * Normalized question → answer map for Oracle Academy quizzes.
 *
 * Keys should be lowercased, trimmed snippets of the question text.
 * Values are the visible answer labels (e.g. "True", "False", "A", "B", etc.).
 */
export const ORACLE_QA_BANK = {
	'a specialized type of software, which controls and manages the hardware in a computer system.':
		'Operating System',

	'a table has a column: response_time. this is used to store the difference between the time the problem was reported and the time the problem was resolved. data in the response_time column needs to be stored in days, hours, minutes and seconds. which data type should you use?':
		'INTERVAL DAY TO SECOND',

	'personal computers (pcs) have been in existence since 1950.': 'False',

	'the overall mission of the oracle corporation is to use the internet and fast processing servers to build its own network.':
		'False',

	'users could directly interact with which of the following software to access essential business applications?':
		'GUI software|Internet Browser software|Operating System software',

	'software cannot operate without hardware.': 'True',

	'consider your school library. it will have a database with transaction details of the books that are borrowed by students. is the total number of books out on loan in one given month considered data or information?':
		'Information',

	'information which was gained from data is the same as:':
		'Intelligence|Knowledge',

	'consider your school library. it will have a database with transaction details of the books that are borrowed by students. is a detail of one student borrowing one book considered data or information?':
		'Data',

	'the work of e.f. codd in the early 1970s led to the development of relational databases.':
		'True',

	'sql became the most commonly used query language in the 1980s.':
		'True',

	'which of the following represents the correct sequence of steps in the database development process?':
		'Analyze, Design, Build',

	'the market for it professionals is still increasing and will continue to do so in the future as the world gets ever more dependent on computer systems.':
		'True',

	'the main subject areas taught by the oracle academy are:':
		'Data Modeling, SQL, and PL/SQL',

	"the demand for information technology professionals in today's market is increasing.":
		"True",

	'once you have learned how to write programs and build systems, you no longer need any input or involvement from any users as you are perfectly capable of delivering the systems that businesses need and want.':
		'False. Business requirements can and will change. For instance new legal requirements may arise.',

	'in the grid computing model, resources are pooled together for efficiency.':
		'True',

	'data modeling is the last step in the database development process.':
		'False',

	'oracle was one of the first relational database systems available commercially.':
		'True',

	'which term describes the physical components of a computer system?':
		'Hardware',

	'an entity relationship model is independent of the hardware or software used for implementation.':
		'True',

	'a well structured erd will show only some parts of the finished data model. you should never try to model the entire system in one diagram, no matter how small the diagram might be.':
		'False',

	'the purpose of an erd is to document the proposed system and facilitate discussion and understanding of the requirements captured by the developer.':
		'True',

	'documenting business requirements helps developers control the scope of the system and prevents users from claiming that the new system does not meet their business requirements.':
		'True',

	'a conceptual model is not concerned with how the physical model will be implemented.':
		'True',

	'data modeling is performed for the following reasons:':
		'It helps discussions and reviews., The ERD becomes a blueprint for designing the actual system.',

	'which of the following entities most likely contains valid attributes?':
		'Entity: Home. Attributes: Number of Bedrooms, Owner, Address, Date Built|Entity: Pet. Attributes: Name, Birthdate, Owner',

	'which of the following are examples of entity: instance ?':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',



	'which of the following are examples of entity: instance?':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',

	'unique identifiers:':
		'Distinguish one instance of an entity from all other instances of that entity',


	'unique identifiers…':
		'Distinguish one instance of an entity from all other instances of that entity',

	'which of the following statements about entities are true?':
		'"Something" of significance to the business about which data must be known., They are usually a noun., A name for a set of similar "things"',

	'in the following statements, find two good examples of entity: instance.':
		'BOOK: Biography of Mahatma Gandhi, DAIRY PRODUCT: milk',

	'a/an _________ is a piece of information that in some way describes an entity. it is a property of the entity and it quantifies, qualifies, classifies, or specifies the entity.':
		'Attribute',

	'the word "volatile" means:': 'Changing constantly; unstable',

	'entities are usually verbs.': 'False',

	'attributes can only have one value at any point for each instance in the entity.':
		'True',

	"a/an _________'s value can be a number, a character string, a date, an image, a sound":
		"Attribute",

	'what is the purpose of a unique identifier?':
		'To identify one unique instance of an entity by using one or more attributes and/or relationships.',

	'which of the following attributes is suitable to be a unique identifier?':
		'Social Security Number',

	'which of the following can be found in an erd?':
		'Entities., Attributes.',

	'data models show users the data that their physical model will contain.':
		'True',

	'many reasons exist for creating a conceptual model. choose three appropriate reasons from the options below.':
		'They capture current and future needs., They accurately describe what a physical model will contain., They model functional and informational needs.',

	'data models are drawn to show users the actual data that their new system will contain; only data listed on the diagram can be entered into the database.':
		'True',

	"which of the following statements about erd's is false?":
		"Model all information that is derivable from other information already modeled.",

	'an erd is an example of a physical model.': 'False',

	'an example of adding a check constraint to limit the salary that an employee can earn is:':
		'ALTER TABLE employees ADD CONSTRAINT emp_salary_ck CHECK (salary < 100000)',

	"which of the following statements are true about erd's?":
		"You should not model derivable data., A piece of information should only be found in one place on an ERD.",

	'which of the following statements about attributes are true?':
		'They have a data type, such as number or character string.|They must be single valued.|They describe, qualify, quantify, classify, or specify an entity.',

	'after issuing a set unused command on a column, another column with the same name can be added using an alter table statement.':
		'True',

	'all of the following could be attributes of an entity called person, except which one?':
		'Natacha Hansen',

	'all of the following would be instances of the entity person except which?':
		'Male',

	'all of the following would be instances of the entity animal species, except which one?':
		'Leaf',

	'which of the following is an example of a volatile attribute?': 'Age',

	'a/an _________ is defined as "something" of significance to the business about which data must be known.':
		'Entity',

	'entity relationship modeling is dependent on the hardware or software used for implementation, so you will need to change your erd if you decide to change hardware vendor.':
		'False',

	'the physical model is derived from the conceptual model.':
		'True',

	'which of the following are examples of e-businesses that use database software?':
		'Online clothing store, Online book store, Online personal shopping service',

	'businesses involved in any of the following typically use databases to handle their data: finance, logistics, commerce, procurement, and distribution?':
		'True',

	// Full text for the long “Changes in computing…” prompt (with appended examples)
	'changes in computing have affected many of our day-to-day activities. are all of the following activities examples of this change? yes or no? in the past you used to use the phone system to call directory assistance to get a phone number. today you can use your pc to look up a phone number online. in the past you used to have to go to the shoe store to buy shoes. today you can use your pc to order shoes online. in the past you had to use your pc to send a person an email. today you can use your phone to send a text message.':
		'Yes',

	"what is the difference between 'information' and 'data'?":
		"Data turns into useful information. It is stored in a database and accessed by systems and users.",
	'what is the difference between "information" and "data"?':
		'Data turns into useful information. It is stored in a database and accessed by systems and users.',

	'entities are transformed into tables during the database design process.':
		'True',

	'which of the following are examples of data becoming information:':
		'A, B, and D',

	"how do you turn 'data' into 'information'?":
		"By querying it or accessing it",

	'how do you turn "data" into "information"?':
		'By querying it or accessing it',

	// Section 3 relationship / ERD questions
	'relationships can be either mandatory or optional.': 'True',
	'in a business that sells pet food, choose the best relationship name between food type and animal (e.g. dog, horse, or cat).':
		'Each FOOD TYPE must be suitable for one or more ANIMALs.|Each FOOD TYPE may be given to one or more ANIMALs.',
	'one relationship can be mandatory in one direction and optional in the other direction.':
		'True',
	'which of the following are used to show cardinality on an erd?':
		'Crow\'s foot.|Single toe.',
	'which of the following are true about cardinality?':
		'Cardinality tells "how many".|Cardinality specifies only singularity or plurality, but not a specific plural number.',
	'which symbol is used to show that a particular attribute is mandatory?':
		'*',
	'entity boxes are drawn as': 'Soft Boxes',
	'erdish describes a relationship in words.': 'True',
	'which of the following are used to show a relationship on an erd?':
		'Dashed line.|Crow\'s foot.|Solid line.',
	'when reading a relationship between 2 entities, the relationship is read both from left to right and right to left.':
		'True',
	'relationship names are not shown on an erd.': 'False',
	'matrix diagrams show optionality and cardinality of the erds they document.':
		'False',
	'matrix diagrams are developed before the erd.': 'True',
	'matrix diagrams are used to verify that all relationships have been identified for an erd.':
		'True',
	'when reading the relationships in an erd, you are said to be speaking:':
		'ERDish',
	'relationships always exist between':
		'2 entities (or one entity and itself)',
	'to identify an attribute as part of a unique identifier on an er diagram, the # symbol goes in front of it.':
		'True',
	'entity names are always singular.': 'True',
	'which of the following are true about relationship optionality?':
		'Optionality answers "may or must".|Optionality specifies whether something is required or not.',
	'relationship cardinality is important.': 'True',
	'what are the three properties that every relationship should have?':
		'Name, optionality, cardinality',

	'most of the well known internet search engines use databases to store data.':
		'True',

	// Section 4 – Business rules, constraints, subtypes/supertypes

	// Section 5 – Relationships, redundancy, transferability, intersection entities
	'relationships can be redundant.': 'True',
	'if two entities have two relationships between them, these relationships can be either _____________ or _____________.':
		'Redundant or Required',
	'what uncommon relationship is described by the statements: "each dna sample may be taken from one and only one person and each person may provide one and only one dna sample"':
		'One to One Optional',
	'what relationship is described by the statements: "each customer may place one or more orders, each order must be placed by one and only one customer"':
		'One to Many',
	'if the same relationship is represented twice in an entity relationship model, it is said to be:':
		'Redundant',
	'a non-transferable relationship is represented by which of the following symbols?':
		'Diamond',
	'if a relationship can not be moved between instances of the entities it connects, it is said to be:':
		'Non-Transferable',
	'every erd must have at least one non-transferable relationship.':
		'False',
	'non-transferable relationships can only be mandatory, not optional.':
		'False',
	'which of the following is an example of a non-transferable relationship':
		'PERSON to BIRTH PLACE',
	'when you resolve a m:m by creating an intersection entity, this new entity will always inherit:':
		'A relationship to each entity from the original M:M.',
	'what do you call the entity created when you resolve a m:m relationship?':
		'Intersection entity',
	'intersection entities often have the relationships participating in the uid, so the relationships are often barred.':
		'True',
	'when you resolve a m:m, you simply re-draw the relationships between the two original entities; no new entities are created.':
		'False',
	'a relationship on an erd can have attributes.': 'False',

	'if a relationship can be moved between instances of the entities it connects, it is said to be:':
		'Transferable',
	'a non-transferable relationship means the relationship is manatory at both sides.':
		'False',
	'which of the following pairs of entities is most likely to be modeled as a 1:1 relationship?':
		'PERSON and FINGERPRINT',
	'which of the following pairs of entities is most likely to be modeled as a m:m relationship?':
		'TEACHER and SUBJECT AREA',
	'a barred relationship on an erd signifies that the uid of the intersection entity is inherited from the entities that made up the original many to many relationship.':
		'True',
	'many to many relationships between entities usually hide what?':
		'Another entity',
	'if an intersection entity is formed that contains no attributes of its own, its uniqueness may be modeled by':
		'Barring the relationships to the original entities.',
	'a relationship can be moved between instances of the entities it connects is said to be:':
		'Transferable',

	'many to many relationships must be left in the model. it is important to have them documented as m-m.':
		'False',
	'one to many relationships are the most uncommon type of relationships in an erd.':
		'False',
	'a diamond on a relationship indicates the relationship as non-tranferable.':
		'True',
	'the relationship between customer and receipt is an example of a non-transferable relationship.':
		'True',

	'a business rule such as "all accounts must be paid in full within 10 days of billing" is best enforced by:':
		'Creating additional programming code to identify and report accounts past due.',
	'a business rule such as "we only ship goods after customers have completely paid any outstanding balances on their account" is best enforced by:':
		'Creating additional programming code to verify no goods are shipped until the account has been settled in full.',
	'how should you handle constraints that cannot be modeled on an er diagram?':
		'List them on a separate document to be handled programmatically',
	'which of the following is an example of a structural business rule?':
		'All employees must belong to at least one department.',
	'can all constraints be modeled on an er diagram?':
		'No, and those that cannot be modeled should be listed on a separate document to be handled programmatically',
	'why is it important to identify and document business rules?':
		'It allows you to create a complete data model and then check it for accuracy.',
	'how would you model a business rule that states that girls and boys may not attend classes together?':
		'Supertype STUDENT has two subtypes BOY and GIRL which are related to GENDER, which is related to CLASS',
	'a subtype can have a relationship not shared by the supertype.':
		'True',
	'a subtype is drawn on an erd as an entity inside the softbox of the supertype.':
		'True',
	'a subtype is shown on an erd as an entity with a one to many relationship to the supertype.':
		'False',
	'which of the following is true about subtypes?':
		'Subtypes must be mutually exclusive.',
	'all instances of a subtype must be an instance of the supertype.':
		'True',
	'a supertype can only have two subtypes and no more.':
		'False',
	'you can only create relationships to a supertype, not to a subtype.':
		'False',
	'a supertype can have only one subtype.': 'False',
	"how would you model a business rule that states that on a student's birthday, he does not have to attend his classes?":
		"You cannot model this. You need to document it",
	'a new system would have a mixture of both procedural and structural business rules as part of the documentation of that new system.':
		'True',
	'why is it important to identify and document structural rules?':
		'Ensures we know what data to store and how that data works together.',
	'all instances of the supertype must be an instance of one of the subtypes.':
		'True',
	'all instances of a subtype may be an instance of the supertype but does not have to.':
		'False',
	'all er diagrams must have one of each of the following:':
		'One or more Entities|Relationships between entities',
	'a subtype is drawn on an erd as an entity inside the "softbox" of the supertype.':
		'True',

	'if two entities have two relationships between them, these relationships can be either _____________ or _____________ .':
		'Redundant or Required',

	'the word "volatile" means…': 'Changing constantly; unstable',

	'attributes can be either mandatory or optional.': 'True',

	// Section 6 - Normalization and UIDs (prefixed to avoid key clashes)
	'examine entity client (#client id, first name, last name, street, city, zip code) - which normal form rule is violated?':
		'None of the above, the entity is fully normalised.',
	'normalizing an entity to 1st normal form is done by removing any attributes that contain multiple values.':
		'True',
	'when all attributes are single-valued, the database model conforms to:':
		'1st Normal Form',
	'if an entity has a multi-valued attribute, to conform to 1st normal form we:':
		'Create an additional entity and relate it to the original entity with a 1:M relationship.',
	'to resolve a 2nd normal form violation, we:':
		'Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.',
	'receipt (#customer id, #store id, store location, date) - make it conform to 2nd nf by:':
		'Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.',

	'suitable uids for employee':
		'Social Security Number|Employee ID',
	'client (#client id, first name, last name, order id, street, zip code) - which normal form is violated?':
		'1st Normal Form.',
	'client order (#client id, #order id, first name, last name, order date, city, zip code) - which normal form is violated?':
		'2nd Normal Form.',
	'an entity can have repeated values and still be in 1st normal form.':
		'False',
	'when data is only stored in one place in a database, the database conforms to the rules of ___________. (variant)':
		'Normalization',

	'as a database designer, you do not need to worry about where you store an attribute; as long as it is on the erd, the job is done.':
		'False',
	'the candidate uid chosen to identify an entity is called the primary uid; other candidate uids are called secondary uids.':
		'Yes, this is the way UID\'s are named.',
	'where an entity has more than one attribute suitable to be the primary uid, these are known as _____________ uids.':
		'Candidate',
	'a candidate uid that is not chosen to be the primary uid is called:':
		'Secondary',
	'what is the rule of second normal form?':
		'All non-UID attributes must be dependent upon the entire UID.',
	'receipt (#customer id, #store id, store location, date) - which attribute breaks 2nd nf?':
		'STORE LOCATION',
	'order (order id, order date, product id, customer id) is in 1st normal form.':
		'False',
	'to convert an entity with a multi-valued attribute to 1st normal form we create an additional entity and relate it to the original entity with a 1:1 relationship.':
		'False',
	'a transitive dependency exists when any attribute in an entity is dependent on any other non-uid attribute in that entity. (variant)':
		'True',

	// Section 8 - Time, historical data, readability
	'which scenarios should be modeled so that historical data is kept? baby and age / customer and orders / teacher and age / customer and payments':
		'CUSTOMER and ORDERS|CUSTOMER and PAYMENTS',
	'when modeling historical data the unique identifier is always made up of a barred relationship from the original two entities.':
		'False',
	'which scenarios should be modeled so that historical data is kept? library and book / student and grade / student and age / library and number of books':
		'LIBRARY and BOOK|STUDENT and GRADE',
	'which statements enhance erd readability?':
		'Avoid crossing one relationship line with another.|It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system.',
	'no formal rules exist for drawing erds; clarity is key.':
		'True',
	'you must make sure all entities fit onto one diagram.':
		'False',
	'formal rules exist for drawing erds; follow them even if hard to read.':
		'False',
	'logical constraint with time for assignment/employee':
		'An ASSIGNMENT may only refer to an EMPLOYEE with a valid employee record at the Start Date of the ASSIGNMENT.',
	'function of logging/journaling in conceptual data models':
		'Allows you to track the history of attribute values, relationships, and/or entire entities',
	'how do you know when to use different types of time in your design?':
		'It depends on the functional needs of the system.',
	'logical constraint when modeling time for a country entity':
		'Countries may change their names and/or borders over a period of time.',
	'in a payroll system, desirable to have a day entity with holiday attribute.':
		'True',
	'when a relationship may or may not be transferable depending on time, this is known as a/an':
		'Conditional Non-transferable Relationship.',

	'group entities according to volume to ease readability.':
		'True',
	'modeling historical data can produce a uid that includes a date.':
		'True',
	'in a payroll system, day entity with holiday attribute.(repeat)':
		'True',
	'logical constraint when modeling time for a city entity':
		'Cites may change their names and/or country association if the borders of a country change.',
	'adding the concept of time makes the model more complex.':
		'True',
	'if you have an entity with a date attribute and other date characteristics, create a day entity.':
		'True',
	'delivery charge varies by weekday; best modeling approach':
		'Use a Delivery Day entity, which holds prices against week days, and ensure we also have an attribute for the Requested Delivery Day in the Order Entity.',
	'why model time when selling gold bars?':
		'The price of gold fluctuates and, to determine the current price, you need to know the time of purchase.',
	'if you want to keep changing prices over time for products, best modeling approach':
		'Both A and C',
	'high-volume entities grouping improves readability.':
		'True',
	'no point in grouping entities; readability is a waste.':
		'False',
	'erd readability: crows feet consistent direction and no crossing lines.':
		'True',
	'time-aware constraint for country (variant)':
		'Countries may change their names and/or borders over a period of time.',
	'time-aware constraint for city (variant)':
		'Cites may change their names and/or country association if the borders of a country change.',

	// Section 9 - Physical design, arcs, subtypes, constraints (S9 prefix to avoid collisions)
	'arc to physical design: make fks optional and add check so only one fk populated (exclusive)':
		'Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not',
	'valid reason for subtype implementation':
		'Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.',
	'subtype fk columns become mandatory.': 'False',
	'why 1_table not allowed in oracle':
		'Object names must not start with a number. They must begin with a letter.',
	"why 'employee jobs' not allowed in oracle":
		"You cannot have spaces between words in a table name",
	'why table name this_year_end+next_year invalid':
		'The Plus sign + is not allowed in object names.',
	'in physical model, an attribute becomes a ______.': 'Column',
	'to resolve m:m in physical model create': 'Intersection table',
	'when an arc is transformed every relationship becomes mandatory fk.':
		'False',
	'oracle db can implement m:m by two fks directly.':
		'False',
	'barred relationship fk is part of': 'The Primary Key',
	'constraint type: column must contain only values consistent with defined data format':
		'Column integrity',
	'incorrect statements about primary key':
		'Only one column that must be null.|A single column that uniquely identifies each column in a table.|A set of columns in one table that uniquely identifies each row in another table.',
	'correct statements about primary key':
		'A set of columns and keys in a single table that uniquely identifies each row in a single table|A single column that uniquely identifies each row in a table|A set of columns that uniquely identifies each row in a table',

	'fk cannot be null when': 'It is part of a primary key',
	'arc implementation synonym for':
		'Supertype and Subtype Implementation',
	'physical model is created by transforming which model':
		'Conceptual',
	'relationships at subtype level implemented as optional fks.':
		'True',
	'optional-to-mandatory 1:m becomes ______ on master table':
		'Optional Foreign Key',
	'one-to-one relationships transform into fk at either end.':
		'False',
	'a table must have a primary key.': 'False',
	'entity order (order id, order date, product id, customer id) is in 1nf.':
		'False',
	'constraint type: pk must be unique and not null':
		'Entity integrity',
	'referential integrity example dept_no matches departments':
		'Referential integrity',
	'conceptual model to physical becomes relational db.':
		'True',
	'an "arc implementation" can be done just like any other relationship by simply adding required fks.':
		'False',
	'many to many resolved via intersection table.':
		'True',
	'when transforming erd, relationships can only become uids.':
		'False',

	// Section 7 – Arcs, recursive & hierarchical relationships

	'a particular problem may be solved using either a recursive relationship or a hierarchical relationship, though not at the same time.':
		'True',
	'which of the following can be added to a relationship?':
		'An arc can be assigned',
	'arcs model an exclusive or constraint.': 'True',
	'which of the following would best be represented by an arc? student (senior, male / university, technical college)':
		'STUDENT ( University, Technical College)',
	'which of the following pairs is most likely an arc example: delivery address (home, office)':
		'DELIVERY ADDRESS (Home, Office)',
	'arcs are used to visually represent exclusivity between two or more relationships in an erd.':
		'True',
	'which of the following can be added to a relationship? (variant)':
		'An arc can be assigned',
	'a single relationship can be both recursive and hierarchical at the same time.(variant)':
		'False',
	'the relationship between customer and receipt is an example of a non-transferable relationship.(hierarchy topic overlap)':
		'True',

	'which of the following would be suitable uids for the entity employee:':
		'Employee ID | Social Security Number',

	'when all attributes are single-valued, the database model is said to conform to:':
		'1st Normal Form',


	'when data is stored in more than one place in a database, the database violates the rules of ___________.':
		'Normalization',

	'examine the following entity and decide which sets of attributes break the 3rd normal form rule:':
		'DRIVER ID, DRIVER NAME',

	'normalizing an entity to 1st normal form is done by removing any attributes that contain muliple values.':
		'True',

	'people are not born with "numbers", but a lot of systems assign student numbers, customer ids, etc. these are known as a/an ______________ uid.':
		'Artificial',

	'a single relationship can be both recursive and hierachal at the same time.':
		'False',

	'how do you know when to use the different types of time in your design?':
		'It depends on the functional needs of the system .',

	'there is no point in trying to group your entities together on your diagram according to volume, and making a diagram look nice is a waste of time.':
		'False',

	'you are doing a data model for a computer sales company where the price fluctuates on a regular basis. if you want to allow the company to modify the price and keep track of the changes, what is the best way to model this?':
		'E. Both A and C',

	'when a system requires that old values for attributes are kept on record, this is know as journaling or logging.':
		'True',

	"formal rules exist for drawing erd's. you must always follow them, even if it results in an erd that is difficult to read.":
		"False",

	'there are no circumstances where you would create a day entity.':
		'False',

	'when you add the concept of time to your data model, your model becomes more complex.':
		'True',

	'modeling historical data can produce a unique identifier that includes a date.':
		'True',

	"which of the following statements are true for erd's to enhance their readability.":
		"It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system. | Avoid crossing one relationship line with another.",

	'you are doing a data model for a computer sales company where the price of postage depends upon the day of the week that goods are shipped. so shipping is more expensive if the customer wants a delivery to take place on a saturday or sunday. what would be the best way to model this?':
		'Use a Delivery Day entity, which holds prices against week days, and ensure the we also have an attribute for the Requested Delivery Day in the Order Entity.',

	'in a payroll system, it is desirable to have an entity called day with a holiday attribute when you want to track special holiday dates.':
		'True',

	// Section 6 - Normalization / UIDs (no prefixes)
	'examine the following entity and decide which rule of normal form is being violated: entity: client attributes: # client id first name last name street city zip code':
		'None of the above, the entity is fully normalised.',
	'examine the following entity and decide which rule of normal form is being violated: entity: client attributes: # client id first name last name order id street zip code':
		'1st Normal Form.',
	'examine the following entity and decide which rule of normal form is being violated: entity: client order attributes: # client id # order id first name last name order date city zip code':
		'2nd Normal Form.',
	'a transitive dependency exists when any attribute in an entity is dependent on any other non-uid attribute in that entity.':
		'True',
	'when any attribute in an entity is dependent on any other non-uid attribute in that entity, this is known as:':
		'Transitive dependency',
	'the rule of 3rd normal form states that no non-uid attribute can be dependent on another non-uid attribute.':
		'True',
	'if an entity has a multi-valued attribute, to conform to the rule of 1st normal form we:':
		'Create an additional entity and relate it to the original entity with a 1:M relationship.',
	'when data is only stored in one place in a database, the database conforms to the rules of ___________.':
		'Normalization',
	"there is no limit to how many columns can make up an entity's uid.":
		"True",
	'if an entity has no attribute suitable to be a primary uid, we can create an artificial one.':
		'True',
	'a unique identifier can only be made up of one attribute.':
		'False',
	'an entity can only have one primary uid.': 'True',
	'to resolve a 2nd normal form violation, we':
		'Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.',
	'examine the following entity and decide how to make it conform to the rule of 2nd normal form: entity: receipt attributes: #customer id #store id store location date':
		'Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.',
	'any non-uid attribute must be dependent upon the entire uid.':
		'True',

	// Section 7 - Arcs / recursive / hierarchical
	'which of the following would best be represented by an arc? student ( university, technical college)':
		'STUDENT ( University, Technical College)',
	"arcs are mandatory in data modeling. all erd's must have at least one arc.":
		"False",
	'to visually represent exclusivity between two or more relationships in an erd you would most likely use an ________.':
		'Arc',
	'an arc can often be modeled as supertype and subtypes.':
		'True',
	'which of the following would best be represented by an arc? delivery address (home, office)':
		'DELIVERY ADDRESS (Home, Office)',
	'all relationships participating in an arc must be mandatory.':
		'False',
	'every business has restrictions on which attribute values and which relationships are allowed. these are known as:':
		'Constraints.',
	'arcs are used to visually represent _________ between two or more relationships in an erd.':
		'Exclusivity',
	'cascading uids are a feature often found in what type of relationship?':
		'Heirarchical Relationship',
	'a relationship between an entity and itself is called a/an:':
		'Recursive Relationship',
	'a recursive relationship is represented on an erd by a/an:': 'Pig\'s Ear',
	'a single relationship can be both recursive and hierarchical at the same time.':
		'False',
	'business organizational charts are often modeled as a hierarchical relationship.':
		'True',
	'a recursive relationship must be mandatory at both ends.':
		'False',
	'a hierarchical relationship is a series of relationships that reflect entities organized into successive levels.':
		'True',

	// Section 8 - Time / historical data / readability extras
	'which of the following scenarios should be modeled so that historical data is kept? customer and orders / customer and payments / teacher and age / baby and age':
		'CUSTOMER and ORDERS|CUSTOMER and PAYMENTS',
	'which of the following scenarios should be modeled so that historical data is kept? library and book / student and grade / student and age / library and number of books':
		'LIBRARY and BOOK|STUDENT and GRADE',
	'modeling historical data is optional.': 'True',
	'when a relationship may or may not be transferable, depending on time, this is know as a/an:':
		'Conditional Non-transferable Relationship.',
	'which of the following is a logical constraint when modeling time for a city entity?':
		'Cites may change their names and/or country association if the borders of a country change.',
	'if you have an entity with a date attribute, and other attributes that track characteristics of the date, you should create a day entity.':
		'True',
	'which of the following would be a logical constraint when modeling time for a country entity?':
		'Countries may change their names and/or borders over a period of time.',
	'all systems must include functionality to provide logging or journaling in conceptual data models.':
		'False',
	'in an erd, high volume entities usually have very few relationships to other entities.':
		'True',
	'all systems must have an entity called week with a holiday attribute so that you know when to give employees a holiday.':
		'False',
	'historical data must never be kept.': 'False',

	// Section 9 - Physical design, arcs, constraints
	'when translating an arc relationship to a physical design, you must turn the arc relationships into foreign keys. what additional step must you take with the created foreign keys to ensure the exclusivity principle of arc relationships? (assume that you are implementing an exclusive design)':
		'Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not',
	'which of the following is a valid reason for considering a subtype implementation?':
		'Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.',
	'when mapping supertypes, relationships at the supertype level transform as usual. relationships at subtype level are implemented as foreign keys, but the foreign key columns all become mandatory.':
		'False',
	'in an oracle database, why would 1_table not work as a table name?':
		'Object names must not start with a number. They must begin with a letter.',
	"in an oracle database, why would the following table name not be allowed 'employee jobs'?":
		"You cannot have spaces between words in a table name",
	'why would this table name not work in an oracle database? this_year_end+next_year':
		'The Plus sign + is not allowed in object names.',
	'in a physical data model, an attribute becomes a _____________.': 'Column',
	'to resolve a many to many relationship in a physical model you create a(n) ___________________?':
		'Intersection table',
	'when an arc is transformed to the physical model every relationship in the arc becomes a mandatory foreign key.':
		'False',
	'the oracle database can implement a many to many relationship. you simply create two foreign keys between the two tables.':
		'False',
	'a barrred relationship will result in a foreign key column that also is part of:':
		'The Primary Key',
	'column integrity refers to':
		'Columns always containing values consistent with the defined data format',
	'a column must contain only values consistent with the defined data format of the column':
		'Column integrity',
	'foreign keys cannot be null when': 'It is part of a primary key',
	'the "arc implementation" is a synonym for what type of implementation?':
		'Supertype and Subtype Implementation',
	'the physical model is created by transforming which of the following models?':
		'Conceptual',
	'relationships at the subtype level are implemented as foreign keys, but the foreign key columns all become optional.':
		'True',
	'one-to-many optional to mandatory becomes a _______________ on the master table.':
		'Optional Foreign Key',
	'a table does not have to have a primary key.': 'True',
	'a primary key must be unique, and no part of the primary key can be null.':
		'Entity integrity',
	'a foreign key always refers to a primary key in the same table.':
		'False',
	'the conceptual model is transformed into a physical model. the physical implementation will be a relational database.':
		'True',
	'relationships on an erd can only be transformed into uids in the physical model?':
		'False',
	'attributes become columns in a database table.': 'True',

	'an arc is transformed to the physical model by adding a foreign key for every relationship in the arc.':
		'True',

	'one-to-one relationships are transformed into foreign keys in the tables created at either end of that relationship.':
		'False',

	'the explanation below is an example of which constraint type?\\nif the value in the balance column of the accounts table is below 100, we must send a letter to the account owner which will require extra programming to enforce.':
		'User-defined integrity',

	'two entities a and b have an optional (a) to mandatory (b) one-to-one relationship. when they are transformed, the foreign key(s) is placed on:':
		'The table B',

	'the transformation from an er diagram to a physical design involves changing terminology. entities in the er diagram become __________ :':
		'Tables',

	'to convert an entity with a multi valued attribute to 1st normal form, we create an additional entity and relate it to the original entity with a 1:1 relationship.':
		'False',

	'in a physical model, many to many relationships are resolved via a structure called a(n): ________________':
		'Intersection Table',

	'identify all of the incorrect statements that complete this sentence: a primary key is...':
		'A set of columns in one table that uniquely identifies each row in another table. | A single column that uniquely identifies each column in a table. | Only one column that must be null.',

	'systems are always just rolled out as soon as the programming phase is finished. no further work is required once the development is finished.':
		'False',

	'conditional non-transferability refers to a relationship that may or may not be transferable, depending on time.':
		'True',

	'in a physical data model, a relationship is represented as a combination of:':
		'Foreign Key | Primary Key or Unique Key',

	'in an erd, it is a good idea to group your entities according to the expected volumes. by grouping high volume entities together, the diagrams could become easier to read.':
		'False',

	'in a physical data model, a relationship is represented as a:':
		'Foreign Key',

	'a table should have a primary key.': 'True',

	'an "arc implementation" can be done just like any other relationship - you simply add the required foreign keys.':
		'False',

	'which of the following would best be represented by an arc?':
		'DELIVERY ADDRESS (Home, Office)',

	'in which phases of the system development life cycle will we need to use sql as a language?':
		'Build and Document | Transition',

	'an entity could have more than one attribute that would be a suitable primary uid.':
		'True',

	'which of the following statements are true to enhance the readability of erds?':
		'Crows feet (the many-ends of relationships) should consistently point the same direction where possible, either South & East or North & West | Relationship lines should not cross.',

	'an attribute can have multiple values and still be in 1st normal form.':
		'False',

	'business rules are important to data modelers because:':
		'A. They capture all of the needs, processes, and required functionality of the business.',

	'as a database designer, you do not need to worry about where in the datamodel you store a particular attribute; as long as you get it onto the erd, your job is done.':
		'False',
	'the describe command returns all rows from a table.':
		'False',
	'which statement best describes how arithmetic expressions are handled?':
		'Division and multiplication operations are handled before subtraction and addition operations.',
	'the employees table contains these columns: salary number(7,2) bonus number(7,2) commission_pct number(2,2) all three columns contain values greater than zero. there is one row of data in the table and the values are as follows: salary = 500, bonus = 50, commission_pct = .5 evaluate these two sql statements: 1. select salary + bonus + commission_pct * salary - bonus as income from employees; 2. select (salary + bonus ) + commission_pct * (salary - bonus) income from employees; what will be the result?':
		'Statement 2 will return a higher value than statement 1.',
	'which sql statement will return an error?': 'SEL * FR sky;',
	'if you want to see just a subset of the columns in a table, you use what symbol?':
		'None of the above; instead of using a symbol, you name the columns for which you want to see data.',
	'if the employees table has the following columns, and you want to write a select statement to return the employee last name and department number for employee number 176, which of the following sql statements should you use? name type length employee_id number 22 first_name varchar2 20 last_name varchar2 25 email varchar2 25 phone_number varchar2 20 salary number 22 commission_pct number 22 manager_id number 22 department_id number 22':
		'SELECT last_name, department_id FROM employees WHERE employee_id = 176;',
	'which example would limit the number of rows returned?':
		'SELECT title FROM d_songs WHERE type_code = 88;',
	'to restrict the rows returned from an sql query, you should use the _____ clause:':
		'WHERE',
	'which of the following is not being done in this sql statement? select first_name || \\\' \\\' || last_name "name" from employees;':
		'Concatenating first name, middle name and last name',
	'in order to eliminate duplicate rows use the ________ keyword': 'DISTINCT',
	'the employees table contains these columns: last_name varchar2(25) first_name varchar2(25) email varchar2(50) you are writing a select statement to retrieve the names of employees that have an email address. select last_name||\\\', \\\'||first_name "employee name" from employees; which where clause should you use to complete this statement?':
		'WHERE email IS NOT NULL;',
	'when using the "like" operator, the % and _ symbols can be used to do a pattern- matching, wild card search.':
		'True',
	'the employees table includes these columns: employee_id number(4) not null last_name varchar2(15) not null first_name varchar2(10) not null hire_date date not null you want to produce a report that provides the last names, first names, and hire dates of those employees who were hired between march 1, 2000, and august 30, 2000. which statements can you issue to accomplish this task?':
		'SELECT last_name, first_name, hire_date FROM employees WHERE hire_date BETWEEN \'01-Mar-2000\' AND \'30-Aug-2000\';',
	'the players table contains these columns: players table: last_name varchar2 (20) first_name varchar2 (20) salary number(8,2) team_id number(4) manager_id number(9) position_id number(4) you must display the player name, team id, and salary for players whose salary is in the range from 25000 through 100000 and whose team id is in the range of 1200 through 1500. the results must be sorted by team id from lowest to highest and then further sorted by salary from highest to lowest. which statement should you use to display the desired result?':
		'SELECT last_name, first_name, team_id, salary FROM players WHERE salary BETWEEN 25000 AND 100000 AND team_id BETWEEN 1200 AND 1500 ORDER BY team_id, salary DESC;',
	'the following statement represents a multi-row function.select max(salary) from employees':
		'True',
	"you want to display all players' names with position 6900 or greater. you want the players names to be displayed alphabetically by last name and then by first name. which statement should you use to achieve the required results?":
		"SELECT last_name, first_name FROM players WHERE position_id >= 6900 ORDER BY last_name, first_name;|position_id >= 6900",
	'evaluate this sql statement: select e.employee_id, e.last_name, e.first_name, m.manager_id from employees e, employees m order by e.last_name, e.first_name where e.employee_id = m.manager_id; this statement fails when executed. which change will correct the problem?':
		'Reorder the clauses in the query.',
	'which columns can be added to the order by clause in the following select statement? select first_name, last_name, salary, hire_date from employees where department_id = 50 order by ?????;':
		'Any column in the EMPLOYEES table, any expression in the SELECT list or any ALIAS in the SELECT list|All columns in the EMPLOYEES table|last_name, first_name',
	'evaluate this sql statement: select product_id, product_name, price from products order by product_name, price; what occurs when the statement is executed?':
		'The results are sorted alphabetically and then numerically.',
	'what value will the following sql statement return? select employee_id from employees where employee_id between 100 and 150 or employee_id in(119, 175, 205) and (employee_id between 150 and 200);':
		'100, 101, 102, 103, 104, 107, 124, 141, 142, 143, 144, 149',
	"which of the following would be returned by this sql statement: select first_name, last_name, department_id from employees where department_id in(50,80) and first_name like ' c% ' or last_name like ' %s% '":
		"All of the above",
	'you issue this sql statement: select round (1282.248, -2) from dual; what value does this statement produce?':
		'1300',
	'the answer to the following script is 456.select trunc(round(456.98)) from dual;':
		'False',
	"if hire_date has a value of '03-jul-2003', then what is the output from this code? select round(hire_date, 'year') from employees;":
		"01-Jan-2004",
	'evaluate this select statement: select sysdate + 30 from dual; which value is returned by the query?':
		'The current date plus 30 days.',
	'the styles table contains this data: style_id style_name category cost 895840 sandal 85940 12.00 968950 sandal 85909 10.00 869506 sandal 89690 15.00 809090 loafer 89098 10.00 890890 loafer 89789 14.00 857689 heel 85940 11.00 758960 sandal 86979 12.00 you query the database and return the value 79. which script did you use?':
		'SELECT SUBSTR(category, -2,2) FROM styles WHERE style_id = 758960;',
	'you query the database with this sql statement: select concat(last_name, (substr(lower(first_name), 4))) "default password" from employees; which function will be evaluated first?':
		'LOWER',
	"if quantity is a number datatype, what is the result of this statement? select nvl(200/quantity, 'zero') from inventory;":
		"The statement fails",
	"the product table contains this column: price number(7,2) evaluate this statement: select nvl(10 / price, '0') from product; what would happen if the price column contains null values?":
		"A value of 0 would be displayed.",
	'with the following data in employees (last_name, commission_pct, manager_id) what is the result of the following statement? data: king, null, null kochhar, null, 100 vargas, null, 124 zlotkey, .2, 100 select last_name, nvl2(commission_pct, manager_id, -1) comm from employees ;':
		'King, -1 Kochhar, -1 Vargas, -1 Zlotkey, 100',
	"for the given data from employees (last_name, manager_id) what is the result of the following statement: data:( king, null kochhar, 100 de haan, 100 hunold, 102 ernst, 103) select last_name, decode(manager_id, 100, 'king', 'a n other') \\\"works for?\\\" from employees":
		"King, A N Other Kochhar, King De Haan, King Hunold, A N Other Ernst, A N Other",
	'the employees table contains these columns: employee_id number(9) last_name varchar2 (25) first_name varchar2 (25) hire_date date you need to display hire_date values in this format: january 28, 2000 which sql statement could you use?':
		'SELECT TO_CHAR(hire_date, \'Month DD, YYYY\') FROM employees;',
	'sysdate is 12-may-2004. you need to store the following date: 7-dec-89 which statement about the date format for this value is true?':
		'The RR date format will interpret the year as 1989, and the YY date format will interpret the year as 2089',
	'will the following statement return one row? select max(salary), min(salary), avg(salary) from employees;':
		'Yes, it will return the highest salary, the lowest salary, and the average salary from all employees.',
	'round and trunc functions can be used with which of the following datatypes?':
		'Dates and numbers',
	'the price table contains this data: product_id manufacturer_id 86950 59604 you query the database and return the value 95. which script did you use?':
		'SELECT SUBSTR(product_id, 3, 2) FROM price WHERE manufacturer_id = 59604;',
	'you query the database with this sql statement: select lower(substr(concat(last_name, first_name)), 1, 5) "id" from employee; in which order are the functions evaluated?':
		'CONCAT, SUBSTR, LOWER',
	'the employees table contains these columns: employee_id number(9) last_name varchar2 (25) first_name varchar2 (25) salary number(6) you need to create a report to display the salaries of all employees. which sql statement should you use to display the salaries in format: "$45,000.00"?':
		'SELECT TO_CHAR(salary, \'$999,999.00\') FROM employees;',
	'below find the structures of the products and vendors tables: products product_id number product_name varchar2 (25) vendor_id number category_id number vendors vendor_id number vendor_name varchar2 (25) address varchar2 (30) city varchar2 (25) region varchar2 (10) postal_code varchar2 (11) you want to create a query that will return an alphabetical list of products, including the product name and associated vendor name, for all products that have a vendor assigned. which two queries could you use?':
		'SELECT p.product_name, v.vendor_name FROM products p JOIN vendors v USING (vendor_id) ORDER BY p.product_name;|SELECT p.product_name, v.vendor_name FROM products p NATURAL JOIN vendors v ORDER BY p.product_name;',
	'the following statement is an example of what kind of join?':
		'Outer Join',
	'will the following statement work? select department_name, last_name from employees, departments where department_id = department_id;':
		'No, Oracle will return a Column Ambiguously Defined error.',
	'when joining 3 tables in a select statement, how many join conditions are needed in the where clause?':
		'2',
	'evaluate this select statement: select p.player_id, m.last_name, m.first_name, t.team_name from player p left outer join player m on (p.manager_id = m.player_id) left outer join team t on (p.team_id = t.team_id); which join is evaluated first?':
		'The self-join of the player table',
	'evaluate this select statement: select count(*) from products; which statement is true?':
		'The number of rows in the table is displayed.',
	'the vendors table contains these columns: vendor_id number primary key name varchar2(30) location_id number order_dt date order_amount number(8,2) which two clauses represent valid uses of aggregate functions for this table?':
		'SELECT MIN(AVG(order_amount))|SELECT SUM(order_amount)',
	'which group function would you use to display the highest salary value in the employees table?':
		'MAX',
	'the difference between union and union all is':
		'UNION will remove duplicates; UNION ALL returns all rows from all queries including the duplicates.',
	'examine the following statement: select department_id, manager_id, job_id, sum(salary) from employees group by grouping sets(.......); select the correct group by grouping sets clause from the following list:':
		'GROUP BY GROUPING SETS ((department_id, manager_id), (department_id, job_id), (manager_id, job_id))',
	'cube can be applied to all aggregate functions including avg, sum, min, max, and count.':
		'True',
	'group functions can be nested to a depth of?': 'Two',
	'evaluate this select statement: select min(hire_date), department_id from employees group by department_id; which values are displayed?':
		'The earliest hire date in each department',
	'which statement about the group by clause is true?':
		'To exclude rows before dividing them into groups using the GROUP BY clause, you should use a WHERE clause.',
	'which of the following best describes the meaning of the any operator?':
		'Compare value to each value returned by the subquery',
	'which statement about the any operator, when used with a multiple-row subquery, is true?':
		'The ANY operator compares every value returned by the subquery.',
	'evaluate this select statement: select player_id, name from players where team_id in (select team_id from teams where team_id > 300 and salary_cap > 400000); what would happen if the inner query returned a null value?':
		'No rows would be returned by the outer query.',
	'which comparison operator can only be used with a single-row subquery?':
		'<>',
	'table aliases must be used when you are writing correlated subqueries.':
		'False',
	"you want to create a list of all albums that have been produced by the company. the list should include the title of the album, the artist's name, and the date the album was released. the albums table includes the following columns: alb_title varchar2(150) not null alb_artist varchar2(150) not null alb_date date not null which statement can you use to retrieve the necessary information?":
		"SELECT alb_title; alb_artist; alb_date FROM albums;",
	"the following is a valid sql select statement.select first_name || ' ' || last_name alias as employee_name from employees:":
		"False",
	'evaluate this select statement: select last_name, first_name, salary from employees; how will the heading for the first_name column appear in the display by default in oracle application express?':
		'The heading will display as uppercase and centered.',
	"what does the following sql select statement return? select upper( substr('database programming', instr('database programming','p'),20)) from dual;":
		"PROGRAMMING",
	'consider the following data in the employees table: (last_name, commission_pct, manager_id) data: king, null, null kochhar, null, 100 vargas, null, 124 zlotkey, .2, 100 what is the result of the following statement: select last_name, coalesce(commission_pct, manager_id, -1) comm from employees ;':
		'King, -1\\nKochhar, 100\\nVargas, 124\\nZlotkey, .2',
	'you need to create a report that lists all employees in department 10 (sales) whose salary is not equal to $25,000 per year. which query should you issue to accomplish this task?':
		'SELECT last_name, first_name, salary FROM employees WHERE salary != 25000 AND dept_id = 10;',
	'you have two tables named employees and sales. you want to identify the sales representatives who have generated at least $100,000 in revenue. which query should you issue?':
		'SELECT e.first_name, e.last_name, s.sales FROM employees e, sales s WHERE e.employee_id = s.employee_id AND revenue >= 100000;',
	'the employees table contains these columns: employee_id number(9) last_name varchar2(20) first_name varchar2(20) salary number(9,2) hire_date date bonus number(7,2) comm_pct number(4,2) which three functions could be used with the hire_date, last_name, or salary columns?':
		'COUNT|MAX|MIN',
	'what command can be used to create a new row in a table in the database?':
		'INSERT',
	"evaluate this select statement: select employee_id, last_name, first_name, salary 'yearly salary' from employees where salary is not null order by last_name, 3; which clause contains an error?":
		"SELECT employee_id, last_name, first_name, salary 'Yearly Salary'",
	"what is the result of the following query? select add_months ('11-jan-1994',6) from dual;":
		"11-Jul-1994",
	'you issue this sql statement: select trunc(751.367,-1) from dual; which value does this statement display?':
		'750',
	"the styles table contains this data: style_id style_name category cost 895840 sandal 85940 12.00 968950 sandal 85909 10.00 869506 sandal 89690 15.00 809090 loafer 89098 10.00 890890 loafer 89789 14.00 857689 heel 85940 11.00 758960 sandal 86979 evaluate this select statement: select style_id, style_name, category, cost from styles where style_name like 'sandal' and nvl(cost, 0) < 15.00 order by category, cost; which result will the query provide?":
		"STYLE_ID STYLE_NAME CATEGORY COST 968950 SANDAL 85909 10.00 895840 SANDAL 85940 12.00 758960 SANDAL 86979",
	"given the following descriptions of the employees and jobs tables, which of the following scripts will display each employee's possible minimum and maximum salaries based on their job title? employees table: name null? type employee_id not null number (6) first_name varchar2 (20) last_name not null varchar2 (25) email not null varchar2 (25) phone_number varchar2 (20) hire_date not null date job_id not null varchar2 (10) salary number (8,2) commission_pct number (2,2) manager_id number (6) department_id number (4) jobs table: name null? type job_id not null varchar2 (10) job_title not null varchar2 (35) min_salary number (6) max_salary number (6)":
		"SELECT first_name, last_name, job_id, min_salary, max_salary FROM employees NATURAL JOIN jobs;",
	'evaluate this select statement: select a.lname || \\\', \\\' || a.fname as "patient", b.lname || \\\', \\\' || b.fname as "physician", c.admission from patient a join physician b on (b.physician_id = c.physician_id) join admission c on (a.patient_id = c.patient_id); which clause generates an error?':
		'ON (b.physician_id = c.physician_id);',
	'which operator is typically used in a nonequijoin?':
		'>=, <=, or BETWEEN ...AND',
	'what happens when you create a cartesian product?':
		'All rows from one table are joined to all rows of another table',
	'given the following data in the employees table (employee_id, salary, commission_pct) data: (143, 2600, null 144, 2500, null 149, 10500, .2 174, 11000, .3 176, 8600, .2 178, 7000, .15) what is the result of the following statement: select sum(commission_pct), count(salary) from employees where employee_id in( 143,144,149,174,176,178);':
		'SUM = .85 and COUNT = 6',
	'the following statement will work, even though it contains more than one group function: select avg(salary), max(salary), min(salary), sum(salary) from employees;':
		'True',
	'evaluate this select statement: select count(*) from employees where salary > 30000; which result will the query display?':
		'The number of rows in the EMPLOYEES table that have a salary greater than 30000',
	'when using set operators, the number of columns and the data types of the columns must be identical in all of the select statements used in the query. true or false.':
		'True',
	'the products table contains these columns: product_id number(9) pk category_id varchar2(10) location_id number(9) description varchar2(30) cost number(7,2) price number(7,2) quantity number you display the total of the extended costs for each product category by location. you need to include only the products that have a price less than $25.00. the extended cost of each item equals the quantity value multiplied by the cost value. which sql statement will display the desired result?':
		'SELECT category_id, SUM(cost * quantity) TOTAL, location_id FROM products WHERE price < 25.00 GROUP BY category_id, location_id;',
	'if a select list contains both a column as well as a group function then what clause is required?':
		'GROUP BY clause',
	'read the following select statement. choose the column or columns that must be included in the group by clause. select count(last_name), grade, gender from students group_by ?????;':
		'grade, gender',
	'if you want to include subtotals and grand totals for all columns mentioned in a group by clause, you should use which of the following extensions to the group by clause?':
		'CUBE',
	'what would happen if you attempted to use a single-row operator with a multiple-row subquery?':
		'An error would be returned.',
	'examine the structures of the parts and manufacturers tables: parts: parts_id varchar2(25) pk parts_name varchar2(50) manufacturers_id number cost number(5,2) price number(5,2) manufacturers: id number pk name varchar2(30) location varchar2(20) assume that the tables have been populated with data including 100 rows in the parts table, and 20 rows in the manufacturers table. which sql statement correctly uses a subquery?':
		'SELECT parts_name, price, cost FROM parts WHERE manufacturers_id IN (SELECT id FROM manufacturers m JOIN parts p ON (m.id = p.manufacturers_id));',
	'when a multiple-row subquery uses the not in operator (equivalent to <>all), if one of the values returned by the inner query is a null value, the entire query returns:':
		'No rows returned',
	'which of the following is true regarding the order of subquery execution?':
		'The subquery executes once before the main query.',
	'if the subquery returns no rows, will the outer query return any values?':
		'No, because the subquery will be treated like a null value.',
	'evaluate this select statement: select (salary * raise_percent) raise from employees; if the raise_percent column only contains null values, what will the statement return?':
		'Only null values',
	'the following statement represents a multi-row function.select upper(last_name) from employees;':
		'False',
	'evaluate this select statement: select * from employees where department_id = 34 or department_id = 45 or department_id = 67; which operator is the equivalent of the or conditions used in this select statement?':
		'IN',
	'evaluate this select statement: select last_name, first_name, department_id, manager_id from employees; you need to sort data by manager id values and then alphabetically by employee last name and first name values. which order by clause could you use?':
		'ORDER BY manager_id, last_name, first_name',

	'you query the database with this sql statement:\\nselect *\\nfrom transaction\\nwhere product_id = 4569;\\n\\nwhich sql select statement capabilities are achieved when this statement is executed?':
		'Selection and projection only',

	'select * from departments; is a:': 'Statement',

	'the order of operator precedence is:': '* / + –',

	"given the following descriptions of the employees and jobs tables, which of the following scripts will display each employee's possible minimum and maximum salaries based on their job title?\\nemployees table:\\nname null? type\\nemployee_id not null number (6)\\nfirst_name varchar2 (20)\\nlast_name not null varchar2 (25)\\nemail not null varchar2 (25)\\nphone_number varchar2 (20)\\nhire_date not null date\\njob_id not null varchar2 (10)\\nsalary number (8,2)\\ncommission_pct number (2,2)\\nmanager_id number (6)\\ndepartment_id number (4)\\njobs table:\\nname null? type\\njob_id not null varchar2 (10)\\njob_title not null varchar2 (35)\\nmin_salary number (6)\\nmax_salary number (6)":
		"SELECT first_name, last_name, job_id, min_salary, max_salary\\nFROM employees\\nNATURAL JOIN jobs;",
	'what is another name for a simple join or an inner join?': 'Equijoin',
	'you need to join the employee_hist and employees tables. the employee_hist table will be the first table in the from clause. all the matched and unmatched rows in the employees table need to be displayed. which type of join will you use?':
		'A right outer join',
	'employees table:\\nname null? type\\nemployee_id not null number(6)\\nfirst_name varchar2(20)\\nlast_name not null varchar2(25)\\ndepartment_id number (4)\\ndepartments table:\\nname null? type\\ndepartment_id not null number 4\\ndepartment_name not null varchar2(30)\\nmanager_id number (6)\\na query is needed to display each department and its manager name from the above tables. however, not all departments have a manager but we want departments returned in all cases. which of the following sql: 1999 syntax scripts will accomplish the task?':
		'SELECT d.department_id, e.first_name, e.last_name\\nFROM employees e\\nRIGHT OUTER JOIN departments d\\nON (e.employee_id = d.manager_id);|SELECT departments.department_id, employees.first_name, employees.last_name\\nFROM employees\\nRIGHT OUTER JOIN departments\\nON (employees.employee_id = departments.manager_id);',

	'which statement about a self join is true?':
		'Table aliases must be used to qualify table names.',
	'which of the following database design concepts do you need in your tables to write hierarchical queries?':
		'Recursive Relationship',
	'evaluate this select statement:\\nselect *\\nfrom employee e, employee m\\nwhere e.mgr_id = m.emp_id;\\nwhich type of join is created by this select statement?':
		'a self join',
	'hierarchical queries must use the level pseudo column.':
		'False',
	'a join between tables where the result set includes matching values from both tables but does not return any unmatched rows could be called which of the following?':
		'Equijoin|Simple join|Self join',
	'a natural join is based on:': 'Columns with the same name and datatype',
	'you need to join two tables that have two columns with the same name, datatype, and precision. which type of join would you create to join the tables on both of the columns?':
		'Natural join',
	'for which condition would you use an equijoin query with the using keyword?':
		'You need to perform a join of the CUSTOMER and ORDER tables but limit the number of columns in the join condition.',
	'table aliases must be used with columns referenced in the join using clause.':
		'False',
	'the keywords join _____________ should be used to join tables with the same column names but different datatypes.':
		'USING',
	'which of the following conditions will cause an error on a natural join?':
		'If the columns having the same names have different data types, then an error is returned.',
	'which query represents the correct syntax for a left outer join?':
		'SELECT companyname, orderdate, total\\nFROM customers c\\nLEFT OUTER JOIN orders o\\nON c.cust_id = o.cust_id;',
	'which query will retrieve all the rows in the employees table, even if there is no match in the departments table?':
		'SELECT e.last_name, e.department_id, d.department_name\\nFROM employees e\\nLEFT OUTER JOIN departments d ON (e.department_id = d.department_id);|SELECT employees.last_name, employees.department_id, departments.department_name\\nFROM employees\\nLEFT OUTER JOIN departments ON (employees.department_id = departments.department_id);',
	'which type of join returns rows from one table that have no direct match in the other table?':
		'Outer join',
	'the primary advantages of using join on is:':
		'It permits columns that don\\\'t have matching data types to be joined.|It permits columns with different names to be joined.',
	'the primary advantage of using join on is:':
		'It permits columns with different names to be joined.',
	'which of the following database design concepts is implemented with a self join?':
		'Recursive Relationship',
	'hierarchical queries can walk both top-down and bottom-up.':
		'True',
	'the following is a valid sql statement.\\nselect e.employee_id, e.last_name, d.location_id, department_id\\nfrom employees e join departments d\\nusing (department_id) ;\\n\\n':
		'True',
	'which keyword in a select statement creates an equijoin by specifying a column name common to both tables?':
		'A USING clause',
	'below find the structures of the products and vendors tables:\\nproducts\\nproduct_id number\\nproduct_name varchar2 (25)\\nvendor_id number\\ncategory_id number\\n\\nvendors\\nvendor_id number\\nvendor_name varchar2 (25)\\naddress varchar2 (30)\\ncity varchar2 (25)\\nregion varchar2 (10)\\npostal_code varchar2 (11)\\n\\nyou want to create a query that will return an alphabetical list of products, including the product name and associated vendor name, for all products that have a vendor assigned.\\n\\nwhich two queries could you use?':
		'SELECT p.product_name, v.vendor_name\\nFROM products p\\nNATURAL JOIN vendors v\\nORDER BY p.product_name;|SELECT p.product_name, v.vendor_name\\nFROM products p\\nJOIN vendors v\\nUSING (vendor_id)\\nORDER BY p.product_name;',
	'you need to join all the rows in the employees table to all the rows in the emp_reference table. which type of join should you create?':
		'A cross join',
	'what types of joins will return the unmatched values from both tables in the join?':
		'Full outer joins',
	'for which of the following tables will all the values be retrieved even if there is no match in the other?\\nselect employees.last_name, employees.department_id, departments.department_name\\nfrom employees\\nleft outer join departments\\non (employees.department_id = departments.department_id);':
		'employees',
	'you can do nonequi-joins with ansi-syntax.': 'True',
	'evaluate this select statement:\\n\\nselect patient.lname || \\\', \\\' || patient.fname as "patient", physician.lname || \\\', \\\' || physician.fname as "physician", admission.admission\\nfrom patient\\njoin physician\\non (physician.physician_id = admission.physician_id)\\njoin admission\\non (patient.patient_id = admission.patient_id);\\n\\nwhich clause generates an error?':
		'ON (physician.physician_id = admission.physician_id);',
	'if you select rows from two tables (employees and departments) using the outer join specified in the example, what will you get?\\nselect employees.last_name, employees.department_id, departments.department_name\\nfrom employees\\nleft outer join departments\\non (employees.department_id = departments.department_id);':
		'All employees including those that do not have a departement_id assigned to them',
	'which select statement implements a self join?':
		'SELECT item.part_id, type.product_id\\nFROM part item JOIN part type\\nON item.part_id = type.product_id;|SELECT worker.employee_id, manager.manager_id\\nFROM employees worker JOIN employees manager\\nON manager.employee_id = worker.manager_id;|SELECT e.employee_id, m.manager_id FROM employees e, employees m WHERE m.employee_id = e.manager_id;',
	'the join column must be included in the select statement when you use the natural join clause.':
		'False',
	'which two sets of join keywords create a join that will include unmatched rows from the first table specified in the select statement?':
		'LEFT OUTER JOIN and FULL OUTER JOIN',
	'which statement about a natural join is true?':
		'Columns with the same names must have the same datatype.',
	'evaluate this select statement:\\nselect *\\nfrom employee worker join employee manager\\non worker.mgr_id = manager.emp_id;\\nwhich type of join is created by this select statement?':
		'a self join',
	'which of the following statements is the simplest description of a nonequijoin?':
		'A join condition containing something other than an equality operator',
	'which syntax would be used to retrieve all rows in both the employees and departments tables, even when there is no match?':
		'FULL OUTER JOIN',
	'you created the customers and orders tables by issuing these create table statements in sequence:\\ncreate table customers\\n(custid varchar2(5),\\ncompanyname varchar2(30),\\ncontactname varchar2(30),\\naddress varchar2(30),\\ncity varchar2(20),\\nstate varchar2(30),\\nphone varchar2(20),\\nconstraint pk_customers_01 primary key (custid));\\n\\ncreate table orders\\n(orderid varchar2(5) constraint pk_orders_01 primary key,\\norderdate date,\\ntotal number(15),\\ncustid varchar2(5) references customers (custid));\\n\\nyou have been instructed to compile a report to present the information about orders placed by customers who reside in nashville. which query should you issue to achieve the desired results?':
		'SELECT orderid, orderdate, total\\nFROM orders\\nJOIN customers ON orders.custid = customers.custid\\nWHERE city = \'Nashville\';',
	'which select statement will return the last name and hire date of an employee and his/ her manager for employees that started in the company before their managers? [ansi join version]':
		'SELECT worker.last_name, worker.hire_date, manager.last_name, manager.hire_date\\nFROM employees worker JOIN employees manager\\nON worker.manager_id = manager.employee_id\\nWHERE worker.hire_date < manager.hire_date',
	'you need to provide a list of the first and last names of all employees who work in the sales department who earned a bonus and had sales over $50,000. the company president would like the sales listed starting with the highest amount first. the employees table and the sales_dept table contain the following columns:\\nemployees\\nemployee_id number(10) primary key\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\ndeptartment_id varchar2(20)\\nhire_date date\\nsalary number(10)\\n\\nsales_dept\\nsales_id number(10) primary key\\nsales number(20)\\nquota number(20)\\nmanager varchar2(30)\\nbonus number(10)\\nemployee_id number(10) foreign key\\n\\nwhich select statement will accomplish this task?':
		'SELECT e.employee_id, e.last_name, e.first_name, s.employee_id, s.bonus, s. sales\\nFROM employees e, sales_dept s\\nWHERE e.employee_id = s.employee_id AND s.bonus IS NOT NULL AND sales > 50000\\nORDER BY sales DESC;',

	'all computers in the world speak the same languages, so you only need to learn one programming language - oracle sql.':
		'False',

	'what command do you use to add rows to a table': 'INSERT',
	'the explanation below is a column integrity constraint:\\na column must contain only values consistent with the defined data format of the column.':
		'True',

	'which select statement will return the last name and hire date of an employee and his/ her manager for employees that started in the company before their managers?':
		'SELECT worker.last_name, worker.hire_date, manager.last_name, manager.hire_date FROM employees worker JOIN employees manager ON worker.manager_id = manager.employee_id WHERE worker.hire_date < manager.hire_date',

	'identify all of the incorrect statements that complete this sentence: a primary key is:':
		'A single column that uniquely identifies each column in a table|A set of columns in one table that uniquely identifies each row in another table|Only one column that must be null',

	'the explanation below is a user defined integrity rule and must therefore be manually coded, the database cannot enforce this rule automatically:\\na primary key must be unique, and no part of the primary key can be null.':
		'False',

	'the text below is an example of what constraint type:\\nthe value in the manager_id column of the employees table must match a value in the employee_id column in the employees table.':
		'Referential integrity',

	'it is possible to implement non-transferability via a simple foreign key relationship.':
		'False',

	'many to many relationships are implemented via a structure called a: ________________':
		'Intersection Table',

	'which of the following are reasons why you should consider using a subtype implementation?':
		'Business functionality and business rules, access paths and frequency of access are all very different between subtypes.',

	'evaluate this select statement:\\nselect (salary * raise_percent) raise\\nfrom employees;\\n\\nif the raise_percent column only contains null values, what will the statement return?':
		'Only null values',

	'what would you use in the select clause to return all the columns in the table?':
		'An asterisk (*)',

	'when you use the select clause to list one or two columns only from a table and no where clause, which sql capability is used?':
		'Projection only',

	'in a select clause, what is the result of 2 + 3 * 2?': '8',

	'you query the database with this sql statement:\\nselect * from students;\\n\\nwhy would you use this statement?':
		'To view data',

	'any non-uid must be dependant on the entire uid.': 'True',

	'when is an entity in 2nd normal form?':
		'When all non-UID attributes are dependent upon the entire UID.',

	'what does the distinct keyword do when it is used in a select clause?':
		'Eliminates duplicate rows in the result',

	'which symbol represents the not equal to condition?': '!=',

	'which statement best describes how column headings are displayed by default in oracle application express:':
		'Column headings are displayed centered and in uppercase.',

	'what will the result of the following select statement be:\\nselect last_name, salary, salary + 300\\nfrom employees;\\nhow will the heading for the salary column appear in the display by default in oracle application express?':
		'Display the last name, salary and the results of adding 300 to each salary for all the employees',

	'the players table contains these columns:\\nplayer_id number(9)\\nlast_name varchar2(20)\\nfirst_name varchar2 (20)\\nteam_id number (4)\\nmanager_id number (9)\\nposition_id number (4)\\n\\nwhich select statement should you use if you want to display unique combinations of the team_id and manager_id columns?':
		'SELECT DISTINCT team_id, manager_id FROM players;',

	'the employees table contains these columns:\\nemployee_id number(9) primarykey\\nlast_name varchar2 (20)\\nfirst_name varchar2 (20)\\ndepartment_id number(5) not null\\nmanager_id number(9) not null\\n\\nevaluate these two select statements:\\n1. select distinct employee_id, department_id, manager_id from employees;\\n2. select employee_id, department_id, manager_id from employees;\\n\\nwhich of the following statements is true?':
		'The two statements will display the same data.',

	'the student table contains these columns:\\nstudent_id number(10) primary key\\nlast_name varchar2(25)\\nfirst_name varchar2(25)\\nmain_subject_id number(3)\\nadvisor_id number(5)\\n\\nevaluate this statement:\\nselect distinct advisor_id, main_subject_id\\nfrom student;\\n\\nwhich statement is true?':
		'Each MAIN_SUBJECT_ID can be displayed more than once per ADVISOR_ID.',

	'the employees table includes these columns:\\nemployee_id number(4) not null\\nlast_name varchar2(15) not null\\nfirst_name varchar2(10) not null\\nhire_date date not null\\n\\nyou want to produce a report that provides the first names, last names and hire dates of those employees who were hired between march 1, 2000, and august 30, 2000. which statements can you issue to accomplish this task?':
		'SELECT last_name, first_name, hire_date\\nFROM employees\\nWHERE hire_date BETWEEN ’01-MAR-00′ AND ’30-AUG-00′;',

	// duplicate players 6900 key removed

	'evaluate this select statement:\\nselect *\\nfrom employees\\nwhere salary > 30000\\nand department_id = 10\\nor email is not null;\\nwhich statement is true?':
		'The AND condition will be evaluated before the OR condition.',

	'you need to create a report to display all employees that were hired on or after january 1, 1996. the data should display in this format:\\nemployee start date and salary\\n14837 - smith 10-may-92 / 5000\\n\\nwhich select statement could you use?':
		'SELECT employee_id ||’ – ‘|| last_name „Employee”,\\nhire_date ||’ / ‘|| salary „Start Date and Salary”\\nFROM employees\\nWHERE hire_date <= ’01-JAN-96’;',

	'you attempt to query the database with this sql statement:\\nselect product_id „product number", category_id „category", price „price"\\nfrom products\\nwhere „category" = 5570\\norder by „product number";\\n\\nthis statement fails when executed. which clause contains a syntax error?':
		'WHERE „Category” = 5570',

	'evaluate this select statement:\\nselect employee_id, last_name, first_name, salary \'yearly salary\'\\nfrom employees\\nwhere salary is not null\\norder by last_name, 3;\\n\\nwhich clause contains an error?':
		'SELECT employee_id, last_name, first_name, salary ‘Yearly Salary’',

	'which comparison condition means „less than or equal to?"': '„<=”',
	'which sql keyword specifies that an alias will be substituted for a column name in the output of a sql query?':
		'AS',
	'the sql select statement is capable of:': 'Selection and projection',
	'what is a null value?': 'An unknown value',
	'in which clause of a select statement would you specify the name of the table or tables being queried?':
		'The FROM clause',
	'in the real world, databases used by businesses generally have a single table.':
		'False',
	'what language is used to query data in a relational database?': 'SQL',

	'the main reason that constraints are added to a table is:':
		'Constraints ensure data integrity',

	'the customer_finance table contains these columns:\\ncustomer_id number(9)\\nnew_balance number(7,2)\\nprev_balance number(7,2)\\npayments number(7,2)\\nfinance_charge number(7,2)\\ncredit_limit number(7)\\n\\nyou execute this statement:\\nselect rownum "rank", customer_id, new_balance\\nfrom (select customer_id, new_balance from customer_finance)\\nwhere rownum <= 25\\norder by new_balance desc;\\n\\nwhat statement is true?':
		'The statement will not necessarily return the 25 highest new balance values, as the inline view has no ORDER BY clause.',
	'databases are used in most countries and by most governments. life, as we know it, would change drastically if we no longer had access to databases.':
		'True',
	'most of the well know internet search engines use databases to store data.':
		'True',
	'a relational database generally contains two or more tables.':
		'True',
	'what command can be used to show information about the structure of a table?':
		'DESCRIBE',
	'what command retrieves data from the database?': 'SELECT',
	'what command will return data from the database to you?': 'SELECT',
	'every time you shop online, it is likely you will be accessing a database.':
		'True',
	'every row in a relational database table is unique.': 'True',
	'the basic storage structure in a relational database is a _________:':
		'Table',
	'columns in a database table contain data with the same _________:': 'Type',
	'in the default order of precedence, which operator would be evaluated first?':
		'Multiplications and Divisions are at the same level and would be evaluated first based on left to right order',
	'the select statement retrieves information from the database. in a select statement, you can do all of the following except:':
		'Manipulation',
	'when listing columns in the select list, what should you use to separate the columns?':
		'Commas',
	'if a sql statement returns data from two or more tables, which sql capability is being used?':
		'Joining',
	'there is only one kind of software used by all computers.':
		'False',
	'the _______ clause can be added to a select statement to return a subset of the data.':
		'WHERE',
	'you cannot use computers unless you completely understand exactly how they work.':
		'False',
	'what command can be added to a select statement to return a subset of the data?':
		'WHERE',
	'the employees table contains these columns:\\nsalary number(7,2)\\nbonus number(7,2)\\ncommission_pct number(2,2)\\n\\nall three columns contain values greater than zero.\\nthere is one row of data in the table and the values are as follows:\\nsalary = 500, bonus = 50, commission_pct = .5\\n\\nevaluate these two sql statements:\\n\\n1.\\nselect salary + bonus + commission_pct * salary - bonus as income\\nfrom employees;\\n\\n2.\\nselect (salary + bonus ) + commission_pct * (salary - bonus) income\\nfrom employees;\\n\\nwhat will be the result?':
		'Statement 2 will return a higher value than statement 1.',
	'examine the follolowing select statement.\\nselect *\\nfrom employees;\\n\\nthis statement will retrieve all the rows in the employees table.':
		'True',
	'which of the following are true?':
		'Date values are format-sensitive|Date values are enclosed in single quotation marks',
	'which of the following would be returned by this select statement:\\nselect last_name, salary\\nfrom employees\\nwhere salary < 3500;':
		'LAST_NAME  SALARY\\nDavies 3100',
	'how can you write "not equal to" in the where-clause?': 'All of the above',
	'which select statement will display both unique and non-unique combinations of the manager_id and department_id values from the employees table?':
		'SELECT manager_id, department_id FROM employees;',
	'where in a sql statement can you not use arithmetic operators?': 'FROM',
	'which clause would you include in a select statement to restrict the data returned to only the employees in department 10?':
		'WHERE',
	'the concatenation operator ...': 'All of the above',
	'you need to display employees whose salary is in the range of 30000 and 50000. which comparison operator should you use?':
		'BETWEEN...AND...',
	'which comparison condition would you use to select rows that match a character pattern?':
		'LIKE',
	'which of the following where clauses would not select the number 10?':
		'WHERE hours <>10',
	'when using the "like" operator, the % and _ symbols can be used to do a pattern-matching, wild card search.':
		'True',
	'which of the following are examples of comparison operators used in the where clause?':
		'All of the above',
	'if you write queries using the between operator, it does not matter in what order you enter the values, i.e. between low value and high value will give the same result as between high value and low value.':
		'False',
	'the employees table contains these columns:\\nlast_name varchar2(25)\\nfirst_name varchar2(25)\\nemail varchar2(50)\\n\\nyou are writing a select statement to retrieve the names of employees that have an email address.\\n\\nselect last_name||\\\', \\\'||first_name "employee name"\\nfrom employees;\\n\\nwhich where clause should you use to complete this statement?':
		'WHERE email IS NOT NULL;',
	'you need write a select statement that should only return rows that contain 34, 46, or 48 for the department_id column. which operator should you use in the where clause to compare the department_id column to this specific list of values?':
		'IN',
	'you need to write a select statement that should only return rows that contain 34, 46, or 48 for the department_id column. which operator should you use in the where clause to compare the department_id column to this specific list of values?':
		'IN',
	"you want to retrieve a list of customers whose last names begin with the letters 'fr' . which keyword should you include in the where clause of your select statement to achieve the desired result?":
		"LIKE",
	'evaluate this select statement:\\nselect *\\nfrom employees\\nwhere department_id in(10, 20, 30)\\nand salary > 20000;\\n\\nwhich values would cause the logical condition to return true?':
		'DEPARTMENT_ID = 10 and SALARY = 20001',
	'which two statements would select salaries that are greater than or equal to 2500 and less than or equal to 3500?':
		'WHERE salary BETWEEN 2500 AND 3500|WHERE salary >= 2500 AND salary <= 3500',
	'you need to display employees with salaries that are at least 30000 or higher. which comparison operator should you use?':
		'>=',
	'you need to display only unique combinations of the last_name and manager_id columns in the employees table. which keyword should you include in the select clause?':
		'DISTINCT',
	'you need to display employees whose salary is in the range of 10000 through 25000 for employees in department 50 . what does the where clause look like?':
		'WHERE department_id = 50\\nAND salary BETWEEN 10000 AND 25000',
	'you need to combine the first_name and last_name columns in the employees table and display the columns as a combined character string. which operator should you use?':
		'||',
	'the concatenation operator does which of the following?':
		'Links two or more columns or literals to form a single output column',
	'which operator is used to combine columns of character strings to other columns?':
		'||',
	'you need to display all the rows in the employees table that contain a null value in the department_id column. which comparison operator should you use?':
		'IS NULL',
	'which of the following commands will display the last name concatenated with the job id from the employees table, separated by a comma and space, and label the resulting column "employee and title"?':
		'SELECT last_name||\\\', \\\'||job_id "Employee and Title" FROM employees;',
	"the following is a valid sql select statement.\\nselect first_name || ' ' || last_name alias as employee_name\\nfrom employees:":
		"False",
	'when using the like condition to search for _ symbols, which character can you use as the default escape option?':
		'\\\\',
	'which comparison operator searches for a specified character pattern?':
		'LIKE',
	'when using the like condition, which symbol represents any sequence of characters of any length--zero, one, or more characters?':
		'%',
	'which of the following elements cannot be included in a where clause?':
		'A column alias',
	"you want to retrieve a list of customers whose last names begin with the letters 'fr' . which symbol should you include in the where clause of your select statement to achieve the desired result?":
		"%",
	'if the employees table has the following columns, and you want to write a select statement to return the employee last name and department number for employee number 176, which of the following sql statements should you use?\\nname type length\\nemployee_id number 22\\nfirst_name varchar2 20\\nlast_name varchar2 25\\nemail varchar2 25\\nphone_number varchar2 20\\nsalary number 22\\ncommission_pct number 22\\nmanager_id number 22\\ndepartment_id number 22':
		'SELECT last_name, department_id\\nFROM employees\\nWHERE employee_id = 176;',
	'you need to display all the values in the email column that contains the underscore (_) character as part of that email address. the where clause in your select statement contains the like operator. what must you include in the like operator?':
		'The ESCAPE option (\\\\) and one or more percent signs (%)',

	'you need to display all the rows (both matching and non-matching) from both the employee and employee_hist tables. which type of join would you use?':
		'A full outer join',

	'select last_name, salary, salary + 300\\nfrom employees;':
		'Display the last name, salary, and the results of adding 300 to each salary for all the employees',
	'select orderid, orderdate, total\\nfrom orders;': 'WHERE city = \'Chicago\';',

	"you need to display all the employees whose last names (of any length) start with the letters 'sm' . which where clause should you use?":
		"WHERE last_name LIKE 'Sm%'",
	'which of the following is true of the order by clause?':
		'Must be the last clause of the SQL statement | Defaults to an ascending order (ASC)',
	'you attempt to query the database with this sql statement:':
		'WHERE "Category" = 5570',

	'which of the following would be returned by this sql statement:\\nselect first_name, last_name, department_id\\nfrom employees\\nwhere department_id in(50,80)\\nand first_name like \' c% \'\\nor last_name like \' %s% \'':
		'All of the above',

	'what value will the following sql statement return?\\nselect employee_id\\nfrom employees\\nwhere employee_id between 100 and 150\\nor employee_id in(119, 175, 205)\\nand (employee_id between 150 and 200);':
		'100, 101, 102, 103, 104, 107, 124, 141, 142, 143, 144, 149',

	'what clause must you place in a sql statement to have your results sorted from highest to lowest salary?':
		'ORDER BY salary DESC',
	'the players table contains these columns:\\nplayers table:\\nlast_name varchar2 (20)\\nfirst_name varchar2 (20)\\nsalary number(8,2)\\nteam_id number(4)\\nmanager_id number(9)\\nposition_id number(4)\\n\\nyou must display the player name, team id, and salary for players whose salary is in the range from 25000 through 100000 and whose team id is in the range of 1200 through 1500. the results must be sorted by team id from lowest to highest and then further sorted by salary from highest to lowest. which statement should you use to display the desired result?':
		'SELECT last_name, first_name, team_id, salary\\nFROM players\\nWHERE salary BETWEEN 25000 AND 100000\\nAND team_id BETWEEN 1200 AND 1500\\nORDER BY team_id, salary DESC;',
	'evaluate this sql statement:\\nselect e.employee_id, e.last_name, e.first_name, m.manager_id\\nfrom employees e, employees m\\norder by e.last_name, e.first_name\\nwhere e.employee_id = m.manager_id;\\n\\nthis statement fails when executed. which change will correct the problem?':
		'Reorder the clauses in the query.',
	'will the following statement return one row?\\nselect max(salary), min(salary), avg(salary)\\nfrom employees;':
		'Yes, it will return the highest salary, the lowest salary, and the average salary from all employees.',
	'the function count is a single row function.': 'False',
	'the employees table contains these columns:\\nemployee_id number(9) pk\\nlast_name varchar2(25)\\nfirst_name varchar2(25)\\ndepartment_id number(9)\\ncompare these two sql statements:\\n\\n1.\\nselect distinct department_id dept, last_name, first_name\\nfrom employees\\norder by department_id;\\n\\n2.\\nselect department_id dept, last_name, first_name\\nfrom employees\\norder by dept;\\n\\nhow will the results differ?':
		'The statements will sort on different column values.',
	'which columns can be added to the order by clause in the following select statement?\\nselect first_name, last_name, salary, hire_date\\nfrom employees\\nwhere department_id = 50\\norder by ?????;':
		'last_name, first_name|Any column in the EMPLOYEES table, any expression in the SELECT list or any ALIAS in the SELECT list|All columns in the EMPLOYEES table',
	'which select statement should you use to limit the display of product information to those products with a price of less than 50?':
		'SELECT product_id, product_name\\nFROM products\\nWHERE price < 50;',
	'evaluate this sql statement:\\nselect product_id, product_name, price\\nfrom products\\norder by product_name, price;\\n\\nwhat occurs when the statement is executed?':
		'The results are sorted alphabetically and then numerically.',
	'evaluate this select statement:\\nselect last_name, first_name, salary\\nfrom employees;\\n\\nhow will the results of this query be sorted?':
		'The database will display the rows in whatever order it finds it in the database, so no particular order.',
	'evaluate this select statement:\\nselect *\\nfrom employees\\nwhere department_id = 34\\nor department_id = 45\\nor department_id = 67;\\n\\nwhich operator is the equivalent of the or conditions used in this select statement?':
		'IN',
	'from left to right, what is the correct order of precedence?':
		'Arithmetic, Concatenation, Comparison, OR',
	"what will be the results of the following selection?\\nselect *\\nfrom employees\\nwhere last_name not like 'a%' and last_name not like 'b%'":
		"All last names that do not begin with A or B",
	'the order by clause always comes last.': 'True',
	'which symbol in the where clause means "not equal to"?':
		'<>|NOT IN (..)',
	'which comparison condition means "less than or equal to"?': '"<="',
	'which of the following is true of the order by clause:?':
		'Must be the last clause of the SQL statement|Defaults to an ascending order (ASC)',
	'evaluate this select statement:\\nselect first_name, last_name, email\\nfrom employees\\norder by last_name;\\n\\nwhich statement is true?':
		'The rows will be sorted alphabetically by the LAST_NAME values.',
	'evaluate this select statement:\\nselect last_name, first_name, email\\nfrom employees\\norder by email;\\n\\nif the email column contains null values, which statement is true?':
		'Null email values will be displayed last in the result.',
	'the following statement represents a multi-row function.\\nselect max(salary)\\nfrom employees':
		'True',
	'the conversion function to_char is a single row function.':
		'True',
	'the following statement represents a multi-row function.\\nselect upper(last_name)\\nfrom employees;':
		'False',
	'which of the following statements best describes the rules of precedence when using sql?':
		'The order in which the expressions are evaluated and calculated',
	'which of the following best describes the meaning of the like operator?':
		'Match a character pattern.',
	'which statement about the order by clause is true?':
		'You can use a column alias in the ORDER BY clause.',
	'find the clause that will give the same results as:\\nselect *\\nfrom d_cds\\nwhere cd_id not in(90, 91, 92);':
		'WHERE cd_id != 90 and cd_id != 91 and cd_id != 92;',
	// duplicate players 6900 key removed
	'which of the following are true regarding the logical and operator?':
		'TRUE AND FALSE return FALSE',
	'which statement about the default sort order is true?':
		'The earliest date values are displayed first.',
	'a column alias can be specified in an order by clause.':
		'True',
	'which logical operator returns true if either condition is true?': 'OR',
	'which statement about the logical operators is true?':
		'The order of operator precedence is NOT, AND, and OR.',
	'which clause would you include in a select statement to sort the rows returned by the last_name column?':
		'ORDER BY',
	'evaluate this select statement:\\nselect last_name, first_name, department_id, manager_id\\nfrom employees;\\n\\nyou need to sort data by manager id values and then alphabetically by employee last name and first name values. which order by clause could you use?':
		'ORDER BY manager_id, last_name, first_name',
	'evaluate this select statement:\\nselect *\\nfrom employees\\nwhere salary > 30000\\nand department_id = 10\\nor email is not null;\\n\\nwhich statement is true?':
		'The AND condition will be evaluated before the OR condition.',
	'you need to create a report to display all employees that were hired on or before january 1, 1996. the data should display in this format:\\nemployee start date and salary\\n14837 - smith 10-may-1992 / 5000\\nwhich select statement could you use?':
		'SELECT employee_id ||\' - \'|| last_name \\"Employee\\",\\nhire_date ||\' / \'|| salary \\"Start Date and Salary\\"\\nFROM employees\\nWHERE hire_date <= \'01-Jan-1996\';',
	'which of the following are examples of logical operators that might be used in a where clause.':
		'AND, OR|NOT',
	'you need to change the default sort order of the order by clause so that the data is displayed in reverse alphabetical order. which keyword should you include in the order by clause?':
		'DESC',
	'which of the following is earliest in the rules of precedence?':
		'Arithmetic operator',
	'which number function may be used to determine if a value is odd or even?':
		'MOD',
	'what is the result of the following sql statement:\\nselect round(45.923,-1)\\nfrom dual;':
		'50',
	'which two functions can be used to manipulate number or date column values, but not character column values?':
		'ROUND|TRUNC',
	'evaluate this function: mod (25, 2) which value is returned?': '1',
	"which script displays '01-may-2004' when the hire_date value is '20-may-2004'?":
		"SELECT TRUNC(hire_date, 'MONTH')\\nFROM employees;",
	'you need to display the current year as a character value (for example: two thousand and one). which element would you use?':
		'YEAR',
	"what is the result of the following query?\\nselect add_years ('11-jan-1994',6)\\nfrom dual;":
		"This in not a valid SQL statement.",
	"you need to display the number of months between today's date and each employee's hiredate. which function should you use?":
		"MONTHS_BETWEEN",
	'which query would return a whole number if the sysdate is 26-may-2004?':
		'SELECT TRUNC(MONTHS_BETWEEN(SYSDATE,\'19-Mar-1979\') /12)\\nAS YEARS\\nFROM DUAL;',
	'which select statement will not return a date value?':
		'SELECT (SYSDATE - hire_date) + 10*8\\nFROM employees;',
	"you need to display each employee's name in all uppercase letters. which function should you use?":
		"UPPER",
	'the styles table contains this data:\\nstyle_id style_name category cost\\n895840 sandal 85940 12.00\\n968950 sandal 85909 10.00\\n869506 sandal 89690 15.00\\n809090 loafer 89098 10.00\\n890890 loafer 89789 14.00\\n857689 heel 85940 11.00\\n758960 sandal 86979 12.00\\nyou query the database and return the value 79. which script did you use?':
		'SELECT SUBSTR(category, -2,2)\\nFROM styles\\nWHERE style_id = 758960;',
	"what does the following sql select statement return?\\nselect upper( substr('database programming', instr('database programming','p'),20))\\nfrom dual;":
		"PROGRAMMING",
	"you issue this sql statement:\\nselect instr ('organizational sales', 'al')\\nfrom dual;\\n\\nwhich value is returned by this command?":
		"13",
	'which of the following are types of sql functions? (choose two correct answers.)':
		'Multi-Row Functions|Single-Row Functions',
	'the answer to the following script is 456.\\nselect trunc(round(456.98))\\nfrom dual;':
		'False',
	'you issue this sql statement:\\nselect round (1282.248, -2) from dual;\\nwhat value does this statement produce?':
		'1300',
	'you issue this sql statement:\\nselect trunc(751.367,-1) from dual;\\nwhich value does this statement display?':
		'750',
	"if hire_date has a value of '03-jul-2003', then what is the output from this code?\\nselect round(hire_date, 'year') from employees;":
		"01-Jan-2004",
	'which select statement will return a numeric value?':
		'SELECT (SYSDATE - hire_date) / 7\\nFROM employees;',
	'you need to subtract three months from the current date. which function should you use?':
		'ADD_MONTHS',
	"what is the result of the following query?\\nselect add_months ('11-jan-1994',6)\\nfrom dual;":
		"11-Jul-1994",
	'the price table contains this data:\\nproduct_id manufacturer_id\\n86950 59604\\n\\nyou query the database and return the value 95. which script did you use?':
		'SELECT SUBSTR(product_id, 3, 2)\\nFROM price\\nWHERE manufacturer_id = 59604;',
	"you need to display the number of characters in each customer's last name. which function should you use?":
		"LENGTH",
	"identify the output from the following sql statement:\\nselect rpad('sql',6, '*')\\nfrom dual;":
		"SQL***",
	'the employees table contains these columns:\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\nhire_date date\\neval_months number(3)\\n\\nevaluate this select statement:\\n\\nselect hire_date + eval_months\\nfrom employees;\\n\\nthe values returned by this select statement will be of which data type?':
		'DATE',
	'which comparison operator retrieves a list of values?': 'IN',
	'which sql function is used to return the position where a specific character string begins within a larger character string?':
		'INSTR',
	'you query the database with this sql statement:\\nselect concat(last_name, (substr(lower(first_name), 4))) "default password"\\nfrom employees;\\n\\nwhich function will be evaluated first?':
		'LOWER',
	'what function would you use to return the highest date in a month?':
		'LAST_DAY',
	'which of the following sql statements will correctly display the last name and the number of weeks employed for all employees in department 90?':
		'SELECT last_name, (SYSDATE-hire_date)/7 AS WEEKS\\nFROM employees\\nWHERE department_id = 90;',
	'which sql function can be used to remove heading or trailing characters (or both) from a character string?':
		'TRIM',
	'evaluate this select statement:\\nselect sysdate + 30\\nfrom dual;\\n\\nwhich value is returned by the query?':
		'The current date plus 30 days.',
	'which query would return a user password combining the id of an employee and the first 4 digits of the last name?':
		'SELECT CONCAT (employee_id, SUBSTR(last_name,1,4))\\nAS "User Passwords"\\nFROM employees',
	'which function would you use to return the current database server date and time?':
		'SYSDATE',
	'which three statements about functions are true?':
		'The SYSDATE function returns the Oracle Server date and time.|The ROUND number function rounds a value to a specified decimal place or the nearest whole number.|The SUBSTR character function returns a portion of a string beginning at a defined character position to a specified length.',
	"you need to return a portion of each employee's last name, beginning with the first character up to the fifth character. which character function should you use?":
		"SUBSTR",
	'which query selects the first names of the dj on demand clients who have a first name beginning with "a"?':
		'SELECT UPPER(first_name)\\nFROM d_clients\\nWHERE LOWER(first_name) LIKE \'a%\'',
	'you want to create a report that displays all orders and their amounts that were placed during the month of january. you want the orders with the highest amounts to appear first. which query should you issue?':
		'SELECT orderid, total\\nFROM orders\\nWHERE order_date BETWEEN \'01-Jan-2002\' AND \'31-Jan-2002\'\\nORDER BY total DESC;',
	"what will the following sql statemtent display?\\nselect last_name, lpad(salary, 15, '$')salary\\nfrom employees;":
		"The last name and salary for all employees with the format of the salary 15 characters long, left-padded with the $ and the column labeled SALARY.",
	'evaluate this select statement:\\nselect length(email)\\nfrom employee;\\n\\nwhat will this select statement display?':
		'The number of characters for each value in the EMAIL column in the employees table',
	'which character manipulation function always returns a numerical value?':
		'LENGTH',
	'character functions accept character arguments and only return character values.':
		'False',
	'which of the following sql statements would correctly return a song title identified in the database as "all these years"?':
		'WHERE title LIKE INITCAP(\'%all these years\');',
	'the employees table contains these columns:\\nemployee_id number(9)\\nlast_name varchar2 (25)\\nfirst_name varchar2 (25)\\nhire_date date\\nyou need to display hire_date values in this format:\\njanuary 28, 2000\\nwhich sql statement could you use?':
		'SELECT TO_CHAR(hire_date, \'Month DD, YYYY\')\\nFROM employees;',
	'sysdate is 12-may-2004. you need to store the following date: 7-dec-89. which statement about the date format for this value is true?':
		'The RR date format will interpret the year as 1989, and the YY date format will interpret the year as 2089',
	'the following statement returns 0 (zero).\\nselect 121/null\\nfrom dual;':
		'False',
	"if quantity is a number datatype, what is the result of this statement?\\nselect nvl(200/quantity, 'zero')\\nfrom inventory;":
		"The statement fails",
	'case and decode evaluate expressions in a similar way to if-then-else logic. however, decode is specific to oracle syntax.':
		'True',
	"for the given data from employees (last_name, manager_id) what is the result of the following statement:\\ndata:( king, null\\nkochhar, 100\\nde haan, 100\\nhunold, 102\\nernst, 103)\\nselect last_name,\\ndecode(manager_id, 100, 'king', 'a n other') \\\"works for?\\\"\\nfrom employees":
		"King, A N Other\\nKochhar, King\\nDe Haan, King\\nHunold, A N Other\\nErnst, A N Other",
	'which of the following is a conditional expression used in sql?': 'CASE',
	"a table has the following definition: employees(\\nemployee_id number(6) not null,\\nname varchar2(20) not null,\\nmanager_id varchar2(6))\\n\\nand contains the following rows:\\n\\n(1001, 'bob bevan', '200')\\n(200, 'natacha hansen', null)\\n\\nwill the folloiwng query work?\\n\\nselect *\\nfrom employees\\nwhere employee_id = manager_id;":
		"Yes, Oracle will perform implicit datatype conversion, but the WHERE clause will not find any matching data.",
	'if you use the rr format when writing a query using the date 27-oct-17 and the year is 2001, what year would be the result?':
		'2017',
	'which arithmetic operation will return a numeric value?':
		'TO_DATE(\'01-Jun-2004\') - TO_DATE(\'01-Oct-2004\')',
	'which sql statement should you use to display the prices in this format: "$00.30"?':
		'SELECT TO_CHAR(price, \'$99,900.99\')\\nFROM product;',
	'which two statements concerning sql functions are true?':
		'Conversion functions convert a value from one data type to another data type.|Not all date functions return date values.',
	'you need to display the hire_date values in this format: 25th of july 2002. which select statement would you use?':
		'SELECT TO_CHAR(hire_date, \\\'ddth "of" Month YYYY\\\')\\nFROM employees;',
	'which function compares two expressions?': 'NULLIF',
	'which of the following general functions will return the first non-null expression in the expression list?':
		'COALESCE',
	'when executed, which statement displays a zero if the tuition_balance value is zero and the housing_balance value is null?':
		'SELECT NVL (tuition_balance + housing_balance, 0) "Balance Due"\\nFROM student_accounts;',
	'which statement about group functions is true?':
		'Group functions ignore null values.|NVL, NVL2, and COALESCE can be used with group functions to replace null values.',
	'consider the following data in the employees table: (last_name, commission_pct, manager_id)\\ndata:\\nking, null, null\\nkochhar, null, 100\\nvargas, null, 124\\nzlotkey, .2, 100\\nwhat is the result of the following statement:\\nselect last_name, coalesce(commission_pct, manager_id, -1) comm\\nfrom employees ;':
		'King, -1\\nKochhar, 100\\nVargas, 124\\nZlotkey, .2',
	'you need to replace null values in the dept_id column with the text n/a. which functions should you use?':
		'TO_CHAR and NVL',
	"all human resources data is stored in a table named employees. you have been asked to create a report that displays each employee's name and salary. each employee's salary must be displayed in the following format: $000,000.00. which function should you include in a select statement to achieve the desired result?":
		"TO_CHAR",
	'the employees table contains these columns:\\nemployee_id number(9)\\nlast_name varchar2 (25)\\nfirst_name varchar2 (25)\\nhire_date date\\n\\nyou need to display hire_date values in this format:\\n\\njanuary 28, 2000\\n\\nwhich sql statement could you use?':
		'SELECT TO_CHAR(hire_date, \'Month DD, YYYY\')\\nFROM employees;',
	'which statement is true about sql functions?': 'a, b and c are true.',
	"the following script will run successfully.\\nselect to_char(to_date('25-dec-2004','dd-mon-yyyy'))\\nfrom dual":
		"True",
	'which three statements concerning explicit data type conversions are true?':
		'Use the TO_NUMBER function to convert a character string of digits to a number.|Use the TO_CHAR function to convert a number or date value to a character string.|Use the TO_DATE function to convert a character string to a date value.',
	'with the following data in employees (last_name, commission_pct, manager_id) what is the result of the following statement?\\ndata:\\nking, null, null\\nkochhar, null, 100\\nvargas, null, 124\\nzlotkey, .2, 100\\nselect last_name, nvl2(commission_pct, manager_id, -1) comm\\nfrom employees ;':
		'King, -1\\nKochhar, -1\\nVargas, -1\\nZlotkey, 100',
	"which statement will return a listing of last names, salaries, and a rating of 'low', 'medium', 'good' or 'excellent' depending on the salary value?":
		"SELECT last_name,salary,\\n(CASE WHEN salary<5000 THEN 'Low'\\n     WHEN salary<10000 THEN 'Medium'\\n     WHEN salary<20000 THEN 'Good'\\n     ELSE 'Excellent'\\nEND) qualified_salary\\nFROM employees;",
	'which functions allow you to perform explicit data type conversions?':
		'TO_CHAR, TO_DATE, TO_NUMBER',
	'which statement will return the salary (for example, the salary of 6000) from the employees table in the following format? $6000.00':
		'SELECT TO_CHAR(salary, \'$99999.00\') SALARY\\nFROM employees',
	"the styles table contains this data:\\nstyle_id style_name category cost\\n895840 sandal 85940 12.00\\n968950 sandal 85909 10.00\\n869506 sandal 89690 15.00\\n809090 loafer 89098 10.00\\n890890 loafer 89789 14.00\\n857689 heel 85940 11.00\\n758960 sandal 86979\\nevaluate this select statement:\\n\\nselect style_id, style_name, category, cost\\nfrom styles\\nwhere style_name like 'sandal' and nvl(cost, 0) < 15.00\\norder by category, cost;\\n\\nwhich result will the query provide?":
		"STYLE_ID              STYLE_NAME     CATEGORY          COST\\n968950                  SANDAL               85909                    10.00\\n895840                  SANDAL               85940                    12.00\\n758960                  SANDAL               86979",
	'which statement concerning single row functions is true?':
		'Single row functions can be nested.',
	'what is the result of the following statement:\\nselect last_name, coalesce(commission_pct, manager_id, -1) comm\\nfrom employees ;':
		'King, -1\\nKochhar, 100\\nVargas, 124\\nZlotkey, .2',
	"the product table contains this column: price number(7,2)\\nevaluate this statement:\\n\\nselect nvl(10 / price, '0')\\nfrom product;\\n\\nwhat would happen if the price column contains null values?":
		"A value of 0 would be displayed.",
	'what three statements are true about explicit data type conversions?':
		'Use the TO_DATE function to convert a character string to a date value.|Use the TO_CHAR function to convert a numeric or date value to a character string.|Use the TO_NUMBER function to convert a character string from digits to a number.',
	'which best describes the to_char function?':
		'The TO_CHAR function can be used to display dates and numbers according to formatting conventions that are supported by Oracle.',
	"you have been asked to create a report that lists all customers who have placed orders of at least $2,500. the report's date should be displayed using this format:\\nday, date month, year (for example, tuesday, 13 april, 2004 ).\\nwhich statement should you issue?":
		"SELECT companyname, TO_CHAR (sysdate, 'fmDay, dd Month, yyyy'), total\\nFROM customers NATURAL JOIN orders\\nWHERE total >= 2500;",
	'the employees table contains these columns:\\nemployee_id number(9)\\nlast_name varchar2 (25)\\nfirst_name varchar2 (25)\\nsalary number(6)\\nyou need to create a report to display the salaries of all employees. which sql statement should you use to display the salaries in format: "$45,000.00"?':
		'SELECT TO_CHAR(salary, \'$999,999.00\')\\nFROM employees;',

	// Added DP Section 2 Quiz Questions (2026-05-25)
	'the between operator is inclusive.': 'True',
	'when using the like operator, which character represents a single character?': '_',
	'when using the like operator, which character represents any number of characters (zero, one, or more)?': '%',
	'which operator is used to search for values in a specified list?': 'IN',
	'which logical operator requires both conditions to be true?': 'AND',
	'which comparison operator is used to test for null values?': 'IS NULL',
	'arithmetic operators can be used in the select and where clauses.': 'True',
	'character strings and date values in the where clause must be enclosed in single quotation marks.': 'True',

	// More DP Section 2 Quiz Questions (2026-05-25)
	'the structure of the table can be displayed with the _________ command:':
		'Desc and the Describe',
	'which of the following statements will work?':
		'SELECT first_name ||\\\' \\\'||last_name NAME, department_id DEPARTMENT, salary*12 "ANNUAL SALARY"\\nFROM employees\\nWHERE last_name = \\\'King\\\';',
	'you want to determine the orders that have been placed by customers who reside in the city of chicago. you write this partial select statement:\\nselect orderid, orderdate, total\\nfrom orders;\\nwhat should you include in your select statement to achieve the desired results?':
		'WHERE city = \\\'Chicago\\\';',
	'what will be the result of the select statement and what will display?\\nselect last_name, salary, salary + 300\\nfrom employees;':
		'Display the last name, salary, and the results of adding 300 to each salary for all the employees',
	'which of the following is not being done in this sql statement?\\nselect first_name || \\\' \\\' || last_name "name"\\nfrom employees;':
		'Concatenating first name, middle name and last name',
	'which query would give the following result?\\nlast_name first_name department_id\\nking steven 90':
		'SELECT last_name, first_name, department_id\\nFROM employees\\nWHERE last_name = \\\'King\\\';',
	'the following is a valid sql select statement.\\nselect first_name || \\\' \\\' || last_name alias as employee_name\\nfrom employees;':
		'False',
	'evaluate this select statement:\\nselect *from employeeswhere department_id in(10, 20, 30)and salary > 20000;\\nwhich values would cause the logical condition to return true?':
		'DEPARTMENT_ID = 10 and SALARY = 20001',

	// Added DP Section 3 Quiz Questions (2026-05-25)
	'you query the database with this sql statement:select price from products where price in(1, 25, 50, 250) and (price between 25 and 40 or price > 50);which two values could the statement return?':
		'25|250',

	// Section 7 - SQL Joins from DeniAce Blog (2026-05-25)
	'evaluate this sql statement:\\nselect e.employee_id, e.last_name, e.first_name, d.department_name\\nfrom employees e, departments d\\nwhere e.department_id = d.department_id and employees.department_id > 5000\\norder by 4;\\n\\nwhich clause contains a syntax error?':
		'AND employees.department_id > 5000',
	'when must column names be prefixed by table names in join syntax?':
		'When the same column name appears in more than one table of the query',
	'if table a has 10 rows and table b has 5 rows, how many rows will be returned if you perform a cartesian join on those two tables?':
		'50',
	'what is produced when a join condition is not specified in a multiple-table query using oracle proprietary join syntax?':
		'A Cartesian product',
	'the customers and sales tables contain these columns:\\ncustomers\\ncust_id number(10) primary key\\ncompany varchar2(30)\\nlocation varchar2(20)\\n\\nsales\\nsales_id number(5) primary key\\ncust_id number(10) foreign key\\ntotal_sales number(30)\\n\\nwhich select statement will return the customer id, the company and the total sales?':
		'SELECT c.cust_id, c.company, s.total_sales\\nFROM customers c, sales s\\nWHERE c.cust_id = s.cust_id;',
	'you have the following employees table:\\nemployee_id number(5) not null primary key\\nfirst_name varchar2(25)\\nlast_name varchar2(25)\\naddress varchar2(35)\\ncity varchar2(25)\\nstate varchar2(2)\\nzip number(9)\\ntelephone number(10)\\ndepartment_id number(5) not null foreign key\\n\\nthe bonus table includes the following columns:\\nbonus_id number(5) not null primary key\\nannual_salary number(10)\\nbonus_pct number(3, 2)\\nemployee_id varchar2(5) not null foreign key\\n\\nyou want to determine the amount of each employee\\\'s bonus as a calculation of salary times bonus. which of the following queries should you issue?':
		'SELECT e.first_name, e.last_name, b.annual_salary * b. bonus_pct\\nFROM employees e, bonus b\\nWHERE e.employee_id = b.employee_id;',
	'the id column in the client table that corresponds to the client_id column of the order table contains null values for rows that need to be displayed. which type of join should you use to display the data?':
		'Outer join',
	'using oracle proprietary join syntax, which two operators can be used in an outer join condition using the outer join operator (+)?':
		'AND and =',
	'you need to join the employees table and the schedules table, but the two tables do not have any corresponding columns. which type of join will you create?':
		'A non-equijoin',
	'using oracle proprietary join syntax, which operator would you use after one of the column names in the where clause when creating an outer join?':
		'(+)',
	'which statement about outer joins is true?':
		'The OR operator cannot be used to link outer join conditions.',
	'the following is a valid outer join statement:\\nselect c.country_name, d.department_name\\nfrom countries c, departments d\\nwhere c.country_id (+) = d.country_id (+)\\n\\n':
		'False',
	'what is the result of a query that selects from two tables but includes no join condition?':
		'A Cartesian product',
	'which statement about the join syntax of an oracle proprietary join syntax select statement is true?':
		'The WHERE clause represents the join criteria.',
	'if table a has 10 rows and table b has 5 rows, how many rows will be returned if you perform an equi-join on those two tables?':
		'It depends on how many rows have matching data in each of the two tables.',
	'if table a has 10 rows and table b has 5 rows, how many rows will be returned if you perform a equi-join on those two tables?':
		'It depends on how many rows have matching data in each of the two tables.',
	'the patients and doctors tables contain these columns:\\npatients\\npatient_id number(9)\\nlast_name varchar2 (20)\\nfirst_name varchar2 (20)\\n\\ndoctors\\ndoctor_id number(9)\\nlast_name varchar2 (20)\\nfirst_name varchar2 (20)\\n\\nyou issue this statement:\\nselect patient_id, doctor_id\\nfrom patients, doctors;\\n\\nwhich result will this statement provide?':
		'A report containing all possible combinations of the PATIENT_ID and DOCTOR_ID values',
	'which statement about joining tables with a non-equijoin is false?':
		'A WHERE clause must specify a column in one table that is compared to a column in the second table',
	'to perform a valid outer join between departments and employees to list departments without employees, select the correct where clause for the following select statement:\\nselect d.department_name, e.last_name\\nfrom employees e, departments d\\nwhere':
		'e.department_id(+) = d.department_id',
	'the employee_id column in the employees table corresponds to the employee_id column of the orders table.\\nthe employee_id column in the orders table contains null values for rows that you need to display.\\nwhich type of join should you use to display the data?':
		'Outer join',
	'oracle proprietary joins can use the where clause for conditions other than the join-condition.':
		'True',
	'what is the minimum number of join conditions required to join 5 tables together?':
		'4',
	'nonequijoins are normally used with which of the following?':
		'Ranges of numbers|Ranges of dates',

	'the avg, sum, variance, and stddev functions can be used with which of the following?':
		'Only numeric data types',

	'which aggregate function can be used on a column of the date data type?':
		'MAX',

	'group functions return a value for ________________ and ________________ null values in their computations.':
		'a row set, ignore',

	'the trucks table contains these columns:\\ntrucks:\\ntype varchar2(30)\\nyear date\\nmodel varchar2(20)\\nprice number(10)\\n\\nwhich select statement will return the average price for the 4x4 model?':
		'SELECT AVG(price) FROM trucks WHERE model = \'4x4\';',

	'the employees table contains these columns:\\nemployee_id number(9)\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\nsalary number(7,2)\\ndepartment_id number(9)\\n\\nyou need to display the number of employees whose salary is greater than $50,000. which select would you use?':
		'SELECT COUNT(*) FROM employees WHERE salary > 50000;',

	'evaluate this sql statement:\\nselect count (amount)\\nfrom inventory;\\n\\nwhat will occur when the statement is issued?':
		'The statement will count the number of rows in the INVENTORY table where the AMOUNT column is not null.',

	'to include null values in the calculations of a group function, you must:':
		'Convert the null to a value using the NVL( ) function',

	'which statement about the count function is true?':
		'The COUNT function always ignores null values by default.',

	'which select statement will calculate the number of rows in the products table?':
		'SELECT COUNT (*) FROM products;',

	'examine the data in the payment table:\\npayment_id customer_id payment_date payment_type payment_amount\\n86590586 8908090 10-jun-2003 basic 859.00\\n89453485 8549038 15-feb-2003 interest 596.00\\n85490345 5489304 20-mar-2003 basic 568.00\\n\\nyou need to determine the average payment amount made by each customer in january, february, and march of 2003.\\nwhich select statement should you use?':
		'SELECT AVG(payment_amount) FROM payment WHERE payment_date BETWEEN \'01-Jan-2003\' AND \'31-Mar-2003\';',

	'group functions can avoid computations involving duplicate values by including which keyword?':
		'DISTINCT',

	'you need to calculate the average salary of employees in each department. which group function will you use?':
		'AVG',

	'which group function would you use to display the total of all salary values in the employees table?':
		'SUM',

	'which group function would you use to display the lowest value in the sales_amount column?':
		'MIN',

	'you need to compute the total salary amount for all employees in department 10. which group function will you use?':
		'SUM',

	'the products table contains these columns:\\n\\nprod_id number(4)\\nprod_name varchar2(30)\\nprod_cat varchar2(30)\\nprod_price number(3)\\nprod_qty number(4)\\n\\nthe following statement is issued:\\n\\nselect avg(prod_price, prod_qty)\\nfrom products;\\n\\nwhat happens when this statement is issued?':
		'An error occurs.',

	'examine the following statement:\\nselect department_id, manager_id, job_id, sum(salary)\\nfrom employees\\ngroup by grouping sets((department_id, manager_id), (department_id, job_id))\\n\\nwhat data will this query generate?':
		'Sum of salaries for (department_id, job_id) and (department_id, manager_id)',

	'examine the following statement:\\nselect department_id, manager_id, job_id, sum(salary)\\nfrom employees\\ngroup by rollup(department_id, manager_id)\\n\\nwhat extra data will this query generate?':
		'The statement will fail.',

	'you use rollup to:':
		'produce subtotal values',

	'cube will cross-reference the columns listed in the ______ clause to create a superset of groups.':
		'GROUP BY',

	'which of the following are correct set operators?':
		'UNION, MINUS|UNION ALL, INTERSECT',

	'the ___________ operator returns all rows from both tables, after eliminating duplicates.':
		'UNION',

	'to control the order of rows returned using set operators, the order by clause is used ______ and is placed in the _____ select statement of the query.':
		'ONCE; LAST',

	'is the following statement correct?\\nselect first_name, last_name, salary, department_id, count(employee_id)\\nfrom employees\\nwhere department_id = 50\\ngroup by last_name, first_name, department_id;':
		'No, because the statement is missing salary in the GROUP BY clause',

	'what will the following sql statement do?\\nselect job_id, count(*)\\nfrom employees\\ngroup by job_id;':
		'Displays each job id and the number of people assigned to that job id',

	'the players table contains these columns:\\nplayer_id number pk\\nplayer_name varchar2(30)\\nteam_id number\\nhire_date date\\nsalary number(8,2)\\n\\nwhich clauses represent valid uses of aggregate functions?':
		'SELECT AVG(NVL(salary, 0))|ORDER BY AVG(salary)|HAVING MAX(salary) > 10000',

	'the employees table contains these columns:\\nid_number number primary key\\nname varchar2 (30)\\ndepartment_id number\\nsalary number (7,2)\\nhire_date date\\n\\nevaluate this sql statement:\\nselect id_number, name, department_id, sum(salary)\\nfrom employees\\nwhere salary > 25000\\ngroup by department_id, id_number, name\\norder by hire_date;\\n\\nwhy will this statement cause an error?':
		'The HIRE_DATE column is NOT included in the GROUP BY clause.',

	'what is the best explanation as to why this sql statement will not execute?\\nselect department_id "department", avg (salary)"average"\\nfrom employees\\ngroup by department;':
		'You cannot use a column alias in the GROUP BY clause.',

	'the products table contains these columns:\\nprod_id number(4)\\nprod_name varchar(20)\\nprod_cat varchar2(15)\\nprod_price number(5)\\nprod_qty number(4)\\n\\nyou need to identify the minimum product price in each product category.\\nwhich statement could you use to accomplish this task?':
		'SELECT prod_cat, MIN (prod_price) FROM products GROUP BY prod_cat;',

	'evaluate this statement:\\nselect department_id, avg(salary)\\nfrom employees\\nwhere job_id <> 69879\\ngroup by job_id, department_id\\nhaving avg(salary) > 35000\\norder by department_id;\\n\\nwhich clauses restricts the result? choose two.':
		'WHERE job_id <> 69879|HAVING AVG(salary) > 35000',

	'evaluate this select statement:\\nselect count(employee_id), department_id\\nfrom employees\\ngroup by department_id;\\n\\nyou only want to include employees who earn more than 15000.\\nwhich clause should you include in the select statement?':
		'WHERE salary > 15000',

	'you use grouping functions to:':
		'Identify the extra row values created by either a ROLLUP or CUBE operation',

	'you use grouping functions to ______ database rows from tabulated rows.':
		'DISTINGUISH',

	'when using set operators, the names of the matching columns must be identical in all of the select statements used in the query.':
		'False',

	'which of the following sql statements could display the number of people with the same last name:\\nselect last_name, count(last_name)\\nfrom employees\\ngroup by last_name;':
		'SELECT last_name, COUNT(last_name) FROM EMPLOYEES GROUP BY last_name;',

	'how would you alter the following query to list only employees where two or more employees have the same last name?\\nselect last_name, count(employee_id)\\nfrom employees\\ngroup by last_name;':
		'SELECT last_name, COUNT(last_name) FROM EMPLOYEES GROUP BY last_name HAVING COUNT(last_name) > 1;',

	'you need to display the number of unique types of manufacturers at each location. which select statement should you use?\\nselect location_id, count(distinct type)\\nfrom manufacturer;':
		'SELECT location_id, COUNT(DISTINCT type) FROM manufacturer GROUP BY location_id;',

	'which select statement could you use to display the number of times each customer payment was made between january 1, 2003 and june 30, 2003 ?\\nselect customer_id, count(payment_id)\\nfrom payment\\nwhere payment_date between \\\'01-jan-2003\\\' and \\\'30-jun-2003\\\';':
		'SELECT customer_id, COUNT(payment_id) FROM payment WHERE payment_date BETWEEN \\\'01-Jan-2003\\\' AND \\\'30-Jun-2003\\\' GROUP BY customer_id;',

	'can group functions be nested at a depth of?':
		'Two',

	'which group function would you use to display the average price of all products in the products table?':
		'AVG',

	'what two group functions can be used with any datatype?':
		'MIN, MAX',

	'you need to calculate the standard deviation for the cost of products produced in the birmingham facility. which group function will you use?':
		'STDDEV',

	'you attempt to query the database with this sql statement:\\nselect product_id "product number", category_id "category", price "price"\\nfrom products\\nwhere "category" = 5570\\norder by "product number";\\n\\nthis statement fails when executed. which clause contains a syntax error?':
		'WHERE',

	'you query the database with this sql statement:\\nselect price\\nfrom products\\nwhere price in(1, 25, 50, 250)\\nand (price between 25 and 40 or price > 50);\\n\\nwhich two values could the statement return?':
		'25|250',

	'the styles table contains this data:\\nstyle_id style_name category cost\\n895840 sandal 85940 12.00\\n968950 sandal 85909 10.00\\n869506 sandal 89690 15.00\\n809090 loafer 89098 10.00\\n890890 loafer 89789 14.00\\n857689 heel 85940 11.00\\n758960 sandal 86979\\n\\nyou issue this select statement:\\nselect count(category)\\nfrom styles;\\n\\nwhich value is displayed?':
		'7',

	'using your existing knowledge of the employees table, would the following two statements produce the same result?\\nselect count(*)\\nfrom employees;\\n\\nselect count(commission_pct)\\nfrom employees;':
		'No',

	'given the following data in the employees table (employee_id, salary, commission_pct)\\ndata:\\n(143, 2600, null\\n144, 2500, null\\n149, 10500, .2\\n174, 11000, .3\\n176, 8600, .2\\n178, 7000, .15)\\n\\nwhat is the result of the following statement:\\n\\nselect avg(commission_pct)\\nfrom employees\\nwhere employee_id in( 143,144,149,174,176,178);':
		'0.2125',

	'the players and teams tables contain these columns:\\nplayers\\nplayer_id number not null, primary key\\nlast_name varchar2 (30) not null\\nfirst_name varchar2 (25) not null\\nteam_id number\\nposition varchar2 (25)\\n\\nteams\\nteam_id number not null, primary key\\nteam_name varchar2 (25)\\n\\nyou need to create a report that lists the names of each team with more than three goal keepers.\\nwhich select statement will produce the desired result?':
		'SELECT t.team_name, COUNT(p.player_id)\\nFROM players p\\nJOIN teams t ON (p.team_id = t.team_id)\\nWHERE UPPER(p.position) = \\\'GOAL KEEPER\\\'\\nGROUP BY t.team_name\\nHAVING COUNT(p.player_id) > 3;',

	'grouping sets is another extension to the group by clause and is used to specify multiple groupings of data but provide a single result set.':
		'True',

	'minus will give you rows from the first query that are not present in the second query.':
		'True',

	'is the following statement correct?\\nselect department_id, avg(salary)\\nfrom employees;':
		'No, because a GROUP BY department_id clause is needed',


	// Section 10 Quiz Questions Added Automatically
	'a multiple-row operator expects how many values?':
		'One or more',

	'the salary column of the f_staffs table contains the following values: 4000 5050 6000 11000 23000 which of the following statements will return the last_name and first_name of those employees who earn more than 5000?':
		'SELECT last_name, first_name FROM f_staffs WHERE salary IN (SELECT salary FROM f_staffs WHERE salary > 5000);',

	'examine the data in the payment table: payment_id customer_id payment_date payment_type payment_amount 86590586 8908090 10-jun-2003 basic 859.00 89453485 8549038 15-feb-2003 interest 596.00 85490345 5489304 20-mar-2003 basic 568.00 this statement fails when executed: select customer_id, payment_type from payment where payment_id = (select payment_id from payment where payment_amount = 596.00 or payment_date = \\\'20-mar-2003\\\'); which change could correct the problem?':
		'Change the outer query WHERE clause to \\\'WHERE payment_id IN\\\'.',

	'which of the following statements contains a comparison operator that is used to restrict rows based on a list of values returned from an inner query? select description from d_types where code in (select type_code from d_songs); select description from d_types where code = any (select type_code from d_songs); select description from d_types where code <> all (select type_code from d_songs);':
		'All of the above.',

	'group functions can be used in multiple-row subqueries in the having and group by clauses.':
		'True',

	'the sql multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators? in, any, and every in, all, and every in, any, and equal':
		'IN, ANY, and ALL',

	'which statement about the <> operator is true? the <> operator can be used':
		'The <> operator can be used when a single-row subquery returns only one row.',

	'single row subqueries may not include this operator: > <>':
		'ALL',

	'examine the structure of the employee, department, and orders tables. employee: employee_id number(9) last_name varchar2(25) first_name varchar2(25) department_id number(9) department: department_id number(9) department_name varchar2(25) creation_date date orders: order_id number(9) employee_id number(9) date date customer_id number(9) you want to display all employees who had an order after the sales department was established. which of the following constructs would you use?':
		'A single-row subquery',

	'if you use the equality operator (=) with a subquery, how many values can the subquery return?':
		'Only 1',

	'the teachers and class_assignments tables contain these columns: teachers teacher_id number(5) primary key name varchar2 (25) subject_id number(5) class_id number(5) class_assignments class_id number (5) primary key teacher_id number (5) date max_capacity number (3) all max_capacity values are greater than 10. which two sql statements correctly use subqueries?':
		'SELECT * FROM teachers WHERE teacher_id = (SELECT teacher_id FROM class_assignments WHERE class_id = 45963);|SELECT * FROM class_assignments WHERE max_capacity = (SELECT AVG(max_capacity) FROM class_assignments);',

	'which operator can be used with a multiple-row subquery? like':
		'IN',

	'which answer is incorrect? the parent statement of a correlated subquery can be: a select statement a delete statement an update statement':
		'An INSERT statement',

	'the oracle server performs a correlated subquery when the subquery references a column from a table referred to in the parent.':
		'True',

	'in a non-correlated subquery, the outer query always executes prior to the inner query\\\'s execution.true':
		'False',

	'subqueries are limited to four per sql transaction.true':
		'False',

	'which statement about subqueries is true? subqueries should be enclosed in double quotation marks. subqueries generally execute last, after the main or outer query executes. subqueries cannot contain group functions. subqueries are often used in a where':
		'clause to return values for an unknown conditional value.',

	'when creating a report of all employees earning more than the average salary for their department, a __________ ____________ can be used to first calculate the average salary of each department, and then compare the salary for each employee to the average salary of that employeeﾒs department. with clause group by':
		'CORRELATED SUBQUERY',

	'which statement is false? the with clause retrieves the results of one or more query blocks. the with clause stores the results for the user who runs the query. the with clause decreases':
		'The WITH clause decreases performance.',

	'correlated subqueries must reference the same tables in both the inner and outer queries.true':
		'False',

	'when a multiple-row subquery uses the not in operator (equivalent to <>all), if one of the values returned by the inner query is a null value, the entire query returns: all rows that were selected by the inner query including the null values':
		'No rows returned',

	'you need to create a select statement that contains a multiple-row subquery. which comparison operator(s) can you use?':
		'IN, ANY, and ALL',

	'you are looking for executive information using a subquery. what will the following sql statement display? select department_id, last_name, job_id from employees where department_id in (select department_id from departments where department_name = \\\'executive\\\');':
		'job ID for every employee in the Executive department',

	'evaluate the structure of the employees and depart_hist tables: employees employee_id number(9) last_name varchar2(25) first_name varchar2(25) department_id number(9) manager_id number(9) salary number(7,2) depart_hist: employee_id number(9) old_dept_id number(9) new_dept_id number(9) change_date date you want to generate a list of employees who are in department 10, but used to be in department 15. which query should you use?':
		'SELECT employee_id, last_name, first_name, department_id FROM employees WHERE (employee_id, department_id) IN (SELECT employee_id, new_dept_id FROM depart_hist WHERE old_dept_id = 15);|FROM depart_hist WHERE old_dept_id = 15',

	'which of the following best describes the meaning of the any operator? equal to any member in the list equal to each value in the list compare value to the first value returned by the subquery compare value to each value returned':
		'Compare value to each value returned by the subquery',

	'oracle allows you to write named subqueries in one single statement, as long as you start your statement with the keyword with.':
		'True',

	'which statement is false? the with clause decreases':
		'The WITH clause decreases performance.',

	'subqueries can only be placed in the where clause.true':
		'False',

	'which operator can be used with a multiple-row subquery?':
		'IN',

	'using a subquery in which clause will return a syntax error? where from having you can use subqueries in all of the':
		'above clauses.',

	'which comparison operator can only be used with a single-row subquery? in':
		'<>',

	'you need to produce a report that contains all employee-related information for those employees who have brad carter as a supervisor. however, you are not sure which supervisor id belongs to brad carter. which query should you issue to accomplish this task?':
		'SELECT * FROM employees WHERE supervisor_id = (SELECT employee_id FROM employees WHERE last_name = \\\'Carter\\\');',

	'which operator or keyword cannot be used with a multiple-row subquery? >':
		'=',

	'when a multiple-row subquery uses the not in operator (equivalent to <>all), if one of the values returned by the inner query is a null value, the entire query returns: a list of nulls':
		'No rows returned',

	'evaluate this sql statement: select employee_id, last_name, salary from employees where department_id in (select department_id from employees where salary > 30000 and salary < 50000); which values will be displayed?':
		'All employees who work in a department with employees who earn more than $30,000, but less than $50,000.',

	'the sql multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators?':
		'IN, ANY, and ALL',

	'the with clause is a way of creating extra tables in the database.':
		'False',


	'if a single-row subquery returns a null value and uses the equality comparison operator, what will the outer query return? all the rows in the table':
		'No rows',

	'the sql multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators? in, any, and equal':
		'IN, ANY, and ALL',

	'which comparison operator would you use to compare a value to every value returned by a subquery? in any some':
		'ALL',

	'you need to display all the players whose salaries are greater than or equal to john brown\\\'s salary. which comparison operator should you use? = <=':
		'>=',

	'which of the following is true regarding the order of subquery execution? the subquery executes once after the main query. the result of the main query is used with the subquery. the subquery executes once before':
		'the main query.',

	'if a single-row subquery returns a null value and uses the equality comparison operator, what will the outer query return?':
		'No rows',

	'the result of this statement will be: select last_name, job_id, salary, department_id from employees where job_id = (select job_id from employees where employee_id = 141) and department_id = (select department_id from departments where location_id =1500);':
		'matches employee 141 and who work in location 1500',

	'which answer is incorrect? the parent statement of a correlated subquery can be:':
		'An INSERT statement',

	'the with clause enables a select statement to define the subquery block at the start of the query, process the block just once, label the results, and then refer to the results multiple times.':
		'True',

	'which of the following statements is a true guideline for using subqueries?':
		'The outer and inner queries can reference more than one table. They can get data from different tables.',

	'evaluate this select statement: select customer_id, name from customer where customer_id in (select customer_id from customer where state_id = \\\'ga\\\' and credit_limit > 500.00); what would happen if the inner query returned null?':
		'No rows would be returned by the outer query.',

	'which statement about the any operator, when used with a multiple-row subquery, is true? the any operator is a synonym for the all operator. the any operator can be used with the like and in operators. the any operator compares every':
		'The ANY operator compares a value to each value returned by the subquery.',

	'multiple-row subqueries must have not, in, or any in the where clause of the inner query.true':
		'False',

	'null, null, {}); unknown30 desember 2017 pukul 01.25 a correlated subquery is evaluated _____ for each row processed by the parent statement.':
		'ONCE',

	'1- a correlated subquery will _______ a candidate row from an outer query, _______ the inner query using candidate row value, and _______ values from the inner query to qualify or disqualify the candidate row. rollup; grant; drop delete; update; insert':
		'GET; EXECUTE; USE',

	'what is wrong with the following query? select employee_id, last_name from employees where salary = (select min(salary) from employees group by department_id);':
		'Subquery returns more than one row and single row comparison operator is used.|The results of the inner query are returned to the outer query.|You need to display all the orders that were placed on the same day as order number 25950.',

	'which best describes a multiple-row subquery?':
		'A query that returns one or more rows from the inner SELECT statement',

	'the employees and orders tables contain these columns: employees employee_id number(10) not null primary key first_name varchar2(30) last_name varchar2(30) address varchar2(25) city varchar2(20) state varchar2(2) zip number(9) telephone number(10) orders order_id number(10) not null primary key employee_id number(10) not null foreign key order_date date total number(10) which select statement will return all orders generated by a sales representative named franklin during the year 2001? select order_id, total from orders where employee_id = (select employee_id from employees where last_name = \\\'franklin\\\')':
		'SELECT order_id, total FROM ORDERS WHERE employee_id = (SELECT employee_id FROM employees WHERE last_name = \\\'Franklin\\\') AND order_date BETWEEN \\\'01-Jan-2001\\\' AND \\\'31-Dec-2001\\\';',

	'which best describes a single-row subquery? a query that returns one or more rows from the inner select statement':
		'A query that returns only one row from the inner SELECT statement',

	'examine the data in the payment table: > > > > payment_id customer_id payment_date payment_type payment_amount 86590586 8908090 10-jun-2003 basic 859.00 89453485 8549038 15-feb-2003 interest 596.00 85490345 5489304 20-mar-2003 basic 568.00 this statement fails when executed: select payment_date, customer_id, payment_amount from payment where payment_id = (select payment_id from payment where payment_date >= \\\'05-jan-2002\\\' or payment_amount > 500.00); which change could correct the problem? remove the subquery where clause. remove the single quotes around the date value in the inner query where clause. include the payment_id column in the select list of the outer query.':
		'Change the outer query WHERE clause to \\\'WHERE payment_id IN\\\'.',

	'there can be more than one subquery returning information to the outer query.':
		'True',

	'what will the following statement return: select last_name, salary from employees where (department_id, job_id) = (select department_id, job_id from employees where employee_id = 103)':
		'A list of last_names and salaries of employees that works in the same department and has the same job_id as that of employee 103.',

	'evaluate this select statement: select student_id, last_name, first_name from student where major_id not in (select major_id from majors where department_head_id = 30 and title = \\\'adjunct\\\'); what would happen if the inner query returned a null value row? all the rows in the student table would be displayed.':
		'No rows would be returned from the STUDENT table.',

	'in a subquery, the all operator compares a value to every value returned by the inner query.':
		'True',

	'if the subquery returns no rows, will the outer query return any values? yes, oracle will find the nearest value and rewrite your statement implicitly when you run it.':
		'No, because the subquery will be treated like a null value.',

	'which of the following is a valid reason why the query below will not execute successfully? select employee_id, last_name, salary from employees where department_id = (select department_id from employees where last_name like \\\'%u%\\\');':
		'A single, rather than a multiple value operator was used.',

	'what would happen if you attempted to use a single-row operator with a multiple-row subquery? no rows will be selected. the data returned may or may not be correct.':
		'An error would be returned.',

	'group functions can be used in subqueries even though they may return many rows.':
		'True',

	'what will the following statement return: select last_name, salary from employees where salary < (select salary from employees where employee_id = 103);':
		'A list of last_names and salaries of employees who make less than employee 103',

	'evaluate the structure of the employees and depart_hist tables: employees employee_id number(9) last_name varchar2(25) first_name varchar2(25) department_id number(9) manager_id number(9) salary number(7,2) depart_hist: employee_id number(9) old_dept_id number(9) new_dept_id number(9) change_date date you want to generate a list of employees who are in department 10, but used to be in department 15. which query should you use? select employee_id, last_name, first_name, department_id from employees where (employee_id, department_id) in (select employee_id, new_dept_id from depart_hist':
		'SELECT employee_id, last_name, first_name, department_id FROM employees WHERE (employee_id, department_id) IN (SELECT employee_id, new_dept_id FROM depart_hist WHERE old_dept_id = 15);|FROM depart_hist WHERE old_dept_id = 15',

	'which statement about single-row and multiple-row subqueries is true? multiple-row subqueries can be used with both single-row and multiple-row operators. multiple-row subqueries can only be used in select statements. single-row operators can be used with both single-row and multiple-row subqueries.':
		'Multiple-row subqueries cannot be used with the LIKE operator.',


	'examine the data in the payment table:\\npayment_id customer_id payment_date payment_type payment_amount\\n86590586 8908090 10-jun-2003 basic 859.00\\n89453485 8549038 15-feb-2003 interest 596.00\\n85490345 5489304 20-mar-2003 basic 568.00\\n\\nthis statement fails when executed:\\nselect payment_date, customer_id, payment_amount\\nfrom payment\\nwhere payment_id =\\n (select payment_id\\n from payment\\n where payment_date >= \\\'05-jan-2002\\\' or payment_amount > 500.00);\\n\\nwhich change could correct the problem?':
		'Change the outer query WHERE clause to \'WHERE payment_id IN\'.',


	// Subqueries Comment Quiz Fixes
	'which operator can be used with subqueries that return only one row?':
		'LIKE',

	'subqueries can only be placed in the where clause.':
		'False',


	'what will be the result of this statement?\\n\\nselect last_name, job_id, salary, department_id\\nfrom employees\\nwhere job_id =\\n (select job_id\\n from employees\\n where employee_id = 141) and\\ndepartment_id =\\n (select department_id\\n from departments\\n where location_id =1500);':
		'Only the employees whose job id matches employee 141 and who work in location 1500',


	'in a correlated subquery, the outer and inner queries are joined on one or more columns.':
		'True',

	'evaluate this select statement that includes a subquery:\\nselect last_name, first_name\\nfrom customer\\nwhere area_code in\\n (select area_code\\n from sales\\n where salesperson_id = 20);\\n\\nwhich statement is true about the given subquery?':
		'The results of the inner query are returned to the outer query.',

	'what would the following sql statement return?\\nselect count(distinct salary)\\nfrom employees;':
		'The number of unique salaries in the employees table',

	// Section 12 Quiz (Oracle Database Programming with SQL)
	'a column in a table can be given a default value. this option prevents null values from automatically being assigned to the column if a row is inserted without a specified value for the column. true or false ?':
		'True',

	'in developing the employees table, you create a column called hire_date. you assign the hire_date column a date datatype with a default value of 0 (zero). a user can come back later and enter the correct hire_date. this is __________.':
		'A bad idea. The default value must match the DATE datatype of the column.',

	'aliases can be used with merge statements.':
		'True',

	'multi-table inserts can be conditional or unconditional.':
		'True',

	'a multi-table insert statement can insert into more than one table.':
		'True',

	'which of the following represents the correct syntax for an insert statement?':
		'INSERT INTO customers VALUES (\'3178\', \'J.\', \'Smith\', \'123 Main Street\', \'Nashville\', \'TN\', \'37777\');',

	'you need to delete a record in the employees table for tim jones, whose unique employee identification number is 348. the employees table contains these columns:\\nemployee_id number(5) primary key\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\naddress varchar2(30)\\nphone number(10)\\n\\nwhich delete statement will delete the appropriate record without deleting any additional records?':
		'DELETE FROM employees WHERE employee_id = 348;',

	'the employees table contains the following columns:\\nemployee_id number(10) primary key\\nlast_name varchar2(20)\\nfast_name varchar2(20)\\ndepartment_id varchar2(20)\\nhire_date date\\nsalary number(9,2)\\nbonus number(9,2)\\n\\nyou want to execute one dml statement to change the salary of all employees in department 10 to equal the new salary of employee number 89898. currently, all employees in department 10 have the same salary value. which statement should you execute?':
		'UPDATE employees SET salary = (SELECT salary FROM employees WHERE employee_id = 89898) WHERE department_id = 10;',

	'if the subquery returns one row, how many rows will be deleted from the employees table?\\ndelete from employees\\nwhere department_id =\\n (select department_id\\n from departments\\n where department_name like \\\'%public%\\\');':
		'All rows in the employees table of employees who work in the given department will be deleted.',

	'what keyword in an update statement speficies the column that you want to change?':
		'SET',

	'to return a table summary on the customers table, which of the following is correct?':
		'DESCRIBE customers, or DESC customers',

	'the products table contains these columns:\\nproduct_id number not null\\nproduct_name varchar2 (25)\\nsupplier_id number not null\\nlist_price number (7,2)\\ncost number (5,2)\\nqty_in_stock number(4)\\nlast_order_dt date default sysdate not nul\\n\\nwhich insert statement will execute successfully?':
		'INSERT INTO products (product_id, product_name, supplier_id, list_price, cost, qty_in_stock) VALUES(2958, \'Cable\', 8690, 7.09, 4.04, 700)',

	'assume all the column names are correct. the following sql statement will execute which of the following?\\ninsert into departments\\n(department_id, department_name, manager_id, location_id)\\nvalues\\n(70, \\\'public relations\\\', 100, 1700);':
		'70 will be inserted into the department_id column.',

	'you need to copy rows from the employee table to the employee_hist table. what could you use in the insert statement to accomplish this task?':
		'A subquery',

	'the students table contains these columns:\\nstu_id number(9) not null\\nlast_name varchar2 (30) not null\\nfirst_name varchar2 (25) not null\\ndob date\\nstu_type_id varchar2(1) not null\\nenroll_date date\\n\\nyou create another table, named ft_students, with an identical structure.you want to insert all full-time students who have a stu_type_id value of "f" into the new table. you execute this insert statement:\\n\\ninsert into ft_students\\n (select stu_id, last_name, first_name, dob, stu_type_id, enroll_date\\n from students\\n where upper(stu_type_id) = \\\'f\\\');\\n\\nwhat is the result of executing this insert statement?':
		'All full-time students are inserted into the FT_STUDENTS table.',

	'which of the following statements will add a new customer to the customers table in the global fast foods database?':
		'INSERT INTO customers (id, first_name, last_name, address, city, state, zip, phone_number) VALUES (145, \'Katie\', \'Hernandez\', \'92 Chico Way\', \'Los Angeles\', \'CA\', 98008, 8586667641);',

	'which statement about the values clause of an insert statement is true?':
		'If no column list is specified, the values must be listed in the same order that the columns are listed in the table.',

	'if the employees table has 7 rows, how many rows are inserted into the copy_emps table with the following statement:\\ninsert into copy_emps (employee_id, first_name, last_name, salary, department_id)\\nselect employee_id, first_name, last_name, salary, department_id\\nfrom employees':
		'7 rows, as no WHERE-clause restricts the rows returned on the subquery.',

	'using the insert statement and assuming that a column can accept null values, how can you implicitly insert a null value in a column?':
		'Omit the column in the column list.',

	'insert statements can be combined with subqueries to create more than one row per statement.':
		'True',

	'which statement below will not insert a row of data into a table?':
		'INSERT INTO (id, lname, fname, lunch_num) VALUES (143354, \'Roberts\', \'Cameron\', 6543);',

	'multi-table inserts are used when the same source data should be inserted into _____________ target table.':
		'More than one',

	'the default keyword can be used in the following statements:':
		'INSERT and UPDATE',

	'the default value must match the __________ of the column.':
		'Datatype',

	'one of the sales representatives, janet roper, has informed you that she was recently married, and she has requested that you update her name in the employee database. her new last name is cooper. janet is the only person with the last name of roper that is employed by the company. the employees table contains these columns and all data is stored in lowercase:\\nemployee_id number(10) primary key\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\ndepartment_id varchar2 (20)\\nhire_date date\\nsalary number(10)\\n\\nwhich update statement will accomplish your objective?':
		'UPDATE employees SET last_name = \'cooper\' WHERE last_name = \'roper\';',

	'to change an existing row in a table, you can use the update or insert statements.':
		'False',

	'one of your employees was recently married. her employee id is still 189, however, her last name is now rockefeller. which sql statement will allow you to reflect this change?':
		'UPDATE my_employees SET last_name = \'Rockefeller\' WHERE employee_ID = 189;',

	'the teachers and class_assignments tables contain these columns:\\nteachers:\\nteacher_id number(5)\\nname varchar2(25)\\nsubject_id number(5)\\nhire_date date\\nsalary number(9,2)\\n\\nclass_assignments:\\nclass_id number(5)\\nteacher_id number(5)\\nstart_date date\\nmax_capacity number(3)\\n\\nwhich scenario would require a subquery to return the desired results?':
		'You need to create a report to display the teachers who teach more classes than the average number of classes taught by each teacher.',

	'you need to remove a row from the employees table. which statement would you use?':
		'DELETE with a WHERE clause',

	'the merge statement first tries to update one or more rows in a table that match the criteria; if no row matches the criteria for the update, a new row will automatically be inserted instead.':
		'True',

	'what would happen if you issued a delete statement without a where clause?':
		'All the rows in the table would be deleted.',

	'dml is an acronym that stands for:':
		'Data Manipulation Language',

	'using your knowledge of the employees table, what would be the result of the following statement:\\ndelete from employees;':
		'All rows in the employees table will be deleted if there are no constraints on the table.',

	'examine the structures of the players, managers, and teams tables:\\nplayers:\\nplayer_id number primary key\\nlast_name varchar2 (30)\\nfirst_name varchar2 (25)\\nteam_id number\\nmgr_id number\\nsigning_bonus number(9,2)\\nsalary number(9,2)\\n\\nmanagers:\\nmanager_id number primary key\\nlast_name varchar2 (20)\\nfirst_name varchar2 (20)\\nteam_id number\\n\\nteams:\\nteam_id number primary key\\nteam_name varchar2 (20)\\nowner_last_name varchar2 (20)\\nowner_first_name varchar2 (20)\\n\\nwhich situation would require a subquery to return the desired result?':
		'To display the names of the managers for all the teams owned by a given owner',

	'you need to update both the department_id and location_id columns in the employees table using one update statement. which clause should you include in the update statement to update multiple columns?':
		'The SET clause',

	'you need to update the area code of employees that live in atlanta. evaluate this partial update statement:\\nupdate employee\\nset area_code = 770\\n\\nwhich of the following should you include in your update statement to achieve the desired results?':
		'WHERE city = \'Atlanta\';',

	// Section 12 Quiz (Oracle Database Programming with SQL) - Comments & Extras
	'when inserting rows into a table, all columns must be given values.':
		'False',

	'what is the quickest way to use today\\\'s date when you are creating a new row?':
		'Use the SYSDATE function.',

	'examine the structures of the products and suppliers tables:\\nsuppliers:\\nsupplier_id number not null, primary key\\nsupplier_name varchar2 (25)\\naddress varchar2 (30)\\ncity varchar2 (25)\\nregion varchar2 (10)\\npostal_code varchar2 (11)\\n\\nproducts:\\nproduct_id number not null, primary key\\nproduct_name varchar2 (25)\\nsupplier_id number foreign key to supplier_id of the suppliers table\\ncategory_id number\\nqty_per_unit number\\nunit_price number (7,2)\\nqty_in_stock number\\nqty_on_order number\\nreorder_level number\\n\\nyou want to delete any products supplied by the five suppliers located in atlanta. which script should you use?':
		'DELETE FROM products WHERE supplier_id IN (SELECT supplier_id FROM suppliers WHERE UPPER(city) = \'ATLANTA\');',

	'is the following statement valid, i.e. is it allowed to update rows in one table, based on a subquery from another table?\\nupdate copy_emp\\nset department_id = (select department_id\\n from employees\\n where employee_id = 100)\\nwhere job_id = (select job_id\\n from employees\\n where employee_id = 200);':
		'Yes, this is a perfectly valid statement.',

	'the players table contains these columns:\\nplayer_id number not null\\nplayer_lname varchar2(20) not null\\nplayer_fname varchar2(10) not null\\nteam_id number\\nsalary number(9,2)\\n\\nyou need to increase the salary of each player for all players on the tiger team by 12.5 percent. the team_id value for the tiger team is 5960. which statement should you use?':
		'UPDATE players SET salary = salary * 1.125 WHERE team_id = 5960;',

	'in a conditional multi-table insert, you can specify either __________ or __________.':
		'ALL; FIRST',

	'the employees table contains the following columns:\\nemployee_id number(10) primary key\\nlast_name varchar2(20)\\nfirst_name varchar2(20)\\ndeptartment_id varchar2(20)\\nhire_date date\\nsalary number(9,2)\\nbonus number(9,2)\\n\\nyou need to increase the salary for all employees in department 10 by 10 percent. you also need to increase the bonus for all employees in department 10 by 15 percent. which statement should you use?':
		'UPDATE employees SET salary = salary * 1.10, bonus = bonus * 1.15 WHERE department_id = 10;',

	'you need to add a row to an existing table. which dml statement should you use?':
		'INSERT',

	'you have been instructed to add a new customer to the customers table. because the new customer has not had a credit check, you should not add an amount to the credit column.\\nthe customers table contains these columns:\\ncust_id number(10)\\ncompany varchar2(30)\\ncredit number(10)\\npoc varchar2(30)\\nlocation varchar2(30)\\n\\nwhich two insert statements will accomplish your objective?':
		'INSERT INTO customers (cust_id, company, poc, location) VALUES (200, \'InterCargo\', \'tflanders\', \'samerica\');|INSERT INTO customers VALUES (200, \'InterCargo\', null, \'tflanders\', \'samerica\');',

	'which two commands can be used to modify existing data in a database row?':
		'UPDATE|MERGE',

	'which of the following statements best describes what will happen to the student table in this sql statement?\\nupdate students\\nset lunch_number =\\n (select lunch_number\\n from student\\n where student_id = 17)\\nwhere student_id = 19;':
		'The statement updates the student_table by replacing student id 19\'s lunch number with student id 17\'s lunch number.',

	'if a default value was set for a null column, oracle sets the column to the default value. however, if no default value was set when the column was created, oracle inserts a space.':
		'False',

	'using merge accomplishes an __________ and __________ simultaneously.':
		'INSERT; UPDATE',

	'is it possible to insert more than one row at a time using an insert statement with a values clause?':
		'No, you can only create one row at a time when using the VALUES clause.',

	'one employee has the last name of \\\'king\\\' in the employees table. how many rows will be deleted from the employees table with the following statement?\\ndelete from employees\\nwhere last_name = \\\'king\\\';':
		'No rows will be deleted, as no employees match the WHERE-clause.',

	'when inserting a new row, the null keyword can be included in the values list for any column that allows nulls.':
		'True',

	'if you are performing an update statement with a subquery, it must be a correlated subquery.':
		'False',

	'you want to enter a new record into the customers table. which two commands can be used to create new rows?':
		'INSERT, MERGE',

	'to store time with fractions of seconds, which datatype should be used for a table column?':
		'TIMESTAMP',

	'the elements column is defined as:\\nnumber(6,4)\\nhow many digits to the right of the decimal point are allowed for the elements column?':
		'Four',

	'the timestamp data type allows what?':
		'Time to be stored as a date with fractional seconds.',

	'which data types stores variable-length character data? select two.':
		'CLOB|VARCHAR2',

	'interval day to second stores a period of time in terms of days, hours, minutes, and seconds.':
		'True',

	"a column's data type can always be changed from number to varchar2 but not from varchar2 to number, provided the table is empty.":
		"False",

	'you can use the alter table statement to:':
		'All of the above',

	'evaluate this statement:\\nalter table inventory \\nmodify backorder_amount number(8,2);\\n\\nwhich task will this statement accomplish?':
		'Changes the definition of the BACKORDER_AMOUNT column to NUMBER(8,2)',

	'you need to remove all the data in the schedule table, the structure of the table, and the indexes associated with the table. which statement should you use?':
		'DROP TABLE',

	'when you use alter table to add a column, the new column:':
		'Becomes the last column in the table',

	'it is possible to create a table by using the create table command in conjunction with a subquery.':
		'True',

	'i have a table named school_friends in my schema. you want to build a table in your schema named school_friends. this is ______________, because ____________________________________.':
		'possible; my schema is separate from yours, and it is okay for us to have like-named tables in our separate schemas.',

	'which statement about table and column names is true?':
		'Table and column names must begin with a letter.',

	'you are creating the employees table. this table should contain the commission_pct column and use a value of 10 percent if no commission value is provided when a record is inserted. which line should you include in the create table statement to accomplish this task?':
		'commission_pct NUMBER(4,2) DEFAULT 0.10',

	'evaluate this create table statement:\\n1. create table customer#1 ( \\n2. cust_1 number(9), \\n3. sales$ number(9), \\n4. 2date date default sysdate);\\n\\nwhich line of this statement will cause an error?':
		'4',

	'which statement about data types is true?':
		'The CHAR data type should be defined with a size that is not too large for the data it contains (or could contain) to save space in the database.',

	"you are designing a table for the human resources department. this table must include a column that contains each employee's hire date. which data type should you specify for this column?":
		"DATE",

	'to store large amounts of text you should simply create a series of varchar2 columns in a table.':
		'False',

	'which sql statement below will correctly create the emp table based on the structure of the employees table? include only the employee_id, first_name, last_name, salary, and department_id columns.':
		'CREATE TABLE emp\\nAS\\nSELECT employee_id, first_name, last_name, salary, department_id\\nFROM employees;',

	'which create table statement will fail?':
		'CREATE TABLE date (date_id NUMBER(9));',

	'create table student_table \\n (id number(6), \\n lname varchar(20), \\n fname varchar(20), \\n lunch_num number(4));\\nwhich of the following statements best describes the above sql statement:':
		'Creates a table named student_table with four columns: id, lname, fname, lunch_num',

	"you want to issue the following command on a database that includes your company's inventory information: \\nalter table products set unused column color;\\nwhat will be the result of issuing this command?":
		"The column named COLOR in the table named PRODUCTS will not be returned in subsequent reads of the table by Oracle, as it has been deleted logically.",

	'the previous administrator created a table named contacts, which contains outdated data. you want to remove the table and its data from the database. which statement should you issue?':
		'DROP TABLE',

	'the flashback query statement can restore data back to a point in time before the last commit.':
		'False',

	'the flashback table to before drop can restore only the table structure, but not its data back to before the table was dropped.':
		'False',

	"you need to store the hire_date value with a time zone displacement value and allow data to be returned in the user's local session time zone. which data type should you use?":
		"TIMESTAMP WITH LOCAL TIME ZONE",

	"evaluate this statement: \\nwhich statement about this truncate table statement is true?":
		"You can issue this statement to retain the structure of the employees table.",

	'you need to change the name of the employees table to the emp table. which statement should you use?':
		'RENAME employees TO emp;',

	'the teams table contains these columns:\\nteam_id number(4) primary key\\nteam_name varchar2(20)\\nmgr_id number(9)\\n\\nthe teams table is currently empty. you need to allow users to include text characters in the manager identification values. which statement should you use to implement this?':
		'ALTER TABLE teams\\nMODIFY (mgr_id VARCHAR2(15));',

	'evaluate the structure of the employee table:\\nemployee_id number(9) \\nlast_name varchar2(25) \\nfirst_name varchar2(25) \\ndepartment_id number(9) \\nmanager_id number(9) \\nsalary number(7,2)\\n\\nwhich statement should you use to increase the last_name column length to 35 if the column currently contains 200 records?':
		'ALTER TABLE employee \\nMODIFY (last_name VARCHAR2(35));',

	'which statement about a column is not true?':
		'You can modify the data type of a column if the column contains non-null data.',

	'once they are created, external tables are accessed with normal sql statements.':
		'True',

	'which column name is valid?':
		'NUMBER_1$',

	'dcl, which is the acronym for data control language, allows:':
		'A Database Administrator the ability to grant privileges to users.',

	'a column that will be used to store binary data up to 4 gigabytes in size should be defined as which datatype?':
		'BLOB',

	'which of the following are valid oracle datatypes?':
		'DATE, TIMESTAMP WITH LOCAL TIME ZONE, BLOB',

	'evaluate this create table statement:\\ncreate table sales \\n( \\n sales_id number(9), \\n customer_id number(9), \\n employee_id number(9), \\n description varchar2(30), \\n sale_date timestamp with local time zone default sysdate, \\n sale_amount number(7,2));\\n\\nwhich business requirement will this statement accomplish?':
		'Today\'s date should be used if no value is provided for the sale date.',

	'examine the structure of the donations table.\\ndonations: \\npledge_id number \\ndonor_id number \\npledge_dt date \\namount_pledged number (7,2) \\namount_paid number (7,2) \\npayment_dt date\\n\\nyou need to reduce the precision of the amount_pledged column to 5 with a scale of 2 and ensure that when inserting a row into the donations table without a value for the amount_pledged column, a price of $10.00 will automatically be inserted. the donations table currently contains no records. which statement is true?':
		'Both changes can be accomplished with one ALTER TABLE statement.',

	'which command could you use to quickly remove all data from the rows in a table without deleting the table itself?':
		'TRUNCATE TABLE',

	'you need to remove all the rows from the sales_hist table. you want to release the storage space, but do not want to remove the table structure. which statement should you use?':
		'The TRUNCATE TABLE statement',

	'what will be the result in the hire_date column following this insert statement:\\n\\ninsert into employees values (10, \\\'natacha\\\', \\\'hansen\\\', default);':
		'Statement will work and the hire_date column will have the value of the date when the statement was run.',

	'you want to create a database table that will contain information regarding products that your company released during 2001. which name can you assign to the table that you create?':
		'PRODUCTS_2001',

	'you want to create a table named travel that is a child of the employees table. which of the following statements should you issue?':
		'CREATE TABLE travel \\n(destination_id number primary key, departure_date date, return_date date, emp_id number(10) REFERENCES employees (emp_id));',

	'evaluate this create table statement:\\ncreate table sales \\n(sales_id number, \\ncustomer_id number, \\nemployee_id number, \\nsale_date timestamp with time zone, \\nsale_amount number(7,2));\\n\\nwhich statement about the sale_date column is true?':
		'Data stored in the column will be returned in the database\'s local time zone.',

	'examine this create table statement:\\ncreate table emp_load\\n(employee_number char(5),\\nemployee_dob char(20),\\nemployee_last_name char(20),\\nemployee_first_name char(15),\\nemployee_middle_name char(15),\\nemployee_hire_date date)\\norganization external\\n(type oracle_loader\\ndefault directory def_dir1\\naccess parameters\\n(records delimited by newline\\nfields\\n(employee_number char(2),\\nemployee_dob char(20),\\nemployee_last_name char(18),\\nemployee_first_name char(11),\\nemployee_middle_name char(11),\\nemployee_hire_date char(10) date_format date mask "mm/dd/yyyy"))\\nlocation (\\\'info.dat\\\'));\\nwhat kind of table is created here?':
		'An external table with the data stored in a file outside the database.',

	'which statement about decreasing the width of a column is true?':
		'When a character column contains data, you can decrease the width of the column if the existing data does not violate the new size.',

	'which statement about creating a table is true?':
		'If no schema is explicitly included in a CREATE TABLE statement, the table is created in the current user\'s schema.',

	'when creating a new table, which of the following naming rules apply.':
		'Must begin with a letter|Must contain ONLY A - Z, a - z, 0 - 9, _ (underscore), $, and #|Must be between 1 to 30 characters long',

	'you need to store the seasonal data in months and years. which data type should you use?':
		'INTERVAL YEAR TO MONTH',

	'comments can be added to a table by using the comment on table statement. the comments being added are enclosed in:':
		'Single quotes \' \'',

	'which of the following will correctly change the name of the locations table to new_locations?':
		'RENAME LOCATIONS TO NEW_LOCATIONS',

	'the blob datatype can max hold 128 terabytes of data.':
		'True',

	'which statement should you use to decrease the width of the first_name column to 10 if the column currently contains 1500 records, but none are longer than 10 bytes or characters?':
		'ALTER TABLE players\\nMODIFY (first_name VARCHAR2(10));',

	'your supervisor has asked you to modify the amount column in the orders table. he wants the column to be configured to accept a default value of 250. the table contains data that you need to keep. which statement should you issue to accomplish this task?':
		'ALTER TABLE orders\\nMODIFY (amount DEFAULT 250);',

	"the employee_id column currently contains 500 employee identification numbers. business requirements have changed and you need to allow users to include text characters in the identification values. which statement should you use to change this column's data type?":
		"You CANNOT modify the data type of the EMPLOYEE_ID column, as the table is not empty.",

	'examine the structures of the products and suppliers tables. products: product_id number not null, primary key product_name varchar2 (25) supplier_id number foreign key to supplier_id of the supplier table list_price number (7,2) cost number (7,2) qty_in_stock number qty_on_order number reorder_level number reorder_qty number suppliers: supplier_id number not null, primary key supplier_name varchar2 (25) address varchar2 (30) city varchar2 (25) region varchar2 (10) postal_code varchar2 (11) evaluate this statement: alter table suppliers disable constraint supplier_id_pk cascade; for which task would you issue this statement?':
		'To disable any dependent integrity constraints on the SUPPLIER_ID column in the PRODUCTS table',

	'the po_details table contains these columns: po_num number not null, primary key po_line_id number not null, primary key product_id number foreign key to product_id column of the products table quantity number unit_price number(5,2) evaluate this statement: alter table po_details disable constraint product_id_pk cascade; for which task would you issue this statement?':
		'To disable the composite PRIMARY KEY of the po_details table and any dependent FOREIGN KEY constraints',

	'which of the following would definitely cause an integrity constraint error?':
		'Using the DELETE command on a row that contains a primary key with a dependent foreign key declared without either an ON DELETE CASCADE or ON DELETE SET NULL.',

	'when dropping a constraint, which keyword(s) specifies that all the referential integrity constraints that refer to the primary and unique keys defined on the dropped columns are dropped as well?':
		'CASCADE',

	'all of a user\\\'s constraints can be viewed in the oracle data dictionary view called:':
		'USER_CONSTRAINTS',

	'evaluate the structure of the donations table. donations: pledge_id number not null, primary key donor_id number foreign key to donor_id column of donors table pledge_dt date amount_pledged number (7,2) amount_paid number (7,2) payment_dt date which create table statement should you use to create the donations table?':
		'CREATE TABLE donations (pledge_id NUMBER PRIMARY KEY, donor_id NUMBER CONSTRAINT donor_id_fk REFERENCES donors(donor_id), pledge_date DATE, amount_pledged NUMBER(7,2), amount_paid NUMBER(7,2), payment_dt DATE);',

	'which clause could you use to ensure that cost values are greater than 1.00?':
		'CONSTRAINT part_cost_ck CHECK (cost > 1.00)',

	'what must exist on the parent table before oracle will allow you to create a foreign key constraint from a child table?':
		'A PRIMARY or UNIQUE KEY constraint must exist on the Parent table.',

	'evaluate this create table statement: create table part( part_id number, part_name varchar2(25), manufacturer_id number(9), retail_price number(7,2) not null, constraint part_id_pk primary key(part_id), constraint cost_nn not null(cost), constraint foreign key (manufacturer_id) references manufacturer(id)); which line will cause an error?':
		'Line 7 (and Line 8)',

	'which type of constraint by default requires that a column be both unique and not null?':
		'PRIMARY KEY',

	'you need to ensure that the last_name column only contains certain character values. no numbers or special characters are allowed. which type of constraint should you define on the last_name column?':
		'CHECK',

	'which constraint can only be created at the column level?':
		'NOT NULL',

	'evaluate this create table statement: create table customers (customer_id number, customer_name varchar2(25), address varchar2(25), city varchar2(25), region varchar2(25), postal_code varchar2(11), constraint customer_id_un unique(customer_id), constraint customer_name_nn not null(customer_name)); why does this statement fail when executed?':
		'NOT NULL constraints CANNOT be defined at the table level.',

	'you need to ensure that the last_name column does not contain null values. which type of constraint should you define on the last_name column?':
		'NOT NULL',

	'a table must have at least one not null constraint and one unique constraint.':
		'False',

	'you need to remove the emp_fk_dept constraint from the employee table in your schema. which statement should you use?':
		'ALTER TABLE employees DROP CONSTRAINT EMP_FK_DEPT;',

	'what mechamisn does oracle use in the background to enforce uniqueness in primary and unique key constraints?':
		'Unique key indexes are created in the background by Oracle when Primary key and Unique key constraints are created or enabled',

	'what is the syntax for removing a primary key constraint and all its dependent constraints?':
		'ALTER TABLE table_name DROP CONSTRAINT constraint_name CASCADE;',

	'you need to add a not null constraint to the cost column in the part table. which statement should you use to complete this task?':
		'ALTER TABLE part MODIFY (cost CONSTRAINT part_cost_nn NOT NULL);',

	'you need to ensure that each value in the seat_id column is unique or null. which constraint should you define on the seat_id column?':
		'UNIQUE',

	'which statement about constraints is true?':
		'NOT NULL constraints can only be specified at the column level.',

	'which statement about the not null constraint is true?':
		'The NOT NULL constraint must be defined at the column level.',

	'which two statements about not null constraints are true?':
		'The Oracle Server creates a name for an unnamed NOT NULL constraint.|You CANNOT add a NOT NULL constraint to an existing column using the ALTER TABLE ADD CONSTRAINT statement.',

	'what is the highest number of not null constraints you can have on a table?':
		'You can have as many NOT NULL constraints as you have columns in your table.',

	'which line of the following code will cause an error: create table clients (client_number number(4) constraint client_client_num_pk primary key client_number, first_name varchar2(14), last_name varchar2(13), hire_date date constraint emp_min_hire_date check (hire_date < sysdate), department_id varchar(3), constraint clients_dept_id_fk foreign key(department_id) references departments(department_id));':
		'Line 5 (and Line 2)',

	'a primary key that is made up of more than one column is called a:':
		'Composite Primary Key',

	'which of the following foreign key constraint keywords identifies the table and column in the parent table?':
		'REFERENCES',

	'a composite primary key may only be defined at the table level.':
		'True',

	'you need to enforce a relationship between the loc_id column in the facility table and the same column in the manufacturer table. which type of constraint should you define on the loc_id column?':
		'FOREIGN KEY',

	'which constraint type enforces uniqueness?':
		'PRIMARY KEY',

	'if the employees table has a unique constraint on the department_id column, we can only have one employee per department.':
		'True',

	'you need to add a not null constraint to the email column in the employees table. which clause should you use?':
		'MODIFY',

	'you want to disable the foreign key constraint that is defined in the employees table on the department_id column. the constraint is referenced by the name fk_dept_id_01. which statement should you issue?':
		'ALTER TABLE employees DISABLE CONSTRAINT fk_dept_id_01;',

	'you need to add a primary key constraint on the emp_id column of the employees table. which alter table statement should you use?':
		'ALTER TABLE employees ADD CONSTRAINT emp_emp_id_pk PRIMARY KEY(emp_id);',

	'to automatically delete rows in a child table when a parent record is deleted use:':
		'ON DELETE CASCADE',

	'the employees table contains a foreign key column department_id that references the id column in the departments table. which of the following constraint modifiers will not allow the deletion of id values in the department table?':
		'Neither A nor B',

	'the line_item table contains these columns: line_item_id number primary key product_id number(9) foreign key references the id column of the product table quantity number(9) unit_price number(5,2) you need to disable the foreign key constraint. which statement should you use?':
		'ALTER TABLE line_item DISABLE CONSTRAINT product_id_fk;',

	'this sql command will do what? alter table employees add constraint emp_manager_fk foreign key(manager_id) references employees(employee_id);':
		'Add a FOREIGN KEY constraint to the EMPLOYEES table indicating that a manager must already be an employee.',

	'a table can only have one unique key constraint defined.':
		'False',

	'primary key, foreign key, unique key, and check constraints can be added at which two levels?':
		'Column|Table',


	'what actions can be performed on or with constraints?':
		'Add, Drop, Enable, Disable, Cascade',

	'the command to \\\'switch off\\\' a constraint is:':
		'ALTER TABLE DISABLE CONSTRAINT',

	'a column defined as not null can have a default value of null.':
		'False',

	'you disabled the employee_id_pk primary key constraint on the id column in the employees table and imported 100 records. you need to enable the constraint and verify that the new and existing id column values do not violate the primary key constraint. evaluate this statement: alter table employees enable employee_id_pk; which statement is true?':
		'The statement will NOT execute because it contains a syntax error.',

	'you need to create a composite primary key constraint on the employees table. which statement is true?':
		'The PRIMARY KEY constraint must be defined at the table level.',

	'you need to create the project_hist table. the table must meet these requirements:\\n\\nthe table must contain the employee_id and tasked_hours columns for numeric data.\\nthe table must contain the start_date and end_date column for date values.\\nthe table must contain the hourly_rate and project_cost columns for numeric data with precision and scale of 5,2 and 10,2 respectively.\\nthe table must have a composite primary key on the employee_id and start_date columns.\\n\\nevaluate this create table statement:\\n\\ncreate table project_hist\\n( employee_id number,\\nstart_date date,\\nend_date date,\\ntasked_hours number,\\nhourly_rate number(5,2),\\nproject_cost number(10,2),\\nconstraint project_hist_pk primary key(employee_id, start_date));\\n\\nhow many of the requirements does the create table statement satisfy?':
		'All four of the requirements',


	'once constraints have been created on a table, you will have to live with them as they are unless you drop and re-create the table.':
		'False',

	'the table that contains the primary key in a foreign key constraint is known as:':
		'Parent Table',

	'which statement about a non-mandatory foreign key constraint is true?':
		'A foreign key value must either be null or match an existing value in the parent table.',

	'if a primary key is made up of more than one column, one of the columns can be null.':
		'False',

	'when creating a referential constraint, which keyword(s) identifies the table and column in the parent table?':
		'REFERENCES',

	'un ejemplo de la adición de una restricción de control para limitar el salario que un empleado dapat ganar es:':
		'ALTER TABLE employees ADD CONSTRAINT emp_salary_ck CHECK (salary < 100000)',

	'you can view the columns used in a constraint defined for a specific table by looking at which data dictionary table?':
		'USER_CONS_COLUMNS',

	'which of the following pieces of code will successfully create a foreign key in the cds table that references the songs table?':
		'All of the above',

	'a unique key constraint can only be defined on a not null column.':
		'False',

	'you need to display the names and definitions of constraints only in your schema. which data dictionary view should you query?':
		'USER_CONSTRAINTS',

	'you can drop a column in a table with a simple alter table drop column statement, even if the column is referenced in a constraint.':
		'False',

	'evaluate this create view statement: create view emp_view as select sum(salary) from employees; which statement is true?':
		'You cannot update data in the EMPLOYEES table using the EMP_VIEW view.',

	'which keyword(s) would you include in a create view statement to create the view whether or not the base table exists?':
		'FORCE',

	'views must be used to select data from a table. as soon as a view is created on a table, you can no longer select directly from the table.':
		'False',

	'a view can be used to keep a history record of old data from the underlying tables, so even if a row is deleted from a table, you can still select the row through the view.':
		'False',

	'in order to query a database using a view, which of the following statements applies?':
		'You can retrieve data from a view as you would from any table.',

	'if a database administrator wants to ensure that changes performed through a view do not violate existing constraints, which clause should he include when creating the view?':
		'WITH CHECK OPTION',

	'what is the purpose of including the with check option clause when creating a view?':
		'To insure that no rows are updated through the view that would prevent those rows from being returned by the view in the future.',

	'only one type of view exists.':
		'False',

	'for a view created using the with check option keywords, which of the following statements are true?':
		'Prohibits changing rows not returned by the subquery in the view definition.',

	'you cannot insert data through a view if the view includes ______.':
		'A GROUP BY clause',

	'when you drop a view, the data it contains is also deleted.':
		'False',

	'evaluate this create view statement: create view sales_view as select customer_id, region, sum(sales_amount) from sales where region in (10, 20, 30, 40) group by region, customer_id; which statement is true?':
		'You cannot modify data in the SALES table using the SALES_VIEW view.',

	'evaluate this create view statement: create view pt_view as (select first_name, last_name, status, courseid, subject, term from faculty f, course c where f.facultyid = c.facultyid); which type of view will this statement create?':
		'Complex',

	'you want to create a view based on the salesrep table. you plan to grant access to this view to members of the sales department. you want sales employees to be able to update the salesrep table through the view, which you plan to name salesrep_view. what should not be specified in your create view statement?':
		'A GROUP BY clause',

	'how do you remove a view?':
		'DROP VIEW view_name',

	'when you drop a table referenced by a view, the view is automatically dropped as well.':
		'False',

	'which statement about an inline view is true?':
		'An inline view is a subquery in the FROM clause, often named with an alias.',

	'a top-n analysis is capable of ranking a top or bottom set of results.':
		'True',

	'which of these keywords is typically used with a top-n analysis?':
		'Rownum',

	'you must create a view that will display the name, customer identification number, new balance, finance charge, and credit limit of all customers. you issue this statement: create or replace view cust_credit_v as select c.last_name, c.customer_id, a.new_balance, a.finance_charge, a.credit_limit from customers c, accounts a where c.account_id = a.account_id with read only; which type of sql command can be issued on the cust_credit_v view?':
		'SELECT',

	'you administer an oracle database. jack manages the sales department. he and his employees often find it necessary to query the database to identify customers and their orders. he has asked you to create a view that will simplify this procedure for himself and his staff. the view should not accept insert, update, or delete operations. which of the following statements should you issue?':
		'CREATE VIEW sales_view AS (SELECT c.companyname, c.city, o.orderid, o. orderdate, o.total FROM customers c, orders o WHERE c.custid = o.custid) WITH READ ONLY;',

	'which statement about performing dml operations on a view is true?':
		'You can perform DML operations on simple views.',

	'which option would you use when creating a view to ensure that no dml operations occur on the view?':
		'WITH READ ONLY',

	'unlike tables, views contain no data of their own.':
		'True',

	'which of the following statements is a valid reason for using a view?':
		'Views provide data independence for infrequent users and application programs. One view can be used to retrieve data from several tables. Views can be used to provide data security.',

	'you need to create a view on the sales table, but the sales table has not yet been created. which statement is true?':
		'You can use the FORCE option to create the view before the SALES table has been created.',

	'which of the following keywords cannot be used when creating a view?':
		'ORDER BY',

	'a view can contain a select statement with a subquery.':
		'True',

	'the faculty table contains these columns: facultyid varchar2(5) not null primary key first_name varchar2(20) last_name varchar2(20) address varchar2(35) city varchar2(15) state varchar2(2) zip number(9) telephone number(10) status varchar2(2) not null the course table contains these columns: courseid varchar2(5) not null primary key subject varchar2(5) term varchar2(6) facultyid varchar2(5) not null foreign key you have been asked to compile a report that identifies all adjunct professors who will be teaching classes in the upcoming term. you want to create a view that will simplify the creation of this report. which create view statements will accomplish this task?':
		'CREATE VIEW pt_view AS (SELECT first_name, last_name, status, courseid, subject, term FROM faculty f, course c WHERE f.facultyid = c.facultyid);',

	'what is one advantage of using views?':
		'To provide restricted data access',

	'you can create a view if the view subquery contains an inline view.':
		'True',

	'the employees table contains these columns: employee_id number last_name varchar2(25) first_name varchar2(25) department_id number job_id number manager_id number salary number(9,2) commissoin number(7,2) hire_date date which select statement could be used to display the 10 lowest paid clerks that belong to department 70?':
		'SELECT ROWNUM "Ranking",last_name||\\\',\\\'||first_name "Employee", salary "Salary" FROM (SELECT last_name, first_name, salary, job_id FROM employees WHERE job_id LIKE \\\'CLERK\\\' AND department_id = 7 ORDER BY salary) WHERE ROWNUM <=10',

	'which of the following describes a top-n query?':
		'A top-N query returns a limited result set, returning data based on highest or lowest criteria.',

	'which of these is not a valid type of view?':
		'ONLINE',

	'given the following view, which operations would be allowed on the emp_dept view? create or replace view emp_dept as select substr(e.first_name,1,1) ||\\\' \\\'||e.last_name emp_name, e.salary, e.hire_date, d.department_name from employees e, departments d where e.department_id = d.department_id and d.department_id >=50;':
		'SELECT, UPDATE of some columns, DELETE',

	'you need to create a new view on the employees table to update salary information for employees in department 50. you need to ensure that dml operations through the view can not change salary values in other departments. which clause should be included in the create view statement?':
		'WITH CHECK OPTION',

	'you create a view on the employees and departments tables to display salary information per department. what will happen if you issue the following statement? create or replace view sal_dept as select sum(e.salary) sal, d.department_name from employees e, departments d where e.department_id = d.department_id group by d.department_name;':
		'A complex view is created that returns the sum of salaries per department.',

	'evaluate this view definition: create or replace view part_name_v as select distinct part_name from parts where cost >= 45; which of the following statements using the part_name_v view will execute successfully?':
		'SELECT * FROM part_name_v;',

	'any select statement can be stored in the database as a view.':
		'True',

	'which statement about the create view statement is true?':
		'A CREATE VIEW statement CAN contain a join query.',

	'which statement would you use to alter a view?':
		'CREATE OR REPLACE VIEW',

	'examine the view below and choose the operation that cannot be performed on it. create view dj_view (last_name, number_events) as select c.last_name, count(e.name) from d_clients c, d_events e where c.client_number = e.client_number group by c.last_name;':
		'INSERT INTO dj_view VALUES (\\\'Turner\\\', 8);',

	'which action can be performed by using dml statements?':
		'Deleting records in a table',

	'which of the following is true about rownum?':
		'It is the number assigned to each row returned from a query as it is read from the table.',

	'which of the following dml operations is not allowed when using a simple view created with read only?':
		'All of the above',

	'an inline view is an unnamed select statement found:':
		'Enclosed in parentheses within the FROM clause of a surrounding query.',

	'given the following create view statement, what data will be returned? create or replace view emp_dept as select substr(e.first_name,1,1) ||\\\' \\\'||e.last_name emp_name, e.salary, e.hire_date, d.department_name from employees e, departments d where e.department_id = d.department_id and d.department_id >=50;':
		'First character from employee first_name concatenated to the last_name, the salary, the hire_date, and the department_name of all employees working in department number 50 or higher.',

	'you administer an oracle database which contains a table named employees. luke, a database user, must create a report that includes the names and addresses of all employees. you do not want to grant luke access to the employees table because it contains sensitive data. which of the following actions should you perform first?':
		'Create a view.',

	'your manager has just asked you to create a report that illustrates the salary range of all the employees at your company. which of the following sql statements will create a view called salary_vu based on the employee last names, department names, salaries, and salary grades for all employees? use the employees, departments, and job_grades tables. label the columns employee, department, salary, and grade, respectively.':
		'CREATE OR REPLACE VIEW salary_vu AS SELECT e.last_name "Employee", d.department_name "Department", e.salary "Salary", j. grade_level "Grade" FROM employees e, departments d, job_grades j WHERE e.department_id = d.department_id AND e.salary BETWEEN j.lowest_sal and j.highest_sal;',

	'sequences can be used to:':
		'Generate a range of numbers and optionally cycle through them again.|Set a fixed interval between successively generated numbers.|Ensure primary key values will be unique even though gaps may exist.',

	'evaluate this create sequence statement: create sequence line_item_id_seq increment by -1; which statement is true?':
		'The sequence will generate sequential descending values.',

	'examine the code for creating this sequence: create sequence track_id_seq increment by 10 start with 1000 maxvalue 10000; what are the first three values that would be generated?':
		'1000, 1010, 1020.',

	'you create a customers table in which customer_id is designated as a primary key. which of the following actions should you perform to generate values automatically?':
		'Create a sequence.',

	'you need to retrieve the next available value for the sales_idx sequence. which would you include in your sql statement?':
		'sales_idx.NEXTVAL',

	'which statement would you use to modify the emp_id_seq sequence used to populate the employee_id column in the employees table?':
		'ALTER SEQUENCE emp_id_seq;',

	'why do gaps in sequences occur?':
		'All of the above',

	'you create a sequence with the following statement: create sequence my_emp_seq; which of the following statements about this sequence are true?':
		'MAXVALUE is 10^27 for an ascending sequence.|MINVALUE is equal to 1.',

	'the employees table has an index named ln_idx on the last_name column. you want to change this index so that it is on the first_name column instead. which sql statement will do this?':
		'None of the above; you cannot ALTER an index.',

	'user mary\\\'s schema contains an emp table. mary has database administrator privileges and executes the following statement: create public synonym emp for mary.emp; user susan now needs to select from mary\\\'s emp table. which of the following sql statements can she use?':
		'SELECT * FROM emp;|SELECT * FROM mary.emp;',

	'barry creates a table named inventory. pam must be able to query the same table. barry wants to enable pam to query the table without being required to specify the table\\\'s schema. which of the following should barry create?':
		'A synonym.',

	'you need to determine the table name and column name(s) on which the sales_idx index is defined. which data dictionary view would you query?':
		'USER_IND_COLUMNS',

	'the following indexes exist on the employees table: a unique index on the employee_id primary key column; a non-unique index on the job_id column; a composite index on the first_name and last_name columns. if the employees table is dropped, which indexes are automatically dropped at the same time?':
		'All indexes.',

	'evaluate this create sequence statement: create sequence order_id_seq nocycle nocache; which statement is true?':
		'The sequence will start with 1.',

	'the employees table contains these columns: employee_id number not null (primary key), last_name varchar2(20), first_name varchar2(20), department_id number (foreign key), hire_date date, salary number. on which column is an index automatically created?':
		'EMPLOYEE_ID.',

	'which of the following best describes the function of the currval virtual column?':
		'The CURRVAL virtual column will display the integer that was most recently supplied by a sequence.',

	'you create a table named customers and define a primary key constraint on the cust_id column. which actions occur automatically?':
		'A unique index is created on the CUST_ID column, if one does not already exist.',

	'currval is a pseudocolumn used to refer to a sequence number that the current user has just generated by referencing nextval.':
		'True',

	'evaluate this create sequence statement: create sequence line_item_id_seq minvalue 100 maxvalue 130 increment by -10 cycle nocache; what will be the first five numbers generated by this sequence?':
		'130, 120, 110, 100, 130.',

	'which statement about an index is true?':
		'An index created on multiple columns is called a composite or concatenated index.',

	'evaluate this statement: create index sales_idx on oe.sales (status); which statement is true?':
		'The CREATE INDEX statement creates a nonunique index.',

	'nextval and currval are known as column aliases.':
		'False',

	'you create a customers table in which customer_id is designated as a primary key. you want the values that are entered into the customer_id column to be generated automatically. which of the following actions should you perform?':
		'Create a sequence.',

	'unique indexes are automatically created on columns that have which two types of constraints?':
		'UNIQUE and PRIMARY KEY',

	'the employees table contains these columns: employee_id number not null, primary key last_name varchar2 (20) first_name varchar2 (20) department_id number foreign key to product_id column of the product table hire_date date default sysdate salary number (8,2) not null on which column is an index automatically created for the employees table?':
		'EMPLOYEE_ID.',

	'in order to be able to generate primary key values that are not likely to contain gaps, which phrase should be included in the sequence creation statement?':
		'NOCACHE',

	'you created the location_id_seq sequence to generate sequential values for the location_id column in the manufacturers table. you issue this statement: alter table manufacturers modify (location_id number(6)); which statement about the location_id_seq sequence is true?':
		'The sequence is unchanged.',

	'which dictionary view would you query to display the number most recently generated by a sequence?':
		'USER_SEQUENCES',

	'which statement would you use to remove the last_name_idx index on the last_name column of the employees table?':
		'DROP INDEX last_name_idx;',

	'all tables must have indexes on them otherwise they cannot be queried.':
		'False',

	'which of the following sql statements shows a correct syntax example of creating a synonym accessible to all users of a database?':
		'CREATE PUBLIC SYNONYM emp FOR sam.employees;',

	'what is the correct syntax for creating an index?':
		'CREATE INDEX index_name ON table_name(column_name);',

	'what is the correct syntax for creating a private synonym d_sum for the view dept_sum_vu?':
		'CREATE SYNONYM d_sum FOR dept_sum_vu;',

	'what kind of index is created by oracle when you create a primary key?':
		'UNIQUE INDEX',


	'when creating an index on one or more columns of a table, which of the following statements are true?':
		'You should create an index if one or more columns are frequently used together in a join condition.|You should create an index if the table is large and most queries are expected to retrieve less than 2 to 4 percent of the rows.',

	'the customers table exists in user mary\\\'s schema. which statement should you use to create a synonym for all database users on the customers table?':
		'CREATE PUBLIC SYNONYM cust FOR mary.customers;',

	'which of the following best describes the function of an index?':
		'An index is a database object that can be created to speed up the retrieval of rows by using a pointer.',

	'the alter sequence statement can be used to:':
		'Change the amount a sequence increments each time a number is generated',

	'a sequence is a database object.':
		'True',

	'creating a sequence with nocache ensures that all numbers in the sequence\\\'s range will be used successfully.':
		'False',

	'which of the following best describes the function of the nextval virtual column?':
		'The NEXTVAL virtual column increments a sequence by a predetermined value.',

	'when used in a create sequence statement, which keyword specifies that a range of sequence values will be preloaded into memory?':
		'CACHE',

	'which pseudocolumn returns the latest value supplied by a sequence?':
		'CURRVAL',

	'which statement would you use to remove the emp_id_seq sequence?':
		'DROP SEQUENCE emp_id_seq;',

	'in sql what is a synonym?':
		'An alternative name for a table, view, or other database object',

	'you want to speed up the following query by creating an index: select * from employees where salary * 12 > 100000; which index should you create?':
		'CREATE INDEX emp_sal_idx ON employees(salary * 12);',

	'you want to speed up the following query by creating an index: select * from employees where (salary * 12) > 100000; which of the following will achieve this?':
		'Create a function-based index on (salary * 12).',

	'for which column would you create an index?':
		'A column with a large number of null values',

	'when creating a sequence, which keyword or option specifies the minimum sequence value?':
		'MINVALUE',

	'when you alter a sequence, a new increased maxvalue can be entered without changing the existing number order.':
		'True',

	'which keyword is used to modify a sequence?':
		'ALTER',

	'which is the correct syntax for specifying a maximum value in a sequence?':
		'MAXVALUE',

	'a gap can occur in a sequence because a user generated a number from the sequence and then rolled back the transaction.':
		'True',

	'which of the following is created automatically by oracle when a unique integrity constraint is created?':
		'An index',

	'evaluate this statement: create public synonym testing for chan.testing; which task will this statement accomplish?':
		'It eliminates the need for all users to qualify TESTING with its schema.',

	'what is the most common use for a sequence?':
		'To generate primary key values',

	'currval is a pseudocolumn used to extract successive sequence numbers from a specified sequence.':
		'False',

	'what would you create to make the following statement execute faster? select * from employees where lower(last_name) = \\\'chang\\\';':
		'An index, either a normal or a function_based index',

	'to see the most recent value that you fetched from a sequence named my_seq you should reference:':
		'my_seq.currval',

	'evaluate this create sequence statement: create sequence line_item_id_seq cycle; which statement is true?':
		'The sequence will continue to generate values after the maximum sequence value has been generated.',

	'as user julie, you issue this statement: create synonym emp for sam.employees; which task was accomplished by this statement?':
		'You created a private synonym on the EMPLOYEES table owned by user Sam.',

	'the clients table contains these columns: client_id number(4) not null primary key last_name varchar2(15) first_name varchar2(10) city varchar2(15) state varchar2(2) you want to create an index named address_index on the city and state columns of the clients table. you execute this statement: create index clients address_index (city, state); which result does this statement accomplish?':
		'An error message is produced, and no index is created.',

	'the employees table contains these columns: emp_id not null, primary key ssnum not null, unique last_name varchar2(25) first_name varchar2(25) dept_id number foreign key to dept_id column of the departments table salary number(8,2) you execute this statement: create index emp_name_idx on employees(last_name, first_name); which statement is true?':
		'The statement creates a composite non-unique index.',


	'you created the location_id_seq sequence':
		'The sequence is unchanged.',

	'what kind of index is created by oracle':
		'UNIQUE INDEX',

	'indexes can be used to speed up queries.':
		'True',

	'when creating an index on one or more':
		'more columns are frequently used together in a join condition.',

	'the alter sequence statement can be used':
		'increments each time a number is generated',

	'creating a sequence with nocache ensures':
		'False',

	'when used in a create sequence':
		'CACHE',

	'when creating a sequence, which keyword':
		'MINVALUE',

	'all tables must have indexes on them':
		'False',

	'which one of the following statements about indexes is true?':
		'An index is created automatically when a PRIMARY KEY constraint is created.',

	'evaluate this statement: create sequence sales_item_id_seq start with 101 maxvalue 9000090 cycle; which statement about this create sequence statement is true?':
		'The sequence will reuse numbers and will start with 101.',

	'evaluate this statement: drop sequence line_item_id_seq; what does this statement accomplish?':
		'It removes the sequence from the data dictionary.',

	'which keyword is used to remove a sequence?':
		'Drop',

	'regular expressions used as check constraints are another way to ensure data is formatted correctly prior to being written into the database table.':
		'True',

	'regular expressions are a method of describing both simple and complex patterns for searching and manipulating.':
		'True',

	'regular expressions can be used as part of a contraint definition.':
		'True',

	'regular expressions can be used on char, clob, and varchar2 datatypes.':
		'True',

	'a role can be granted to another role.':
		'True',

	'which of the following simplifies the administration of privileges?':
		'A role',

	'which keyword would you use to grant an object privilege to all database users?':
		'PUBLIC',

	'user craig creates a view named inventory_v, which is based on the inventory table. craig wants to make this view available for querying to all database users. which of the following actions should craig perform?':
		'He should assign the SELECT privilege to all database users for INVENTORY_V view.',

	'if you are granted privileges to your friend\\\'s object, by default you may also grant access to this same object to other users.':
		'False',

	'which data dictionary view shows which system privileges have been granted to a user?':
		'USER_SYS_PRIVS',

	'a schema is a collection of objects such as tables, views, and sequences.':
		'True',

	'the database administrator wants to allow user marco to create new tables in his own schema. which privilege should be granted to marco?':
		'CREATE TABLE',

	'you are the database administrator. you want to create a new user jones with a password of mark, and allow this user to create his own tables. which of the following should you execute?':
		'CREATE USER jones IDENTIFIED BY mark;\\nGRANT CREATE SESSION TO jones;\\nGRANT CREATE TABLE TO jones;',

	'which object privilege (other than alter) can be granted to a sequence?':
		'SELECT',

	'object privileges are:':
		'Required to manipulate the content of objects in the database.',

	'the following table shows some of the output from one of the data dictionary views. which view is being queried? username privilege admin_option usca_oracle_sql01_s08 create view no usca_oracle_sql01_s08 create table no usca_oracle_sql01_s08 create synonym no usca_oracle_sql01_s08 create trigger no usca_oracle_sql01_s08 create sequence no usca_oracle_sql01_s08 create database no':
		'user_sys_privs (lists system privileges granted to the user)',

	'which of the following best describes a role in an oracle database?':
		'A role is a name for a group of privileges.',

	'a schema is:':
		'A collection of objects, such as tables, views, and sequences.',

	'system privileges are:':
		'Required to gain access to the database.',

	'you grant user amy the create session privilege. which type of privilege have you granted to amy?':
		'A system privilege',

	'user adam has successfully logged on to the database in the past, but today he receives an error message stating that (although he has entered his password correctly) he cannot log on. what is the most likely cause of the problem?':
		'ADAM\\\'s CREATE SESSION privilege has been revoked.',

	'which of the following are system privileges?':
		'CREATE TABLE|CREATE SYNONYM',

	'_________________ are special characters that have a special meaning, such as a wildcard character, a repeating character, a non-matching character, or a range of characters. you can use several of these symbols in pattern matching.':
		'Meta characters',

	'regular expressions does exactly the same as like--no more and no less.':
		'False',

	'which of the following best describes the purpose of the references object privilege on a table?':
		'It allows a user to create foreign key constraints on the table.',

	'when a user is logged into one database, he is restricted to working with objects found in that database.':
		'False',

	'what oracle feature simplifies the process of granting and revoking privileges?':
		'Role',

	'which of the following statements about granting object privileges is false?':
		'Object privileges can only be granted through roles.',

	'when granting an object privilege, which option would you include to allow the grantee to grant the privilege to another user?':
		'WITH GRANT OPTION',

	'you create a view named employees_view on a subset of the employees table. user audrey needs to use this view to create reports. only you and audrey should have access to this view. which of the following actions should you perform?':
		'GRANT SELECT ON employees_view TO audrey;',

	'scott king owns a table called employees. he issues the following statement: grant select on employees to public; allison plumb has been granted create session by the dba. she logs into the database and issues the following statement: grant select on scott_king.employees to jennifer_cho; true or false: allison\\\'s statement will fail.':
		'True',

	'which of the following object privileges can be granted on an individual column on a table?':
		'Update|References',

	'regular expressions can be used on char, clob, and varchar2 datatypes? (true or false)':
		'True',

	'parentheses are not used to identify the sub expressions within the expression.':
		'False',

	'user james has created a customers table and wants to allow all other users to select from it. which command should james use to do this?':
		'GRANT SELECT ON customers TO PUBLIC;',

	'you need to grant user bob select privileges on the employees table. you want to allow bob to grant this privileges to other users. which statement should you use?':
		'GRANT SELECT ON employees TO bob WITH GRANT OPTION;',

	'user bob\\\'s schema contains an employees table. bob executes the following statement: grant select on employees to mary with grant option; which of the following statements can mary now execute successfully?':
		'GRANT SELECT ON bob.employees TO PUBLIC;|SELECT FROM bob.employees;',

	'user chang has been granted select, update, insert, and delete privileges on the employees table. you now want to prevent chang from adding or deleting rows from the table, while still allowing him to read and modify existing rows. which statement should you use to do this?':
		'REVOKE INSERT, DELETE ON employees FROM chang;',

	'which of the following is not a database object?':
		'Subquery',

	'which statement would you use to add privileges to a role?':
		'GRANT',

	'which of the following statements is true?':
		'Database Links allow users to work on remote database objects without having to log into the other database.',

	'user susan creates an employees table, and then creates a view emp_view which shows only the first_name and last_name columns of employees. user rudi needs to be able to access employees\\\' names but no other data from employees. which statement should susan execute to allow this?':
		'GRANT SELECT ON emp_view TO rudi;',

	'to join a table in your database to a table on a second (remote) oracle database, you need to use:':
		'A database link',

	'you want to grant user bob the ability to change other users\\\' passwords. which privilege should you grant to bob?':
		'The ALTER USER privilege',

	'to take away a privilege from a user, you use which command?':
		'REVOKE',

	'user1 owns a table and grants select on it with grant option to user2. user2 then grants select on the same table to user3. if user1 revokes select privileges from user2, will user3 be able to access the table?':
		'No',

	'which of these is not a system privilege granted by the dba?':
		'Create Index',

	'which statement would you use to grant a role to users?':
		'GRANT',

	// Section 17 Quiz - Additional from DeniAce blog (2026-06-05)
	'which of the following are object privileges?':
		'INSERT|SELECT',
	'by controlling user access with oracle database security, you can give access to specific objects in the database.':
		'True',
	'select the correct regular expression functions:':
		'REGEXP_INSTR, REGEXP_SUBSTR|REGEXP_LIKE, REGEXP_REPLACE',
	'which of these sql functions used to manipulate strings is not a valid regular expression function?':
		'REGEXP',
	'you want to grant privileges to user chan that will allow chan to update the data in the employees table. which type of privileges will you grant to chan?':
		'Object privileges',
	'which of the following privileges must be assigned to a user account in order for that user to connect to an oracle database?':
		'CREATE SESSION',
	'roles are:':
		'Named groups of related privileges given to a user or another role.',
	'which statement would you use to remove an object privilege granted to a user?':
		'REVOKE',

	// Section 18 Quiz - Database Programming With SQL (DeniAce blog, 2026-06-05)
	"steven king's row in the employees table has employee_id = 100 and salary = 24000. a user issues the following statements in the order shown: update employees set salary = salary * 2 where employee_id = 100; commit; update employees set salary = 30000 where employee_id = 100; the user's database session now ends abnormally. what is now king's salary in the table?":
		"48000",
	'table mytab contains only one column of datatype char(1). a user executes the following statements in the order shown. insert into mytab values (\\\'a\\\'); insert into mytab values (\\\'b\\\'); commit; insert into mytab values (\\\'c\\\'); rollback; which rows does the table now contain?':
		'A and B',
	'if oracle crashes, your changes are automatically rolled back.':
		'True',
	'examine the following statements: update employees set salary = 15000; savepoint upd1_done; update employees set salary = 22000; savepoint upd2_done; delete from employees; you want to retain all the employees with a salary of 15000; what statement would you execute next?':
		'ROLLBACK TO SAVEPOINT upd1_done;',
	'commit saves all outstanding data changes.':
		'True',
	'examine the following statements: insert into emps select * from employees; -- 107 rows inserted. savepoint ins_done; delete employees; -- 107 rows deleted savepoint del_done; update emps set last_name = \\\'smith\\\'; how would you undo the last update only?':
		'ROLLBACK to SAVEPOINT Del_Done',
	'examine the following statements: insert into emps select * from employees; -- 107 rows inserted. savepoint ins_done; create index emp_lname_idx on employees(last_name); update emps set last_name = \\\'smith\\\'; what happens if you issue a rollback statement?':
		'The update of last_name is undone, but the insert was committed by the CREATE INDEX statement.',
	'which sql statement is used to remove all the changes made by an uncommitted transaction?':
		'ROLLBACK',
	'you need not worry about controlling your transactions. oracle does it all for you.':
		'False',
	'when you logout of oracle, your data changes are automatically rolled back.':
		'False',
	'user bob\\\'s customers table contains 20 rows. bob inserts two more rows into the table but does not commit his changes. user jane now executes: select count(*) from bob.customers; what result will jane see?':
		'20',
	'which of the following best describes the term "read consistency"?':
		'It prevents other users from seeing changes to a table until those changes have been committed',
	'a transaction makes several successive changes to a table. if required, you want to be able to rollback the later changes while keeping the earlier changes. what must you include in your code to do this?':
		'A savepoint',
	'if a database crashes, all uncommitted changes are automatically rolled back.':
		'True',
	'if userb has privileges to see the data in a table, as soon as usera has entered data into that table, userb can see that data.':
		'False',

	// Additional QA from screenshot (2026-06-05)
	'what kinds of transactions should you test against your tables and views?':
		'INSERT, UPDATE, DELETE, MERGE',
	'a software verification and validation method.':
		'Unit testing',
	'unit testing is done prior to a database going into production to ensure a random number of business requirements functions properly.':
		'False',
	'unit testing may be a composite of many different possible cases, or approaches, a user would opt to execute a transaction.':
		'True',

	// Final Exam Database Programming With SQL — DeniAce blog (2026-06-05)
	'delete statements can use correlated subqueries?':
		'True',
	'a table can have more than one unique key constraint.':
		'True',
	'alter user bob identified by jim;\\nwhich statement about the result of executing this statement is true?':
		'A new password is assigned to user BOB.',
	'which of the following sql statements will create a table called birthdays with three columns for storing employee number, name and date of birth?':
		'CREATE TABLE Birthdays (Empno NUMBER, Empname CHAR(20), Birthdate DATE);',
	'you are designing a table for the sales department. you need to include a column that contains each sales total. which data type should you specify for this column?':
		'NUMBER',
	'the data type of a column can never be changed once it has been created.':
		'False',

	'you can use drop column to drop all columns in a table, leaving a table structure with no columns.':
		'False',
	'evaluate this statement: delete from customer; which statement is true?':
		'The statement deletes all the rows from the CUSTOMER table.',
	'rename old_name to new_name can be used to:':
		'Rename a table.',
	'which of the following statements best describes indexes and their use?':
		'They contain the column value and pointers to the data in the table, but the data is sorted.',
	'examine the structure of the employees table: employee_id number(9) primary key last_name varchar2(25) first_name varchar2(25) department_id number(9) manager_id number(9) salary number(7,2) you have been instructed to create an index on the last_name column of the employees table. the index should not be unique. which statement should you use?':
		'CREATE INDEX emp_lname_idx ON employees(last_name);',

	'which of the following is true regarding simple views?':
		'Simple views can be used to perform DML operations.',

	'you need to create a view that will display the name, employee identification number, first and last name, salary, and department identification number. the display should be sorted by salary from lowest to highest, then by last name and first name alphabetically. the view definition should be created regardless of the existence of the employees table. no dml may be performed when using this view. evaluate these statements:\\n\\ncreate or replace noforce view emp_salary_v\\nas select employee_id, last_name, first_name, salary, department_id\\nfrom employees with read only;\\nselect *\\nfrom emp_salary_v\\norder by salary, last_name, first_name;\\n\\nwhich statement is true?':
		'The CREATE VIEW statement will fail if the EMPLOYEES table does not exist.',
} satisfies OracleQaBank;



