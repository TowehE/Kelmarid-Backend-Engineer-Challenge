import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import {CreateBookValidator, UpdateBookValidator} from 'App/Validators/BookValidator'
import { DateTime } from 'luxon'
// import Database from '@ioc:Adonis/Lucid/Database'

export default class BooksController {
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
        


   public async store({ request, response, auth}: HttpContextContract) {
     const { name, pages, authorIds } = await request.validate(CreateBookValidator)

       // Create book
         const book = await Book.create({
           name,
           pages,
           user_id: auth.user?.id, 
         })

         const now = DateTime.now()
         const pivotData = authorIds.reduce((acc, authorId) => {
           acc[authorId] = {
             created_at: now,
             updated_at: now,
           }
           return acc
         }, {} as Record<number, { created_at: DateTime; updated_at: DateTime }>)
       
        
         await book.related('authors').attach(pivotData)
         await book.load('authors')
         return response.created({
            message: 'Book created successfully',
            book,
          })
        }




public async update({ request, response, params, auth}: HttpContextContract) {
    // const user = auth.user
    // if (!user) {
    //   return response.unauthorized({ message: 'User not authenticated' })
    // }

 const { name, pages, authorIds} = await request.validate(UpdateBookValidator)
 const book = await Book.find(params.id)

  if (!book) {
    return response.notFound({ message: 'Book not found' })
  }

   // Check if the authenticated user is the owner of the book
   if (book.user_id !== auth.user?.id) {
    return response.forbidden({ message: 'You are not authorized to update this book' })
  }
   
     if (!book){
        return response.notFound({ message: 'Book not found'})
     }
     console.log('Book owner ID:', book.user_id)
console.log('Authenticated user ID:', auth.user?.id)

    // Update book properties if provided
    if (name !== undefined) book.name = name
    if (pages !== undefined) book.pages = pages
    
    await book.save()

       // Update authors if provided
       if (authorIds !== undefined) {
        await book.related('authors').sync(authorIds)
      }
      
// Reload authors relationship
await book.load('authors')
    
return response.ok({
  message: 'Book updated successfully',
  book,
})
}


public async show({ params, response }: HttpContextContract) {
    const book = await Book.query()
      .where('id', params.id)
      .preload('authors')
      .firstOrFail()

      if (!book) {
        return response.notFound({ message: 'Book not found' })
      }
      
    return response.ok(book)
  }
  

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

