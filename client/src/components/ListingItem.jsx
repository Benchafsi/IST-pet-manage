import { Link } from 'react-router-dom';
import { MdPets, MdCake, MdCheckCircle, MdCancel } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://via.placeholder.com/400x300?text=Pet+Image'
          }
          alt='Pet cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.name} - {listing.breed}
          </p>
          <div className='flex items-center gap-1'>
            <MdPets className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              Type: {listing.type}
            </p>
          </div>
          <div className='flex items-center gap-1'>
            <MdCake className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              Age: {listing.age} years
            </p>
          </div>
          <div className='flex items-center gap-1'>
            {listing.vaccinated ? <MdCheckCircle className='h-4 w-4 text-green-700' /> : <MdCancel className='h-4 w-4 text-red-600' />}
            <p className='text-sm text-gray-600'>
              Vaccinated: {listing.vaccinated ? 'Yes' : 'No'}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          {listing.adoptionStatus && (
            <p className='text-green-600 mt-2 font-semibold'>
              Status: {listing.adoptionStatus}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
