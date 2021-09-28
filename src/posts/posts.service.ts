import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostInput: UpdatePostInput): Promise<Post> {
    const post = await this.postRepository.preload({
      id: id,
      ...updatePostInput,
    });
    if (!post) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<Post> {
    const user = await this.findOne(id);
    await this.postRepository.remove(user);
    return {
      id: id,
      title: '',
      description: '',
      userId: 0,
      user: null,
    };
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
