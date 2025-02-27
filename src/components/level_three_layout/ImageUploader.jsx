"use client";

import React, { useState, useRef } from 'react';
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const ImageUploader = ({ onImageUpload, currentImage }) => {
const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateImage = (file) => {
    if (file.size > 3 * 1024 * 1024) {
      throw new Error('Image size must be less than 3MB');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, JPEG, and PNG files are allowed');
    }
  };

  const cropImageToSquare = (imgSrc) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set to a larger size for better quality (400x400)
        canvas.width = 400;
        canvas.height = 400;

        // Calculate the square crop
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // First, draw at full quality
        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size,
          0,
          0,
          400,
          400
        );

        // Convert to blob with higher quality (0.95)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error('Failed to create blob');
            }
            resolve(blob);
          },
          'image/jpeg',
          0.95  // Higher quality setting
        );
      };
      
      img.src = imgSrc;
    });
  };

  const handleImageSelect = async (event) => {
    try {
      setIsLoading(true);
      setError('');

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      validateImage(file);

      // Create object URL for the selected file
      const objectUrl = URL.createObjectURL(file);

      // Crop image
      const croppedBlob = await cropImageToSquare(objectUrl);

      // Create form data
      const formData = new FormData();
      formData.append('image', croppedBlob, 'profile.jpg');

      // Upload image
      const response = await fetch('/api/imageupload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);

      // Update preview and notify parent
      setPreviewUrl(data.imagePath);
      onImageUpload(data.imagePath);

    } catch (err) {
      console.error('Image processing error:', err);
      setError(err.message || 'Error processing image');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />
      
      <div 
        onClick={handleClick} 
        className={`cursor-pointer w-[5.5rem] h-[5.5rem] border rounded-full mb-3 relative ${isLoading ? 'opacity-50' : ''}`}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={previewUrl} // Now using full URL directly
              alt="Profile"
              fill
              className="object-cover rounded-full"
              sizes="(max-width: 768px) 5.5rem, 5.5rem"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Camera icon overlay */}
        <div className="absolute bottom-0 right-0 rounded-full w-7 h-7 bg-white shadow-sm flex items-center justify-center translate-x-1/4 translate-y-1/4">
          <PhotoIcon className="w-4 h-4 text-[#2FCC71]" />
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-1 max-w-[200px]">{error}</div>
      )}
    </div>
  );
};

export default ImageUploader;