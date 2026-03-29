import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all courses
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

// Get a single course
export const get = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Seed initial courses (run once)
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("courses").first();
    if (existing) return "Already seeded";

    const lessons = [
      {
        order: 1,
        title: "Hello, Vibe Coder!",
        description: "Your first step into the world of vibe coding. Let's print something to the console!",
        content: `# Welcome to Vibe Coding! 🎉

Vibe coding is all about **feeling** the code, not just writing it. Let's start with the classic first program.

## What is console.log?
Think of \`console.log()\` as your way of talking to the computer. Whatever you put inside the parentheses, the computer will show you.

## Your Mission
Change the message to say hello with YOUR name!`,
        codeExample: `// Change the message below!
console.log("Hello, Vibe Coder!");`,
        hint: "Just change the text between the quotes!",
      },
      {
        order: 2,
        title: "Variables: Naming Things",
        description: "Learn to store and remember values with variables. It's like giving nicknames to data!",
        content: `# Variables: Your Data's Home 📦

Variables are like labeled boxes where you store information. In JavaScript, we use \`let\` and \`const\` to create them.

## The Vibe
- \`let\` = "This might change later"
- \`const\` = "This stays the same forever"

## Your Mission
Create a variable for your favorite color and print it!`,
        codeExample: `// Create your variable here
const myName = "Vibe Coder";
let favoriteColor = "neon green";

console.log("Hi, I'm " + myName);
console.log("My favorite color is " + favoriteColor);`,
        hint: "Try changing the values and see what happens!",
      },
      {
        order: 3,
        title: "Functions: Mini Machines",
        description: "Create reusable blocks of code. Functions are like recipes you can use over and over!",
        content: `# Functions: Your Code Recipes 🍳

A function is a mini-program inside your program. You write it once, use it many times!

## The Structure
\`\`\`javascript
function doSomething() {
  // code goes here
}
\`\`\`

## Your Mission
Create a function that greets someone by name!`,
        codeExample: `// Create a greeting function
function greet(name) {
  return "Hey there, " + name + "! 👋";
}

// Test it out!
console.log(greet("Vibe Coder"));
console.log(greet("New Friend"));`,
        hint: "Functions take inputs (parameters) and can return outputs!",
      },
      {
        order: 4,
        title: "Arrays: Party of Values",
        description: "Store multiple items in one place. Arrays are like playlists for your data!",
        content: `# Arrays: Data Playlists 🎵

Arrays let you store multiple values in a single variable. Think of it like a playlist of your favorite songs!

## Array Vibes
- Created with square brackets \`[]\`
- Items separated by commas
- Access items by their position (starting at 0!)

## Your Mission
Create an array of your favorite things and loop through them!`,
        codeExample: `// Create your favorites array
const favorites = ["coding", "music", "coffee", "sunsets"];

// Loop through and print each one
favorites.forEach((item, index) => {
  console.log((index + 1) + ". " + item);
});

console.log("Total favorites: " + favorites.length);`,
        hint: "forEach is a cool way to do something with each item!",
      },
      {
        order: 5,
        title: "Objects: Data with Style",
        description: "Group related data together. Objects are like ID cards for your information!",
        content: `# Objects: Organized Data 🗂️

Objects let you group related information together with descriptive labels (keys).

## Object Structure
\`\`\`javascript
const person = {
  name: "value",
  age: 25
};
\`\`\`

## Your Mission
Create an object that describes YOU as a vibe coder!`,
        codeExample: `// Create your vibe coder profile
const vibeCoder = {
  name: "New Coder",
  level: "Beginner",
  favoriteLanguage: "JavaScript",
  vibeLevel: 100,
  skills: ["enthusiasm", "curiosity", "persistence"]
};

console.log("Profile: " + vibeCoder.name);
console.log("Level: " + vibeCoder.level);
console.log("Vibe Level: " + vibeCoder.vibeLevel + "%");
console.log("Skills: " + vibeCoder.skills.join(", "));`,
        hint: "Use dot notation (object.key) to access values!",
      },
      {
        order: 6,
        title: "Conditionals: Making Decisions",
        description: "Teach your code to make choices. If this, then that!",
        content: `# Conditionals: Code That Thinks 🧠

Conditionals let your code make decisions based on conditions.

## The Pattern
\`\`\`javascript
if (condition) {
  // do this
} else {
  // do that
}
\`\`\`

## Your Mission
Create a vibe checker that responds differently based on the vibe level!`,
        codeExample: `// Vibe checker function
function checkVibe(level) {
  if (level >= 80) {
    return "🔥 IMMACULATE VIBES!";
  } else if (level >= 50) {
    return "😎 Solid vibes, keep going!";
  } else if (level >= 20) {
    return "🌱 Growing vibes, you got this!";
  } else {
    return "☕ Time for a coffee break!";
  }
}

console.log(checkVibe(95));
console.log(checkVibe(60));
console.log(checkVibe(30));
console.log(checkVibe(10));`,
        hint: "Try different numbers and see what happens!",
      },
    ];

    for (const lesson of lessons) {
      await ctx.db.insert("courses", lesson);
    }

    return "Seeded " + lessons.length + " lessons!";
  },
});
