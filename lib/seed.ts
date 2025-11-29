import { createClient } from "@supabase/supabase-js";

// This script should be run manually to seed the database
// Usage: npm run seed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const organisations = [
  { name: "Thames Valley Housing" },
  { name: "London & Quadrant" },
  { name: "Clarion Housing" },
];

const londonPostcodes = [
  "SW1A 1AA",
  "W1A 0AX",
  "E1 6AN",
  "N1 9AG",
  "SE1 7PB",
  "NW1 4RY",
  "EC1A 1BB",
  "WC2N 5DU",
  "E2 9AN",
  "SW7 2AZ",
];

const streetNames = [
  "High Street",
  "Station Road",
  "Church Lane",
  "Mill Lane",
  "Park Road",
  "London Road",
  "Queens Road",
  "Victoria Street",
  "Manor Road",
  "Green Lane",
];

const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Daniel",
  "Emily",
  "Matthew",
  "Sophie",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals: number = 2): number {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
}

function generateAddress(): string {
  return `${randomNumber(1, 999)} ${randomElement(streetNames)}, London`;
}

async function seedDatabase() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Create organisations
    console.log("Creating organisations...");
    const createdOrgs = [];
    for (const org of organisations) {
      const { data, error } = await supabase
        .from("organisations")
        .insert(org)
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${org.name}:`, error);
        continue;
      }

      createdOrgs.push(data);
      console.log(`✓ Created ${org.name}`);
    }

    console.log(`\n✓ Created ${createdOrgs.length} organisations\n`);

    // For each organisation, create properties, tenants, and applications
    for (const org of createdOrgs) {
      console.log(`\n📦 Seeding ${org.name}...`);

      // Create 8-12 properties
      const propertyCount = randomNumber(8, 12);
      const createdProperties = [];

      console.log(`  Creating ${propertyCount} properties...`);
      for (let i = 0; i < propertyCount; i++) {
        const { data, error } = await supabase
          .from("properties")
          .insert({
            organisation_id: org.id,
            address: generateAddress(),
            postcode: randomElement(londonPostcodes),
            property_value: randomDecimal(180000, 450000, 2),
          })
          .select()
          .single();

        if (!error && data) {
          createdProperties.push(data);
        }
      }
      console.log(`  ✓ Created ${createdProperties.length} properties`);

      // Create 15-25 tenants
      const tenantCount = randomNumber(15, 25);
      const createdTenants = [];

      console.log(`  Creating ${tenantCount} tenants...`);
      for (let i = 0; i < tenantCount; i++) {
        const property = randomElement(createdProperties);
        const equityPercentage = randomDecimal(10, 75, 2);
        const monthlyRent = randomDecimal(400, 800, 2);
        const monthlyMortgage = randomDecimal(500, 1200, 2);
        const monthlyService = randomDecimal(80, 200, 2);

        // Generate move-in date between 1-5 years ago
        const moveInDate = new Date();
        moveInDate.setFullYear(moveInDate.getFullYear() - randomNumber(1, 5));

        const { data, error } = await supabase
          .from("tenants")
          .insert({
            organisation_id: org.id,
            property_id: property.id,
            first_name: randomElement(firstNames),
            last_name: randomElement(lastNames),
            email: `tenant${i}@${org.name
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
            phone: `07${randomNumber(100000000, 999999999)}`,
            current_equity_percentage: equityPercentage,
            monthly_rent: monthlyRent,
            monthly_mortgage: monthlyMortgage,
            monthly_service_charge: monthlyService,
            move_in_date: moveInDate.toISOString().split("T")[0],
          })
          .select()
          .single();

        if (!error && data) {
          createdTenants.push(data);
        }
      }
      console.log(`  ✓ Created ${createdTenants.length} tenants`);

      // Create 5-10 staircasing applications
      const applicationCount = randomNumber(5, 10);
      const statuses = ["pending", "approved", "completed", "rejected"];

      console.log(`  Creating ${applicationCount} staircasing applications...`);
      for (let i = 0; i < applicationCount; i++) {
        const tenant = randomElement(createdTenants);
        const property = createdProperties.find(
          (p) => p.id === tenant.property_id
        )!;
        const equityRequested = randomDecimal(5, 25, 2);
        const cost = (equityRequested / 100) * property.property_value;

        // Generate application date within the last year
        const appDate = new Date();
        appDate.setMonth(appDate.getMonth() - randomNumber(1, 12));

        const status = randomElement(statuses);
        let approvedDate = null;
        let completedDate = null;

        if (status === "approved" || status === "completed") {
          approvedDate = new Date(appDate);
          approvedDate.setDate(approvedDate.getDate() + randomNumber(7, 30));

          if (status === "completed") {
            completedDate = new Date(approvedDate);
            completedDate.setDate(
              completedDate.getDate() + randomNumber(30, 90)
            );
          }
        }

        await supabase.from("staircasing_applications").insert({
          organisation_id: org.id,
          tenant_id: tenant.id,
          property_id: property.id,
          equity_percentage_requested: equityRequested,
          estimated_cost: cost,
          status,
          application_date: appDate.toISOString(),
          approved_date: approvedDate?.toISOString() || null,
          completed_date: completedDate?.toISOString() || null,
          notes:
            status === "rejected" ? "Insufficient funds verification" : null,
        });
      }
      console.log(`  ✓ Created ${applicationCount} staircasing applications`);

      console.log(`✓ Completed ${org.name}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${createdOrgs.length} organisations`);
    console.log(`   - ~${createdOrgs.length * 10} properties`);
    console.log(`   - ~${createdOrgs.length * 20} tenants`);
    console.log(`   - ~${createdOrgs.length * 7} staircasing applications`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
