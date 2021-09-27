import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'id of the user' })
  id: number;
  @Column()
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Column()
  @Field(() => String, { description: 'password of the user' })
  password: string;
  @Column()
  @Field(() => String, { description: 'first name of the user' })
  firstName: string;
  @Column()
  @Field(() => String, { description: 'last name of the user' })
  lastName: string;
  @Column({ nullable: true })
  @Field(() => String, { description: 'role of the user' })
  role: string;
  @OneToMany((type) => Post, (post) => post.user, {
    eager: true,
  })
  posts: Post[];
}

@ObjectType()
export class LoginUserResponse {
  @Field(() => Int, { description: 'id of the user' })
  id: number;
  @Field(() => String, { description: 'token of the user' })
  token: string;
}
