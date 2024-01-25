/* eslint-env jest */

import mongoose from 'mongoose'
import Category from '../../models/category.model.js'

describe('Category Model Test', () => {
  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/testDB'
    await mongoose.connect(url, { useNewUrlParser: true })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('create & save category successfully', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test Description',
      courses: []
    }
    const validCategory = new Category(categoryData)
    const savedCategory = await validCategory.save()

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedCategory._id).toBeDefined()
    expect(savedCategory.name).toBe(categoryData.name)
    expect(savedCategory.description).toBe(categoryData.description)
    expect(savedCategory.courses).toStrictEqual(categoryData.courses)
  })
})
