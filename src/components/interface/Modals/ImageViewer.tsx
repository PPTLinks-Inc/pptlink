import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

function ImageViewer({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
        setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col gap-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={image}
                  alt="image"
                  className="max-w-full object-contain max-h-full transition-transform duration-250 active:scale-200"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="disabled:!pointer-events-auto" />
        <CarouselNext className="disabled:!pointer-events-auto" />
      </Carousel>

      <div className="flex gap-2 overflow-x-auto p-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.replace("/upload/", "/upload/w_64,h_64,c_fill/")}
            alt={`thumbnail ${index}`}
            loading="lazy"
            className={`h-16 w-16 object-cover cursor-pointer transition-all 
                    ${currentIndex === index ? "border-2 border-blue-500" : "opacity-70"}`}
            onClick={() => {
              api?.scrollTo(index);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageViewer;
