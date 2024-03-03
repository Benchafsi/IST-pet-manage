import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [vaccinatedPets, setVaccinatedPets] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=4');
        const data = await res.json();
        setFeaturedPets(data);
        fetchRecentlyAdded();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRecentlyAdded = async () => {
      try {
        const res = await fetch('/api/listing/get?sort=createdAt&order=desc&limit=4');
        const data = await res.json();
        setRecentlyAdded(data);
        fetchVaccinatedPets();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVaccinatedPets = async () => {
      try {
        const res = await fetch('/api/listing/get?vaccinated=true&limit=4');
        const data = await res.json();
        setVaccinatedPets(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFeaturedPets();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Manage your <span className='text-slate-500'>pets</span>
          <br />
          with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Our platform is the best place to find your next furry friend.
          <br />
          We have a wide range of pets waiting for a loving home.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Start your search...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {featuredPets &&
          featuredPets.length > 0 &&
          featuredPets.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
      {featuredPets && featuredPets.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Featured Pets</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?featured=true'}>View all featured pets</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {featuredPets.map((pet) => (
                <ListingItem listing={pet} key={pet._id} />
              ))}
            </div>
          </div>
        )}
        {recentlyAdded && recentlyAdded.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recently Added</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?sort=createdAt_desc'}>See the latest additions</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {recentlyAdded.map((pet) => (
                <ListingItem listing={pet} key={pet._id} />
              ))}
            </div>
          </div>
        )}
        {vaccinatedPets && vaccinatedPets.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Vaccinated Pets</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?vaccinated=true'}>Explore vaccinated companions</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {vaccinatedPets.map((pet) => (
                <ListingItem listing={pet} key={pet._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}