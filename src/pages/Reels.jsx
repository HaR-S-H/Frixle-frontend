import AddPost from '@/components/AddPost'
import PostCard from '@/components/PostCard'
import React from 'react'
import { postData } from '@/context/PostContext';
import { UserData } from '@/context/UserContext';
import { SkeletonCard } from '@/components/SkeletonCard';
import MainLayout from '@/layout/MainLayout';
function Reels() {
    const { posts,loading } = postData();
    const {user} =UserData();
  return (
    <>
      <MainLayout>
      {
        loading?<SkeletonCard/>:(
          <div>
          {/* <AddPost /> */}
      {posts && posts.length > 0 ? posts.map((e, index) => {
        const isLastPost = index === posts.length - 1;
        return <PostCard value={e} key={e._id} user={user} isLastPost={isLastPost } />
      }):<p>No post Yet..</p>}
         
    </div>
        )
      }
     </MainLayout>
    </>

  )
}

export default Reels
