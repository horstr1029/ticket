import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const adminPassword = await bcrypt.hash("admin123", 10)
  const agentPassword = await bcrypt.hash("agent123", 10)
  const customerPassword = await bcrypt.hash("customer123", 10)

  // Users
  const admin = await db.user.upsert({
    where: { email: "admin@helpdesk.io" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@helpdesk.io",
      password: adminPassword,
      role: "admin",
      isOnline: true,
    },
  })

  const mike = await db.user.upsert({
    where: { email: "mike@helpdesk.io" },
    update: {},
    create: {
      name: "Mike Chen",
      email: "mike@helpdesk.io",
      password: agentPassword,
      role: "agent",
      isOnline: true,
    },
  })

  const lisa = await db.user.upsert({
    where: { email: "lisa@helpdesk.io" },
    update: {},
    create: {
      name: "Lisa Park",
      email: "lisa@helpdesk.io",
      password: agentPassword,
      role: "agent",
      isOnline: false,
    },
  })

  const james = await db.user.upsert({
    where: { email: "james@helpdesk.io" },
    update: {},
    create: {
      name: "James Reed",
      email: "james@helpdesk.io",
      password: agentPassword,
      role: "agent",
      isOnline: true,
    },
  })

  const sarah = await db.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: customerPassword,
      role: "customer",
    },
  })

  const tom = await db.user.upsert({
    where: { email: "tom@example.com" },
    update: {},
    create: {
      name: "Tom Williams",
      email: "tom@example.com",
      password: customerPassword,
      role: "customer",
    },
  })

  const priya = await db.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      name: "Priya Patel",
      email: "priya@example.com",
      password: customerPassword,
      role: "customer",
    },
  })

  const datacorp = await db.user.upsert({
    where: { email: "dev@datacorp.io" },
    update: {},
    create: {
      name: "DataCorp Inc.",
      email: "dev@datacorp.io",
      password: customerPassword,
      role: "customer",
    },
  })

  const chris = await db.user.upsert({
    where: { email: "chris@example.com" },
    update: {},
    create: {
      name: "Chris Anderson",
      email: "chris@example.com",
      password: customerPassword,
      role: "customer",
    },
  })

  const emma = await db.user.upsert({
    where: { email: "emma@example.com" },
    update: {},
    create: {
      name: "Emma Davis",
      email: "emma@example.com",
      password: customerPassword,
      role: "customer",
    },
  })

  // Groups
  await db.group.upsert({
    where: { name: "Technical Support" },
    update: {},
    create: { name: "Technical Support", description: "Handles technical issues" },
  })

  await db.group.upsert({
    where: { name: "Billing" },
    update: {},
    create: { name: "Billing", description: "Handles billing and payments" },
  })

  // Tickets
  await db.ticket.create({
    data: {
      subject: "Cannot log in to my account after password reset",
      status: "open",
      priority: "high",
      channel: "email",
      tags: ["auth", "urgent"],
      requesterId: sarah.id,
      assigneeId: mike.id,
      slaDeadline: new Date(Date.now() + 3600000 * 4),
      comments: {
        create: [
          {
            body: "Hi, I tried to reset my password using the link sent to my email, but after clicking it and setting a new password, I can't log in. The page just says 'Invalid credentials'. I've tried three times now. Please help!",
            authorId: sarah.id,
          },
          {
            body: "I checked the auth logs — looks like the password reset token was consumed but the session wasn't properly updated. Trying the force-logout fix.",
            isInternal: true,
            authorId: mike.id,
          },
          {
            body: "Hi Sarah, thank you for reaching out! I can see there was an issue with the password reset process on our end. I've manually cleared your session cache. Please try logging in again with your new password — it should work now. Let me know if you still have any trouble!",
            authorId: mike.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "Billing invoice shows incorrect amount for March",
      status: "pending",
      priority: "normal",
      channel: "web",
      tags: ["billing"],
      requesterId: tom.id,
      createdAt: new Date(Date.now() - 3600000 * 5),
      comments: {
        create: [
          {
            body: "My invoice for March shows $299 but I should be on the $199/mo plan. Please correct this.",
            authorId: tom.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "Feature request: Export data as CSV",
      status: "new",
      priority: "low",
      channel: "web",
      tags: ["feature-request"],
      requesterId: priya.id,
      createdAt: new Date(Date.now() - 3600000 * 8),
      comments: {
        create: [
          {
            body: "It would be very helpful to be able to export our ticket data as CSV for reporting purposes. Is this on the roadmap?",
            authorId: priya.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "API integration returning 401 on all endpoints",
      status: "open",
      priority: "urgent",
      channel: "api",
      tags: ["api", "integration"],
      requesterId: datacorp.id,
      assigneeId: lisa.id,
      slaDeadline: new Date(Date.now() + 1800000),
      createdAt: new Date(Date.now() - 3600000),
      comments: {
        create: [
          {
            body: "All our API calls started returning 401 Unauthorized about 2 hours ago. Nothing changed on our end. API key is correct. This is blocking our production environment.",
            authorId: datacorp.id,
          },
          {
            body: "Checking API key rotation logs now. May be related to the key expiry policy change we deployed yesterday.",
            isInternal: true,
            authorId: lisa.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "Mobile app crashes on iOS 17 when uploading files",
      status: "open",
      priority: "high",
      channel: "email",
      tags: ["mobile", "bug"],
      requesterId: chris.id,
      assigneeId: mike.id,
      slaDeadline: new Date(Date.now() + 5400000),
      createdAt: new Date(Date.now() - 3600000 * 3),
      comments: {
        create: [
          {
            body: "Whenever I try to upload any file (PDF, image, etc.) in the mobile app on my iPhone running iOS 17.2, the app immediately crashes. It worked fine before the last update.",
            authorId: chris.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "How do I set up two-factor authentication?",
      status: "solved",
      priority: "normal",
      channel: "web",
      tags: ["2fa", "how-to"],
      requesterId: emma.id,
      assigneeId: james.id,
      solvedAt: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 86400000),
      comments: {
        create: [
          {
            body: "I want to enable 2FA on my account for extra security but I can't find the option in settings.",
            authorId: emma.id,
          },
          {
            body: "Hi Emma! You can enable 2FA in Settings → Security → Two-Factor Authentication. You'll need an authenticator app like Google Authenticator or Authy. Let me know if you need more help!",
            authorId: james.id,
          },
          {
            body: "That worked perfectly, thank you!",
            authorId: emma.id,
          },
        ],
      },
    },
  })

  await db.ticket.create({
    data: {
      subject: "Dashboard loading very slowly — takes 15+ seconds",
      status: "open",
      priority: "high",
      channel: "web",
      tags: ["performance"],
      requesterId: sarah.id,
      createdAt: new Date(Date.now() - 3600000 * 12),
      comments: {
        create: [
          {
            body: "The main dashboard takes over 15 seconds to load every time. This started happening yesterday. Other pages load fine.",
            authorId: sarah.id,
          },
        ],
      },
    },
  })

  // Solved tickets for agent stats
  for (let i = 0; i < 8; i++) {
    await db.ticket.create({
      data: {
        subject: `Resolved issue #${i + 1}`,
        status: "solved",
        priority: "normal",
        channel: "web",
        requesterId: tom.id,
        assigneeId: i % 3 === 0 ? mike.id : i % 3 === 1 ? lisa.id : james.id,
        solvedAt: new Date(Date.now() - 3600000 * (i + 1)),
        createdAt: new Date(Date.now() - 3600000 * (i + 2)),
        comments: {
          create: [
            { body: "Issue description", authorId: tom.id },
            { body: "Issue resolved", authorId: i % 3 === 0 ? mike.id : i % 3 === 1 ? lisa.id : james.id },
          ],
        },
      },
    })
  }

  await db.slaPolicy.upsert({
    where: { id: "default-sla" },
    update: {},
    create: {
      id: "default-sla",
      name: "Standard SLA",
      firstResponseTime: 240,
      resolutionTime: 1440,
      businessHoursOnly: true,
    },
  })

  console.log(`✓ Created users: ${admin.email}, ${mike.email}, ${lisa.email}, ${james.email}`)
  console.log(`✓ Created ${await db.ticket.count()} tickets`)
  console.log("\nLogin credentials:")
  console.log("  Admin:  admin@helpdesk.io / admin123")
  console.log("  Agent:  mike@helpdesk.io / agent123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
