import React, { useState } from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ image, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Close modal"
            >
                <X className="w-8 h-8" />
            </button>
            <div className="w-full h-full flex items-center justify-center">
                <img
                    src={image}
                    alt="Full size"
                    className="max-w-full max-h-[90vh] object-contain"
                />
            </div>
        </div>
    );
};

const ImageOutputRenderer = ({ imageData }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!imageData) return null;

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    // Single image case
    if (typeof imageData === "string") {
        return (
            <>
                <div className="w-full h-full flex justify-center items-center p-4">
                    <img
                        src={imageData || "/DummyRapps.png"}
                        alt="Generated"
                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleImageClick(imageData)}
                    />
                </div>
                {selectedImage && <ImageModal image={selectedImage} onClose={closeModal} />}
            </>
        );
    }

    // Multiple images case
    if (Array.isArray(imageData)) {
        return (
            <>
                <div className="w-full h-full overflow-y-auto py-4 px-2">
                    <div className="grid grid-cols-1 gap-6">
                        {imageData.map((imgUrl, index) => (
                            <div
                                key={index}
                                className="w-full flex justify-center items-center bg-indigo-900/30 rounded-lg p-4"
                            >
                                <img
                                    src={imgUrl || "/DummyRapps.png"}
                                    alt={`Generated ${index + 1}`}
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleImageClick(imgUrl)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {selectedImage && <ImageModal image={selectedImage} onClose={closeModal} />}
            </>
        );
    }

    return null;
};

export default ImageOutputRenderer;