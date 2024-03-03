import Listing from '../models/listing.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
  
  };

  export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
  
      let type = req.query.type;
      if (type === undefined || type === 'all') {
        type = { $in: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Horse', 'Farm Animal', 'Exotic Pet', 'Amphibian', 'Invertebrate', 'Other'] };
      }
  
      let sex = req.query.sex;
      if (sex === undefined || sex === 'all') {
        sex = { $in: ['Male', 'Female'] };
      }
  
      let vaccinated = req.query.vaccinated;
      if (vaccinated === undefined) {
        vaccinated = { $in: [false, true] };
      } else {
        vaccinated = vaccinated === 'true';
      }
  
      let adoptionStatus = req.query.adoptionStatus;
      if (adoptionStatus === undefined || adoptionStatus === 'all') {
        adoptionStatus = { $in: ['Available', 'Adopted', 'Foster Needed', 'Not Available'] };
      }
  
      let microchipId = req.query.microchipId;
      if (microchipId === undefined) {
        microchipId = { $exists: true, $ne: '' };
      }
  
      let breed = req.query.breed;
      if (breed === undefined || breed === 'all') {
        breed = { $exists: true, $ne: '' };
      } else {
        breed = { $regex: breed, $options: 'i' };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        type,
        sex,
        vaccinated,
        adoptionStatus,
        microchipId,
        breed,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  
  