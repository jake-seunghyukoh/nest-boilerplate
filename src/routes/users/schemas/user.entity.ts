import { RolesEnum } from '@decorators/roles.decorator';
import { NameEntity } from 'src/schemas/common.entity';
import { TimestampedEntity } from 'src/schemas/timestamp.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ length: 32 })
  @Index({ unique: true })
  readonly email: string = '';

  @Column({ length: 128 })
  readonly password: string = '';

  @Column({ type: 'tinyint' })
  readonly verified: boolean = false;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.user })
  readonly role: RolesEnum = RolesEnum.user;

  @Column(() => NameEntity)
  name: NameEntity;
}
