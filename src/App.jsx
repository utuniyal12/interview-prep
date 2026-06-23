import { useState, useEffect, useCallback } from "react";

// ============================================================
// THEME
// ============================================================
const T = {
  bg:       "#0d0d14",
  surface:  "#16161f",
  card:     "#1c1c28",
  border:   "#2a2a3a",
  muted:    "#3a3a4e",
  text:     "#e8e8f0",
  textDim:  "#7070a0",
  textFaint:"#404060",
  indigo:   "#6366f1",
  indigoDim:"rgba(99,102,241,0.15)",
  amber:    "#f59e0b",
  emerald:  "#10b981",
  orange:   "#f97316",
  cyan:     "#06b6d4",
  rose:     "#f43f5e",
  purple:   "#a855f7",
};

const SUBJ = {
  dsa:  { label:"DSA",  color:T.indigo,  bg:"rgba(99,102,241,0.12)",  textColor:"#a5b4fc" },
  lld:  { label:"LLD",  color:T.amber,   bg:"rgba(245,158,11,0.12)",  textColor:"#fcd34d" },
  hld:  { label:"HLD",  color:T.emerald, bg:"rgba(16,185,129,0.12)",  textColor:"#6ee7b7" },
  java: { label:"Java", color:T.orange,  bg:"rgba(249,115,22,0.12)",  textColor:"#fdba74" },
  go:   { label:"Go",   color:T.cyan,    bg:"rgba(6,182,212,0.12)",   textColor:"#67e8f9" },
};

// ============================================================
// STUDY PLAN DATA
// ============================================================
const START_DATE = new Date(2026, 5, 21);
const END_DATE   = new Date(2026, 7, 31);

