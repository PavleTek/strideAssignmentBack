import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Create a comment on an article or flashcard
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    let { text, parentId, articleId, flashcardId, contentType } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Comment text is required' });
      return;
    }

    // Determine comment level and handle parent comment lookup
    let level = 1;
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        res.status(404).json({ error: 'Parent comment not found' });
        return;
      }

      if (parentComment.level >= 4) {
        res.status(400).json({ error: 'Cannot reply to comments beyond level 4' });
        return;
      }

      level = parentComment.level + 1;
      
      // For comment replies, get the articleId or flashcardId from the parent comment
      if (parentComment.articleId) {
        articleId = parentComment.articleId;
      } else if (parentComment.flashcardId) {
        flashcardId = parentComment.flashcardId;
      }
    } else {
      // For top-level comments, validate that contentType matches the provided IDs
      if (contentType === 'flashcard' && !flashcardId) {
        res.status(400).json({ error: 'flashcardId is required for flashcard comments' });
        return;
      }
      if ((contentType === 'article' || contentType === 'alert') && !articleId) {
        res.status(400).json({ error: 'articleId is required for article/alert comments' });
        return;
      }
    }

    if (!articleId && !flashcardId) {
      res.status(400).json({ error: 'Either articleId or flashcardId is required' });
      return;
    }

    if (articleId && flashcardId) {
      res.status(400).json({ error: 'Cannot comment on both article and flashcard simultaneously' });
      return;
    }

    const commentData: any = {
      text,
      level,
      authorId: userId
    };

    if (parentId) {
      commentData.parentId = parentId;
    }

    if (articleId) {
      commentData.articleId = articleId;
    }

    if (flashcardId) {
      commentData.flashcardId = flashcardId;
    }

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Create a reaction on an article, flashcard, comment, or alert
export const createReaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { emoji, articleId, flashcardId, commentId, alertId } = req.body;

    if (!emoji) {
      res.status(400).json({ error: 'Emoji is required' });
      return;
    }

    // Validate emoji (only allow 3 specific emojis)
    const allowedEmojis = ['🔥', '🎉', '🤘'];
    if (!allowedEmojis.includes(emoji)) {
      res.status(400).json({ error: 'Invalid emoji. Allowed emojis: 🔥, 🎉, 🤘' });
      return;
    }

    if (!articleId && !flashcardId && !commentId && !alertId) {
      res.status(400).json({ error: 'Either articleId, flashcardId, commentId, or alertId is required' });
      return;
    }

    // Check if user already reacted
    let existingReaction;
    if (articleId) {
      existingReaction = await prisma.reaction.findUnique({
        where: {
          userId_articleId: {
            userId: userId,
            articleId: articleId
          }
        }
      });
    } else if (flashcardId) {
      existingReaction = await prisma.reaction.findUnique({
        where: {
          userId_flashcardId: {
            userId: userId,
            flashcardId: flashcardId
          }
        }
      });
    } else if (commentId) {
      existingReaction = await prisma.reaction.findUnique({
        where: {
          userId_commentId: {
            userId: userId,
            commentId: commentId
          }
        }
      });
    } else if (alertId) {
      // For now, skip checking existing reactions for alerts
      existingReaction = null;
    }

    // If user already reacted, return error (reactions are permanent)
    if (existingReaction) {
      res.status(400).json({ error: 'User has already reacted to this content' });
      return;
    }

    const reactionData: any = {
      emoji,
      userId
    };

    if (articleId) {
      reactionData.articleId = articleId;
    } else if (flashcardId) {
      reactionData.flashcardId = flashcardId;
    } else if (commentId) {
      reactionData.commentId = commentId;
    } else if (alertId) {
      reactionData.alertId = alertId;
    }

    const reaction = await prisma.reaction.create({
      data: reactionData,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json({ reaction });
  } catch (error) {
    console.error('Create reaction error:', error);
    res.status(500).json({ error: 'Failed to create reaction' });
  }
};

// Delete a reaction - REMOVED: Reactions are now permanent
// export const deleteReaction = async (req: Request, res: Response): Promise<void> => {
//   // This function has been removed as reactions are now permanent
// };
