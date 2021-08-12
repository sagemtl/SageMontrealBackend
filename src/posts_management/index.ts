import { Post } from "../db";
import PostManagementDAO from "./dao";

const postManagementDAO = new PostManagementDAO();

class PostManagementService {

  static async getPosts(): Promise<Post[]> {
    return postManagementDAO.getPosts();
  }

  static async createPost(post: Post): Promise<string> {
    const postId = await postManagementDAO.createPost(post);
    return postId;
  }
}

export default PostManagementService;