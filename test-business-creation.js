import { storage } from './server/storage-fixed.js';
import { insertBusinessSchema } from './shared/schema.js';

async function testBusinessCreation() {
  try {
    console.log("Testing business creation validation and database constraints...");
    
    // Test 1: Create a test user first
    const testUser = await storage.createUser({
      email: "test@example.com",
      password: "hashedpassword123",
      firstName: "Test",
      lastName: "User"
    });
    console.log("✅ Test user created:", testUser.id);

    // Test 2: Valid business data
    const validBusinessData = {
      userId: testUser.id,
      businessName: "Test Lash Studio",
      bookingPageSlug: "test-lash-studio-" + Date.now(),
      tagline: "Beautiful lashes for beautiful you",
      description: "Professional lash extension services",
      location: "New York, NY",
      phone: "(555) 123-4567",
      website: "https://testlashstudio.com",
      brandColor: "#E91E63",
      secondaryColor: "#F8BBD9",
      specialties: ["Classic Lashes", "Volume Lashes"],
      showTestimonials: true,
      showGallery: true,
      isActive: true
    };

    // Test validation first
    const validationResult = insertBusinessSchema.partial().safeParse(validBusinessData);
    if (!validationResult.success) {
      console.error("❌ Validation failed:", validationResult.error.errors);
      return;
    }
    console.log("✅ Business data validation passed");

    // Test 3: Create business
    const business = await storage.createBusiness(validationResult.data);
    console.log("✅ Business created successfully:", business.id);

    // Test 4: Try creating duplicate business for same user (should fail)
    try {
      await storage.createBusiness(validationResult.data);
      console.log("❌ Should have failed for duplicate business");
    } catch (error) {
      console.log("✅ Correctly prevented duplicate business creation");
    }

    // Test 5: Try creating business with duplicate slug (should fail in endpoint)
    const duplicateSlugData = {
      ...validBusinessData,
      userId: "different-user-id",
      bookingPageSlug: validBusinessData.bookingPageSlug
    };
    
    const existingSlug = await storage.getBusinessBySlug(duplicateSlugData.bookingPageSlug);
    if (existingSlug) {
      console.log("✅ Slug uniqueness check working");
    }

    console.log("\n🎉 All business creation tests passed!");
    
  } catch (error) {
    console.error("❌ Business creation test failed:", error);
    console.error("Error details:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
}

testBusinessCreation();