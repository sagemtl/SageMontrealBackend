export class Post {
  constructor(
    public name: string,
    public color: string,
    public text: string,
    public date: string,
    public readonly post_id?: string,
  ) { }
}