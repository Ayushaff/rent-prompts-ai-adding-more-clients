import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const ImageGrid = ({ images = [] as string[] , onImageClick, isEditing }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    if (onImageClick) onImageClick(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

 

  if (!images.length) {
    return (
      <div className="relative h-60 w-full overflow-hidden rounded-lg bg-indigo-900/30">
        <Image 
          src="/DummyRapps.png"
          alt="Default Image"
          className="object-cover"
          fill
          priority
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
  {/* Main image container */}
  <div className='flex gap-4 md:flex-row flex-col'>
  <div className="relative h-36 md:h-96 w-full md:w-[60%] overflow-hidden rounded-lg">
    <Image
      src={images[0] || "/DummyRapps.png"}
      alt="Main Image"
      className="object-cover transition-transform duration-300 hover:scale-105"
      fill
      priority
      onClick={() => handleImageClick(images[0])}
    />
    
  </div>

  {/* Thumbnail grid */}
  {images.length > 1 && (
    <div className=" gap-4 flex md:flex-col w-full md:w-[40%] h-30 md:h-96 md:overflow-x-hidden overflow-y-hidden md:overflow-y-scroll">
      {images.slice(1).map((image, index) => (
        <div
          key={index + 1}
          className="relative min-h-24 md:min-h-72 w-[33%] md:w-full  gap-5 overflow-hidden rounded-lg cursor-pointer group"
        >
          <Image
            src={image}
            alt={`Image ${index + 2}`}
            className="object-fit transition-transform duration-300 group-hover:scale-105"
            fill
            onClick={() => handleImageClick(image)}
          />
          
        </div>
      ))}
    </div>
  )}
  </div>
  

  {/* Modal for full-size image view */}
  {selectedImage && (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="h-6 w-6 text-white" />
      </button>
      <div className="relative max-w-5xl w-full h-[80vh] rounded-lg overflow-hidden">
        <Image
          src={selectedImage}
          alt="Selected Image"
          className="object-contain"
          fill
          priority
        />
      </div>
    </div>
  )}
</div>

  );
};

export default ImageGrid;