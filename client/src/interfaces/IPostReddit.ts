export default interface IPostReddit {
  id?: string;
  title?: string;
  author?: string;
  created_utc: number;
  num_comments?: number;
  preview?: any;
  thumbnail?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  url?: string;
  width?: number;
  height?: number;
}