import React from 'react';
import moment from 'moment';
import { Card } from "@blueprintjs/core";

export default (props: any) => {
  return (
    <Card bp='8' className={`posts-single show`}>
      <article>
        <h1>{props.title}</h1>
        {!props.url ? 
            <img
              src='https://via.placeholder.com/200x60?text=No+thumbnail'
              alt='No thumbnail'
              />
            : <img
                src={props.url.replace('amp;s', 's').replace('amp;','')}
                height={500}
                />}
          <p>by {props.author} at <time>{moment.unix(props.created_utc).fromNow()}</time></p>
          <p>Number of comments: {props.num_comments}</p>
      </article>
    </Card>
  )
}