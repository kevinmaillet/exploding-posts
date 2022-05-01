import React from "react";
import Layout from './layout';
import { useQuery } from 'react-query';
import { fetchPosts } from '../api/api';
import Form from '../components/form'
import Post from './post';


const Posts = () => {
    const { isLoading, isError, data, error } = useQuery('posts', fetchPosts);


    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    return (
        <Layout>
            <Form />
            <div className="container flex-auto w-64 mx-3">
                {data?.map(({ title, username, content }) => (
                    <Post title={title} username={username} content={content} key={title} />
                ))}
            </div>
        </Layout>
    );
};

export default Posts;