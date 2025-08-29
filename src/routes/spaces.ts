import { Router } from 'express';
import { 
  getSubscribedSpaces, 
  getAllSpaces, 
  getSpaceTitles, 
  toggleSpaceSubscription,
  getSubscribedSpacesHierarchy,
  getSpaceById
} from '../controllers/spaceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get spaces user is subscribed to
router.get('/subscribed', getSubscribedSpaces);

// Get subscribed spaces with hierarchy (for navigation)
router.get('/subscribed-hierarchy', getSubscribedSpacesHierarchy);

// Get all spaces
router.get('/all', getAllSpaces);

// Get space titles with hierarchy (lightweight)
router.get('/titles', getSpaceTitles);

// Get a single space by ID with all details
router.get('/:spaceId', getSpaceById);

// Subscribe/unsubscribe from a space
router.post('/subscribe', toggleSpaceSubscription);

export default router;
