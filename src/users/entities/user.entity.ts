import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['username'])
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column('varchar')
  username: string;

  @Column('varchar')
  password: string;
}
