import { createClient } from "@supabase/supabase-js";
import { env } from "./lib/env";

// This script should be run manually to seed the database
// Usage: npm run db:seed
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
// These are validated by T3 Env - the script will fail fast if they're missing
// Environment variables are loaded from .env.local via tsx --env-file flag

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

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
    // Create test users for each organisation
    console.log("Creating test users...");
    const testUsers = [
      {
        email: "admin@thamesvalley.com",
        password: "password123",
        org: "Thames Valley Housing",
        role: "admin",
      },
      {
        email: "admin@londonquadrant.com",
        password: "password123",
        org: "London & Quadrant",
        role: "admin",
      },
      {
        email: "admin@clarion.com",
        password: "password123",
        org: "Clarion Housing",
        role: "admin",
      },
      {
        email: "admin@all.com",
        password: "password123",
        org: "all", // Special flag for multi-org user
        role: "admin",
      },
    ];

    const userOrgs = new Map<
      string,
      { userId: string; orgName: string; role: string }
    >();

    for (const testUser of testUsers) {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
        });

      if (authError) {
        console.error(`Error creating user ${testUser.email}:`, authError);
        continue;
      }

      if (authData.user) {
        userOrgs.set(testUser.email, {
          userId: authData.user.id,
          orgName: testUser.org,
          role: testUser.role,
        });
        console.log(`✓ Created user ${testUser.email}`);
      }
    }

    console.log(`\n✓ Created ${userOrgs.size} test users\n`);

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

      // Link test user to organisation
      for (const [email, userData] of userOrgs.entries()) {
        if (userData.orgName === org.name || userData.orgName === "all") {
          await supabase.from("user_organisations").insert({
            user_id: userData.userId,
            organisation_id: data.id,
            role: userData.role,
          });
          console.log(`  ✓ Linked ${email} to ${org.name} as ${userData.role}`);
        }
      }
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

      // Create property valuations (12 months of HPI data for each property)
      console.log(`  Creating property valuations (12 months per property)...`);
      let valuationCount = 0;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11); // Start 11 months ago

      for (const property of createdProperties) {
        let baseValue = property.property_value;
        // Simulate 8% annual growth (matching StairPay market conditions)
        const monthlyGrowth = 0.0064; // ~8% annually

        for (let month = 0; month < 12; month++) {
          const valuationDate = new Date(startDate);
          valuationDate.setMonth(valuationDate.getMonth() + month);

          const monthValue = baseValue * (1 + monthlyGrowth * month);
          const previousValue =
            month === 0
              ? baseValue
              : baseValue * (1 + monthlyGrowth * (month - 1));
          const changePercent =
            ((monthValue - previousValue) / previousValue) * 100;

          await supabase.from("property_valuations").insert({
            organisation_id: org.id,
            property_id: property.id,
            valuation_date: valuationDate.toISOString().split("T")[0],
            estimated_value: monthValue,
            value_change_percent: changePercent,
            hpi_index: 100 + month * 0.64, // HPI index growing
            notes: month === 11 ? "Most recent HPI valuation" : null,
          });
          valuationCount++;
        }
      }
      console.log(`  ✓ Created ${valuationCount} property valuations`);

      // Create marketing campaigns
      console.log(`  Creating marketing campaigns...`);
      const campaigns = [
        {
          name: "50% Equity Milestone Campaign",
          description:
            "Target residents who have reached 50% equity to encourage full staircasing",
          status: "active",
          target_segment: { equity_min: 50, equity_max: 75 },
          email_template:
            "You now own 50% of your home! Learn about the benefits of full ownership.",
          start_date: new Date(
            Date.now() - 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          end_date: null,
          total_sent: 45,
          total_opened: 38,
          total_clicked: 22,
          total_converted: 5,
        },
        {
          name: "Anniversary Reminder",
          description:
            "Celebrate move-in anniversaries and share staircasing opportunities",
          status: "active",
          target_segment: { anniversary: true },
          email_template:
            "Happy anniversary! See how much equity you could afford to purchase now.",
          start_date: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString(),
          end_date: null,
          total_sent: 28,
          total_opened: 26,
          total_clicked: 15,
          total_converted: 3,
        },
        {
          name: "Property Value Growth Alert",
          description:
            "Notify residents when their property value increases significantly",
          status: "active",
          target_segment: { value_increase_percent: 5 },
          email_template:
            "Your property value has increased! Now might be a great time to staircase.",
          start_date: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          end_date: null,
          total_sent: 62,
          total_opened: 58,
          total_clicked: 41,
          total_converted: 8,
        },
      ];

      const createdCampaigns = [];
      for (const campaign of campaigns) {
        const { data, error } = await supabase
          .from("marketing_campaigns")
          .insert({
            organisation_id: org.id,
            ...campaign,
          })
          .select()
          .single();

        if (!error && data) {
          createdCampaigns.push(data);
        }
      }
      console.log(`  ✓ Created ${createdCampaigns.length} marketing campaigns`);

      // Create campaign triggers
      console.log(`  Creating campaign triggers...`);
      const triggers = [
        {
          campaign: createdCampaigns[0],
          trigger_type: "equity_threshold",
          trigger_conditions: { equity_percent: 50, operator: ">=" },
          is_active: true,
        },
        {
          campaign: createdCampaigns[1],
          trigger_type: "move_in_anniversary",
          trigger_conditions: { years: 1, operator: ">=" },
          is_active: true,
        },
        {
          campaign: createdCampaigns[2],
          trigger_type: "property_value_increase",
          trigger_conditions: { increase_percent: 5, operator: ">=" },
          is_active: true,
        },
      ];

      for (const trigger of triggers) {
        if (trigger.campaign) {
          await supabase.from("campaign_triggers").insert({
            organisation_id: org.id,
            campaign_id: trigger.campaign.id,
            trigger_type: trigger.trigger_type,
            trigger_conditions: trigger.trigger_conditions,
            is_active: trigger.is_active,
            last_triggered_at: new Date(
              Date.now() - randomNumber(1, 7) * 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }
      }
      console.log(`  ✓ Created ${triggers.length} campaign triggers`);

      // Create service providers
      console.log(`  Creating service providers...`);
      const providers = [
        {
          provider_type: "broker",
          company_name: "First Time Mortgages Ltd",
          contact_name: "Sarah Mitchell",
          email: "sarah@firsttimemortgages.co.uk",
          phone: "020 7123 4567",
          website: "https://firsttimemortgages.co.uk",
          specializations: [
            "Shared Ownership",
            "First Time Buyers",
            "Staircasing",
          ],
          is_preferred: true,
          average_rating: 4.8,
          total_referrals: 45,
        },
        {
          provider_type: "broker",
          company_name: "London Mortgage Services",
          contact_name: "James Parker",
          email: "james@londonmortgages.com",
          phone: "020 7234 5678",
          website: "https://londonmortgages.com",
          specializations: ["Staircasing", "Remortgage"],
          is_preferred: false,
          average_rating: 4.5,
          total_referrals: 28,
        },
        {
          provider_type: "surveyor",
          company_name: "Capital Property Surveyors",
          contact_name: "Emily Thompson",
          email: "emily@capitalsurveyors.co.uk",
          phone: "020 7345 6789",
          website: "https://capitalsurveyors.co.uk",
          specializations: ["RICS Valuations", "Shared Ownership"],
          is_preferred: true,
          average_rating: 4.9,
          total_referrals: 67,
        },
        {
          provider_type: "valuer",
          company_name: "Thames Valley Valuations",
          contact_name: "Michael Brown",
          email: "michael@thamesvaluations.com",
          phone: "020 7456 7890",
          website: "https://thamesvaluations.com",
          specializations: ["RICS Valuations", "HPI Analysis"],
          is_preferred: true,
          average_rating: 4.7,
          total_referrals: 52,
        },
        {
          provider_type: "conveyancer",
          company_name: "Speedy Conveyancing",
          contact_name: "Rachel Green",
          email: "rachel@speedyconvey.co.uk",
          phone: "020 7567 8901",
          website: "https://speedyconvey.co.uk",
          specializations: ["Staircasing", "Shared Ownership", "Fast Track"],
          is_preferred: true,
          average_rating: 4.6,
          total_referrals: 41,
        },
        {
          provider_type: "solicitor",
          company_name: "City Legal Partners",
          contact_name: "David Wilson",
          email: "david@citylegal.com",
          phone: "020 7678 9012",
          website: "https://citylegal.com",
          specializations: ["Property Law", "Shared Ownership"],
          is_preferred: false,
          average_rating: 4.4,
          total_referrals: 33,
        },
        {
          provider_type: "surveyor",
          company_name: "Metro Survey Group",
          contact_name: "Lisa Anderson",
          email: "lisa@metrosurvey.co.uk",
          phone: "020 7789 0123",
          website: "https://metrosurvey.co.uk",
          specializations: ["Building Surveys", "Valuations"],
          is_preferred: false,
          average_rating: 4.3,
          total_referrals: 19,
        },
        {
          provider_type: "broker",
          company_name: "Staircase Specialists",
          contact_name: "Tom Harris",
          email: "tom@staircasespecialists.co.uk",
          phone: "020 7890 1234",
          website: "https://staircasespecialists.co.uk",
          specializations: [
            "Staircasing",
            "Shared Ownership",
            "Equity Release",
          ],
          is_preferred: true,
          average_rating: 4.9,
          total_referrals: 73,
        },
      ];

      for (const provider of providers) {
        await supabase.from("service_providers").insert({
          organisation_id: org.id,
          ...provider,
        });
      }
      console.log(`  ✓ Created ${providers.length} service providers`);

      // Create resident feedback
      console.log(`  Creating resident feedback...`);
      const feedbackCategories = [
        "staircasing_process",
        "customer_service",
        "platform_usability",
        "communication",
        "overall_experience",
      ];
      const sentiments = ["positive", "neutral", "negative"];
      const feedbackTexts = {
        positive: [
          "The staircasing process was much smoother than I expected. Great support throughout!",
          "Love how easy it is to track my property value and equity. Very empowering.",
          "The team was incredibly helpful in explaining all the options available to me.",
          "Brilliant platform - makes understanding shared ownership so much easier.",
          "Excellent service from start to finish. Highly recommend!",
        ],
        neutral: [
          "The process was okay, took a bit longer than expected but got there in the end.",
          "Platform is useful but could have more detailed financial breakdowns.",
          "Good service overall, though communication could be improved.",
          "Satisfied with the outcome, though the initial setup was confusing.",
        ],
        negative: [
          "Found the process quite confusing and needed more guidance.",
          "Took too long to get responses to my questions.",
          "Platform could be more user-friendly for less tech-savvy users.",
        ],
      };

      let feedbackCount = 0;
      for (const tenant of createdTenants.slice(0, 50)) {
        // Feedback for ~50 tenants
        const sentiment = randomElement(sentiments);
        const npsScore =
          sentiment === "positive"
            ? randomNumber(9, 10)
            : sentiment === "neutral"
            ? randomNumber(7, 8)
            : randomNumber(0, 6);
        const satisfactionScore =
          sentiment === "positive"
            ? randomNumber(4, 5)
            : sentiment === "neutral"
            ? 3
            : randomNumber(1, 2);

        await supabase.from("resident_feedback").insert({
          organisation_id: org.id,
          tenant_id: tenant.id,
          nps_score: npsScore,
          satisfaction_score: satisfactionScore,
          feedback_text: randomElement(feedbackTexts[sentiment]),
          category: randomElement(feedbackCategories),
          sentiment,
          submitted_at: new Date(
            Date.now() - randomNumber(1, 90) * 24 * 60 * 60 * 1000
          ).toISOString(),
        });
        feedbackCount++;
      }
      console.log(`  ✓ Created ${feedbackCount} resident feedback responses`);

      // Create financial insights
      console.log(`  Creating financial insights...`);
      let insightCount = 0;
      for (const tenant of createdTenants) {
        const property = createdProperties.find(
          (p) => p.id === tenant.property_id
        )!;

        // Calculate readiness score based on multiple factors
        let readinessScore = 0;
        const factors: any = {
          current_equity: tenant.current_equity_percentage,
          property_value_trend: "increasing",
          time_as_tenant: 0,
        };

        // Equity percentage factor (0-30 points)
        if (tenant.current_equity_percentage >= 50) {
          readinessScore += 30;
          factors.equity_score = 30;
        } else if (tenant.current_equity_percentage >= 35) {
          readinessScore += 20;
          factors.equity_score = 20;
        } else {
          readinessScore += 10;
          factors.equity_score = 10;
        }

        // Time as tenant factor (0-20 points)
        const moveInDate = new Date(tenant.move_in_date);
        const yearsAsTenant =
          (Date.now() - moveInDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
        factors.time_as_tenant = yearsAsTenant.toFixed(1);
        if (yearsAsTenant >= 3) {
          readinessScore += 20;
          factors.time_score = 20;
        } else if (yearsAsTenant >= 1.5) {
          readinessScore += 15;
          factors.time_score = 15;
        } else {
          readinessScore += 5;
          factors.time_score = 5;
        }

        // Payment capacity factor (0-25 points)
        const monthlyPayments =
          parseFloat(tenant.monthly_rent.toString()) +
          parseFloat(tenant.monthly_mortgage.toString()) +
          parseFloat(tenant.monthly_service_charge.toString());
        if (monthlyPayments < 1500) {
          readinessScore += 25;
          factors.payment_capacity_score = 25;
        } else if (monthlyPayments < 2000) {
          readinessScore += 18;
          factors.payment_capacity_score = 18;
        } else {
          readinessScore += 10;
          factors.payment_capacity_score = 10;
        }

        // Property value growth factor (0-25 points)
        readinessScore += 20; // Assume good market conditions
        factors.market_conditions_score = 20;

        // Calculate potential equity growth and savings
        const remainingEquity = 100 - tenant.current_equity_percentage;
        const equityValue = (remainingEquity / 100) * property.property_value;
        const potentialGrowth = Math.min(equityValue, 50000); // Cap at £50k for realism

        const currentRent = parseFloat(tenant.monthly_rent.toString());
        const monthlySavings =
          tenant.current_equity_percentage >= 50
            ? currentRent
            : currentRent * 0.5;

        // Determine recommendation
        let recommendation = "wait_for_value_increase";
        if (readinessScore >= 70) {
          recommendation = "staircase_now";
        } else if (readinessScore >= 50) {
          recommendation = "save_more";
        }

        await supabase.from("financial_insights").insert({
          organisation_id: org.id,
          tenant_id: tenant.id,
          property_id: property.id,
          readiness_score: readinessScore,
          equity_growth_potential: potentialGrowth,
          estimated_monthly_savings: monthlySavings,
          recommended_action: recommendation,
          factors,
          calculated_at: new Date().toISOString(),
        });
        insightCount++;
      }
      console.log(`  ✓ Created ${insightCount} financial insights`);

      console.log(`✓ Completed ${org.name}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${userOrgs.size} test users`);
    console.log(`   - ${createdOrgs.length} organisations`);
    console.log(`   - ~${createdOrgs.length * 10} properties`);
    console.log(`   - ~${createdOrgs.length * 20} tenants`);
    console.log(`   - ~${createdOrgs.length * 7} staircasing applications`);
    console.log(`   - ~${createdOrgs.length * 120} property valuations`);
    console.log(`   - ~${createdOrgs.length * 3} marketing campaigns`);
    console.log(`   - ~${createdOrgs.length * 8} service providers`);
    console.log(`   - ~${createdOrgs.length * 50} feedback responses`);
    console.log(`   - ~${createdOrgs.length * 20} financial insights`);

    console.log("\n🔑 Test User Credentials:");
    console.log("   Email: admin@thamesvalley.com | Password: password123");
    console.log("   Email: admin@londonquadrant.com | Password: password123");
    console.log("   Email: admin@clarion.com | Password: password123");
    console.log(
      "   Email: admin@all.com | Password: password123 (Access to all orgs)"
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
