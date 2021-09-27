import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  email: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
}
