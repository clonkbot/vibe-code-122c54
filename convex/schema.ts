import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Courses - predefined lessons
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    order: v.number(),
    content: v.string(), // Markdown content
    codeExample: v.string(),
    expectedOutput: v.optional(v.string()),
    hint: v.optional(v.string()),
  }).index("by_order", ["order"]),

  // User progress tracking
  progress: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    completed: v.boolean(),
    userCode: v.optional(v.string()),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"]),

  // User achievements/badges
  achievements: defineTable({
    userId: v.id("users"),
    type: v.string(), // "first_lesson", "five_streak", "all_complete", etc.
    earnedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Real-time activity feed
  activity: defineTable({
    userId: v.id("users"),
    userName: v.optional(v.string()),
    action: v.string(), // "completed_lesson", "earned_badge", "joined"
    lessonTitle: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_time", ["createdAt"]),
});
