import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Helper function to recursively fetch comments with replies
const getCommentsWithReplies = async (parentId: string | null, level: number = 1): Promise<any[]> => {
  if (level > 4) return []; // Stop at level 4
  
  const comments = await prisma.comment.findMany({
    where: { parentId },
    include: {
      author: {
        select: {
          id: true,
          username: true
        }
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }
  });

  // Recursively fetch replies for each comment
  for (const comment of comments) {
    (comment as any).replies = await getCommentsWithReplies(comment.id, level + 1);
  }

  return comments;
};

// Get all spaces a user is subscribed to
export const getSubscribedSpaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const subscribedSpaces = await prisma.space.findMany({
      where: {
        subscribers: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        subscribers: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        articles: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        flashcards: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        alerts: {
          where: {
            userId: userId,
            isRead: false
          }
        }
      }
    });

    // Add comments with replies to each article and flashcard
    for (const space of subscribedSpaces) {
      for (const article of space.articles) {
        // Fetch comments for this specific article
        const articleComments = await prisma.comment.findMany({
          where: { 
            articleId: article.id,
            parentId: null // Only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });
        
        // Add replies to each comment
        for (const comment of articleComments) {
          (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
        }
        
        article.comments = articleComments;
      }
      
      for (const flashcard of space.flashcards) {
        // Fetch comments for this specific flashcard
        const flashcardComments = await prisma.comment.findMany({
          where: { 
            flashcardId: flashcard.id,
            parentId: null // Only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });
        
        // Add replies to each comment
        for (const comment of flashcardComments) {
          (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
        }
        
        flashcard.comments = flashcardComments;
      }
    }

    res.json({ spaces: subscribedSpaces });
  } catch (error) {
    console.error('Get subscribed spaces error:', error);
    res.status(500).json({ error: 'Failed to get subscribed spaces' });
  }
};

// Get all possible spaces
export const getAllSpaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const allSpaces = await prisma.space.findMany({
      include: {
        subscribers: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        articles: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        flashcards: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        alerts: {
          where: {
            userId: userId,
            isRead: false
          }
        }
      }
    });

    // Add comments with replies to each article and flashcard
    for (const space of allSpaces) {
      for (const article of space.articles) {
        // Fetch comments for this specific article
        const articleComments = await prisma.comment.findMany({
          where: { 
            articleId: article.id,
            parentId: null // Only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });
        
        // Add replies to each comment
        for (const comment of articleComments) {
          (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
        }
        
        article.comments = articleComments;
      }
      
      for (const flashcard of space.flashcards) {
        // Fetch comments for this specific flashcard
        const flashcardComments = await prisma.comment.findMany({
          where: { 
            flashcardId: flashcard.id,
            parentId: null // Only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });
        
        // Add replies to each comment
        for (const comment of flashcardComments) {
          (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
        }
        
        flashcard.comments = flashcardComments;
      }
    }

    res.json({ spaces: allSpaces });
  } catch (error) {
    console.error('Get all spaces error:', error);
    res.status(500).json({ error: 'Failed to get all spaces' });
  }
};

// Get space titles with hierarchy (lightweight version)
export const getSpaceTitles = async (req: Request, res: Response): Promise<void> => {
  try {
    const spaces = await prisma.space.findMany({
      where: {
        level: 1 // Only get top-level spaces
      },
      select: {
        id: true,
        name: true,
        level: true,
        children: {
          select: {
            id: true,
            name: true,
            level: true,
            children: {
              select: {
                id: true,
                name: true,
                level: true
              }
            }
          }
        }
      }
    });

    res.json({ spaces });
  } catch (error) {
    console.error('Get space titles error:', error);
    res.status(500).json({ error: 'Failed to get space titles' });
  }
};

// Subscribe or unsubscribe from a space
export const toggleSpaceSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { spaceId } = req.body;

    if (!spaceId) {
      res.status(400).json({ error: 'Space ID is required' });
      return;
    }

    // Check if space exists
    const space = await prisma.space.findUnique({
      where: { id: spaceId }
    });

    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Check if user is already subscribed
    const existingSubscription = await prisma.spaceSubscription.findUnique({
      where: {
        userId_spaceId: {
          userId: userId,
          spaceId: spaceId
        }
      }
    });

    if (existingSubscription) {
      // Unsubscribe
      await prisma.spaceSubscription.delete({
        where: {
          userId_spaceId: {
            userId: userId,
            spaceId: spaceId
          }
        }
      });

      res.json({ message: 'Successfully unsubscribed from space' });
    } else {
      // Subscribe
      await prisma.spaceSubscription.create({
        data: {
          userId: userId,
          spaceId: spaceId
        }
      });

      // Create an alert for the subscription
      await prisma.alert.create({
        data: {
          type: 'subscription',
          message: `New member joined ${space.name}`,
          userId: userId,
          spaceId: spaceId
        }
      });

      res.json({ message: 'Successfully subscribed to space' });
    }
  } catch (error) {
    console.error('Toggle space subscription error:', error);
    res.status(500).json({ error: 'Failed to toggle space subscription' });
  }
};

// Get subscribed spaces with hierarchy (lightweight version for navigation)
export const getSubscribedSpacesHierarchy = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // First, get all spaces the user is subscribed to
    const subscribedSpaceIds = await prisma.spaceSubscription.findMany({
      where: {
        userId: userId
      },
      select: {
        spaceId: true
      }
    });

    const subscribedIds = subscribedSpaceIds.map(sub => sub.spaceId);

    // Get all spaces with hierarchy, but only include those that the user is subscribed to
    // or are parents of subscribed spaces
    const allSpaces = await prisma.space.findMany({
      where: {
        level: 1 // Start with top-level spaces
      },
      select: {
        id: true,
        name: true,
        level: true,
        children: {
          select: {
            id: true,
            name: true,
            level: true,
            children: {
              select: {
                id: true,
                name: true,
                level: true
              }
            }
          }
        }
      }
    });

    // Filter to only include spaces that the user is subscribed to or are parents of subscribed spaces
    const filterSubscribedSpaces = (spaces: any[]): any[] => {
      return spaces.filter(space => {
        // Check if this space is subscribed
        const isSubscribed = subscribedIds.includes(space.id);
        
        // Check if any children are subscribed
        const hasSubscribedChildren = space.children && space.children.length > 0;
        
        if (hasSubscribedChildren) {
          // Filter children recursively
          space.children = filterSubscribedSpaces(space.children);
          // Keep this space if it has subscribed children
          return space.children.length > 0;
        }
        
        // Keep this space if user is subscribed to it
        return isSubscribed;
      });
    };

    const filteredSpaces = filterSubscribedSpaces(allSpaces);

    res.json({ spaces: filteredSpaces });
  } catch (error) {
    console.error('Get subscribed spaces hierarchy error:', error);
    res.status(500).json({ error: 'Failed to get subscribed spaces hierarchy' });
  }
};

// Get a single space with all details
export const getSpaceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const userId = (req as any).user.id;

    if (!spaceId) {
      res.status(400).json({ error: 'Space ID is required' });
      return;
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        subscribers: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        articles: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        flashcards: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true
                  }
                },
                reactions: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true
                      }
                    }
                  }
                }
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        alerts: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Add comments with replies to each article and flashcard
    for (const article of space.articles) {
      // Fetch comments for this specific article
      const articleComments = await prisma.comment.findMany({
        where: { 
          articleId: article.id,
          parentId: null // Only top-level comments
        },
        include: {
          author: {
            select: {
              id: true,
              username: true
            }
          },
          reactions: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          }
        }
      });
      
      // Add replies to each comment
      for (const comment of articleComments) {
        (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
      }
      
      article.comments = articleComments;
    }
    
    for (const flashcard of space.flashcards) {
      // Fetch comments for this specific flashcard
      const flashcardComments = await prisma.comment.findMany({
        where: { 
          flashcardId: flashcard.id,
          parentId: null // Only top-level comments
        },
        include: {
          author: {
            select: {
              id: true,
              username: true
            }
          },
          reactions: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          }
        }
      });
      
      // Add replies to each comment
      for (const comment of flashcardComments) {
        (comment as any).replies = await getCommentsWithReplies(comment.id, 2);
      }
      
      flashcard.comments = flashcardComments;
    }

    res.json({ space });
  } catch (error) {
    console.error('Get space by ID error:', error);
    res.status(500).json({ error: 'Failed to get space' });
  }
};