function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function fmt(date)      { return date.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
function fmtS(date)     { return date.toLocaleDateString("en-IN",{day:"2-digit",month:"short"}); }
function dayName(date)  { return date.toLocaleDateString("en-IN",{weekday:"long"}); }
function isWknd(date)   { const d=date.getDay(); return d===0||d===6; }

const DSA_TOPICS = [
  {topic:"Arrays & Hashing",     tasks:["Contains Duplicate – brute force & hash set","Valid Anagram – sort vs hash map","Two Sum – hash map O(n)"]},
  {topic:"Arrays & Hashing",     tasks:["Group Anagrams – sorted key grouping","Top K Frequent – bucket sort","Product Except Self – prefix/suffix arrays"]},
  {topic:"Arrays & Hashing",     tasks:["Encode & Decode Strings","Longest Consecutive Sequence – hash set O(n)","Arrays & Hashing review & mixed practice"]},
  {topic:"Two Pointers",         tasks:["Valid Palindrome – two pointer","Two Sum II – sorted + left/right","3Sum – sort + two pointer, handle dupes"]},
  {topic:"Two Pointers",         tasks:["Container With Most Water – greedy","Trapping Rain Water – O(n) two pointer","Two Pointers – pattern review & edge cases"]},
  {topic:"Sliding Window",       tasks:["Best Time to Buy and Sell Stock","Longest Substring Without Repeating Chars","Longest Repeating Character Replacement"]},
  {topic:"Sliding Window",       tasks:["Permutation in String – fixed window","Minimum Window Substring – variable window","Sliding Window – hard problem practice"]},
  {topic:"Stack",                tasks:["Valid Parentheses – stack matching","Min Stack – two-stack trick","Evaluate Reverse Polish Notation"]},
  {topic:"Stack",                tasks:["Daily Temperatures – monotonic stack","Car Fleet – stack simulation","Largest Rectangle in Histogram – mono stack O(n)"]},
  {topic:"Binary Search",        tasks:["Binary Search – classic implementation","Search a 2D Matrix","Koko Eating Bananas – binary search on answer"]},
  {topic:"Binary Search",        tasks:["Find Minimum in Rotated Sorted Array","Search in Rotated Sorted Array","Time Based Key-Value Store"]},
  {topic:"Binary Search",        tasks:["Median of Two Sorted Arrays – hard","Binary Search – templates & edge cases","Binary Search – contest problem practice"]},
  {topic:"Linked List",          tasks:["Reverse Linked List – iterative & recursive","Merge Two Sorted Lists – dummy node","Reorder List – find mid + reverse + merge"]},
  {topic:"Linked List",          tasks:["Remove Nth Node From End – two pointer","Copy List with Random Pointer – hash map","Add Two Numbers – carry propagation"]},
  {topic:"Linked List",          tasks:["Linked List Cycle – Floyd's","Find Duplicate Number – Floyd's in array","LRU Cache – doubly linked list + hash map"]},
  {topic:"Trees",                tasks:["Invert Binary Tree – recursive & iterative","Maximum Depth – DFS/BFS","Diameter of Binary Tree – longest path"]},
  {topic:"Trees",                tasks:["Balanced Binary Tree","Same Tree – structural comparison","Subtree of Another Tree"]},
  {topic:"Trees",                tasks:["LCA – BST & general","Level Order Traversal – BFS queue","Binary Tree Right Side View"]},
  {topic:"Trees",                tasks:["Count Good Nodes – DFS with max","Validate BST – range DFS","Kth Smallest in BST – inorder"]},
  {topic:"Trees",                tasks:["Construct Tree from Preorder+Inorder","Binary Tree Maximum Path Sum","Serialize & Deserialize Binary Tree"]},
  {topic:"Heap / Priority Queue",tasks:["Kth Largest in Stream – min-heap","Last Stone Weight – max-heap","K Closest Points to Origin"]},
  {topic:"Heap / Priority Queue",tasks:["Kth Largest in Array – quickselect","Task Scheduler – frequency + greedy","Design Twitter – heap merge"]},
  {topic:"Heap / Priority Queue",tasks:["Find Median from Data Stream – two heaps","Heap patterns – merge k sorted, top-k","Priority Queue in system design"]},
  {topic:"Backtracking",         tasks:["Subsets – power set via backtracking","Combination Sum – unbounded picking","Permutations – swap-based DFS"]},
  {topic:"Backtracking",         tasks:["Subsets II – deduplicate with sorting","Combination Sum II – skip duplicates","Word Search – 2D DFS with visited"]},
  {topic:"Backtracking",         tasks:["Palindrome Partitioning","Letter Combinations of Phone Number","N-Queens – constraint-based placement"]},
  {topic:"Tries",                tasks:["Implement Trie – insert/search/prefix","Design Add and Search Words – wildcard DFS","Word Search II – Trie + board DFS"]},
  {topic:"Tries",                tasks:["Trie applications – autocomplete, IP routing","Compressed Trie / Radix Tree","Trie problems practice set"]},
  {topic:"Graphs",               tasks:["Number of Islands – BFS/DFS flood fill","Clone Graph – BFS + hash map","Max Area of Island – DFS with area"]},
  {topic:"Graphs",               tasks:["Pacific Atlantic Water Flow","Surrounded Regions – BFS from border","Rotting Oranges – multi-source BFS"]},
  {topic:"Graphs",               tasks:["Course Schedule – cycle detection","Course Schedule II – topological sort","Graph Valid Tree – union find / DFS"]},
  {topic:"Graphs",               tasks:["Number of Connected Components – UF","Redundant Connection – UF cycle detect","Word Ladder – BFS shortest path"]},
  {topic:"Graphs",               tasks:["Alien Dictionary – topological sort","Cheapest Flights K Stops – Bellman-Ford","Graphs – pattern summary"]},
  {topic:"Advanced Graphs",      tasks:["Dijkstra's Algorithm – SSSP","Bellman-Ford – negative weights","Floyd-Warshall – all-pairs"]},
  {topic:"Advanced Graphs",      tasks:["Prim's & Kruskal's – MST","Network Delay Time – Dijkstra","Swim in Rising Water"]},
  {topic:"Advanced Graphs",      tasks:["Critical Connections – Tarjan bridges","Min Cost to Connect All Points","Advanced graph review"]},
  {topic:"Intervals",            tasks:["Insert Interval – merge on insert","Merge Intervals – sort + sweep","Non-Overlapping Intervals – greedy"]},
  {topic:"Intervals",            tasks:["Meeting Rooms – feasibility","Meeting Rooms II – min rooms","Min Interval to Include Query"]},
  {topic:"Greedy",               tasks:["Maximum Subarray – Kadane's","Jump Game – greedy reach","Jump Game II – BFS-style greedy"]},
  {topic:"Greedy",               tasks:["Gas Station – circular greedy","Hand of Straights – grouping","Merge Triplets to Form Target"]},
  {topic:"Greedy",               tasks:["Partition Labels","Valid Parenthesis String – greedy bounds","Greedy – pattern recognition review"]},
  {topic:"Dynamic Programming 1",tasks:["Climbing Stairs – 1D DP","Min Cost Climbing Stairs","House Robber"]},
  {topic:"Dynamic Programming 1",tasks:["House Robber II – circular","Longest Palindromic Substring","Palindromic Substrings – counting"]},
  {topic:"Dynamic Programming 1",tasks:["Decode Ways – string parsing DP","Coin Change – bottom-up BFS","Maximum Product Subarray – track min/max"]},
  {topic:"Dynamic Programming 1",tasks:["Word Break – segment DP + memo","Partition Equal Subset Sum – knapsack","Longest Increasing Subsequence"]},
  {topic:"Dynamic Programming 2",tasks:["Unique Paths – 2D DP","Longest Common Subsequence","Best Time Buy+Sell with Cooldown"]},
  {topic:"Dynamic Programming 2",tasks:["Coin Change II – counting combos","Target Sum – knapsack variant","Interleaving String – 2D DP"]},
  {topic:"Dynamic Programming 2",tasks:["Longest Increasing Path in Matrix","Distinct Subsequences – counting 2D DP","Edit Distance – classic string DP"]},
  {topic:"Dynamic Programming 2",tasks:["Burst Balloons – interval DP","Regular Expression Matching","DP patterns review – all categories"]},
  {topic:"Bit Manipulation",     tasks:["Single Number – XOR trick","Number of 1 Bits","Counting Bits – DP with popcount"]},
  {topic:"Bit Manipulation",     tasks:["Reverse Bits","Missing Number – XOR / Gauss","Sum of Two Integers – bit addition"]},
  {topic:"Bit Manipulation",     tasks:["Reverse Integer","Bit tricks compendium","Bit manipulation in system design"]},
  {topic:"Math & Geometry",      tasks:["Rotate Image – in-place matrix","Spiral Matrix – layer by layer","Set Matrix Zeroes – flag technique"]},
  {topic:"Math & Geometry",      tasks:["Happy Number – cycle detection","Plus One – carry propagation","Pow(x,n) – fast exponentiation"]},
  {topic:"Math & Geometry",      tasks:["Multiply Strings","Detect Squares","Math & Geometry patterns wrap-up"]},
  {topic:"DSA Mock Interview",   tasks:["Timed mock: 2 medium + 1 hard problem","Review solutions & complexity analysis","Identify weak areas for revision"]},
  {topic:"DSA Mock Interview",   tasks:["Full mock: array + tree + graph","Code review & optimization pass","Behavioral + DSA combined mock"]},
];

const LLD_TOPICS = [
  {topic:"OOP & SOLID Principles",        tasks:["OOP pillars: encapsulation, inheritance, polymorphism, abstraction","SOLID: SRP, OCP, LSP with code examples","SOLID: ISP, DIP – dependency injection patterns"]},
  {topic:"Design Patterns – Creational",  tasks:["Factory Method – motivation & Java implementation","Abstract Factory – family of products","Builder pattern – complex object construction"]},
  {topic:"Design Patterns – Creational",  tasks:["Singleton – thread-safe lazy init, double-checked locking","Prototype pattern – deep cloning","Creational patterns review & interview Q&A"]},
  {topic:"Design Patterns – Structural",  tasks:["Adapter – bridging incompatible interfaces","Decorator – dynamic behaviour extension","Facade – simplified interface over subsystem"]},
  {topic:"Design Patterns – Behavioral",  tasks:["Strategy pattern – interchangeable algorithms","Observer pattern – event-driven updates","Command pattern – encapsulate requests"]},
  {topic:"Design Patterns – Behavioral",  tasks:["State pattern – finite state machines","Template Method – algorithm skeleton","Iterator, Chain of Responsibility"]},
  {topic:"LLD: Parking Lot",              tasks:["Requirements: vehicle types, floors, pricing","Class diagram – ParkingLot, Slot, Ticket, Vehicle","Implementation + payment processing"]},
  {topic:"LLD: Elevator System",          tasks:["Requirements – multiple elevators, directions","Class diagram – Controller, Car, Request","Implement SCAN / LOOK scheduling"]},
  {topic:"LLD: Splitwise",                tasks:["Requirements – users, expenses, splits, settle up","Class diagram – User, Group, Expense, Split","Implement expense calculation & balance sheet"]},
  {topic:"LLD: BookMyShow",               tasks:["Requirements – movies, shows, seats","Class diagram – Theater, Screen, Show, Seat","Implement seat selection & concurrent booking"]},
  {topic:"LLD: ATM",                      tasks:["Requirements – withdraw, deposit, balance, auth","Class diagram – ATM, Card, Account, Transaction","Implement state machine: idle→card→pin→txn"]},
  {topic:"LLD: Chess",                    tasks:["Requirements – pieces, moves, check, checkmate","Class diagram – Board, Piece hierarchy, Game","Implement move validation & special moves"]},
  {topic:"LLD: Snake and Ladder",         tasks:["Requirements – board, dice, players","Class diagram – Game, Board, Player, Snake, Ladder","Implementation & edge cases"]},
  {topic:"LLD: Cricbuzz",                 tasks:["Requirements – live scores, matches, commentary","Class diagram – Match, Innings, Over, Ball","Implement observer for live score updates"]},
  {topic:"LLD: Hotel Management",         tasks:["Requirements – rooms, guests, reservations, billing","Class diagram – Hotel, Room, Reservation, Guest","Implement check-in/out & pricing engine"]},
  {topic:"LLD: Car Rental",               tasks:["Requirements – fleet, branches, bookings","Class diagram – Car, Branch, Reservation","Implement availability & pricing strategy"]},
  {topic:"LLD: Food Delivery",            tasks:["Requirements – restaurants, menus, orders","Class diagram – Restaurant, Menu, Order, Agent","Implement order lifecycle & assignment"]},
  {topic:"LLD: Cab Booking",              tasks:["Requirements – riders, drivers, trips, pricing","Class diagram – Rider, Driver, Trip, PricingStrategy","Implement matching, surge pricing, state machine"]},
  {topic:"LLD: Notification System",      tasks:["Requirements – email/SMS/push, templates","Class diagram – NotificationService, Channel, Template","Implement chain of responsibility dispatch"]},
  {topic:"LLD: Rate Limiter",             tasks:["Requirements – token bucket, sliding window","Class diagram – RateLimiter, TokenBucket, SlidingWindowLog","Thread-safe implementation in Java"]},
  {topic:"LLD: Logging Framework",        tasks:["Requirements – levels, appenders, async","Class diagram – Logger, Appender, Formatter, LogEntry","Implement async logging with blocking queue"]},
  {topic:"LLD Mock Interview",            tasks:["Design Library Management System (45 min)","Review class diagram & code quality","Discuss trade-offs & alternative designs"]},
];

const HLD_TOPICS = [
  {topic:"Fundamentals & Scalability",  tasks:["Horizontal vs vertical scaling","CAP Theorem – consistency, availability, partition","Consistency models – strong, eventual, causal"]},
  {topic:"Networking & Proxies",        tasks:["Load balancing – round robin, least conn, IP hash","Reverse proxy vs forward proxy","CDN – push vs pull, edge caching, anycast"]},
  {topic:"Caching",                     tasks:["Caching strategies – cache-aside, write-through, write-behind","Cache eviction – LRU, LFU, TTL","Redis deep dive – data structures, cluster, persistence"]},
  {topic:"Databases",                   tasks:["SQL vs NoSQL – when to use each","Database indexes – B-tree, hash, composite, covering","Query optimization – EXPLAIN, N+1 problem"]},
  {topic:"Database Scaling",            tasks:["Read replicas – sync vs async replication","Database sharding – range, hash, directory","Consistent hashing – virtual nodes, ring routing"]},
  {topic:"Storage",                     tasks:["Blob/object storage – S3 architecture, multi-part upload","HDFS – distributed file system concepts","Storage tiers – hot, warm, cold archival"]},
  {topic:"Messaging & Events",          tasks:["Kafka deep dive – partitions, offsets, consumer groups","Kafka guarantees – at-most-once, at-least-once, exactly-once","RabbitMQ – exchanges, routing keys, DLQ"]},
  {topic:"Event-Driven Systems",        tasks:["Event sourcing – append-only log, event replay","CQRS – command query responsibility segregation","Saga pattern – distributed transaction coordination"]},
  {topic:"Reliability",                 tasks:["Circuit breaker – closed, open, half-open","Retry strategies – exponential backoff, jitter","Bulkhead & timeout patterns"]},
  {topic:"HLD: TinyURL",               tasks:["Requirements + capacity estimation (100M URLs)","API design, data model, KV store choice","Architecture – encode service, redirect, counter; trade-offs"]},
  {topic:"HLD: WhatsApp / Chat",        tasks:["WebSocket vs long polling for real-time","Message ordering, storage, E2E encryption overview","Architecture – chat, presence, notification; capacity 50B msgs/day"]},
  {topic:"HLD: Uber",                   tasks:["Location service – geohashing, S2 library","Matching algorithm – dispatch, surge pricing","Architecture + capacity: 10M trips/day, GPS 1/4s per driver"]},
  {topic:"HLD: YouTube",               tasks:["Video pipeline – upload → transcode (HLS/DASH) → CDN","Capacity: 500hr video uploaded/min","Architecture – metadata DB, video store, CDN, search; trade-offs"]},
  {topic:"HLD: Instagram",             tasks:["Fan-out strategies – push vs pull vs hybrid feed","Photo storage – CDN + object store pipeline","Capacity: 100M DAU, 1B photos; celebrity account problem"]},
  {topic:"HLD: Twitter/X",             tasks:["Timeline generation – fan-out on write vs read","Trending topics – stream processing with Kafka","Architecture + capacity; trade-offs: stale timelines"]},
  {topic:"HLD: Netflix",               tasks:["Adaptive bitrate streaming (ABR), CDN Open Connect","Content encoding pipeline – per-title encoding","Architecture – recommendation, billing, CDN; trade-offs"]},
  {topic:"HLD: Google Drive",          tasks:["Block-level sync – deduplication with content hash","Conflict resolution for concurrent edits","Architecture + capacity: 1B users × 15GB; trade-offs"]},
  {topic:"HLD: Distributed Cache",     tasks:["Consistent hashing ring with virtual nodes","Replication factor, read/write quorums","Trade-offs: accuracy vs performance, multi-DC sync"]},
  {topic:"HLD: Distributed Rate Limiter",tasks:["Redis sliding window with Lua atomic scripts","Per-user, per-IP, global limits, multi-region","Trade-offs: accuracy vs performance"]},
  {topic:"HLD: Notification System",   tasks:["Architecture – notification service, template engine, dispatcher","Retry, dedup, delivery receipts, opt-out management","Multi-channel: email, SMS, push, in-app"]},
  {topic:"HLD: News Feed",             tasks:["Feed ranking – ML signals overview","Architecture – feed service, ranking, cache warming","Trade-offs: freshness vs performance"]},
  {topic:"HLD: Distributed Queue",     tasks:["Architecture – partitioned, replicated queue (SQS model)","Trade-offs: ordering guarantees, exactly-once delivery","DLQ, visibility timeout, ack design"]},
  {topic:"HLD Mock Interview",         tasks:["Design Dropbox (45 min timed)","Whiteboard: capacity, API, architecture, scaling","Feedback: trade-off reasoning quality"]},
];

const JAVA_TOPICS = [
  {topic:"JVM Architecture",          tasks:["JDK vs JRE vs JVM – component breakdown","JVM memory: heap (young/old gen), stack, metaspace, code cache","Class loading – bootstrap, extension, application classloaders"]},
  {topic:"Memory & GC",               tasks:["GC algorithms – Serial, Parallel, CMS, G1, ZGC","GC tuning flags – heap size, GC policy, pause targets","Memory leaks – jmap, jstack, VisualVM, JFR"]},
  {topic:"Collections – Core",        tasks:["HashMap internals – hashing, buckets, load factor, treeification","ConcurrentHashMap – segment locking → CAS evolution","TreeMap (Red-Black Tree), LinkedHashMap (insertion order)"]},
  {topic:"Collections – Advanced",    tasks:["ArrayList vs LinkedList – cache locality, complexity","PriorityQueue – heap internals","Fail-fast vs fail-safe – CopyOnWriteArrayList"]},
  {topic:"Concurrency – Basics",      tasks:["Thread lifecycle, daemon threads","Executors – Fixed, Cached, Scheduled, ForkJoin pools","Callable, Future, FutureTask – cancellation patterns"]},
  {topic:"Concurrency – Primitives",  tasks:["synchronized – monitor object internals","volatile – happens-before guarantee, visibility","Atomic classes – CAS, AtomicInteger, AtomicReference"]},
  {topic:"Concurrency – Locks",       tasks:["ReentrantLock, ReadWriteLock, StampedLock","Condition variables – await/signal pattern","CountDownLatch, CyclicBarrier, Semaphore, Phaser"]},
  {topic:"Concurrency – Advanced",    tasks:["CompletableFuture – thenApply, thenCompose, allOf, anyOf","ForkJoinPool – work stealing algorithm","ThreadLocal – per-thread state, memory leak pitfalls"]},
  {topic:"Java 8+ – Streams",         tasks:["Lambda expressions – functional interfaces, method refs","Stream API – lazy evaluation, intermediate & terminal ops","Optional – avoiding NPE, flatMap patterns"]},
  {topic:"Java 8+ – APIs",            tasks:["Default & static interface methods","Date/Time API – LocalDate, ZonedDateTime, Duration","Map.computeIfAbsent, merge, forEach patterns"]},
  {topic:"Spring – Core",             tasks:["IoC container – BeanFactory vs ApplicationContext","DI – constructor, setter, field injection","Bean scopes – singleton, prototype, request, session"]},
  {topic:"Spring Boot Internals",     tasks:["Auto-configuration – @EnableAutoConfiguration, conditions","Spring Boot startup sequence – refresh, bean lifecycle","@Transactional – propagation, isolation, pitfalls"]},
  {topic:"Spring – AOP",              tasks:["AOP concepts – advice, pointcut, joinpoint, weaving","AspectJ vs Spring AOP – proxy limitations","Use cases – logging, security, transactions"]},
  {topic:"Java Deep Dives",           tasks:["HashMap vs ConcurrentHashMap – interview deep dive","String pool, interning, StringBuilder vs StringBuffer","Java memory model – happens-before, race conditions"]},
  {topic:"Java Practice",             tasks:["Implement custom thread-safe LRU cache","Write producer-consumer using BlockingQueue","Solve 5 Java concurrency puzzles timed"]},
];

const GO_TOPICS = [
  {topic:"Go Fundamentals",           tasks:["Go modules, go.mod, go.sum – project setup","Types, interfaces, embedding – composition model","Error handling – errors.Is, errors.As, wrapping"]},
  {topic:"Goroutines",                tasks:["Goroutines vs OS threads – M:N scheduling model","Go scheduler – GOMAXPROCS, P, M, G model","Goroutine leaks – context cancellation patterns"]},
  {topic:"Channels",                  tasks:["Buffered vs unbuffered channels – blocking semantics","Select statement – non-blocking, timeout, done channel","Channel directions – send-only, receive-only in signatures"]},
  {topic:"Concurrency Patterns",      tasks:["Worker pool pattern – bounded parallelism","Fan-out, fan-in – scatter/gather","Pipeline pattern – chained channel stages"]},
  {topic:"Concurrency Patterns II",   tasks:["Context – cancellation, deadline, value propagation","sync.WaitGroup – coordinating goroutine completion","sync.Once, sync.Pool – lazy init & object reuse"]},
  {topic:"Memory & Runtime",          tasks:["Escape analysis – stack vs heap, go build -gcflags","GC – tri-color mark-and-sweep, GOGC tuning","Memory alignment, struct padding, unsafe overview"]},
  {topic:"Sync Primitives",           tasks:["sync.Mutex vs sync.RWMutex","sync.Map – concurrent map without external locking","atomic package – lock-free operations"]},
  {topic:"Go Backend – REST",         tasks:["net/http – handlers, mux, middleware chaining","JSON marshaling – struct tags, custom marshalers","Middleware – auth, logging, rate limiting"]},
  {topic:"Go Backend – gRPC",         tasks:["Protobuf schema design – messages, services, enums","gRPC streaming – server, client, bidirectional","gRPC interceptors – auth, tracing, retry"]},
  {topic:"Go Production",             tasks:["Profiling – pprof CPU, memory, goroutine, block","Race detector – go test -race, detecting races","Observability – slog, prometheus, traces"]},
  {topic:"Go Deep Dive",              tasks:["Go memory model – happens-before in channels & mutexes","Interface internals – itab, dynamic dispatch cost","Reflection – reflect.Type, Value, use cases & pitfalls"]},
  {topic:"Go Practice",               tasks:["Implement concurrent web crawler with goroutines","Write token bucket rate limiter with goroutines","Implement fan-out worker pool for parallel processing"]},
];

function generatePlan() {
  const weeks = [];
  let dsaI=0, lldI=0, hldI=0, javaI=0, goI=0;
  const weekSec = ["LLD","HLD","Java","Go","LLD","HLD","Java","Go","LLD","HLD"];
  const mockWks = new Set([4,6,8,10]);
  let cur = new Date(START_DATE);
  let wn = 0;

  while (cur <= END_DATE) {
    wn++;
    const wStart = new Date(cur);
    const sec = weekSec[(wn-1) % weekSec.length];
    const days = [];

    for (let d=0; d<7; d++) {
      if (cur > END_DATE) break;
      const date = new Date(cur);
      const isRev = d === 6;
      const isMockDay = mockWks.has(wn) && d === 5;

      if (isRev) {
        days.push({ date, dateStr:fmt(date), dateShort:fmtS(date), dayName:dayName(date), isWeekend:true, isRevisionDay:true,
          sections: {
            dsa:  { topic:"DSA Revision & Mock", tasks:["Revisit weak DSA topics from this week","Re-solve 2-3 previously marked problems","Timed mock: 1 medium + 1 hard problem","Review notes & update revision list"] },
            secondary: { subject:sec, topic:"Weekly Revision", tasks:[`Review ${sec} notes from this week`,`Re-read key ${sec} concepts`,`Practice 1 ${sec} problem/question`,"Mock: pick a random past topic"] },
          }
        });
      } else if (isMockDay) {
        days.push({ date, dateStr:fmt(date), dateShort:fmtS(date), dayName:dayName(date), isWeekend:true, isMockDay:true,
          sections: {
            dsa:  { topic:"DSA Mock Interview", tasks:["Timed mock: 2 medium problems (45 min each)","Hard problem attempt (60 min)","Review all solutions & optimize"] },
            secondary: { subject:sec, topic:`${sec} Mock Interview`,
              tasks:[
                sec==="LLD"?"LLD mock: design system in 45 min":
                sec==="HLD"?"HLD mock: system design in 45 min":
                sec==="Java"?"Java deep-dive mock Q&A (60 min)":
                "Go concurrency mock coding (60 min)",
                "Review & self-evaluate","Behavioral + technical combined mock"
              ]
            },
          }
        });
      } else {
        const dst = DSA_TOPICS[dsaI % DSA_TOPICS.length];
        let st;
        if      (sec==="LLD")  { st=LLD_TOPICS[lldI  % LLD_TOPICS.length];  lldI++;  }
        else if (sec==="HLD")  { st=HLD_TOPICS[hldI  % HLD_TOPICS.length];  hldI++;  }
        else if (sec==="Java") { st=JAVA_TOPICS[javaI % JAVA_TOPICS.length]; javaI++; }
        else                   { st=GO_TOPICS[goI    % GO_TOPICS.length];    goI++;   }
        const tasks = isWknd(date) ? [...dst.tasks,"Extra: explore a harder variant"] : dst.tasks;
        days.push({ date, dateStr:fmt(date), dateShort:fmtS(date), dayName:dayName(date), isWeekend:isWknd(date),
          sections: {
            dsa:      { topic:dst.topic, tasks },
            secondary:{ subject:sec, topic:st.topic, tasks:st.tasks },
          }
        });
        dsaI++;
      }
      cur = addDays(cur, 1);
    }

    const wEnd = new Date(cur); wEnd.setDate(wEnd.getDate()-1);
    weeks.push({ weekNum:wn, startDate:wStart, endDate:wEnd<=END_DATE?wEnd:new Date(END_DATE), secondary:sec, isMockWeek:mockWks.has(wn), days });
  }
  return weeks;
}

// Assign stable IDs
function withIds(plan) {
  return plan.map((week,wi) => ({
    ...week,
    days: week.days.map((day,di) => ({
      ...day,
      sections: {
        dsa:      { ...day.sections.dsa,      tasks: day.sections.dsa.tasks.map((t,ti)     =>({id:`w${wi}d${di}a${ti}`,text:t})) },
        secondary:{ ...day.sections.secondary, tasks: day.sections.secondary.tasks.map((t,ti)=>({id:`w${wi}d${di}b${ti}`,text:t})) },
      }
    }))
  }));
}

const PLAN = withIds(generatePlan());

// ============================================================
// STORAGE
// ============================================================
const LS = { tasks:"itrk_t3", notes:"itrk_n3", flags:"itrk_f3" };
const load = (k,fb) => { try { return JSON.parse(localStorage.getItem(k))??fb; } catch { return fb; } };
const save = (k,v)  => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

// ============================================================
// STATS
// ============================================================
function cntTasks(day)       { return day.sections.dsa.tasks.length + day.sections.secondary.tasks.length; }
function donInDay(day,done)  { return [...day.sections.dsa.tasks,...day.sections.secondary.tasks].filter(t=>done[t.id]).length; }
function wkPct(week,done)    { let t=0,d=0; week.days.forEach(day=>{t+=cntTasks(day);d+=donInDay(day,done);}); return t?Math.round(d/t*100):0; }
function subjPct(key,done)   {
  let t=0,d=0;
  PLAN.forEach(week=>week.days.forEach(day=>{
    const arr = key==="dsa" ? day.sections.dsa.tasks : (day.sections.secondary.subject?.toLowerCase()===key ? day.sections.secondary.tasks : []);
    arr.forEach(tk=>{ t++; if(done[tk.id]) d++; });
  }));
  return t?Math.round(d/t*100):0;
}
function totalPct(done) {
  let t=0,d=0;
  PLAN.forEach(w=>w.days.forEach(day=>{t+=cntTasks(day);d+=donInDay(day,done);}));
  return t?Math.round(d/t*100):0;
}
function dayStats() {
  const today=new Date(); today.setHours(0,0,0,0);
  const start=new Date(START_DATE); start.setHours(0,0,0,0);
  const end=new Date(END_DATE); end.setHours(0,0,0,0);
  const total=Math.ceil((end-start)/86400000)+1;
  const comp=Math.max(0,Math.min(Math.ceil((today-start)/86400000),total));
  const rem=Math.max(0,Math.ceil((end-today)/86400000));
  return {total,comp,rem};
}
function curWeekNum() {
  const t=new Date();
  for(let i=0;i<PLAN.length;i++) if(t>=PLAN[i].startDate&&t<=PLAN[i].endDate) return i+1;
  return t<PLAN[0].startDate?1:PLAN.length;
}

// ============================================================
// UI PRIMITIVES
// ============================================================
function Card({children, style={}, onClick}) {
  return (
    <div onClick={onClick} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20,cursor:onClick?"pointer":undefined,...style}}>
      {children}
    </div>
  );
}

