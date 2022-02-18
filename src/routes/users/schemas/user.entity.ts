import { RolesEnum } from '@decorators/roles.decorator';
import { NameEntity } from 'src/schemas/common.entity';
import { TimestampedEntity } from 'src/schemas/timestamp.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('varchar', { length: 32, nullable: false })
  @Index({ unique: true })
  readonly email: string;

  @Column('varchar', { length: 60, nullable: false })
  readonly password: string;

  @Column('tinyint', { default: false })
  readonly verified: boolean = false;

  @Column('enum', { enum: RolesEnum, default: RolesEnum.user })
  readonly role: RolesEnum = RolesEnum.user;

  @Column(() => NameEntity)
  name: NameEntity;
}
