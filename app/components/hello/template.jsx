import React from 'react';

export default (props)=> {

  const {hello} = props.page.content;

  return (
    <section className="hello">
      <div dangerouslySetInnerHTML={{__html: hello}}></div>
    </section>
  );
}