// database/factories/index.ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import Author from 'App/Models/Author'
import Book from 'App/Models/Book'
import { DateTime } from 'luxon'


export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.userName(),
      password: 'Password123@', 
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .build()

export const AuthorFactory = Factory
  .define(Author, ({ faker }) => {
    return {
      name: faker.person.fullName(),
     
    }
  })
  .relation('user', () => UserFactory) 
  .build()

export const BookFactory = Factory
  .define(Book, ({ faker }) => {
    return {
      name: faker.lorem.words(3),
      pages: faker.number.int({ min: 50, max: 1000 }),
    }
  })
  .relation('authors', () => AuthorFactory)
  .build() 