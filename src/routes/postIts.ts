import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';

import PostItManagementService from '../post_its_management';

const router = express.Router();
const stripe = new Stripe(process.env.SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

router.get('/', async (req, res) => {
  try {
    const results = await PostItManagementService.getPostIts();
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const postIt = req.body.postIt;
    // TODO: Validate post
    console.log(postIt);

    const postId = await PostItManagementService.createPostIt(postIt);
    res.status(200).json({ message: 'Post created successfully.', postId });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
