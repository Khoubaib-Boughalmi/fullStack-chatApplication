import React from 'react'
import { useParams } from "react-router-dom"

const BlogPosts = {
    'first-blog-post': {
      title: 'First Blog Post',
      description: 'Lorem ipsum dolor sit amet, consectetur adip.'
    },
    'second-blog-post': {
      title: 'Second Blog Post',
      description: 'Hello React Router v6'
    }
};

export const Post = () => {
    const {slug} = useParams();
    const post = BlogPosts[slug];
    console.log(post);
    return (
        <div>
            <h2>Post Title: {post.title}</h2>    
            <h2>Description: {post.description}</h2>
        </div>
    )
}
