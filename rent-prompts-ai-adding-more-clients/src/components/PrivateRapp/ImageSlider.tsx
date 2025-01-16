import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom arrow components
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
      style={{ ...style, fontSize: "24px", color: "#000" }}
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
      style={{ ...style, fontSize: "24px", color: "#000" }}
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );
}

export default function ImageSlider({ formData }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Use custom next arrow
    prevArrow: <PrevArrow />, // Use custom prev arrow
  };

  return (
    <div className="relative h-60 overflow-hidden rounded-lg">
      {formData.imageString && formData.imageString.length > 0 ? (
        <Slider {...settings}>
          {formData.imageString.map((imgSrc, index) => (
            <div key={index} className="relative h-60">
              <Image
                src={imgSrc}
                alt={`Image ${index + 1}`}
                className="object-cover"
                fill
                priority
              />
            </div>
          ))}
        </Slider>
      ) : (
        <Image
          src="/DummyRapps.png"
          alt="Default Image"
          className="object-cover"
          fill
          priority
        />
      )}
    </div>
  );
}
