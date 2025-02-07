import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import News from "@/models/News";
import connectDB from "@/lib/mongoDb";
import checkAuthentication from "@/lib/checkAuthentication";

const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  videoLink: z.string().url("Invalid video URL").optional().nullable(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  imageSource: z.string().optional().nullable().or(z.literal("")),
  keywords: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    // Check if the user is authenticated and an admin
    const isAdmin = await checkAuthentication(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Only admins can create news.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Convert FormData to a plain object with proper type handling
    const newsData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      thumbnail: formData.get("thumbnail")?.toString() || "",
      imageSource: formData.get("imageSource")?.toString() || "N/A",
      category: formData.get("category")?.toString() || "",
      subCategory: formData.get("subCategory")?.toString() || undefined,
      author: formData.get("author")?.toString() || "Admin",
      videoLink: formData.get("videoLink")?.toString() || null,
      keywords: formData.get("keywords")?.toString()
        ? formData.get("keywords")?.toString().split(",").filter(Boolean).map(k => k.trim())
        : [],
    };

    // Log the received data for debugging
    console.log("Received news data:", newsData);

    // Validate the data using Zod schema
    const validatedData = newsFormSchema.parse(newsData);

    // Create the new news entry in the database
    const news = await News.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "News created successfully.",
        data: news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);

    if (error instanceof z.ZodError) {
      // Return detailed validation errors
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors.map(err => ({
            path: err.path.join("."),
            message: err.message
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create news item.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get("search");

    let query: any = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      const decodedSearch = decodeURIComponent(search); // Convert %20 back to spaces
      const searchRegex = new RegExp(decodedSearch.split(" ").join("\\s+"), "i");
    
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
        { keywords: { $elemMatch: { $regex: searchRegex } } },
        { imageSource: { $regex: searchRegex } }
      ];
    }
    const data = await News.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "News items retrieved successfully.",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve news items.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}