import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class BasicEntity<T> {
  constructor (props: Partial<T>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
