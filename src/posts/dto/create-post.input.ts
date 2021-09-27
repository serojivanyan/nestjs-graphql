import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Post title' })
  title: string;
  @Field(() => String, { description: 'Post Description' })
  description: string;
  // @Field(() => Int, { description: 'Post Author' })
  // userId: string;
}
