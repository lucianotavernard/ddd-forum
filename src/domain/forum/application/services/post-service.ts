import { Injectable } from '@nestjs/common';

import { Post } from '@/domain/forum/enterprise/entities/post';
import { Author } from '@/domain/forum/enterprise/entities/author';
import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

@Injectable()
export class PostService {
  public upvotePost(
    post: Post,
    author: Author,
    votesOnPostByAuthor: PostVote[],
  ) {
    const existingUpvote = votesOnPostByAuthor.find((v) => v.isUpvote);
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      return false;
    }

    const existingDownvote = votesOnPostByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.votes.remove(existingDownvote);
      post.points = post.points - 1;

      return false;
    }

    const upvote = PostVote.createUpvote({
      authorId: author.id,
      postId: post.id,
    });

    post.votes.add(upvote);
    post.points = post.points + 1;

    return true;
  }

  public downvotePost(
    post: Post,
    author: Author,
    votesOnPostByAuthor: PostVote[],
  ) {
    const existingDownvote = votesOnPostByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      return false;
    }

    const existingUpvote = votesOnPostByAuthor.find((v) => v.isUpvote);
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      post.votes.remove(existingUpvote);
      post.points = post.points + 1;

      return false;
    }

    const downvote = PostVote.createDownvote({
      authorId: author.id,
      postId: post.id,
    });

    post.votes.add(downvote);
    post.points = post.points - 1;

    return true;
  }
}
