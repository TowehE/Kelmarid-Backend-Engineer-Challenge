import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  // public static developmentOnly = true

  public async run() {
    const now = DateTime.now()
    
    // Check for existing users 
    const existingUsernames = await User.query().select('username')
    const existingUsernameSet = new Set(existingUsernames.map(user => user.username.toLowerCase()))
    
    // Define users to create
    const usersToCreate = [
      {
        username: 'Shyali',
        password: 'Testing123@!', 
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'Toweh',
        password: 'Testing123@!', 
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'testuser2',
        password: 'Pass@123', 
        createdAt: now,
        updatedAt: now
      },
    ]
    
    // Filter out users that already exist
    const uniqueUsers = usersToCreate.filter(user => 
      !existingUsernameSet.has(user.username.toLowerCase())
    )
    
    if (uniqueUsers.length > 0) {
      // Create only new unique users
      await User.createMany(uniqueUsers)
      console.log(`${uniqueUsers.length} new seed users created successfully!`)
    } else {
      console.log('No new users to seed, all already exist')
    }
    
    // Log the number of users for verification
    const userCount = await User.query().count('* as total')
    console.log(`Total users in database: ${userCount[0].$extras.total}`)
  }
}