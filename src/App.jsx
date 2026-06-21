import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, TrendingUp, Flame, Award, Code2, Boxes, Network, Coffee, ChevronLeft, ChevronRight, ArrowLeft, Search, X, BarChart3, LayoutGrid, Repeat, Mic, NotebookPen, CalendarDays } from "lucide-react";

// ---------- Study plan data (condensed: 2 weeks sample, easy to extend) ----------
const TOPICS = {
  dsa: [
    { topic: "Arrays & Hashing", problems: ["Two Sum", "Product Except Self", "Top K Frequent"] },
    { topic: "Two Pointers", problems: ["Valid Palindrome", "3Sum", "Container With Most Water"] },
    { topic: "Sliding Window", problems: ["Longest Substring w/o Repeat", "Min Window Substring"] },
    { topic: "Stack", problems: ["Valid Parentheses", "Daily Temperatures"] },
    { topic: "Binary Search", problems: ["Search Rotated Array", "Koko Eating Bananas"] },
  ],
  lld: [
    "SOLID Principles", "Factory Pattern", "Observer Pattern", "Strategy Pattern", "Builder Pattern",
    "Parking Lot System", "Elevator System", "Vending Machine", "Library System", "Splitwise",
    "ATM System", "BookMyShow", "Food Delivery App", "Chess Game", "Meeting Scheduler",
  ],
  hld: [
    "Scalability Basics", "Load Balancers", "Caching", "Database Basics", "CAP Theorem",
    "Replication", "Partitioning", "Kafka & Messaging", "URL Shortener", "Rate Limiter",
    "Notification System", "Chat System", "News Feed", "Uber Design", "Payment Gateway",
  ],
  java: [
    { topic: "HashMap Internals", items: ["Bucket collisions", "Resize & load factor"] },
    { topic: "Collections Framework", items: ["List vs Set vs Map", "Comparable vs Comparator"] },
    { topic: "JVM & GC", items: ["Memory areas", "Generational GC"] },
    { topic: "Threads & Locks", items: ["Executor framework", "synchronized vs ReentrantLock"] },
    { topic: "CompletableFuture", items: ["thenApply/thenCompose", "Exception handling"] },
    { topic: "Spring Core", items: ["IoC & bean lifecycle", "Dependency injection"] },
  ],
  go: [
    { topic: "Goroutines & Channels", items: ["Buffered vs unbuffered", "select statement"] },
    { topic: "Slices & Maps", items: ["Slice header internals", "Append growth"] },
    { topic: "Go Scheduler", items: ["GMP model", "Work stealing"] },
    { topic: "Interfaces", items: ["Implicit satisfaction", "nil interface gotcha"] },
    { topic: "Context Package", items: ["Cancellation propagation", "WithTimeout"] },
  ],
};

function buildDays(startISO, count) {
  const start = new Date(startISO + "T00:00:00Z");
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const id = date.toISOString().slice(0, 10);
    const dsa = TOPICS.dsa[i % TOPICS.dsa.length];
    const java = TOPICS.java[i % TOPICS.java.length];
    const go = TOPICS.go[i % TOPICS.go.length];
    const useJava = i % 2 === 0;
    days.push({
      id,
      weekNumber: Math.floor(i / 7) + 1,
      isRevision: i % 7 === 6,
      dsa: {
        topic: dsa.topic,
        problems: dsa.problems.map((p, j) => ({ id: `${id}-dsa-${j}`, label: p })),
      },
      lld: {
        topic: TOPICS.lld[i % TOPICS.lld.length],
        checklist: ["Read core concept", "Sketch class diagram"].map((l, j) => ({ id: `${id}-lld-${j}`, label: l })),
      },
      hld: {
        topic: TOPICS.hld[i % TOPICS.hld.length],
        checklist: ["Read core concept", "Draw architecture"].map((l, j) => ({ id: `${id}-hld-${j}`, label: l })),
      },
      lang: useJava
        ? { name: "Java", topic: java.topic, checklist: java.items.map((l, j) => ({ id: `${id}-java-${j}`, label: l })) }
        : { name: "Go", topic: go.topic, checklist: go.items.map((l, j) => ({ id: `${id}-go-${j}`, label: l })) },
    });
  }
  return days;
}

