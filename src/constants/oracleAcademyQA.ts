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
  "A specialized type of software, which controls and manages the hardware in a computer system.":
    "Operating System",

  "Personal computers (PCs) have been in existence since 1950.": "False",

  "The overall mission of the Oracle Corporation is to use the internet and fast processing servers to build its own network.":
    "False",

  "Users could directly interact with which of the following software to access essential business applications? (Choose three)":
    "GUI software|Internet Browser software|Operating System software",

  "Software cannot operate without Hardware. True or False?": "True",

  "Consider your school library. It will have a database with transaction details of the books that are borrowed by students. Is the total number of books out on loan in one given month considered Data or Information?":
    "Information",

  "Information which was gained from data is the same as: (Choose Two)":
    "Intelligence|Knowledge",

  "Consider your school library. It will have a database with transaction details of the books that are borrowed by students. Is a detail of one student borrowing one book considered Data or Information?":
    "Data",

  "Databases are used in most countries and by most governments. Life, as we know it, would change drastically if we no longer had access to databases. True or False?":
    "True",

  "The work of E.F. Codd in the early 1970s led to the development of Relational databases. True or False?":
    "True",

  "SQL became the most commonly used query language in the 1980s. True or False?":
    "True",

  "Which of the following represents the correct sequence of steps in the Database Development Process?":
    "Analyze, Design, Build",

  "The market for IT professionals is still increasing and will continue to do so in the future as the world gets ever more dependent on computer systems. True or False?":
    "True",

  "The main subject areas taught by the Oracle Academy are:":
    "Data Modeling, SQL, and PL/SQL",

  "The demand for Information Technology professionals in today's market is increasing. True or False?":
    "True",

  "Once you have learned how to write programs and build systems, you no longer need any input or involvement from any users as you are perfectly capable of delivering the systems that businesses need and want.":
    "False. Business requirements can and will change. For instance new legal requirements may arise.",

  "In the grid computing model, resources are pooled together for efficiency. True or False?":
    "True",

  "Data Modeling is the last step in the database development process. True or False?":
    "False",

  "Oracle was one of the first relational database systems available commercially. True or False?":
    "True",

  "Which term describes the physical components of a computer system?":
    "Hardware",

  "An Entity Relationship model is independent of the hardware or software used for implementation. True or False?":
    "True",

  "A well structured ERD will show only some parts of the finished data model. You should never try to model the entire system in one diagram, no matter how small the diagram might be. True or False?":
    "False",

  "The purpose of an ERD is to document the proposed system and facilitate discussion and understanding of the requirements captured by the developer. True or False?":
    "True",

  "Documenting Business Requirements helps developers control the scope of the system and prevents users from claiming that the new system does not meet their business requirements. True or False?":
    "True",

  "A Conceptual Model is not concerned with how the Physical Model will be implemented. True or False?":
    "True",

  "Data modeling is performed for the following reasons: (Choose Two)":
    "It helps discussions and reviews., The ERD becomes a blueprint for designing the actual system.",

  "Which of the following entities most likely contains valid attributes? (Choose two)":
    "Entity: Home. Attributes: Number of Bedrooms, Owner, Address, Date Built|Entity: Pet. Attributes: Name, Birthdate, Owner",

  "Which of the following are examples of ENTITY: Instance ? (Choose Two)":
    "ANIMAL: Dog, TRANSPORTATION METHOD: Car",

  "8. Which of the following are examples of ENTITY: Instance ? (Choose Two)":
    "ANIMAL: Dog, TRANSPORTATION METHOD: Car",

  "Which of the following are examples of ENTITY: Instance ? (Choose Two) Mark for Review":
    "ANIMAL: Dog, TRANSPORTATION METHOD: Car",

  "Which of the following are examples of ENTITY: Instance? (Choose Two)":
    "ANIMAL: Dog, TRANSPORTATION METHOD: Car",

  "Unique Identifiers:":
    "Distinguish one instance of an entity from all other instances of that entity",

  "10. Unique Identifiers: Mark for Review":
    "Distinguish one instance of an entity from all other instances of that entity",

  "Unique Identifiers…":
    "Distinguish one instance of an entity from all other instances of that entity",

  "Which of the following statements about Entities are true?":
    '"Something" of significance to the business about which data must be known., They are usually a noun., A name for a set of similar "things"',

  "In the following statements, find two good examples of ENTITY: Instance. (Choose Two)":
    "BOOK: Biography of Mahatma Gandhi, DAIRY PRODUCT: milk",

  "A/an _________ is a piece of information that in some way describes an entity. It is a property of the entity and it quantifies, qualifies, classifies, or specifies the entity.":
    "Attribute",

  'The word "Volatile" means:': "Changing constantly; unstable",

  "Entities are usually verbs. True or False?": "False",

  "Attributes can only have one value at any point for each instance in the entity. True or False?":
    "True",

  "A/an _________'s value can be a number, a character string, a date, an image, a sound":
    "Attribute",

  "What is the purpose of a Unique Identifier?":
    "To identify one unique instance of an entity by using one or more attributes and/or relationships.",

  "Which of the following attributes is suitable to be a Unique Identifier?":
    "Social Security Number",

  "Which of the following can be found in an ERD? (Choose Two)":
    "Entities., Attributes.",

  "Data models show users the data that their Physical Model will contain. True or False?":
    "True",

  "Many reasons exist for creating a conceptual model. Choose three appropriate reasons from the options below.":
    "They capture current and future needs., They accurately describe what a physical model will contain., They model functional and informational needs.",

  "Data models are drawn to show users the actual Data that their new system will contain; only Data listed on the Diagram can be entered into the Database. True or False?":
    "True",

  "Which of the following statements about ERD's is false?":
    "Model all information that is derivable from other information already modeled.",

  "An ERD is an example of a Physical Model. True or False?": "False",

  "Which of the following statements are true about ERD's? (Choose Two)":
    "You should not model derivable data., A piece of information should only be found in one place on an ERD.",

  "Which of the following statements about attributes are true?":
    "They have a data type, such as number or character string.|They must be single valued.|They describe, qualify, quantify, classify, or specify an entity.",

  "All of the following could be attributes of an ENTITY called PERSON, except which one?":
    "Natacha Hansen",

  "All of the following would be instances of the entity PERSON except which?":
    "Male",

  "All of the following would be instances of the entity ANIMAL SPECIES, except which one?":
    "Leaf",

  "Which of the following is an example of a volatile attribute?": "Age",

  'A/an _________ is defined as "Something" of significance to the business about which data must be known.':
    "Entity",

  "Entity Relationship modeling is dependent on the hardware or software used for implementation, so you will need to change your ERD if you decide to change Hardware Vendor. True or False?":
    "False",

  "The Physical Model is derived from the Conceptual Model. True or False?":
    "True",

  "Which of the following are examples of e-businesses that use database software?":
    "Online clothing store, Online book store, Online personal shopping service",

  "Businesses involved in any of the following typically use databases to handle their data: Finance, Logistics, Commerce, Procurement, and Distribution? True or False?":
    "True",

  // Full text for the long “Changes in computing…” prompt (with appended examples)
  "Changes in computing have affected many of our day-to-day activities. Are all of the following activities examples of this change? Yes or No? In the past you used to use the phone system to call directory assistance to get a phone number. Today you can use your PC to look up a phone number online. In the past you used to have to go to the shoe store to buy shoes. Today you can use your PC to order shoes online. In the past you had to use your PC to send a person an email. Today you can use your phone to send a text message.":
    "Yes",

  "What is the difference between 'information' and 'data'?":
    "Data turns into useful information. It is stored in a database and accessed by systems and users.",
  'What is the difference between "information" and "data"?':
    "Data turns into useful information. It is stored in a database and accessed by systems and users.",
  'What is the difference between "information" and "data"? Mark for Review':
    "Data turns into useful information. It is stored in a database and accessed by systems and users.",

  "Entities are transformed into Tables during the Database Design process. True or False?":
    "True",

  "Which of the following are examples of data becoming information:":
    "A, B, and D",

  "How do you turn 'data' into 'information'?":
    "By querying it or accessing it",

  'How do you turn "data" into "information"? Mark for Review':
    "By querying it or accessing it",

  // Section 3 relationship / ERD questions
  "Relationships can be either mandatory or optional. True or False?": "True",
  "In a business that sells pet food, choose the best relationship name between food type and animal (e.g. dog, horse, or cat). (choose two)":
    "Each FOOD TYPE must be suitable for one or more ANIMALs.|Each FOOD TYPE may be given to one or more ANIMALs.",
  "One relationship can be mandatory in one direction and optional in the other direction. True or False?":
    "True",
  "Which of the following are used to show cardinality on an erd? (choose two)":
    "Crow's foot.|Single toe.",
  "Which of the following are true about cardinality? (choose two)":
    'Cardinality tells "how many".|Cardinality specifies only singularity or plurality, but not a specific plural number.',
  "Which symbol is used to show that a particular attribute is mandatory?": "*",
  "Entity boxes are drawn as": "Soft Boxes",
  "ERDish describes a relationship in words. True or False?": "True",
  "Which of the following are used to show a relationship on an erd? (choose three)":
    "Dashed line.|Crow's foot.|Solid line.",
  "When reading a relationship between 2 entities, the relationship is read both from left to right and right to left. True or False?":
    "True",
  "Relationship names are not shown on an erd. True or False?": "False",
  "Matrix diagrams show optionality and cardinality of the erds they document. True or False?":
    "False",
  "Matrix diagrams are developed before the erd. True or False?": "True",
  "Matrix diagrams are used to verify that all relationships have been identified for an erd. True or False?":
    "True",
  "When reading the relationships in an erd, you are said to be speaking:":
    "ERDish",
  "Relationships always exist between": "2 entities (or one entity and itself)",
  "To identify an attribute as part of a unique identifier on an er diagram, the # symbol goes in front of it. True or False?":
    "True",
  "Entity names are always singular. True or False?": "True",
  "Which of the following are true about relationship optionality? (choose two)":
    'Optionality answers "may or must".|Optionality specifies whether something is required or not.',
  "Which of the following are true about relationship optionality? (choose two) mark for review":
    'Optionality answers "may or must".|Optionality specifies whether something is required or not.',
  "Which of the following are used to show cardinality on an erd? (choose two) mark for review":
    "Single toe.|Crow's foot.",
  "Relationship cardinality is important. True or False?": "True",
  "What are the three properties that every relationship should have? mark for review":
    "Name, optionality, cardinality",
  "Which of the following are used to show a relationship on an erd? (choose three) mark for review":
    "Crow's foot.|Solid line.|Dashed line.",

  "Every time you shop online, it is likely you will be accessing a database. True or False?":
    "True",

  "Most of the well known Internet search engines use databases to store data. True or False?":
    "True",
  "Most of the well know Internet search engines use databases to store data. True or False?":
    "True",

  // Section 4 – Business rules, constraints, subtypes/supertypes
  'S4 A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by:':
    "Creating additional programming code to identify and report accounts past due.",
  'S4 A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by: Mark for Review':
    "Creating additional programming code to identify and report accounts past due.",
  'S4 A business rule such as "We only ship goods after customers have completely paid any outstanding balances on their account" is best enforced by:':
    "Creating additional programming code to verify no goods are shipped until the account has been settled in full.",
  "S4 How should you handle constraints that cannot be modeled on an ER diagram?":
    "List them on a separate document to be handled programmatically",
  "S4 Which of the following is an example of a structural business rule?":
    "All employees must belong to at least one department.",
  "S4 Can all constraints be modeled on an ER diagram?":
    "No, and those that cannot be modeled should be listed on a separate document to be handled programmatically",
  "S4 Why is it important to identify and document business rules?":
    "It allows you to create a complete data model and then check it for accuracy.",
  "S4 How would you model a business rule that states that girls and boys may not attend classes together?":
    "Supertype STUDENT has two subtypes BOY and GIRL which are related to GENDER, which is related to CLASS",
  "S4 A subtype can have a relationship not shared by the supertype. True or False?":
    "True",
  "S4 A subtype is drawn on an ERD as an entity inside the softbox of the supertype. True or False?":
    "True",
  "S4 A subtype is shown on an ERD as an entity with a one to many relationship to the supertype. True or False?":
    "False",
  "S4 Which of the following is true about subtypes?":
    "Subtypes must be mutually exclusive.",
  "S4 All instances of a subtype must be an instance of the supertype. True or False?":
    "True",
  "S4 A supertype can only have two subtypes and no more. True or False?":
    "False",
  "S4 You can only create relationships to a Supertype, not to a Subtype. True or False?":
    "False",
  "S4 A Supertype can have only one subtype. True or False?": "False",
  "S4 How would you model a business rule that states that on a student's birthday, he does not have to attend his classes?":
    "You cannot model this. You need to document it",
  "S4 A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False?":
    "True",
  "S4 Why is it important to identify and document structural rules?":
    "Ensures we know what data to store and how that data works together.",
  "S4 All instances of the supertype must be an instance of one of the subtypes. True or False?":
    "True",
  "S4 All instances of a subtype may be an instance of the supertype but does not have to. True or False?":
    "False",
  "S4 All ER diagrams must have one of each of the following: (Choose two)":
    "One or more Entities|Relationships between entities",
  "S4 All instances of a subtype must be an instance of the supertype. True or False? Mark for Review":
    "True",
  "S4 How should you handle constraints that cannot be modeled on an ER diagram? Mark for Review":
    "List them on a separate document to be handled programmatically",
  "S4 Why is it important to identify and document business rules? Mark for Review":
    "It allows you to create a complete data model and then check it for accuracy.",
  "S4 A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False? Mark for Review":
    "True",
  "S4 Which of the following is an example of a structural business rule? Mark for Review":
    "All employees must belong to at least one department.",
  "S4 A subtype can have a relationship not shared by the supertype. True or False? Mark for Review":
    "True",
  "S4 Which of the following is true about subtypes? Mark for Review":
    "Subtypes must be mutually exclusive.",
  "S4 All ER diagrams must have one of each of the following: (Choose two) Mark for Review":
    "One or more Entities|Relationships between entities",

  // Section 5 – Relationships, redundancy, transferability, intersection entities
  "Relationships can be Redundant. True or False?": "True",
  "If two entities have two relationships between them, these relationships can be either _____________ or _____________.":
    "Redundant or Required",
  'What uncommon relationship is described by the statements: "Each DNA SAMPLE may be taken from one and only one PERSON and each PERSON may provide one and only one DNA SAMPLE"':
    "One to One Optional",
  'What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER"':
    "One to Many",
  "If the same relationship is represented twice in an Entity Relationship Model, it is said to be:":
    "Redundant",
  "A non-transferable relationship is represented by which of the following symbols?":
    "Diamond",
  "If a relationship can NOT be moved between instances of the entities it connects, it is said to be:":
    "Non-Transferable",
  "Every ERD must have at least one non-transferable relationship. True or False?":
    "False",
  "Non-transferable relationships can only be mandatory, not optional. True or False?":
    "False",
  "Which of the following is an example of a non-transferable relationship":
    "PERSON to BIRTH PLACE",
  "When you resolve a M:M by creating an intersection entity, this new entity will always inherit:":
    "A relationship to each entity from the original M:M.",
  "What do you call the entity created when you resolve a M:M relationship?":
    "Intersection entity",
  "Intersection Entities often have the relationships participating in the UID, so the relationships are often barred. True or False?":
    "True",
  "When you resolve a M:M, you simply re-draw the relationships between the two original entities; no new entities are created. True or False?":
    "False",
  "A relationship on an ERD can have attributes. True or False?": "False",

  "1. If a relationship can NOT be moved between instances of the entities it connects, it is said to be:":
    "Non-Transferable",
  "2. Every ERD must have at least one non-transferable relationship. True or False?":
    "False",
  "3. If a relationship can be moved between instances of the entities it connects, it is said to be:":
    "Transferable",
  "4. Non-transferable relationships can only be mandatory, not optional. True or False?":
    "False",
  "5. A non-transferable relationship means the relationship is manatory at both sides. True or False?":
    "False",
  "6. If two entities have two relationships between them, these relationships can be either _____________ or _____________. Mark for Review":
    "Redundant or Required",
  "7. If the same relationship is represented twice in an Entity Relationship Model, it is said to be: Mark for Review":
    "Redundant",
  "8. Which of the following pairs of entities is most likely to be modeled as a 1:1 relationship?":
    "PERSON and FINGERPRINT",
  "9. Which of the following pairs of entities is most likely to be modeled as a M:M relationship?":
    "TEACHER and SUBJECT AREA",
  "10. One to many relationships are the most uncommon type of relationships in an ERD. True or False?":
    "False",
  "11. A barred relationship on an ERD signifies that the UID of the intersection entity is inherited from the entities that made up the original many to many relationship. True or False?":
    "True",
  "12. Many to many relationships between entities usually hide what?":
    "Another entity",
  "13. If an intersection entity is formed that contains no attributes of its own, its uniqueness may be modeled by":
    "Barring the relationships to the original entities.",
  "14. A Diamond on a relationship indicates the Relationship as Non-Tranferable. True or False?":
    "True",
  "15. A relationship can be moved between instances of the entities it connects is said to be:":
    "Transferable",

  "Many to many relationships must be left in the Model. It is important to have them documented as M-M. True or False?":
    "False",
  '2. What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER"':
    "One to Many",
  "3. If the same relationship is represented twice in an Entity Relationship Model, it is said to be:":
    "Redundant",
  "4. One to many relationships are the most uncommon type of relationships in an ERD. True or False?":
    "False",
  "5. Which of the following pairs of entities is most likely to be modeled as a M:M relationship?":
    "TEACHER and SUBJECT AREA",
  "6. A Diamond on a relationship indicates the Relationship as Non-Tranferable. True or False?":
    "True",
  "7. Every ERD must have at least one non-transferable relationship. True or False? Mark for Review":
    "False",
  "8. If a relationship can NOT be moved between instances of the entities it connects, it is said to be: Mark for Review":
    "Non-Transferable",
  "9. The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False?":
    "True",
  "10. If a relationship can be moved between instances of the entities it connects, it is said to be: Mark for Review":
    "Transferable",
  "11. When you resolve a M:M by creating an intersection entity, this new entity will always inherit: Mark for Review":
    "A relationship to each entity from the original M:M.",
  "12. When you resolve a M:M, you simply re-draw the relationships between the two original entities; no new entities are created. True or False? Mark for Review":
    "False",
  "13. Many to many relationships between entities usually hide what? Mark for Review":
    "Another entity",
  "14. A barred relationship on an ERD signifies that the UID of the intersection entity is inherited from the entities that made up the original many to many relationship. True or False? Mark for Review":
    "True",
  "15. Intersection Entities often have the relationships participating in the UID, so the relationships are often barred. True or False? Mark for Review":
    "True",

  "1. When you resolve a M:M by creating an intersection entity, this new entity will always inherit: Mark for Review":
    "A relationship to each entity from the original M:M.",
  "2. What do you call the entity created when you resolve a M:M relationship? Mark for Review":
    "Intersection entity",
  "3. Many to many relationships between entities usually hide what? Mark for Review":
    "Another entity",
  "4. A relationship on an ERD can have attributes. True or False? Mark for Review":
    "False",
  "5. If an intersection entity is formed that contains no attributes of its own, its uniqueness may be modeled by Mark for Review":
    "Barring the relationships to the original entities.",
  "6. Non-transferable relationships can only be mandatory, not optional. True or False? Mark for Review":
    "False",
  "7. The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False? Mark for Review":
    "True",
  "8. A non-transferable relationship means the relationship is manatory at both sides. True or False? Mark for Review":
    "False",
  "9. Which of the following pairs of entities is most likely to be modeled as a 1:1 relationship? Mark for Review":
    "PERSON and FINGERPRINT",
  '12. What uncommon relationship is described by the statements: "Each DNA SAMPLE may be taken from one and only one PERSON and each PERSON may provide one and only one DNA SAMPLE" Mark for Review':
    "One to One Optional",
  "13. Which of the following pairs of entities is most likely to be modeled as a M:M relationship? Mark for Review":
    "TEACHER and SUBJECT AREA",
  '14. What relationship is described by the statements: "Each CUSTOMER may place one or more ORDERs, each ORDER must be placed by one and only one CUSTOMER" Mark for Review':
    "One to Many",
  "15. Many to many relationships must be left in the Model. It is important to have them documented as M-M. True or False? Mark for Review":
    "False",
  'A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by:':
    "Creating additional programming code to identify and report accounts past due.",
  'A business rule such as "All accounts must be paid in full within 10 days of billing" is best enforced by: Mark for Review':
    "Creating additional programming code to identify and report accounts past due.",
  'A business rule such as "We only ship goods after customers have completely paid any outstanding balances on their account" is best enforced by:':
    "Creating additional programming code to verify no goods are shipped until the account has been settled in full.",
  "How should you handle constraints that cannot be modeled on an ER diagram?":
    "List them on a separate document to be handled programmatically",
  "Which of the following is an example of a structural business rule?":
    "All employees must belong to at least one department.",
  "Can all constraints be modeled on an ER diagram?":
    "No, and those that cannot be modeled should be listed on a separate document to be handled programmatically",
  "Why is it important to identify and document business rules?":
    "It allows you to create a complete data model and then check it for accuracy.",
  "How would you model a business rule that states that girls and boys may not attend classes together?":
    "Supertype STUDENT has two subtypes BOY and GIRL which are related to GENDER, which is related to CLASS",
  "A subtype can have a relationship not shared by the supertype. True or False?":
    "True",
  "A subtype is drawn on an ERD as an entity inside the softbox of the supertype. True or False?":
    "True",
  "A subtype is shown on an ERD as an entity with a one to many relationship to the supertype. True or False?":
    "False",
  "Which of the following is true about subtypes?":
    "Subtypes must be mutually exclusive.",
  "All instances of a subtype must be an instance of the supertype. True or False?":
    "True",
  "A supertype can only have two subtypes and no more. True or False?": "False",
  "You can only create relationships to a Supertype, not to a Subtype. True or False?":
    "False",
  "A Supertype can have only one subtype. True or False?": "False",
  "How would you model a business rule that states that on a student's birthday, he does not have to attend his classes?":
    "You cannot model this. You need to document it",
  "A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False?":
    "True",
  "Why is it important to identify and document structural rules?":
    "Ensures we know what data to store and how that data works together.",
  "All instances of the supertype must be an instance of one of the subtypes. True or False?":
    "True",
  "All instances of a subtype may be an instance of the supertype but does not have to. True or False?":
    "False",
  "All ER diagrams must have one of each of the following: (Choose two)":
    "One or more Entities|Relationships between entities",
  "All instances of a subtype must be an instance of the supertype. True or False? Mark for Review":
    "True",
  "How should you handle constraints that cannot be modeled on an ER diagram? Mark for Review":
    "List them on a separate document to be handled programmatically",
  "Why is it important to identify and document business rules? Mark for Review":
    "It allows you to create a complete data model and then check it for accuracy.",
  "A new system would have a mixture of both Procedural and Structural Business Rules as part of the documentation of that new system. True or False? Mark for Review":
    "True",
  "Which of the following is an example of a structural business rule? Mark for Review":
    "All employees must belong to at least one department.",
  "A subtype can have a relationship not shared by the supertype. True or False? Mark for Review":
    "True",
  "Which of the following is true about subtypes? Mark for Review":
    "Subtypes must be mutually exclusive.",
  "All ER diagrams must have one of each of the following: (Choose two) Mark for Review":
    "One or more Entities|Relationships between entities",
  'A subtype is drawn on an ERD as an entity inside the "softbox" of the supertype. True or False?':
    "True",

  "If two entities have two relationships between them, these relationships can be either _____________ or _____________ .":
    "Redundant or Required",

  'The word "Volatile" means…': "Changing constantly; unstable",

  "Attributes can be either mandatory or optional. True or False?": "True",

  // Section 6 - Normalization and UIDs (prefixed to avoid key clashes)
  "S6 Q1 Examine ENTITY CLIENT (#CLIENT ID, FIRST NAME, LAST NAME, STREET, CITY, ZIP CODE) – which normal form rule is violated?":
    "None of the above, the entity is fully normalised.",
  "S6 Q2 A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity.":
    "True",
  "S6 Q3 When any attribute in an entity is dependent on any other non-UID attribute in that entity, this is known as:":
    "Transitive dependency",
  "S6 Q4 The Rule of 3rd Normal Form states that no Non-UID attribute can be dependent on another non-UID attribute. True or False?":
    "True",
  "S6 Q5 Normalizing an Entity to 1st Normal Form is done by removing any attributes that contain multiple values. True or False?":
    "True",
  "S6 Q6 When all attributes are single-valued, the database model conforms to:":
    "1st Normal Form",
  "S6 Q7 If an entity has a multi-valued attribute, to conform to 1st Normal Form we:":
    "Create an additional entity and relate it to the original entity with a 1:M relationship.",
  "S6 Q8 When data is only stored in one place in a database, the database conforms to the rules of ___________.":
    "Normalization",
  "S6 Q9 There is no limit to how many columns can make up an entity's UID. True or False?":
    "True",
  "S6 Q10 If an entity has no attribute suitable to be a Primary UID, we can create an artificial one. True or False?":
    "True",
  "S6 Q11 A unique identifier can only be made up of one attribute. True or False?":
    "False",
  "S6 Q12 An entity can only have one Primary UID. True or False?": "True",
  "S6 Q13 To resolve a 2nd Normal Form violation, we:":
    "Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.",
  "S6 Q14 RECEIPT (#CUSTOMER ID, #STORE ID, STORE LOCATION, DATE) – make it conform to 2nd NF by:":
    "Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.",
  "S6 Q15 Any Non-UID attribute must be dependent upon the entire UID. True or False?":
    "True",

  "S6 Q16 Suitable UIDs for EMPLOYEE (Choose Two)":
    "Social Security Number|Employee ID",
  "S6 Q17 CLIENT (#CLIENT ID, FIRST NAME, LAST NAME, ORDER ID, STREET, ZIP CODE) – which normal form is violated?":
    "1st Normal Form.",
  "S6 Q18 CLIENT ORDER (#CLIENT ID, #ORDER ID, FIRST NAME, LAST NAME, ORDER DATE, CITY, ZIP CODE) – which normal form is violated?":
    "2nd Normal Form.",
  "S6 Q19 An entity can have repeated values and still be in 1st Normal Form. True or False?":
    "False",
  "S6 Q20 When data is only stored in one place in a database, the database conforms to the rules of ___________. (variant)":
    "Normalization",

  "S6 Q21 As a database designer, you do not need to worry about where you store an attribute; as long as it is on the ERD, the job is done. True or False?":
    "False",
  "S6 Q22 The candidate UID chosen to identify an entity is called the Primary UID; other candidate UIDs are called Secondary UIDs.":
    "Yes, this is the way UID's are named.",
  "S6 Q23 Where an entity has more than one attribute suitable to be the Primary UID, these are known as _____________ UIDs.":
    "Candidate",
  "S6 Q24 A candidate UID that is not chosen to be the Primary UID is called:":
    "Secondary",
  "S6 Q25 What is the rule of Second Normal Form?":
    "All non-UID attributes must be dependent upon the entire UID.",
  "S6 Q26 RECEIPT (#CUSTOMER ID, #STORE ID, STORE LOCATION, DATE) – which attribute breaks 2nd NF?":
    "STORE LOCATION",
  "S6 Q27 When is an entity in 2nd Normal Form?":
    "When all non-UID attributes are dependent upon the entire UID.",
  "S6 Q28 ORDER (Order ID, Order Date, Product id, Customer ID) is in 1st Normal Form. True or False?":
    "False",
  "S6 Q29 To convert an entity with a multi-valued attribute to 1st Normal Form we create an additional entity and relate it to the original entity with a 1:1 relationship. True or False?":
    "False",
  "S6 Q30 A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity. (variant)":
    "True",

  // Section 8 - Time, historical data, readability
  "S8 Q1 Which scenarios should be modeled so that historical data is kept? (Choose two) BABY and AGE / CUSTOMER and ORDERS / TEACHER and AGE / CUSTOMER and PAYMENTS":
    "CUSTOMER and ORDERS|CUSTOMER and PAYMENTS",
  "S8 Q2 When modeling historical data the unique identifier is always made up of a barred relationship from the original two entities. True or False?":
    "False",
  "S8 Q3 Which scenarios should be modeled so that historical data is kept? (Choose two) LIBRARY and BOOK / STUDENT and GRADE / STUDENT and AGE / LIBRARY and NUMBER OF BOOKS":
    "LIBRARY and BOOK|STUDENT and GRADE",
  "S8 Q4 Which statements enhance ERD readability? (Choose Two)":
    "Avoid crossing one relationship line with another.|It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system.",
  "S8 Q5 No formal rules exist for drawing ERDs; clarity is key. True or False?":
    "True",
  "S8 Q6 You must make sure all entities fit onto one diagram. True or False?":
    "False",
  "S8 Q7 Formal rules exist for drawing ERDs; follow them even if hard to read. True or False?":
    "False",
  "S8 Q8 All systems must include functionality to provide logging or journaling in conceptual data models. True or False?":
    "False",
  "S8 Q9 Logical constraint with time for ASSIGNMENT/EMPLOYEE":
    "An ASSIGNMENT may only refer to an EMPLOYEE with a valid employee record at the Start Date of the ASSIGNMENT.",
  "S8 Q10 Function of logging/journaling in conceptual data models":
    "Allows you to track the history of attribute values, relationships, and/or entire entities",
  "S8 Q11 How do you know when to use different types of time in your design?":
    "It depends on the functional needs of the system.",
  "S8 Q12 Logical constraint when modeling time for a country entity":
    "Countries may change their names and/or borders over a period of time.",
  "S8 Q13 In a payroll system, desirable to have a DAY entity with holiday attribute. True or False?":
    "True",
  "S8 Q14 Modeling historical data is optional. True or False?": "True",
  "S8 Q15 When a relationship may or may not be transferable depending on time, this is known as a/an":
    "Conditional Non-transferable Relationship.",

  "S8 Q16 Group entities according to volume to ease readability. True or False?":
    "True",
  "S8 Q17 Modeling historical data can produce a UID that includes a date. True or False?":
    "True",
  "S8 Q18 In a payroll system, DAY entity with holiday attribute. True or False? (repeat)":
    "True",
  "S8 Q19 Logical constraint when modeling time for a City entity":
    "Cites may change their names and/or country association if the borders of a country change.",
  "S8 Q20 Adding the concept of time makes the model more complex. True or False?":
    "True",
  "S8 Q21 If you have an entity with a DATE attribute and other date characteristics, create a DAY entity. True or False?":
    "True",
  "S8 Q22 Delivery charge varies by weekday; best modeling approach":
    "Use a Delivery Day entity, which holds prices against week days, and ensure we also have an attribute for the Requested Delivery Day in the Order Entity.",
  "S8 Q23 Why model time when selling gold bars?":
    "The price of gold fluctuates and, to determine the current price, you need to know the time of purchase.",
  "S8 Q24 Historical data must never be kept. True or False?": "False",
  "S8 Q25 If you want to keep changing prices over time for products, best modeling approach":
    "Both A and C",
  "S8 Q26 High-volume entities grouping improves readability. True or False?":
    "True",
  "S8 Q27 No point in grouping entities; readability is a waste. True or False?":
    "False",
  "S8 Q28 ERD readability: crows feet consistent direction and no crossing lines. True or False?":
    "True",
  "S8 Q29 Time-aware constraint for country (variant)":
    "Countries may change their names and/or borders over a period of time.",
  "S8 Q30 Time-aware constraint for city (variant)":
    "Cites may change their names and/or country association if the borders of a country change.",

  // Section 9 - Physical design, arcs, subtypes, constraints (S9 prefix to avoid collisions)
  "S9 Q1 Arc to physical design: make FKs optional and add check so only one FK populated (Exclusive)":
    "Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not",
  "S9 Q2 Valid reason for subtype implementation":
    "Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.",
  "S9 Q3 Subtype FK columns become mandatory. True or False?": "False",
  "S9 Q4 Why 1_TABLE not allowed in Oracle":
    "Object names must not start with a number. They must begin with a letter.",
  "S9 Q5 Why 'EMPLOYEE JOBS' not allowed in Oracle":
    "You cannot have spaces between words in a table name",
  "S9 Q6 Why table name this_year_end+next_year invalid":
    "The Plus sign + is not allowed in object names.",
  "S9 Q7 In physical model, an attribute becomes a ______.": "Column",
  "S9 Q8 To resolve M:M in physical model create": "Intersection table",
  "S9 Q9 When an Arc is transformed every relationship becomes mandatory FK. True or False?":
    "False",
  "S9 Q10 Oracle DB can implement M:M by two FKs directly. True or False?":
    "False",
  "S9 Q11 Barred relationship FK is part of": "The Primary Key",
  "S9 Q12 Column integrity refers to":
    "Columns always containing values consistent with the defined data format",
  "S9 Q13 Constraint type: column must contain only values consistent with defined data format":
    "Column integrity",
  "S9 Q14 Incorrect statements about primary key (choose three)":
    "Only one column that must be null.|A single column that uniquely identifies each column in a table.|A set of columns in one table that uniquely identifies each row in another table.",
  "S9 Q15 Correct statements about primary key (choose three)":
    "A set of columns and keys in a single table that uniquely identifies each row in a single table|A single column that uniquely identifies each row in a table|A set of columns that uniquely identifies each row in a table",

  "S9 Q16 FK cannot be null when": "It is part of a primary key",
  "S9 Q17 Arc Implementation synonym for":
    "Supertype and Subtype Implementation",
  "S9 Q18 Physical model is created by transforming which model": "Conceptual",
  "S9 Q19 Relationships at subtype level implemented as optional FKs. True or False?":
    "True",
  "S9 Q20 Optional-to-mandatory 1:M becomes ______ on master table":
    "Optional Foreign Key",
  "S9 Q21 One-to-One relationships transform into FK at either end. True or False?":
    "False",
  "S9 Q22 A table must have a primary key. True or False?": "False",
  "S9 Q23 Entity ORDER (Order ID, Order Date, Product id, Customer ID) is in 1NF. True or False?":
    "False",
  "S9 Q24 Constraint type: PK must be unique and not null": "Entity integrity",
  "S9 Q25 Referential integrity example dept_no matches departments":
    "Referential integrity",
  "S9 Q26 Conceptual model to physical becomes relational DB. True or False?":
    "True",
  "S9 Q27 A foreign key always refers to a primary key in the same table. True or False?":
    "False",
  'S9 Q28 An "Arc Implementation" can be done just like any other Relationship by simply adding required FKs. True or False?':
    "False",
  "S9 Q29 Many to many resolved via intersection table. True or False?": "True",
  "S9 Q30 When transforming ERD, relationships can only become UIDs. True or False?":
    "False",

  // Section 7 – Arcs, recursive & hierarchical relationships
  "S7 Q1 Which of the following would best be represented by an arc? STUDENT ( University, Technical College)":
    "STUDENT ( University, Technical College)",
  "S7 Q2 Arcs are Mandatory in Data modeling. All ERD's must have at least one Arc. True or False?":
    "False",
  "S7 Q3 To visually represent exclusivity between two or more relationships in an ERD you would most likely use an ________.":
    "Arc",
  "S7 Q4 An arc can often be modeled as Supertype and Subtypes. True or False?":
    "True",
  "S7 Q5 Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office)":
    "DELIVERY ADDRESS (Home, Office)",
  "S7 Q6 All relationships participating in an arc must be mandatory. True or False?":
    "False",
  "S7 Q7 Every business has restrictions on which attribute values and which relationships are allowed. These are known as:":
    "Constraints.",
  "S7 Q8 Arcs are used to visually represent _________ between two or more relationships in an ERD.":
    "Exclusivity",
  "S7 Q9 Cascading UIDs are a feature often found in what type of Relationship?":
    "Heirarchical Relationship",
  "S7 Q10 A relationship between an entity and itself is called a/an:":
    "Recursive Relationship",
  "S7 Q11 A Recursive Relationship is represented on an ERD by a/an:":
    "Pig's Ear",
  "S7 Q12 A single relationship can be both Recursive and Hierarchical at the same time. True or False?":
    "False",
  "S7 Q13 Business organizational charts are often modeled as a Hierarchical relationship. True or False?":
    "True",
  "S7 Q14 A recursive relationship must be Mandatory at both ends. True or False?":
    "False",
  "S7 Q15 A Hierarchical relationship is a series of relationships that reflect entities organized into successive levels. True or False?":
    "True",

  "S7 Q16 A particular problem may be solved using either a Recursive Relationship or a Hierarchical Relationship, though not at the same time. True or False?":
    "True",
  "S7 Q17 Which of the following can be added to a relationship?":
    "An arc can be assigned",
  "S7 Q18 Arcs model an Exclusive OR constraint. True or False?": "True",
  "S7 Q19 Which of the following would best be represented by an arc? STUDENT (senior, male / University, Technical College)":
    "STUDENT ( University, Technical College)",
  "S7 Q20 Which of the following pairs is most likely an arc example: DELIVERY ADDRESS (Home, Office)":
    "DELIVERY ADDRESS (Home, Office)",
  "S7 Q21 Arcs are used to visually represent exclusivity between two or more relationships in an ERD. True or False?":
    "True",
  "S7 Q22 Which of the following can be added to a relationship? (variant)":
    "An arc can be assigned",
  "S7 Q23 A single relationship can be both Recursive and Hierarchical at the same time. True or False? (variant)":
    "False",
  "S7 Q24 The relationship between CUSTOMER and RECEIPT is an example of a non-transferable relationship. True or False? (hierarchy topic overlap)":
    "True",
  "S7 Q25 Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office) Mark for Review":
    "DELIVERY ADDRESS (Home, Office)",

  "Which of the following would be suitable UIDs for the entity EMPLOYEE: (Choose Two)":
    "Employee ID | Social Security Number",

  "When all attributes are single-valued, the database model is said to conform to:":
    "1st Normal Form",

  "A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity. True or False?":
    "True",

  "When data is stored in more than one place in a database, the database violates the rules of ___________.":
    "Normalization",

  "Examine the following Entity and decide which sets of attributes break the 3rd Normal Form rule:":
    "DRIVER ID, DRIVER NAME",

  "Normalizing an Entity to 1st Normal Form is done by removing any attributes that contain muliple values. True or False?":
    "True",

  "People are not born with “numbers”, but a lot of systems assign student numbers, customer IDs, etc.  These are known as a/an ______________ UID.":
    "Artificial",

  "A single relationship can be both Recursive and Hierachal at the same time. True or False?":
    "False",

  "How do you know when to use the different types of time in your design?":
    "It depends on the functional needs of the system .",

  "There is no point in trying to group your entities together on your diagram according to volume, and making a diagram look nice is a waste of time. True or False?":
    "False",

  "You are doing a data model for a computer sales company where the price fluctuates on a regular basis. If you want to allow the company to modify the price and keep track of the changes, what is the best way to model this?":
    "E. Both A and C",

  "When a system requires that old values for attributes are kept on record, this is know as Journaling or Logging. True or False?":
    "True",

  "Formal rules exist for drawing ERD's. You must always follow them, even if it results in an ERD that is difficult to read. True or False?":
    "False",

  "There are no circumstances where you would create a DAY entity. True or False?":
    "False",

  "When you add the concept of time to your data model, your model becomes more complex. True or False?":
    "True",

  "Modeling historical data can produce a unique identifier that includes a date. True or False?":
    "True",

  "Which of the following statements are true for ERD's to enhance their readability. (Choose Two)":
    "It is OK to break down a large ERD into subsets of the overall picture. By doing so, you end up with more than one ERD that, taken together, documents the entire system. | Avoid crossing one relationship line with another.",

  "You are doing a data model for a computer sales company where the price of postage depends upon the day of the week that goods are shipped. So shipping is more expensive if the customer wants a delivery to take place on a Saturday or Sunday. What would be the best way to model this?":
    "Use a Delivery Day entity, which holds prices against week days, and ensure the we also have an attribute for the Requested Delivery Day in the Order Entity.",

  "In a payroll system, it is desirable to have an entity called DAY with a holiday attribute when you want to track special holiday dates. True or False?":
    "True",

  // Section 6 - Normalization / UIDs (no prefixes)
  "Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ATTRIBUTES: # CLIENT ID FIRST NAME LAST NAME STREET CITY ZIP CODE":
    "None of the above, the entity is fully normalised.",
  "Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ATTRIBUTES: # CLIENT ID FIRST NAME LAST NAME ORDER ID STREET ZIP CODE":
    "1st Normal Form.",
  "Examine the following Entity and decide which rule of Normal Form is being violated: ENTITY: CLIENT ORDER ATTRIBUTES: # CLIENT ID # ORDER ID FIRST NAME LAST NAME ORDER DATE CITY ZIP CODE":
    "2nd Normal Form.",
  "A transitive dependency exists when any attribute in an entity is dependent on any other non-UID attribute in that entity.":
    "True",
  "When any attribute in an entity is dependent on any other non-UID attribute in that entity, this is known as:":
    "Transitive dependency",
  "The Rule of 3rd Normal Form states that No Non-UID attribute can be dependent on another non-UID attribute. True or False?":
    "True",
  "If an entity has a multi-valued attribute, to conform to the rule of 1st Normal Form we:":
    "Create an additional entity and relate it to the original entity with a 1:M relationship.",
  "When data is only stored in one place in a database, the database conforms to the rules of ___________.":
    "Normalization",
  "There is no limit to how many columns can make up an entity's UID. True or False?":
    "True",
  "If an entity has no attribute suitable to be a Primary UID, we can create an artificial one. True or False?":
    "True",
  "A unique identifier can only be made up of one attribute. True or False?":
    "False",
  "An entity can only have one Primary UID. True or False?": "True",
  "To resolve a 2nd Normal Form violation, we":
    "Move the attribute that violates 2nd Normal Form to a new entity with a relationship to the original entity.",
  "Examine the following entity and decide how to make it conform to the rule of 2nd Normal Form: ENTITY: RECEIPT ATTRIBUTES: #CUSTOMER ID #STORE ID STORE LOCATION DATE":
    "Move the attribute STORE LOCATION to a new entity, STORE, with a UID of STORE ID, and create a relationship to the original entity.",
  "Any Non-UID attribute must be dependent upon the entire UID. True or False?":
    "True",

  // Section 7 - Arcs / recursive / hierarchical
  "Which of the following would best be represented by an arc? STUDENT ( University, Technical College)":
    "STUDENT ( University, Technical College)",
  "Arcs are Mandatory in Data modeling. All ERD's must have at least one Arc. True or False?":
    "False",
  "To visually represent exclusivity between two or more relationships in an ERD you would most likely use an ________.":
    "Arc",
  "An arc can often be modeled as Supertype and Subtypes. True or False?":
    "True",
  "Which of the following would best be represented by an arc? DELIVERY ADDRESS (Home, Office)":
    "DELIVERY ADDRESS (Home, Office)",
  "All relationships participating in an arc must be mandatory. True or False?":
    "False",
  "Every business has restrictions on which attribute values and which relationships are allowed. These are known as:":
    "Constraints.",
  "Arcs are used to visually represent _________ between two or more relationships in an ERD.":
    "Exclusivity",
  "Cascading UIDs are a feature often found in what type of Relationship?":
    "Heirarchical Relationship",
  "A relationship between an entity and itself is called a/an:":
    "Recursive Relationship",
  "A Recursive Relationship is represented on an ERD by a/an:": "Pig's Ear",
  "A single relationship can be both Recursive and Hierarchical at the same time. True or False?":
    "False",
  "Business organizational charts are often modeled as a Hierarchical relationship. True or False?":
    "True",
  "A recursive relationship must be Mandatory at both ends. True or False?":
    "False",
  "A Hierarchical relationship is a series of relationships that reflect entities organized into successive levels. True or False?":
    "True",

  // Section 8 - Time / historical data / readability extras
  "Which of the following scenarios should be modeled so that historical data is kept? (Choose two) CUSTOMER and ORDERS / CUSTOMER and PAYMENTS / TEACHER and AGE / BABY and AGE":
    "CUSTOMER and ORDERS|CUSTOMER and PAYMENTS",
  "Which of the following scenarios should be modeled so that historical data is kept? (Choose two) LIBRARY and BOOK / STUDENT and GRADE / STUDENT and AGE / LIBRARY and NUMBER OF BOOKS":
    "LIBRARY and BOOK|STUDENT and GRADE",
  "Modeling historical data is optional. True or False?": "True",
  "When a relationship may or may not be transferable, depending on time, this is know as a/an:":
    "Conditional Non-transferable Relationship.",
  "Which of the following is a logical constraint when modeling time for a City entity?":
    "Cites may change their names and/or country association if the borders of a country change.",
  "If you have an entity with a DATE attribute, and other attributes that track characteristics of the date, you should create a DAY entity. True or False?":
    "True",
  "Which of the following would be a logical constraint when modeling time for a country entity?":
    "Countries may change their names and/or borders over a period of time.",
  "All systems must include functionality to provide logging or journaling in conceptual data models. True or False?":
    "False",
  "In an ERD, High Volume Entities usually have very few relationships to other entities. True or False?":
    "True",
  "All systems must have an entity called WEEK with a holiday attribute so that you know when to give employees a holiday. True or False?":
    "False",
  "Historical data must never be kept. True or False?": "False",

  // Section 9 - Physical design, arcs, constraints
  "When translating an arc relationship to a physical design, you must turn the arc relationships into foreign keys. What additional step must you take with the created foreign keys to ensure the exclusivity principle of arc relationships? (Assume that you are implementing an Exclusive Design)":
    "Make all relationships optional|Create an additional check constraint to verify that one foreign key is populated and the others are not",
  "Which of the following is a valid reason for considering a Subtype Implementation?":
    "Business functionality, business rules, access paths, and frequency of access are all very different between the subtypes.",
  "When mapping supertypes, relationships at the supertype level transform as usual. Relationships at subtype level are implemented as foreign keys, but the foreign key columns all become mandatory. True or False?":
    "False",
  "In an Oracle database, why would 1_TABLE not work as a table name?":
    "Object names must not start with a number. They must begin with a letter.",
  "In an Oracle database, why would the following table name not be allowed 'EMPLOYEE JOBS'?":
    "You cannot have spaces between words in a table name",
  "Why would this table name NOT work in an Oracle database? this_year_end+next_year":
    "The Plus sign + is not allowed in object names.",
  "In a physical data model, an attribute becomes a _____________.": "Column",
  "To resolve a many to many relationship in a physical model you create a(n) ___________________?":
    "Intersection table",
  "When an Arc is transformed to the physical model every relationship in the Arc becomes a mandatory Foreign Key. True or False?":
    "False",
  "The Oracle Database can implement a many to many relationship. You simply create two foreign keys between the two tables. True or False?":
    "False",
  "A barrred Relationship will result in a Foreign Key column that also is part of:":
    "The Primary Key",
  "Column integrity refers to":
    "Columns always containing values consistent with the defined data format",
  "A column must contain only values consistent with the defined data format of the column":
    "Column integrity",
  "Foreign keys cannot be null when": "It is part of a primary key",
  'The "Arc Implementation" is a synonym for what type of implementation?':
    "Supertype and Subtype Implementation",
  "The Physical model is created by transforming which of the following models?":
    "Conceptual",
  "Relationships at the subtype level are implemented as foreign keys, but the foreign key columns all become optional. True or False?":
    "True",
  "One-to-Many Optional to Mandatory becomes a _______________ on the Master table.":
    "Optional Foreign Key",
  "A table does not have to have a primary key. True or False?": "True",
  "A primary key must be unique, and no part of the primary key can be null.":
    "Entity integrity",
  "A foreign key always refers to a primary key in the same table. True or False?":
    "False",
  "The conceptual model is transformed into a physical model. The physical implementation will be a relational database. True or False?":
    "True",
  "Relationships on an ERD can only be transformed into UIDs in the physical model? True or False?":
    "False",
  "Attributes become columns in a database table. True or False?": "True",

  "An Arc is transformed to the physical model by adding a foreign Key for every relationship in the Arc. True or False?":
    "True",

  "One-to-One relationships are transformed into Foreign Keys in the tables created at either end of that relationship. True or False?":
    "False",

  "The explanation below is an example of which constraint type?\nIf the value in the balance column of the ACCOUNTS table is below 100, we must send a letter to the account owner which will require extra programming to enforce.":
    "User-defined integrity",

  "Two entities A and B have an optional (A) to Mandatory (B) One-to-One relationship. When they are transformed, the Foreign Key(s) is placed on:":
    "The table B",

  "The transformation from an ER diagram to a physical design involves changing terminology. Entities in the ER diagram become __________ :":
    "Tables",

  "To convert an entity with a multi valued attribute to 1st Normal Form, we create an additional entity and relate it to the original entity with a 1:1 relationship. True or False?":
    "False",

  "In a physical model, many to many relationships are resolved via a structure called a(n): ________________":
    "Intersection Table",

  "Identify all of the incorrect statements that complete this sentence: A primary key is... (Choose Three)":
    "A set of columns in one table that uniquely identifies each row in another table. | A single column that uniquely identifies each column in a table. | Only one column that must be null.",

  "Systems are always just rolled out as soon as the programming phase is finished. No further work is required once the development is finished. True or False?":
    "False",

  "Conditional non-transferability refers to a relationship that may or may not be transferable, depending on time. True or False?":
    "True",

  "In a physical data model, a relationship is represented as a combination of: (Choose Two)":
    "Foreign Key | Primary Key or Unique Key",

  "In an ERD, it is a good idea to group your entities according to the expected volumes. By grouping high volume entities together, the diagrams could become easier to read. True or False?":
    "False",

  "In a physical data model, a relationship is represented as a:":
    "Foreign Key",

  "A table should have a primary key. True or False?": "True",

  'An "Arc Implementation" can be done just like any other Relationship - you simply add the required Foreign Keys. True or False?':
    "False",

  "Which of the following would best be represented by an arc?":
    "DELIVERY ADDRESS (Home, Office)",

  "In which phases of the System Development Life Cycle will we need to use SQL as a language? (Choose Two)":
    "Build and Document | Transition",

  "An entity could have more than one attribute that would be a suitable Primary UID. True or False?":
    "True",

  "Which of the following statements are true to enhance the readability of ERDs? (Choose Two)":
    "Crows feet (the many-ends of relationships) should consistently point the same direction where possible, either South & East or North & West | Relationship lines should not cross.",

  "An attribute can have multiple values and still be in 1st Normal Form. True or False?":
    "False",

  "Business rules are important to data modelers because:":
    "A. They capture all of the needs, processes, and required functionality of the business.",

  "As a database designer, you do not need to worry about where in the datamodel you store a particular attribute; as long as you get it onto the ERD, your job is done. True or False?":
    "False",
} satisfies OracleQaBank;
