import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'
import User from './User'

export default class Author extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ columnName: 'user_id' })
  public user_id: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

 @manyToMany(() => Book, {
    pivotTable: 'author_books',
  })
  public books: ManyToMany<typeof Book>


   @belongsTo(() => User, {
      foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>

    @computed ()
    public get books_count() {
      return this.$extras.books_count ?? 0
    }
  }
