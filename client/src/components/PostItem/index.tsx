import React from 'react';
import moment from 'moment';
import IPostReddit from '../../interfaces/IPostReddit';

export default (props: IPostReddit) => {
  return (
    <div bp='8' className={`posts-single 'show'`}>
      <article>
        <h1>{props.title}</h1>
        <p>by {props.author} at <time>{moment.unix(props.created_utc).fromNow()}</time></p>
        <p>Num comments: {props.num_comments}</p>
      </article>
    </div>
  )
}