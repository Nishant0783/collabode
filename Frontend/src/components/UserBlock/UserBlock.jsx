import React from 'react';

const UserBlock = ({user}) => {
  console.log("User in component is: ", user)
  return (
    <div className='w-[50px] h-[50px] bg-blue-800 rounded-[5px] flex items-center justify-center text-[1.5rem] cursor-default'>
      <strong>{user}</strong>
    </div>
  )
}

export default UserBlock;
