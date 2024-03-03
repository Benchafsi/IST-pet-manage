import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    sex: 'all',
    vaccinated: 'all',
    breed: '',
    adoptionStatus: 'all',
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsData = {
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      sex: urlParams.get('sex') || 'all',
      vaccinated: urlParams.get('vaccinated') || 'all',
      breed: urlParams.get('breed') || '',
      adoptionStatus: urlParams.get('adoptionStatus') || 'all',
      sort: urlParams.get('sort') || 'createdAt',
      order: urlParams.get('order') || 'desc',
    };

    setSidebarData(paramsData);

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [window.location.search]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setSidebarData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value !== 'all') {
        urlParams.set(key, value);
      }
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
        <div className='flex items-center gap-2'>
          <label htmlFor='searchTerm' className='whitespace-nowrap font-semibold'>
            Search Term:
          </label>
          <input
            type='text'
            id='searchTerm'
            placeholder='Search by name, breed...'
            className='border rounded-lg p-3 w-full'
            value={sidebarData.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label htmlFor='type' className='font-semibold'>Type:</label>
          <select id='type' className='border rounded-lg p-3' value={sidebarData.type} onChange={handleChange}>
            <option value='all'>All Types</option>
            <option value='Dog'>Dog</option>
            <option value='Cat'>Cat</option>
            <option value='Rabbit'>Rabbit</option>
            <option value='Bird'>Bird</option>
            <option value='Fish'>Fish</option>
            <option value='Reptile'>Reptile</option>
            <option value='Rodent'>Rodent</option>
            <option value='Horse'>Horse</option>
            <option value='Farm Animal'>Farm Animal</option>
            <option value='Exotic Pet'>Exotic Pet</option>
            <option value='Amphibian'>Amphibian</option>
            <option value='Invertebrate'>Invertebrate</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label htmlFor='sex' className='font-semibold'>Sex:</label>
          <select id='sex' className='border rounded-lg p-3' value={sidebarData.sex} onChange={handleChange}>
            <option value='all'>All</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
          <label htmlFor='vaccinated' className='font-semibold'>Vaccinated:</label>
          <select id='vaccinated' className='border rounded-lg p-3' value={sidebarData.vaccinated} onChange={handleChange}>
            <option value='all'>All</option>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <label htmlFor='breed' className='font-semibold'>Breed:</label>
          <input
            type='text'
            id='breed'
            placeholder='Breed'
            className='border rounded-lg p-3 w-full'
            value={sidebarData.breed}
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center gap-2'>
          <label htmlFor='adoptionStatus' className='font-semibold'>Adoption Status:</label>
          <select id='adoptionStatus' className='border rounded-lg p-3' value={sidebarData.adoptionStatus} onChange={handleChange}>
            <option value='all'>All</option>
            <option value='Available'>Available</option>
            <option value='Adopted'>Adopted</option>
            <option value='Foster Needed'>Foster Needed</option>
            <option value='Not Available'>Not Available</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <label htmlFor='sort_order' className='font-semibold'>Sort:</label>
          <select
            id='sort_order'
            className='border rounded-lg p-3'
            value={`${sidebarData.sort}_${sidebarData.order}`}
            onChange={handleChange}
          >
            <option value='createdAt_desc'>Latest</option>
            <option value='createdAt_asc'>Oldest</option>

          </select>
        </div>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          Search
        </button>
      </form>
    </div>
    <div className='flex-1'>
      <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
        Listing results:
      </h1>
      <div className='p-7 flex flex-wrap gap-4'>
        {!loading && listings.length === 0 && (
          <p className='text-xl text-slate-700'>No listings found!</p>
        )}
        {loading && (
          <p className='text-xl text-slate-700 text-center w-full'>
            Loading...
          </p>
        )}
        {!loading &&
          listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        
        {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}

      </div>
    </div>
  </div>
  );
}
