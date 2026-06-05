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
	'A specialized type of software, which controls and manages the hardware in a computer system.':
		'Operating System',

	'Personal computers (PCs) have been in existence since 1950.': 'False',

	'The overall mission of the Oracle Corporation is to use the internet and fast processing servers to build its own network.':
		'False',

	'Users could directly interact with which of the following software to access essential business applications? (Choose three)':
		'GUI software|Internet Browser software|Operating System software',

	'Software cannot operate without Hardware. True or False?': 'True',

	'Consider your school library. It will have a database with transaction details of the books that are borrowed by students. Is the total number of books out on loan in one given month considered Data or Information?':
		'Information',

	'Information which was gained from data is the same as: (Choose Two)':
		'Intelligence|Knowledge',

	'Consider your school library. It will have a database with transaction details of the books that are borrowed by students. Is a detail of one student borrowing one book considered Data or Information?':
		'Data',

	'The work of E.F. Codd in the early 1970s led to the development of Relational databases. True or False?':
		'True',

	'SQL became the most commonly used query language in the 1980s. True or False?':
		'True',

	'Which of the following represents the correct sequence of steps in the Database Development Process?':
		'Analyze, Design, Build',

	'The market for IT professionals is still increasing and will continue to do so in the future as the world gets ever more dependent on computer systems. True or False?':
		'True',

	'The main subject areas taught by the Oracle Academy are:':
		'Data Modeling, SQL, and PL/SQL',

	"The demand for Information Technology professionals in today's market is increasing. True or False?":
		'True',

	'Once you have learned how to write programs and build systems, you no longer need any input or involvement from any users as you are perfectly capable of delivering the systems that businesses need and want.':
		'False. Business requirements can and will change. For instance new legal requirements may arise.',

	'In the grid computing model, resources are pooled together for efficiency. True or False?':
		'True',

	'Data Modeling is the last step in the database development process. True or False?':
		'False',

	'Oracle was one of the first relational database systems available commercially. True or False?':
		'True',

	'Which term describes the physical components of a computer system?':
		'Hardware',

	'An Entity Relationship model is independent of the hardware or software used for implementation. True or False?':
		'True',

	'A well structured ERD will show only some parts of the finished data model. You should never try to model the entire system in one diagram, no matter how small the diagram might be. True or False?':
		'False',

	'The purpose of an ERD is to document the proposed system and facilitate discussion and understanding of the requirements captured by the developer. True or False?':
		'True',

	'Documenting Business Requirements helps developers control the scope of the system and prevents users from claiming that the new system does not meet their business requirements. True or False?':
		'True',

	'A Conceptual Model is not concerned with how the Physical Model will be implemented. True or False?':
		'True',

	'Data modeling is performed for the following reasons: (Choose Two)':
		'It helps discussions and reviews., The ERD becomes a blueprint for designing the actual system.',

	'Which of the following entities most likely contains valid attributes? (Choose two)':
		'Entity: Home. Attributes: Number of Bedrooms, Owner, Address, Date Built|Entity: Pet. Attributes: Name, Birthdate, Owner',

	'Which of the following are examples of ENTITY: Instance ? (Choose Two)':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',

	'8. Which of the following are examples of ENTITY: Instance ? (Choose Two)':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',

	'Which of the following are examples of ENTITY: Instance ? (Choose Two) Mark for Review':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',

	'Which of the following are examples of ENTITY: Instance? (Choose Two)':
		'ANIMAL: Dog, TRANSPORTATION METHOD: Car',

	'Unique Identifiers:':
		'Distinguish one instance of an entity from all other instances of that entity',

	'10. Unique Identifiers: Mark for Review':
		'Distinguish one instance of an entity from all other instances of that entity',

	'Unique Identifiers…':
		'Distinguish one instance of an entity from all other instances of that entity',

	'Which of the following statements about Entities are true?':
		'"Something" of significance to the business about which data must be known., They are usually a noun., A name for a set of similar "things"',

	'In the following statements, find two good examples of ENTITY: Instance. (Choose Two)':
		'BOOK: Biography of Mahatma Gandhi, DAIRY PRODUCT: milk',

	'A/an _________ is a piece of information that in some way describes an entity. It is a property of the entity and it quantifies, qualifies, classifies, or specifies the entity.':
		'Attribute',

	'The word "Volatile" means:': 'Changing constantly; unstable',

	'Entities are usually verbs. True or False?': 'False',

	'Attributes can only have one value at any point for each instance in the entity. True or False?':
		'True',

	"A/an _________'s value can be a number, a character string, a date, an image, a sound":
		'Attribute',

	'What is the purpose of a Unique Identifier?':
		'To identify one unique instance of an entity by using one or more attributes and/or relationships.',

	'Which of the following attributes is suitable to be a Unique Identifier?':
		'Social Security Number',

	'Which of the following can be found in an ERD? (Choose Two)':
		'Entities., Attributes.',

	'Data models show users the data that their Physical Model will contain. True or False?':
		'True',

	'Many reasons exist for creating a conceptual model. Choose three appropriate reasons from the options below.':
		'They capture current and future needs., They accurately describe what a physical model will contain., They model functional and informational needs.',

	'Data models are drawn to show users the actual Data that their new system will contain; only Data listed on the Diagram can be entered into the Database. True or False?':
		'True',

	"Which of the following statements about ERD's is false?":
		'Model all information that is derivable from other information already modeled.',

	'An ERD is an example of a Physical Model. True or False?': 'False',

	"Which of the following statements are true about ERD's? (Choose Two)":
		'You should not model derivable data., A piece of information should only be found in one place on an ERD.',

	'Which of the following statements about attributes are true?':
		'They have a data type, such as number or character string.|They must be single valued.|They describe, qualify, quantify, classify, or specify an entity.',

	'All of the following could be attributes of an ENTITY called PERSON, except which one?':
		'Natacha Hansen',

	'All of the following would be instances of the entity PERSON except which?':
		'Male',

	'All of the following would be instances of the entity ANIMAL SPECIES, except which one?':
		'Leaf',

	'Which of the following is an example of a volatile attribute?': 'Age',

	'A/an _________ is defined as "Something" of significance to the business about which data must be known.':
		'Entity',

	'Entity Relationship modeling is dependent on the hardware or software used for implementation, so you will need to change your ERD if you decide to change Hardware Vendor. True or False?':
		'False',

	'The Physical Model is derived from the Conceptual Model. True or False?':
		'True',

	'Which of the following are examples of e-businesses that use database software?':
		'Online clothing store, Online book store, Online personal shopping service',

	'Businesses involved in any of the following typically use databases to handle their data: Finance, Logistics, Commerce, Procurement, and Distribution? True or False?':
		'True',

	// Full text for the long “Changes in computing…” prompt (with appended examples)
	'Changes in computing have affected many of our day-to-day activities. Are all of the following activities examples of this change? Yes or No? In the past you used to use the phone system to call directory assistance to get a phone number. Today you can use your PC to look up a phone number online. In the past you used to have to go to the shoe store to buy shoes. Today you can use your PC to order shoes online. In the past you had to use your PC to send a person an email. Today you can use your phone to send a text message.':
		'Yes',

	"What is the difference between 'information' and 'data'?":
		'Data turns into useful information. It is stored in a database and accessed by systems and users.',
	'What is the difference between "information" and "data"?':
		'Data turns into useful information. It is stored in a database and accessed by systems and users.',
	'What is the difference between "information" and "data"? Mark for Review':
		'Data turns into useful information. It is stored in a database and accessed by systems and users.',

	'Entities are transformed into Tables during the Database Design process. True or False?':
		'True',

	'Which of the following are examples of data becoming information:':
		'A, B, and D',

	"How do you turn 'data' into 'information'?":
		'By querying it or accessing it',

	'How do you turn "data" into "information"? Mark for Review':
		'By querying it or accessing it',

	// Section 3 relationship / ERD questions
	'Relationships can be either mandatory or optional. True or False?': 'True',
	'In a business that sells pet food, choose the best relationship name between food type and animal (e.g. dog, horse, or cat). (choose two)':
		'Each FOOD TYPE must be suitable for one or more ANIMALs.|Each FOOD TYPE may be given to one or more ANIMALs.',
	'One relationship can be mandatory in one direction and optional in the other direction. True or False?':
		'True',
	'Which of the following are used to show cardinality on an erd? (choose two)':
		"Crow's foot.|Single toe.",
	'Which of the following are true about cardinality? (choose two)':
		'Cardinality tells "how many".|Cardinality specifies only singularity or plurality, but not a specific plural number.',
	'Which symbol is used to show that a particular attribute is mandatory?':
		'*',
	'Entity boxes are drawn as': 'Soft Boxes',
	'ERDish describes a relationship in words. True or False?': 'True',
	'Which of the following are used to show a relationship on an erd? (choose three)':
		"Dashed line.|Crow's foot.|Solid line.",
	'When reading a relationship between 2 entities, the relationship is read both from left to right and right to left. True or False?':
		'True',
	'Relationship names are not shown on an erd. True or False?': 'False',
	'Matrix diagrams show optionality and cardinality of the erds they document. True or False?':
		'False',
	'Matrix diagrams are developed before the erd. True or False?': 'True',
	'Matrix diagrams are used to verify that all relationships have been identified for an erd. True or False?':
		'True',
	'When reading the relationships in an erd, you are said to be speaking:':
		'ERDish',
	'Relationships always exist between':
		'2 entities (or one entity and itself)',
	'To identify an attribute as part of a unique identifier on an er diagram, the # symbol goes in front of it. True or False?':
		'True',
	'Entity names are always singular. True or False?': 'True',
	'Which of the following are true about relationship optionality? (choose two)':
		'Optionality answers "may or must".|Optionality specifies whether something is required or not.',
	'Which of the following are true about relationship optionality? (choose two) mark for review':
		'Optionality answers "may or must".|Optionality specifies whether something is required or not.',
	'Which of the following are used to show cardinality on an erd? (choose two) mark for review':
		"Single toe.|Crow's foot.",
	'Relationship cardinality is important. True or False?': 'True',
	'What are the three properties that every relationship should have? mark for review':
		'Name, optionality, cardinality',
	'Which of the following are used to show a relationship on an erd? (choose three) mark for review':
		"Crow's foot.|Solid line.|Dashed line.",

	'Most of the well known Internet search engines use databases to store data. True or False?':
		'True',

	// Section 4 – Business rules, constraints, subtypes/supertypes
	'S4 A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by:':
		'Creating additional programming code to identify and report accounts past due.',
	'S4 A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by: Mark for Review':
		'Creating additional programming code to identify and report accounts past due.',
	'S4 A business rule such as "We only ship goods after customers have completely paid any outstanding balances on their account" is best enforced by:':
		'Creating additional programming code to verify no goods are shipped until the account has been settled in full.',
	'S4 How should you handle constraints that cannot be modeled on an ER diagram?':
		'List them on a separate document to be handled programmatically',
	'S4 Which of the following is an example of a structural business rule?':
		'All employees must belong to at least one department.',
	'S4 Can all constraints be modeled on an ER diagram?':
		'No, and those that cannot be modeled should be listed on a separate document to be handled programmatically',
	'S4 Why is it important to identify and document business rules?':
		'It allows you to create a complete data model and then check it for accuracy.',
	'S4 How would you model a business rule that states that girls and boys may not attend classes together?':
		'Supertype STUDENT has two subtypes BOY and GIRL which are related to GENDER, which is related to CLASS',
	'S4 A subtype can have a relationship not shared by the supertype. True or False?':
		'True',
	'S4 A subtype is drawn on an ERD as an entity inside the softbox of the supertype. True or False?':
		'True',
	'S4 A subtype is shown on an ERD as an entity with a one to many relationship to the supertype. True or False?':
		'False',
	'S4 Which of the following is true about subtypes?':
		'Subtypes must be mutually exclusive.',
	'S4 All instances of a subtype must be an instance of the supertype. True or False?':
		'True',
	'S4 A supertype can only have two subtypes and no more. True or False?':
		'False',
	'S4 You can only create relationships to a Supertype, not to a Subtype. True or False?':
		'False',
	'S4 A Supertype can have only one subtype. True or False?': 'False',
	"S4 How would you model a business rule that states that on a student's birthday, he does not have to attend his classes?":
		'You cannot model this. You need to document it',
	'S4 A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False?':
		'True',
	'S4 Why is it important to identify and document structural rules?':
		'Ensures we know what data to store and how that data works together.',
	'S4 All instances of the supertype must be an instance of one of the subtypes. True or False?':
		'True',
	'S4 All instances of a subtype may be an instance of the supertype but does not have to. True or False?':
		'False',
	'S4 All ER diagrams must have one of each of the following: (Choose two)':
		'One or more Entities|Relationships between entities',
	'S4 All instances of a subtype must be an instance of the supertype. True or False? Mark for Review':
		'True',
	'S4 How should you handle constraints that cannot be modeled on an ER diagram? Mark for Review':
		'List them on a separate document to be handled programmatically',
	'S4 Why is it important to identify and document business rules? Mark for Review':
		'It allows you to create a complete data model and then check it for accuracy.',
	'S4 A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False? Mark for Review':
		'True',
	'S4 Which of the following is an example of a structural business rule? Mark for Review':
		'All employees must belong to at least one department.',
	'S4 A subtype can have a relationship not shared by the supertype. True or False? Mark for Review':
		'True',
	'S4 Which of the following is true about subtypes? Mark for Review':
		'Subtypes must be mutually exclusive.',
	'S4 All ER diagrams must have one of each of the following: (Choose two) Mark for Review':
		'One or more Entities|Relationships between entities',

	// Section 5 – Relationships, redundancy, transferability, intersection entities
	'Relationships can be Redundant. True or False?': 'True',
	'If two entities have two relationships between them, these relationships can be either _____________ or _____________.':
		'Redundant or Required',
	'What uncommon relationship is described by the statements: "Each DNA SAMPLE may be taken from one and only one PERSON and each PERSON may provide one and only one DNA SAMPLE"':
		'One to One Optional',
	'What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER"':
		'One to Many',
	'If the same relationship is represented twice in an Entity Relationship Model, it is said to be:':
		'Redundant',
	'A non-transferable relationship is represented by which of the following symbols?':
		'Diamond',
	'If a relationship can NOT be moved between instances of the entities it connects, it is said to be:':
		'Non-Transferable',
	'Every ERD must have at least one non-transferable relationship. True or False?':
		'False',
	'Non-transferable relationships can only be mandatory, not optional. True or False?':
		'False',
	'Which of the following is an example of a non-transferable relationship':
		'PERSON to BIRTH PLACE',
	'When you resolve a M:M by creating an intersection entity, this new entity will always inherit:':
		'A relationship to each entity from the original M:M.',
	'What do you call the entity created when you resolve a M:M relationship?':
		'Intersection entity',
	'Intersection Entities often have the relationships participating in the UID, so the relationships are often barred. True or False?':
		'True',
	'When you resolve a M:M, you simply re-draw the relationships between the two original entities; no new entities are created. True or False?':
		'False',
	'A relationship on an ERD can have attributes. True or False?': 'False',

	'1. If a relationship can NOT be moved between instances of the entities it connects, it is said to be:':
		'Non-Transferable',
	'2. Every ERD must have at least one non-transferable relationship. True or False?':
		'False',
	'3. If a relationship can be moved between instances of the entities it connects, it is said to be:':
		'Transferable',
	'4. Non-transferable relationships can only be mandatory, not optional. True or False?':
		'False',
	'5. A non-transferable relationship means the relationship is manatory at both sides. True or False?':
		'False',
	'6. If two entities have two relationships between them, these relationships can be either _____________ or _____________. Mark for Review':
		'Redundant or Required',
	'7. If the same relationship is represented twice in an Entity Relationship Model, it is said to be: Mark for Review':
		'Redundant',
	'8. Which of the following pairs of entities is most likely to be modeled as a 1:1 relationship?':
		'PERSON and FINGERPRINT',
	'9. Which of the following pairs of entities is most likely to be modeled as a M:M relationship?':
		'TEACHER and SUBJECT AREA',
	'10. One to many relationships are the most uncommon type of relationships in an ERD. True or False?':
		'False',
	'11. A barred relationship on an ERD signifies that the UID of the intersection entity is inherited from the entities that made up the original many to many relationship. True or False?':
		'True',
	'12. Many to many relationships between entities usually hide what?':
		'Another entity',
	'13. If an intersection entity is formed that contains no attributes of its own, its uniqueness may be modeled by':
		'Barring the relationships to the original entities.',
	'14. A Diamond on a relationship indicates the Relationship as Non-Tranferable. True or False?':
		'True',
	'15. A relationship can be moved between instances of the entities it connects is said to be:':
		'Transferable',

	'Many to many relationships must be left in the Model. It is important to have them documented as M-M. True or False?':
		'False',
	'2. What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER"':
		'One to Many',
	'3. If the same relationship is represented twice in an Entity Relationship Model, it is said to be:':
		'Redundant',
	'4. One to many relationships are the most uncommon type of relationships in an ERD. True or False?':
		'False',
	'5. Which of the following pairs of entities is most likely to be modeled as a M:M relationship?':
		'TEACHER and SUBJECT AREA',
	'6. A Diamond on a relationship indicates the Relationship as Non-Tranferable. True or False?':
		'True',
	'7. Every ERD must have at least one non-transferable relationship. True or False? Mark for Review':
		'False',
	'8. If a relationship can NOT be moved between instances of the entities it connects, it is said to be: Mark for Review':
		'Non-Transferable',
	'9. The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False?':
		'True',
	'10. If a relationship can be moved between instances of the entities it connects, it is said to be: Mark for Review':
		'Transferable',
	'11. When you resolve a M:M by creating an intersection entity, this new entity will always inherit: Mark for Review':
		'A relationship to each entity from the original M:M.',
	'12. When you resolve a M:M, you simply re-draw the relationships between the two original entities; no new entities are created. True or False? Mark for Review':
		'False',
	'13. Many to many relationships between entities usually hide what? Mark for Review':
		'Another entity',
	'14. A barred relationship on an ERD signifies that the UID of the intersection entity is inherited from the entities that made up the original many to many relationship. True or False? Mark for Review':
		'True',
	'15. Intersection Entities often have the relationships participating in the UID, so the relationships are often barred. True or False? Mark for Review':
		'True',

	'1. When you resolve a M:M by creating an intersection entity, this new entity will always inherit: Mark for Review':
		'A relationship to each entity from the original M:M.',
	'2. What do you call the entity created when you resolve a M:M relationship? Mark for Review':
		'Intersection entity',
	'3. Many to many relationships between entities usually hide what? Mark for Review':
		'Another entity',
	'4. A relationship on an ERD can have attributes. True or False? Mark for Review':
		'False',
	'5. If an intersection entity is formed that contains no attributes of its own, its uniqueness may be modeled by Mark for Review':
		'Barring the relationships to the original entities.',
	'6. Non-transferable relationships can only be mandatory, not optional. True or False? Mark for Review':
		'False',
	'7. The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False? Mark for Review':
		'True',
	'8. A non-transferable relationship means the relationship is manatory at both sides. True or False? Mark for Review':
		'False',
	'9. Which of the following pairs of entities is most likely to be modeled as a 1:1 relationship? Mark for Review':
		'PERSON and FINGERPRINT',
	'12. What uncommon relationship is described by the statements: "Each DNA SAMPLE may be taken from one and only one PERSON and each PERSON may provide one and only one DNA SAMPLE" Mark for Review':
		'One to One Optional',
	'13. Which of the following pairs of entities is most likely to be modeled as a M:M relationship? Mark for Review':
		'TEACHER and SUBJECT AREA',
	'14. What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER" Mark for Review':
		'One to Many',
	'15. Many to many relationships must be left in the Model. It is important to have them documented as M-M. True or False? Mark for Review':
		'False',
	'A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by:':
		'Creating additional programming code to identify and report accounts past due.',
	'A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by: Mark for Review':
		'Creating additional programming code to identify and report accounts past due.',
	'A business rule such as "We only ship goods after customers have completely paid any outstanding balances on their account" is best enforced by:':
		'Creating additional programming code to verify no goods are shipped until the account has been settled in full.',
	'How should you handle constraints that cannot be modeled on an ER diagram?':
		'List them on a separate document to be handled programmatically',
	'Which of the following is an example of a structural business rule?':
		'All employees must belong to at least one department.',
	'Can all constraints be modeled on an ER diagram?':
		'No, and those that cannot be modeled should be listed on a separate document to be handled programmatically',
	'Why is it important to identify and document business rules?':
		'It allows you to create a complete data model and then check it for accuracy.',
	'How would you model a business rule that states that girls and boys may not attend classes together?':
		'Supertype STUDENT has two subtypes BOY and GIRL which are related to GENDER, which is related to CLASS',
	'A subtype can have a relationship not shared by the supertype. True or False?':
		'True',
	'A subtype is drawn on an ERD as an entity inside the softbox of the supertype. True or False?':
		'True',
	'A subtype is shown on an ERD as an entity with a one to many relationship to the supertype. True or False?':
		'False',
	'Which of the following is true about subtypes?':
		'Subtypes must be mutually exclusive.',
	'All instances of a subtype must be an instance of the supertype. True or False?':
		'True',
	'A supertype can only have two subtypes and no more. True or False?':
		'False',
	'You can only create relationships to a Supertype, not to a Subtype. True or False?':
		'False',
	'A Supertype can have only one subtype. True or False?': 'False',
	"How would you model a business rule that states that on a student's birthday, he does not have to attend his classes?":
		'You cannot model this. You need to document it',
	'A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False?':
		'True',
	'Why is it important to identify and document structural rules?':
		'Ensures we know what data to store and how that data works together.',
	'All instances of the supertype must be an instance of one of the subtypes. True or False?':
		'True',
	'All instances of a subtype may be an instance of the supertype but does not have to. True or False?':
		'False',
	'All ER diagrams must have one of each of the following: (Choose two)':
		'One or more Entities|Relationships between entities',
	'All instances of a subtype must be an instance of the supertype. True or False? Mark for Review':
		'True',
	'How should you handle constraints that cannot be modeled on an ER diagram? Mark for Review':
		'List them on a separate document to be handled programmatically',
	'Why is it important to identify and document business rules? Mark for Review':
		'It allows you to create a complete data model and then check it for accuracy.',
	'A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False? Mark for Review':
		'True',
	'Which of the following is an example of a structural business rule? Mark for Review':
		'All employees must belong to at least one department.',
	'A subtype can have a relationship not shared by the supertype. True or False? Mark for Review':
		'True',
	'Which of the following is true about subtypes? Mark for Review':
		'Subtypes must be mutually exclusive.',
	'All ER diagrams must have one of each of the following: (Choose two) Mark for Review':
		'One or more Entities|Relationships between entities',
	'A subtype is drawn on an ERD as an entity inside the "softbox" of the supertype. True or False?':
		'True',

	'If two entities have two relationships between them, these relationships can be either _____________ or _____________ .':
		'Redundant or Required',

	'The word "Volatile" means…': 'Changing constantly; unstable',

	'Attributes can be either mandatory or optional. True or False?': 'True',

	// Section 6 - Normalization and UIDs (prefixed to avoid key clashes)
	'S6 Q1 Examine ENTITY CLIENT (#CLIENT ID, FIRST NAME, LAST NAME, STREET, CITY, ZIP CODE) – which normal form rule is violated?':
		'None of the above, the entity is fully normalised.',
	'S6 Q2 A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity.':
		'True',
	'S6 Q3 When any attribute in an entity is dependent on any other non-UID attribute in that entity, this is known as:':
		'Transitive dependency',
	'S6 Q4 The Rule of 3rd Normal Form states that no Non-UID attribute can be dependent on another non-UID attribute. True or False?':
		'True',
	'S6 Q5 Normalizing an Entity to 1st Normal Form is done by removing any attributes that contain multiple values. True or False?':
		'True',
	'S6 Q6 When all attributes are single-valued, the database model conforms to:':
		'1st Normal Form',
	'S6 Q7 If an entity has a multi-valued attribute, to conform to 1st Normal Form we:':
		'Create an additional entity and relate it to the original entity with a 1:M relationship.',
	'S6 Q8 When data is only stored in one place in a database, the database conforms to the rules of ___________.':
		'Normalization',
	"S6 Q9 There is no limit to how many columns can make up an entity's UID. True or False?":
		'True',
	'S6 Q10 If an entity has no attribute suitable to be a Primary UID, we can create an artificial one. True or False?':
		'True',
	'S6 Q11 A unique identifier can only be made up of one attribute. True or False?':
		'False',
	'S6 Q12 An entity can only have one Primary UID. True or False?': 'True',
	'S6 Q13 To resolve a 2nd Normal Form violation, we:':
		'Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.',
	'S6 Q14 RECEIPT (#CUSTOMER ID, #STORE ID, STORE LOCATION, DATE) – make it conform to 2nd NF by:':
		'Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.',
	'S6 Q15 Any Non-UID attribute must be dependent upon the entire UID. True or False?':
		'True',

	'S6 Q16 Suitable UIDs for EMPLOYEE (Choose Two)':
		'Social Security Number|Employee ID',
	'S6 Q17 CLIENT (#CLIENT ID, FIRST NAME, LAST NAME, ORDER ID, STREET, ZIP CODE) – which normal form is violated?':
		'1st Normal Form.',
	'S6 Q18 CLIENT ORDER (#CLIENT ID, #ORDER ID, FIRST NAME, LAST NAME, ORDER DATE, CITY, ZIP CODE) – which normal form is violated?':
		'2nd Normal Form.',
	'S6 Q19 An entity can have repeated values and still be in 1st Normal Form. True or False?':
		'False',
	'S6 Q20 When data is only stored in one place in a database, the database conforms to the rules of ___________. (variant)':
		'Normalization',

	'S6 Q21 As a database designer, you do not need to worry about where you store an attribute; as long as it is on the ERD, the job is done. True or False?':
		'False',
	'S6 Q22 The candidate UID chosen to identify an entity is called the Primary UID; other candidate UIDs are called Secondary UIDs.':
		"Yes, this is the way UID's are named.",
	'S6 Q23 Where an entity has more than one attribute suitable to be the Primary UID, these are known as _____________ UIDs.':
		'Candidate',
	'S6 Q24 A candidate UID that is not chosen to be the Primary UID is called:':
		'Secondary',
	'S6 Q25 What is the rule of Second Normal Form?':
		'All non-UID attributes must be dependent upon the entire UID.',
	'S6 Q26 RECEIPT (#CUSTOMER ID, #STORE ID, STORE LOCATION, DATE) – which attribute breaks 2nd NF?':
		'STORE LOCATION',
	'S6 Q27 When is an entity in 2nd Normal Form?':
		'When all non-UID attributes are dependent upon the entire UID.',
	'S6 Q28 ORDER (Order ID, Order Date, Product id, Customer ID) is in 1st Normal Form. True or False?':
		'False',
	'S6 Q29 To convert an entity with a multi-valued attribute to 1st Normal Form we create an additional entity and relate it to the original entity with a 1:1 relationship. True or False?':
		'False',
	'S6 Q30 A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity. (variant)':
		'True',

	// Section 8 - Time, historical data, readability
	'S8 Q1 Which scenarios should be modeled so that historical data is kept? (Choose two) BABY and AGE / CUSTOMER and ORDERS / TEACHER and AGE / CUSTOMER and PAYMENTS':
		'CUSTOMER and ORDERS|CUSTOMER and PAYMENTS',
	'S8 Q2 When modeling historical data the unique identifier is always made up of a barred relationship from the original two entities. True or False?':
		'False',
	'S8 Q3 Which scenarios should be modeled so that historical data is kept? (Choose two) LIBRARY and BOOK / STUDENT and GRADE / STUDENT and AGE / LIBRARY and NUMBER OF BOOKS':
		'LIBRARY and BOOK|STUDENT and GRADE',
	'S8 Q4 Which statements enhance ERD readability? (Choose Two)':
		'Avoid crossing one relationship line with another.|It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system.',
	'S8 Q5 No formal rules exist for drawing ERDs; clarity is key. True or False?':
		'True',
	'S8 Q6 You must make sure all entities fit onto one diagram. True or False?':
		'False',
	'S8 Q7 Formal rules exist for drawing ERDs; follow them even if hard to read. True or False?':
		'False',
	'S8 Q8 All systems must include functionality to provide logging or journaling in conceptual data models. True or False?':
		'False',
	'S8 Q9 Logical constraint with time for ASSIGNMENT/EMPLOYEE':
		'An ASSIGNMENT may only refer to an EMPLOYEE with a valid employee record at the Start Date of the ASSIGNMENT.',
	'S8 Q10 Function of logging/journaling in conceptual data models':
		'Allows you to track the history of attribute values, relationships, and/or entire entities',
	'S8 Q11 How do you know when to use different types of time in your design?':
		'It depends on the functional needs of the system.',
	'S8 Q12 Logical constraint when modeling time for a country entity':
		'Countries may change their names and/or borders over a period of time.',
	'S8 Q13 In a payroll system, desirable to have a DAY entity with holiday attribute. True or False?':
		'True',
	'S8 Q14 Modeling historical data is optional. True or False?': 'True',
	'S8 Q15 When a relationship may or may not be transferable depending on time, this is known as a/an':
		'Conditional Non-transferable Relationship.',

	'S8 Q16 Group entities according to volume to ease readability. True or False?':
		'True',
	'S8 Q17 Modeling historical data can produce a UID that includes a date. True or False?':
		'True',
	'S8 Q18 In a payroll system, DAY entity with holiday attribute. True or False? (repeat)':
		'True',
	'S8 Q19 Logical constraint when modeling time for a City entity':
		'Cites may change their names and/or country association if the borders of a country change.',
	'S8 Q20 Adding the concept of time makes the model more complex. True or False?':
		'True',
	'S8 Q21 If you have an entity with a DATE attribute and other date characteristics, create a DAY entity. True or False?':
		'True',
	'S8 Q22 Delivery charge varies by weekday; best modeling approach':
		'Use a Delivery Day entity, which holds prices against week days, and ensure we also have an attribute for the Requested Delivery Day in the Order Entity.',
	'S8 Q23 Why model time when selling gold bars?':
		'The price of gold fluctuates and, to determine the current price, you need to know the time of purchase.',
	'S8 Q24 Historical data must never be kept. True or False?': 'False',
	'S8 Q25 If you want to keep changing prices over time for products, best modeling approach':
		'Both A and C',
	'S8 Q26 High-volume entities grouping improves readability. True or False?':
		'True',
	'S8 Q27 No point in grouping entities; readability is a waste. True or False?':
		'False',
	'S8 Q28 ERD readability: crows feet consistent direction and no crossing lines. True or False?':
		'True',
	'S8 Q29 Time-aware constraint for country (variant)':
		'Countries may change their names and/or borders over a period of time.',
	'S8 Q30 Time-aware constraint for city (variant)':
		'Cites may change their names and/or country association if the borders of a country change.',

	// Section 9 - Physical design, arcs, subtypes, constraints (S9 prefix to avoid collisions)
	'S9 Q1 Arc to physical design: make FKs optional and add check so only one FK populated (Exclusive)':
		'Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not',
	'S9 Q2 Valid reason for subtype implementation':
		'Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.',
	'S9 Q3 Subtype FK columns become mandatory. True or False?': 'False',
	'S9 Q4 Why 1_TABLE not allowed in Oracle':
		'Object names must not start with a number. They must begin with a letter.',
	"S9 Q5 Why 'EMPLOYEE JOBS' not allowed in Oracle":
		'You cannot have spaces between words in a table name',
	'S9 Q6 Why table name this_year_end+next_year invalid':
		'The Plus sign + is not allowed in object names.',
	'S9 Q7 In physical model, an attribute becomes a ______.': 'Column',
	'S9 Q8 To resolve M:M in physical model create': 'Intersection table',
	'S9 Q9 When an Arc is transformed every relationship becomes mandatory FK. True or False?':
		'False',
	'S9 Q10 Oracle DB can implement M:M by two FKs directly. True or False?':
		'False',
	'S9 Q11 Barred relationship FK is part of': 'The Primary Key',
	'S9 Q12 Column integrity refers to':
		'Columns always containing values consistent with the defined data format',
	'S9 Q13 Constraint type: column must contain only values consistent with defined data format':
		'Column integrity',
	'S9 Q14 Incorrect statements about primary key (choose three)':
		'Only one column that must be null.|A single column that uniquely identifies each column in a table.|A set of columns in one table that uniquely identifies each row in another table.',
	'S9 Q15 Correct statements about primary key (choose three)':
		'A set of columns and keys in a single table that uniquely identifies each row in a single table|A single column that uniquely identifies each row in a table|A set of columns that uniquely identifies each row in a table',

	'S9 Q16 FK cannot be null when': 'It is part of a primary key',
	'S9 Q17 Arc Implementation synonym for':
		'Supertype and Subtype Implementation',
	'S9 Q18 Physical model is created by transforming which model':
		'Conceptual',
	'S9 Q19 Relationships at subtype level implemented as optional FKs. True or False?':
		'True',
	'S9 Q20 Optional-to-mandatory 1:M becomes ______ on master table':
		'Optional Foreign Key',
	'S9 Q21 One-to-One relationships transform into FK at either end. True or False?':
		'False',
	'S9 Q22 A table must have a primary key. True or False?': 'False',
	'S9 Q23 Entity ORDER (Order ID, Order Date, Product id, Customer ID) is in 1NF. True or False?':
		'False',
	'S9 Q24 Constraint type: PK must be unique and not null':
		'Entity integrity',
	'S9 Q25 Referential integrity example dept_no matches departments':
		'Referential integrity',
	'S9 Q26 Conceptual model to physical becomes relational DB. True or False?':
		'True',
	'S9 Q27 A foreign key always refers to a primary key in the same table. True or False?':
		'False',
	'S9 Q28 An "Arc Implementation" can be done just like any other Relationship by simply adding required FKs. True or False?':
		'False',
	'S9 Q29 Many to many resolved via intersection table. True or False?':
		'True',
	'S9 Q30 When transforming ERD, relationships can only become UIDs. True or False?':
		'False',

	// Section 7 – Arcs, recursive & hierarchical relationships
	'S7 Q1 Which of the following would best be represented by an arc? STUDENT ( University, Technical College)':
		'STUDENT ( University, Technical College)',
	"S7 Q2 Arcs are Mandatory in Data modeling. All ERD's must have at least one Arc. True or False?":
		'False',
	'S7 Q3 To visually represent exclusivity between two or more relationships in an ERD you would most likely use an ________.':
		'Arc',
	'S7 Q4 An arc can often be modeled as Supertype and Subtypes. True or False?':
		'True',
	'S7 Q5 Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office)':
		'DELIVERY ADDRESS (Home, Office)',
	'S7 Q6 All relationships participating in an arc must be mandatory. True or False?':
		'False',
	'S7 Q7 Every business has restrictions on which attribute values and which relationships are allowed. These are known as:':
		'Constraints.',
	'S7 Q8 Arcs are used to visually represent _________ between two or more relationships in an ERD.':
		'Exclusivity',
	'S7 Q9 Cascading UIDs are a feature often found in what type of Relationship?':
		'Heirarchical Relationship',
	'S7 Q10 A relationship between an entity and itself is called a/an:':
		'Recursive Relationship',
	'S7 Q11 A Recursive Relationship is represented on an ERD by a/an:':
		"Pig's Ear",
	'S7 Q12 A single relationship can be both Recursive and Hierarchical at the same time. True or False?':
		'False',
	'S7 Q13 Business organizational charts are often modeled as a Hierarchical relationship. True or False?':
		'True',
	'S7 Q14 A recursive relationship must be Mandatory at both ends. True or False?':
		'False',
	'S7 Q15 A Hierarchical relationship is a series of relationships that reflect entities organized into successive levels. True or False?':
		'True',

	'S7 Q16 A particular problem may be solved using either a Recursive Relationship or a Hierarchical Relationship, though not at the same time. True or False?':
		'True',
	'S7 Q17 Which of the following can be added to a relationship?':
		'An arc can be assigned',
	'S7 Q18 Arcs model an Exclusive OR constraint. True or False?': 'True',
	'S7 Q19 Which of the following would best be represented by an arc? STUDENT (senior, male / University, Technical College)':
		'STUDENT ( University, Technical College)',
	'S7 Q20 Which of the following pairs is most likely an arc example: DELIVERY ADDRESS (Home, Office)':
		'DELIVERY ADDRESS (Home, Office)',
	'S7 Q21 Arcs are used to visually represent exclusivity between two or more relationships in an ERD. True or False?':
		'True',
	'S7 Q22 Which of the following can be added to a relationship? (variant)':
		'An arc can be assigned',
	'S7 Q23 A single relationship can be both Recursive and Hierarchical at the same time. True or False? (variant)':
		'False',
	'S7 Q24 The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False? (hierarchy topic overlap)':
		'True',
	'S7 Q25 Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office) Mark for Review':
		'DELIVERY ADDRESS (Home, Office)',

	'Which of the following would be suitable UIDs for the entity EMPLOYEE: (Choose Two)':
		'Employee ID | Social Security Number',

	'When all attributes are single-valued, the database model is said to conform to:':
		'1st Normal Form',

	'A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity. True or False?':
		'True',

	'When data is stored in more than one place in a database, the database violates the rules of ___________.':
		'Normalization',

	'Examine the following Entity and decide which sets of attributes break the 3rd Normal Form rule:':
		'DRIVER ID, DRIVER NAME',

	'Normalizing an Entity to 1st Normal Form is done by removing any attributes that contain muliple values. True or False?':
		'True',

	'People are not born with “numbers”, but a lot of systems assign student numbers, customer IDs, etc.  These are known as a/an ______________ UID.':
		'Artificial',

	'A single relationship can be both Recursive and Hierachal at the same time. True or False?':
		'False',

	'How do you know when to use the different types of time in your design?':
		'It depends on the functional needs of the system .',

	'There is no point in trying to group your entities together on your diagram according to volume, and making a diagram look nice is a waste of time. True or False?':
		'False',

	'You are doing a data model for a computer sales company where the price fluctuates on a regular basis. If you want to allow the company to modify the price and keep track of the changes, what is the best way to model this?':
		'E. Both A and C',

	'When a system requires that old values for attributes are kept on record, this is know as Journaling or Logging. True or False?':
		'True',

	"Formal rules exist for drawing ERD's. You must always follow them, even if it results in an ERD that is difficult to read. True or False?":
		'False',

	'There are no circumstances where you would create a DAY entity. True or False?':
		'False',

	'When you add the concept of time to your data model, your model becomes more complex. True or False?':
		'True',

	'Modeling historical data can produce a unique identifier that includes a date. True or False?':
		'True',

	"Which of the following statements are true for ERD's to enhance their readability. (Choose Two)":
		'It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system. | Avoid crossing one relationship line with another.',

	'You are doing a data model for a computer sales company where the price of postage depends upon the day of the week that goods are shipped. So shipping is more expensive if the customer wants a delivery to take place on a Saturday or Sunday. What would be the best way to model this?':
		'Use a Delivery Day entity, which holds prices against week days, and ensure the we also have an attribute for the Requested Delivery Day in the Order Entity.',

	'In a payroll system, it is desirable to have an entity called DAY with a holiday attribute when you want to track special holiday dates. True or False?':
		'True',

	// Section 6 - Normalization / UIDs (no prefixes)
	'Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ATTRIBUTES: # CLIENT ID FIRST NAME LAST NAME STREET CITY ZIP CODE':
		'None of the above, the entity is fully normalised.',
	'Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ATTRIBUTES: # CLIENT ID FIRST NAME LAST NAME ORDER ID STREET ZIP CODE':
		'1st Normal Form.',
	'Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ORDER ATTRIBUTES: # CLIENT ID # ORDER ID FIRST NAME LAST NAME ORDER DATE CITY ZIP CODE':
		'2nd Normal Form.',
	'A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity.':
		'True',
	'When any attribute in an entity is dependent on any other non-UID attribute in that entity, this is known as:':
		'Transitive dependency',
	'The Rule of 3rd Normal Form states that No Non-UID attribute can be dependent on another non-UID attribute. True or False?':
		'True',
	'If an entity has a multi-valued attribute, to conform to the rule of 1st Normal Form we:':
		'Create an additional entity and relate it to the original entity with a 1:M relationship.',
	'When data is only stored in one place in a database, the database conforms to the rules of ___________.':
		'Normalization',
	"There is no limit to how many columns can make up an entity's UID. True or False?":
		'True',
	'If an entity has no attribute suitable to be a Primary UID, we can create an artificial one. True or False?':
		'True',
	'A unique identifier can only be made up of one attribute. True or False?':
		'False',
	'An entity can only have one Primary UID. True or False?': 'True',
	'To resolve a 2nd Normal Form violation, we':
		'Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.',
	'Examine the following entity and decide how to make it conform to the rule of 2nd Normal Form: ENTITY: RECEIPT ATTRIBUTES: #CUSTOMER ID #STORE ID STORE LOCATION DATE':
		'Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.',
	'Any Non-UID attribute must be dependent upon the entire UID. True or False?':
		'True',

	// Section 7 - Arcs / recursive / hierarchical
	'Which of the following would best be represented by an arc? STUDENT ( University, Technical College)':
		'STUDENT ( University, Technical College)',
	"Arcs are Mandatory in Data modeling. All ERD's must have at least one Arc. True or False?":
		'False',
	'To visually represent exclusivity between two or more relationships in an ERD you would most likely use an ________.':
		'Arc',
	'An arc can often be modeled as Supertype and Subtypes. True or False?':
		'True',
	'Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office)':
		'DELIVERY ADDRESS (Home, Office)',
	'All relationships participating in an arc must be mandatory. True or False?':
		'False',
	'Every business has restrictions on which attribute values and which relationships are allowed. These are known as:':
		'Constraints.',
	'Arcs are used to visually represent _________ between two or more relationships in an ERD.':
		'Exclusivity',
	'Cascading UIDs are a feature often found in what type of Relationship?':
		'Heirarchical Relationship',
	'A relationship between an entity and itself is called a/an:':
		'Recursive Relationship',
	'A Recursive Relationship is represented on an ERD by a/an:': "Pig's Ear",
	'A single relationship can be both Recursive and Hierarchical at the same time. True or False?':
		'False',
	'Business organizational charts are often modeled as a Hierarchical relationship. True or False?':
		'True',
	'A recursive relationship must be Mandatory at both ends. True or False?':
		'False',
	'A Hierarchical relationship is a series of relationships that reflect entities organized into successive levels. True or False?':
		'True',

	// Section 8 - Time / historical data / readability extras
	'Which of the following scenarios should be modeled so that historical data is kept? (Choose two) CUSTOMER and ORDERS / CUSTOMER and PAYMENTS / TEACHER and AGE / BABY and AGE':
		'CUSTOMER and ORDERS|CUSTOMER and PAYMENTS',
	'Which of the following scenarios should be modeled so that historical data is kept? (Choose two) LIBRARY and BOOK / STUDENT and GRADE / STUDENT and AGE / LIBRARY and NUMBER OF BOOKS':
		'LIBRARY and BOOK|STUDENT and GRADE',
	'Modeling historical data is optional. True or False?': 'True',
	'When a relationship may or may not be transferable, depending on time, this is know as a/an:':
		'Conditional Non-transferable Relationship.',
	'Which of the following is a logical constraint when modeling time for a City entity?':
		'Cites may change their names and/or country association if the borders of a country change.',
	'If you have an entity with a DATE attribute, and other attributes that track characteristics of the date, you should create a DAY entity. True or False?':
		'True',
	'Which of the following would be a logical constraint when modeling time for a country entity?':
		'Countries may change their names and/or borders over a period of time.',
	'All systems must include functionality to provide logging or journaling in conceptual data models. True or False?':
		'False',
	'In an ERD, High Volume Entities usually have very few relationships to other entities. True or False?':
		'True',
	'All systems must have an entity called WEEK with a holiday attribute so that you know when to give employees a holiday. True or False?':
		'False',
	'Historical data must never be kept. True or False?': 'False',

	// Section 9 - Physical design, arcs, constraints
	'When translating an arc relationship to a physical design, you must turn the arc relationships into foreign keys. What additional step must you take with the created foreign keys to ensure the exclusivity principle of arc relationships? (Assume that you are implementing an Exclusive Design)':
		'Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not',
	'Which of the following is a valid reason for considering a Subtype Implementation?':
		'Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.',
	'When mapping supertypes, relationships at the supertype level transform as usual. Relationships at subtype level are implemented as foreign keys, but the foreign key columns all become mandatory. True or False?':
		'False',
	'In an Oracle database, why would 1_TABLE not work as a table name?':
		'Object names must not start with a number. They must begin with a letter.',
	"In an Oracle database, why would the following table name not be allowed 'EMPLOYEE JOBS'?":
		'You cannot have spaces between words in a table name',
	'Why would this table name NOT work in an Oracle database? this_year_end+next_year':
		'The Plus sign + is not allowed in object names.',
	'In a physical data model, an attribute becomes a _____________.': 'Column',
	'To resolve a many to many relationship in a physical model you create a(n) ___________________?':
		'Intersection table',
	'When an Arc is transformed to the physical model every relationship in the Arc becomes a mandatory Foreign Key. True or False?':
		'False',
	'The Oracle Database can implement a many to many relationship. You simply create two foreign keys between the two tables. True or False?':
		'False',
	'A barrred Relationship will result in a Foreign Key column that also is part of:':
		'The Primary Key',
	'Column integrity refers to':
		'Columns always containing values consistent with the defined data format',
	'A column must contain only values consistent with the defined data format of the column':
		'Column integrity',
	'Foreign keys cannot be null when': 'It is part of a primary key',
	'The "Arc Implementation" is a synonym for what type of implementation?':
		'Supertype and Subtype Implementation',
	'The Physical model is created by transforming which of the following models?':
		'Conceptual',
	'Relationships at the subtype level are implemented as foreign keys, but the foreign key columns all become optional. True or False?':
		'True',
	'One-to-Many Optional to Mandatory becomes a _______________ on the Master table.':
		'Optional Foreign Key',
	'A table does not have to have a primary key. True or False?': 'True',
	'A primary key must be unique, and no part of the primary key can be null.':
		'Entity integrity',
	'A foreign key always refers to a primary key in the same table. True or False?':
		'False',
	'The conceptual model is transformed into a physical model. The physical implementation will be a relational database. True or False?':
		'True',
	'Relationships on an ERD can only be transformed into UIDs in the physical model? True or False?':
		'False',
	'Attributes become columns in a database table. True or False?': 'True',

	'An Arc is transformed to the physical model by adding a foreign Key for every relationship in the Arc. True or False?':
		'True',

	'One-to-One relationships are transformed into Foreign Keys in the tables created at either end of that relationship. True or False?':
		'False',

	'The explanation below is an example of which constraint type?\nIf the value in the balance column of the ACCOUNTS table is below 100, we must send a letter to the account owner which will require extra programming to enforce.':
		'User-defined integrity',

	'Two entities A and B have an optional (A) to Mandatory (B) One-to-One relationship. When they are transformed, the Foreign Key(s) is placed on:':
		'The table B',

	'The transformation from an ER diagram to a physical design involves changing terminology. Entities in the ER diagram become __________ :':
		'Tables',

	'To convert an entity with a multi valued attribute to 1st Normal Form, we create an additional entity and relate it to the original entity with a 1:1 relationship. True or False?':
		'False',

	'In a physical model, many to many relationships are resolved via a structure called a(n): ________________':
		'Intersection Table',

	'Identify all of the incorrect statements that complete this sentence: A primary key is... (Choose Three)':
		'A set of columns in one table that uniquely identifies each row in another table. | A single column that uniquely identifies each column in a table. | Only one column that must be null.',

	'Systems are always just rolled out as soon as the programming phase is finished. No further work is required once the development is finished. True or False?':
		'False',

	'Conditional non-transferability refers to a relationship that may or may not be transferable, depending on time. True or False?':
		'True',

	'In a physical data model, a relationship is represented as a combination of: (Choose Two)':
		'Foreign Key | Primary Key or Unique Key',

	'In an ERD, it is a good idea to group your entities according to the expected volumes. By grouping high volume entities together, the diagrams could become easier to read. True or False?':
		'False',

	'In a physical data model, a relationship is represented as a:':
		'Foreign Key',

	'A table should have a primary key. True or False?': 'True',

	'An "Arc Implementation" can be done just like any other Relationship - you simply add the required Foreign Keys. True or False?':
		'False',

	'Which of the following would best be represented by an arc?':
		'DELIVERY ADDRESS (Home, Office)',

	'In which phases of the System Development Life Cycle will we need to use SQL as a language? (Choose Two)':
		'Build and Document | Transition',

	'An entity could have more than one attribute that would be a suitable Primary UID. True or False?':
		'True',

	'Which of the following statements are true to enhance the readability of ERDs? (Choose Two)':
		'Crows feet (the many-ends of relationships) should consistently point the same direction where possible, either South & East or North & West | Relationship lines should not cross.',

	'An attribute can have multiple values and still be in 1st Normal Form. True or False?':
		'False',

	'Business rules are important to data modelers because:':
		'A. They capture all of the needs, processes, and required functionality of the business.',

	'As a database designer, you do not need to worry about where in the datamodel you store a particular attribute; as long as you get it onto the ERD, your job is done. True or False?':
		'False',
	'The DESCRIBE command returns all rows from a table. True or False?':
		'False',
	'Which statement best describes how arithmetic expressions are handled?':
		'Division and multiplication operations are handled before subtraction and addition operations.',
	'The EMPLOYEES table contains these columns: SALARY NUMBER(7,2) BONUS NUMBER(7,2) COMMISSION_PCT NUMBER(2,2) All three columns contain values greater than zero. There is one row of data in the table and the values are as follows: Salary = 500, Bonus = 50, Commission_pct = .5 Evaluate these two SQL statements: 1. SELECT salary + bonus + commission_pct * salary - bonus AS income FROM employees; 2. SELECT (salary + bonus ) + commission_pct * (salary - bonus) income FROM employees; What will be the result?':
		'Statement 2 will return a higher value than statement 1.',
	'Which SQL statement will return an error?': 'SEL * FR sky;',
	'If you want to see just a subset of the columns in a table, you use what symbol?':
		'None of the above; instead of using a symbol, you name the columns for which you want to see data.',
	'If the EMPLOYEES table has the following columns, and you want to write a SELECT statement to return the employee last name and department number for employee number 176, which of the following SQL statements should you use? Name Type Length EMPLOYEE_ID NUMBER 22 FIRST_NAME VARCHAR2 20 LAST_NAME VARCHAR2 25 EMAIL VARCHAR2 25 PHONE_NUMBER VARCHAR2 20 SALARY NUMBER 22 COMMISSION_PCT NUMBER 22 MANAGER_ID NUMBER 22 DEPARTMENT_ID NUMBER 22':
		'SELECT last_name, department_id FROM employees WHERE employee_id = 176;',
	'Which example would limit the number of rows returned?':
		'SELECT title FROM d_songs WHERE type_code = 88;',
	'To restrict the rows returned from an SQL Query, you should use the _____ clause:':
		'WHERE',
	'Which of the following is NOT BEING DONE in this SQL statement? SELECT first_name || \' \' || last_name "Name" FROM employees;':
		'Concatenating first name, middle name and last name',
	'In order to eliminate duplicate rows use the ________ keyword': 'DISTINCT',
	'The EMPLOYEES table contains these columns: LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) EMAIL VARCHAR2(50) You are writing a SELECT statement to retrieve the names of employees that have an email address. SELECT last_name||\', \'||first_name "Employee Name" FROM employees; Which WHERE clause should you use to complete this statement?':
		'WHERE email IS NOT NULL;',
	'When using the "LIKE" operator, the % and _ symbols can be used to do a pattern- matching, wild card search. True or False?':
		'True',
	'The EMPLOYEES table includes these columns: EMPLOYEE_ID NUMBER(4) NOT NULL LAST_NAME VARCHAR2(15) NOT NULL FIRST_NAME VARCHAR2(10) NOT NULL HIRE_DATE DATE NOT NULL You want to produce a report that provides the last names, first names, and hire dates of those employees who were hired between March 1, 2000, and August 30, 2000. Which statements can you issue to accomplish this task?':
		"SELECT last_name, first_name, hire_date FROM employees WHERE hire_date BETWEEN '01-Mar-2000' AND '30-Aug-2000';",
	'The PLAYERS table contains these columns: PLAYERS TABLE: LAST_NAME VARCHAR2 (20) FIRST_NAME VARCHAR2 (20) SALARY NUMBER(8,2) TEAM_ID NUMBER(4) MANAGER_ID NUMBER(9) POSITION_ID NUMBER(4) You must display the player name, team id, and salary for players whose salary is in the range from 25000 through 100000 and whose team id is in the range of 1200 through 1500. The results must be sorted by team id from lowest to highest and then further sorted by salary from highest to lowest. Which statement should you use to display the desired result?':
		'SELECT last_name, first_name, team_id, salary FROM players WHERE salary BETWEEN 25000 AND 100000 AND team_id BETWEEN 1200 AND 1500 ORDER BY team_id, salary DESC;',
	'The following statement represents a multi-row function. True or False? SELECT MAX(salary) FROM employees':
		'True',
	"You want to display all players' names with position 6900 or greater. You want the players names to be displayed alphabetically by last name and then by first name. Which statement should you use to achieve the required results?":
		'SELECT last_name, first_name FROM players WHERE position_id >= 6900 ORDER BY last_name, first_name;|position_id >= 6900',
	'Evaluate this SQL statement: SELECT e.employee_id, e.last_name, e.first_name, m.manager_id FROM employees e, employees m ORDER BY e.last_name, e.first_name WHERE e.employee_id = m.manager_id; This statement fails when executed. Which change will correct the problem?':
		'Reorder the clauses in the query.',
	'Which columns can be added to the ORDER BY clause in the following SELECT statement? (Choose Three) SELECT first_name, last_name, salary, hire_date FROM employees WHERE department_id = 50 ORDER BY ?????;':
		'Any column in the EMPLOYEES table, any expression in the SELECT list or any ALIAS in the SELECT list|All columns in the EMPLOYEES table|last_name, first_name',
	'Evaluate this SQL statement: SELECT product_id, product_name, price FROM products ORDER BY product_name, price; What occurs when the statement is executed?':
		'The results are sorted alphabetically and then numerically.',
	'What value will the following SQL statement return? SELECT employee_id FROM employees WHERE employee_id BETWEEN 100 AND 150 OR employee_id IN(119, 175, 205) AND (employee_id BETWEEN 150 AND 200);':
		'100, 101, 102, 103, 104, 107, 124, 141, 142, 143, 144, 149',
	"Which of the following would be returned by this SQL statement: SELECT First_name, last_name, department_id FROM employees WHERE department_id IN(50,80) AND first_name LIKE ' C% ' OR last_name LIKE ' %s% '":
		'All of the above',
	'You issue this SQL statement: SELECT ROUND (1282.248, -2) FROM dual; What value does this statement produce?':
		'1300',
	'The answer to the following script is 456. True or False? SELECT TRUNC(ROUND(456.98)) FROM dual;':
		'False',
	"If hire_date has a value of '03-Jul-2003', then what is the output from this code? SELECT ROUND(hire_date, 'Year') FROM employees;":
		'01-Jan-2004',
	'Evaluate this SELECT statement: SELECT SYSDATE + 30 FROM dual; Which value is returned by the query?':
		'The current date plus 30 days.',
	'The STYLES table contains this data: STYLE_ID STYLE_NAME CATEGORY COST 895840 SANDAL 85940 12.00 968950 SANDAL 85909 10.00 869506 SANDAL 89690 15.00 809090 LOAFER 89098 10.00 890890 LOAFER 89789 14.00 857689 HEEL 85940 11.00 758960 SANDAL 86979 12.00 You query the database and return the value 79. Which script did you use?':
		'SELECT SUBSTR(category, -2,2) FROM styles WHERE style_id = 758960;',
	'You query the database with this SQL statement: SELECT CONCAT(last_name, (SUBSTR(LOWER(first_name), 4))) "Default Password" FROM employees; Which function will be evaluated first?':
		'LOWER',
	"If quantity is a number datatype, what is the result of this statement? SELECT NVL(200/quantity, 'zero') FROM inventory;":
		'The statement fails',
	"The PRODUCT table contains this column: PRICE NUMBER(7,2) Evaluate this statement: SELECT NVL(10 / price, '0') FROM PRODUCT; What would happen if the PRICE column contains null values?":
		'A value of 0 would be displayed.',
	'With the following data in Employees (last_name, commission_pct, manager_id) what is the result of the following statement? DATA: King, null, null Kochhar, null, 100 Vargas, null, 124 Zlotkey, .2, 100 SELECT last_name, NVL2(commission_pct, manager_id, -1) comm FROM employees ;':
		'King, -1 Kochhar, -1 Vargas, -1 Zlotkey, 100',
	"For the given data from Employees (last_name, manager_id) what is the result of the following statement: DATA:( King, null Kochhar, 100 De Haan, 100 Hunold, 102 Ernst, 103) SELECT last_name, DECODE(manager_id, 100, 'King', 'A N Other') \"Works For?\" FROM employees":
		'King, A N Other Kochhar, King De Haan, King Hunold, A N Other Ernst, A N Other',
	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2 (25) FIRST_NAME VARCHAR2 (25) HIRE_DATE DATE You need to display HIRE_DATE values in this format: January 28, 2000 Which SQL statement could you use?':
		"SELECT TO_CHAR(hire_date, 'Month DD, YYYY') FROM employees;",
	'Sysdate is 12-May-2004. You need to store the following date: 7-Dec-89 Which statement about the date format for this value is true?':
		'The RR date format will interpret the year as 1989, and the YY date format will interpret the year as 2089',
	'Will the following statement return one row? SELECT MAX(salary), MIN(Salary), AVG(SALARY) FROM employees;':
		'Yes, it will return the highest salary, the lowest salary, and the average salary from all employees.',
	'ROUND and TRUNC functions can be used with which of the following Datatypes?':
		'Dates and numbers',
	'The PRICE table contains this data: PRODUCT_ID MANUFACTURER_ID 86950 59604 You query the database and return the value 95. Which script did you use?':
		'SELECT SUBSTR(product_id, 3, 2) FROM price WHERE manufacturer_id = 59604;',
	'You query the database with this SQL statement: SELECT LOWER(SUBSTR(CONCAT(last_name, first_name)), 1, 5) "ID" FROM employee; In which order are the functions evaluated?':
		'CONCAT, SUBSTR, LOWER',
	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2 (25) FIRST_NAME VARCHAR2 (25) SALARY NUMBER(6) You need to create a report to display the salaries of all employees. Which SQL Statement should you use to display the salaries in format: "$45,000.00"?':
		"SELECT TO_CHAR(salary, '$999,999.00') FROM employees;",
	'Below find the structures of the PRODUCTS and VENDORS tables: PRODUCTS PRODUCT_ID NUMBER PRODUCT_NAME VARCHAR2 (25) VENDOR_ID NUMBER CATEGORY_ID NUMBER VENDORS VENDOR_ID NUMBER VENDOR_NAME VARCHAR2 (25) ADDRESS VARCHAR2 (30) CITY VARCHAR2 (25) REGION VARCHAR2 (10) POSTAL_CODE VARCHAR2 (11) You want to create a query that will return an alphabetical list of products, including the product name and associated vendor name, for all products that have a vendor assigned. Which two queries could you use?':
		'SELECT p.product_name, v.vendor_name FROM products p JOIN vendors v USING (vendor_id) ORDER BY p.product_name;|SELECT p.product_name, v.vendor_name FROM products p NATURAL JOIN vendors v ORDER BY p.product_name;',
	'The following statement is an example of what kind of join?':
		'Outer Join',
	'Will the following statement work? SELECT department_name, last_name FROM employees, departments WHERE department_id = department_id;':
		'No, Oracle will return a Column Ambiguously Defined error.',
	'When joining 3 tables in a SELECT statement, how many join conditions are needed in the WHERE clause?':
		'2',
	'Evaluate this SELECT statement: SELECT p.player_id, m.last_name, m.first_name, t.team_name FROM player p LEFT OUTER JOIN player m ON (p.manager_id = m.player_id) LEFT OUTER JOIN team t ON (p.team_id = t.team_id); Which join is evaluated first?':
		'The self-join of the player table',
	'Evaluate this SELECT statement: SELECT COUNT(*) FROM products; Which statement is true?':
		'The number of rows in the table is displayed.',
	'The VENDORS table contains these columns: VENDOR_ID NUMBER Primary Key NAME VARCHAR2(30) LOCATION_ID NUMBER ORDER_DT DATE ORDER_AMOUNT NUMBER(8,2) Which two clauses represent valid uses of aggregate functions for this table?':
		'SELECT MIN(AVG(order_amount))|SELECT SUM(order_amount)',
	'Which group function would you use to display the highest salary value in the EMPLOYEES table?':
		'MAX',
	'The difference between UNION and UNION ALL is':
		'UNION will remove duplicates; UNION ALL returns all rows from all queries including the duplicates.',
	'Examine the following statement: SELECT department_id, manager_id, job_id, SUM(salary) FROM employees GROUP BY GROUPING SETS(.......); Select the correct GROUP BY GROUPING SETS clause from the following list:':
		'GROUP BY GROUPING SETS ((department_id, manager_id), (department_id, job_id), (manager_id, job_id))',
	'CUBE can be applied to all aggregate functions including AVG, SUM, MIN, MAX, and COUNT. True or False?':
		'True',
	'Group functions can be nested to a depth of?': 'Two',
	'Evaluate this SELECT statement: SELECT MIN(hire_date), department_id FROM employees GROUP BY department_id; Which values are displayed?':
		'The earliest hire date in each department',
	'Which statement about the GROUP BY clause is true?':
		'To exclude rows before dividing them into groups using the GROUP BY clause, you should use a WHERE clause.',
	'Which of the following best describes the meaning of the ANY operator?':
		'Compare value to each value returned by the subquery',
	'Which statement about the ANY operator, when used with a multiple-row subquery, is true?':
		'The ANY operator compares every value returned by the subquery.',
	'Evaluate this SELECT statement: SELECT player_id, name FROM players WHERE team_id IN (SELECT team_id FROM teams WHERE team_id > 300 AND salary_cap > 400000); What would happen if the inner query returned a NULL value?':
		'No rows would be returned by the outer query.',
	'Which comparison operator can only be used with a single-row subquery?':
		'<>',
	'Table aliases must be used when you are writing correlated subqueries. (True or false?)':
		'False',
	"You want to create a list of all albums that have been produced by the company. The list should include the title of the album, the artist's name, and the date the album was released. The ALBUMS table includes the following columns: ALB_TITLE VARCHAR2(150) NOT NULL ALB_ARTIST VARCHAR2(150) NOT NULL ALB_DATE DATE NOT NULL Which statement can you use to retrieve the necessary information?":
		'SELECT alb_title; alb_artist; alb_date FROM albums;',
	"The following is a valid SQL SELECT statement. True or False? SELECT first_name || ' ' || last_name alias AS Employee_Name FROM employees:":
		'False',
	'Evaluate this SELECT statement: SELECT last_name, first_name, salary FROM employees; How will the heading for the FIRST_NAME column appear in the display by default in Oracle Application Express?':
		'The heading will display as uppercase and centered.',
	"What does the following SQL SELECT statement return? SELECT UPPER( SUBSTR('Database Programming', INSTR('Database Programming','P'),20)) FROM dual;":
		'PROGRAMMING',
	'Consider the following data in the Employees table: (last_name, commission_pct, manager_id) DATA: King, null, null Kochhar, null, 100 Vargas, null, 124 Zlotkey, .2, 100 What is the result of the following statement: SELECT last_name, COALESCE(commission_pct, manager_id, -1) comm FROM employees ;':
		'King, -1\nKochhar, 100\nVargas, 124\nZlotkey, .2',
	'You need to create a report that lists all employees in department 10 (Sales) whose salary is not equal to $25,000 per year. Which query should you issue to accomplish this task?':
		'SELECT last_name, first_name, salary FROM employees WHERE salary != 25000 AND dept_id = 10;',
	'You have two tables named EMPLOYEES and SALES. You want to identify the sales representatives who have generated at least $100,000 in revenue. Which query should you issue?':
		'SELECT e.first_name, e.last_name, s.sales FROM employees e, sales s WHERE e.employee_id = s.employee_id AND revenue >= 100000;',
	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2(20) FIRST_NAME VARCHAR2(20) SALARY NUMBER(9,2) HIRE_DATE DATE BONUS NUMBER(7,2) COMM_PCT NUMBER(4,2) Which three functions could be used with the HIRE_DATE, LAST_NAME, or SALARY columns? (Choose three.)':
		'COUNT|MAX|MIN',
	'What command can be used to create a new row in a table in the database?':
		'INSERT',
	"Evaluate this SELECT statement: SELECT employee_id, last_name, first_name, salary 'Yearly Salary' FROM employees WHERE salary IS NOT NULL ORDER BY last_name, 3; Which clause contains an error?":
		"SELECT employee_id, last_name, first_name, salary 'Yearly Salary'",
	"What is the result of the following query? SELECT ADD_MONTHS ('11-Jan-1994',6) FROM dual;":
		'11-Jul-1994',
	'You issue this SQL statement: SELECT TRUNC(751.367,-1) FROM dual; Which value does this statement display?':
		'750',
	"The STYLES table contains this data: STYLE_ID STYLE_NAME CATEGORY COST 895840 SANDAL 85940 12.00 968950 SANDAL 85909 10.00 869506 SANDAL 89690 15.00 809090 LOAFER 89098 10.00 890890 LOAFER 89789 14.00 857689 HEEL 85940 11.00 758960 SANDAL 86979 Evaluate this SELECT statement: SELECT style_id, style_name, category, cost FROM styles WHERE style_name LIKE 'SANDAL' AND NVL(cost, 0) < 15.00 ORDER BY category, cost; Which result will the query provide?":
		'STYLE_ID STYLE_NAME CATEGORY COST 968950 SANDAL 85909 10.00 895840 SANDAL 85940 12.00 758960 SANDAL 86979',
	"Given the following descriptions of the employees and jobs tables, which of the following scripts will display each employee's possible minimum and maximum salaries based on their job title? EMPLOYEES Table: Name Null? Type EMPLOYEE_ID NOT NULL NUMBER (6) FIRST_NAME VARCHAR2 (20) LAST_NAME NOT NULL VARCHAR2 (25) EMAIL NOT NULL VARCHAR2 (25) PHONE_NUMBER VARCHAR2 (20) HIRE_DATE NOT NULL DATE JOB_ID NOT NULL VARCHAR2 (10) SALARY NUMBER (8,2) COMMISSION_PCT NUMBER (2,2) MANAGER_ID NUMBER (6) DEPARTMENT_ID NUMBER (4) JOBS Table: Name Null? Type JOB_ID NOT NULL VARCHAR2 (10) JOB_TITLE NOT NULL VARCHAR2 (35) MIN_SALARY NUMBER (6) MAX_SALARY NUMBER (6)":
		'SELECT first_name, last_name, job_id, min_salary, max_salary FROM employees NATURAL JOIN jobs;',
	'Evaluate this SELECT statement: SELECT a.lname || \', \' || a.fname as "Patient", b.lname || \', \' || b.fname as "Physician", c.admission FROM patient a JOIN physician b ON (b.physician_id = c.physician_id) JOIN admission c ON (a.patient_id = c.patient_id); Which clause generates an error?':
		'ON (b.physician_id = c.physician_id);',
	'Which operator is typically used in a nonequijoin?':
		'>=, <=, or BETWEEN ...AND',
	'What happens when you create a Cartesian product?':
		'All rows from one table are joined to all rows of another table',
	'Given the following data in the employees table (employee_id, salary, commission_pct) DATA: (143, 2600, null 144, 2500, null 149, 10500, .2 174, 11000, .3 176, 8600, .2 178, 7000, .15) What is the result of the following statement: SELECT SUM(commission_pct), COUNT(salary) FROM employees WHERE employee_id IN( 143,144,149,174,176,178);':
		'SUM = .85 and COUNT = 6',
	'The following statement will work, even though it contains more than one GROUP function: SELECT AVG(salary), MAX(salary), MIN(salary), SUM(salary) FROM employees; True or False?':
		'True',
	'Evaluate this SELECT statement: SELECT COUNT(*) FROM employees WHERE salary > 30000; Which result will the query display?':
		'The number of rows in the EMPLOYEES table that have a salary greater than 30000',
	'When using SET operators, the number of columns and the data types of the columns must be identical in all of the SELECT statements used in the query. True or False.':
		'True',
	'The PRODUCTS table contains these columns: PRODUCT_ID NUMBER(9) PK CATEGORY_ID VARCHAR2(10) LOCATION_ID NUMBER(9) DESCRIPTION VARCHAR2(30) COST NUMBER(7,2) PRICE NUMBER(7,2) QUANTITY NUMBER You display the total of the extended costs for each product category by location. You need to include only the products that have a price less than $25.00. The extended cost of each item equals the quantity value multiplied by the cost value. Which SQL statement will display the desired result?':
		'SELECT category_id, SUM(cost * quantity) TOTAL, location_id FROM products WHERE price < 25.00 GROUP BY category_id, location_id;',
	'If a select list contains both a column as well as a group function then what clause is required?':
		'GROUP BY clause',
	'Read the following SELECT statement. Choose the column or columns that must be included in the GROUP BY clause. SELECT COUNT(last_name), grade, gender FROM STUDENTS GROUP_BY ?????;':
		'grade, gender',
	'If you want to include subtotals and grand totals for all columns mentioned in a GROUP BY clause, you should use which of the following extensions to the GROUP BY clause?':
		'CUBE',
	'What would happen if you attempted to use a single-row operator with a multiple-row subquery?':
		'An error would be returned.',
	'Examine the structures of the PARTS and MANUFACTURERS tables: PARTS: PARTS_ID VARCHAR2(25) PK PARTS_NAME VARCHAR2(50) MANUFACTURERS_ID NUMBER COST NUMBER(5,2) PRICE NUMBER(5,2) MANUFACTURERS: ID NUMBER PK NAME VARCHAR2(30) LOCATION VARCHAR2(20) Assume that the tables have been populated with data including 100 rows in the PARTS table, and 20 rows in the MANUFACTURERS table. Which SQL statement correctly uses a subquery?':
		'SELECT parts_name, price, cost FROM parts WHERE manufacturers_id IN (SELECT id FROM manufacturers m JOIN parts p ON (m.id = p.manufacturers_id));',
	'When a multiple-row subquery uses the NOT IN operator (equivalent to <>ALL), if one of the values returned by the inner query is a null value, the entire query returns:':
		'No rows returned',
	'Which of the following is TRUE regarding the order of subquery execution?':
		'The subquery executes once before the main query.',
	'If the subquery returns no rows, will the outer query return any values?':
		'No, because the subquery will be treated like a null value.',
	'Evaluate this SELECT statement: SELECT (salary * raise_percent) raise FROM employees; If the RAISE_PERCENT column only contains null values, what will the statement return?':
		'Only null values',
	'The following statement represents a multi-row function. True or False? SELECT UPPER(last_name) FROM employees;':
		'False',
	'Evaluate this SELECT statement: SELECT * FROM employees WHERE department_id = 34 OR department_id = 45 OR department_id = 67; Which operator is the equivalent of the OR conditions used in this SELECT statement?':
		'IN',
	'Evaluate this SELECT statement: SELECT last_name, first_name, department_id, manager_id FROM employees; You need to sort data by manager id values and then alphabetically by employee last name and first name values. Which ORDER BY clause could you use?':
		'ORDER BY manager_id, last_name, first_name',

	'You query the database with this SQL statement:\nSELECT *\nFROM transaction\nWHERE product_id = 4569;\n\nWhich SQL SELECT statement capabilities are achieved when this statement is executed?':
		'Selection and projection only',

	'SELECT * FROM departments; is a:': 'Statement',

	'The order of operator precedence is:': '* / + –',

	"Given the following descriptions of the employees and jobs tables, which of the following scripts will display each employee's possible minimum and maximum salaries based on their job title?\nEMPLOYEES Table:\nName   Null?    Type\nEMPLOYEE_ID          NOT NULL     NUMBER (6)\nFIRST_NAME             VARCHAR2 (20)\nLAST_NAME  NOT NULL     VARCHAR2 (25)\nEMAIL NOT NULL     VARCHAR2 (25)\nPHONE_NUMBER                  VARCHAR2 (20)\nHIRE_DATE   NOT NULL     DATE\nJOB_ID           NOT NULL     VARCHAR2 (10)\nSALARY                     NUMBER (8,2)\nCOMMISSION_PCT                NUMBER (2,2)\nMANAGER_ID                       NUMBER (6)\nDEPARTMENT_ID                 NUMBER (4)\nJOBS Table:\nName   Null?    Type\nJOB_ID           NOT NULL     VARCHAR2 (10)\nJOB_TITLE     NOT NULL     VARCHAR2 (35)\nMIN_SALARY                        NUMBER (6)\nMAX_SALARY                      NUMBER (6)":
		'SELECT first_name, last_name, job_id, min_salary, max_salary\nFROM employees\nNATURAL JOIN jobs;',
	'What is another name for a simple join or an inner join?': 'Equijoin',
	'You need to join the EMPLOYEE_HIST and EMPLOYEES tables. The EMPLOYEE_HIST table will be the first table in the FROM clause. All the matched and unmatched rows in the EMPLOYEES table need to be displayed. Which type of join will you use?':
		'A right outer join',
	'EMPLOYEES Table:\nName   Null?    Type\nEMPLOYEE_ID          NOT NULL     NUMBER(6)\nFIRST_NAME             VARCHAR2(20)\nLAST_NAME  NOT NULL     VARCHAR2(25)\nDEPARTMENT_ID                 NUMBER (4)\nDEPARTMENTS Table:\nName   Null?    Type\nDEPARTMENT_ID     NOT NULL     NUMBER 4\nDEPARTMENT_NAME          NOT NULL     VARCHAR2(30)\nMANAGER_ID                       NUMBER (6)\nA query is needed to display each department and its manager name from the above tables. However, not all departments have a manager but we want departments returned in all cases. Which of the following SQL: 1999 syntax scripts will accomplish the task?':
		'SELECT d.department_id, e.first_name, e.last_name\nFROM employees e\nRIGHT OUTER JOIN departments d\nON (e.employee_id = d.manager_id);|SELECT departments.department_id, employees.first_name, employees.last_name\nFROM employees\nRIGHT OUTER JOIN departments\nON (employees.employee_id = departments.manager_id);',

	'Which statement about a self join is true?':
		'Table aliases must be used to qualify table names.',
	'Which of the following database design concepts do you need in your tables to write Hierarchical queries?':
		'Recursive Relationship',
	'Evaluate this SELECT statement:\nSELECT *\nFROM employee e, employee m\nWHERE e.mgr_id = m.emp_id;\nWhich type of join is created by this SELECT statement?':
		'a self join',
	'Hierarchical queries MUST use the LEVEL pseudo column. True or False?':
		'False',
	'A join between tables where the result set includes matching values from both tables but does NOT return any unmatched rows could be called which of the following? (Choose three)':
		'Equijoin|Simple join|Self join',
	'A NATURAL JOIN is based on:': 'Columns with the same name and datatype|same name and datatype|datatype',
	'You need to join two tables that have two columns with the same name, datatype, and precision. Which type of join would you create to join the tables on both of the columns?':
		'Natural join',
	'For which condition would you use an equijoin query with the USING keyword?':
		'You need to perform a join of the CUSTOMER and ORDER tables but limit the number of columns in the join condition.',
	'Table aliases MUST be used with columns referenced in the JOIN USING clause. True or False?':
		'False',
	'The keywords JOIN _____________ should be used to join tables with the same column names but different datatypes.':
		'USING',
	'Which of the following conditions will cause an error on a NATURAL JOIN?':
		'If the columns having the same names have different data types, then an error is returned.',
	'Which query represents the correct syntax for a left outer join?':
		'SELECT companyname, orderdate, total\nFROM customers c\nLEFT OUTER JOIN orders o\nON c.cust_id = o.cust_id;',
	'Which query will retrieve all the rows in the EMPLOYEES table, even if there is no match in the DEPARTMENTS table?':
		'SELECT e.last_name, e.department_id, d.department_name\nFROM employees e\nLEFT OUTER JOIN departments d ON (e.department_id = d.department_id);|SELECT employees.last_name, employees.department_id, departments.department_name\nFROM employees\nLEFT OUTER JOIN departments ON (employees.department_id = departments.department_id);',
	'Which type of join returns rows from one table that have NO direct match in the other table?':
		'Outer join',
	'The primary advantages of using JOIN ON is: (Select two)':
		'It permits columns that don\'t have matching data types to be joined.|It permits columns with different names to be joined.',
	'The primary advantage of using JOIN ON is:':
		'It permits columns with different names to be joined.',
	'Which of the following database design concepts is implemented with a self join?':
		'Recursive Relationship',
	'Hierarchical queries can walk both Top-Down and Bottom-Up. True or False?':
		'True',
	'The following is a valid SQL statement.\nSELECT e.employee_id, e.last_name,     d.location_id, department_id\nFROM employees e JOIN departments d\nUSING (department_id) ;\n\nTrue or False?':
		'True',
	'Which keyword in a SELECT statement creates an equijoin by specifying a column name common to both tables?':
		'A USING clause',
	'Below find the structures of the PRODUCTS and VENDORS tables:\nPRODUCTS\nPRODUCT_ID NUMBER\nPRODUCT_NAME VARCHAR2 (25)\nVENDOR_ID NUMBER\nCATEGORY_ID NUMBER\n\nVENDORS\nVENDOR_ID NUMBER\nVENDOR_NAME VARCHAR2 (25)\nADDRESS VARCHAR2 (30)\nCITY VARCHAR2 (25)\nREGION VARCHAR2 (10)\nPOSTAL_CODE VARCHAR2 (11)\n\nYou want to create a query that will return an alphabetical list of products, including the product name and associated vendor name, for all products that have a vendor assigned.\n\nWhich two queries could you use?':
		'SELECT p.product_name, v.vendor_name\nFROM products p\nNATURAL JOIN vendors v\nORDER BY p.product_name;|SELECT p.product_name, v.vendor_name\nFROM products p\nJOIN vendors v\nUSING (vendor_id)\nORDER BY p.product_name;',
	'You need to join all the rows in the EMPLOYEES table to all the rows in the EMP_REFERENCE table. Which type of join should you create?':
		'A cross join',
	'What types of joins will return the unmatched values from both tables in the join?':
		'Full outer joins',
	'For which of the following tables will all the values be retrieved even if there is no match in the other?\nSELECT employees.last_name, employees.department_id, departments.department_name\nFROM employees\nLEFT OUTER JOIN departments\nON (employees.department_id = departments.department_id);':
		'employees',
	'You can do nonequi-joins with ANSI-Syntax. True or False?': 'True',
	'Evaluate this SELECT statement:\n\nSELECT patient.lname || \', \' || patient.fname as "Patient", physician.lname || \', \' || physician.fname as "Physician", admission.admission\nFROM patient\nJOIN physician\nON (physician.physician_id = admission.physician_id)\nJOIN admission\nON (patient.patient_id = admission.patient_id);\n\nWhich clause generates an error?':
		'ON (physician.physician_id = admission.physician_id);',
	'If you select rows from two tables (employees and departments) using the outer join specified in the example, what will you get?\nSELECT employees.last_name, employees.department_id, departments.department_name\nFROM employees\nLEFT OUTER JOIN departments\nON (employees.department_id = departments.department_id);':
		'All employees including those that do not have a departement_id assigned to them',
	'Which SELECT statement implements a self join?':
		'SELECT item.part_id, type.product_id\nFROM part item JOIN part type\nON item.part_id = type.product_id;|SELECT worker.employee_id, manager.manager_id\nFROM employees worker JOIN employees manager\nON manager.employee_id = worker.manager_id;|SELECT e.employee_id, m.manager_id FROM employees e, employees m WHERE m.employee_id = e.manager_id;',
	'The join column must be included in the select statement when you use the NATURAL JOIN clause. True or False?':
		'False',
	'Which two sets of join keywords create a join that will include unmatched rows from the first table specified in the SELECT statement?':
		'LEFT OUTER JOIN and FULL OUTER JOIN',
	'Which statement about a natural join is true?':
		'Columns with the same names must have the same datatype.',
	'Evaluate this SELECT statement:\nSELECT *\nFROM employee worker JOIN employee manager\nON worker.mgr_id = manager.emp_id;\nWhich type of join is created by this SELECT statement?':
		'a self join',
	'Which of the following statements is the simplest description of a nonequijoin?':
		'A join condition containing something other than an equality operator',
	'Which syntax would be used to retrieve all rows in both the EMPLOYEES and DEPARTMENTS tables, even when there is no match?':
		'FULL OUTER JOIN',
	'You created the CUSTOMERS and ORDERS tables by issuing these CREATE TABLE statements in sequence:\nCREATE TABLE customers\n(custid varchar2(5),\ncompanyname varchar2(30),\ncontactname varchar2(30),\naddress varchar2(30),\ncity varchar2(20),\nstate varchar2(30),\nphone varchar2(20),\nconstraint pk_customers_01 primary key (custid));\n\nCREATE TABLE orders\n(orderid varchar2(5) constraint pk_orders_01 primary key,\norderdate date,\ntotal number(15),\ncustid varchar2(5) references customers (custid));\n\nYou have been instructed to compile a report to present the information about orders placed by customers who reside in Nashville. Which query should you issue to achieve the desired results?':
		"SELECT orderid, orderdate, total\nFROM orders\nJOIN customers ON orders.custid = customers.custid\nWHERE city = 'Nashville';",
	'Which select statement will return the last name and hire date of an employee and his/ her manager for employees that started in the company before their managers? [ANSI JOIN version]':
		'SELECT worker.last_name, worker.hire_date, manager.last_name, manager.hire_date\nFROM employees worker JOIN employees manager\nON worker.manager_id = manager.employee_id\nWHERE worker.hire_date < manager.hire_date',
	'You need to provide a list of the first and last names of all employees who work in the Sales department who earned a bonus and had sales over $50,000. The company president would like the sales listed starting with the highest amount first. The EMPLOYEES table and the SALES_DEPT table contain the following columns:\nEMPLOYEES\nEMPLOYEE_ID NUMBER(10) PRIMARY KEY\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nDEPTARTMENT_ID VARCHAR2(20)\nHIRE_DATE DATE\nSALARY NUMBER(10)\n\nSALES_DEPT\nSALES_ID NUMBER(10) PRIMARY KEY\nSALES NUMBER(20)\nQUOTA NUMBER(20)\nMANAGER VARCHAR2(30)\nBONUS NUMBER(10)\nEMPLOYEE_ID NUMBER(10) FOREIGN KEY\n\nWhich SELECT statement will accomplish this task?':
		'SELECT e.employee_id, e.last_name, e.first_name, s.employee_id, s.bonus, s. sales\nFROM employees e, sales_dept s\nWHERE e.employee_id = s.employee_id AND s.bonus IS NOT NULL AND sales > 50000\nORDER BY sales DESC;',

	'All computers in the world speak the same languages, so you only need to learn one programming language – Oracle SQL. True or False?':
		'False',

	'What command do you use to add rows to a table': 'INSERT',
	'The explanation below is a column integrity constraint:\nA column must contain only values consistent with the defined data format of the column. True or False?':
		'True',

	'Which select statement will return the last name and hire date of an employee and his/ her manager for employees that started in the company before their managers?':
		'SELECT worker.last_name, worker.hire_date, manager.last_name, manager.hire_date FROM employees worker JOIN employees manager ON worker.manager_id = manager.employee_id WHERE worker.hire_date < manager.hire_date',

	'Identify all of the incorrect statements that complete this sentence: A primary key is: (Choose three)':
		'A single column that uniquely identifies each column in a table|A set of columns in one table that uniquely identifies each row in another table|Only one column that must be null',

	'The explanation below is a User Defined integrity rule and must therefore be manually coded, the Database cannot enforce this rule automatically:\nA primary key must be unique, and no part of the primary key can be null. True or False?':
		'False',

	'The text below is an example of what constraint type:\nThe value in the manager_id column of the EMPLOYEES table must match a value in the employee_id column in the EMPLOYEES table.':
		'Referential integrity',

	'It is possible to implement non-transferability via a simple Foreign Key Relationship. True or False?':
		'False',

	'Many to many relationships are implemented via a structure called a: ________________':
		'Intersection Table',

	'Which of the following are reasons why you should consider using a Subtype Implementation?':
		'Business functionality and business rules, access paths and frequency of access are all very different between subtypes.',

	'Evaluate this SELECT statement:\nSELECT (salary * raise_percent) raise\nFROM employees;\n\nIf the RAISE_PERCENT column only contains null values, what will the statement return?':
		'Only null values',

	'What would you use in the SELECT clause to return all the columns in the table?':
		'An asterisk (*)',

	'When you use the SELECT clause to list one or two columns only from a table and no WHERE clause, which SQL capability is used?':
		'Projection only',

	'In a SELECT clause, what is the result of 2 + 3 * 2?': '8',

	'You query the database with this SQL statement:\nSELECT * FROM students;\n\nWhy would you use this statement?':
		'To view data',

	'Any Non-UID must be dependant on the entire UID. True or False?': 'True',

	'When is an entity in 2nd Normal Form?':
		'When all non-UID attributes are dependent upon the entire UID.',

	'What does the DISTINCT keyword do when it is used in a SELECT clause?':
		'Eliminates duplicate rows in the result',

	'Which symbol represents the not equal to condition?': '!=',

	'Which statement best describes how column headings are displayed by default in Oracle Application Express:':
		'Column headings are displayed centered and in uppercase.',

	'What will the result of the following SELECT statement be:\nSELECT last_name, salary, salary + 300\nFROM employees;\nHow will the heading for the SALARY column appear in the display by default in Oracle Application Express?':
		'Display the last name, salary and the results of adding 300 to each salary for all the employees',

	'The PLAYERS table contains these columns:\nPLAYER_ID NUMBER(9)\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2 (20)\nTEAM_ID NUMBER (4)\nMANAGER_ID NUMBER (9)\nPOSITION_ID NUMBER (4)\n\nWhich SELECT statement should you use if you want to display unique combinations of the TEAM_ID and MANAGER_ID columns?':
		'SELECT DISTINCT team_id, manager_id FROM players;',

	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9) PrimaryKey\nLAST_NAME VARCHAR2 (20)\nFIRST_NAME VARCHAR2 (20)\nDEPARTMENT_ID NUMBER(5) NOT NULL\nMANAGER_ID NUMBER(9) NOT NULL\n\nEvaluate these two SELECT statements:\n1. SELECT DISTINCT employee_id, department_id, manager_id FROM employees;\n2. SELECT employee_id, department_id, manager_id FROM employees;\n\nWhich of the following statements is true?':
		'The two statements will display the same data.',

	'The STUDENT table contains these columns:\nSTUDENT_ID NUMBER(10) Primary Key\nLAST_NAME VARCHAR2(25)\nFIRST_NAME VARCHAR2(25)\nMAIN_SUBJECT_ID NUMBER(3)\nADVISOR_ID NUMBER(5)\n\nEvaluate this statement:\nSELECT DISTINCT advisor_id, main_subject_id\nFROM student;\n\nWhich statement is true?':
		'Each MAIN_SUBJECT_ID can be displayed more than once per ADVISOR_ID.',

	'The EMPLOYEES table includes these columns:\nEMPLOYEE_ID NUMBER(4) NOT NULL\nLAST_NAME VARCHAR2(15) NOT NULL\nFIRST_NAME VARCHAR2(10) NOT NULL\nHIRE_DATE DATE NOT NULL\n\nYou want to produce a report that provides the first names, last names and hire dates of those employees who were hired between March 1, 2000, and August 30, 2000. Which statements can you issue to accomplish this task?':
		'SELECT last_name, first_name, hire_date\nFROM employees\nWHERE hire_date BETWEEN ’01-MAR-00′ AND ’30-AUG-00′;',

	// duplicate players 6900 key removed

	'Evaluate this SELECT statement:\nSELECT *\nFROM employees\nWHERE salary > 30000\nAND department_id = 10\nOR email IS NOT NULL;\nWhich statement is true?':
		'The AND condition will be evaluated before the OR condition.',

	'You need to create a report to display all employees that were hired on or after January 1, 1996. The data should display in this format:\nEmployee Start Date and Salary\n14837 – Smith 10-MAY-92 / 5000\n\nWhich SELECT statement could you use?':
		'SELECT employee_id ||’ – ‘|| last_name „Employee”,\nhire_date ||’ / ‘|| salary „Start Date and Salary”\nFROM employees\nWHERE hire_date <= ’01-JAN-96’;',

	'You attempt to query the database with this SQL statement:\nSELECT product_id „Product Number”, category_id „Category”, price „Price”\nFROM products\nWHERE „Category” = 5570\nORDER BY „Product Number”;\n\nThis statement fails when executed. Which clause contains a syntax error?':
		'WHERE „Category” = 5570',

	'Evaluate this SELECT statement:\nSELECT employee_id, last_name, first_name, salary ‘Yearly Salary’\nFROM employees\nWHERE salary IS NOT NULL\nORDER BY last_name, 3;\n\nWhich clause contains an error?':
		'SELECT employee_id, last_name, first_name, salary ‘Yearly Salary’',

	'Which comparison condition means „Less Than or Equal To?”': '„<=”',
	'Which SQL keyword specifies that an alias will be substituted for a column name in the output of a SQL query?':
		'AS',
	'The SQL SELECT statement is capable of:': 'Selection and projection',
	'What is a NULL value?': 'An unknown value',
	'In which clause of a SELECT statement would you specify the name of the table or tables being queried?':
		'The FROM clause',
	'In the real world, databases used by businesses generally have a single table. True or False?':
		'False',
	'What language is used to query data in a Relational Database?': 'SQL',
	'Databases are used in most countries and by most governments. Life, as we know it, would change drastically if we no longer had access to databases. True or False?':
		'True',
	'Most of the well know Internet search engines use databases to store data. True or False?':
		'True',
	'A Relational Database generally contains two or more tables. True or False?':
		'True',
	'What command can be used to show information about the structure of a table?':
		'DESCRIBE',
	'What command retrieves data from the database?': 'SELECT',
	'All computers in the world speak the same languages, so you only need to learn one programming language - Oracle SQL. True or False?':
		'False',
	'What command will return data from the database to you?': 'SELECT',
	'Every time you shop online, it is likely you will be accessing a database. True or False?':
		'True',
	'Every row in a relational database table is unique.': 'True',
	'The basic storage structure in a Relational Database is a _________:':
		'Table',
	'Columns in a database table contain data with the same _________:': 'Type',
	'In the default order of precedence, which operator would be evaluated first?':
		'Multiplications and Divisions are at the same level and would be evaluated first based on left to right order',
	'The SELECT statement retrieves information from the database. In a SELECT statement, you can do all of the following EXCEPT:':
		'Manipulation',
	'When listing columns in the SELECT list, what should you use to separate the columns?':
		'Commas',
	'If a SQL statement returns data from two or more tables, which SQL capability is being used?':
		'Joining',
	'There is only one kind of software used by all computers. True or False?':
		'False',
	'The _______ clause can be added to a SELECT statement to return a subset of the data.':
		'WHERE',
	'You cannot use computers unless you completely understand exactly how they work. True or False?':
		'False',
	'What command can be added to a select statement to return a subset of the data?':
		'WHERE',
	'The EMPLOYEES table contains these columns:\nSALARY NUMBER(7,2)\nBONUS NUMBER(7,2)\nCOMMISSION_PCT NUMBER(2,2)\n\nAll three columns contain values greater than zero.\nThere is one row of data in the table and the values are as follows:\nSalary = 500, Bonus = 50, Commission_pct = .5\n\nEvaluate these two SQL statements:\n\n1.\nSELECT salary + bonus + commission_pct * salary - bonus AS income\nFROM employees;\n\n2.\nSELECT (salary + bonus ) + commission_pct * (salary - bonus) income\nFROM employees;\n\nWhat will be the result?':
		'Statement 2 will return a higher value than statement 1.',
	'Examine the follolowing SELECT statement.\nSELECT *\nFROM employees;\n\nThis statement will retrieve all the rows in the employees table. True or False?':
		'True',
	'Which of the following are true? (Choose Two)':
		'Date values are format-sensitive|Date values are enclosed in single quotation marks',
	'Which of the following would be returned by this SELECT statement:\nSELECT last_name, salary\nFROM employees\nWHERE salary < 3500;':
		'LAST_NAME  SALARY\nDavies 3100',
	'How can you write "not equal to" in the WHERE-clause?': 'All of the above',
	'Which query would give the following result?\nLAST_NAME  FIRST_NAME DEPARTMENT_ID\nKing     Steven  90':
		"SELECT last_name, first_name, department_id\nFROM employees\nWHERE last_name = 'King';",
	'Which SELECT statement will display both unique and non-unique combinations of the MANAGER_ID and DEPARTMENT_ID values from the EMPLOYEES table?':
		'SELECT manager_id, department_id FROM employees;',
	'Where in a SQL statement can you not use arithmetic operators?': 'FROM',
	'Which clause would you include in a SELECT statement to restrict the data returned to only the employees in department 10?':
		'WHERE',
	'The concatenation operator ...': 'All of the above',
	'You need to display employees whose salary is in the range of 30000 and 50000. Which comparison operator should you use?':
		'BETWEEN...AND...',
	'Which comparison condition would you use to select rows that match a character pattern?':
		'LIKE',
	'Which of the following WHERE clauses would not select the number 10?':
		'WHERE hours <>10',
	'When using the "LIKE" operator, the % and _ symbols can be used to do a pattern-matching, wild card search. True or False?':
		'True',
	'Which of the following are examples of comparison operators used in the WHERE clause?':
		'All of the above',
	'If you write queries using the BETWEEN operator, it does not matter in what order you enter the values, i.e. BETWEEN low value AND high value will give the same result as BETWEEN high value and low value. True or False?':
		'False',
	'The EMPLOYEES table contains these columns:\nLAST_NAME VARCHAR2(25)\nFIRST_NAME VARCHAR2(25)\nEMAIL VARCHAR2(50)\n\nYou are writing a SELECT statement to retrieve the names of employees that have an email address.\n\nSELECT last_name||\', \'||first_name "Employee Name"\nFROM employees;\n\nWhich WHERE clause should you use to complete this statement?':
		'WHERE email IS NOT NULL;',
	'You need write a SELECT statement that should only return rows that contain 34, 46, or 48 for the DEPARTMENT_ID column. Which operator should you use in the WHERE clause to compare the DEPARTMENT_ID column to this specific list of values?':
		'IN',
	'You need to write a SELECT statement that should only return rows that contain 34, 46, or 48 for the DEPARTMENT_ID column. Which operator should you use in the WHERE clause to compare the DEPARTMENT_ID column to this specific list of values?':
		'IN',
	"You want to retrieve a list of customers whose last names begin with the letters 'Fr' . Which keyword should you include in the WHERE clause of your SELECT statement to achieve the desired result?":
		'LIKE',
	'Evaluate this SELECT statement:\nSELECT *\nFROM employees\nWHERE department_id IN(10, 20, 30)\nAND salary > 20000;\n\nWhich values would cause the logical condition to return TRUE?':
		'DEPARTMENT_ID = 10 and SALARY = 20001',
	'Which two statements would select salaries that are greater than or equal to 2500 and less than or equal to 3500? (Choose two)':
		'WHERE salary BETWEEN 2500 AND 3500|WHERE salary >= 2500 AND salary <= 3500',
	'You need to display employees with salaries that are at least 30000 or higher. Which comparison operator should you use?':
		'>=',
	'You need to display only unique combinations of the LAST_NAME and MANAGER_ID columns in the EMPLOYEES table. Which keyword should you include in the SELECT clause?':
		'DISTINCT',
	'You need to display employees whose salary is in the range of 10000 through 25000 for employees in department 50 . What does the WHERE clause look like?':
		'WHERE department_id = 50\nAND salary BETWEEN 10000 AND 25000',
	'You need to combine the FIRST_NAME and LAST_NAME columns in the EMPLOYEES table and display the columns as a combined character string. Which operator should you use?':
		'||',
	'The Concatenation Operator does which of the following?':
		'Links two or more columns or literals to form a single output column',
	'Which operator is used to combine columns of character strings to other columns?':
		'||',
	'You need to display all the rows in the EMPLOYEES table that contain a null value in the DEPARTMENT_ID column. Which comparison operator should you use?':
		'IS NULL',
	'Which of the following commands will display the last name concatenated with the job ID from the employees table, separated by a comma and space, and label the resulting column "Employee and Title"?':
		'SELECT last_name||\', \'||job_id "Employee and Title" FROM employees;',
	"The following is a valid SQL SELECT statement. True or False?\nSELECT first_name || ' ' || last_name alias AS Employee_Name\nFROM employees:":
		'False',
	'When using the LIKE condition to search for _ symbols, which character can you use as the default ESCAPE option?':
		'\\',
	'Which comparison operator searches for a specified character pattern?':
		'LIKE',
	'When using the LIKE condition, which symbol represents any sequence of characters of any length--zero, one, or more characters?':
		'%',
	'Which of the following elements cannot be included in a WHERE clause?':
		'A column alias',
	"You want to retrieve a list of customers whose last names begin with the letters 'Fr' . Which symbol should you include in the WHERE clause of your SELECT statement to achieve the desired result?":
		'%',
	'If the EMPLOYEES table has the following columns, and you want to write a SELECT statement to return the employee last name and department number for employee number 176, which of the following SQL statements should you use?\nName Type Length\nEMPLOYEE_ID NUMBER 22\nFIRST_NAME VARCHAR2 20\nLAST_NAME VARCHAR2 25\nEMAIL VARCHAR2 25\nPHONE_NUMBER VARCHAR2 20\nSALARY NUMBER 22\nCOMMISSION_PCT NUMBER 22\nMANAGER_ID NUMBER 22\nDEPARTMENT_ID NUMBER 22':
		'SELECT last_name, department_id\nFROM employees\nWHERE employee_id = 176;',
	'You need to display all the values in the EMAIL column that contains the underscore (_) character as part of that email address. The WHERE clause in your SELECT statement contains the LIKE operator. What must you include in the LIKE operator?':
		'The ESCAPE option (\\) and one or more percent signs (%)',

	'You need to display all the rows (both matching and non-matching) from both the EMPLOYEE and EMPLOYEE_HIST tables. Which type of join would you use?':
		'A full outer join',

	'SELECT last_name, salary, salary + 300\nFROM employees;':
		'Display the last name, salary, and the results of adding 300 to each salary for all the employees',
	'SELECT orderid, orderdate, total\nFROM orders;': "WHERE city = 'Chicago';",

	"You need to display all the employees whose last names (of any length) start with the letters 'Sm' . Which WHERE clause should you use?":
		"WHERE last_name LIKE 'Sm%'",
	'Which of the following is true of the ORDER BY clause? (Choose Two)':
		'Must be the last clause of the SQL statement | Defaults to an ascending order (ASC)',
	'You attempt to query the database with this SQL statement:':
		'WHERE "Category" = 5570',

	'Which of the following would be returned by this SQL statement:\nSELECT First_name, last_name, department_id\nFROM employees\nWHERE department_id IN(50,80)\nAND first_name LIKE ‘ C% ‘\nOR last_name LIKE ‘ %s% ‘':
		'All of the above',

	'What value will the following SQL statement return?\nSELECT employee_id\nFROM employees\nWHERE employee_id BETWEEN 100 AND 150\nOR employee_id IN(119, 175, 205)\nAND (employee_id BETWEEN 150 AND 200);':
		'100, 101, 102, 103, 104, 107, 124, 141, 142, 143, 144, 149',

	'What clause must you place in a SQL statement to have your results sorted from highest to lowest salary?':
		'ORDER BY salary DESC',
	'The PLAYERS table contains these columns:\nPLAYERS TABLE:\nLAST_NAME VARCHAR2 (20)\nFIRST_NAME VARCHAR2 (20)\nSALARY NUMBER(8,2)\nTEAM_ID NUMBER(4)\nMANAGER_ID NUMBER(9)\nPOSITION_ID NUMBER(4)\n\nYou must display the player name, team id, and salary for players whose salary is in the range from 25000 through 100000 and whose team id is in the range of 1200 through 1500. The results must be sorted by team id from lowest to highest and then further sorted by salary from highest to lowest. Which statement should you use to display the desired result?':
		'SELECT last_name, first_name, team_id, salary\nFROM players\nWHERE salary BETWEEN 25000 AND 100000\nAND team_id BETWEEN 1200 AND 1500\nORDER BY team_id, salary DESC;',
	'Evaluate this SQL statement:\nSELECT e.employee_id, e.last_name, e.first_name, m.manager_id\nFROM employees e, employees m\nORDER BY e.last_name, e.first_name\nWHERE e.employee_id = m.manager_id;\n\nThis statement fails when executed. Which change will correct the problem?':
		'Reorder the clauses in the query.',
	'Will the following statement return one row?\nSELECT MAX(salary), MIN(Salary), AVG(SALARY)\nFROM employees;':
		'Yes, it will return the highest salary, the lowest salary, and the average salary from all employees.',
	'The function COUNT is a single row function. True or False?': 'False',
	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9) PK\nLAST_NAME VARCHAR2(25)\nFIRST_NAME VARCHAR2(25)\nDEPARTMENT_ID NUMBER(9)\nCompare these two SQL statements:\n\n1.\nSELECT DISTINCT department_id DEPT, last_name, first_name\nFROM employees\nORDER BY department_id;\n\n2.\nSELECT department_id DEPT, last_name, first_name\nFROM employees\nORDER BY DEPT;\n\nHow will the results differ?':
		'The statements will sort on different column values.',
	'Which columns can be added to the ORDER BY clause in the following SELECT statement? (Choose Three)\nSELECT first_name, last_name, salary, hire_date\nFROM employees\nWHERE department_id = 50\nORDER BY ?????;':
		'last_name, first_name|Any column in the EMPLOYEES table, any expression in the SELECT list or any ALIAS in the SELECT list|All columns in the EMPLOYEES table',
	'Which SELECT statement should you use to limit the display of product information to those products with a price of less than 50?':
		'SELECT product_id, product_name\nFROM products\nWHERE price < 50;',
	'Evaluate this SQL statement:\nSELECT product_id, product_name, price\nFROM products\nORDER BY product_name, price;\n\nWhat occurs when the statement is executed?':
		'The results are sorted alphabetically and then numerically.',
	'Evaluate this SELECT statement:\nSELECT last_name, first_name, salary\nFROM employees;\n\nHow will the results of this query be sorted?':
		'The database will display the rows in whatever order it finds it in the database, so no particular order.',
	'Evaluate this SELECT statement:\nSELECT *\nFROM employees\nWHERE department_id = 34\nOR department_id = 45\nOR department_id = 67;\n\nWhich operator is the equivalent of the OR conditions used in this SELECT statement?':
		'IN',
	'From left to right, what is the correct order of Precedence?':
		'Arithmetic, Concatenation, Comparison, OR',
	"What will be the results of the following selection?\nSELECT *\nFROM employees\nWHERE last_name NOT LIKE 'A%' AND last_name NOT LIKE 'B%'":
		'All last names that do not begin with A or B',
	'The ORDER BY clause always comes last. True or False?': 'True',
	'Which symbol in the WHERE clause means "Not Equal To"? (Choose Two)':
		'<>|NOT IN (..)',
	'Which comparison condition means "Less Than or Equal To"?': '"<="',
	'Which of the following is true of the ORDER BY clause:? (Choose Two)':
		'Must be the last clause of the SQL statement|Defaults to an ascending order (ASC)',
	'Evaluate this SELECT statement:\nSELECT first_name, last_name, email\nFROM employees\nORDER BY last_name;\n\nWhich statement is true?':
		'The rows will be sorted alphabetically by the LAST_NAME values.',
	'Evaluate this SELECT statement:\nSELECT last_name, first_name, email\nFROM employees\nORDER BY email;\n\nIf the EMAIL column contains null values, which statement is true?':
		'Null email values will be displayed last in the result.',
	'The following statement represents a multi-row function. True or False?\nSELECT MAX(salary)\nFROM employees':
		'True',
	'The conversion function TO_CHAR is a single row function. True or False?':
		'True',
	'The following statement represents a multi-row function. True or False?\nSELECT UPPER(last_name)\nFROM employees;':
		'False',
	'Which of the following statements best describes the rules of precedence when using SQL?':
		'The order in which the expressions are evaluated and calculated',
	'Which of the following best describes the meaning of the LIKE operator?':
		'Match a character pattern.',
	'Which statement about the ORDER BY clause is true?':
		'You can use a column alias in the ORDER BY clause.',
	'Find the clause that will give the same results as:\nSELECT *\nFROM d_cds\nWHERE cd_id NOT IN(90, 91, 92);':
		'WHERE cd_id != 90 and cd_id != 91 and cd_id != 92;',
	// duplicate players 6900 key removed
	'Which of the following are TRUE regarding the logical AND operator?':
		'TRUE AND FALSE return FALSE',
	'Which statement about the default sort order is true?':
		'The earliest date values are displayed first.',
	"Evaluate this SELECT statement:\nSELECT employee_id, last_name, first_name, salary 'Yearly Salary'\nFROM employees\nWHERE salary IS NOT NULL\nORDER BY last_name, 3;\n\nWhich clause contains an error?":
		"SELECT employee_id, last_name, first_name, salary 'Yearly Salary'",
	'A column alias can be specified in an ORDER BY Clause. True or False?':
		'True',
	"Which of the following would be returned by this SQL statement:\nSELECT First_name, last_name, department_id\nFROM employees\nWHERE department_id IN(50,80)\nAND first_name LIKE ' C% '\nOR last_name LIKE ' %s% '":
		'All of the above',
	'Which logical operator returns TRUE if either condition is true?': 'OR',
	'Which statement about the logical operators is true?':
		'The order of operator precedence is NOT, AND, and OR.',
	'Which clause would you include in a SELECT statement to sort the rows returned by the LAST_NAME column?':
		'ORDER BY',
	'Evaluate this SELECT statement:\nSELECT last_name, first_name, department_id, manager_id\nFROM employees;\n\nYou need to sort data by manager id values and then alphabetically by employee last name and first name values. Which ORDER BY clause could you use?':
		'ORDER BY manager_id, last_name, first_name',
	'Evaluate this SELECT statement:\nSELECT *\nFROM employees\nWHERE salary > 30000\nAND department_id = 10\nOR email IS NOT NULL;\n\nWhich statement is true?':
		'The AND condition will be evaluated before the OR condition.',
	'You need to create a report to display all employees that were hired on or before January 1, 1996. The data should display in this format:\nEmployee Start Date and Salary\n14837 - Smith 10-May-1992 / 5000\nWhich SELECT statement could you use?':
		"SELECT employee_id ||' - '|| last_name \"Employee\",\nhire_date ||' / '|| salary \"Start Date and Salary\"\nFROM employees\nWHERE hire_date <= '01-Jan-1996';",
	'Which of the following are examples of logical operators that might be used in a WHERE clause. (Choose Two)':
		'AND, OR|NOT',
	'You need to change the default sort order of the ORDER BY clause so that the data is displayed in reverse alphabetical order. Which keyword should you include in the ORDER BY clause?':
		'DESC',
	'Which of the following is earliest in the rules of precedence?':
		'Arithmetic operator',
	'Which number function may be used to determine if a value is odd or even?':
		'MOD',
	'What is the result of the following SQL Statement:\nSELECT ROUND(45.923,-1)\nFROM DUAL;':
		'50',
	'Which two functions can be used to manipulate number or date column values, but NOT character column values? (Choose two.)':
		'ROUND|TRUNC',
	'Evaluate this function: MOD (25, 2) Which value is returned?': '1',
	"Which script displays '01-May-2004' when the HIRE_DATE value is '20-May-2004'?":
		"SELECT TRUNC(hire_date, 'MONTH')\nFROM employees;",
	'You need to display the current year as a character value (for example: Two Thousand and One). Which element would you use?':
		'YEAR',
	"What is the result of the following query?\nSELECT ADD_YEARS ('11-Jan-1994',6)\nFROM dual;":
		'This in not a valid SQL statement.',
	"You need to display the number of months between today's date and each employee's hiredate. Which function should you use?":
		'MONTHS_BETWEEN',
	'Which query would return a whole number if the sysdate is 26-May-2004?':
		"SELECT TRUNC(MONTHS_BETWEEN(SYSDATE,'19-Mar-1979') /12)\nAS YEARS\nFROM DUAL;",
	'Which SELECT statement will NOT return a date value?':
		'SELECT (SYSDATE - hire_date) + 10*8\nFROM employees;',
	"You need to display each employee's name in all uppercase letters. Which function should you use?":
		'UPPER',
	'The STYLES table contains this data:\nSTYLE_ID       STYLE_NAME            CATEGORY    COST\n895840                        SANDAL                     85940              12.00\n968950                        SANDAL                     85909              10.00\n869506                        SANDAL                     89690              15.00\n809090                        LOAFER                      89098              10.00\n890890                        LOAFER                      89789              14.00\n857689                        HEEL                           85940              11.00\n758960                        SANDAL                     86979              12.00\nYou query the database and return the value 79. Which script did you use?':
		'SELECT SUBSTR(category, -2,2)\nFROM styles\nWHERE style_id = 758960;',
	"What does the following SQL SELECT statement return?\nSELECT UPPER( SUBSTR('Database Programming', INSTR('Database Programming','P'),20))\nFROM dual;":
		'PROGRAMMING',
	"You issue this SQL statement:\nSELECT INSTR ('organizational sales', 'al')\nFROM dual;\n\nWhich value is returned by this command?":
		'13',
	'Which of the following are types of SQL functions? (Choose two correct answers.)':
		'Multi-Row Functions|Single-Row Functions',
	'The answer to the following script is 456. True or False?\nSELECT TRUNC(ROUND(456.98))\nFROM dual;':
		'False',
	'You issue this SQL statement:\nSELECT ROUND (1282.248, -2) FROM dual;\nWhat value does this statement produce?':
		'1300',
	'You issue this SQL statement:\nSELECT TRUNC(751.367,-1) FROM dual;\nWhich value does this statement display?':
		'750',
	"If hire_date has a value of '03-Jul-2003', then what is the output from this code?\nSELECT ROUND(hire_date, 'Year') FROM employees;":
		'01-Jan-2004',
	'Which SELECT statement will return a numeric value?':
		'SELECT (SYSDATE - hire_date) / 7\nFROM employees;',
	'You need to subtract three months from the current date. Which function should you use?':
		'ADD_MONTHS',
	"What is the result of the following query?\nSELECT ADD_MONTHS ('11-Jan-1994',6)\nFROM dual;":
		'11-Jul-1994',
	'The PRICE table contains this data:\nPRODUCT_ID MANUFACTURER_ID\n86950  59604\n\nYou query the database and return the value 95. Which script did you use?':
		'SELECT SUBSTR(product_id, 3, 2)\nFROM price\nWHERE manufacturer_id = 59604;',
	"You need to display the number of characters in each customer's last name. Which function should you use?":
		'LENGTH',
	"Identify the output from the following SQL statement:\nSELECT RPAD('SQL',6, '*')\nFROM DUAL;":
		'SQL***',
	'The EMPLOYEES table contains these columns:\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nHIRE_DATE DATE\nEVAL_MONTHS NUMBER(3)\n\nEvaluate this SELECT statement:\n\nSELECT hire_date + eval_months\nFROM employees;\n\nThe values returned by this SELECT statement will be of which data type?':
		'DATE',
	'Which comparison operator retrieves a list of values?': 'IN',
	'Which SQL function is used to return the position where a specific character string begins within a larger character string?':
		'INSTR',
	'You query the database with this SQL statement:\nSELECT CONCAT(last_name, (SUBSTR(LOWER(first_name), 4))) "Default Password"\nFROM employees;\n\nWhich function will be evaluated first?':
		'LOWER',
	'What function would you use to return the highest date in a month?':
		'LAST_DAY',
	'Which of the following SQL statements will correctly display the last name and the number of weeks employed for all employees in department 90?':
		'SELECT last_name, (SYSDATE-hire_date)/7 AS WEEKS\nFROM employees\nWHERE department_id = 90;',
	'Which SQL function can be used to remove heading or trailing characters (or both) from a character string?':
		'TRIM',
	'Evaluate this SELECT statement:\nSELECT SYSDATE + 30\nFROM dual;\n\nWhich value is returned by the query?':
		'The current date plus 30 days.',
	'Which query would return a user password combining the ID of an employee and the first 4 digits of the last name?':
		'SELECT CONCAT (employee_id, SUBSTR(last_name,1,4))\nAS "User Passwords"\nFROM employees',
	'Which function would you use to return the current database server date and time?':
		'SYSDATE',
	'Which three statements about functions are true? (Choose three)':
		'The SYSDATE function returns the Oracle Server date and time.|The ROUND number function rounds a value to a specified decimal place or the nearest whole number.|The SUBSTR character function returns a portion of a string beginning at a defined character position to a specified length.',
	"You need to return a portion of each employee's last name, beginning with the first character up to the fifth character. Which character function should you use?":
		'SUBSTR',
	'Which query selects the first names of the DJ On Demand clients who have a first name beginning with "A"?':
		"SELECT UPPER(first_name)\nFROM d_clients\nWHERE LOWER(first_name) LIKE 'a%'",
	'You want to create a report that displays all orders and their amounts that were placed during the month of January. You want the orders with the highest amounts to appear first. Which query should you issue?':
		"SELECT orderid, total\nFROM orders\nWHERE order_date BETWEEN '01-Jan-2002' AND '31-Jan-2002'\nORDER BY total DESC;",
	"What will the following SQL statemtent display?\nSELECT last_name, LPAD(salary, 15, '$')SALARY\nFROM employees;":
		'The last name and salary for all employees with the format of the salary 15 characters long, left-padded with the $ and the column labeled SALARY.',
	'Evaluate this SELECT statement:\nSELECT LENGTH(email)\nFROM employee;\n\nWhat will this SELECT statement display?':
		'The number of characters for each value in the EMAIL column in the employees table',
	'Which character manipulation function always returns a numerical value?':
		'LENGTH',
	'Character functions accept character arguments and only return character values. True or False?':
		'False',
	'Which of the following SQL statements would correctly return a song title identified in the database as "All These Years"?':
		"WHERE title LIKE INITCAP('%all these years');",
	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9)\nLAST_NAME VARCHAR2 (25)\nFIRST_NAME VARCHAR2 (25)\nHIRE_DATE DATE\nYou need to display HIRE_DATE values in this format:\nJanuary 28, 2000\nWhich SQL statement could you use?':
		"SELECT TO_CHAR(hire_date, 'Month DD, YYYY')\nFROM employees;",
	'Sysdate is 12-May-2004. You need to store the following date: 7-Dec-89. Which statement about the date format for this value is true?':
		'The RR date format will interpret the year as 1989, and the YY date format will interpret the year as 2089',
	'The following statement returns 0 (zero). True or False?\nSELECT 121/NULL\nFROM dual;':
		'False',
	"If quantity is a number datatype, what is the result of this statement?\nSELECT NVL(200/quantity, 'zero')\nFROM inventory;":
		'The statement fails',
	'CASE and DECODE evaluate expressions in a similar way to IF-THEN-ELSE logic. However, DECODE is specific to Oracle syntax. True or False?':
		'True',
	"For the given data from Employees (last_name, manager_id) what is the result of the following statement:\nDATA:( King, null\nKochhar, 100\nDe Haan, 100\nHunold, 102\nErnst, 103)\nSELECT last_name,\nDECODE(manager_id, 100, 'King', 'A N Other') \"Works For?\"\nFROM employees":
		'King, A N Other\nKochhar, King\nDe Haan, King\nHunold, A N Other\nErnst, A N Other',
	'Which of the following is a conditional expression used in SQL?': 'CASE',
	"A table has the following definition: EMPLOYEES(\nEMPLOYEE_ID NUMBER(6) NOT NULL,\nNAME VARCHAR2(20) NOT NULL,\nMANAGER_ID VARCHAR2(6))\n\nand contains the following rows:\n\n(1001, 'Bob Bevan', '200')\n(200, 'Natacha Hansen', null)\n\nWill the folloiwng query work?\n\nSELECT *\nFROM employees\nWHERE employee_id = manager_id;":
		'Yes, Oracle will perform implicit datatype conversion, but the WHERE clause will not find any matching data.',
	'If you use the RR format when writing a query using the date 27-Oct-17 and the year is 2001, what year would be the result?':
		'2017',
	'Which arithmetic operation will return a numeric value?':
		"TO_DATE('01-Jun-2004') - TO_DATE('01-Oct-2004')",
	'Which SQL Statement should you use to display the prices in this format: "$00.30"?':
		"SELECT TO_CHAR(price, '$99,900.99')\nFROM product;",
	'Which two statements concerning SQL functions are true? (Choose two.)':
		'Conversion functions convert a value from one data type to another data type.|Not all date functions return date values.',
	'You need to display the HIRE_DATE values in this format: 25th of July 2002. Which SELECT statement would you use?':
		'SELECT TO_CHAR(hire_date, \'ddth "of" Month YYYY\')\nFROM employees;',
	'Which function compares two expressions?': 'NULLIF',
	'Which of the following General Functions will return the first non-null expression in the expression list?':
		'COALESCE',
	'When executed, which statement displays a zero if the TUITION_BALANCE value is zero and the HOUSING_BALANCE value is null?':
		'SELECT NVL (tuition_balance + housing_balance, 0) "Balance Due"\nFROM student_accounts;',
	'Which statement about group functions is true?':
		'Group functions ignore null values.|NVL, NVL2, and COALESCE can be used with group functions to replace null values.',
	'Consider the following data in the Employees table: (last_name, commission_pct, manager_id)\nDATA:\nKing, null, null\nKochhar, null, 100\nVargas, null, 124\nZlotkey, .2, 100\nWhat is the result of the following statement:\nSELECT last_name, COALESCE(commission_pct, manager_id, -1) comm\nFROM employees ;':
		'King, -1\nKochhar, 100\nVargas, 124\nZlotkey, .2',
	'You need to replace null values in the DEPT_ID column with the text N/A. Which functions should you use?':
		'TO_CHAR and NVL',
	"All Human Resources data is stored in a table named EMPLOYEES. You have been asked to create a report that displays each employee's name and salary. Each employee's salary must be displayed in the following format: $000,000.00. Which function should you include in a SELECT statement to achieve the desired result?":
		'TO_CHAR',
	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9)\nLAST_NAME VARCHAR2 (25)\nFIRST_NAME VARCHAR2 (25)\nHIRE_DATE DATE\n\nYou need to display HIRE_DATE values in this format:\n\nJanuary 28, 2000\n\nWhich SQL statement could you use?':
		"SELECT TO_CHAR(hire_date, 'Month DD, YYYY')\nFROM employees;",
	'Which statement is true about SQL functions?': 'a, b and c are true.',
	"The following script will run successfully. True or False?\nSELECT TO_CHAR(TO_DATE('25-Dec-2004','dd-Mon-yyyy'))\nFROM dual":
		'True',
	'Which three statements concerning explicit data type conversions are true? (Choose three.)':
		'Use the TO_NUMBER function to convert a character string of digits to a number.|Use the TO_CHAR function to convert a number or date value to a character string.|Use the TO_DATE function to convert a character string to a date value.',
	'With the following data in Employees (last_name, commission_pct, manager_id) what is the result of the following statement?\nDATA:\nKing, null, null\nKochhar, null, 100\nVargas, null, 124\nZlotkey, .2, 100\nSELECT last_name, NVL2(commission_pct, manager_id, -1) comm\nFROM employees ;':
		'King, -1\nKochhar, -1\nVargas, -1\nZlotkey, 100',
	"Which statement will return a listing of last names, salaries, and a rating of 'Low', 'Medium', 'Good' or 'Excellent' depending on the salary value?":
		"SELECT last_name,salary,\n(CASE WHEN salary<5000 THEN 'Low'\n     WHEN salary<10000 THEN 'Medium'\n     WHEN salary<20000 THEN 'Good'\n     ELSE 'Excellent'\nEND) qualified_salary\nFROM employees;",
	'Which functions allow you to perform explicit data type conversions?':
		'TO_CHAR, TO_DATE, TO_NUMBER',
	'Which statement will return the salary (for example, the salary of 6000) from the Employees table in the following format? $6000.00':
		"SELECT TO_CHAR(salary, '$99999.00') SALARY\nFROM employees",
	"The STYLES table contains this data:\nSTYLE_ID              STYLE_NAME     CATEGORY          COST\n895840                  SANDAL               85940                    12.00\n968950                  SANDAL               85909                    10.00\n869506                  SANDAL               89690                    15.00\n809090                  LOAFER                 89098                    10.00\n890890                  LOAFER                 89789                    14.00\n857689                  HEEL                      85940                    11.00\n758960                  SANDAL               86979\nEvaluate this SELECT statement:\n\nSELECT style_id, style_name, category, cost\nFROM styles\nWHERE style_name LIKE 'SANDAL' AND NVL(cost, 0) < 15.00\nORDER BY category, cost;\n\nWhich result will the query provide?":
		'STYLE_ID              STYLE_NAME     CATEGORY          COST\n968950                  SANDAL               85909                    10.00\n895840                  SANDAL               85940                    12.00\n758960                  SANDAL               86979',
	'Which statement concerning single row functions is true?':
		'Single row functions can be nested.',
	'What is the result of the following statement:\nSELECT last_name, COALESCE(commission_pct, manager_id, -1) comm\nFROM employees ;':
		'King, -1\nKochhar, 100\nVargas, 124\nZlotkey, .2',
	"The PRODUCT table contains this column: PRICE NUMBER(7,2)\nEvaluate this statement:\n\nSELECT NVL(10 / price, '0')\nFROM PRODUCT;\n\nWhat would happen if the PRICE column contains null values?":
		'A value of 0 would be displayed.',
	'What three statements are true about explicit data type conversions? (Select three.)':
		'Use the TO_DATE function to convert a character string to a date value.|Use the TO_CHAR function to convert a numeric or date value to a character string.|Use the TO_NUMBER function to convert a character string from digits to a number.',
	'Which best describes the TO_CHAR function?':
		'The TO_CHAR function can be used to display dates and numbers according to formatting conventions that are supported by Oracle.',
	"You have been asked to create a report that lists all customers who have placed orders of at least $2,500. The report's date should be displayed using this format:\nDay, Date Month, Year (For example, Tuesday, 13 April, 2004 ).\nWhich statement should you issue?":
		"SELECT companyname, TO_CHAR (sysdate, 'fmDay, dd Month, yyyy'), total\nFROM customers NATURAL JOIN orders\nWHERE total >= 2500;",
	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9)\nLAST_NAME VARCHAR2 (25)\nFIRST_NAME VARCHAR2 (25)\nSALARY NUMBER(6)\nYou need to create a report to display the salaries of all employees. Which SQL Statement should you use to display the salaries in format: "$45,000.00"?':
		"SELECT TO_CHAR(salary, '$999,999.00')\nFROM employees;",

	// Added DP Section 2 Quiz Questions (2026-05-25)
	'The BETWEEN operator is inclusive. True or False?': 'True',
	'When using the LIKE operator, which character represents a single character?': '_',
	'When using the LIKE operator, which character represents any number of characters (zero, one, or more)?': '%',
	'Which operator is used to search for values in a specified list?': 'IN',
	'Which logical operator requires both conditions to be true?': 'AND',
	'Which logical operator returns true if either condition is true?': 'OR',
	'Which comparison operator is used to test for NULL values?': 'IS NULL',
	'Arithmetic operators can be used in the SELECT and WHERE clauses. True or False?': 'True',
	'Character strings and date values in the WHERE clause must be enclosed in single quotation marks. True or False?': 'True',

	// More DP Section 2 Quiz Questions (2026-05-25)
	'The structure of the table can be displayed with the _________ command:':
		'Desc and the Describe',
	'Which of the following statements will work?':
		'SELECT first_name ||\' \'||last_name NAME, department_id DEPARTMENT, salary*12 "ANNUAL SALARY"\nFROM employees\nWHERE last_name = \'King\';',
	'You want to determine the orders that have been placed by customers who reside in the city of Chicago. You write this partial SELECT statement:\nSELECT orderid, orderdate, total\nFROM orders;\nWhat should you include in your SELECT statement to achieve the desired results?':
		'WHERE city = \'Chicago\';',
	'What will be the result of the SELECT statement and what will display?\nSELECT last_name, salary, salary + 300\nFROM employees;':
		'Display the last name, salary, and the results of adding 300 to each salary for all the employees',
	'Which of the following is NOT BEING DONE in this SQL statement?\nSELECT first_name || \' \' || last_name "Name"\nFROM employees;':
		'Concatenating first name, middle name and last name',
	'Which query would give the following result?\nLAST_NAME FIRST_NAME DEPARTMENT_ID\nKing Steven 90':
		'SELECT last_name, first_name, department_id\nFROM employees\nWHERE last_name = \'King\';',
	'The following is a valid SQL SELECT statement. True or False?\nSELECT first_name || \' \' || last_name alias AS Employee_Name\nFROM employees;':
		'False',
	'Evaluate this SELECT statement:\nSELECT *FROM employeesWHERE department_id IN(10, 20, 30)AND salary > 20000;\nWhich values would cause the logical condition to return TRUE?':
		'DEPARTMENT_ID = 10 and SALARY = 20001',

	// Added DP Section 3 Quiz Questions (2026-05-25)
	'You query the database with this SQL statement:SELECT price FROM products WHERE price IN(1, 25, 50, 250) AND (price BETWEEN 25 AND 40 OR price > 50);Which two values could the statement return? (Choose Two)':
		'25|250',

	// Section 7 - SQL Joins from DeniAce Blog (2026-05-25)
	'S7J Q1 Evaluate this SQL statement:\nSELECT e.employee_id, e.last_name, e.first_name, d.department_name\nFROM employees e, departments d\nWHERE e.department_id = d.department_id AND employees.department_id > 5000\nORDER BY 4;\n\nWhich clause contains a syntax error?':
		'AND employees.department_id > 5000',
	'S7J Q2 When must column names be prefixed by table names in join syntax?':
		'When the same column name appears in more than one table of the query',
	'S7J Q3 If table A has 10 rows and table B has 5 rows, how many rows will be returned if you perform a cartesian join on those two tables?':
		'50',
	'S7J Q4 What is produced when a join condition is not specified in a multiple-table query using Oracle proprietary Join syntax?':
		'A Cartesian product',
	'S7J Q5 The CUSTOMERS and SALES tables contain these columns:\nCUSTOMERS\nCUST_ID NUMBER(10) PRIMARY KEY\nCOMPANY VARCHAR2(30)\nLOCATION VARCHAR2(20)\n\nSALES\nSALES_ID NUMBER(5) PRIMARY KEY\nCUST_ID NUMBER(10) FOREIGN KEY\nTOTAL_SALES NUMBER(30)\n\nWhich SELECT statement will return the customer ID, the company and the total sales?':
		'SELECT c.cust_id, c.company, s.total_sales\nFROM customers c, sales s\nWHERE c.cust_id = s.cust_id;',
	'S7J Q6 You have the following EMPLOYEES table:\nEMPLOYEE_ID NUMBER(5) NOT NULL PRIMARY KEY\nFIRST_NAME VARCHAR2(25)\nLAST_NAME VARCHAR2(25)\nADDRESS VARCHAR2(35)\nCITY VARCHAR2(25)\nSTATE VARCHAR2(2)\nZIP NUMBER(9)\nTELEPHONE NUMBER(10)\nDEPARTMENT_ID NUMBER(5) NOT NULL FOREIGN KEY\n\nThe BONUS table includes the following columns:\nBONUS_ID NUMBER(5) NOT NULL PRIMARY KEY\nANNUAL_SALARY NUMBER(10)\nBONUS_PCT NUMBER(3, 2)\nEMPLOYEE_ID VARCHAR2(5) NOT NULL FOREIGN KEY\n\nYou want to determine the amount of each employee\'s bonus as a calculation of salary times bonus. Which of the following queries should you issue?':
		'SELECT e.first_name, e.last_name, b.annual_salary * b. bonus_pct\nFROM employees e, bonus b\nWHERE e.employee_id = b.employee_id;',
	'S7J Q7 The ID column in the CLIENT table that corresponds to the CLIENT_ID column of the ORDER table contains null values for rows that need to be displayed. Which type of join should you use to display the data?':
		'Outer join',
	'S7J Q8 Using Oracle Proprietary join syntax, which two operators can be used in an outer join condition using the outer join operator (+)?':
		'AND and =',
	'S7J Q9 You need to join the EMPLOYEES table and the SCHEDULES table, but the two tables do not have any corresponding columns. Which type of join will you create?':
		'A non-equijoin',
	'S7J Q10 Using Oracle Proprietary join syntax, which operator would you use after one of the column names in the WHERE clause when creating an outer join?':
		'(+)',
	'S7J Q11 Which statement about outer joins is true?':
		'The OR operator cannot be used to link outer join conditions.',
	'S7J Q12 The following is a valid outer join statement:\nSELECT c.country_name, d.department_name\nFROM countries c, departments d\nWHERE c.country_id (+) = d.country_id (+)\n\nTrue or False?':
		'False',
	'S7J Q13 What is the result of a query that selects from two tables but includes no join condition?':
		'A Cartesian product',
	'S7J Q14 Which statement about the join syntax of an Oracle Proprietary join syntax SELECT statement is true?':
		'The WHERE clause represents the join criteria.',
	'S7J Q15 If table A has 10 rows and table B has 5 rows, how many rows will be returned if you perform an equi-join on those two tables?':
		'It depends on how many rows have matching data in each of the two tables.',
	'S7J Q16 The PATIENTS and DOCTORS tables contain these columns:\nPATIENTS\nPATIENT_ID NUMBER(9)\nLAST_NAME VARCHAR2 (20)\nFIRST_NAME VARCHAR2 (20)\n\nDOCTORS\nDOCTOR_ID NUMBER(9)\nLAST_NAME VARCHAR2 (20)\nFIRST_NAME VARCHAR2 (20)\n\nYou issue this statement:\nSELECT patient_id, doctor_id\nFROM patients, doctors;\n\nWhich result will this statement provide?':
		'A report containing all possible combinations of the PATIENT_ID and DOCTOR_ID values',
	'S7J Q17 Which statement about joining tables with a non-equijoin is false?':
		'A WHERE clause must specify a column in one table that is compared to a column in the second table',
	'S7J Q18 To perform a valid outer join between DEPARTMENTS and EMPLOYEES to list departments without employees, select the correct WHERE clause for the following select statement:\nSELECT d.department_name, e.last_name\nFROM employees e, departments d\nWHERE':
		'e.department_id(+) = d.department_id',
	'S7J Q19 The EMPLOYEE_ID column in the EMPLOYEES table corresponds to the EMPLOYEE_ID column of the ORDERS table.\nThe EMPLOYEE_ID column in the ORDERS table contains null values for rows that you need to display.\nWhich type of join should you use to display the data?':
		'Outer join',
	'S7J Q20 Oracle proprietary JOINS can use the WHERE clause for conditions other than the join-condition. True or False?':
		'True',
	'S7J Q21 What is the minimum number of join conditions required to join 5 tables together?':
		'4',
	'S7J Q22 Nonequijoins are normally used with which of the following? (Choose Two)':
		'Ranges of numbers|Ranges of dates',

	'The AVG, SUM, VARIANCE, and STDDEV functions can be used with which of the following?':
		'Only numeric data types',

	'Which aggregate function can be used on a column of the DATE data type?':
		'MAX',

	'Group functions return a value for ________________ and ________________ null values in their computations.':
		'a row set, ignore',

	'The TRUCKS table contains these columns:\nTRUCKS:\nTYPE VARCHAR2(30)\nYEAR DATE\nMODEL VARCHAR2(20)\nPRICE NUMBER(10)\n\nWhich SELECT statement will return the average price for the 4x4 model?':
		"SELECT AVG(price) FROM trucks WHERE model = '4x4';",

	'The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(9)\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nSALARY NUMBER(7,2)\nDEPARTMENT_ID NUMBER(9)\n\nYou need to display the number of employees whose salary is greater than $50,000. Which SELECT would you use?':
		'SELECT COUNT(*) FROM employees WHERE salary > 50000;',

	'Evaluate this SQL statement:\nSELECT COUNT (amount)\nFROM inventory;\n\nWhat will occur when the statement is issued?':
		'The statement will count the number of rows in the INVENTORY table where the AMOUNT column is not null.',

	'To include null values in the calculations of a group function, you must:':
		'Convert the null to a value using the NVL( ) function',

	'Which statement about the COUNT function is true?':
		'The COUNT function always ignores null values by default.',

	'Which SELECT statement will calculate the number of rows in the PRODUCTS table?':
		'SELECT COUNT (*) FROM products;',

	'Examine the data in the PAYMENT table:\nPAYMENT_ID CUSTOMER_ID PAYMENT_DATE PAYMENT_TYPE PAYMENT_AMOUNT\n86590586 8908090 10-Jun-2003 BASIC 859.00\n89453485 8549038 15-Feb-2003 INTEREST 596.00\n85490345 5489304 20-Mar-2003 BASIC 568.00\n\nYou need to determine the average payment amount made by each customer in January, February, and March of 2003.\nWhich SELECT statement should you use?':
		"SELECT AVG(payment_amount) FROM payment WHERE payment_date BETWEEN '01-Jan-2003' AND '31-Mar-2003';",

	'Group functions can avoid computations involving duplicate values by including which keyword?':
		'DISTINCT',

	'You need to calculate the average salary of employees in each department. Which group function will you use?':
		'AVG',

	'Which group function would you use to display the total of all salary values in the EMPLOYEES table?':
		'SUM',

	'Which group function would you use to display the lowest value in the SALES_AMOUNT column?':
		'MIN',

	'You need to compute the total salary amount for all employees in department 10. Which group function will you use?':
		'SUM',

	'The PRODUCTS table contains these columns:\n\nPROD_ID NUMBER(4)\nPROD_NAME VARCHAR2(30)\nPROD_CAT VARCHAR2(30)\nPROD_PRICE NUMBER(3)\nPROD_QTY NUMBER(4)\n\nThe following statement is issued:\n\nSELECT AVG(prod_price, prod_qty)\nFROM products;\n\nWhat happens when this statement is issued?':
		'An error occurs.',

	'Examine the following statement:\nSELECT department_id, manager_id, job_id, SUM(salary)\nFROM employees\nGROUP BY GROUPING SETS((department_id, manager_id), (department_id, job_id))\n\nWhat data will this query generate?':
		'Sum of salaries for (department_id, job_id) and (department_id, manager_id)',

	'Examine the following statement:\nSELECT department_id, manager_id, job_id, SUM(salary)\nFROM employees\nGROUP BY ROLLUP(department_id, manager_id)\n\nWhat extra data will this query generate?':
		'The statement will fail.',

	'You use ROLLUP to:':
		'produce subtotal values',

	'CUBE will cross-reference the columns listed in the ______ clause to create a superset of groups.':
		'GROUP BY',

	'Which of the following are correct SET operators? (choose two)':
		'UNION, MINUS|UNION ALL, INTERSECT',

	'The ___________ operator returns all rows from both tables, after eliminating duplicates.':
		'UNION',

	'To control the order of rows returned using SET operators, the ORDER BY clause is used ______ and is placed in the _____ SELECT statement of the query.':
		'ONCE; LAST',

	'Is the following statement correct?\nSELECT first_name, last_name, salary, department_id, COUNT(employee_id)\nFROM employees\nWHERE department_id = 50\nGROUP BY last_name, first_name, department_id;':
		'No, because the statement is missing salary in the GROUP BY clause',

	'What will the following SQL Statement do?\nSELECT job_id, COUNT(*)\nFROM employees\nGROUP BY job_id;':
		'Displays each job id and the number of people assigned to that job id',

	'The PLAYERS table contains these columns:\nPLAYER_ID NUMBER PK\nPLAYER_NAME VARCHAR2(30)\nTEAM_ID NUMBER\nHIRE_DATE DATE\nSALARY NUMBER(8,2)\n\nWhich clauses represent valid uses of aggregate functions? (Choose three.)':
		'SELECT AVG(NVL(salary, 0))|ORDER BY AVG(salary)|HAVING MAX(salary) > 10000',

	'The EMPLOYEES table contains these columns:\nID_NUMBER NUMBER Primary Key\nNAME VARCHAR2 (30)\nDEPARTMENT_ID NUMBER\nSALARY NUMBER (7,2)\nHIRE_DATE DATE\n\nEvaluate this SQL statement:\nSELECT id_number, name, department_id, SUM(salary)\nFROM employees\nWHERE salary > 25000\nGROUP BY department_id, id_number, name\nORDER BY hire_date;\n\nWhy will this statement cause an error?':
		'The HIRE_DATE column is NOT included in the GROUP BY clause.',

	'What is the best explanation as to why this SQL statement will NOT execute?\nSELECT department_id "Department", AVG (salary)"Average"\nFROM employees\nGROUP BY Department;':
		'You cannot use a column alias in the GROUP BY clause.',

	'The PRODUCTS table contains these columns:\nPROD_ID NUMBER(4)\nPROD_NAME VARCHAR(20)\nPROD_CAT VARCHAR2(15)\nPROD_PRICE NUMBER(5)\nPROD_QTY NUMBER(4)\n\nYou need to identify the minimum product price in each product category.\nWhich statement could you use to accomplish this task?':
		'SELECT prod_cat, MIN (prod_price) FROM products GROUP BY prod_cat;',

	'Evaluate this statement:\nSELECT department_id, AVG(salary)\nFROM employees\nWHERE job_id <> 69879\nGROUP BY job_id, department_id\nHAVING AVG(salary) > 35000\nORDER BY department_id;\n\nWhich clauses restricts the result? Choose two.':
		'WHERE job_id <> 69879|HAVING AVG(salary) > 35000',

	'Evaluate this SELECT statement:\nSELECT COUNT(employee_id), department_id\nFROM employees\nGROUP BY department_id;\n\nYou only want to include employees who earn more than 15000.\nWhich clause should you include in the SELECT statement?':
		'WHERE salary > 15000',

	'You use GROUPING functions to:':
		'Identify the extra row values created by either a ROLLUP or CUBE operation',

	'You use GROUPING functions to ______ database rows from tabulated rows.':
		'DISTINGUISH',

	'When using SET operators, the names of the matching columns must be identical in all of the SELECT statements used in the query. True or False?':
		'False',

	'Which of the following SQL statements could display the number of people with the same last name:\nSELECT last_name, COUNT(last_name)\nFROM EMPLOYEES\nGROUP BY last_name;':
		'SELECT last_name, COUNT(last_name) FROM EMPLOYEES GROUP BY last_name;',

	'How would you alter the following query to list only employees where two or more employees have the same last name?\nSELECT last_name, COUNT(employee_id)\nFROM EMPLOYEES\nGROUP BY last_name;':
		'SELECT last_name, COUNT(last_name) FROM EMPLOYEES GROUP BY last_name HAVING COUNT(last_name) > 1;',

	'You need to display the number of unique types of manufacturers at each location. Which SELECT statement should you use?\nSELECT location_id, COUNT(DISTINCT type)\nFROM manufacturer;':
		'SELECT location_id, COUNT(DISTINCT type) FROM manufacturer GROUP BY location_id;',

	'Which SELECT statement could you use to display the number of times each customer payment was made between January 1, 2003 and June 30, 2003 ?\nSELECT customer_id, COUNT(payment_id)\nFROM payment\nWHERE payment_date BETWEEN \'01-Jan-2003\' AND \'30-Jun-2003\';':
		'SELECT customer_id, COUNT(payment_id) FROM payment WHERE payment_date BETWEEN \'01-Jan-2003\' AND \'30-Jun-2003\' GROUP BY customer_id;',

	'Can group functions be nested at a depth of?':
		'Two',

	'Which group function would you use to display the average price of all products in the PRODUCTS table?':
		'AVG',

	'What two group functions can be used with any datatype?':
		'MIN, MAX',

	'You need to calculate the standard deviation for the cost of products produced in the Birmingham facility. Which group function will you use?':
		'STDDEV',

	'You attempt to query the database with this SQL statement:\nSELECT product_id "Product Number", category_id "Category", price "Price"\nFROM products\nWHERE "Category" = 5570\nORDER BY "Product Number";\n\nThis statement fails when executed. Which clause contains a syntax error?':
		'WHERE',

	'You query the database with this SQL statement:\nSELECT price\nFROM products\nWHERE price IN(1, 25, 50, 250)\nAND (price BETWEEN 25 AND 40 OR price > 50);\n\nWhich two values could the statement return? (Choose two.)':
		'25|250',

	'The STYLES table contains this data:\nSTYLE_ID STYLE_NAME CATEGORY COST\n895840 SANDAL 85940 12.00\n968950 SANDAL 85909 10.00\n869506 SANDAL 89690 15.00\n809090 LOAFER 89098 10.00\n890890 LOAFER 89789 14.00\n857689 HEEL 85940 11.00\n758960 SANDAL 86979\n\nYou issue this SELECT statement:\nSELECT COUNT(category)\nFROM styles;\n\nWhich value is displayed?':
		'7',

	'Using your existing knowledge of the employees table, would the following two statements produce the same result?\nSELECT COUNT(*)\nFROM employees;\n\nSELECT COUNT(commission_pct)\nFROM employees;':
		'No',

	'Given the following data in the employees table (employee_id, salary, commission_pct)\nDATA:\n(143, 2600, null\n144, 2500, null\n149, 10500, .2\n174, 11000, .3\n176, 8600, .2\n178, 7000, .15)\n\nWhat is the result of the following statement:\n\nSELECT AVG(commission_pct)\nFROM employees\nWHERE employee_id IN( 143,144,149,174,176,178);':
		'0.2125',

	'The PLAYERS and TEAMS tables contain these columns:\nPLAYERS\nPLAYER_ID NUMBER NOT NULL, PRIMARY KEY\nLAST_NAME VARCHAR2 (30) NOT NULL\nFIRST_NAME VARCHAR2 (25) NOT NULL\nTEAM_ID NUMBER\nPOSITION VARCHAR2 (25)\n\nTEAMS\nTEAM_ID NUMBER NOT NULL, PRIMARY KEY\nTEAM_NAME VARCHAR2 (25)\n\nYou need to create a report that lists the names of each team with more than three goal keepers.\nWhich SELECT statement will produce the desired result?':
		'SELECT t.team_name, COUNT(p.player_id)\nFROM players p\nJOIN teams t ON (p.team_id = t.team_id)\nWHERE UPPER(p.position) = \'GOAL KEEPER\'\nGROUP BY t.team_name\nHAVING COUNT(p.player_id) > 3;',

	'GROUPING SETS is another extension to the GROUP BY clause and is used to specify multiple groupings of data but provide a single result set. True or False?':
		'True',

	'MINUS will give you rows from the first query that are not present in the second query. (True or False?)':
		'True',

	'Is the following statement correct?\nSELECT department_id, AVG(salary)\nFROM employees;':
		'No, because a GROUP BY department_id clause is needed',


	// Section 10 Quiz Questions Added Automatically
	'A multiple-row operator expects how many values?':
		'One or more',

	'The salary column of the f_staffs table contains the following values: 4000 5050 6000 11000 23000 Which of the following statements will return the last_name and first_name of those employees who earn more than 5000?':
		'SELECT last_name, first_name FROM f_staffs WHERE salary IN (SELECT salary FROM f_staffs WHERE salary > 5000);',

	'Examine the data in the PAYMENT table: PAYMENT_ID CUSTOMER_ID PAYMENT_DATE PAYMENT_TYPE PAYMENT_AMOUNT 86590586 8908090 10-Jun-2003 BASIC 859.00 89453485 8549038 15-Feb-2003 INTEREST 596.00 85490345 5489304 20-Mar-2003 BASIC 568.00 This statement fails when executed: SELECT customer_id, payment_type FROM payment WHERE payment_id = (SELECT payment_id FROM payment WHERE payment_amount = 596.00 OR payment_date = \'20-Mar-2003\'); Which change could correct the problem?':
		'Change the outer query WHERE clause to \'WHERE payment_id IN\'.',

	'Which of the following statements contains a comparison operator that is used to restrict rows based on a list of values returned from an inner query? SELECT description FROM d_types WHERE code IN (SELECT type_code FROM d_songs); SELECT description FROM d_types WHERE code = ANY (SELECT type_code FROM d_songs); SELECT description FROM d_types WHERE code <> ALL (SELECT type_code FROM d_songs);':
		'All of the above.',

	'Group functions can be used in multiple-row subqueries in the HAVING and GROUP BY clauses. True or False?':
		'True',

	'The SQL multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators? IN, ANY, and EVERY IN, ALL, and EVERY IN, ANY, and EQUAL':
		'IN, ANY, and ALL',

	'Which statement about the <> operator is true? The <> operator can be used':
		'The <> operator can be used when a single-row subquery returns only one row.',

	'Single row subqueries may not include this operator: > <>':
		'ALL',

	'Examine the structure of the EMPLOYEE, DEPARTMENT, and ORDERS tables. EMPLOYEE: EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) DEPARTMENT_ID NUMBER(9) DEPARTMENT: DEPARTMENT_ID NUMBER(9) DEPARTMENT_NAME VARCHAR2(25) CREATION_DATE DATE ORDERS: ORDER_ID NUMBER(9) EMPLOYEE_ID NUMBER(9) DATE DATE CUSTOMER_ID NUMBER(9) You want to display all employees who had an order after the Sales department was established. Which of the following constructs would you use?':
		'A single-row subquery',

	'If you use the equality operator (=) with a subquery, how many values can the subquery return?':
		'Only 1',

	'The TEACHERS and CLASS_ASSIGNMENTS tables contain these columns: TEACHERS TEACHER_ID NUMBER(5) Primary Key NAME VARCHAR2 (25) SUBJECT_ID NUMBER(5) CLASS_ID NUMBER(5) CLASS_ASSIGNMENTS CLASS_ID NUMBER (5) Primary Key TEACHER_ID NUMBER (5) DATE MAX_CAPACITY NUMBER (3) All MAX_CAPACITY values are greater than 10. Which two SQL statements correctly use subqueries? (Choose two.)':
		'SELECT * FROM teachers WHERE teacher_id = (SELECT teacher_id FROM class_assignments WHERE class_id = 45963);|SELECT * FROM class_assignments WHERE max_capacity = (SELECT AVG(max_capacity) FROM class_assignments);',

	'Which operator can be used with a multiple-row subquery? LIKE':
		'IN',

	'Which answer is INCORRECT? The parent statement of a correlated subquery can be: A SELECT statement A DELETE statement An UPDATE statement':
		'An INSERT statement',

	'The Oracle server performs a correlated subquery when the subquery references a column from a table referred to in the parent. True or False?':
		'True',

	'In a non-correlated subquery, the outer query always executes prior to the inner query\'s execution. True or False? True':
		'False',

	'Subqueries are limited to four per SQL transaction. True or False? True':
		'False',

	'Which statement about subqueries is true? Subqueries should be enclosed in double quotation marks. Subqueries generally execute last, after the main or outer query executes. Subqueries cannot contain group functions. Subqueries are often used in a WHERE':
		'clause to return values for an unknown conditional value.',

	'When creating a report of all employees earning more than the average salary for their department, a __________ ____________ can be used to first calculate the average salary of each department, and then compare the salary for each employee to the average salary of that employeeﾒs department. WITH CLAUSE GROUP BY':
		'CORRELATED SUBQUERY',

	'Which statement is false? The WITH clause retrieves the results of one or more query blocks. The WITH clause stores the results for the user who runs the query. The WITH clause decreases':
		'The WITH clause decreases performance.',

	'Correlated Subqueries must reference the same tables in both the inner and outer queries. (True or False?) True':
		'False',

	'When a multiple-row subquery uses the NOT IN operator (equivalent to <>ALL), if one of the values returned by the inner query is a null value, the entire query returns: All rows that were selected by the inner query including the null values':
		'No rows returned',

	'You need to create a SELECT statement that contains a multiple-row subquery. Which comparison operator(s) can you use?':
		'IN, ANY, and ALL',

	'You are looking for Executive information using a subquery. What will the following SQL statement display? SELECT department_id, last_name, job_id FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE department_name = \'Executive\');':
		'job ID for every employee in the Executive department',

	'Evaluate the structure of the EMPLOYEES and DEPART_HIST tables: EMPLOYEES EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) DEPARTMENT_ID NUMBER(9) MANAGER_ID NUMBER(9) SALARY NUMBER(7,2) DEPART_HIST: EMPLOYEE_ID NUMBER(9) OLD_DEPT_ID NUMBER(9) NEW_DEPT_ID NUMBER(9) CHANGE_DATE DATE You want to generate a list of employees who are in department 10, but used to be in department 15. Which query should you use?':
		'SELECT employee_id, last_name, first_name, department_id FROM employees WHERE (employee_id, department_id) IN (SELECT employee_id, new_dept_id FROM depart_hist WHERE old_dept_id = 15);|FROM depart_hist WHERE old_dept_id = 15',

	'Which of the following best describes the meaning of the ANY operator? Equal to any member in the list Equal to each value in the list Compare value to the first value returned by the subquery Compare value to each value returned':
		'Compare value to each value returned by the subquery',

	'Oracle allows you to write named subqueries in one single statement, as long as you start your statement with the keyword WITH. True or False?':
		'True',

	'Which statement is false? The WITH clause decreases':
		'The WITH clause decreases performance.',

	'Subqueries can only be placed in the WHERE clause. True or False? True':
		'False',

	'Which operator can be used with a multiple-row subquery?':
		'IN',

	'Using a subquery in which clause will return a syntax error? WHERE FROM HAVING You can use subqueries in all of the':
		'above clauses.',

	'Which comparison operator can only be used with a single-row subquery? IN':
		'<>',

	'You need to produce a report that contains all employee-related information for those employees who have Brad Carter as a supervisor. However, you are not sure which supervisor ID belongs to Brad Carter. Which query should you issue to accomplish this task?':
		'SELECT * FROM employees WHERE supervisor_id = (SELECT employee_id FROM employees WHERE last_name = \'Carter\');',

	'Which operator or keyword cannot be used with a multiple-row subquery? >':
		'=',

	'When a multiple-row subquery uses the NOT IN operator (equivalent to <>ALL), if one of the values returned by the inner query is a null value, the entire query returns: A list of Nulls':
		'No rows returned',

	'Evaluate this SQL statement: SELECT employee_id, last_name, salary FROM employees WHERE department_id IN (SELECT department_id FROM employees WHERE salary > 30000 AND salary < 50000); Which values will be displayed?':
		'All employees who work in a department with employees who earn more than $30,000, but less than $50,000.',

	'The SQL multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators?':
		'IN, ANY, and ALL',

	'The WITH clause is a way of creating extra tables in the database. (True or False?)':
		'False',

	'In a correlated subquery, the outer and inner queries are joined on one or more columns. (True or False?)':
		'True',

	'If a single-row subquery returns a null value and uses the equality comparison operator, what will the outer query return? All the rows in the table':
		'No rows',

	'The SQL multiple-row subquery extends the capability of the single-row syntax through the use of which three comparison operators? IN, ANY, and EQUAL':
		'IN, ANY, and ALL',

	'Which comparison operator would you use to compare a value to every value returned by a subquery? IN ANY SOME':
		'ALL',

	'You need to display all the players whose salaries are greater than or equal to John Brown\'s salary. Which comparison operator should you use? = <=':
		'>=',

	'What will the following statement return: SELECT last_name, salary FROM employees WHERE salary < (SELECT salary FROM employees WHERE employee_id = 103);':
		'employees who make less than employee 103',

	'Which of the following is TRUE regarding the order of subquery execution? The subquery executes once after the main query. The result of the main query is used with the subquery. The subquery executes once before':
		'the main query.',

	'If a single-row subquery returns a null value and uses the equality comparison operator, what will the outer query return?':
		'No rows',

	'The result of this statement will be: SELECT last_name, job_id, salary, department_id FROM employees WHERE job_id = (SELECT job_id FROM employees WHERE employee_id = 141) AND department_id = (SELECT department_id FROM departments WHERE location_id =1500);':
		'matches employee 141 and who work in location 1500',

	'Which answer is INCORRECT? The parent statement of a correlated subquery can be:':
		'An INSERT statement',

	'The WITH clause enables a SELECT statement to define the subquery block at the start of the query, process the block just once, label the results, and then refer to the results multiple times. True or False?':
		'True',

	'Which of the following statements is a true guideline for using subqueries?':
		'The outer and inner queries can reference more than one table. They can get data from different tables.',

	'Evaluate this SELECT statement: SELECT customer_id, name FROM customer WHERE customer_id IN (SELECT customer_id FROM customer WHERE state_id = \'GA\' AND credit_limit > 500.00); What would happen if the inner query returned null?':
		'No rows would be returned by the outer query.',

	'Which statement about the ANY operator, when used with a multiple-row subquery, is true? The ANY operator is a synonym for the ALL operator. The ANY operator can be used with the LIKE and IN operators. The ANY operator compares every':
		'The ANY operator compares a value to each value returned by the subquery.',

	'Multiple-row subqueries must have NOT, IN, or ANY in the WHERE clause of the inner query. True or False? True':
		'False',

	'null, null, {}); Unknown30 Desember 2017 pukul 01.25 A correlated subquery is evaluated _____ for each row processed by the parent statement.':
		'ONCE',

	'Balasan Balas Gananjay Thanekar5 Agustus 2020 pukul 23.33 1- A correlated subquery will _______ a candidate row from an outer query, _______ the inner query using candidate row value, and _______ values from the inner query to qualify or disqualify the candidate row. ROLLUP; GRANT; DROP DELETE; UPDATE; INSERT':
		'GET; EXECUTE; USE',

	'Balasan Balas announ18 Agustus 2021 pukul 13.05 What is wrong with the following query? SELECT employee_id, last_name FROM employees WHERE salary = (SELECT MIN(salary) FROM employees GROUP BY department_id);':
		'Subquery returns more than one row and single row comparison operator is used.|The results of the inner query are returned to the outer query.|You need to display all the orders that were placed on the same day as order number 25950.',

	'Balasan Balas Unknown3 April 2022 pukul 18.05 Which best describes a multiple-row subquery?':
		'A query that returns one or more rows from the inner SELECT statement',

	'Balasan Balas Unknown8 April 2022 pukul 01.34 14. The EMPLOYEES and ORDERS tables contain these columns: EMPLOYEES EMPLOYEE_ID NUMBER(10) NOT NULL PRIMARY KEY FIRST_NAME VARCHAR2(30) LAST_NAME VARCHAR2(30) ADDRESS VARCHAR2(25) CITY VARCHAR2(20) STATE VARCHAR2(2) ZIP NUMBER(9) TELEPHONE NUMBER(10) ORDERS ORDER_ID NUMBER(10) NOT NULL PRIMARY KEY EMPLOYEE_ID NUMBER(10) NOT NULL FOREIGN KEY ORDER_DATE DATE TOTAL NUMBER(10) Which SELECT statement will return all orders generated by a sales representative named Franklin during the year 2001? SELECT order_id, total FROM ORDERS WHERE employee_id = (SELECT employee_id FROM employees WHERE last_name = \'Franklin\')':
		'SELECT order_id, total FROM ORDERS WHERE employee_id = (SELECT employee_id FROM employees WHERE last_name = \'Franklin\') AND order_date BETWEEN \'01-Jan-2001\' AND \'31-Dec-2001\';',

	'Balasan Balas Unknown1 Mei 2024 pukul 23.54 Which best describes a single-row subquery? A query that returns one or more rows from the inner SELECT statement':
		'A query that returns only one row from the inner SELECT statement',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.05 Examine the data in the PAYMENT table: > > > > PAYMENT_ID CUSTOMER_ID PAYMENT_DATE PAYMENT_TYPE PAYMENT_AMOUNT 86590586 8908090 10-Jun-2003 BASIC 859.00 89453485 8549038 15-Feb-2003 INTEREST 596.00 85490345 5489304 20-Mar-2003 BASIC 568.00 This statement fails when executed: SELECT payment_date, customer_id, payment_amount FROM payment WHERE payment_id = (SELECT payment_id FROM payment WHERE payment_date >= \'05-Jan-2002\' OR payment_amount > 500.00); Which change could correct the problem? Remove the subquery WHERE clause. Remove the single quotes around the date value in the inner query WHERE clause. Include the PAYMENT_ID column in the select list of the outer query.':
		'Change the outer query WHERE clause to \'WHERE payment_id IN\'.',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.05 There can be more than one subquery returning information to the outer query. True or False?':
		'True',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.06 What will the following statement return: SELECT last_name, salary FROM employees WHERE (department_id, job_id) = (SELECT department_id, job_id FROM employees WHERE employee_id = 103)':
		'A list of last_names and salaries of employees that works in the same department and has the same job_id as that of employee 103.',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.13 Evaluate this SELECT statement: SELECT student_id, last_name, first_name FROM student WHERE major_id NOT IN (SELECT major_id FROM majors WHERE department_head_id = 30 AND title = \'ADJUNCT\'); What would happen if the inner query returned a NULL value row? All the rows in the STUDENT table would be displayed.':
		'No rows would be returned from the STUDENT table.',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.18 In a subquery, the ALL operator compares a value to every value returned by the inner query. True or False?':
		'True',

	'Balasan Balas Unknown2 Mei 2024 pukul 00.19 If the subquery returns no rows, will the outer query return any values? Yes, Oracle will find the nearest value and rewrite your statement implicitly when you run it.':
		'No, because the subquery will be treated like a null value.',

	'Balasan Balas Unknown2 Mei 2024 pukul 01.13 Which of the following is a valid reason why the query below will not execute successfully? SELECT employee_id, last_name, salary FROM employees WHERE department_id = (SELECT department_id FROM employees WHERE last_name like \'%u%\');':
		'A single, rather than a multiple value operator was used.',

	'Balasan Balas Unknown2 Mei 2024 pukul 01.13 What would happen if you attempted to use a single-row operator with a multiple-row subquery? No rows will be selected. The data returned may or may not be correct.':
		'An error would be returned.',

	'Balasan Balas Unknown2 Mei 2024 pukul 01.17 Group functions can be used in subqueries even though they may return many rows. True or False?':
		'True',

	'Balasan Balas galih6 Juli 2024 pukul 03.21 What will the following statement return: SELECT last_name, salary FROM employees WHERE salary < (SELECT salary FROM employees WHERE employee_id = 103);':
		'A list of last_names and salaries of employees who make less than employee 103',

	'Balasan Balas galih6 Juli 2024 pukul 03.29 10. Evaluate the structure of the EMPLOYEES and DEPART_HIST tables: EMPLOYEES EMPLOYEE_ID NUMBER(9) LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) DEPARTMENT_ID NUMBER(9) MANAGER_ID NUMBER(9) SALARY NUMBER(7,2) DEPART_HIST: EMPLOYEE_ID NUMBER(9) OLD_DEPT_ID NUMBER(9) NEW_DEPT_ID NUMBER(9) CHANGE_DATE DATE You want to generate a list of employees who are in department 10, but used to be in department 15. Which query should you use? SELECT employee_id, last_name, first_name, department_id FROM employees WHERE (employee_id, department_id) IN (SELECT employee_id, new_dept_id FROM depart_hist':
		'SELECT employee_id, last_name, first_name, department_id FROM employees WHERE (employee_id, department_id) IN (SELECT employee_id, new_dept_id FROM depart_hist WHERE old_dept_id = 15);|FROM depart_hist WHERE old_dept_id = 15',

	'Balasan Balas GenEtika30 Oktober 2024 pukul 00.36 Which statement about single-row and multiple-row subqueries is true? Multiple-row subqueries can be used with both single-row and multiple-row operators. Multiple-row subqueries can only be used in SELECT statements. Single-row operators can be used with both single-row and multiple-row subqueries.':
		'Multiple-row subqueries cannot be used with the LIKE operator.',


	'Examine the data in the PAYMENT table:\nPAYMENT_ID CUSTOMER_ID PAYMENT_DATE PAYMENT_TYPE PAYMENT_AMOUNT\n86590586 8908090 10-Jun-2003 BASIC 859.00\n89453485 8549038 15-Feb-2003 INTEREST 596.00\n85490345 5489304 20-Mar-2003 BASIC 568.00\n\nThis statement fails when executed:\nSELECT payment_date, customer_id, payment_amount\nFROM payment\nWHERE payment_id =\n (SELECT payment_id\n FROM payment\n WHERE payment_date >= \'05-JAN-2002\' OR payment_amount > 500.00);\n\nWhich change could correct the problem?':
		"Change the outer query WHERE clause to 'WHERE payment_id IN'.",


	// Subqueries Comment Quiz Fixes
	'Which operator can be used with subqueries that return only one row?':
		'LIKE',

	'Subqueries can only be placed in the WHERE clause. True or False?':
		'False',


	'What will be the result of this statement?\n\nSELECT last_name, job_id, salary, department_id\nFROM employees\nWHERE job_id =\n  (SELECT job_id\n   FROM employees\n   WHERE employee_id = 141) AND\ndepartment_id =\n  (SELECT department_id\n   FROM departments\n   WHERE location_id =1500);':
		'Only the employees whose job id matches employee 141 and who work in location 1500',


	'In a correlated subquery, the outer and inner queries are joined on one or more columns. True or False?':
		'True',

	'Evaluate this SELECT statement that includes a subquery:\nSELECT last_name, first_name\nFROM customer\nWHERE area_code IN\n  (SELECT area_code\n   FROM sales\n   WHERE salesperson_id = 20);\n\nWhich statement is true about the given subquery?':
		'The results of the inner query are returned to the outer query.',

	'What would the following SQL statement return?\nSELECT COUNT(DISTINCT salary)\nFROM employees;':
		'The number of unique salaries in the employees table',

	// Section 12 Quiz (Oracle Database Programming with SQL)
	'A column in a table can be given a default value. This option prevents NULL values from automatically being assigned to the column if a row is inserted without a specified value for the column. True or False ?':
		'True',

	'In developing the Employees table, you create a column called hire_date. You assign the hire_date column a DATE datatype with a DEFAULT value of 0 (zero). A user can come back later and enter the correct hire_date. This is __________.':
		'A bad idea. The default value must match the DATE datatype of the column.',

	'Aliases can be used with MERGE statements. True or False?':
		'True',

	'Multi-table inserts can be conditional or unconditional. True or False?':
		'True',

	'A multi-table insert statement can insert into more than one table. (True or False?)':
		'True',

	'Which of the following represents the correct syntax for an INSERT statement?':
		"INSERT INTO customers VALUES ('3178', 'J.', 'Smith', '123 Main Street', 'Nashville', 'TN', '37777');",

	'You need to delete a record in the EMPLOYEES table for Tim Jones, whose unique employee identification number is 348. The EMPLOYEES table contains these columns:\nEMPLOYEE_ID NUMBER(5) PRIMARY KEY\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nADDRESS VARCHAR2(30)\nPHONE NUMBER(10)\n\nWhich DELETE statement will delete the appropriate record without deleting any additional records?':
		'DELETE FROM employees WHERE employee_id = 348;',

	'The EMPLOYEES table contains the following columns:\nEMPLOYEE_ID NUMBER(10) PRIMARY KEY\nLAST_NAME VARCHAR2(20)\nFAST_NAME VARCHAR2(20)\nDEPARTMENT_ID VARCHAR2(20)\nHIRE_DATE DATE\nSALARY NUMBER(9,2)\nBONUS NUMBER(9,2)\n\nYou want to execute one DML statement to change the salary of all employees in department 10 to equal the new salary of employee number 89898. Currently, all employees in department 10 have the same salary value. Which statement should you execute?':
		'UPDATE employees SET salary = (SELECT salary FROM employees WHERE employee_id = 89898) WHERE department_id = 10;',

	'If the subquery returns one row, how many rows will be deleted from the employees table?\nDELETE FROM employees\nWHERE department_id =\n (SELECT department_id\n FROM departments\n WHERE department_name LIKE \'%Public%\');':
		'All rows in the employees table of employees who work in the given department will be deleted.',

	'What keyword in an UPDATE statement speficies the column that you want to change?':
		'SET',

	'To return a table summary on the customers table, which of the following is correct?':
		'DESCRIBE customers, or DESC customers',

	'The PRODUCTS table contains these columns:\nPRODUCT_ID NUMBER NOT NULL\nPRODUCT_NAME VARCHAR2 (25)\nSUPPLIER_ID NUMBER NOT NULL\nLIST_PRICE NUMBER (7,2)\nCOST NUMBER (5,2)\nQTY_IN_STOCK NUMBER(4)\nLAST_ORDER_DT DATE DEFAULT SYSDATE NOT NUL\n\nWhich INSERT statement will execute successfully?':
		"INSERT INTO products (product_id, product_name, supplier_id, list_price, cost, qty_in_stock) VALUES(2958, 'Cable', 8690, 7.09, 4.04, 700)",

	'Assume all the column names are correct. The following SQL statement will execute which of the following?\nINSERT INTO departments\n(department_id, department_name, manager_id, location_id)\nVALUES\n(70, \'Public Relations\', 100, 1700);':
		'70 will be inserted into the department_id column.',

	'You need to copy rows from the EMPLOYEE table to the EMPLOYEE_HIST table. What could you use in the INSERT statement to accomplish this task?':
		'A subquery',

	'The STUDENTS table contains these columns:\nSTU_ID NUMBER(9) NOT NULL\nLAST_NAME VARCHAR2 (30) NOT NULL\nFIRST_NAME VARCHAR2 (25) NOT NULL\nDOB DATE\nSTU_TYPE_ID VARCHAR2(1) NOT NULL\nENROLL_DATE DATE\n\nYou create another table, named FT_STUDENTS, with an identical structure.You want to insert all full-time students who have a STU_TYPE_ID value of "F" into the new table. You execute this INSERT statement:\n\nINSERT INTO ft_students\n (SELECT stu_id, last_name, first_name, dob, stu_type_id, enroll_date\n FROM students\n WHERE UPPER(stu_type_id) = \'F\');\n\nWhat is the result of executing this INSERT statement?':
		'All full-time students are inserted into the FT_STUDENTS table.',

	'Which of the following statements will add a new customer to the customers table in the Global Fast Foods database?':
		"INSERT INTO customers (id, first_name, last_name, address, city, state, zip, phone_number) VALUES (145, 'Katie', 'Hernandez', '92 Chico Way', 'Los Angeles', 'CA', 98008, 8586667641);",

	'Which statement about the VALUES clause of an INSERT statement is true?':
		'If no column list is specified, the values must be listed in the same order that the columns are listed in the table.',

	'If the employees table has 7 rows, how many rows are inserted into the copy_emps table with the following statement:\nINSERT INTO copy_emps (employee_id, first_name, last_name, salary, department_id)\nSELECT employee_id, first_name, last_name, salary, department_id\nFROM employees':
		'7 rows, as no WHERE-clause restricts the rows returned on the subquery.',

	'Using the INSERT statement and assuming that a column can accept null values, how can you implicitly insert a null value in a column?':
		'Omit the column in the column list.',

	'Insert statements can be combined with subqueries to create more than one row per statement. True or False?':
		'True',

	'Which statement below will not insert a row of data into a table?':
		"INSERT INTO (id, lname, fname, lunch_num) VALUES (143354, 'Roberts', 'Cameron', 6543);",

	'Multi-table inserts are used when the same source data should be inserted into _____________ target table.':
		'More than one',

	'The DEFAULT keyword can be used in the following statements:':
		'INSERT and UPDATE',

	'The default value must match the __________ of the column.':
		'Datatype',

	'One of the sales representatives, Janet Roper, has informed you that she was recently married, and she has requested that you update her name in the employee database. Her new last name is Cooper. Janet is the only person with the last name of Roper that is employed by the company. The EMPLOYEES table contains these columns and all data is stored in lowercase:\nEMPLOYEE_ID NUMBER(10) PRIMARY KEY\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nDEPARTMENT_ID VARCHAR2 (20)\nHIRE_DATE DATE\nSALARY NUMBER(10)\n\nWhich UPDATE statement will accomplish your objective?':
		"UPDATE employees SET last_name = 'cooper' WHERE last_name = 'roper';",

	'To change an existing row in a table, you can use the UPDATE or INSERT statements. True or False?':
		'False',

	'One of your employees was recently married. Her employee ID is still 189, however, her last name is now Rockefeller. Which SQL statement will allow you to reflect this change?':
		"UPDATE my_employees SET last_name = 'Rockefeller' WHERE employee_ID = 189;",

	'The TEACHERS and CLASS_ASSIGNMENTS tables contain these columns:\nTEACHERS:\nTEACHER_ID NUMBER(5)\nNAME VARCHAR2(25)\nSUBJECT_ID NUMBER(5)\nHIRE_DATE DATE\nSALARY NUMBER(9,2)\n\nCLASS_ASSIGNMENTS:\nCLASS_ID NUMBER(5)\nTEACHER_ID NUMBER(5)\nSTART_DATE DATE\nMAX_CAPACITY NUMBER(3)\n\nWhich scenario would require a subquery to return the desired results?':
		'You need to create a report to display the teachers who teach more classes than the average number of classes taught by each teacher.',

	'You need to remove a row from the EMPLOYEES table. Which statement would you use?':
		'DELETE with a WHERE clause',

	'The MERGE statement first tries to update one or more rows in a table that match the criteria; if no row matches the criteria for the update, a new row will automatically be inserted instead. True or False?':
		'True',

	'What would happen if you issued a DELETE statement without a WHERE clause?':
		'All the rows in the table would be deleted.',

	'DML is an acronym that stands for:':
		'Data Manipulation Language',

	'Using your knowledge of the employees table, what would be the result of the following statement:\nDELETE FROM employees;':
		'All rows in the employees table will be deleted if there are no constraints on the table.',

	'Examine the structures of the PLAYERS, MANAGERS, and TEAMS tables:\nPLAYERS:\nPLAYER_ID NUMBER Primary Key\nLAST_NAME VARCHAR2 (30)\nFIRST_NAME VARCHAR2 (25)\nTEAM_ID NUMBER\nMGR_ID NUMBER\nSIGNING_BONUS NUMBER(9,2)\nSALARY NUMBER(9,2)\n\nMANAGERS:\nMANAGER_ID NUMBER Primary Key\nLAST_NAME VARCHAR2 (20)\nFIRST_NAME VARCHAR2 (20)\nTEAM_ID NUMBER\n\nTEAMS:\nTEAM_ID NUMBER Primary Key\nTEAM_NAME VARCHAR2 (20)\nOWNER_LAST_NAME VARCHAR2 (20)\nOWNER_FIRST_NAME VARCHAR2 (20)\n\nWhich situation would require a subquery to return the desired result?':
		'To display the names of the managers for all the teams owned by a given owner',

	'You need to update the area code of employees that live in Atlanta. Evaluate this partial UPDATE statement:\nUPDATE employee\nSET area_code = 770\n\nWhich of the following should you include in your UPDATE statement to achieve the desired results?':
		"WHERE city = 'Atlanta';",

	// Section 12 Quiz (Oracle Database Programming with SQL) - Comments & Extras
	'When inserting rows into a table, all columns must be given values. True or False?':
		'False',

	'What is the quickest way to use today\'s date when you are creating a new row?':
		'Use the SYSDATE function.',

	'Examine the structures of the PRODUCTS and SUPPLIERS tables:\nSUPPLIERS:\nSUPPLIER_ID NUMBER NOT NULL, Primary Key\nSUPPLIER_NAME VARCHAR2 (25)\nADDRESS VARCHAR2 (30)\nCITY VARCHAR2 (25)\nREGION VARCHAR2 (10)\nPOSTAL_CODE VARCHAR2 (11)\n\nPRODUCTS:\nPRODUCT_ID NUMBER NOT NULL, Primary Key\nPRODUCT_NAME VARCHAR2 (25)\nSUPPLIER_ID NUMBER Foreign key to SUPPLIER_ID of the SUPPLIERS table\nCATEGORY_ID NUMBER\nQTY_PER_UNIT NUMBER\nUNIT_PRICE NUMBER (7,2)\nQTY_IN_STOCK NUMBER\nQTY_ON_ORDER NUMBER\nREORDER_LEVEL NUMBER\n\nYou want to delete any products supplied by the five suppliers located in Atlanta. Which script should you use?':
		"DELETE FROM products WHERE supplier_id IN (SELECT supplier_id FROM suppliers WHERE UPPER(city) = 'ATLANTA');",

	'Is the following statement valid, i.e. is it allowed to update rows in one table, based on a subquery from another table?\nUPDATE copy_emp\nSET department_id = (SELECT department_id\n FROM employees\n WHERE employee_id = 100)\nWHERE job_id = (SELECT job_id\n FROM employees\n WHERE employee_id = 200);':
		'Yes, this is a perfectly valid statement.',

	'The PLAYERS table contains these columns:\nPLAYER_ID NUMBER NOT NULL\nPLAYER_LNAME VARCHAR2(20) NOT NULL\nPLAYER_FNAME VARCHAR2(10) NOT NULL\nTEAM_ID NUMBER\nSALARY NUMBER(9,2)\n\nYou need to increase the salary of each player for all players on the Tiger team by 12.5 percent. The TEAM_ID value for the Tiger team is 5960. Which statement should you use?':
		'UPDATE players SET salary = salary * 1.125 WHERE team_id = 5960;',

	'In a conditional multi-table insert, you can specify either __________ or __________.':
		'ALL; FIRST',

	'The EMPLOYEES table contains the following columns:\nEMPLOYEE_ID NUMBER(10) PRIMARY KEY\nLAST_NAME VARCHAR2(20)\nFIRST_NAME VARCHAR2(20)\nDEPTARTMENT_ID VARCHAR2(20)\nHIRE_DATE DATE\nSALARY NUMBER(9,2)\nBONUS NUMBER(9,2)\n\nYou need to increase the salary for all employees in department 10 by 10 percent. You also need to increase the bonus for all employees in department 10 by 15 percent. Which statement should you use?':
		'UPDATE employees SET salary = salary * 1.10, bonus = bonus * 1.15 WHERE department_id = 10;',

	'You need to add a row to an existing table. Which DML statement should you use?':
		'INSERT',

	'You have been instructed to add a new customer to the CUSTOMERS table. Because the new customer has not had a credit check, you should not add an amount to the CREDIT column.\nThe CUSTOMERS table contains these columns:\nCUST_ID NUMBER(10)\nCOMPANY VARCHAR2(30)\nCREDIT NUMBER(10)\nPOC VARCHAR2(30)\nLOCATION VARCHAR2(30)\n\nWhich two INSERT statements will accomplish your objective?':
		"INSERT INTO customers (cust_id, company, poc, location) VALUES (200, 'InterCargo', 'tflanders', 'samerica');|INSERT INTO customers VALUES (200, 'InterCargo', null, 'tflanders', 'samerica');",

	'Which two commands can be used to modify existing data in a database row?':
		'UPDATE|MERGE',

	'Which of the following statements best describes what will happen to the student table in this SQL statement?\nUPDATE students\nSET lunch_number =\n    (SELECT lunch_number\n     FROM student\n     WHERE student_id = 17)\nWHERE student_id = 19;':
		"The statement updates the student_table by replacing student id 19's lunch number with student id 17's lunch number.",

	'If a default value was set for a null column, Oracle sets the column to the default value. However, if no default value was set when the column was created, Oracle inserts a space. True or False?':
		'False',

	'Using MERGE accomplishes an __________ and __________ simultaneously.':
		'INSERT; UPDATE',

	'Is it possible to insert more than one row at a time using an INSERT statement with a VALUES clause?':
		'No, you can only create one row at a time when using the VALUES clause.',

	'One employee has the last name of \'King\' in the employees table. How many rows will be deleted from the employees table with the following statement?\nDELETE FROM employees\nWHERE last_name = \'king\';':
		'No rows will be deleted, as no employees match the WHERE-clause.',

	'When inserting a new row, the null keyword can be included in the values list for any column that allows nulls. True or False?':
		'True',

	'If you are performing an UPDATE statement with a subquery, it MUST be a correlated subquery. True or False?':
		'False',

	'You want to enter a new record into the CUSTOMERS table. Which two commands can be used to create new rows?':
		'INSERT, MERGE',

	'To store time with fractions of seconds, which datatype should be used for a table column?':
		'TIMESTAMP',

	'The ELEMENTS column is defined as:\nNUMBER(6,4)\nHow many digits to the right of the decimal point are allowed for the ELEMENTS column?':
		'Four',

	'The TIMESTAMP data type allows what?':
		'Time to be stored as a date with fractional seconds.',

	'Which data types stores variable-length character data? Select two.':
		'CLOB|VARCHAR2',

	'INTERVAL DAY TO SECOND stores a period of time in terms of days, hours, minutes, and seconds. True or False?':
		'True',

	"A column's data type can always be changed from NUMBER to VARCHAR2 but not from VARCHAR2 to NUMBER, provided the table is empty. True or False?":
		'False',

	'You can use the ALTER TABLE statement to:':
		'All of the above',

	'Evaluate this statement:\nALTER TABLE inventory \nMODIFY backorder_amount NUMBER(8,2);\n\nWhich task will this statement accomplish?':
		'Changes the definition of the BACKORDER_AMOUNT column to NUMBER(8,2)',

	'You need to remove all the data in the SCHEDULE table, the structure of the table, and the indexes associated with the table. Which statement should you use?':
		'DROP TABLE',

	'When you use ALTER TABLE to add a column, the new column:':
		'Becomes the last column in the table',

	'It is possible to create a table by using the CREATE TABLE command in conjunction with a subquery. True or False?':
		'True',

	'I have a table named School_Friends in my schema. You want to build a table in your schema named School_Friends. This is ______________, because ____________________________________.':
		'possible; my schema is separate from yours, and it is okay for us to have like-named tables in our separate schemas.',

	'Which statement about table and column names is true?':
		'Table and column names must begin with a letter.',

	'You are creating the EMPLOYEES table. This table should contain the COMMISSION_PCT column and use a value of 10 percent if no commission value is provided when a record is inserted. Which line should you include in the CREATE TABLE statement to accomplish this task?':
		'commission_pct NUMBER(4,2) DEFAULT 0.10',

	'Evaluate this CREATE TABLE statement:\n1. CREATE TABLE customer#1 ( \n2. cust_1 NUMBER(9), \n3. sales$ NUMBER(9), \n4. 2date DATE DEFAULT SYSDATE);\n\nWhich line of this statement will cause an error?':
		'4',

	'Which statement about data types is true?':
		'The CHAR data type should be defined with a size that is not too large for the data it contains (or could contain) to save space in the database.',

	"You are designing a table for the Human Resources department. This table must include a column that contains each employee's hire date. Which data type should you specify for this column?":
		'DATE',

	'To store large amounts of text you should simply create a series of VARCHAR2 columns in a table. True or False?':
		'False',

	'Which SQL statement below will correctly create the EMP table based on the structure of the EMPLOYEES table? Include only the EMPLOYEE_ID, FIRST_NAME, LAST_NAME, SALARY, and DEPARTMENT_ID columns.':
		'CREATE TABLE emp\nAS\nSELECT employee_id, first_name, last_name, salary, department_id\nFROM employees;',

	'Which CREATE TABLE statement will fail?':
		'CREATE TABLE date (date_id NUMBER(9));',

	'CREATE TABLE student_table \n    (id NUMBER(6), \n     lname VARCHAR(20), \n     fname VARCHAR(20), \n     lunch_num NUMBER(4));\nWhich of the following statements best describes the above SQL statement:':
		'Creates a table named student_table with four columns: id, lname, fname, lunch_num',

	"You want to issue the following command on a database that includes your company's inventory information: \nALTER TABLE products SET UNUSED COLUMN color;\nWhat will be the result of issuing this command?":
		'The column named COLOR in the table named PRODUCTS will not be returned in subsequent reads of the table by Oracle, as it has been deleted logically.',

	'The previous administrator created a table named CONTACTS, which contains outdated data. You want to remove the table and its data from the database. Which statement should you issue?':
		'DROP TABLE',

	'The FLASHBACK QUERY statement can restore data back to a point in time before the last COMMIT. True or False?':
		'False',

	'The FLASHBACK TABLE to BEFORE DROP can restore only the table structure, but not its data back to before the table was dropped. True or False?':
		'False',

	"You need to store the HIRE_DATE value with a time zone displacement value and allow data to be returned in the user's local session time zone. Which data type should you use?":
		'TIMESTAMP WITH LOCAL TIME ZONE',

	"Evaluate this statement: \nWhich statement about this TRUNCATE TABLE statement is true?":
		'You can issue this statement to retain the structure of the employees table.',

	'You need to change the name of the EMPLOYEES table to the EMP table. Which statement should you use?':
		'RENAME employees TO emp;',

	'The TEAMS table contains these columns:\nTEAM_ID NUMBER(4) Primary Key\nTEAM_NAME VARCHAR2(20)\nMGR_ID NUMBER(9)\n\nThe TEAMS table is currently empty. You need to allow users to include text characters in the manager identification values. Which statement should you use to implement this?':
		'ALTER TABLE teams\nMODIFY (mgr_id VARCHAR2(15));',

	'Evaluate the structure of the EMPLOYEE table:\nEMPLOYEE_ID NUMBER(9) \nLAST_NAME VARCHAR2(25) \nFIRST_NAME VARCHAR2(25) \nDEPARTMENT_ID NUMBER(9) \nMANAGER_ID NUMBER(9) \nSALARY NUMBER(7,2)\n\nWhich statement should you use to increase the LAST_NAME column length to 35 if the column currently contains 200 records?':
		'ALTER TABLE employee \nMODIFY (last_name VARCHAR2(35));',

	'Which statement about a column is NOT true?':
		'You can modify the data type of a column if the column contains non-null data.',

	'Once they are created, external tables are accessed with normal SQL statements. (True or False?)':
		'True',

	'Which column name is valid?':
		'NUMBER_1$',

	'DCL, which is the acronym for Data Control Language, allows:':
		'A Database Administrator the ability to grant privileges to users.',

	'A column that will be used to store binary data up to 4 Gigabytes in size should be defined as which datatype?':
		'BLOB',

	'Which of the following are valid Oracle datatypes?':
		'DATE, TIMESTAMP WITH LOCAL TIME ZONE, BLOB',

	'Evaluate this CREATE TABLE statement:\nCREATE TABLE sales \n( \n sales_id NUMBER(9), \n customer_id NUMBER(9), \n employee_id NUMBER(9), \n description VARCHAR2(30), \n sale_date TIMESTAMP WITH LOCAL TIME ZONE DEFAULT SYSDATE, \n sale_amount NUMBER(7,2));\n\nWhich business requirement will this statement accomplish?':
		"Today's date should be used if no value is provided for the sale date.",

	'Examine the structure of the DONATIONS table.\nDONATIONS: \nPLEDGE_ID NUMBER \nDONOR_ID NUMBER \nPLEDGE_DT DATE \nAMOUNT_PLEDGED NUMBER (7,2) \nAMOUNT_PAID NUMBER (7,2) \nPAYMENT_DT DATE\n\nYou need to reduce the precision of the AMOUNT_PLEDGED column to 5 with a scale of 2 and ensure that when inserting a row into the DONATIONS table without a value for the AMOUNT_PLEDGED column, a price of $10.00 will automatically be inserted. The DONATIONS table currently contains NO records. Which statement is true?':
		'Both changes can be accomplished with one ALTER TABLE statement.',

	'Which command could you use to quickly remove all data from the rows in a table without deleting the table itself?':
		'TRUNCATE TABLE',

	'You need to remove all the rows from the SALES_HIST table. You want to release the storage space, but do not want to remove the table structure. Which statement should you use?':
		'The TRUNCATE TABLE statement',

	'What will be the result in the hire_date column following this insert statement:\n\nINSERT INTO employees VALUES (10, \'Natacha\', \'Hansen\', DEFAULT);':
		'Statement will work and the hire_date column will have the value of the date when the statement was run.',

	'You want to create a database table that will contain information regarding products that your company released during 2001. Which name can you assign to the table that you create?':
		'PRODUCTS_2001',

	'You want to create a table named TRAVEL that is a child of the EMPLOYEES table. Which of the following statements should you issue?':
		'CREATE TABLE travel \n(destination_id number primary key, departure_date date, return_date date, emp_id number(10) REFERENCES employees (emp_id));',

	'Evaluate this CREATE TABLE statement:\nCREATE TABLE sales \n(sales_id NUMBER, \ncustomer_id NUMBER, \nemployee_id NUMBER, \nsale_date TIMESTAMP WITH TIME ZONE, \nsale_amount NUMBER(7,2));\n\nWhich statement about the SALE_DATE column is true?':
		"Data stored in the column will be returned in the database's local time zone.",

	'Which statement about decreasing the width of a column is true?':
		'When a character column contains data, you can decrease the width of the column if the existing data does not violate the new size.',

	'Which statement about creating a table is true?':
		"If no schema is explicitly included in a CREATE TABLE statement, the table is created in the current user's schema.",

	'When creating a new table, which of the following naming rules apply. (Choose three)':
		'Must begin with a letter|Must contain ONLY A - Z, a - z, 0 - 9, _ (underscore), $, and #|Must be between 1 to 30 characters long',

	'You need to store the SEASONAL data in months and years. Which data type should you use?':
		'INTERVAL YEAR TO MONTH',

	'Comments can be added to a table by using the COMMENT ON TABLE statement. The comments being added are enclosed in:':
		"Single quotes ' '",

	'Which of the following will correctly change the name of the LOCATIONS table to NEW_LOCATIONS?':
		'RENAME LOCATIONS TO NEW_LOCATIONS',

	'The BLOB datatype can max hold 128 Terabytes of data. True or False?':
		'True',

	'Which statement should you use to decrease the width of the FIRST_NAME column to 10 if the column currently contains 1500 records, but none are longer than 10 bytes or characters?':
		'ALTER TABLE players\nMODIFY (first_name VARCHAR2(10));',

	'Your supervisor has asked you to modify the AMOUNT column in the ORDERS table. He wants the column to be configured to accept a default value of 250. The table contains data that you need to keep. Which statement should you issue to accomplish this task?':
		'ALTER TABLE orders\nMODIFY (amount DEFAULT 250);',

	"The EMPLOYEE_ID column currently contains 500 employee identification numbers. Business requirements have changed and you need to allow users to include text characters in the identification values. Which statement should you use to change this column's data type?":
		'You CANNOT modify the data type of the EMPLOYEE_ID column, as the table is not empty.',

	'Examine the structures of the PRODUCTS and SUPPLIERS tables. PRODUCTS: PRODUCT_ID NUMBER NOT NULL, PRIMARY KEY PRODUCT_NAME VARCHAR2 (25) SUPPLIER_ID NUMBER FOREIGN KEY to SUPPLIER_ID of the SUPPLIER table LIST_PRICE NUMBER (7,2) COST NUMBER (7,2) QTY_IN_STOCK NUMBER QTY_ON_ORDER NUMBER REORDER_LEVEL NUMBER REORDER_QTY NUMBER SUPPLIERS: SUPPLIER_ID NUMBER NOT NULL, PRIMARY KEY SUPPLIER_NAME VARCHAR2 (25) ADDRESS VARCHAR2 (30) CITY VARCHAR2 (25) REGION VARCHAR2 (10) POSTAL_CODE VARCHAR2 (11) Evaluate this statement: ALTER TABLE suppliers DISABLE CONSTRAINT supplier_id_pk CASCADE; For which task would you issue this statement?':
		'To disable any dependent integrity constraints on the SUPPLIER_ID column in the PRODUCTS table',

	'The PO_DETAILS table contains these columns: PO_NUM NUMBER NOT NULL, Primary Key PO_LINE_ID NUMBER NOT NULL, Primary Key PRODUCT_ID NUMBER Foreign Key to PRODUCT_ID column of the PRODUCTS table QUANTITY NUMBER UNIT_PRICE NUMBER(5,2) Evaluate this statement: ALTER TABLE po_details DISABLE CONSTRAINT product_id_pk CASCADE; For which task would you issue this statement?':
		'To disable the composite PRIMARY KEY of the po_details table and any dependent FOREIGN KEY constraints',

	'Which of the following would definitely cause an integrity constraint error?':
		'Using the DELETE command on a row that contains a primary key with a dependent foreign key declared without either an ON DELETE CASCADE or ON DELETE SET NULL.',

	'When dropping a constraint, which keyword(s) specifies that all the referential integrity constraints that refer to the primary and unique keys defined on the dropped columns are dropped as well?':
		'CASCADE',

	'All of a user\'s constraints can be viewed in the Oracle Data Dictionary view called:':
		'USER_CONSTRAINTS',

	'Evaluate the structure of the DONATIONS table. DONATIONS: PLEDGE_ID NUMBER NOT NULL, Primary Key DONOR_ID NUMBER Foreign key to DONOR_ID column of DONORS table PLEDGE_DT DATE AMOUNT_PLEDGED NUMBER (7,2) AMOUNT_PAID NUMBER (7,2) PAYMENT_DT DATE Which CREATE TABLE statement should you use to create the DONATIONS table?':
		'CREATE TABLE donations (pledge_id NUMBER PRIMARY KEY, donor_id NUMBER CONSTRAINT donor_id_fk REFERENCES donors(donor_id), pledge_date DATE, amount_pledged NUMBER(7,2), amount_paid NUMBER(7,2), payment_dt DATE);',

	'Which clause could you use to ensure that cost values are greater than 1.00?':
		'CONSTRAINT part_cost_ck CHECK (cost > 1.00)',

	'What must exist on the Parent table before Oracle will allow you to create a FOREIGN KEY constraint from a Child table?':
		'A PRIMARY or UNIQUE KEY constraint must exist on the Parent table.',

	'Evaluate this CREATE TABLE statement: CREATE TABLE part( part_id NUMBER, part_name VARCHAR2(25), manufacturer_id NUMBER(9), retail_price NUMBER(7,2) NOT NULL, CONSTRAINT part_id_pk PRIMARY KEY(part_id), CONSTRAINT cost_nn NOT NULL(cost), CONSTRAINT FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id)); Which line will cause an error?':
		'Line 7 (and Line 8)',

	'Which type of constraint by default requires that a column be both unique and not null?':
		'PRIMARY KEY',

	'You need to ensure that the LAST_NAME column only contains certain character values. No numbers or special characters are allowed. Which type of constraint should you define on the LAST_NAME column?':
		'CHECK',

	'Which constraint can only be created at the column level?':
		'NOT NULL',

	'Evaluate this CREATE TABLE statement: CREATE TABLE customers (customer_id NUMBER, customer_name VARCHAR2(25), address VARCHAR2(25), city VARCHAR2(25), region VARCHAR2(25), postal_code VARCHAR2(11), CONSTRAINT customer_id_un UNIQUE(customer_id), CONSTRAINT customer_name_nn NOT NULL(customer_name)); Why does this statement fail when executed?':
		'NOT NULL constraints CANNOT be defined at the table level.',

	'You need to ensure that the LAST_NAME column does not contain null values. Which type of constraint should you define on the LAST_NAME column?':
		'NOT NULL',

	'A table must have at least one not null constraint and one unique constraint. True or False?':
		'False',

	'You need to remove the EMP_FK_DEPT constraint from the EMPLOYEE table in your schema. Which statement should you use?':
		'ALTER TABLE employees DROP CONSTRAINT EMP_FK_DEPT;',

	'What mechamisn does Oracle use in the background to enforce uniqueness in Primary and Unique key constraints?':
		'Unique key indexes are created in the background by Oracle when Primary key and Unique key constraints are created or enabled',

	'What is the syntax for removing a PRIMARY KEY constraint and all its dependent constraints?':
		'ALTER TABLE table_name DROP CONSTRAINT constraint_name CASCADE;',

	'You need to add a NOT NULL constraint to the COST column in the PART table. Which statement should you use to complete this task?':
		'ALTER TABLE part MODIFY (cost CONSTRAINT part_cost_nn NOT NULL);',

	'You need to ensure that each value in the SEAT_ID column is unique or null. Which constraint should you define on the SEAT_ID column?':
		'UNIQUE',

	'Which statement about the NOT NULL constraint is true?':
		'The NOT NULL constraint must be defined at the column level.',

	'Which two statements about NOT NULL constraints are true? (Choose two)':
		'The Oracle Server creates a name for an unnamed NOT NULL constraint.|You CANNOT add a NOT NULL constraint to an existing column using the ALTER TABLE ADD CONSTRAINT statement.',

	'What is the highest number of NOT NULL constraints you can have on a table?':
		'You can have as many NOT NULL constraints as you have columns in your table.',

	'Which line of the following code will cause an error: CREATE TABLE clients (client_number NUMBER(4) CONSTRAINT client_client_num_pk PRIMARY KEY client_number, first_name VARCHAR2(14), last_name VARCHAR2(13), hire_date DATE CONSTRAINT emp_min_hire_date CHECK (hire_date < SYSDATE), department_id VARCHAR(3), CONSTRAINT clients_dept_id_fk FOREIGN KEY(department_id) REFERENCES departments(department_id));':
		'Line 5 (and Line 2)',

	'A Primary Key that is made up of more than one column is called a:':
		'Composite Primary Key',

	'Which of the following FOREIGN KEY Constraint keywords identifies the table and column in the parent table?':
		'REFERENCES',

	'A composite primary key may only be defined at the table level. True or False?':
		'True',

	'You need to enforce a relationship between the LOC_ID column in the FACILITY table and the same column in the MANUFACTURER table. Which type of constraint should you define on the LOC_ID column?':
		'FOREIGN KEY',

	'Which constraint type enforces uniqueness?':
		'PRIMARY KEY',

	'If the employees table has a UNIQUE constraint on the DEPARTMENT_ID column, we can only have one employee per department. True or False?':
		'True',

	'You need to add a NOT NULL constraint to the EMAIL column in the EMPLOYEES table. Which clause should you use?':
		'MODIFY',

	'You want to disable the FOREIGN KEY constraint that is defined in the EMPLOYEES table on the DEPARTMENT_ID column. The constraint is referenced by the name FK_DEPT_ID_01. Which statement should you issue?':
		'ALTER TABLE employees DISABLE CONSTRAINT fk_dept_id_01;',

	'You need to add a PRIMARY KEY constraint on the EMP_ID column of the EMPLOYEES table. Which ALTER TABLE statement should you use?':
		'ALTER TABLE employees ADD CONSTRAINT emp_emp_id_pk PRIMARY KEY(emp_id);',

	'To automatically delete rows in a child table when a parent record is deleted use:':
		'ON DELETE CASCADE',

	'The employees table contains a foreign key column department_id that references the id column in the departments table. Which of the following constraint modifiers will NOT allow the deletion of id values in the department table?':
		'Neither A nor B',

	'The LINE_ITEM table contains these columns: LINE_ITEM_ID NUMBER PRIMARY KEY PRODUCT_ID NUMBER(9) FOREIGN KEY references the ID column of the PRODUCT table QUANTITY NUMBER(9) UNIT_PRICE NUMBER(5,2) You need to disable the FOREIGN KEY constraint. Which statement should you use?':
		'ALTER TABLE line_item DISABLE CONSTRAINT product_id_fk;',

	'This SQL command will do what? ALTER TABLE employees ADD CONSTRAINT emp_manager_fk FOREIGN KEY(manager_id) REFERENCES employees(employee_id);':
		'Add a FOREIGN KEY constraint to the EMPLOYEES table indicating that a manager must already be an employee.',

	'A table can only have one unique key constraint defined. True or False?':
		'False',

	'Primary Key, Foreign Key, Unique Key, and Check Constraints can be added at which two levels? (Choose two)':
		'Column|Table',


	'What actions can be performed on or with Constraints?':
		'Add, Drop, Enable, Disable, Cascade',

	'The command to \'switch off\' a constraint is:':
		'ALTER TABLE DISABLE CONSTRAINT',

	'A column defined as NOT NULL can have a DEFAULT value of NULL. True or False?':
		'False',

	'You disabled the EMPLOYEE_ID_PK PRIMARY KEY constraint on the ID column in the EMPLOYEES table and imported 100 records. You need to enable the constraint and verify that the new and existing ID column values do not violate the PRIMARY KEY constraint. Evaluate this statement: ALTER TABLE employees ENABLE employee_id_pk; Which statement is true?':
		'The statement will NOT execute because it contains a syntax error.',

	'You need to create a composite primary key constraint on the EMPLOYEES table. Which statement is true?':
		'The PRIMARY KEY constraint must be defined at the table level.',

	'You need to create the PROJECT_HIST table. The table must meet these requirements:\n\nThe table must contain the EMPLOYEE_ID and TASKED_HOURS columns for numeric data.\nThe table must contain the START_DATE and END_DATE column for date values.\nThe table must contain the HOURLY_RATE and PROJECT_COST columns for numeric data with precision and scale of 5,2 and 10,2 respectively.\nThe table must have a composite primary key on the EMPLOYEE_ID and START_DATE columns.\n\nEvaluate this CREATE TABLE statement:\n\nCREATE TABLE project_hist\n( employee_id NUMBER,\nstart_date DATE,\nend_date DATE,\ntasked_hours NUMBER,\nhourly_rate NUMBER(5,2),\nproject_cost NUMBER(10,2),\nCONSTRAINT project_hist_pk PRIMARY KEY(employee_id, start_date));\n\nHow many of the requirements does the CREATE TABLE statement satisfy?':
		'All four of the requirements',


	'Once constraints have been created on a table, you will have to live with them as they are unless you drop and re-create the table. True or False?':
		'False',

	'The table that contains the Primary Key in a Foreign Key Constraint is known as:':
		'Parent Table',

	'Which statement about a non-mandatory foreign key constraint is true?':
		'A foreign key value must either be null or match an existing value in the parent table.',

	'If a Primary Key is made up of more than one column, one of the columns can be null. True or False?':
		'False',

	'When creating a referential constraint, which keyword(s) identifies the table and column in the parent table?':
		'REFERENCES',

	'Un ejemplo de la adición de una restricción de control para limitar el salario que un empleado dapat ganar es:':
		'ALTER TABLE employees ADD CONSTRAINT emp_salary_ck CHECK (salary < 100000)',

	'You can view the columns used in a constraint defined for a specific table by looking at which data dictionary table?':
		'USER_CONS_COLUMNS',

	'Which of the following pieces of code will successfully create a foreign key in the CDS table that references the SONGS table?':
		'All of the above',

	'A unique key constraint can only be defined on a not null column. True or False?':
		'False',

	'You need to display the names and definitions of constraints only in your schema. Which data dictionary view should you query?':
		'USER_CONSTRAINTS',

	'You can drop a column in a table with a simple ALTER TABLE DROP COLUMN statement, even if the column is referenced in a constraint. True or False?':
		'False',

	'Evaluate this CREATE VIEW statement: CREATE VIEW emp_view AS SELECT SUM(salary) FROM employees; Which statement is true?':
		'You cannot update data in the EMPLOYEES table using the EMP_VIEW view.',

	'Which keyword(s) would you include in a CREATE VIEW statement to create the view whether or not the base table exists?':
		'FORCE',

	'Views must be used to select data from a table. As soon as a view is created on a table, you can no longer select directly from the table. True or False?':
		'False',

	'A view can be used to keep a history record of old data from the underlying tables, so even if a row is deleted from a table, you can still select the row through the view. True or False?':
		'False',

	'In order to query a database using a view, which of the following statements applies?':
		'You can retrieve data from a view as you would from any table.',

	'If a database administrator wants to ensure that changes performed through a view do not violate existing constraints, which clause should he include when creating the view?':
		'WITH CHECK OPTION',

	'What is the purpose of including the WITH CHECK OPTION clause when creating a view?':
		'To insure that no rows are updated through the view that would prevent those rows from being returned by the view in the future.',

	'Only one type of view exists. True or False?':
		'False',

	'For a View created using the WITH CHECK OPTION keywords, which of the following statements are true?':
		'Prohibits changing rows not returned by the subquery in the view definition.',

	'You cannot insert data through a view if the view includes ______.':
		'A GROUP BY clause',

	'When you drop a view, the data it contains is also deleted. True or False?':
		'False',

	'Evaluate this CREATE VIEW statement: CREATE VIEW sales_view AS SELECT customer_id, region, SUM(sales_amount) FROM sales WHERE region IN (10, 20, 30, 40) GROUP BY region, customer_id; Which statement is true?':
		'You cannot modify data in the SALES table using the SALES_VIEW view.',

	'You want to create a view based on the SALESREP table. You plan to grant access to this view to members of the Sales department. You want Sales employees to be able to update the SALESREP table through the view, which you plan to name SALESREP_VIEW. What should not be specified in your CREATE VIEW statement?':
		'A GROUP BY clause',

	'How do you remove a view?':
		'DROP VIEW view_name',

	'When you drop a table referenced by a view, the view is automatically dropped as well. True or False?':
		'False',

	'Which statement about an inline view is true?':
		'An inline view is a subquery in the FROM clause, often named with an alias.',

	'A Top-N Analysis is capable of ranking a top or bottom set of results. True or False?':
		'True',

	'Which of these Keywords is typically used with a Top-N Analysis?':
		'Rownum',

	'You must create a view that will display the name, customer identification number, new balance, finance charge, and credit limit of all customers. You issue this statement: CREATE OR REPLACE VIEW CUST_CREDIT_V AS SELECT c.last_name, c.customer_id, a.new_balance, a.finance_charge, a.credit_limit FROM customers c, accounts a WHERE c.account_id = a.account_id WITH READ ONLY; Which type of SQL command can be issued on the CUST_CREDIT_V view?':
		'SELECT',

	'You administer an Oracle database. Jack manages the Sales department. He and his employees often find it necessary to query the database to identify customers and their orders. He has asked you to create a view that will simplify this procedure for himself and his staff. The view should not accept INSERT, UPDATE, or DELETE operations. Which of the following statements should you issue?':
		'CREATE VIEW sales_view AS (SELECT c.companyname, c.city, o.orderid, o. orderdate, o.total FROM customers c, orders o WHERE c.custid = o.custid) WITH READ ONLY;',

	'Which statement about performing DML operations on a view is true?':
		'You can perform DML operations on simple views.',

	'Which option would you use when creating a view to ensure that no DML operations occur on the view?':
		'WITH READ ONLY',

	'Unlike tables, views contain no data of their own. True or False?':
		'True',

	'Which of the following statements is a valid reason for using a view?':
		'Views provide data independence for infrequent users and application programs. One view can be used to retrieve data from several tables. Views can be used to provide data security.',

	'You need to create a view on the SALES table, but the SALES table has not yet been created. Which statement is true?':
		'You can use the FORCE option to create the view before the SALES table has been created.',

	'Which of the following keywords cannot be used when creating a view?':
		'ORDER BY',

	'A view can contain a select statement with a subquery. True or False?':
		'True',

	'The FACULTY table contains these columns: FACULTYID VARCHAR2(5) NOT NULL PRIMARY KEY FIRST_NAME VARCHAR2(20) LAST_NAME VARCHAR2(20) ADDRESS VARCHAR2(35) CITY VARCHAR2(15) STATE VARCHAR2(2) ZIP NUMBER(9) TELEPHONE NUMBER(10) STATUS VARCHAR2(2) NOT NULL The COURSE table contains these columns: COURSEID VARCHAR2(5) NOT NULL PRIMARY KEY SUBJECT VARCHAR2(5) TERM VARCHAR2(6) FACULTYID VARCHAR2(5) NOT NULL FOREIGN KEY You have been asked to compile a report that identifies all adjunct professors who will be teaching classes in the upcoming term. You want to create a view that will simplify the creation of this report. Which CREATE VIEW statements will accomplish this task?':
		'CREATE VIEW pt_view AS (SELECT first_name, last_name, status, courseid, subject, term FROM faculty f, course c WHERE f.facultyid = c.facultyid);',

	'What is one advantage of using views?':
		'To provide restricted data access',

	'You can create a view if the view subquery contains an inline view. True or False?':
		'True',

	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) DEPARTMENT_ID NUMBER JOB_ID NUMBER MANAGER_ID NUMBER SALARY NUMBER(9,2) COMMISSOIN NUMBER(7,2) HIRE_DATE DATE Which SELECT statement could be used to display the 10 lowest paid clerks that belong to department 70?':
		'SELECT ROWNUM "Ranking",last_name||\',\'||first_name "Employee", salary "Salary" FROM (SELECT last_name, first_name, salary, job_id FROM employees WHERE job_id LIKE \'CLERK\' AND department_id = 70 ORDER BY salary) WHERE ROWNUM <=10;',

	'Which of the following describes a top-N query?':
		'A top-N query returns a limited result set, returning data based on highest or lowest criteria.',

	'Which of these is not a valid type of View?':
		'ONLINE',

	'Given the following view, which operations would be allowed on the emp_dept view? CREATE OR REPLACE VIEW emp_dept AS SELECT SUBSTR(e.first_name,1,1) ||\' \'||e.last_name emp_name, e.salary, e.hire_date, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id AND d.department_id >=50;':
		'SELECT, UPDATE of some columns, DELETE',

	'You need to create a new view on the EMPLOYEES table to update salary information for employees in Department 50. You need to ensure that DML operations through the view can not change salary values in other departments. Which clause should be included in the CREATE VIEW statement?':
		'WITH CHECK OPTION',

	'You create a view on the EMPLOYEES and DEPARTMENTS tables to display salary information per department. What will happen if you issue the following statement? CREATE OR REPLACE VIEW sal_dept AS SELECT SUM(e.salary) sal, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id GROUP BY d.department_name;':
		'A complex view is created that returns the sum of salaries per department.',

	'Evaluate this view definition: CREATE OR REPLACE VIEW part_name_v AS SELECT DISTINCT part_name FROM parts WHERE cost >= 45; Which of the following statements using the PART_NAME_V view will execute successfully?':
		'SELECT * FROM part_name_v;',

	'Any select statement can be stored in the database as a view. True or False?':
		'True',

	'Which statement about the CREATE VIEW statement is true?':
		'A CREATE VIEW statement CAN contain a join query.',

	'Which statement would you use to alter a view?':
		'CREATE OR REPLACE VIEW',

	'Examine the view below and choose the operation that CANNOT be performed on it. CREATE VIEW dj_view (last_name, number_events) AS SELECT c.last_name, COUNT(e.name) FROM d_clients c, d_events e WHERE c.client_number = e.client_number GROUP BY c.last_name;':
		'INSERT INTO dj_view VALUES (\'Turner\', 8);',

	'Which action can be performed by using DML statements?':
		'Deleting records in a table',

	'Which of the following is true about ROWNUM?':
		'It is the number assigned to each row returned from a query as it is read from the table.',

	'Which of the following DML operations is not allowed when using a Simple View created with read only?':
		'All of the above',

	'An inline view is an unnamed select statement found:':
		'Enclosed in parentheses within the FROM clause of a surrounding query.',

	'Given the following CREATE VIEW statement, what data will be returned? CREATE OR REPLACE VIEW emp_dept AS SELECT SUBSTR(e.first_name,1,1) ||\' \'||e.last_name emp_name, e.salary, e.hire_date, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id AND d.department_id >=50;':
		'First character from employee first_name concatenated to the last_name, the salary, the hire_date, and the department_name of all employees working in department number 50 or higher.',

	'You administer an Oracle database which contains a table named EMPLOYEES. Luke, a database user, must create a report that includes the names and addresses of all employees. You do not want to grant Luke access to the EMPLOYEES table because it contains sensitive data. Which of the following actions should you perform first?':
		'Create a view.',

	'Your manager has just asked you to create a report that illustrates the salary range of all the employees at your company. Which of the following SQL statements will create a view called SALARY_VU based on the employee last names, department names, salaries, and salary grades for all employees? Use the EMPLOYEES, DEPARTMENTS, and JOB_GRADES tables. Label the columns Employee, Department, Salary, and Grade, respectively.':
		'CREATE OR REPLACE VIEW salary_vu AS SELECT e.last_name "Employee", d.department_name "Department", e.salary "Salary", j. grade_level "Grade" FROM employees e, departments d, job_grades j WHERE e.department_id = d.department_id AND e.salary BETWEEN j.lowest_sal and j.highest_sal;',

	'Sequences can be used to: (Choose three)':
		'Generate a range of numbers and optionally cycle through them again.|Set a fixed interval between successively generated numbers.|Ensure primary key values will be unique even though gaps may exist.',

	'Evaluate this CREATE SEQUENCE statement: CREATE SEQUENCE line_item_id_seq INCREMENT BY -1; Which statement is true?':
		'The sequence will generate sequential descending values.',

	'Examine the code for creating this sequence: CREATE SEQUENCE track_id_seq INCREMENT BY 10 START WITH 1000 MAXVALUE 10000; What are the first three values that would be generated?':
		'1000, 1010, 1020.',

	'You create a CUSTOMERS table in which CUSTOMER_ID is designated as a primary key. Which of the following actions should you perform to generate values automatically?':
		'Create a sequence.',

	'You need to retrieve the next available value for the SALES_IDX sequence. Which would you include in your SQL statement?':
		'sales_idx.NEXTVAL',

	'Which statement would you use to modify the EMP_ID_SEQ sequence used to populate the EMPLOYEE_ID column in the EMPLOYEES table?':
		'ALTER SEQUENCE emp_id_seq;',

	'Why do gaps in sequences occur?':
		'All of the above',

	'You create a sequence with the following statement: CREATE SEQUENCE my_emp_seq; Which of the following statements about this sequence are true? (Choose two)':
		'MAXVALUE is 10^27 for an ascending sequence.|MINVALUE is equal to 1.',

	'The EMPLOYEES table has an index named LN_IDX on the LAST_NAME column. You want to change this index so that it is on the FIRST_NAME column instead. Which SQL statement will do this?':
		'None of the above; you cannot ALTER an index.',

	'User Mary\'s schema contains an EMP table. Mary has Database Administrator privileges and executes the following statement: CREATE PUBLIC SYNONYM emp FOR mary.emp; User Susan now needs to SELECT from Mary\'s EMP table. Which of the following SQL statements can she use? (Choose two)':
		'SELECT * FROM emp;|SELECT * FROM mary.emp;',

	'Barry creates a table named INVENTORY. Pam must be able to query the same table. Barry wants to enable Pam to query the table without being required to specify the table\'s schema. Which of the following should Barry create?':
		'A synonym.',

	'You need to determine the table name and column name(s) on which the SALES_IDX index is defined. Which data dictionary view would you query?':
		'USER_IND_COLUMNS',

	'The following indexes exist on the EMPLOYEES table: A unique index on the EMPLOYEE_ID primary key column; A non-unique index on the JOB_ID column; A composite index on the FIRST_NAME and LAST_NAME columns. If the EMPLOYEES table is dropped, which indexes are automatically dropped at the same time?':
		'All indexes.',

	'Evaluate this CREATE SEQUENCE statement: CREATE SEQUENCE order_id_seq NOCYCLE NOCACHE; Which statement is true?':
		'The sequence will start with 1.',

	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER NOT NULL (Primary Key), LAST_NAME VARCHAR2(20), FIRST_NAME VARCHAR2(20), DEPARTMENT_ID NUMBER (Foreign Key), HIRE_DATE DATE, SALARY NUMBER. On which column is an index automatically created?':
		'EMPLOYEE_ID.',

	'Which of the following best describes the function of the CURRVAL virtual column?':
		'The CURRVAL virtual column will display the integer that was most recently supplied by a sequence.',

	'You create a table named CUSTOMERS and define a PRIMARY KEY constraint on the CUST_ID column. Which actions occur automatically?':
		'A unique index is created on the CUST_ID column, if one does not already exist.',

	'CURRVAL is a pseudocolumn used to refer to a sequence number that the current user has just generated by referencing NEXTVAL. True or False?':
		'True',

	'Evaluate this CREATE SEQUENCE statement: CREATE SEQUENCE line_item_id_seq MINVALUE 100 MAXVALUE 130 INCREMENT BY -10 CYCLE NOCACHE; What will be the first five numbers generated by this sequence?':
		'130, 120, 110, 100, 130.',

	'Which statement about an index is true?':
		'An index created on multiple columns is called a composite or concatenated index.',

	'Evaluate this statement: CREATE INDEX sales_idx ON oe.sales (status); Which statement is true?':
		'The CREATE INDEX statement creates a nonunique index.',

	'Nextval and Currval are known as column aliases. True or False?':
		'False',

	'You create a CUSTOMERS table in which CUSTOMER_ID is designated as a primary key. You want the values that are entered into the CUSTOMER_ID column to be generated automatically. Which of the following actions should you perform?':
		'Create a sequence.',

	'Unique indexes are automatically created on columns that have which two types of constraints?':
		'UNIQUE and PRIMARY KEY',

	'The EMPLOYEES table contains these columns: EMPLOYEE_ID NUMBER NOT NULL, Primary Key LAST_NAME VARCHAR2 (20) FIRST_NAME VARCHAR2 (20) DEPARTMENT_ID NUMBER Foreign Key to PRODUCT_ID column of the PRODUCT table HIRE_DATE DATE DEFAULT SYSDATE SALARY NUMBER (8,2) NOT NULL On which column is an index automatically created for the EMPLOYEES table?':
		'EMPLOYEE_ID.',

	'In order to be able to generate primary key values that are not likely to contain gaps, which phrase should be included in the sequence creation statement?':
		'NOCACHE',

	'You created the LOCATION_ID_SEQ sequence to generate sequential values for the LOCATION_ID column in the MANUFACTURERS table. You issue this statement: ALTER TABLE manufacturers MODIFY (location_id NUMBER(6)); Which statement about the LOCATION_ID_SEQ sequence is true?':
		'The sequence is unchanged.',

	'Which dictionary view would you query to display the number most recently generated by a sequence?':
		'USER_SEQUENCES',

	'Which statement would you use to remove the LAST_NAME_IDX index on the LAST_NAME column of the EMPLOYEES table?':
		'DROP INDEX last_name_idx;',

	'All tables must have indexes on them otherwise they cannot be queried. True or False?':
		'False',

	'Which of the following SQL statements shows a correct syntax example of creating a synonym accessible to all users of a database?':
		'CREATE PUBLIC SYNONYM emp FOR sam.employees;',

	'What is the correct syntax for creating an index?':
		'CREATE INDEX index_name ON table_name(column_name);',

	'What is the correct syntax for creating a private synonym d_sum for the view DEPT_SUM_VU?':
		'CREATE SYNONYM d_sum FOR dept_sum_vu;',

	'What kind of INDEX is created by Oracle when you create a primary key?':
		'UNIQUE INDEX',

	'Indexes can be used to speed up queries. True or False?':
		'True',

	'When creating an index on one or more columns of a table, which of the following statements are true? (Choose two)':
		'You should create an index if one or more columns are frequently used together in a join condition.|You should create an index if the table is large and most queries are expected to retrieve less than 2 to 4 percent of the rows.',

	'The CUSTOMERS table exists in user Mary\'s schema. Which statement should you use to create a synonym for all database users on the CUSTOMERS table?':
		'CREATE PUBLIC SYNONYM cust FOR mary.customers;',

	'Which of the following best describes the function of an index?':
		'An index is a database object that can be created to speed up the retrieval of rows by using a pointer.',

	'The ALTER SEQUENCE statement can be used to:':
		'Change the amount a sequence increments each time a number is generated',

	'A sequence is a database object. True or False?':
		'True',

	'Creating a sequence with NOCACHE ensures that all numbers in the sequence\'s range will be used successfully. True or False?':
		'False',

	'Which of the following best describes the function of the NEXTVAL virtual column?':
		'The NEXTVAL virtual column increments a sequence by a predetermined value.',

	'When used in a CREATE SEQUENCE statement, which keyword specifies that a range of sequence values will be preloaded into memory?':
		'CACHE',

	'Which pseudocolumn returns the latest value supplied by a sequence?':
		'CURRVAL',

	'Which statement would you use to remove the EMP_ID_SEQ sequence?':
		'DROP SEQUENCE emp_id_seq;',

	'In SQL what is a synonym?':
		'An alternative name for a table, view, or other database object',

	'You want to speed up the following query by creating an index: SELECT * FROM employees WHERE salary * 12 > 100000; Which index should you create?':
		'CREATE INDEX emp_sal_idx ON employees(salary * 12);',

	'For which column would you create an index?':
		'A column with a large number of null values',

	'When creating a sequence, which keyword or option specifies the minimum sequence value?':
		'MINVALUE',

	'When you alter a sequence, a new increased MAXVALUE can be entered without changing the existing number order. True or False?':
		'True',

	'Which keyword is used to modify a sequence?':
		'ALTER',

	'Which is the correct syntax for specifying a maximum value in a sequence?':
		'MAXVALUE',

	'A gap can occur in a sequence because a user generated a number from the sequence and then rolled back the transaction. True or False?':
		'True',

	'Which of the following is created automatically by Oracle when a UNIQUE integrity constraint is created?':
		'An index',

	'Evaluate this statement: CREATE PUBLIC SYNONYM testing FOR chan.testing; Which task will this statement accomplish?':
		'It eliminates the need for all users to qualify TESTING with its schema.',

	'What is the most common use for a Sequence?':
		'To generate primary key values',

	'CURRVAL is a pseudocolumn used to extract successive sequence numbers from a specified sequence. True or False?':
		'False',

	'What would you create to make the following statement execute faster? SELECT * FROM employees WHERE LOWER(last_name) = \'chang\';':
		'An index, either a normal or a function_based index',

	'To see the most recent value that you fetched from a sequence named my_seq you should reference:':
		'my_seq.currval',

	'Evaluate this CREATE SEQUENCE statement: CREATE SEQUENCE line_item_id_seq CYCLE; Which statement is true?':
		'The sequence will continue to generate values after the maximum sequence value has been generated.',

	'As user Julie, you issue this statement: CREATE SYNONYM emp FOR sam.employees; Which task was accomplished by this statement?':
		'You created a private synonym on the EMPLOYEES table owned by user Sam.',

	'The CLIENTS table contains these columns: CLIENT_ID NUMBER(4) NOT NULL PRIMARY KEY LAST_NAME VARCHAR2(15) FIRST_NAME VARCHAR2(10) CITY VARCHAR2(15) STATE VARCHAR2(2) You want to create an index named ADDRESS_INDEX on the CITY and STATE columns of the CLIENTS table. You execute this statement: CREATE INDEX clients address_index (city, state); Which result does this statement accomplish?':
		'An error message is produced, and no index is created.',

	'The EMPLOYEES table contains these columns: EMP_ID NOT NULL, Primary Key SSNUM NOT NULL, Unique LAST_NAME VARCHAR2(25) FIRST_NAME VARCHAR2(25) DEPT_ID NUMBER Foreign Key to DEPT_ID column of the DEPARTMENTS table SALARY NUMBER(8,2) You execute this statement: CREATE INDEX emp_name_idx ON employees(last_name, first_name); Which statement is true?':
		'The statement creates a composite non-unique index.',


	'You created the LOCATION_ID_SEQ sequence':
		'The sequence is unchanged.',

	'What kind of INDEX is created by Oracle':
		'UNIQUE INDEX',

	'Indexes can be used to speed up queries.':
		'True',

	'When creating an index on one or more':
		'more columns are frequently used together in a join condition.',

	'The ALTER SEQUENCE statement can be used':
		'increments each time a number is generated',

	'Creating a sequence with NOCACHE ensures':
		'False',

	'When used in a CREATE SEQUENCE':
		'CACHE',

	'When creating a sequence, which keyword':
		'MINVALUE',

	'All tables must have indexes on them':
		'False',

	'Which one of the following statements about indexes is true?':
		'An index is created automatically when a PRIMARY KEY constraint is created.',

	'Evaluate this statement: CREATE SEQUENCE sales_item_id_seq START WITH 101 MAXVALUE 9000090 CYCLE; Which statement about this CREATE SEQUENCE statement is true?':
		'The sequence will reuse numbers and will start with 101.',

	'Evaluate this statement: DROP SEQUENCE line_item_id_seq; What does this statement accomplish?':
		'It removes the sequence from the data dictionary.',

	'Which keyword is used to remove a sequence?':
		'Drop',

	'Regular expressions used as check constraints are another way to ensure data is formatted correctly prior to being written into the database table. True or False?':
		'True',

	'Regular expressions are a method of describing both simple and complex patterns for searching and manipulating. True or False?':
		'True',

	'REGULAR EXPRESSIONS can be used as part of a contraint definition. (True or False?)':
		'True',

	'A role can be granted to another role. True or False?':
		'True',

	'Which of the following simplifies the administration of privileges?':
		'A role',

	'Which keyword would you use to grant an object privilege to all database users?':
		'PUBLIC',

	'User CRAIG creates a view named INVENTORY_V, which is based on the INVENTORY table. CRAIG wants to make this view available for querying to all database users. Which of the following actions should CRAIG perform?':
		'He should assign the SELECT privilege to all database users for INVENTORY_V view.',

	'If you are granted privileges to your friend\'s object, by default you may also grant access to this same object to other users. True or False?':
		'False',

	'Which data dictionary view shows which system privileges have been granted to a user?':
		'USER_SYS_PRIVS',

	'A Schema is a collection of Objects such as Tables, Views, and Sequences. True or False?':
		'True',

	'The database administrator wants to allow user Marco to create new tables in his own schema. Which privilege should be granted to Marco?':
		'CREATE TABLE',

	'You are the database administrator. You want to create a new user JONES with a password of MARK, and allow this user to create his own tables. Which of the following should you execute?':
		'CREATE USER jones IDENTIFIED BY mark;\nGRANT CREATE SESSION TO jones;\nGRANT CREATE TABLE TO jones;',

	'Which Object Privilege (other than Alter) can be granted to a Sequence?':
		'SELECT',

	'Object privileges are:':
		'Required to manipulate the content of objects in the database.',

	'The following table shows some of the output from one of the data dictionary views. Which view is being queried? USERNAME PRIVILEGE ADMIN_OPTION USCA_ORACLE_SQL01_S08 CREATE VIEW NO USCA_ORACLE_SQL01_S08 CREATE TABLE NO USCA_ORACLE_SQL01_S08 CREATE SYNONYM NO USCA_ORACLE_SQL01_S08 CREATE TRIGGER NO USCA_ORACLE_SQL01_S08 CREATE SEQUENCE NO USCA_ORACLE_SQL01_S08 CREATE DATABASE NO':
		'user_sys_privs (lists system privileges granted to the user)',

	'Which of the following best describes a role in an Oracle database?':
		'A role is a name for a group of privileges.',

	'A schema is:':
		'A collection of objects, such as tables, views, and sequences.',

	'System privileges are:':
		'Required to gain access to the database.',

	'You grant user AMY the CREATE SESSION privilege. Which type of privilege have you granted to AMY?':
		'A system privilege',

	'User ADAM has successfully logged on to the database in the past, but today he receives an error message stating that (although he has entered his password correctly) he cannot log on. What is the most likely cause of the problem?':
		'ADAM\'s CREATE SESSION privilege has been revoked.',

	'Which of the following are system privileges? (Choose two)':
		'CREATE TABLE|CREATE SYNONYM',

	'_________________ are special characters that have a special meaning, such as a wildcard character, a repeating character, a non-matching character, or a range of characters. You can use several of these symbols in pattern matching.':
		'Meta characters',

	'REGULAR EXPRESSIONS does exactly the same as LIKE--no more and no less. (True or False?)':
		'False',

	'Which of the following best describes the purpose of the REFERENCES object privilege on a table?':
		'It allows a user to create foreign key constraints on the table.',

	'When a user is logged into one database, he is restricted to working with objects found in that database. True or False?':
		'False',

	'What Oracle feature simplifies the process of granting and revoking privileges?':
		'Role',

	'Which of the following statements about granting object privileges is false?':
		'Object privileges can only be granted through roles.',

	'When granting an object privilege, which option would you include to allow the grantee to grant the privilege to another user?':
		'WITH GRANT OPTION',

	'You create a view named EMPLOYEES_VIEW on a subset of the EMPLOYEES table. User AUDREY needs to use this view to create reports. Only you and Audrey should have access to this view. Which of the following actions should you perform?':
		'GRANT SELECT ON employees_view TO audrey;',

	'Scott King owns a table called employees. He issues the following statement: GRANT select ON employees TO PUBLIC; Allison Plumb has been granted CREATE SESSION by the DBA. She logs into the database and issues the following statement: GRANT select ON scott_king.employees TO jennifer_cho; True or False: Allison\'s statement will fail.':
		'True',

	'Which of the following Object Privileges can be granted on an individual column on a table? (Choose two)':
		'Update|References',

	'REGULAR EXPRESSIONS can be used on CHAR, CLOB, and VARCHAR2 datatypes? (True or False)':
		'True',

	'Parentheses are not used to identify the sub expressions within the expression. True or False?':
		'False',

	'User JAMES has created a CUSTOMERS table and wants to allow all other users to SELECT from it. Which command should JAMES use to do this?':
		'GRANT SELECT ON customers TO PUBLIC;',

	'You need to grant user BOB SELECT privileges on the EMPLOYEES table. You want to allow BOB to grant this privileges to other users. Which statement should you use?':
		'GRANT SELECT ON employees TO bob WITH GRANT OPTION;',

	'User BOB\'s schema contains an EMPLOYEES table. BOB executes the following statement: GRANT SELECT ON employees TO mary WITH GRANT OPTION; Which of the following statements can MARY now execute successfully? (Choose two)':
		'GRANT SELECT ON bob.employees TO PUBLIC;|SELECT FROM bob.employees;',

	'User CHANG has been granted SELECT, UPDATE, INSERT, and DELETE privileges on the EMPLOYEES table. You now want to prevent Chang from adding or deleting rows from the table, while still allowing him to read and modify existing rows. Which statement should you use to do this?':
		'REVOKE INSERT, DELETE ON employees FROM chang;',

	'Which of the following is NOT a database object?':
		'Subquery',

	'Which statement would you use to add privileges to a role?':
		'GRANT',

	'Which of the following statements is true?':
		'Database Links allow users to work on remote database objects without having to log into the other database.',

	'User SUSAN creates an EMPLOYEES table, and then creates a view EMP_VIEW which shows only the FIRST_NAME and LAST_NAME columns of EMPLOYEES. User RUDI needs to be able to access employees\' names but no other data from EMPLOYEES. Which statement should SUSAN execute to allow this?':
		'GRANT SELECT ON emp_view TO rudi;',

	'To join a table in your database to a table on a second (remote) Oracle database, you need to use:':
		'A database link',

	'You want to grant user BOB the ability to change other users\' passwords. Which privilege should you grant to BOB?':
		'The ALTER USER privilege',

	'To take away a privilege from a user, you use which command?':
		'REVOKE',

	'User1 owns a table and grants select on it WITH GRANT OPTION to User2. User2 then grants select on the same table to User3. If User1 revokes select privileges from User2, will User3 be able to access the table?':
		'No',

	'Which of these is NOT a System Privilege granted by the DBA?':
		'Create Index',

	'Which statement would you use to grant a role to users?':
		'GRANT',

	// Section 17 Quiz - Additional from DeniAce blog (2026-06-05)
	'Which of the following are object privileges? (Choose two)':
		'INSERT|SELECT',
	'By Controlling User Access with Oracle Database Security, you can give access to specific Objects in the Database. True or False?':
		'True',
	'Select the correct REGULAR EXPRESSION functions: (Choose two)':
		'REGEXP_INSTR, REGEXP_SUBSTR|REGEXP_LIKE, REGEXP_REPLACE',
	'Which of these SQL functions used to manipulate strings is NOT a valid regular expression function?':
		'REGEXP',
	'You want to grant privileges to user CHAN that will allow CHAN to update the data in the EMPLOYEES table. Which type of privileges will you grant to CHAN?':
		'Object privileges',
	'Which of the following privileges must be assigned to a user account in order for that user to connect to an Oracle database?':
		'CREATE SESSION',
	'Roles are:':
		'Named groups of related privileges given to a user or another role.',
} satisfies OracleQaBank;



