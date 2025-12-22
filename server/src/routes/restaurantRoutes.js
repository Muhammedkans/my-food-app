const express = require('express');
const router = express.Router();
const {
  registerRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  getRecommendations,
  searchRestaurants,
  getSimilarRestaurants,
  addReview,
  addMenuItem,
  deleteMenuItem,
  approveRestaurant,
  updateRestaurant
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  res.json({
    success: true,
    data: req.file.path // Cloudinary URL
  });
});

router.route('/')
  .post(protect, registerRestaurant)
  .get(getRestaurants);

router.get('/recommendations', getRecommendations);
router.get('/search', searchRestaurants);

router.route('/my')
  .get(protect, getMyRestaurant);

router.post('/:id/approve', protect, admin, approveRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, updateRestaurant);

router.get('/:id/similar', getSimilarRestaurants);

router.post('/:id/review', protect, addReview);

router.route('/:id/menu')
  .post(protect, addMenuItem);

router.delete('/:id/menu/:itemId', protect, deleteMenuItem);

module.exports = router;