function daysBetween(startISO, endISO) {
  const start = new Date(startISO + "T00:00:00Z");
  const end = new Date(endISO + "T00:00:00Z");
  return Math.round((end - start) / 86400000) + 1;
}

const START_DATE = "2026-06-20";
const END_DATE = "2026-08-31";
const TOTAL_DAYS = daysBetween(START_DATE, END_DATE);
const ALL_DAYS = buildDays(START_DATE, TOTAL_DAYS).map((d, i) => {
  const weeksFromEnd = Math.floor((TOTAL_DAYS - 1 - i) / 7);
  const isMockWeek = weeksFromEnd < 2;
  const dayOfWeekIndex = i % 7;
  return { ...d, isMock: isMockWeek && (dayOfWeekIndex === 1 || dayOfWeekIndex === 4) };
});

const CATEGORY_DEFS = [
  { key: "dsa", label: "DSA", color: "#f0a92e" },
  { key: "lld", label: "LLD", color: "#3fd6a3" },
  { key: "hld", label: "HLD", color: "#ec5b46" },
  { key: "lang", label: "Java / Go", color: "#f0a92e" },
];

function categoryItemIds(day, key) {
  if (key === "dsa") return day.dsa.problems.map((p) => p.id);
  if (key === "lld") return day.lld.checklist.map((p) => p.id);
  if (key === "hld") return day.hld.checklist.map((p) => p.id);
  if (key === "lang") return day.lang.checklist.map((p) => p.id);
  return [];
}

function buildSearchIndex() {
  const hits = [];
  for (const day of ALL_DAYS) {
    hits.push({ dayId: day.id, category: "DSA", label: day.dsa.topic });
    day.dsa.problems.forEach((p) => hits.push({ dayId: day.id, category: "DSA Problem", label: p.label }));
    hits.push({ dayId: day.id, category: "LLD", label: day.lld.topic });
    hits.push({ dayId: day.id, category: "HLD", label: day.hld.topic });
    hits.push({ dayId: day.id, category: day.lang.name, label: day.lang.topic });
  }
  return hits;
}
const SEARCH_INDEX = buildSearchIndex();

function allItemIds(day) {
  return [
    ...day.dsa.problems.map((p) => p.id),
    ...day.lld.checklist.map((p) => p.id),
    ...day.hld.checklist.map((p) => p.id),
    ...day.lang.checklist.map((p) => p.id),
  ];
}

