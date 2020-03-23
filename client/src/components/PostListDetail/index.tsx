import React from 'react';
import moment from 'moment';
import { Button, Card } from "@blueprintjs/core";
import svgChevron from '../../assets/images/chevron.svg';
import svgXCirlce from '../../assets/images/x-circle.svg';

export default (props: any) => {
    const {post, remove, setShowPost} = props;

    return (<li
        bp='grid' 
        className={`posts-list-container__li ${!post.read && 'unread'}`} 
        key={post.id}>
        <Card bp='12'>
          <p style={{ marginBottom: 0 }}>{post.author} <time className='time'>at {moment.unix(post.created_utc).fromNow()}</time></p>
        </Card>
        <Card bp='4' className='posts-list-container__li__img'>
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
        </Card>
        <Card bp='8' className='post-list-container__li__content'>
          <p style={{ marginTop: 0 }}>{post.title}</p>
          <Card className="button-container">
            <Button onClick={() => remove(post.id)} className="button-dismiss">
              <img src={svgXCirlce} alt="Remove" style={{ marginRight: '6px'}} /> Remove
            </Button>
            <Button onClick={() => setShowPost(post)} className='button-view'> View </Button>
          </Card>
        </Card>
        <Card bp='12'>
          <p className='comment'>{post.num_comments} comments</p>
        </Card>
        <Card className='chevron'>
          <img src={svgChevron} alt="Chevron" />
        </Card>
      </li>);
}