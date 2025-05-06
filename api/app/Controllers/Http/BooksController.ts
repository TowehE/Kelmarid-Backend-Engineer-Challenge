import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Author from 'App/Models/Author'
import Book from 'App/Models/Book'
import {CreateBookValidator, UpdateBookValidator} from 'App/Validators/BookValidator'
import { DateTime } from 'luxon'
// import Database from '@ioc:Adonis/Lucid/Database'

export default class BooksController {

  // Fetch books with pagination and search
    public async index({ request, response }: HttpContextContract) {
        const page = request.input('page', 1)
        const limit   = request.input('limit', 10)
        const searchBookName = request.input('book_name', '')
        const searchAuthorName = request.input('author_name', '')
      
        const booksQuery = Book.query()
          .preload('authors')
          .select(['id', 'name', 'pages'])
      
        if (searchBookName) {
          booksQuery.whereILike('name', `%${searchBookName}%`)
        }
      
        if (searchAuthorName) {
          booksQuery.whereHas('authors', (authorQuery) => {
            authorQuery.whereILike('name', `%${searchAuthorName}%`)
          })
        }
      
        const books = await booksQuery.paginate(page, limit  )
    

        return response.ok({
          message: books.total > 0 
            ? 'Books retrieved successfully' 
            : 'No books found matching the search criteria',
          data: books,
        })
      }
        

// Create a new book
   public async store({ request, response, auth}: HttpContextContract) {
    if (!auth.user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
     const { name, pages } = await request.validate(CreateBookValidator)

   
       const book = await Book.create({
        name,
        pages,
        user_id: auth.user.id, 
      })

  
       const author = await Author.query()
       .where('user_id', auth.user.id)
       .first()

  if (author) {
    const now = DateTime.now()
    const pivotData = {
      [author.id]: {
        created_at: now,
        updated_at: now,
      }
     }
    
    await book.related('authors').attach(pivotData)
  }
  
  await book.load('authors')
  return response.created({
    message: 'Book created successfully',
    book,
  })
}


//  Edit a book
public async update({ request, response, params, auth}: HttpContextContract) {
    if (!auth.user) {
        return response.unauthorized({ message: 'User not authenticated' })
      } 
    const { name } = await request.validate(UpdateBookValidator)
    const book = await Book.find(params.id)
  
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }
  

    if (book.user_id !== auth.user.id) {
      return response.forbidden({ message: 'You are not authorized to update this book' })
    }
    
    
    if (name !== undefined) book.name = name
    // if (pages !== undefined) book.pages = pages
    
    await book.save()
    
   
    await book.load('authors')
      
    return response.ok({
      message: 'Book updated successfully',
      book,
    })
  }

  // Display a book by ID
  public async show({ params, response }: HttpContextContract) {
    const book = await Book.query()
      .where('id', params.id)
      .preload('authors')
      .first()
  
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }
  
    return response.ok(book)
  }
  
  
//  Delete a book
 public async destroy({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    
    const book = await Book.findOrFail(params.id)
    if (book.user_id !== user.id) {
        return response.forbidden({
          message: 'You are not authorized to delete this book',
        })
      }
    
   
    await book.delete()
    
    return response.ok({
      message: 'Book deleted successfully',
    })
  }

}

