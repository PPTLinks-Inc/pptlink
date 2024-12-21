import { LoadingAssetBig2 } from "@/assets/assets";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

interface ImageViewerProps {
  images: string[];
  thumbnailImages: string[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  thumbnailImages,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const thumbnailRefs = useRef<(HTMLImageElement | null)[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      setZoom(1); // Reset zoom when closing
      resetPosition(); // Reset position when closing
      setCurrentIndex(0); // Reset index when closing
      setPreloadedImages(new Set()); // Reset preloaded images when closing
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (zoom === 1) {
      resetPosition();
    }
  }, [zoom]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [currentIndex]);

  const preloadImage = useCallback(
    (index: number) => {
      if (!images[index] || preloadedImages.has(index)) return;

      const img = new Image();
      img.src = images[index];
      img.onload = () => {
        setPreloadedImages((prev) => new Set([...prev, index]));
      };
    },
    [images, preloadedImages]
  );

  if (!isOpen) return null;

  function updateImageTransform() {
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${zoom}) translate(${dragRef.current.x}px, ${dragRef.current.y}px)`;
    }
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (zoom > 1) {
      setIsDragging(true);
      startPosRef.current = {
        x: event.clientX - dragRef.current.x,
        y: event.clientY - dragRef.current.y
      };
    }
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (isDragging) {
      dragRef.current = {
        x: event.clientX - startPosRef.current.x,
        y: event.clientY - startPosRef.current.y
      };
      updateImageTransform();
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (zoom > 1) {
      setIsDragging(true);
      startPosRef.current = {
        x: event.touches[0].clientX - dragRef.current.x,
        y: event.touches[0].clientY - dragRef.current.y
      };
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (isDragging && zoom > 1) {
      event.preventDefault(); // Prevent page scrolling while dragging
      dragRef.current = {
        x: event.touches[0].clientX - startPosRef.current.x,
        y: event.touches[0].clientY - startPosRef.current.y
      };
      updateImageTransform();
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
  }

  function resetPosition() {
    dragRef.current = { x: 0, y: 0 };
    updateImageTransform();
  }

  function changeImage(index: number) {
    if (index >= 0 && index < images.length) {
      setIsLoading(true);
      setCurrentIndex(index);
      setZoom(1); // Reset zoom when changing image
      resetPosition(); // Reset position when changing image

      if (index > 0) {
        preloadImage(index - 1);
      }
      if (index < images.length - 1) {
        preloadImage(index + 1);
      }
    }
  }

  function handleNext() {
    if (currentIndex < images.length - 1) {
      setIsLoading(true);
      setCurrentIndex(currentIndex + 1);
      setZoom(1); // Reset zoom when changing image
      resetPosition(); // Reset position when changing image

      preloadImage(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setIsLoading(true);
      setCurrentIndex(currentIndex - 1);
      setZoom(1); // Reset zoom when changing image
      resetPosition(); // Reset position when changing image

      preloadImage(currentIndex - 1);
    }
  }

  function handleZoomIn() {
    setZoom((prevZoom) => {
      const newZoom = Math.min(prevZoom + 0.2, 3);
      updateImageTransform();
      return newZoom;
    });
  }

  function handleZoomOut() {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom - 0.2, 1);
      if (newZoom === 1) {
        resetPosition();
      } else {
        updateImageTransform();
      }
      return newZoom;
    });
  }

  const portalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button
        className="z-50 absolute top-2 right-2 text-white text-4xl bg-black bg-opacity-50 p-2 rounded-full cursor-pointer"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Main container with padding bottom to account for fixed thumbnails */}
      <div className="relative w-full h-full flex items-center justify-center pb-24">
        <div className="relative max-w-[90%] max-h-full">
          <div
            className={`relative ${zoom > 1 ? "cursor-grab" : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingAssetBig2 />
              </div>
            )}

            <img
              ref={imageRef}
              src={images[currentIndex]}
              onLoad={() => setIsLoading(false)}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] rounded object-contain"
              style={{
                touchAction: zoom > 1 ? "none" : "auto"
              }}
            />
          </div>
        </div>
      </div>

      {/* Fixed thumbnails container with updated padding */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
        <div className="flex justify-start md:justify-center overflow-x-auto gap-2 max-w-full scrollbar-hide px-4">
          {thumbnailImages.map((image, index) => (
            <img
              key={index}
              ref={(el) => (thumbnailRefs.current[index] = el)}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-12 h-12 shrink-0 object-cover rounded cursor-pointer transition-transform duration-200 ${index === currentIndex ? "border-2 border-[#FF8B1C]" : ""}`}
              onClick={() => changeImage(index)}
            />
          ))}
        </div>
      </div>

      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2 rounded-full cursor-pointer"
        onClick={handlePrev}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2 rounded-full cursor-pointer"
        onClick={handleNext}
      >
        &#10095;
      </button>
      <div className="absolute bottom-24 left-2 flex gap-2">
        <button
          className="bg-black bg-opacity-50 text-white p-5 rounded-full cursor-pointer"
          onClick={handleZoomIn}
        >
          +
        </button>
        <button
          className="bg-black bg-opacity-50 text-white p-5 rounded-full cursor-pointer"
          onClick={handleZoomOut}
        >
          -
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(portalContent, document.body);
};

export default ImageViewer;
