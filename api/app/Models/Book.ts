import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Author from './Author'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number

 @column()
  public name: string

  @column()
  public pages: number

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

 @manyToMany(() => Author, {
    pivotTable: 'author_books',
  })
  public authors: ManyToMany<typeof Author>

}

