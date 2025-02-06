import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoLink?: string;
  category: string;
  subCategory?: string;
  author: string;
  keywords?: string[];
  imageSource: string;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
      trim: true,
    },
    videoLink: {
      type: String,
      trim: true,
      default: null,
    },
    imageSource: {
      type: String,
      required: [true, "Image source is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: null,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Auto-generates createdAt & updatedAt
  }
);

// Prevent model re-registration in Next.js
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', newsSchema);

export default News;
