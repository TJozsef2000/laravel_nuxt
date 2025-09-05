import { describe, it, expect } from 'vitest'

// Basic validation to ensure test setup works
describe('Basic validation tests', () => {
  it('should validate that JavaScript works', () => {
    expect(1 + 1).toBe(2)
  })

  it('should validate that async functions work', async () => {
    const promise = Promise.resolve('test')
    const result = await promise
    expect(result).toBe('test')
  })

  it('should validate that objects work', () => {
    const obj = { name: 'test', value: 123 }
    expect(obj.name).toBe('test')
    expect(obj.value).toBe(123)
  })

  it('should validate that arrays work', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr[0]).toBe(1)
  })
})