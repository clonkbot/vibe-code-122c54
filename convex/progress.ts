import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's progress
export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Mark lesson as complete
export const completeLesson = mutation({
  args: {
    courseId: v.id("courses"),
    userCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already completed
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", args.courseId)
      )
      .first();

    const course = await ctx.db.get(args.courseId);
    const user = await ctx.db.get(userId);

    if (existing) {
      // Update existing progress
      await ctx.db.patch(existing._id, {
        completed: true,
        userCode: args.userCode,
        completedAt: Date.now(),
      });
    } else {
      // Create new progress entry
      await ctx.db.insert("progress", {
        userId,
        courseId: args.courseId,
        completed: true,
        userCode: args.userCode,
        completedAt: Date.now(),
      });

      // Log activity
      await ctx.db.insert("activity", {
        userId,
        userName: user?.email?.split("@")[0] || "Vibe Coder",
        action: "completed_lesson",
        lessonTitle: course?.title,
        createdAt: Date.now(),
      });
    }

    // Check for achievements
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const earnedTypes = new Set(achievements.map(a => a.type));

    // First lesson achievement
    if (allProgress.length === 1 && !earnedTypes.has("first_lesson")) {
      await ctx.db.insert("achievements", {
        userId,
        type: "first_lesson",
        earnedAt: Date.now(),
      });
      await ctx.db.insert("activity", {
        userId,
        userName: user?.email?.split("@")[0] || "Vibe Coder",
        action: "earned_badge",
        lessonTitle: "First Steps",
        createdAt: Date.now(),
      });
    }

    // Three lessons achievement
    if (allProgress.length === 3 && !earnedTypes.has("three_lessons")) {
      await ctx.db.insert("achievements", {
        userId,
        type: "three_lessons",
        earnedAt: Date.now(),
      });
    }

    // All lessons achievement
    const totalCourses = await ctx.db.query("courses").collect();
    if (allProgress.length === totalCourses.length && !earnedTypes.has("all_complete")) {
      await ctx.db.insert("achievements", {
        userId,
        type: "all_complete",
        earnedAt: Date.now(),
      });
      await ctx.db.insert("activity", {
        userId,
        userName: user?.email?.split("@")[0] || "Vibe Coder",
        action: "earned_badge",
        lessonTitle: "Vibe Master",
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get user achievements
export const getAchievements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Get recent activity feed
export const getActivity = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("activity")
      .withIndex("by_time")
      .order("desc")
      .take(10);
  },
});
