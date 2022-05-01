import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addPost } from '../api/api';

const Form = () => {
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isBlank, setIsBlank] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation(addPost, {
        onSuccess: (newPost) => {

            if (newPost.status > 399 && newPost.status < 500) {
                throw new Error(newPost.data.errors)
            }

            queryClient.setQueryData('posts', (old) => [...old, newPost]);
            setUsername("");
            setTitle("");
            setContent("");
        },

        onError: (err) => {
            setErrorMessage(err.message)

        }

    })


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsBlank(false)
        if (!title || !content || !username) {
            setIsBlank(true);
            return;
        }
        mutation.mutate(JSON.stringify({ username, title, content }))
    }

    return (
        <div className='container max-w-lg mx-auto h-min shadow-md p-2 pb-10 flex-auto w-64 mx-3'>
            <div className='flex justify-between'>
                <h2>Post something</h2>
                <div className='h-8 w-8 relative'>
                    {mutation.isLoading && <div className='absolute top-0 border-2 border-t-indigo-500 rounded-full border-stone-300 w-full h-full animate-spin'></div>}
                </div>
            </div>

            <form onSubmit={handleSubmit} onChange={() => setIsBlank(false)}>
                <label className='block'>
                    Username:
                    <input type="text" value={username} aria-label="Username" onChange={(e) => setUsername(e.target.value)} className='border-2 border-slate-500 w-full p-1 rounded' />
                </label>
                <label className='block'>
                    Title:
                    <input type="text" value={title} aria-label="Title" onChange={(e) => setTitle(e.target.value)} className='border-2 border-slate-500 w-full p-1 rounded' />
                </label>
                <label>
                    Post:
                    <textarea value={content} aria-label="Post" onChange={(e) => setContent(e.target.value)} className='border-2 border-slate-500 block w-full h-48 resize-none p-1 rounded' />
                </label>
                <input type="submit" className='cursor-pointer border-2 border-slate-500 w-full mt-3 p-1 rounded' />
                {mutation.isLoading && <span>Loading...</span>}
                {mutation.isError && <span onClick={() => mutation.reset()} className='cursor-pointer text-red-500'>{errorMessage}</span>}
                {mutation.isSuccess && <span className='text-green-500 cursor-pointer' onClick={() => mutation.reset()}>Post Added!</span>}
                {isBlank && <span className='text-red-500'>Your input is missing information!</span>}
            </form>
        </div>
    )

}

export default Form;