import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Author from 'App/Models/Author'
import User from 'App/Models/User'

export default class AuthorSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    if (users.length === 0) {
      return
    }

    const authors = [
      { name: 'Chinua Achebe' },
      { name: 'Wole Soyinka' },
      { name: 'Chimamanda Ngozi Adichie' },
    ]

    const createdAuthors: Author[] = []  

    for (let i = 0; i < authors.length; i++) {
      const user = users[i % users.length]
      const existingAuthor = await Author.query()
        .where('user_id', user.id) 
        .whereRaw('LOWER(name) = LOWER(?)', [authors[i].name])
        .first()

      if (existingAuthor) {
        createdAuthors.push(existingAuthor)
        continue
      }

      // Create new author
      const author = await Author.create({
        name: authors[i].name,
        user_id: user.id,  
      })
      createdAuthors.push(author) 
    }

    console.log(`\n=== CREATED ${createdAuthors.length} AUTHORS ===`)
  }
}