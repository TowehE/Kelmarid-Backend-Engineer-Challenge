import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'


export default class UserSeeder extends BaseSeeder {
  public async run () {
    const users = [
      {
        username: 'tester',
        password: 'Test123!',
      },
    ]

    // Create users
        for (const userData of users) {
          // Check if user already exists to avoid duplicates
          const existingUser = await User.query()
            .whereRaw('LOWER(username) = LOWER(?)', [userData.username])
            .first()
          
          if (!existingUser) {
            // Create the user if it doesn't exist
            await User.create(userData)
            console.log(`User ${userData.username} created successfully`)
          } else {
            console.log(`User ${userData.username} already exists, skipping`)
          }
        }
      }
        }

