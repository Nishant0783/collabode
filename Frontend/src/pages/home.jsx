import React from 'react';
import bgImg from '/bg-image.png'
import { Button } from '@/components/ui/button';

const Home = () => {
    return (
        <div className='grid grid-cols-3 gap-x-[40px]'>
            <div className='col-span-2 flex flex-col gap-y-[20px]'>
                <div className='text-[1.2rem]'>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div className='flex gap-x-[20px]'>
                    <Button 
                        variant={'secondary'}
                        size={'lg'}
                    >
                        Join Room
                    </Button>

                </div> 
            </div>
            <div className='col-span-1 flex items-center justify-center'>
                <img src={bgImg} alt='bg-image' />
            </div>
        </div>
    )
}

export default Home