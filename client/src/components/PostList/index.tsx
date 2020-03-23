import React, { Fragment, useState} from 'react';
import moment from 'moment';
import PostItem from './../PostItem';
import IPostReddit from '../../interfaces/IPostReddit';
import { useMst } from "../../stores/Root";
import { observer } from "mobx-react-lite";

interface Props {}

const PostList: React.FC<Props> = observer(() => {
  const { postList } = useMst();

  postList.load();
  const [showPostSingle, setShowPostSingle] = useState(false);
  const [postSingle, setPostSingle] = useState<IPostReddit>({
    title: '',
    author: '',
    created_utc: 0,
    num_comments: 0,
    url: '',
    width: 0,
    height: 0
  });

  const setShowPost = (postReddit: IPostReddit) => {
    const {url, width, height} = postReddit.preview ? postReddit.preview.images[0].source : { url: '', width: 0, height: 0};
    setPostSingle({...postReddit, url, width, height});

    if (!showPostSingle) {
      setShowPostSingle(true);
    }
  };

  const postDetail = (post: IPostReddit) => {
    return (<li
      onClick={() => setShowPost(post)}
      bp='grid' 
      className='posts-list-container__li' 
      key={post.id}>
      <div bp='3' className='posts-list-container__li__img'>
        {post.thumbnail === 'self' || post.thumbnail === 'default' ? 
          <img
            src='https://via.placeholder.com/200x60?text=No+thumbnail'
            alt='No thumbnail'
            />
          : <img
              src={post.thumbnail}
              alt={post.title}
              width={post.thumbnail_width}
              height={post.thumbnail_height} />}
      </div>
      <div bp='9' className='post-list-container__li__content'>
        <p style={{ marginTop: 0 }}>{post.title}</p>
        <p>By {post.author} at {moment.unix(post.created_utc).fromNow()}</p> 
        <p>Comments: {post.num_comments}</p>
      </div>
    </li>);
  };
  
  return (
    <Fragment>
      {postList.isLoading && <p>Loading...</p>}
      {postList.isError && <p>Error</p>}
      {(!postList.isLoading &&!postList.listItems?.length) && <p>No data</p>}
      {postList.listItems?.length && <div>
        <header className='header-container'>
          <h1>Reddit Top 50 Post</h1>
          <button onClick={() => setShowPostSingle(!showPostSingle)}>Toggle view</button>
        </header>
        <main bp='grid' className='container'>
          <div bp={`${showPostSingle ? 4 : 12}`} className={`posts-list-container hide ${showPostSingle && 'split'}`}>
            <ul className={`posts-list-container__ul`}>
              {postList.listItems.map((postReddit: IPostReddit) => postDetail(postReddit))}
            </ul>
          </div>
          {showPostSingle && <PostItem {...postSingle}/>}
        </main>
      </div>}
    </Fragment>
  )
});

export default PostList;