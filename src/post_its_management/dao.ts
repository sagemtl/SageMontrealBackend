import DAO, { PostIt } from '../db';

class PostItManagementDAO extends DAO {

  readonly postItTable: string = 'post_its';

  async getPostIts(): Promise<PostIt[]> {
    const query = `SELECT * FROM ${this.postItTable} ORDER BY z_index DESC;`;
    const results = await this.query(query);
    return results.rows.map(PostIt.toDomainObject);
  }

  async createPostIt(postIt: PostIt): Promise<string> {
    const query = `INSERT INTO ${this.postItTable} (text_content, x_coord, y_coord, color)
      values ($1, $2, $3, $4) RETURNING id;`;

    const values = [
      postIt.textContent, 
      postIt.xCoord, 
      postIt.yCoord, 
      postIt.color
    ];

    const results = await this.query(query, values);
    return results.rows[0].id;
  }
}

export default PostItManagementDAO;