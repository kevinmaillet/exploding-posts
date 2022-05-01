import React from 'react';


const Post = ({ title, username, content }) => {

    return (
        <div key={title} className="container mx-auto shadow-md max-w-lg p-4 hover:scale-102 hover:translate-y-2 hover:z-10 transition duration-150 ease-in-out">
            <div className="flex justify-between">
                <h2 className="text-xl">
                    {username}
                </h2>
                <h3>{title}</h3>
            </div>
            <p className='pt-6'>{content}</p>
        </div>
    )
}

export default Post;