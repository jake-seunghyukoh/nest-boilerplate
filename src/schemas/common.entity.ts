import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';

export class NameEntity {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @Column('varchar', { nullable: false, length: 16 })
  first: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @Column('varchar', { nullable: false, length: 16 })
  last: string;
}
