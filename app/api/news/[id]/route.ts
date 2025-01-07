import checkAuthentication from "@/lib/checkAuthentication";
import connectDB from "@/lib/mongoDb";
import News from "@/models/News";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Initialize database connection
    await connectDB();

    // Await params before using its properties
    const { id } = await params;

    // Fetch news item by ID
    
    const newsItem = await News.findById(id);
    console.log("=========================================================================")
    console.log(newsItem);
    console.log("=========================================================================")
    if (!newsItem) {
      return NextResponse.json(
        {
          success: false,
          message: "News item not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News item retrieved successfully.",
        data: newsItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve news item.",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Initialize database connection
    await connectDB();

    const isAdmin = await checkAuthentication(request);

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Only admins can edit news.",
        },
        { status: 403 }
      );
    }

    // Await params before using its properties
    const { id } = await params;

    // Parse the updated data from the request body
    const updatedData = await request.json();

    // Find and update the news item
    const updatedNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News item not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News item updated successfully.",
        data: updatedNews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update news item.",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Initialize database connection
    await connectDB();

    const isAdmin = await checkAuthentication(request);

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Only admins can delete news.",
        },
        { status: 403 }
      );
    }

    // Await params before using its properties
    const { id } = await params;

    // Delete news item by ID
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News item not found.",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "News item deleted successfully.",
        data: deletedNews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete news item.",
        data: null,
      },
      { status: 500 }
    );
  }
}