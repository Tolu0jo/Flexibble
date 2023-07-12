"use client"
import { useRouter } from 'next/navigation';

import React from 'react'
import Button from './Button';
type Props ={
    startCursor:string;
    endCursor:string;
    hasNextPage:boolean;
    hasPreviousPage:boolean;
}
const LoadMore = ({startCursor,endCursor,hasNextPage,hasPreviousPage}:Props) => {
  const router =useRouter() 

  const handleNavigation=(direction:string)=>{

  }
    return (
    <div className="w-full flexCenter gap-5 mt-10">
        {hasPreviousPage && (
            <Button
            title = "First Page"
            handleClick={()=>{handleNavigation("first")}}/>
        )}
        {hasNextPage && (
            <Button
            title = "Next"
            handleClick={()=>{handleNavigation("next")}}/>
        )}
    </div>
  )
}

export default LoadMore