import DAO, { Post } from '../db';

class PostManagementDAO extends DAO {

  readonly postTable: string = 'posts';

  async getPosts(): Promise<Post[]> {
    const query = `SELECT * FROM ${this.postTable};`;
    const results = await this.query(query);
    return results.rows;
  }

  async createPost(post: Post): Promise<string> {
    const query = `INSERT INTO ${this.postTable} (name, color, text, date)
      values ($1, $2, $3, $4) RETURNING post_id;`;

    const values = [
      post.name, 
      post.color, 
      post.text, 
      post.date, 
    ];

    const results = await this.query(query, values);
    return results.rows[0].id;
  }

}

export default PostManagementDAO;