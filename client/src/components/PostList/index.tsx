import React, { useState} from 'react';
import { onSnapshot } from "mobx-state-tree";
import { Button, Card } from "@blueprintjs/core";
import PostItem from './../PostItem';
import PostListDetail from './../PostListDetail';
import IPostReddit from '../../interfaces/IPostReddit';
import { useMst } from "../../stores/Root";
import { observer } from "mobx-react-lite";


interface Props {}

const PostList: React.FC<Props> = observer(() => {
  const { postList } = useMst();
  postList.load();
  const [showPostSingle, setShowPostSingle] = useState(false);
  const [isLoading, setIsLoading] = useState(postList.loading);
  const [isError, setIsError] = useState(postList.error);

  onSnapshot(postList, postList => {
    isLoading !== postList.loading && setIsLoading(postList.loading);
    isError !== postList.error && setIsError(postList.error);
  });

  const setShowPost = (postReddit: IPostReddit) => {
    const {url, width, height} = postReddit.preview.images[0].source;
    postList.view({...postReddit, url, width, height});
    !showPostSingle && setShowPostSingle(true);
  };

  const remove = (id?: string) => {
    postList.remove(id);
    id === postList.itemView?.id && setShowPostSingle(false);
  }

  const postDetail = (post: IPostReddit) => (
    <PostListDetail post={post} remove={remove} setShowPost={setShowPost} />
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;
  
  return (
    <Card>
      <Card>
        <main className='container'>
          <Card bp='grid'>
            <Card bp='4' className={`posts-list-container sidebar ${showPostSingle && 'split'}`}>
              <ul className={`posts-list-container__ul hide`}>
                {postList.items.map((postReddit: IPostReddit) => postDetail(postReddit))}
              </ul>
            </Card>
            <Card bp='8'>
              <Card className='header-container container-top'>
                <h1>Reddit Top 50 Post</h1>
                <h2>Number of posts {postList.totalItems}</h2>
                <Button onClick={() => setShowPostSingle(!showPostSingle)}>Toggle view</Button>
                <Button onClick={() => postList.restoreOriginal()}>Restore Original</Button>
                <Button onClick={() => postList.setItems([])}>Dismiss All</Button>
              </Card>
              {(showPostSingle && postList.itemView) && <PostItem {...postList.itemView}/>}
            </Card>
          </Card>
        </main>
      </Card>
    </Card>
  )
});

export default PostList;