import { CommentCreatedEvent } from './comment-created-event';

import { makeComment } from 'test/factories/make-comment';

let sut: CommentCreatedEvent;

describe('Comment Created Event', () => {
  beforeEach(() => {
    const comment = makeComment();

    sut = new CommentCreatedEvent(comment);
  });

  it('should be aggregate id defined', async () => {
    expect(sut.getAggregateId()).toBeDefined();
  });
});
