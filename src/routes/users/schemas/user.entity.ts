import { RolesEnum } from '@decorators/roles.decorator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly uid: string;

  @Column({ length: 32 })
  @Index({ unique: true })
  readonly username: string = '';

  @Column({ length: 32 })
  readonly password: string = '';

  @Column({ type: 'tinyint' })
  readonly verified: boolean = false;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.user })
  readonly role: RolesEnum = RolesEnum.user;
}
