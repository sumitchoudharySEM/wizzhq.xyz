"use client"
import React, { useState } from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary';

const UploadImages = () => {
    const [publicId, setPublicId] = useState("")
  return (<>
    {publicId && (
        <CldImage src={publicId} alt={publicId} width={"300"} height={"300"}/>
    )}
    <CldUploadWidget uploadPreset="profileimages" onSuccess={({event, info}) => {
        if(event == "success"){
            setPublicId(info?.public_id)
        }
    }}>
        {({open}) =><button className='bg-red h-7 w-7' onClick={()=>open()}>Upload</button>}
    </CldUploadWidget>
    </>
  )
}

export default UploadImages
