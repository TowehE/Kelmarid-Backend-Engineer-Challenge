import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Book from 'App/Models/Book'
import Author from 'App/Models/Author'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run () {
    const users = await User.all()
    const authors = await Author.all()

    if (users.length === 0) {
      console.log('No users found. Please run UserSeeder first.')
      return
    }

    if (authors.length === 0) {
      console.log('No authors found. Please run AuthorSeeder first.')
      return
    }

    const booksData = [
      { name: 'Half of a Yellow Sun', pages: 223 },
      { name: 'A Game of Thrones', pages: 694 },
      { name: 'A Man of the People ', pages: 256 },
      { name: 'Things Fall Apart', pages: 279 },
    ]

    // Create books
    for (let i = 0; i < booksData.length; i++) {
      const user = users[i % users.length]

      try {
        // Check if book already exists
        const existingBook = await Book.query()
          .where('name', booksData[i].name)
          .where('user_id', user.id)
          .first()

        if (existingBook) {
          console.log(`Book "${booksData[i].name}" already exists for user ${user.username}`)
          continue
        }

        // Create book
        const book = await Book.create({
          name: booksData[i].name,
          pages: booksData[i].pages,
          user_id: user.id
        })

        // Select authors for this book (you can customize authorCount logic here)
        const authorCount = 1
        const bookAuthors: Author[] = []

        // Select authors for this book
        const startIndex = i % authors.length
        for (let j = 0; j < authorCount; j++) {
          const authorIndex = (startIndex + j) % authors.length
          bookAuthors.push(authors[authorIndex])
        }

        // Create pivot data for author relationships
        const now = DateTime.now()
        const pivotData = bookAuthors.reduce((acc, author) => {
          acc[author.id] = {
            created_at: now,
            updated_at: now,
          }
          return acc
        }, {} as Record<number, { created_at: DateTime; updated_at: DateTime }>)

        // Attach authors to book
        await book.related('authors').attach(pivotData)

        // Get author names for logging
        const authorNames = bookAuthors.map(author => author.name).join(', ')

        console.log(`Created book "${book.name}" (${book.pages} pages) by ${authorNames} for user ${user.username}`)
      } catch (error) {
        console.error(`Error creating book "${booksData[i].name}":`, error.message)
      }
    }

    console.log(`\n=== CREATED BOOKS WITH AUTHOR RELATIONSHIPS ===`)
  }
}
