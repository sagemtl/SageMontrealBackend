import express from "express";
import Stripe from "stripe";
import "dotenv/config";

import PostManagementService from "../posts_management";

const router = express.Router();
const stripe = new Stripe(process.env.SECRET_KEY!, { apiVersion: '2020-08-27' });


router.get("/", async (req, res) => {
  try {
    const results = await PostManagementService.getPosts();
    res.status(200).json(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const post = req.body;
    // TODO: Validate post

    const postId = await PostManagementService.createPost(post);
    res.status(200).json({ message: "Post created successfully.", postId });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;