import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BookInput {
  @Field()
  name: string;

  @Field()
  description: string;
}
