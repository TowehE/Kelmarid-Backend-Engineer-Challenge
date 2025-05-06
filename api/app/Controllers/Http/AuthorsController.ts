import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Author from 'App/Models/Author'
import { CreateAuthorValidator, EditAuthorValidator } from 'App/Validators/AuthorValidator'


export default class AuthorsController {

  //  Create a new author
public async store({ request, response, auth }: HttpContextContract) {
    const payload =  await request.validate(CreateAuthorValidator
    )

      const user = auth.user!
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // To check if the user has already created an author with the same name
      const existingAuthor = await Author.query()
      .where('user_id', user.id)
      .where('name', payload.name)
      .first()

    if (existingAuthor) {
      return response.conflict({
        message: 'You have already created an author with this name.',
      })
    }

    const newPayload = { ...payload, user_id: user.id }

      const newauthor = await Author.create(newPayload)
  
    return response.created({
      message: 'Author created successfully',
      data: newauthor,
    })
  }


    // Fetch authors with pagination and search
 public async index({ request, response}: HttpContextContract) {
     const page = request.input('page', 1)
    const perPage = request.input('limit', 10)
    const searchTerm = request.input('search', '')


    const authorsQuery = Database
    .from('authors')
    .select(
      'authors.id',
      'authors.name',
      Database.raw('COUNT(DISTINCT author_books.book_id) as books_count')
    )
    .leftJoin('author_books', 'authors.id', 'author_books.author_id')
    .groupBy('authors.id')

    if (searchTerm) {
        authorsQuery.whereILike('authors.name', `%${searchTerm}%`)
      }
      
      const authors = await authorsQuery.paginate(page, perPage)
      
      return response.ok({
        message: authors.total > 0 
          ? 'Authors retrieved successfully' 
          : searchTerm 
            ? 'No authors found matching the search criteria' 
            : 'No authors found in the database',
        data: authors,
      })
    }
  

// Edit an author
  public async update({ request, response, params, auth}: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const payload = await request.validate(EditAuthorValidator)
    const author = await Author.find(params.id)
        if (!author) {
          return response.notFound({ message: 'Author not found' })
        }
      
        
    if (author.user_id !== user.id) {
      return response.forbidden({ message: "You are not allowed to edit this author's name" })
    }

        const existingAuthor = await Author.query()
          .where('user_id', user.id)
          .where('name', payload.name)
          .whereNot('id', author.id)
          .first()
      
        if (existingAuthor) {
          return response.conflict({
            message: 'You already have another author with this name.',
          })
        }

    author.name = payload.name
    await author.save()

    return response.ok({
      message: 'Author updated successfully',
      data: author,
    })
  }


  

  // Fetch author by ID
  public async show({ params, response }: HttpContextContract) {
    const author = await Author.find(params.id)
    
    if (!author) {
      return response.notFound({ message: 'Author not found' })
    }

    return response.ok({
      message: 'Author retrieved successfully',
      data: author,
    })
  }



  //  Delete an author
  public async destroy({ response, params, auth }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const author = await Author.find(params.id)
    if (!author) {
        return response.notFound({ message: 'Author not found' })
    }

    if (author.user_id !== user.id) {
      return response.forbidden({ message: "You are not allowed to delete this author" })
    }
    await author.delete()

    return response.ok({
      message: 'Author deleted successfully',
    })
  }

    }



