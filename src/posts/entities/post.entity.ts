import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  Entity,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'id of the post' })
  id: number;

  @Column()
  @Field(() => String, { description: 'title of the post' })
  title: string;

  @Column()
  @Field(() => String, { description: 'description of the post' })
  description: string;


  @ManyToOne((type) => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  user: User;
}
