import { PostIt } from "../db";
import PostItManagementDAO from "./dao";

const postItManagementDAO = new PostItManagementDAO();

class PostItManagementService {

  static async getPostIts(): Promise<PostIt[]> {
    return postItManagementDAO.getPostIts();
  }

  static async createPostIt(postIt: PostIt): Promise<string> {
    const postId = await postItManagementDAO.createPostIt(postIt);
    return postId;
  }
}

export default PostItManagementService;