import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Author from 'App/Models/Author'
import User from 'App/Models/User'

export default class AuthorSeeder extends BaseSeeder {
  public async run() {
    // Get users to associate with authors
    const users = await User.all()

    if (users.length === 0) {
      console.log('No users found. Please run UserSeeder first.')
      return
    }

    // Sample author
    const authors = [
      { name: 'Chinua Achebe' },
      { name: 'Wole Soyinka' },
      { name: 'Chimamanda Ngozi Adichie' },
    ]

    const createdAuthors: Author[] = []  

    // Distribute authors among users
    for (let i = 0; i < authors.length; i++) {
      const user = users[i % users.length]

      // Checking thus if author with this name already exists for this user
      const existingAuthor = await Author.query()
        .where('user_id', user.id) 
        .whereRaw('LOWER(name) = LOWER(?)', [authors[i].name])
        .first()

      if (existingAuthor) {
        console.log(`Author "${authors[i].name}" already exists for user ${user.username}`)
        createdAuthors.push(existingAuthor)
        continue
      }

      // Create new author
      const author = await Author.create({
        name: authors[i].name,
        userId: user.id,  
      })

      console.log(`Created author "${author.name}" (ID: ${author.id}) for user ${user.username}`)
      createdAuthors.push(author) 
    }

    console.log(`\n=== CREATED ${createdAuthors.length} AUTHORS ===`)
  }
}
