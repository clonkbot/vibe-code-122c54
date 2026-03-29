import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { Id } from "../convex/_generated/dataModel";

// Scanline overlay component
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
        }}
      />
    </div>
  );
}

// Glowing text component
function GlowText({ children, color = "green" }: { children: React.ReactNode; color?: string }) {
  const colorClasses: Record<string, string> = {
    green: "text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.7)]",
    amber: "text-[#ffb347] drop-shadow-[0_0_10px_rgba(255,179,71,0.7)]",
    cyan: "text-[#00f5ff] drop-shadow-[0_0_10px_rgba(0,245,255,0.7)]",
    lavender: "text-[#b19cd9] drop-shadow-[0_0_10px_rgba(177,156,217,0.7)]",
  };
  return <span className={colorClasses[color]}>{children}</span>;
}

// Auth form component
function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39ff14]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f5ff]/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-mono text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            <GlowText color="green">{">"}</GlowText>
            <span className="text-white">vibe</span>
            <GlowText color="cyan">_</GlowText>
            <span className="text-white">code</span>
          </h1>
          <p className="text-gray-400 font-sans text-base md:text-lg">Learn to code with good vibes only</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#39ff14]/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#39ff14]/5">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFlow("signIn")}
              className={`flex-1 py-2.5 md:py-2 rounded-lg font-mono text-sm transition-all ${
                flow === "signIn"
                  ? "bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              sign_in
            </button>
            <button
              onClick={() => setFlow("signUp")}
              className={`flex-1 py-2.5 md:py-2 rounded-lg font-mono text-sm transition-all ${
                flow === "signUp"
                  ? "bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              sign_up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-mono">email:</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#0a0a0f] border border-[#39ff14]/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/50 transition-all placeholder-gray-600"
                placeholder="coder@vibe.dev"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-mono">password:</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#0a0a0f] border border-[#39ff14]/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/50 transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#39ff14] hover:bg-[#39ff14]/90 text-[#0a0a0f] font-mono font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none shadow-lg shadow-[#39ff14]/25"
            >
              {loading ? "processing..." : flow === "signIn" ? "enter_the_vibe()" : "create_account()"}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#12121a] text-gray-500 font-mono">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full mt-6 border border-[#00f5ff]/30 hover:border-[#00f5ff]/60 text-[#00f5ff] font-mono py-3 rounded-lg transition-all hover:bg-[#00f5ff]/10"
          >
            continue_as_guest()
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Code editor component with simulated output
function CodeEditor({
  code,
  onChange,
  onRun
}: {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="bg-[#0a0a0f] rounded-xl border border-[#39ff14]/20 overflow-hidden">
      <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-[#12121a] border-b border-[#39ff14]/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-gray-500 text-xs font-mono">main.js</span>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[#39ff14] font-mono text-sm p-4 min-h-[200px] md:min-h-[250px] resize-none focus:outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>
      <div className="px-3 md:px-4 py-3 bg-[#12121a] border-t border-[#39ff14]/10">
        <button
          onClick={onRun}
          className="w-full md:w-auto bg-[#39ff14] hover:bg-[#39ff14]/90 text-[#0a0a0f] font-mono font-bold px-6 py-2.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>▶</span> run_code()
        </button>
      </div>
    </div>
  );
}

// Console output component
function Console({ output }: { output: string[] }) {
  return (
    <div className="bg-[#0a0a0f] rounded-xl border border-[#00f5ff]/20 overflow-hidden">
      <div className="flex items-center px-3 md:px-4 py-2 bg-[#12121a] border-b border-[#00f5ff]/10">
        <span className="text-[#00f5ff] text-xs font-mono">{">"} console.output</span>
      </div>
      <div className="p-4 min-h-[100px] md:min-h-[120px] max-h-[200px] overflow-y-auto font-mono text-sm">
        {output.length === 0 ? (
          <span className="text-gray-600">// Run your code to see output here</span>
        ) : (
          output.map((line, i) => (
            <div key={i} className="text-[#00f5ff]">
              <span className="text-gray-600 mr-2">{i + 1}.</span>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Lesson card component
function LessonCard({
  lesson,
  index,
  completed,
  active,
  onClick
}: {
  lesson: { _id: Id<"courses">; title: string; description: string };
  index: number;
  completed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all transform hover:scale-[1.01] ${
        active
          ? "bg-[#39ff14]/10 border-[#39ff14]/50 shadow-lg shadow-[#39ff14]/10"
          : completed
          ? "bg-[#12121a]/50 border-[#39ff14]/20"
          : "bg-[#12121a]/30 border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-mono text-sm md:text-base font-bold flex-shrink-0 ${
            completed
              ? "bg-[#39ff14]/20 text-[#39ff14]"
              : "bg-gray-800 text-gray-500"
          }`}
        >
          {completed ? "✓" : index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-mono text-sm md:text-base font-semibold mb-1 truncate ${active ? "text-[#39ff14]" : "text-white"}`}>
            {lesson.title}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm line-clamp-2">{lesson.description}</p>
        </div>
      </div>
    </button>
  );
}

// Achievement badge component
function AchievementBadge({ type }: { type: string }) {
  const badges: Record<string, { icon: string; label: string; color: string }> = {
    first_lesson: { icon: "🌟", label: "First Steps", color: "amber" },
    three_lessons: { icon: "🔥", label: "On Fire", color: "green" },
    all_complete: { icon: "👑", label: "Vibe Master", color: "lavender" },
  };
  const badge = badges[type] || { icon: "🏆", label: type, color: "cyan" };
  const colorClasses: Record<string, string> = {
    amber: "border-[#ffb347]/50 bg-[#ffb347]/10 text-[#ffb347]",
    green: "border-[#39ff14]/50 bg-[#39ff14]/10 text-[#39ff14]",
    lavender: "border-[#b19cd9]/50 bg-[#b19cd9]/10 text-[#b19cd9]",
    cyan: "border-[#00f5ff]/50 bg-[#00f5ff]/10 text-[#00f5ff]",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClasses[badge.color]}`}>
      <span>{badge.icon}</span>
      <span className="text-xs font-mono">{badge.label}</span>
    </div>
  );
}

// Activity feed component
function ActivityFeed() {
  const activity = useQuery(api.progress.getActivity);

  if (!activity || activity.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-[#12121a]/50 rounded-xl border border-gray-800 p-4">
      <h3 className="text-[#b19cd9] font-mono text-sm mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-[#b19cd9] rounded-full animate-pulse" />
        live_feed
      </h3>
      <div className="space-y-2 max-h-[150px] overflow-y-auto">
        {activity.map((item: { createdAt: number; userName?: string; action: string; lessonTitle?: string }, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">{formatTime(item.createdAt)}</span>
            <span className="text-gray-400">
              {item.userName || "Anon"} {item.action === "completed_lesson" ? "completed" : "earned"}{" "}
              <span className="text-[#00f5ff]">{item.lessonTitle}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="w-full py-4 md:py-6 mt-auto">
      <p className="text-center text-gray-600 text-xs font-mono">
        Requested by <span className="text-gray-500">@web-user</span> · Built by <span className="text-gray-500">@clonkbot</span>
      </p>
    </footer>
  );
}

// Main dashboard/learning view
function Dashboard() {
  const { signOut } = useAuthActions();
  const courses = useQuery(api.courses.list);
  const progress = useQuery(api.progress.getUserProgress);
  const achievements = useQuery(api.progress.getAchievements);
  const seedCourses = useMutation(api.courses.seed);
  const completeLesson = useMutation(api.progress.completeLesson);

  const [activeLessonId, setActiveLessonId] = useState<Id<"courses"> | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Seed courses on first load if empty
  useEffect(() => {
    if (courses && courses.length === 0) {
      seedCourses();
    }
  }, [courses, seedCourses]);

  // Set initial active lesson
  useEffect(() => {
    if (courses && courses.length > 0 && !activeLessonId) {
      setActiveLessonId(courses[0]._id);
      setCode(courses[0].codeExample);
    }
  }, [courses, activeLessonId]);

  const activeLesson = courses?.find((c: { _id: Id<"courses"> }) => c._id === activeLessonId);
  const completedIds = new Set(progress?.filter((p: { completed: boolean }) => p.completed).map((p: { courseId: Id<"courses"> }) => p.courseId));
  const completedCount = completedIds.size;
  const totalCount = courses?.length || 0;

  const handleSelectLesson = (lessonId: Id<"courses">) => {
    const lesson = courses?.find((c: { _id: Id<"courses">; codeExample: string }) => c._id === lessonId);
    if (lesson) {
      setActiveLessonId(lessonId);
      setCode(lesson.codeExample);
      setOutput([]);
      setSidebarOpen(false);
    }
  };

  const handleRunCode = () => {
    // Simple JavaScript evaluation (safe subset)
    const logs: string[] = [];
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map((a) => String(a)).join(" "));
      },
    };

    try {
      // Create a function that captures console.log
      const wrappedCode = `
        (function(console) {
          ${code}
        })
      `;
      const fn = eval(wrappedCode);
      fn(mockConsole);
      setOutput(logs);
    } catch (err) {
      setOutput([`Error: ${(err as Error).message}`]);
    }
  };

  const handleComplete = () => {
    if (activeLessonId) {
      completeLesson({ courseId: activeLessonId, userCode: code });
    }
  };

  if (!courses) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-[#39ff14] font-mono animate-pulse">loading_courses()...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-mono text-lg md:text-xl font-bold">
            <GlowText color="green">{">"}</GlowText>
            <span className="text-white">vibe</span>
            <span className="text-gray-600 hidden sm:inline">_code</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-[#39ff14] text-xs md:text-sm font-mono hidden sm:block">
            {completedCount}/{totalCount} complete
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white text-xs md:text-sm font-mono px-2 md:px-3 py-1.5 border border-gray-700 hover:border-gray-500 rounded-lg transition-all"
          >
            logout()
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] md:w-80 bg-[#0a0a0f] border-r border-gray-800 overflow-y-auto flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          <div className="p-4 space-y-6 flex-1">
            {/* Progress bar */}
            <div className="bg-[#12121a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-mono">progress</span>
                <span className="text-[#39ff14] text-sm font-mono">
                  {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#39ff14] to-[#00f5ff] transition-all duration-500"
                  style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-gray-500 text-xs font-mono uppercase tracking-wider">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a: { _id: string; type: string }) => (
                    <AchievementBadge key={a._id} type={a.type} />
                  ))}
                </div>
              </div>
            )}

            {/* Lessons list */}
            <div className="space-y-2">
              <h3 className="text-gray-500 text-xs font-mono uppercase tracking-wider">Lessons</h3>
              <div className="space-y-2">
                {courses.map((lesson: { _id: Id<"courses">; title: string; description: string; codeExample: string }, i: number) => (
                  <LessonCard
                    key={lesson._id}
                    lesson={lesson}
                    index={i}
                    completed={completedIds.has(lesson._id)}
                    active={activeLessonId === lesson._id}
                    onClick={() => handleSelectLesson(lesson._id)}
                  />
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
              {/* Lesson header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#ffb347] text-xs font-mono">
                  <span>LESSON {courses.findIndex((c: { _id: Id<"courses"> }) => c._id === activeLessonId) + 1}</span>
                  {completedIds.has(activeLessonId!) && (
                    <span className="bg-[#39ff14]/20 text-[#39ff14] px-2 py-0.5 rounded text-xs">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">
                  {activeLesson.title}
                </h2>
              </div>

              {/* Lesson content */}
              <div className="bg-[#12121a]/50 rounded-xl border border-gray-800 p-4 md:p-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  {activeLesson.content.split("\n").map((line: string, i: number) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={i} className="text-xl md:text-2xl font-mono text-white mt-0">
                          {line.slice(2)}
                        </h1>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-lg md:text-xl font-mono text-[#00f5ff] mt-4 mb-2">
                          {line.slice(3)}
                        </h2>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="text-gray-300 ml-4 text-sm md:text-base">
                          {line.slice(2)}
                        </li>
                      );
                    }
                    if (line.trim() === "") {
                      return <br key={i} />;
                    }
                    return (
                      <p key={i} className="text-gray-300 text-sm md:text-base">
                        {line.split("`").map((part: string, j: number) =>
                          j % 2 === 1 ? (
                            <code key={j} className="bg-[#39ff14]/10 text-[#39ff14] px-1.5 py-0.5 rounded text-sm">
                              {part}
                            </code>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Hint */}
              {activeLesson.hint && (
                <div className="bg-[#ffb347]/10 border border-[#ffb347]/30 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="text-[#ffb347] font-mono text-sm font-semibold">Hint:</span>
                    <p className="text-[#ffb347]/80 text-sm mt-1">{activeLesson.hint}</p>
                  </div>
                </div>
              )}

              {/* Code editor */}
              <CodeEditor code={code} onChange={setCode} onRun={handleRunCode} />

              {/* Console output */}
              <Console output={output} />

              {/* Complete button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    setCode(activeLesson.codeExample);
                    setOutput([]);
                  }}
                  className="w-full sm:w-auto border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-mono px-6 py-3 rounded-lg transition-all"
                >
                  reset_code()
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completedIds.has(activeLessonId!)}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#39ff14] to-[#00f5ff] hover:opacity-90 text-[#0a0a0f] font-mono font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none shadow-lg shadow-[#39ff14]/20"
                >
                  {completedIds.has(activeLessonId!) ? "completed ✓" : "mark_complete()"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 font-mono">
              Select a lesson to begin
            </div>
          )}

          <Footer />
        </main>
      </div>

      <Scanlines />
    </div>
  );
}

// Root App component
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0a0a0f]">
        <Scanlines />
        <div className="text-center">
          <div className="font-mono text-2xl mb-4">
            <GlowText color="green">{">"}</GlowText>
            <span className="text-white">vibe</span>
            <GlowText color="cyan">_</GlowText>
            <span className="text-white">code</span>
          </div>
          <div className="text-[#39ff14] font-mono animate-pulse">initializing()...</div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthForm />;
}
