import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaPaw, FaBirthdayCake, FaSyringe, FaHome, FaClipboardList,FaMicrochip, FaRulerCombined, FaAd, FaBrain } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);

  return (
    // <main>
    //   {loading && <p className="text-center my-7 text-2xl">Fetching your furry friend...</p>}
    //   {error && <p className="text-center my-7 text-2xl">Something went wrong in the kennel!</p>}
    //   {!loading && !error && listing && (
    //     <div>
    //       <Swiper navigation>
    //         {listing.imageUrls.map((url, index) => (
    //           <SwiperSlide key={index}>
    //             <img
    //               src={url}
    //               alt={`${listing.name}`}
    //               className="h-[550px] w-full object-cover"
    //             />
    //           </SwiperSlide>
    //         ))}
    //       </Swiper>
    //       <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
    //         <h1 className="text-3xl font-bold text-center mb-4">{listing.name}</h1>
    //         <div className="text-center text-lg">
    //           <p><FaPaw /> <strong>Type:</strong> {listing.type}</p>
    //           <p><FaBirthdayCake /> <strong>Age:</strong> {listing.age} years</p>
    //           <p><FaHome /> <strong>Location:</strong> {listing.address}</p>
    //           <p><FaClipboardList /> <strong>Breed:</strong> {listing.breed}</p>
    //           <p><FaSyringe /> {listing.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</p>
    //           {listing.specialNeeds && <p><strong>Special Needs:</strong> {listing.specialNeeds}</p>}
    //         </div>
    //         <div className="bg-gray-100 p-4 rounded-lg shadow">
    //           <h2 className="text-xl font-semibold mb-2">Description</h2>
    //           <p>{listing.description}</p>
    //         </div>
    //         {/* Additional pet details here maybe use some components to display the data in a nice way */}
    //       </div>
    //     </div>
    //   )}
    // </main>
    
        <main className="bg-gray-50 min-h-screen">
    {loading && <p className="text-center py-10 text-2xl text-gray-800">Fetching your furry friend...</p>}
    {error && <p className="text-center py-10 text-2xl text-red-600">Something went wrong in the kennel!</p>}
    {!loading && !error && listing && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <Swiper navigation={true} className="h-[500px]">
            {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
                <img src={url} alt={`${listing.name}`} className="h-full w-full object-cover"/>
            </SwiperSlide>
            ))}
        </Swiper>
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-center text-gray-900">{listing.name}</h1>
        </div>
        <div className="border-t border-gray-200">
            <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaPaw className="mr-2" />Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.type}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaBirthdayCake className="mr-2" />Age</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.age} years</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaHome className="mr-2" />Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.address}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaClipboardList className="mr-2" />Breed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.breed}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaSyringe className="mr-2" />Vaccination Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</dd>
            </div>
            {listing.specialNeeds && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Special Needs</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.specialNeeds}</dd>
                </div>
            )}
            <div className="bg-gray-100 p-4 sm:rounded-lg m-4 shadow">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{listing.description}</p>
            </div>

            {listing.microchipId && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center"><FaMicrochip className="mr-2" />Microchip ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.microchipId}</dd>
            </div>)}
            {listing.dateOfBirth && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaBirthdayCake className="mr-2" />Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(listing.dateOfBirth).toLocaleDateString()}</dd>
            </div>)}
            {listing.size && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaRulerCombined className="mr-2" />Size</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.size}</dd>
            </div>)}
            {listing.adoptionStatus && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaAd className="mr-2" />Adoption Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.adoptionStatus}</dd>
            </div>)}
            {listing.behavioralTraits && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><FaBrain className="mr-2" />Behavioral Traits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{listing.behavioralTraits}</dd>
            </div>)}

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                Contact owner
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          

            </dl>
        </div>
        </div>
    )}
    </main>


  );
}