

"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type SwiperType from 'swiper';
import { useEffect, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { cn } from '@/utilities/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  urls: string[];
  price?: number;
  label?: any;
  onArrowClick?: (event: React.MouseEvent) => void; // New prop
}

const ImageSlider = ({ urls, price, label, onArrowClick }: ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls?.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls?.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white/[0.4] border-zinc-300/[0.4] ';
  const inactiveStyles = 'hidden text-gray-400';

  return (
    <div className='group relative bg-zinc-100 aspect-square overflow-hidden rounded-t-lg'>
      <p className='absolute top-0 left-0 w-auto px-2 z-20 text-xl bg-gray-100 text-gray-500'>
        {label}
      </p>
      {/* <p className='absolute bottom-0 w-auto px-2 z-20 text-md bg-primary text-primary-foreground'>
        {price && formatPrice(price)}
      </p> */}
      <div className='absolute z-10 inset-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition'>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (onArrowClick) onArrowClick(e); // Call the prop function
            swiper?.slideNext();
          }}
          className={cn(activeStyles, 'right-3 transition', {
            [inactiveStyles]: slideConfig.isEnd,
            'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isEnd,
          })}
          aria-label='next image'>
          <ChevronRight className='h-4 w-4 text-indigo-700' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (onArrowClick) onArrowClick(e); // Call the prop function
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, 'left-3 transition', {
            [inactiveStyles]: slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isBeginning,
          })}
          aria-label='previous image'>
          <ChevronLeft className='h-4 w-4 text-indigo-700' />
        </button>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className='h-full w-full'>
        {urls.length > 0  ? <>{urls.map((url, i) => (
          <SwiperSlide key={i} className='-z-10 relative h-full w-full'>
{/*             <img className='-z-10 h-full w-full object-cover object-center' src={url} alt='Product image'/> */}
            <Image
              //loader={( url) => `https://dev.rentprompts.com/${url}`}
              fill
              loading='eager'
              className='-z-10 h-full w-full object-cover object-center'
              src={url}
              alt='Product image'
            />
          </SwiperSlide>
        ))}</>
        : <Image
        //loader={( url) => `https://dev.rentprompts.com/${url}`}
        fill
        loading='eager'
        className='-z-10 h-full w-full object-cover object-center'
        src={"/DummyRapps.png"}
        alt='Product image'
      />}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
