"use client";
import Image from "next/image";
import React from "react";

interface ApartmentCardProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  title,
  description,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="relative w-full h-56">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default ApartmentCard;
