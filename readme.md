
#  Kelmarid Backend Engineer Challenge

  

The goal of this challenge if to create an AdonisJsAPI backend matching the objectives down below.

  

To bootstrap this project, we've used a basic [AdonisJs](https://docs.adonisjs.com/guides/introduction) template. There is a Dockerfile available in case you want to work with Docker during development, but this is not a requirement.

  

The usage of the following packages is mandatory:

- AdonisJs 
- @adonisjs/lucid
- Typescript
- Testing

To store your data you can either use a sqllite database file, or use a local Postgres database (preferred).

  

If you choose to use a Postgres database, please provide a seed-file with some dummy data and a migration file to setup the database schema.

  

In case you use sqllite, provide the database file.

  

## Objectives

  

Create a username/password protected API that authenticates API requests using Bearer tokens (not session tokens). Store the user credentials in your database and allow us to sign in using the a frontend/API call (please provide the credentials for one user, no need to create functionality to create users). All routes are to be protected.

  

### Data schema

  

The portal will be used to manage data about authors and their books. An author can have zero or more books, a book must have at least one author. An author just has a required name field. Books have a required name field and a required page numbers field.

### User Routes
 On this routes:
  - Create User: a new user should be created with the following fields
     - Username
     - Password

  - Login User: a endpoint to login in existing users using the following fields
    - Username
    - Password

# 
#### Authors Routes

On this routes:
 - Create Author: this route creates new authors with the following fields
   - Name  

# 
 - Fetch Author:  a paginated list of authors with following field and should be searchable
    - Name field
    - Number of Books (Calculated from DB)
#
 - Edit Author: should be able to edit the following
    - Name
#
  - Delete Author: delete an author 

  

#### Books

On this routes

- Fetch Books :  a paginated list of books with following field and should be searchable
    - Name (Searchable)
    -  Author(s) name (Searchable)
	-  Number of pages

#

 - Edit Book: should be able to edit the following
	- Book Name

  

## Notes

The usage of the provided template is mandatory. Submissions not written in this template, will not be reviewed. Writing tests is mandatory. Please fork this repository and invite engineering@squareme.app and send email with the user details to your assessment. 