import Image from "next/image";
import React from "react";
import Container from "../ui/Container";

interface RappData {
  title: string;
  description: string;
  price: string;
  image: File | null;
}

interface RappListingProps {
  rappData: RappData[]; // Expecting an array of RappData objects
}

const RappListing: React.FC<RappListingProps> = ({ rappData }) => {
  return (
    <Container>
      <div className="space-y-4 p-8"> {/* Creates space between list items */}
      {rappData.map((rapp, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg shadow-md bg-indigo-700 flex flex-col md:flex-row items-center gap-4"
        >
          {rapp.image && (
            <Image
              src={URL.createObjectURL(rapp.image)}
              alt={rapp?.title}
              className="w-full md:w-1/3 h-auto object-cover rounded-md"
              width={400}
              height={200}
            />
          )}
          <div className="flex flex-row justify-between space-y-2 w-full">
            <h2 className="text-xl font-bold">{rapp.title}</h2>
            <p className="text-muted-foreground">{rapp.description}</p>
            <p className="text-lg font-semibold">{rapp.price}</p>
          </div>
        </div>
      ))}
    </div>
    </Container>
  );
};

export default RappListing;