function fmtShort(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
function fmtLong(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
}

// ---------- UI bits ----------
function ProgressBar({ percent, color = "#f0a92e" }) {
  return (
    <div style={{ width: "100%", height: 8, borderRadius: 999, background: "#181f28", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, percent)}%`, height: "100%", background: color, transition: "width .4s ease" }} />
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#6b7a8d", fontWeight: 600 }}>{label}</span>
        <span style={{ background: color + "22", padding: 6, borderRadius: 8, display: "flex" }}>
          <Icon size={15} color={color} />
        </span>
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "monospace", color: "#e7ebf0" }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "#6b7a8d" }}>{sub}</span>}
    </div>
  );
}

function ChecklistRow({ item, done, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left",
        background: "transparent", border: "none", cursor: "pointer", padding: "6px 4px", borderRadius: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#181f2880")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{
        marginTop: 2, height: 16, width: 16, flexShrink: 0, borderRadius: 4,
        border: done ? "1px solid #22c08a" : "1px solid #2e3947", background: done ? "#22c08a" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done && <CheckCircle2 size={11} color="#0a0d12" />}
      </span>
      <span style={{ fontSize: 14, color: done ? "#475568" : "#e7ebf0", textDecoration: done ? "line-through" : "none" }}>{item.label}</span>
    </button>
  );
}

function SectionCard({ icon: Icon, title, color, children }) {
  return (
    <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ background: color + "22", padding: 6, borderRadius: 8, display: "flex" }}>
          <Icon size={15} color={color} />
        </span>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e7ebf0", margin: 0 }}>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ---------- Pages ----------
function Dashboard({ completedIds, onOpenDay }) {
  const completion = (day) => {
    const ids = allItemIds(day);
    const done = ids.filter((id) => completedIds.has(id)).length;
    return { done, total: ids.length, percent: ids.length ? Math.round((done / ids.length) * 100) : 0, isComplete: done === ids.length };
  };
  const allC = ALL_DAYS.map(completion);
  const daysCompleted = allC.filter((c) => c.isComplete).length;
  const completionPct = Math.round((daysCompleted / ALL_DAYS.length) * 100);

  let currentStreak = 0;
  for (let i = allC.length - 1; i >= 0; i--) {
    if (allC[i].isComplete) currentStreak++;
    else break;
  }
  let longestStreak = 0, running = 0;
  for (const c of allC) {
    running = c.isComplete ? running + 1 : 0;
    longestStreak = Math.max(longestStreak, running);
  }

  const categoryStats = CATEGORY_DEFS.map((cat) => {
    let total = 0, done = 0;
    for (const day of ALL_DAYS) {
      const ids = categoryItemIds(day, cat.key);
      total += ids.length;
      done += ids.filter((id) => completedIds.has(id)).length;
    }
    return { ...cat, total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  });

  const weeks = useMemo(() => {
    const map = {};
    ALL_DAYS.forEach((d) => { (map[d.weekNumber] ||= []).push(d); });
    return Object.entries(map);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Overall progress</h1>
        <p style={{ color: "#6b7a8d", fontSize: 13, margin: "0 0 16px" }}>Jun 20 → Aug 31, 2026 · {ALL_DAYS.length} days</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
          <StatCard label="Days Completed" value={daysCompleted} sub={`of ${ALL_DAYS.length}`} icon={CheckCircle2} color="#3fd6a3" />
          <StatCard label="Days Remaining" value={ALL_DAYS.length - daysCompleted} icon={Clock} color="#f0a92e" />
          <StatCard label="Completion" value={`${completionPct}%`} icon={TrendingUp} color="#f0a92e" />
          <StatCard label="Current Streak" value={currentStreak} sub="days" icon={Flame} color="#ec5b46" />
          <StatCard label="Longest Streak" value={longestStreak} sub="personal best" icon={Award} color="#3fd6a3" />
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Progress by category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
          {categoryStats.map((c) => (
            <div key={c.key} style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{c.label}</span>
                <span style={{ fontFamily: "monospace", color: "#6b7a8d" }}>{c.percent}%</span>
              </div>
              <ProgressBar percent={c.percent} color={c.color} />
              <span style={{ fontSize: 11, color: "#6b7a8d", fontFamily: "monospace" }}>{c.done} / {c.total} tasks</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Weeks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
          {weeks.map(([wn, days]) => {
            const ids = days.flatMap(allItemIds);
            const done = ids.filter((id) => completedIds.has(id)).length;
            const pct = Math.round((done / ids.length) * 100);
            const completedDays = days.filter((d) => completion(d).isComplete).length;
            const isMockWeek = days.some((d) => d.isMock);
            return (
              <div key={wn} style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>Week {wn}</span>
                  {isMockWeek && <span style={{ fontSize: 9, textTransform: "uppercase", color: "#ec5b46", fontWeight: 700 }}>Mock</span>}
                </div>
                <span style={{ fontSize: 12, color: "#6b7a8d" }}>{fmtShort(days[0].id)} – {fmtShort(days[days.length - 1].id)}</span>
                <ProgressBar percent={pct} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7a8d", fontFamily: "monospace" }}>
                  <span>{pct}%</span>
                  <span>{completedDays}/{days.length} days</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {days.map((d) => {
                    const c = completion(d);
                    const bg = c.isComplete ? "#22c08a33" : c.percent > 0 ? "#f0a92e22" : "#181f28";
                    const border = d.isMock ? "1px solid #ec5b4666" : d.isRevision ? "1px solid #3fd6a366" : "1px solid #222b36";
                    return (
                      <button key={d.id} onClick={() => onOpenDay(d.id)} title={d.isRevision ? "Revision Day" : d.isMock ? "Mock Interview" : undefined}
                        style={{
                          width: 28, height: 28, borderRadius: 6, fontSize: 10, fontFamily: "monospace",
                          border, cursor: "pointer", background: bg, color: "#c2cbd6",
                        }}>
                        {new Date(d.id + "T00:00:00Z").getUTCDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayView({ dayId, completedIds, toggle, notes, setNote, onBack }) {
  const idx = ALL_DAYS.findIndex((d) => d.id === dayId);
  const day = ALL_DAYS[idx];
  const [draft, setDraft] = useState(notes[dayId] || "");
  useEffect(() => setDraft(notes[dayId] || ""), [dayId]); // eslint-disable-line

  if (!day) return null;
  const ids = allItemIds(day);
  const done = ids.filter((id) => completedIds.has(id)).length;
  const pct = Math.round((done / ids.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => onBack()} style={{ background: "none", border: "none", color: "#6b7a8d", display: "flex", gap: 6, alignItems: "center", cursor: "pointer", fontSize: 13 }}>
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <button disabled={idx === 0} onClick={() => onBack(ALL_DAYS[idx - 1]?.id)} style={navBtn}><ChevronLeft size={14} /></button>
          <button disabled={idx === ALL_DAYS.length - 1} onClick={() => onBack(ALL_DAYS[idx + 1]?.id)} style={navBtn}><ChevronRight size={14} /></button>
        </div>
      </div>

      <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{fmtLong(day.id)}</h1>
          <div style={{ display: "flex", gap: 6 }}>
            {day.isRevision && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#3fd6a3", background: "#3fd6a31a", padding: "3px 8px", borderRadius: 999, textTransform: "uppercase", fontWeight: 700 }}>
                <Repeat size={10} /> Revision Day
              </span>
            )}
            {day.isMock && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#ec5b46", background: "#ec5b461a", padding: "3px 8px", borderRadius: 999, textTransform: "uppercase", fontWeight: 700 }}>
                <Mic size={10} /> Mock Interview
              </span>
            )}
          </div>
        </div>
        <div style={{ marginTop: 10 }}><ProgressBar percent={pct} /></div>
        <p style={{ fontSize: 12, color: "#6b7a8d", marginTop: 8 }}>{pct}% · {done}/{ids.length} tasks</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 14 }}>
        <SectionCard icon={Code2} title={`DSA — ${day.dsa.topic}`} color="#f0a92e">
          {day.dsa.problems.map((p) => (
            <ChecklistRow key={p.id} item={p} done={completedIds.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </SectionCard>
        <SectionCard icon={Boxes} title={`LLD — ${day.lld.topic}`} color="#3fd6a3">
          {day.lld.checklist.map((p) => (
            <ChecklistRow key={p.id} item={p} done={completedIds.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </SectionCard>
        <SectionCard icon={Network} title={`HLD — ${day.hld.topic}`} color="#ec5b46">
          {day.hld.checklist.map((p) => (
            <ChecklistRow key={p.id} item={p} done={completedIds.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </SectionCard>
        <SectionCard icon={Coffee} title={`${day.lang.name} — ${day.lang.topic}`} color="#f0a92e">
          {day.lang.checklist.map((p) => (
            <ChecklistRow key={p.id} item={p} done={completedIds.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </SectionCard>
      </div>

      <SectionCard icon={NotebookPen} title="Personal Notes" color="#f0a92e">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => setNote(day.id, draft)}
          placeholder="Mistakes, learnings, interview insights…"
          rows={5}
          style={{ width: "100%", background: "#0f1318", border: "1px solid #222b36", borderRadius: 10, padding: 10, color: "#e7ebf0", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }}
        />
      </SectionCard>
    </div>
  );
}

function heatColor(percent) {
  if (percent === 0) return "#181f28";
  if (percent < 25) return "#3a2c12";
  if (percent < 50) return "#6e4d14";
  if (percent < 75) return "#b07a16";
  if (percent < 100) return "#d6890f";
  return "#22c08a";
}

function Analytics({ completedIds, onOpenDay }) {
  const completion = (day) => {
    const ids = allItemIds(day);
    const done = ids.filter((id) => completedIds.has(id)).length;
    return { day, done, total: ids.length, percent: ids.length ? Math.round((done / ids.length) * 100) : 0, isComplete: done === ids.length };
  };
  const allC = ALL_DAYS.map(completion);

  const categoryStats = CATEGORY_DEFS.map((cat) => {
    let total = 0, done = 0;
    for (const day of ALL_DAYS) {
      const ids = categoryItemIds(day, cat.key);
      total += ids.length;
      done += ids.filter((id) => completedIds.has(id)).length;
    }
    return { ...cat, percent: total ? Math.round((done / total) * 100) : 0, done, total };
  });

  const weeks = useMemo(() => {
    const map = {};
    ALL_DAYS.forEach((d) => { (map[d.weekNumber] ||= []).push(d); });
    return Object.entries(map);
  }, []);

  const weeklyTrend = weeks.map(([wn, days]) => {
    const ids = days.flatMap(allItemIds);
    const done = ids.filter((id) => completedIds.has(id)).length;
    return { wn, percent: ids.length ? Math.round((done / ids.length) * 100) : 0 };
  });

  const today = new Date().toISOString().slice(0, 10);
  const missed = allC.filter((c) => c.day.id <= today && !c.isComplete && c.total > 0).slice(0, 24);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Analytics</h1>
        <p style={{ color: "#6b7a8d", fontSize: 13 }}>Where the prep is paying off — and where it isn't yet.</p>
      </div>

      <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Completion heatmap</h2>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
          {weeks.map(([wn, days]) => (
            <div key={wn} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {days.map((d) => {
                const c = completion(d);
                return (
                  <div key={d.id} onClick={() => onOpenDay(d.id)} title={`${d.id} — ${c.percent}%`}
                    style={{ height: 14, width: 14, borderRadius: 3, background: heatColor(c.percent), cursor: "pointer" }} />
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11, color: "#6b7a8d" }}>
          <span>Less</span>
          {[0, 20, 50, 80, 100].map((p) => (
            <span key={p} style={{ height: 12, width: 12, borderRadius: 3, background: heatColor(p) }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 18 }}>
        <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>Category performance</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categoryStats.map((c) => (
              <div key={c.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{c.label}</span>
                  <span style={{ fontFamily: "monospace", color: "#6b7a8d" }}>{c.percent}% ({c.done}/{c.total})</span>
                </div>
                <ProgressBar percent={c.percent} color={c.color} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px" }}>Weekly completion trend</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
            {weeklyTrend.map(({ wn, percent }) => (
              <div key={wn} title={`Week ${wn}: ${percent}%`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: 120, display: "flex", alignItems: "flex-end" }}>
                  <div style={{ width: "100%", height: `${Math.max(4, percent)}%`, background: "#3fd6a3", borderRadius: "4px 4px 0 0" }} />
                </div>
                <span style={{ fontSize: 9, color: "#6b7a8d", fontFamily: "monospace" }}>W{wn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#13181f", border: "1px solid #222b36", borderRadius: 16, padding: 18 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Missed topics ({missed.length})</h2>
        {missed.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6b7a8d" }}>Nothing missed so far — every past day is fully checked off. 🎉</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 8 }}>
            {missed.map((c) => (
              <button key={c.day.id} onClick={() => onOpenDay(c.day.id)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, border: "1px solid #222b36", borderRadius: 10, padding: "8px 10px", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e7ebf0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.day.dsa.topic}</div>
                  <div style={{ fontSize: 11, color: "#6b7a8d", fontFamily: "monospace" }}>{fmtShort(c.day.id)}</div>
                </div>
                <span style={{ fontSize: 12, color: "#ec5b46", fontFamily: "monospace" }}>{c.percent}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchBar({ onOpenDay }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((h) => h.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 320 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #222b36", background: "#0f1318", borderRadius: 8, padding: "7px 10px" }}>
        <Search size={14} color="#6b7a8d" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search topics, problems…"
          style={{ background: "transparent", border: "none", outline: "none", color: "#e7ebf0", fontSize: 13, width: "100%" }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <X size={13} color="#6b7a8d" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#13181f", border: "1px solid #222b36", borderRadius: 10, overflow: "hidden", zIndex: 50, maxHeight: 280, overflowY: "auto" }}>
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={() => { onOpenDay(r.dayId); setQuery(""); setOpen(false); }}
              style={{ display: "flex", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "8px 10px", background: "transparent", border: "none", borderBottom: "1px solid #181f28", cursor: "pointer" }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#e7ebf0" }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "#6b7a8d" }}>{r.category}</div>
              </div>
              <span style={{ fontSize: 11, color: "#6b7a8d", fontFamily: "monospace" }}>{fmtShort(r.dayId)}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length >= 2 && results.length === 0 && (
        <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#13181f", border: "1px solid #222b36", borderRadius: 10, padding: 12, fontSize: 12, color: "#6b7a8d", zIndex: 50 }}>
          No matches for "{query}"
        </div>
      )}
    </div>
  );
}

const navBtn = { background: "none", border: "1px solid #222b36", borderRadius: 8, color: "#c2cbd6", padding: 6, cursor: "pointer" };

const STORAGE_KEY = "interview-prep-tracker:v1";
const NOTES_KEY = "interview-prep-tracker:notes:v1";

function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

// ---------- Root App ----------
export default function App() {
  const [completedIds, setCompletedIds] = useState(() => loadCompleted());
  const [notes, setNotes] = useState(() => loadNotes());
  const [view, setView] = useState({ page: "dashboard", dayId: null });

  function toggle(id) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // localStorage unavailable — progress just won't persist
      }
      return next;
    });
  }

  function setNote(dayId, text) {
    setNotes((prev) => {
      const next = { ...prev, [dayId]: text };
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — notes just won't persist
      }
      return next;
    });
  }

  function openDay(id) {
    if (id) setView({ page: "day", dayId: id });
  }

  function goToday() {
    const today = new Date().toISOString().slice(0, 10);
    const match = ALL_DAYS.find((d) => d.id === today) || ALL_DAYS.find((d) => d.id >= today) || ALL_DAYS[0];
    openDay(match.id);
  }

  const navTab = (page, label, Icon) => (
    <button
      onClick={() => setView({ page, dayId: null })}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8,
        border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
        background: view.page === page ? "#f0a92e1a" : "transparent",
        color: view.page === page ? "#f0a92e" : "#6b7a8d",
      }}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0d12", color: "#e7ebf0", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #181f28", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "#f0a92e22", color: "#f0a92e", borderRadius: 8, padding: 6, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{"</>"}</span>
          <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 13 }}>backend-prep/tracker</span>
        </span>
        <nav style={{ display: "flex", gap: 4 }}>
          {navTab("dashboard", "Dashboard", LayoutGrid)}
          {navTab("analytics", "Analytics", BarChart3)}
        </nav>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <SearchBar onOpenDay={openDay} />
        </div>
        <button onClick={goToday} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, border: "1px solid #222b36", borderRadius: 8, padding: "6px 10px", background: "transparent", color: "#c2cbd6", cursor: "pointer" }}>
          <CalendarDays size={13} /> Today
        </button>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {view.page === "dashboard" && <Dashboard completedIds={completedIds} onOpenDay={openDay} />}
        {view.page === "analytics" && <Analytics completedIds={completedIds} onOpenDay={openDay} />}
        {view.page === "day" && (
          <DayView
            dayId={view.dayId}
            completedIds={completedIds}
            toggle={toggle}
            notes={notes}
            setNote={setNote}
            onBack={(id) => (id ? setView({ page: "day", dayId: id }) : setView({ page: "dashboard", dayId: null }))}
          />
        )}
      </main>
    </div>
  );
}
