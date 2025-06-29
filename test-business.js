// Quick test to see if business creation works
import { storage } from './server/storage.js';

async function testBusinessCreation() {
  try {
    const testBusiness = {
      userId: "test-user-123",
      businessName: "Test Lash Studio",
      bookingPageSlug: "test-studio",
      brandColor: "#E91E63",
      tagline: "",
      description: "",
      location: "",
      phone: "",
      website: "",
      secondaryColor: "#F8BBD9",
      specialties: [],
      showTestimonials: true,
      showGallery: true,
      isActive: true
    };
    
    console.log("Testing business creation with:", testBusiness);
    const result = await storage.createBusiness(testBusiness);
    console.log("Success! Created business:", result);
  } catch (error) {
    console.error("Failed to create business:", error);
    console.error("Error details:", error.message);
    console.error("Stack:", error.stack);
  }
}

testBusinessCreation();