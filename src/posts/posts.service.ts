import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createPostInput: CreatePostInput) {
    const { title, description, userId } = createPostInput;
    const post = await this.postRepository.create({
      title,
      description,
      userId,
    });
    return post;
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
  async findPostsByUserId(userId: number): Promise<Array<Post>> {
    const posts = await this.postRepository.find({
      where: {
        // userId,
      },
    });
    return posts;
  }
}
