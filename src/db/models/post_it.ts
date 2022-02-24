export class PostIt {
  constructor(
    public textContent: string,
    public xCoord: number,
    public yCoord: number,
    public createdDate: string,
    public zIndex?: number,
    public color?: string,
    public readonly id?: string
  ) {}

  static toDomainObject(row: PostItRow): PostIt {
    return {
      textContent: row.text_content,
      zIndex: row.z_index,
      xCoord: row.x_coord,
      yCoord: row.y_coord,
      createdDate: row.created_date,
      color: row.color,
      id: row.id,
    };
  }

  static toDbRow(postIt: PostIt): PostItRow {
    return {
      text_content: postIt.textContent,
      z_index: postIt.zIndex,
      x_coord: postIt.xCoord,
      y_coord: postIt.yCoord,
      created_date: postIt.createdDate,
      color: postIt.color,
      id: postIt.id,
    };
  }
}

type PostItRow = {
  text_content: string;
  x_coord: number;
  y_coord: number;
  created_date: string;
  z_index?: number;
  color?: string;
  id?: string;
};
