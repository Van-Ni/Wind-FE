import React from 'react'
import TopBar from '../../layouts/home/TopBar'
import { posts, user } from '../../assets/data'
import PostCard from '../../layouts/home/PostCard'

export const HomeChat = () => {
  const loading = false;
  return (
    <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <TopBar />
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          {/* ... */}
        </div>
        {/* CENTER */}
        <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
          {loading ? (
            "Loading..."
          ) : posts?.length > 0 ? (
            posts?.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                user={user}
                deletePost={() => { }}
                likePost={() => { }}
              />
            ))
          ) : (
            <div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No Post Available</p>
            </div>
          )}
        </div>
        {/* RIGJT */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>

        </div>
      </div>
    </div>
  )
}
