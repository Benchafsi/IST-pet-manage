import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    microchipId: {
        type: String,
        required: false,
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    address: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    size: {
        type: String,
        required: false,
        enum: ['Small', 'Medium', 'Large', 'Giant'],
    },
    type: {
        type: String,
        required: true,
        enum: [
            'Dog', 'Cat', 'Rabbit', 'Bird', 
            'Fish', 'Reptile', 'Rodent', 
            'Horse', 'Farm Animal', 'Exotic Pet', 
            'Amphibian', 'Invertebrate', 'Other'
        ],
    },
    breed: {
        type: String,
        required: true,
    },
    vaccinated: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    specialNeeds: {
        type: String,
        required: false,
    },
    adoptionStatus: {
        type: String,
        required: false,
        enum: ['Available', 'Adopted', 'Foster Needed', 'Not Available'],
    },
    behavioralTraits: {
        type: String,
        required: false,
    },
    
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;