import React from 'react';
import { Button } from "@/components/ui/button";
import { CopyIcon } from 'lucide-react';
import UserBlock from '../UserBlock/UserBlock';
import '../../customScrollBar.css'; // Make sure to import the custom CSS

const Sidebar = () => {

  return (
    <div className='h-[100vh] bg-gray-500 py-[20px]'>
      <div className='flex flex-col px-[20px] h-full justify-between gap-y-[20px]'>
        <div className='custom-scrollbar overflow-y-auto' style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <div className='grid gap-x-[10px] auto-rows-max gap-y-[15px]' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))' }}>
            <UserBlock />
          </div>
        </div>
        <div className='flex flex-col gap-y-[10px]'>
          <hr className="h-px bg-gray-200 border-0" />
          <Button className="w-full bg-red-600 text-white hover:bg-red-700">Leave Room</Button>
          <Button variant="secondary" className="w-full">Copy Room Id <CopyIcon className='w-[20px] h-[20px] ml-[10px]' /> </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
