import { Router } from 'express';
import { 
  createComment, 
  createReaction
} from '../controllers/contentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Comments
router.post('/comments', createComment);

// Reactions (permanent - no deletion)
router.post('/reactions', createReaction);

export default router;