function Bar({pct, color, height=8}) {
  return (
    <div style={{background:"rgba(255,255,255,0.07)",borderRadius:99,height,overflow:"hidden",width:"100%"}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 0.7s ease"}}/>
    </div>
  );
}

function Chip({label,cfg}) {
  return (
    <span style={{background:cfg.bg,color:cfg.textColor,border:`1px solid ${cfg.color}22`,borderRadius:99,fontSize:11,fontWeight:700,padding:"2px 8px",display:"inline-flex",alignItems:"center"}}>
      {label}
    </span>
  );
}

function CheckItem({task,done,onToggle}) {
  return (
    <div onClick={onToggle} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",cursor:"pointer"}}>
      <div style={{
        marginTop:2,flexShrink:0,width:18,height:18,borderRadius:5,
        border:`2px solid ${done?T.indigo:"#3a3a5a"}`,
        background:done?T.indigo:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"
      }}>
        {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
      </div>
      <span style={{fontSize:13,lineHeight:1.5,color:done?"#404060":"#b0b0d0",textDecoration:done?"line-through":"none",transition:"all 0.15s"}}>
        {task.text}
      </span>
    </div>
  );
}

// ============================================================
// OVERVIEW
// ============================================================
function Overview({done, onNav}) {
  const pct = totalPct(done);
  const {comp,rem} = dayStats();
  const cw = curWeekNum();
  const R = 52, C = 2*Math.PI*R;
  const subjects = [
    {key:"dsa",...SUBJ.dsa},{key:"lld",...SUBJ.lld},{key:"hld",...SUBJ.hld},{key:"java",...SUBJ.java},{key:"go",...SUBJ.go}
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Ring */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 0 16px"}}>
        <div style={{position:"relative",width:144,height:144}}>
          <svg width="144" height="144" viewBox="0 0 120 120" style={{transform:"rotate(-90deg)"}}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
            <circle cx="60" cy="60" r={R} fill="none" stroke={T.indigo} strokeWidth="12"
              strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round"
              style={{transition:"stroke-dashoffset 1s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:36,fontWeight:800,color:T.text,lineHeight:1}}>{pct}%</span>
            <span style={{fontSize:11,color:T.textDim,marginTop:2}}>progress</span>
          </div>
        </div>
        <p style={{marginTop:12,fontSize:12,color:T.textDim,textAlign:"center"}}>Senior Backend Engineer · Jun 21 – Aug 31, 2026</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          {l:"Days Completed", v:comp, s:"since Jun 21"},
          {l:"Days Remaining", v:rem,  s:"until Aug 31"},
          {l:"Current Week",   v:`W${cw}`, s:"of 10 weeks"},
          {l:"Overall",        v:`${pct}%`, s:"tasks done"},
        ].map(s=>(
          <Card key={s.l} style={{padding:16}}>
            <p style={{fontSize:11,color:T.textDim,marginBottom:4}}>{s.l}</p>
            <p style={{fontSize:26,fontWeight:800,color:T.text,margin:0}}>{s.v}</p>
            <p style={{fontSize:11,color:T.textFaint,marginTop:2}}>{s.s}</p>
          </Card>
        ))}
      </div>

      {/* Subject bars */}
      <Card>
        <p style={{fontSize:11,fontWeight:700,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16}}>Subject Progress</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {subjects.map(s=>{
            const p=subjPct(s.key,done);
            return (
              <div key={s.key}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:13,fontWeight:700,color:s.textColor}}>{s.label}</span>
                  <span style={{fontSize:13,color:T.textDim}}>{p}%</span>
                </div>
                <Bar pct={p} color={s.color}/>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Week grid */}
      <Card>
        <p style={{fontSize:11,fontWeight:700,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Jump to Week</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {PLAN.map(w=>{
            const p=wkPct(w,done);
            const isCur=w.weekNum===cw;
            return (
              <div key={w.weekNum} onClick={()=>onNav("week-detail",w.weekNum)}
                style={{background:isCur?"rgba(99,102,241,0.18)":T.surface,border:`1px solid ${isCur?T.indigo:T.border}`,
                  borderRadius:12,padding:"10px 6px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
                <p style={{fontSize:11,fontWeight:700,color:isCur?T.indigo:T.textDim}}>W{w.weekNum}</p>
                <p style={{fontSize:18,fontWeight:800,color:T.text,margin:"3px 0"}}>{p}%</p>
                {w.isMockWeek && <p style={{fontSize:10,color:T.amber}}>Mock</p>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// WEEKLY LIST
// ============================================================
function WeeklyList({done, onSelect}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <p style={{fontSize:11,fontWeight:700,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>10-Week Preparation Plan</p>
      {PLAN.map(week=>{
        const p=wkPct(week,done);
        const total=week.days.reduce((s,d)=>s+cntTasks(d),0);
        const dn=week.days.reduce((s,d)=>s+donInDay(d,done),0);
        const sc=SUBJ[week.secondary.toLowerCase()]||SUBJ.lld;
        const isCur=week.weekNum===curWeekNum();
        return (
          <div key={week.weekNum} onClick={()=>onSelect(week.weekNum)}
            style={{background:isCur?"rgba(99,102,241,0.10)":T.card,
              border:`1px solid ${isCur?T.indigo:T.border}`,borderRadius:16,padding:18,cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:15,fontWeight:700,color:T.text}}>Week {week.weekNum}</span>
                  {isCur && <span style={{fontSize:11,background:"rgba(99,102,241,0.25)",color:"#a5b4fc",borderRadius:99,padding:"2px 8px"}}>Current</span>}
                  {week.isMockWeek && <span style={{fontSize:11,background:"rgba(245,158,11,0.18)",color:T.amber,borderRadius:99,padding:"2px 8px"}}>Mock Week</span>}
                  <Chip label={week.secondary} cfg={sc}/>
                </div>
                <p style={{fontSize:12,color:T.textDim}}>{fmtS(week.startDate)} – {fmtS(week.endDate)}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>{p}%</p>
                <p style={{fontSize:11,color:T.textDim}}>{dn}/{total} tasks</p>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <Bar pct={p} color={sc.color} height={6}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// WEEK DETAIL
// ============================================================
function WeekDetail({weekNum, done, onToggle, notes, onNote, flags, onFlag}) {
  const week = PLAN[weekNum-1];
  const [di, setDi] = useState(0);
  if (!week) return null;
  const day = week.days[di];
  const sec = day.sections.secondary.subject || week.secondary;
  const sc = SUBJ[(sec||"lld").toLowerCase()]||SUBJ.lld;
  const nk = `${weekNum}-${di}`;
  const total = cntTasks(day);
  const dn = donInDay(day,done);
  const pct = total?Math.round(dn/total*100):0;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Week {week.weekNum}</h2>
          <p style={{fontSize:12,color:T.textDim,margin:"3px 0 0"}}>{fmtS(week.startDate)} – {fmtS(week.endDate)}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{fontSize:26,fontWeight:800,color:T.text,margin:0}}>{wkPct(week,done)}%</p>
          <p style={{fontSize:11,color:T.textDim}}>week</p>
        </div>
      </div>

      {/* Day strip */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {week.days.map((d,i)=>{
          const sel=i===di;
          const dt=cntTasks(d); const dd=donInDay(d,done);
          const full=dt>0&&dd===dt;
          const fl=flags[`${weekNum}-${i}`];
          return (
            <div key={i} onClick={()=>setDi(i)}
              style={{flexShrink:0,background:sel?"rgba(99,102,241,0.22)":T.card,
                border:`1px solid ${sel?T.indigo:T.border}${d.isRevisionDay?"":""} `,
                borderTop:`3px solid ${d.isRevisionDay?T.purple:d.isMockDay?T.amber:sel?T.indigo:"transparent"}`,
                borderRadius:12,padding:"10px 12px",textAlign:"center",cursor:"pointer",minWidth:56}}>
              <p style={{fontSize:11,color:sel?"#a5b4fc":T.textDim,fontWeight:600}}>{d.dayName.slice(0,3)}</p>
              <p style={{fontSize:15,fontWeight:800,color:T.text,margin:"3px 0"}}>{d.date.getDate()}</p>
              {full && <div style={{width:6,height:6,background:T.emerald,borderRadius:"50%",margin:"2px auto 0"}}/>}
              {fl && <div style={{width:6,height:6,background:T.rose,borderRadius:"50%",margin:"2px auto 0"}}/>}
              {d.isRevisionDay && <p style={{fontSize:9,color:T.purple,marginTop:2}}>Rev</p>}
              {d.isMockDay && <p style={{fontSize:9,color:T.amber,marginTop:2}}>Mock</p>}
            </div>
          );
        })}
      </div>

      {/* Day header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h3 style={{fontSize:16,fontWeight:700,color:T.text,margin:0}}>{day.dayName}, {day.dateStr}</h3>
          <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
            {day.isRevisionDay && <span style={{fontSize:11,background:"rgba(168,85,247,0.18)",color:T.purple,borderRadius:99,padding:"2px 8px"}}>Revision Day</span>}
            {day.isMockDay    && <span style={{fontSize:11,background:"rgba(245,158,11,0.18)",color:T.amber,borderRadius:99,padding:"2px 8px"}}>Mock Interview Day</span>}
            {day.isWeekend&&!day.isRevisionDay&&!day.isMockDay && <span style={{fontSize:11,background:T.surface,color:T.textDim,borderRadius:99,padding:"2px 8px"}}>Weekend – Extended Session</span>}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <span style={{fontSize:22,fontWeight:800,color:T.text}}>{pct}%</span>
          <p style={{fontSize:11,color:T.textDim,margin:0}}>{dn}/{total}</p>
        </div>
      </div>

      {/* DSA Section */}
      <div style={{background:"rgba(99,102,241,0.07)",border:`1px solid rgba(99,102,241,0.25)`,borderRadius:16,padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <Chip label="DSA" cfg={SUBJ.dsa}/>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{day.sections.dsa.topic}</span>
        </div>
        {day.sections.dsa.tasks.map(t=>(
          <CheckItem key={t.id} task={t} done={!!done[t.id]} onToggle={()=>onToggle(t.id)}/>
        ))}
      </div>

      {/* Secondary Section */}
      <div style={{background:sc.bg,border:`1px solid ${sc.color}33`,borderRadius:16,padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <Chip label={sec} cfg={sc}/>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{day.sections.secondary.topic}</span>
        </div>
        {day.sections.secondary.tasks.map(t=>(
          <CheckItem key={t.id} task={t} done={!!done[t.id]} onToggle={()=>onToggle(t.id)}/>
        ))}
      </div>

      {/* Notes */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:18}}>
        <p style={{fontSize:12,fontWeight:600,color:T.textDim,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          ✏️ Things to revise later
        </p>
        <textarea
          value={notes[nk]||""}
          onChange={e=>onNote(nk,e.target.value)}
          placeholder="Jot down concepts to revisit, problems that confused you, links..."
          style={{
            width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${T.border}`,borderRadius:10,
            padding:12,fontSize:13,color:T.text,resize:"vertical",minHeight:100,outline:"none",
            fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box",
            caretColor:T.indigo
          }}
        />
      </div>

      {/* Flag */}
      <div onClick={()=>onFlag(nk)}
        style={{background:flags[nk]?"rgba(244,63,94,0.08)":T.card,
          border:`1px solid ${flags[nk]?"rgba(244,63,94,0.35)":T.border}`,
          borderRadius:16,padding:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
        <div style={{
          width:20,height:20,borderRadius:5,flexShrink:0,
          background:flags[nk]?T.rose:"transparent",
          border:`2px solid ${flags[nk]?T.rose:"#3a3a5a"}`,
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"
        }}>
          {flags[nk] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
        </div>
        <span style={{fontSize:13,fontWeight:600,color:flags[nk]?"#fda4af":T.textDim}}>🚩 Need revision — mark this day for follow-up</span>
      </div>
    </div>
  );
}

// ============================================================
// REVISION
// ============================================================
function Revision({done, flags, notes}) {
  const flagged = [];
  PLAN.forEach(week=>week.days.forEach((day,di)=>{
    const k=`${week.weekNum}-${di}`;
    if(flags[k]) flagged.push({week,day,di,k});
  }));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Revision Tracker</h2>
        <span style={{fontSize:12,background:"rgba(244,63,94,0.18)",color:T.rose,borderRadius:99,padding:"3px 10px"}}>{flagged.length} flagged</span>
      </div>
      {flagged.length===0 ? (
        <Card style={{textAlign:"center",padding:60}}>
          <p style={{fontSize:32,marginBottom:8}}>🎯</p>
          <p style={{color:T.textDim,fontSize:13,lineHeight:1.6}}>No days flagged yet.<br/>Check "Need revision" on any day to track it here.</p>
        </Card>
      ) : flagged.map(({week,day,di,k})=>{
        const dt=cntTasks(day); const dn=donInDay(day,done);
        const sc=SUBJ[(day.sections.secondary.subject||"lld").toLowerCase()]||SUBJ.lld;
        return (
          <div key={k} style={{background:"rgba(244,63,94,0.05)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:16,padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <p style={{fontWeight:700,color:T.text,margin:0}}>{day.dayName}, {day.dateStr}</p>
                <p style={{fontSize:12,color:T.textDim,margin:"3px 0 0"}}>Week {week.weekNum} · Day {di+1}</p>
              </div>
              <span style={{fontSize:11,background:"rgba(244,63,94,0.18)",color:T.rose,borderRadius:99,padding:"2px 8px"}}>🚩 Flagged</span>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <Chip label="DSA" cfg={SUBJ.dsa}/>
              <span style={{fontSize:12,color:T.textDim}}>{day.sections.dsa.topic}</span>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <Chip label={day.sections.secondary.subject||"LLD"} cfg={sc}/>
              <span style={{fontSize:12,color:T.textDim}}>{day.sections.secondary.topic}</span>
            </div>
            {notes[k] && (
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:12,marginBottom:10}}>
                <p style={{fontSize:11,color:T.textDim,marginBottom:4}}>Notes:</p>
                <p style={{fontSize:13,color:"#b0b0d0",whiteSpace:"pre-wrap",margin:0}}>{notes[k]}</p>
              </div>
            )}
            <Bar pct={dt?Math.round(dn/dt*100):0} color={T.rose} height={5}/>
            <p style={{fontSize:11,color:T.textDim,marginTop:5}}>{dn}/{dt} tasks done</p>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [done,  setDone]  = useState(()=>load(LS.tasks,{}));
  const [notes, setNotes] = useState(()=>load(LS.notes,{}));
  const [flags, setFlags] = useState(()=>load(LS.flags,{}));
  const [page,  setPage]  = useState("overview");
  const [selW,  setSelW]  = useState(curWeekNum);

  useEffect(()=>save(LS.tasks,done),  [done]);
  useEffect(()=>save(LS.notes,notes), [notes]);
  useEffect(()=>save(LS.flags,flags), [flags]);

  const toggle = useCallback(id=>setDone(p=>({...p,[id]:!p[id]})),[]);
  const note   = useCallback((k,v)=>setNotes(p=>({...p,[k]:v})),[]);
  const flag   = useCallback(k=>setFlags(p=>({...p,[k]:!p[k]})),[]);

  const nav = useCallback((target,w)=>{ if(w) setSelW(w); setPage(target); },[]);

  const NAV=[
    {id:"overview",    icon:"📊",label:"Overview"},
    {id:"weekly",      icon:"📅",label:"Weeks"},
    {id:"week-detail", icon:"📋",label:`W${selW}`},
    {id:"revision",    icon:"🚩",label:"Revision"},
  ];

  const overall = totalPct(done);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(13,13,20,0.9)",backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${T.border}`,padding:"12px 16px"}}>
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"rgba(99,102,241,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎯</div>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:T.text,margin:0,lineHeight:1.2}}>Interview Tracker</p>
              <p style={{fontSize:11,color:T.textDim,margin:0,lineHeight:1.2}}>Senior Backend · {overall}% complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{position:"sticky",top:57,zIndex:40,background:"rgba(13,13,20,0.85)",backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${T.border}`,padding:"6px 16px"}}>
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",gap:4}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>nav(n.id)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 4px",
                borderRadius:10,border:"none",cursor:"pointer",transition:"all 0.15s",
                background:page===n.id?"rgba(99,102,241,0.18)":"transparent",
                color:page===n.id?"#a5b4fc":T.textDim,fontSize:11,fontWeight:600}}>
              <span style={{fontSize:16}}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:640,margin:"0 auto",padding:"20px 16px 48px"}}>
        {page==="overview"    && <Overview done={done} onNav={nav}/>}
        {page==="weekly"      && <WeeklyList done={done} onSelect={w=>nav("week-detail",w)}/>}
        {page==="week-detail" && <WeekDetail weekNum={selW} done={done} onToggle={toggle} notes={notes} onNote={note} flags={flags} onFlag={flag}/>}
        {page==="revision"    && <Revision done={done} flags={flags} notes={notes}/>}
      </div>
    </div>
  );
}
