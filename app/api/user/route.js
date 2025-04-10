import { NextResponse } from "next/server";
import getCurrentUser from "../../../actions/getCurrentUser";
import { db } from "../../../lib/db";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public/uploads/profile-pictures");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const imageFile = formData.get("image");

    // Validate inputs
    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 });
    }

    // Handle image upload if present
    let imageUrl = user.image;
    if (imageFile) {
      // Generate unique filename
      const fileExt = path.extname(imageFile.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const newPath = path.join(uploadsDir, fileName);
      
      // Convert File to buffer and write to disk
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(newPath, buffer);
      
      // Create public URL
      imageUrl = `/uploads/profile-pictures/${fileName}`;
      
      // Delete old image if it exists
      if (user.image && user.image.startsWith("/uploads/profile-pictures/")) {
        const oldImagePath = path.join(process.cwd(), "public", user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        ...(imageUrl && { image: imageUrl }),
      },
    });
    

    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}