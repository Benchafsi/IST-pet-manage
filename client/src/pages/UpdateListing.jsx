import React from 'react';
import { useEffect,useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: '',
      description: '',
      microchipId: '',
      sex: '', 
      address: '',
      age: 0,
      dateOfBirth: '', 
      size: '', 
      type: '', 
      breed: '',
      vaccinated: false,
      specialNeeds: '',
      adoptionStatus: '',
      behavioralTraits: '',
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(formData);
    
    useEffect(() => {
        const fetchListing = async () => {
          const listingId = params.listingId;
          const res = await fetch(`/api/listing/get/${listingId}`);
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          setFormData(data);
        };
    
        fetchListing();
      }, []);
    const handleImageSubmit = (e) => {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
  
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((err) => {
            setImageUploadError('Image upload failed (2 mb max per image)');
            setUploading(false);
          });
      } else {
        setImageUploadError('You can only upload 6 images per listing');
        setUploading(false);
      }
    };
  
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
  
    const handleRemoveImage = (index) => {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
      });
    };

    const handleChange = (e) => {

      const { id, value, type, checked } = e.target;
  
      if (type === 'checkbox') {
        setFormData({
          ...formData,
          [id]: checked,
        });
      } else {
        setFormData({
          ...formData,
          [id]: value,
        });
      }
      
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (formData.imageUrls.length < 1)
          return setError('You must upload at least one image');
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
        }
        navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Pet Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Pet Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='2'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Microchip ID (optional)'
            className='border p-3 rounded-lg'
            id='microchipId'
            onChange={handleChange}
            value={formData.microchipId}
          />
          <select
            id='sex'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.sex}
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type='number'
            placeholder='Age'
            className='border p-3 rounded-lg'
            id='age'
            min='0'
            required
            onChange={handleChange}
            value={formData.age}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth" className="font-semibold">Date of Birth (optional):</label>
            <input
                type="date"
                className="border p-3 rounded-lg"
                id="dateOfBirth"
                onChange={handleChange}
                value={formData.dateOfBirth}
            />
          </div>
          <select
            id='size'
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.size}
          >
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Giant">Giant</option>
          </select>
          <select
            id='type'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.type}
          >
            <option value="">Select Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Reptile">Reptile</option>
            <option value="Rodent">Rodent</option>
            <option value="Horse">Horse</option>
            <option value="Farm Animal">Farm Animal</option>
            <option value="Exotic Pet">Exotic Pet</option>
            <option value="Amphibian">Amphibian</option>
            <option value="Invertebrate">Invertebrate</option>
            <option value="Other">Other</option>
          </select>
          <input
            type='text'
            placeholder='Breed'
            className='border p-3 rounded-lg'
            id='breed'
            required
            onChange={handleChange}
            value={formData.breed}
          />
          <div className='flex gap-2'>
            <input type='checkbox' id='vaccinated' className='w-5'onChange={handleChange}
            value={formData.vaccinated} />
            <span>Vaccinated</span>
          </div>
          <select
            id='adoptionStatus'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.adoptionStatus}
          >
            <option value="">Adoption Status</option>
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
            <option value="Foster Needed">Foster Needed</option>
            <option value="Not Available">Not Available</option>
          </select>
          <textarea
            placeholder='Special Needs (optional)'
            className='border p-3 rounded-lg'
            id='specialNeeds'
            onChange={handleChange}
            value={formData.specialNeeds}
          />
          <textarea
            placeholder='Behavioral Traits (optional)'
            className='border p-3 rounded-lg'
            id='behavioralTraits'
            onChange={handleChange}
            value={formData.behavioralTraits}
          />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input className='p-3 border border-gray-300 rounded w-full'
                type="file"
                id='images'
                accept='image/*'
                onChange={(e) => setFiles(e.target.files)}
                multiple
            />
            <button
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
            >{uploading ? 'Uploading...' : 'Upload'}</button>
          </div>
          
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              disabled={loading || uploading}
              className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Updating...' : 'Update your pet'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
