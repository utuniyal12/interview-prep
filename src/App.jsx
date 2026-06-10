
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LayoutDashboard, ChevronDown, ChevronRight, CheckCircle2, Circle,
  BarChart3, Settings, BookOpen, Brain, Code2, Users, RefreshCw,
  Trophy, Target, Flame, CalendarDays, Download, Upload, Trash2,
  Clock, TrendingUp, AlertCircle, CheckCheck, Menu, X, FileText,
  Zap, Shield, Database, GitBranch, Server, Cpu, Activity,
  MessageSquare, Star, ArrowRight, Hash, Layers, Box, Play,
  Coffee, Globe, Lock, Eye, RotateCcw, Award, ChevronUp
} from "lucide-react";

// ════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════════════════

const CAT_META = {
  DSA:       { label:"DSA",      icon: Code2,       ring:"ring-blue-500/30",   bg:"bg-blue-950/40",  border:"border-blue-800/40",  text:"text-blue-300",   badge:"bg-blue-900/60 text-blue-300 border border-blue-700/40",   bar:"bg-blue-500"      },
  HLD:       { label:"HLD",      icon: Brain,        ring:"ring-purple-500/30", bg:"bg-purple-950/40",border:"border-purple-800/40",text:"text-purple-300", badge:"bg-purple-900/60 text-purple-300 border border-purple-700/40",bar:"bg-purple-500"    },
  LLD:       { label:"LLD",      icon: Layers,       ring:"ring-orange-500/30", bg:"bg-orange-950/40",border:"border-orange-800/40",text:"text-orange-300", badge:"bg-orange-900/60 text-orange-300 border border-orange-700/40",bar:"bg-orange-500"    },
  Java:      { label:"Java",     icon: Coffee,       ring:"ring-cyan-500/30",   bg:"bg-cyan-950/40",  border:"border-cyan-800/40",  text:"text-cyan-300",   badge:"bg-cyan-900/60 text-cyan-300 border border-cyan-700/40",     bar:"bg-cyan-500"      },
  Go:        { label:"Go",       icon: Zap,          ring:"ring-teal-500/30",   bg:"bg-teal-950/40",  border:"border-teal-800/40",  text:"text-teal-300",   badge:"bg-teal-900/60 text-teal-300 border border-teal-700/40",     bar:"bg-teal-500"      },
  Backend:   { label:"Backend",  icon: Server,       ring:"ring-sky-500/30",    bg:"bg-sky-950/40",   border:"border-sky-800/40",   text:"text-sky-300",    badge:"bg-sky-900/60 text-sky-300 border border-sky-700/40",        bar:"bg-sky-500"       },
  Behavioral:{ label:"Behavioral",icon:Users,        ring:"ring-yellow-500/30", bg:"bg-yellow-950/40",border:"border-yellow-800/40",text:"text-yellow-300", badge:"bg-yellow-900/60 text-yellow-300 border border-yellow-700/40",bar:"bg-yellow-500"   },
  Revision:  { label:"Revision", icon: RotateCcw,    ring:"ring-green-500/30",  bg:"bg-green-950/40", border:"border-green-800/40", text:"text-green-300",  badge:"bg-green-900/60 text-green-300 border border-green-700/40",   bar:"bg-green-500"    },
  Mock:      { label:"Mock",     icon: Award,        ring:"ring-pink-500/30",   bg:"bg-pink-950/40",  border:"border-pink-800/40",  text:"text-pink-300",   badge:"bg-pink-900/60 text-pink-300 border border-pink-700/40",     bar:"bg-pink-500"      },
};

const PRIORITY_META = {
  Critical: { text:"text-red-400",    dot:"bg-red-400"    },
  High:     { text:"text-orange-400", dot:"bg-orange-400" },
  Medium:   { text:"text-yellow-400", dot:"bg-yellow-400" },
  Low:      { text:"text-slate-500",  dot:"bg-slate-500"  },
};

// ════════════════════════════════════════════════════════════
// DATE HELPERS
// ════════════════════════════════════════════════════════════

const START = new Date(2026, 5, 17);
const END   = new Date(2026, 7, 31);

const addDays  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtShort = d => d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
const fmtFull  = d => d.toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" });
const fmtDay   = d => d.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
const isoDate  = d => d.toISOString().split("T")[0];
const TODAY    = new Date(); // or use new Date(2026,5,10) for demo

// ════════════════════════════════════════════════════════════
// FULL CURRICULUM DATA
// ════════════════════════════════════════════════════════════

const DSA = {
  1: {
    pattern: "Two Pointers & Fast/Slow Pointers",
    theory: [
      "Two Pointers: converging (left/right), same-direction (slow/fast)",
      "When to use: sorted arrays, palindrome checks, pair-sum problems",
      "Fast/Slow (Floyd's): cycle detection, middle of list, duplicate in range",
    ],
    template: `// Two Pointers — Converging
function twoPointers(arr) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    // process arr[l] and arr[r]
    if (condition) l++;
    else r--;
  }
}
// Fast/Slow — Cycle Detection
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    mustSolve: ["Valid Palindrome","Two Sum II (sorted)","Container With Most Water","3Sum","Trapping Rain Water","Linked List Cycle","Find the Duplicate Number","Linked List Cycle II"],
    optional:  ["Four Sum","Sort Colors (Dutch Flag)","Move Zeroes","Happy Number"],
    revisionNote: "Focus: edge cases with 0s, negatives; explain why two pointers works vs brute force",
  },
  2: {
    pattern: "Sliding Window",
    theory: [
      "Fixed window: maintain exact size k, slide by adding right / removing left",
      "Variable window: expand right until invalid, shrink left to restore validity",
      "Key insight: avoid recomputation — update incrementally",
      "HashMap usage: char frequency in window vs target",
    ],
    template: `// Variable Sliding Window
function slidingWindow(s) {
  let l = 0, res = 0;
  const map = new Map();
  for (let r = 0; r < s.length; r++) {
    map.set(s[r], (map.get(s[r]) || 0) + 1);
    while (/* window invalid */) {
      map.set(s[l], map.get(s[l]) - 1);
      if (!map.get(s[l])) map.delete(s[l]);
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
    mustSolve: ["Longest Substring Without Repeating Characters","Minimum Window Substring","Permutation in String","Find All Anagrams in a String","Longest Repeating Character Replacement","Max Consecutive Ones III"],
    optional:  ["Sliding Window Maximum","Fruit Into Baskets","Minimum Size Subarray Sum"],
    revisionNote: "Drill: clearly define 'window valid' condition before coding",
  },
  3: {
    pattern: "Hashing & Prefix Sum",
    theory: [
      "HashMap for O(1) lookup: frequency maps, complement lookup, grouping",
      "Prefix sum: running sum array allows range sum in O(1)",
      "Prefix sum + HashMap: subarray sum equals K in O(n)",
      "Modular prefix sum for divisibility problems",
    ],
    template: `// Prefix Sum + HashMap (Subarray Sum = K)
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, res = 0;
  for (const n of nums) {
    sum += n;
    res += (map.get(sum - k) || 0);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return res;
}`,
    mustSolve: ["Two Sum","Group Anagrams","Longest Consecutive Sequence","Subarray Sum Equals K","Product of Array Except Self","Top K Frequent Elements","Encode and Decode Strings"],
    optional:  ["Contains Duplicate II","Valid Sudoku","Contiguous Array","Continuous Subarray Sum"],
    revisionNote: "Common mistake: forgetting to initialize map with {0:1} for prefix sum patterns",
  },
  4: {
    pattern: "Intervals & Binary Search",
    theory: [
      "Intervals: sort by start, merge overlapping, sweep line for scheduling",
      "Meeting rooms: sort by start, min-heap tracking end times",
      "Binary search: classic, rotated, search space (answer BS)",
      "BS on answer: when asked for min/max satisfying a condition",
    ],
    template: `// Merge Intervals
function merge(intervals) {
  intervals.sort((a,b) => a[0]-b[0]);
  const res = [intervals[0]];
  for (const [s,e] of intervals.slice(1)) {
    if (s <= res.at(-1)[1]) res.at(-1)[1] = Math.max(res.at(-1)[1], e);
    else res.push([s,e]);
  }
  return res;
}
// Binary Search on Search Space
function binarySearchAnswer(lo, hi, feasible) {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    mustSolve: ["Merge Intervals","Insert Interval","Meeting Rooms II","Employee Free Time","Binary Search","Find Minimum in Rotated Sorted Array","Search in Rotated Sorted Array","Koko Eating Bananas","Capacity To Ship Packages","Median of Two Sorted Arrays"],
    optional:  ["Non-overlapping Intervals","Minimum Number of Arrows","Time Based Key-Value Store","Find Peak Element"],
    revisionNote: "BS invariant: always know which half to eliminate and why",
  },
  5: {
    pattern: "Linked List, Stack & Monotonic Stack",
    theory: [
      "Linked list patterns: reversal, merge, fast/slow for middle/kth",
      "Dummy head simplifies edge cases at head insertion/deletion",
      "Stack: LIFO for matching brackets, next greater element",
      "Monotonic stack: maintain increasing/decreasing order for span problems",
    ],
    template: `// Reverse Linked List (iterative)
function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    [curr.next, prev, curr] = [prev, curr, curr.next];
  }
  return prev;
}
// Monotonic Stack (Next Greater Element)
function nextGreater(nums) {
  const res = new Array(nums.length).fill(-1), stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i])
      res[stack.pop()] = nums[i];
    stack.push(i);
  }
  return res;
}`,
    mustSolve: ["Reverse Linked List","Merge Two Sorted Lists","Reorder List","Remove Nth From End","Copy List with Random Pointer","Add Two Numbers","Valid Parentheses","Min Stack","Daily Temperatures","Largest Rectangle in Histogram"],
    optional:  ["LRU Cache","Find the Duplicate Number","Rotate List","Car Fleet"],
    revisionNote: "LRU cache is a common hidden linked-list problem — practice HashMap + DLL",
  },
  6: {
    pattern: "Heap & Greedy",
    theory: [
      "Min-heap / Max-heap: top-K problems, merge K sorted, running median",
      "Two-heap pattern: balance halves for median stream",
      "Greedy: prove locally optimal = globally optimal; interval scheduling",
      "When greedy fails: use DP",
    ],
    template: `// Top K Frequent (Bucket Sort O(n))
function topKFrequent(nums, k) {
  const freq = new Map(), buckets = Array.from({length:nums.length+1}, ()=>[]);
  for (const n of nums) freq.set(n, (freq.get(n)||0)+1);
  for (const [n,f] of freq) buckets[f].push(n);
  const res = [];
  for (let i = buckets.length-1; i >= 0 && res.length < k; i--)
    res.push(...buckets[i]);
  return res.slice(0,k);
}`,
    mustSolve: ["Kth Largest Element in Array","Top K Frequent Elements","K Closest Points to Origin","Task Scheduler","Jump Game","Jump Game II","Gas Station","Hand of Straights","Merge K Sorted Lists","Find Median from Data Stream"],
    optional:  ["IPO","Single-Threaded CPU","Minimize Maximum Pair Sum","Reorganize String"],
    revisionNote: "Heap problems: always think about what invariant to maintain in the heap",
  },
  7: {
    pattern: "Trees: DFS, BFS, BST & Serialization",
    theory: [
      "DFS: pre/in/post order — use for path problems, construction",
      "BFS: level order — use for shortest path in trees, level-by-level",
      "BST properties: in-order traversal gives sorted order",
      "LCA: binary lifting for large trees; recursion for standard LCA",
      "Serialization: pre-order with null markers, or BFS level-order",
    ],
    template: `// DFS Path Sum
function hasPathSum(root, target) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === target;
  return hasPathSum(root.left, target-root.val) ||
         hasPathSum(root.right, target-root.val);
}
// BFS Level Order
function levelOrder(root) {
  if (!root) return [];
  const q = [root], res = [];
  while (q.length) {
    const level = [], len = q.length;
    for (let i=0; i<len; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left)  q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
    mustSolve: ["Invert Binary Tree","Maximum Depth of Binary Tree","Diameter of Binary Tree","Balanced Binary Tree","Same Tree","Subtree of Another Tree","LCA of BST","Binary Tree Level Order","Binary Tree Right Side View","Count Good Nodes","Validate BST","Kth Smallest in BST","Construct from Preorder+Inorder","Serialize and Deserialize Binary Tree","Binary Tree Maximum Path Sum"],
    optional:  ["Path Sum II","Sum Root to Leaf Numbers","Flatten Binary Tree to LL","Populating Next Right Pointers"],
    revisionNote: "Recursive DFS: always handle null base case first; return type must be consistent",
  },
  8: {
    pattern: "Graphs: BFS, DFS, Topological Sort & Shortest Path",
    theory: [
      "Graph representations: adjacency list (sparse), matrix (dense)",
      "BFS: shortest path in unweighted, level-by-level exploration",
      "DFS: connectivity, cycle detection, topological order",
      "Topo sort: Kahn's (BFS + in-degree) or DFS post-order",
      "Dijkstra: min-heap, greedy shortest path for non-negative weights",
      "Bellman-Ford: handles negative weights, detects negative cycles",
    ],
    template: `// Topological Sort (Kahn's BFS)
function topoSort(n, edges) {
  const indegree = new Array(n).fill(0), adj = Array.from({length:n},()=>[]);
  for (const [u,v] of edges) { adj[u].push(v); indegree[v]++; }
  const q = [], res = [];
  for (let i=0; i<n; i++) if (!indegree[i]) q.push(i);
  while (q.length) {
    const u = q.shift(); res.push(u);
    for (const v of adj[u]) if (--indegree[v] === 0) q.push(v);
  }
  return res.length === n ? res : []; // empty = cycle
}`,
    mustSolve: ["Number of Islands","Max Area of Island","Clone Graph","Walls and Gates","Rotting Oranges","Pacific Atlantic Water Flow","Course Schedule","Course Schedule II","Graph Valid Tree","Number of Connected Components","Redundant Connection","Alien Dictionary","Network Delay Time","Cheapest Flights Within K Stops","Swim in Rising Water"],
    optional:  ["Word Ladder","Reconstruct Itinerary","Min Cost to Connect All Points","Find Critical and Pseudo-Critical Edges"],
    revisionNote: "Always clarify directed vs undirected; cycle detection differs between them",
  },
  9: {
    pattern: "Backtracking, Trie & Union-Find",
    theory: [
      "Backtracking: explore → recurse → undo (three-step mental model)",
      "Pruning: sort + skip duplicates for subset/combination problems",
      "Trie: prefix tree for autocomplete, word search; O(L) ops",
      "Union-Find with path compression + union by rank: near O(1) amortized",
    ],
    template: `// Backtracking Template
function backtrack(result, current, start, candidates) {
  result.push([...current]);
  for (let i = start; i < candidates.length; i++) {
    if (i > start && candidates[i] === candidates[i-1]) continue; // skip dup
    current.push(candidates[i]);
    backtrack(result, current, i+1, candidates);
    current.pop();
  }
}
// Union-Find
class UF {
  constructor(n) { this.p = Array.from({length:n},(_,i)=>i); this.rank=new Array(n).fill(0); }
  find(x) { if (this.p[x]!==x) this.p[x]=this.find(this.p[x]); return this.p[x]; }
  union(a,b) { const [pa,pb]=[this.find(a),this.find(b)]; if(pa===pb)return false; if(this.rank[pa]<this.rank[pb])this.p[pa]=pb; else if(this.rank[pa]>this.rank[pb])this.p[pb]=pa; else{this.p[pb]=pa;this.rank[pa]++;} return true; }
}`,
    mustSolve: ["Subsets","Subsets II","Combination Sum","Combination Sum II","Permutations","Permutations II","Word Search","N-Queens","Palindrome Partitioning","Implement Trie","Design Add and Search Words","Word Search II","Redundant Connection","Accounts Merge","Number of Connected Components"],
    optional:  ["Letter Combinations of Phone Number","Generate Parentheses","Sudoku Solver","Expression Add Operators"],
    revisionNote: "Backtracking: draw recursion tree before coding; identify choices, constraints, goals",
  },
  10: {
    pattern: "Dynamic Programming: 1D, 2D, Knapsack & String DP",
    theory: [
      "DP = recursion + memoization (top-down) or tabulation (bottom-up)",
      "Identify: optimal substructure + overlapping subproblems",
      "1D DP: Fibonacci-style, house robber, climbing stairs",
      "Knapsack 0/1: take or leave each item; 2D table dp[i][w]",
      "String DP: LCS, edit distance; dp[i][j] for two strings",
      "State machine DP: stock problems with cooldown/transaction limits",
    ],
    template: `// 0/1 Knapsack
function knapsack(weights, values, W) {
  const n = weights.length, dp = Array.from({length:n+1},()=>new Array(W+1).fill(0));
  for (let i=1; i<=n; i++)
    for (let w=0; w<=W; w++) {
      dp[i][w] = dp[i-1][w];
      if (weights[i-1] <= w) dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weights[i-1]]+values[i-1]);
    }
  return dp[n][W];
}
// LCS
function lcs(s1, s2) {
  const dp = Array.from({length:s1.length+1},()=>new Array(s2.length+1).fill(0));
  for (let i=1; i<=s1.length; i++)
    for (let j=1; j<=s2.length; j++)
      dp[i][j] = s1[i-1]===s2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j],dp[i][j-1]);
  return dp[s1.length][s2.length];
}`,
    mustSolve: ["Climbing Stairs","Min Cost Climbing Stairs","House Robber","House Robber II","Longest Palindromic Substring","Palindromic Substrings","Decode Ways","Coin Change","Maximum Product Subarray","Word Break","Longest Increasing Subsequence","Partition Equal Subset Sum","Target Sum","Edit Distance","Longest Common Subsequence","Distinct Subsequences","Interleaving String","Regular Expression Matching"],
    optional:  ["Burst Balloons","Remove Boxes","Strange Printer"],
    revisionNote: "Draw the DP table for string problems before writing code",
  },
  11: {
    pattern: "Mixed Review, Weak Areas & Mock Preparation",
    theory: [
      "Review all 10 pattern templates — reproduce from memory",
      "Focus 80% time on patterns where you scored below 70%",
      "Practice communicating complexity analysis in 30 seconds",
      "Timed mock conditions: 25 min medium, 40 min hard",
    ],
    template: `// Meta-skill: Structured Problem Solving
// 1. Clarify (2 min): input/output, constraints, edge cases
// 2. Brute force (2 min): state the O(n²) / O(2^n) solution
// 3. Optimize (5 min): identify bottleneck, apply pattern
// 4. Code (15 min): clean, readable, no syntax errors
// 5. Test (5 min): walk through 2 examples + edge case`,
    mustSolve: ["Review top 3 missed problems from each week","1 timed Hard problem daily","Full system design in 45 min"],
    optional:  ["Competitive programming mixed set","Novel problem you've never seen"],
    revisionNote: "Mock loop format: 45min DSA → 45min HLD → 30min LLD → 30min Behavioral",
  },
};

const HLD = {
  1: {
    topic: "Foundations: Scalability, Availability, CAP, PACELC",
    theory: ["Horizontal vs Vertical scaling, stateless design","Availability = uptime / (uptime+downtime); nines math (99.9% = 8.76h downtime/yr)","CAP: Consistency, Availability, Partition Tolerance — can only guarantee 2","PACELC: extends CAP with latency/consistency tradeoff under normal operation","Reliability: redundancy, fault isolation, graceful degradation"],
    readingLinks: ["https://github.com/ashishps1/awesome-system-design-resources","Martin Kleppmann — Designing Data-Intensive Applications Ch. 1"],
    question: "Design a Global CDN",
    tradeoffs: ["Push vs Pull CDN for different content freshness needs","Edge caching vs origin shield architecture","DNS-based vs Anycast routing"],
  },
  2: {
    topic: "Networking: DNS, HTTP/HTTPS, Load Balancers, API Gateway",
    theory: ["DNS resolution chain: recursive vs iterative; TTL implications","HTTP/1.1 vs HTTP/2 (multiplexing) vs HTTP/3 (QUIC)","L4 vs L7 load balancing; algorithms: round-robin, least-conn, IP-hash","Reverse proxy, forward proxy, API Gateway as single-entry","TLS handshake, certificate pinning, mutual TLS"],
    readingLinks: ["ByteByteGo — How does HTTPS work?","Cloudflare Learning Center — What is a load balancer?"],
    question: "Design a URL Shortener (short.ly)",
    tradeoffs: ["Base62 encoding vs hash collision handling","Read-heavy: cache aggressively; custom domains add complexity"],
  },
  3: {
    topic: "Caching: Redis, Patterns, Eviction",
    theory: ["Cache-aside (lazy loading): read from cache, miss → DB → populate","Write-through: write to cache + DB synchronously; consistent but slower writes","Write-back: write to cache, async flush to DB; fast but data loss risk","Cache eviction: LRU, LFU, FIFO, TTL-based expiry","Cache stampede / thundering herd: probabilistic early expiry, mutex lock"],
    readingLinks: ["Redis official docs — Data Types","AWS ElastiCache — Caching Strategies"],
    question: "Design a Distributed Cache Layer (like Redis Cluster)",
    tradeoffs: ["Consistent hashing for node addition/removal","Memory vs disk persistence (RDB vs AOF)","Single-threaded Redis model and why it works"],
  },
  4: {
    topic: "Storage: SQL, NoSQL, Indexing, Partitioning, Replication",
    theory: ["ACID (Atomicity, Consistency, Isolation, Durability) in relational DBs","NoSQL types: document (MongoDB), wide-column (Cassandra), KV (DynamoDB), graph","B-Tree vs LSM-Tree index structures — read vs write optimization","Horizontal partitioning (sharding) by range, hash, list; hotspot mitigation","Leader-follower replication; multi-leader; leaderless (quorum reads/writes)"],
    readingLinks: ["DDIA Ch. 3 — Storage and Retrieval","DDIA Ch. 5 — Replication"],
    question: "Design a Multi-Region User Service",
    tradeoffs: ["Strong vs eventual consistency trade-off for global writes","Read replicas for geographic latency reduction","Schema flexibility (NoSQL) vs query power (SQL)"],
  },
  5: {
    topic: "Messaging: Kafka, Pub/Sub, Event-Driven Architecture",
    theory: ["Kafka architecture: brokers, topics, partitions, consumer groups, offsets","Producer acks: 0 / 1 / all — durability vs latency tradeoff","Exactly-once semantics: idempotent producers + transactional API","Consumer group rebalancing: triggers, strategies (eager vs cooperative)","Event sourcing vs event streaming; CQRS pattern","Dead letter queues, retry topics, poison pill handling"],
    readingLinks: ["Confluent — Kafka in a Nutshell","Engineering at Meta — Real-time data pipeline"],
    question: "Design a Notification Service (Email + Push + SMS)",
    tradeoffs: ["Fan-out on write vs fan-out on read","Rate limiting per channel to avoid spam","Multi-tenant isolation in shared Kafka cluster"],
  },
  6: {
    topic: "Distributed Transactions: 2PC, Saga, Distributed Locks",
    theory: ["2PC (Two-Phase Commit): prepare + commit; coordinator SPOF problem","Saga pattern: choreography (event-driven) vs orchestration (central coordinator)","Compensating transactions for rollback in Sagas","Distributed locks: Redis SETNX, Redlock algorithm, ZooKeeper","Idempotency keys: UUID per request, deduplication window"],
    readingLinks: ["DDIA Ch. 9 — Consistency and Consensus","Stripe Engineering — Idempotency"],
    question: "Design a Payment System",
    tradeoffs: ["Saga vs 2PC: complexity vs consistency guarantee","Idempotency at API layer vs event layer","Ledger vs balance model for account storage"],
  },
  7: {
    topic: "Rate Limiting & Traffic Control",
    theory: ["Token bucket: allows bursts, smooth refill rate — good for API limits","Leaky bucket: constant output rate, absorbs bursts — good for network shaping","Sliding window log: accurate but memory-heavy","Sliding window counter: approximate, memory-efficient hybrid","Distributed rate limiting: Redis INCR + TTL, Lua scripts for atomicity"],
    readingLinks: ["Cloudflare Engineering — How we built ratelimiting","AWS API Gateway — Throttling"],
    question: "Design a Distributed Rate Limiter",
    tradeoffs: ["Per-user vs per-IP vs per-endpoint granularity","Global vs per-region limits for geo-distributed services","Hard limit vs soft limit vs circuit breaker strategy"],
  },
  8: {
    topic: "System Case Study: Chat & Real-Time Systems",
    theory: ["WebSockets: full-duplex, persistent connection; vs SSE (one-way)","Presence service: heartbeat + TTL, subscribe-notify pattern","Message ordering: logical clocks (Lamport), vector clocks","Fan-out: write to each recipient's mailbox (push) or compute on read (pull)","Storage: recent messages in Redis, historical in Cassandra (time-series friendly)"],
    readingLinks: ["High Scalability — WhatsApp Architecture","ByteByteGo — Design WhatsApp"],
    question: "Design WhatsApp (1-on-1 + Group Chat)",
    tradeoffs: ["Push vs pull message delivery","Offline message queueing strategy","End-to-end encryption key exchange design"],
  },
  9: {
    topic: "System Case Study: Ride Hailing & Geo-Search",
    theory: ["Geo-indexing: Geohash (string prefix) vs H3 (Uber hexagons) vs Quadtree","Driver matching: supply-demand proximity scoring, weighted bipartite matching","Location updates: write-heavy stream; batch vs streaming ingestion","Trip state machine: REQUESTED → ACCEPTED → ARRIVED → IN_RIDE → COMPLETED","Surge pricing: real-time supply/demand ratio across geo cells"],
    readingLinks: ["Uber Engineering Blog — H3 Geo Grid","ByteByteGo — Design Uber"],
    question: "Design Uber (Driver Matching + Dispatch)",
    tradeoffs: ["Strong consistency for trip state vs eventual for driver location","Geohash cell size vs query precision tradeoff","WebSocket vs polling for driver location stream"],
  },
  10: {
    topic: "System Case Study: News Feed & Recommendation",
    theory: ["Feed generation: push (fan-out on write) vs pull (fan-out on read) vs hybrid","Ranking signals: recency, engagement, relationship strength, ML score","Content graph: following relationships, interest vectors","Timeline cache: Redis sorted set by timestamp per user","Recommendation: collaborative filtering, content-based, matrix factorization"],
    readingLinks: ["Meta Engineering — News Feed Ranking","Spotify Engineering — Discover Weekly"],
    question: "Design Twitter/Instagram Feed",
    tradeoffs: ["Celebrity user fan-out problem (millions of followers)","Hot vs cold storage for old posts","Read-heavy optimization vs write amplification"],
  },
  11: {
    topic: "System Case Study: Video Streaming & Search",
    theory: ["Video ingestion: upload → transcode (HLS/DASH chunks) → CDN distribute","Adaptive bitrate streaming: client selects quality based on bandwidth","Search: inverted index (Elasticsearch), tokenization, relevance scoring BM25","Video metadata vs video bytes: different storage and access patterns","P2P CDN: BitTorrent-inspired for large-scale distribution"],
    readingLinks: ["Netflix Tech Blog — Encoding and CDN","Elasticsearch Guide — Inverted Index"],
    question: "Design Netflix + YouTube Search",
    tradeoffs: ["Pre-encoding all resolutions vs on-demand transcoding","Warm vs cold CDN cache for niche content","Real-time search suggestions vs batch index rebuild"],
  },
};

const LLD = {
  1: {
    topic: "OOP, SOLID Principles & Clean Code",
    theory: ["SRP: one reason to change; extract concerns into separate classes","OCP: open for extension (abstract/interface), closed for modification","LSP: subclasses must be substitutable for their superclass","ISP: many small interfaces better than one large; avoid fat interfaces","DIP: depend on abstractions; inject concrete implementations","Code smells: long method, feature envy, data clumps, primitive obsession"],
    question: "Refactor: Design a Notification System applying all 5 SOLID principles",
    machineCode: false,
  },
  2: {
    topic: "Creational Patterns: Factory, Abstract Factory, Builder, Singleton",
    theory: ["Factory Method: delegate object creation to subclasses; decouples client from concrete type","Abstract Factory: factory of factories; families of related objects","Builder: step-by-step construction for complex objects with many optional fields","Singleton: single instance guarantee; thread-safe via double-checked locking or enum (Java)","Prototype: clone existing objects; useful when creation is expensive"],
    question: "Implement: Thread-safe Singleton + Logger Factory with file/console strategies",
    machineCode: false,
  },
  3: {
    topic: "Behavioral Patterns: Strategy, Observer, Command, State",
    theory: ["Strategy: encapsulate algorithms, swap at runtime; eliminates conditionals","Observer: publish-subscribe; event bus, decoupled components","Command: encapsulate request as object; undo/redo, queuing, logging","State: objects whose behavior changes with internal state; eliminates switch/if chains","Chain of Responsibility: pass request through handlers until processed"],
    question: "Implement: Event-driven Order Processing with Strategy (pricing) + Observer (notifications)",
    machineCode: false,
  },
  4: {
    topic: "Structural Patterns: Adapter, Decorator, Proxy, Facade",
    theory: ["Adapter: bridge incompatible interfaces; wraps existing class","Decorator: add responsibilities dynamically; composable middleware","Proxy: control access; virtual (lazy), remote, protection proxy","Facade: simplify complex subsystem; single entry point","Composite: tree structures; treat leaf and composite uniformly"],
    question: "Implement: HTTP middleware chain using Decorator + Legacy API Adapter",
    machineCode: false,
  },
  5: {
    topic: "Concurrency: Threads, Locks, Semaphores & Deadlock Prevention",
    theory: ["Thread lifecycle: NEW → RUNNABLE → BLOCKED/WAITING → TERMINATED","Mutex: mutual exclusion; only one thread at a time","Semaphore: counting permits; producer-consumer, connection pools","Deadlock: four conditions (MCWN); prevention strategies","ReentrantLock vs synchronized in Java; TTAS vs TAS spinlocks","Java memory model: happens-before, visibility, volatile, atomic classes"],
    question: "Implement: Thread-safe Blocking Queue (producer-consumer) with proper locks",
    machineCode: true,
  },
  6: {
    topic: "Java Collections Internals: HashMap, ConcurrentHashMap, ArrayList",
    theory: ["HashMap: array of buckets, hash function, collision (chaining), load factor 0.75, resize","TreeMap: Red-Black tree, O(log n) ops, sorted keys","ConcurrentHashMap: segment locking (Java 7) → CAS + synchronized bucket (Java 8)","ArrayList: dynamic array, amortized O(1) add, O(n) insert-at-index","LinkedHashMap: HashMap + doubly-linked list for insertion order (LRU cache base)","PriorityQueue: binary heap, O(log n) offer/poll"],
    question: "Implement: LRU Cache using LinkedHashMap internals + thread-safe version",
    machineCode: true,
  },
  7: {
    topic: "API Design: REST, gRPC, Idempotency, Versioning",
    theory: ["REST: resources as nouns, HTTP verbs for actions, stateless, HATEOAS","gRPC: Protocol Buffers, bidirectional streaming, strongly typed contracts","Idempotency: safe re-execution; POST idempotency via idempotency-key header","API versioning: URL path (/v1/), header, query param — tradeoffs","Rate limiting in API: 429 response, Retry-After header, exponential backoff","OpenAPI / Swagger for contract-first development"],
    question: "Design: Complete REST + gRPC API for a Ride-Sharing Dispatch Service",
    machineCode: false,
  },
  8: {
    topic: "Database Schema Design: Normalization, Denormalization, Indexing",
    theory: ["Normal forms: 1NF→2NF→3NF→BCNF; eliminate partial/transitive dependencies","Denormalization: intentional redundancy for read performance","Index types: B-tree (range queries), Hash (equality), Composite (column order matters)","EXPLAIN / query plan analysis; covering index vs index scan vs seq scan","Schema evolution: additive changes safe; column removal/rename needs migration strategy","Multi-tenancy: shared schema (tenant_id column) vs separate schema vs separate DB"],
    question: "Design: Complete database schema for an E-Commerce platform (users, orders, inventory, payments)",
    machineCode: false,
  },
  9: {
    topic: "Machine Coding: Parking Lot",
    theory: ["Entity identification: ParkingLot, Floor, Spot (Compact/Large/Handicapped), Vehicle, Ticket, Payment","Strategy pattern for billing (hourly, flat, subscription)","Observer for availability notifications","Singleton for ParkingLot (one instance per location)"],
    question: "Implement: Full Parking Lot — allocation, billing, vehicle types, availability tracking",
    machineCode: true,
  },
  10: {
    topic: "Machine Coding: Elevator System",
    theory: ["State machine: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN","SCAN algorithm (elevator algorithm): serve requests in current direction first","Request types: internal (floor button) vs external (hall button with direction)","Priority queue for scheduled floors; multiple elevator coordination"],
    question: "Implement: Elevator Controller with SCAN scheduling + multi-elevator support",
    machineCode: true,
  },
  11: {
    topic: "Machine Coding: Splitwise & Movie Booking",
    theory: ["Splitwise: debt simplification (graph, minimize transactions), expense categories","Movie Booking: concurrent seat reservation (optimistic locking), seat map","State machines for booking: AVAILABLE → HELD → BOOKED → CANCELLED","Event sourcing for audit trail in financial splits"],
    question: "Implement: Splitwise debt simplification + Movie seat concurrent reservation",
    machineCode: true,
  },
};

const JAVA_TOPICS = [
  "JVM Architecture: heap, stack, metaspace, GC roots",
  "Garbage Collection: GC algorithms (G1, ZGC, Shenandoah), tuning flags",
  "Class Loading: bootstrap → extension → application classloaders, delegation model",
  "HashMap Internals: hash function, collision chaining, Java 8 tree bins, resize",
  "ConcurrentHashMap: CAS operations, bucket-level synchronization, compute methods",
  "ExecutorService: thread pool sizing (CPU vs IO bound), ForkJoinPool",
  "CompletableFuture: composition, exceptionally, whenComplete, async pipelines",
  "Java Memory Model: happens-before, volatile semantics, atomic classes",
  "Spring Core: IoC container, bean scopes (singleton/prototype), lifecycle callbacks",
  "Spring Transactions: @Transactional propagation, isolation levels, rollback rules",
  "Spring AOP: proxy types (JDK dynamic vs CGLIB), pointcut expressions, advice types",
  "Kafka + Spring: @KafkaListener, consumer group config, error handling, DLT",
];

const GO_TOPICS = [
  "Goroutines: lightweight threads, M:N scheduling, goroutine leak prevention",
  "Channels: buffered vs unbuffered, directional types, select with default",
  "Context: cancellation propagation, deadlines, WithValue (avoid overuse)",
  "sync.WaitGroup & sync.Mutex: coordinating goroutines, critical sections",
  "Interfaces: implicit satisfaction, empty interface, type assertions, embedding",
  "Go Scheduler: G-M-P model, preemption at safepoints, GOMAXPROCS",
  "Memory Model: happens-before in Go, atomic operations, sync/atomic package",
  "Escape Analysis: stack vs heap allocation, benchmarking allocations (-gcflags)",
  "Error Handling: errors.Is/As, wrapping with %w, sentinel errors vs types",
  "Profiling: pprof CPU/memory/goroutine profiles, trace tool, benchmark flags",
  "Go Concurrency Patterns: worker pools, fan-out/fan-in, pipeline, semaphore",
];

const BACKEND_TOPICS = [
  "REST Design: resource naming, HTTP verbs, status codes, HATEOAS, pagination",
  "gRPC: protobuf wire format, streaming types, interceptors, deadlines",
  "Idempotency: safe + idempotent methods, idempotency keys, dedup window",
  "Retries: exponential backoff, jitter, retry budgets, idempotency requirement",
  "Circuit Breakers: closed/open/half-open states, failure thresholds, Hystrix/Resilience4j",
  "Rate Limiting: token bucket, leaky bucket, sliding window — backend implementation",
  "Distributed Caching: cache-aside in service layer, read/write patterns, invalidation",
  "Kafka Producer/Consumer: at-least-once vs exactly-once, offset management",
  "Event-Driven Architecture: event schema design, schema registry, event versioning",
  "Observability: RED method (rate/errors/duration), structured logging, trace context",
  "Distributed Locks: use cases, Redis SETNX + Lua, lock expiry, fencing tokens",
];

const BEHAVIORAL = [
  { topic: "Leadership & Influence Without Authority",    prompt: "Tell me about a time you led a technical initiative without being the manager. How did you get buy-in?" },
  { topic: "Ownership & Delivering Under Constraints",   prompt: "Describe a project where you had to deliver with limited resources or time. What trade-offs did you make?" },
  { topic: "Conflict Resolution",                        prompt: "Tell me about a technical disagreement with a peer. How did you resolve it?" },
  { topic: "Failure, Learning & Recovery",               prompt: "Describe a significant production incident or project failure. What was your role and what did you learn?" },
  { topic: "Mentoring & Growing Others",                 prompt: "How have you helped a junior engineer grow? Give a specific example with measurable outcomes." },
  { topic: "Architecture Decisions & Trade-offs",        prompt: "Walk me through the most significant architectural decision you made. What alternatives did you consider?" },
  { topic: "Stakeholder Management",                     prompt: "Tell me about a time you had to manage conflicting priorities from multiple stakeholders." },
  { topic: "Navigating Ambiguity",                       prompt: "Describe a project with unclear requirements. How did you bring clarity and drive execution?" },
  { topic: "Cross-functional Collaboration",             prompt: "Give an example of working with non-technical teams (product, design, data). What made it successful?" },
  { topic: "Prioritization Under Pressure",              prompt: "How do you decide what to work on when everything is urgent? Give a specific example." },
  { topic: "Production Incident & On-call",              prompt: "Walk me through a major on-call incident. How did you diagnose, mitigate, and do postmortem?" },
];

const MOCKS = [
  { date: new Date(2026,6,12), label: "Mock 1 — DSA Sprint",         type: "DSA"     },
  { date: new Date(2026,6,26), label: "Mock 2 — DSA + HLD",          type: "DSA+HLD" },
  { date: new Date(2026,7, 9), label: "Mock 3 — Full Loop",          type: "Full"    },
  { date: new Date(2026,7,16), label: "Mock 4 — Full Loop",          type: "Full"    },
  { date: new Date(2026,7,23), label: "Mock 5 — Full Loop",          type: "Full"    },
  { date: new Date(2026,7,30), label: "Mock 6 — Final Loop",         type: "Full"    },
];

// ════════════════════════════════════════════════════════════
// CURRICULUM GENERATION
// ════════════════════════════════════════════════════════════

function buildCurriculum() {
  const weeks = [];

  const javaPool  = [...JAVA_TOPICS];
  const goPool    = [...GO_TOPICS];
  const bePool    = [...BACKEND_TOPICS];
  let behIdx = 0;

  for (let wk = 1; wk <= 11; wk++) {
    const wkStart = addDays(START, (wk-1)*7);
    const wkEnd   = addDays(wkStart, 6);
    const dsa     = DSA[wk];
    const hld     = HLD[wk];
    const lld     = LLD[wk];
    const prevDsa = wk > 1 ? DSA[wk-1] : null;
    const prevHld = wk > 1 ? HLD[wk-1] : null;
    const prevLld = wk > 1 ? LLD[wk-1] : null;
    const oldDsa  = wk > 3 ? DSA[wk-3] : null;
    const ancDsa  = wk > 6 ? DSA[wk-6] : null;

    const mockToday = MOCKS.find(m => {
      const sat = addDays(wkStart, 5);
      return m.date.toDateString() === sat.toDateString();
    });

    const days = [];
    for (let d = 0; d < 7; d++) {
      const date    = addDays(wkStart, d);
      const dayName = date.toLocaleDateString("en-US",{weekday:"long"});
      const dayKey  = `w${wk}_d${d+1}`;

      const javaItem  = javaPool.shift(); if (javaItem)  javaPool.push(javaItem);
      const goItem    = goPool.shift();   if (goItem)    goPool.push(goItem);
      const beItem    = bePool.shift();   if (beItem)    bePool.push(beItem);

      const tasks = [];

      // ── DSA ──────────────────────────────────────────────
      if (d < 5) {
        const probs  = dsa.mustSolve;
        const chunk  = Math.ceil(probs.length / 5);
        const slice  = probs.slice(d * chunk, (d+1) * chunk).slice(0, 3);
        tasks.push({
          id: `${dayKey}_dsa`, category: "DSA",
          title: `DSA — ${dsa.pattern}`,
          items: [
            { id:`${dayKey}_dsa_theory`, text:`Study theory: ${dsa.theory[d % dsa.theory.length]}`, priority:"High",   estimatedMin: 30 },
            ...slice.map((p,i) => ({ id:`${dayKey}_dsa_p${i}`, text:`Solve: ${p}`, priority: i===0?"Critical":"High", estimatedMin: 40 })),
          ],
        });
      }

      // ── HLD (Mon/Thu) ─────────────────────────────────────
      if (d === 0) {
        tasks.push({
          id:`${dayKey}_hld`, category:"HLD", title:`HLD Theory — ${hld.topic}`,
          items: [
            { id:`${dayKey}_hld_t0`, text:`Theory: ${hld.theory[0]}`, priority:"High", estimatedMin:40 },
            { id:`${dayKey}_hld_t1`, text:`Theory: ${hld.theory[1]}`, priority:"High", estimatedMin:40 },
            { id:`${dayKey}_hld_read`, text:`Reading: ${hld.readingLinks[0]}`, priority:"Medium", estimatedMin:20 },
          ],
        });
      }
      if (d === 3) {
        tasks.push({
          id:`${dayKey}_hld2`, category:"HLD", title:`HLD Design — ${hld.question}`,
          items: [
            { id:`${dayKey}_hld2_q`,  text:`Design: ${hld.question}`, priority:"Critical", estimatedMin:60 },
            { id:`${dayKey}_hld2_t0`, text:`Deep dive: ${hld.theory[2] || hld.theory[0]}`, priority:"High", estimatedMin:30 },
            { id:`${dayKey}_hld2_tr`, text:`Discuss trade-offs: ${hld.tradeoffs[0]}`, priority:"High", estimatedMin:20 },
          ],
        });
      }

      // ── LLD (Tue/Fri) ─────────────────────────────────────
      if (d === 1) {
        tasks.push({
          id:`${dayKey}_lld`, category:"LLD", title:`LLD Theory — ${lld.topic}`,
          items: [
            { id:`${dayKey}_lld_t0`, text:`Theory: ${lld.theory[0]}`, priority:"High", estimatedMin:40 },
            { id:`${dayKey}_lld_t1`, text:`Theory: ${lld.theory[1]}`, priority:"High", estimatedMin:40 },
          ],
        });
      }
      if (d === 4) {
        tasks.push({
          id:`${dayKey}_lld2`, category:"LLD", title:`LLD Practice — ${lld.question}`,
          items: [
            { id:`${dayKey}_lld2_q`, text:`Code: ${lld.question}`, priority:"Critical", estimatedMin: lld.machineCode ? 90 : 60 },
            { id:`${dayKey}_lld2_t`, text:`Review: ${lld.theory[2] || lld.theory[0]}`, priority:"Medium", estimatedMin:20 },
          ],
        });
      }

      // ── Behavioral (Wed) ──────────────────────────────────
      if (d === 2) {
        const beh = BEHAVIORAL[behIdx % BEHAVIORAL.length]; behIdx++;
        tasks.push({
          id:`${dayKey}_beh`, category:"Behavioral", title:`Behavioral — ${beh.topic}`,
          items: [
            { id:`${dayKey}_beh_0`, text:`Draft STAR story: ${beh.prompt}`, priority:"High", estimatedMin:45 },
            { id:`${dayKey}_beh_1`, text:"Deliver story aloud × 2 (record if possible)", priority:"Medium", estimatedMin:20 },
            { id:`${dayKey}_beh_2`, text:"Score: S-T-A-R clarity, engineering impact, numbers", priority:"Medium", estimatedMin:10 },
          ],
        });
      }

      // ── Java / Go / Backend ───────────────────────────────
      if ((d === 0 || d === 3) && javaItem) {
        tasks.push({
          id:`${dayKey}_java`, category:"Java",
          title:`Java Backend — ${javaItem.split(":")[0]}`,
          items:[{ id:`${dayKey}_java_0`, text:javaItem, priority:"Medium", estimatedMin:30 }],
        });
      }
      if ((d === 1 || d === 4) && goItem) {
        tasks.push({
          id:`${dayKey}_go`, category:"Go",
          title:`Go Backend — ${goItem.split(":")[0]}`,
          items:[{ id:`${dayKey}_go_0`, text:goItem, priority:"Medium", estimatedMin:30 }],
        });
      }
      if (d === 2 && beItem) {
        tasks.push({
          id:`${dayKey}_be`, category:"Backend",
          title:`Backend Engineering — ${beItem.split(":")[0]}`,
          items:[{ id:`${dayKey}_be_0`, text:beItem, priority:"Medium", estimatedMin:25 }],
        });
      }

      // ── Saturday: Mock or HLD Design ─────────────────────
      if (d === 5) {
        if (mockToday) {
          tasks.push({
            id:`${dayKey}_mock`, category:"Mock", title:`🎯 ${mockToday.label}`,
            items: [
              { id:`${dayKey}_mock_0`, text:"1× Medium DSA — 25 min timed, no hints", priority:"Critical", estimatedMin:25 },
              { id:`${dayKey}_mock_1`, text:"1× Hard DSA — 40 min timed", priority:"Critical", estimatedMin:40 },
              ...(mockToday.type !== "DSA" ? [
                { id:`${dayKey}_mock_2`, text:`HLD: ${hld.question} — 45 min, full design`, priority:"Critical", estimatedMin:45 },
              ] : []),
              ...(mockToday.type === "Full" ? [
                { id:`${dayKey}_mock_3`, text:`Behavioral: present one STAR story`, priority:"High", estimatedMin:20 },
                { id:`${dayKey}_mock_4`, text:`LLD: 30 min design question`, priority:"High", estimatedMin:30 },
              ] : []),
              { id:`${dayKey}_mock_5`, text:"Log: score, weak spots, notes (use Mock Tracker)", priority:"High", estimatedMin:15 },
            ],
          });
        } else {
          tasks.push({
            id:`${dayKey}_hld_deep`, category:"HLD", title:`System Design Deep Dive`,
            items:[
              { id:`${dayKey}_hld_deep_0`, text:`Full 45-min design: ${hld.question}`, priority:"Critical", estimatedMin:45 },
              { id:`${dayKey}_hld_deep_1`, text:`Theory recap: ${hld.theory[hld.theory.length-1]}`, priority:"High", estimatedMin:30 },
              { id:`${dayKey}_hld_deep_2`, text:`Trade-offs: ${hld.tradeoffs[hld.tradeoffs.length-1]}`, priority:"Medium", estimatedMin:20 },
            ],
          });
          tasks.push({
            id:`${dayKey}_lld_sat`, category:"LLD", title:`LLD Practice Sprint`,
            items:[
              { id:`${dayKey}_lld_sat_0`, text:`Code sprint: ${lld.question}`, priority:"High", estimatedMin:60 },
            ],
          });
        }
      }

      // ── Sunday: Revision ──────────────────────────────────
      if (d === 6) {
        const revItems = [
          prevDsa  && { id:`${dayKey}_rev_0`, text:`Re-solve (no hints): ${prevDsa.mustSolve[0]}`, priority:"Critical", estimatedMin:35 },
          prevDsa  && { id:`${dayKey}_rev_1`, text:`Re-solve: ${prevDsa.mustSolve[1] || prevDsa.mustSolve[0]}`, priority:"High", estimatedMin:35 },
          oldDsa   && { id:`${dayKey}_rev_2`, text:`Spaced review (3wk): ${oldDsa.mustSolve[0]}`, priority:"High", estimatedMin:30 },
          ancDsa   && { id:`${dayKey}_rev_3`, text:`Long-term review (6wk): ${ancDsa.mustSolve[0]}`, priority:"Medium", estimatedMin:25 },
          prevHld  && { id:`${dayKey}_rev_4`, text:`HLD recap: ${prevHld.topic.split(":")[0]}`, priority:"Medium", estimatedMin:30 },
          prevLld  && { id:`${dayKey}_rev_5`, text:`LLD recap: ${prevLld.topic.split(":")[0]}`, priority:"Medium", estimatedMin:20 },
                       { id:`${dayKey}_rev_6`, text:"Rehearse this week's STAR story aloud", priority:"Low", estimatedMin:15 },
          !prevDsa && { id:`${dayKey}_rev_7`, text:"Review Week 1 patterns from memory — write templates", priority:"High", estimatedMin:40 },
        ].filter(Boolean);
        tasks.push({
          id:`${dayKey}_rev`, category:"Revision", title:"Revision Day",
          items: revItems,
        });
      }

      const totalMin = tasks.reduce((s,t) => s + t.items.reduce((ss,i) => ss + i.estimatedMin, 0), 0);
      days.push({
        dayKey, date, dateStr: fmtDay(date), dayName,
        weekNum: wk, dayNum: d+1, tasks,
        totalItems: tasks.reduce((s,t)=>s+t.items.length,0),
        estimatedMinutes: totalMin,
      });
    }

    weeks.push({
      weekNum: wk, label: `Week ${wk}`,
      range: `${fmtShort(wkStart)} – ${fmtShort(wkEnd)}`,
      start: wkStart, end: wkEnd,
      goals: [
        `DSA: ${dsa.pattern}`,
        `HLD: ${hld.topic.split(":")[0].split(",")[0].trim()}`,
        `LLD: ${lld.topic.split(":")[0].trim()}`,
        `Behavioral: ${BEHAVIORAL[(wk-1) % BEHAVIORAL.length].topic}`,
      ],
      days,
      totalItems: days.reduce((s,d)=>s+d.totalItems,0),
    });
  }
  return weeks;
}

const CURRICULUM = buildCurriculum();

// ════════════════════════════════════════════════════════════
// PERSISTENCE HOOK
// ════════════════════════════════════════════════════════════

const STORAGE_KEY = "iptOS_v3";
const EMPTY_STATE = { completedTasks:{}, notes:{}, mockScores:{}, readinessScore:{}, revisions:{}, lastUpdated:"" };

function useLocalStorage() {
  const [state, setStateRaw] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...EMPTY_STATE, ...JSON.parse(raw) } : { ...EMPTY_STATE };
    } catch { return { ...EMPTY_STATE }; }
  });

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const withTs = { ...next, lastUpdated: new Date().toISOString() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(withTs)); } catch {}
      return withTs;
    });
  }, []);

  const toggleTask = useCallback((id) => {
    setState(prev => ({
      ...prev,
      completedTasks: {
        ...prev.completedTasks,
        [id]: prev.completedTasks[id] ? null : new Date().toISOString(),
      },
    }));
  }, [setState]);

  const setNote = useCallback((key, val) => {
    setState(prev => ({ ...prev, notes: { ...prev.notes, [key]: val } }));
  }, [setState]);

  const setMockScore = useCallback((key, val) => {
    setState(prev => ({ ...prev, mockScores: { ...prev.mockScores, [key]: val } }));
  }, [setState]);

  const resetAll = useCallback(() => {
    const fresh = { ...EMPTY_STATE };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch {}
    setStateRaw(fresh);
  }, []);

  return { state, toggleTask, setNote, setMockScore, resetAll, setState };
}

// ════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════

function calcProgress(state) {
  const cats = {};
  Object.keys(CAT_META).forEach(k => { cats[k] = { done:0, total:0 }; });
  let total = 0, done = 0;

  CURRICULUM.forEach(wk => wk.days.forEach(day => day.tasks.forEach(task => {
    const cat = task.category;
    task.items.forEach(item => {
      total++;
      if (cats[cat]) cats[cat].total++;
      if (state.completedTasks[item.id]) {
        done++;
        if (cats[cat]) cats[cat].done++;
      }
    });
  })));

  const pct = c => c.total ? Math.round(c.done / c.total * 100) : 0;
  return {
    overall: total ? Math.round(done / total * 100) : 0,
    DSA: pct(cats.DSA), HLD: pct(cats.HLD), LLD: pct(cats.LLD),
    Java: pct(cats.Java), Go: pct(cats.Go), Backend: pct(cats.Backend),
    Behavioral: pct(cats.Behavioral), Revision: pct(cats.Revision), Mock: pct(cats.Mock),
    totals: cats, done, total,
  };
}

function calcReadiness(prog) {
  return Math.round(prog.DSA * 0.40 + prog.HLD * 0.25 + prog.LLD * 0.15 +
    ((prog.Java + prog.Go + prog.Backend) / 3) * 0.10 + prog.Behavioral * 0.10);
}

function calcStreak(state) {
  let streak = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = 0; i < 120; i++) {
    const d = addDays(today, -i);
    const ds = d.toDateString();
    const hit = Object.values(state.completedTasks).some(ts => ts && new Date(ts).toDateString() === ds);
    if (hit) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function daysRemaining() {
  return Math.max(0, Math.ceil((END - new Date()) / 86400000));
}

function getCurrentWeek() {
  for (let i = 0; i < CURRICULUM.length; i++) {
    if (TODAY >= CURRICULUM[i].start && TODAY <= CURRICULUM[i].end) return i+1;
  }
  return TODAY < START ? 1 : 11;
}

// ════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ════════════════════════════════════════════════════════════

function ProgressBar({ value, colorClass = "bg-emerald-500", size = "md" }) {
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-3" : "h-1.5";
  return (
    <div className={`w-full ${h} bg-slate-800 rounded-full overflow-hidden`}>
      <div className={`${h} ${colorClass} rounded-full transition-all duration-500`} style={{width:`${Math.min(100,value)}%`}} />
    </div>
  );
}

function CatBadge({ category, small }) {
  const m = CAT_META[category] || CAT_META.DSA;
  return (
    <span className={`${small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"} rounded-full font-medium ${m.badge}`}>
      {m.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const m = PRIORITY_META[priority] || PRIORITY_META.Medium;
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${m.dot} flex-shrink-0 mt-1.5`} />;
}

function ReadinessGauge({ score }) {
  const r = 32, circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#eab308" : "#ef4444";
  const offset = circ - (score / 100) * circ;
  const label = score >= 80 ? "Interview Ready 🟢" : score >= 50 ? "On Track 🟡" : "Build Foundations 🔴";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" strokeWidth="7" stroke="#1e293b" />
        <circle cx="44" cy="44" r={r} fill="none" strokeWidth="7"
          stroke={color} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" />
      </svg>
      <div className="text-xl font-bold -mt-[72px] mb-[48px]" style={{color}}>{score}%</div>
      <div className="text-xs text-slate-400 text-center leading-tight">{label}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TASK ITEM
// ════════════════════════════════════════════════════════════

function TaskItem({ item, state, onToggle, onNote }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const checked = !!state.completedTasks[item.id];
  const noteKey = `note_${item.id}`;
  const note = state.notes[noteKey] || "";
  const m = PRIORITY_META[item.priority] || PRIORITY_META.Medium;

  return (
    <div className={`group transition-all ${checked ? "opacity-55" : ""}`}>
      <div className="flex items-start gap-2.5 py-1.5 px-3 rounded-lg hover:bg-slate-800/40 transition-colors">
        <button onClick={() => onToggle(item.id)} className="mt-0.5 flex-shrink-0 focus:outline-none">
          {checked
            ? <CheckCircle2 size={15} className="text-emerald-500" />
            : <Circle size={15} className="text-slate-700 group-hover:text-slate-500 transition-colors" />}
        </button>
        <PriorityDot priority={item.priority} />
        <div className="flex-1 min-w-0">
          <span className={`text-sm leading-snug ${checked ? "line-through text-slate-600" : "text-slate-200"}`}>
            {item.text}
          </span>
          {noteOpen && (
            <textarea
              className="mt-1.5 w-full bg-slate-800/80 border border-slate-700/60 rounded-md p-2 text-xs text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-slate-600 font-mono"
              rows={2}
              placeholder="Notes, links, insights..."
              value={note}
              onChange={e => onNote(noteKey, e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setNoteOpen(!noteOpen)} className="text-slate-600 hover:text-slate-400">
            <FileText size={12} />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-medium ${m.text} hidden sm:block`}>{item.priority}</span>
          <span className="text-[10px] text-slate-700 flex items-center gap-0.5"><Clock size={9}/>{item.estimatedMin}m</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TASK GROUP
// ════════════════════════════════════════════════════════════

function TaskGroup({ task, state, onToggle, onNote }) {
  const m = CAT_META[task.category] || CAT_META.DSA;
  const Icon = m.icon;
  const done = task.items.filter(i => state.completedTasks[i.id]).length;
  const total = task.items.length;

  return (
    <div className={`rounded-xl border ${m.border} ${m.bg} overflow-hidden mb-2`}>
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${m.border}`}>
        <Icon size={13} className={m.text} />
        <span className={`text-xs font-semibold ${m.text} flex-1`}>{task.title}</span>
        <span className="text-xs text-slate-600">{done}/{total}</span>
        {done === total && total > 0 && <CheckCheck size={12} className="text-emerald-500" />}
      </div>
      {task.items.map(item => (
        <TaskItem key={item.id} item={item} state={state} onToggle={onToggle} onNote={onNote} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DAY CARD
// ════════════════════════════════════════════════════════════

function DayCard({ day, state, onToggle, onNote, defaultOpen, noteKey }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const isToday = day.date.toDateString() === TODAY.toDateString();
  const done = day.tasks.reduce((s,t) => s + t.items.filter(i => state.completedTasks[i.id]).length, 0);
  const total = day.totalItems;
  const pct = total ? Math.round(done/total*100) : 0;
  const [note, setNoteLocal] = useState(state.notes[`dayNote_${day.dayKey}`] || "");
  const [noteOpen, setNoteOpen] = useState(false);
  const cats = [...new Set(day.tasks.map(t => t.category))];

  const handleNoteChange = (val) => {
    setNoteLocal(val);
    onNote(`dayNote_${day.dayKey}`, val);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isToday ? "border-emerald-700/60 shadow-lg shadow-emerald-950/20" : "border-slate-800"} bg-slate-900`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors text-left"
      >
        <div className="flex-shrink-0">
          {open ? <ChevronDown size={13} className="text-slate-600" /> : <ChevronRight size={13} className="text-slate-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${isToday ? "text-emerald-400" : "text-slate-200"}`}>{day.dayName}</span>
            <span className="text-xs text-slate-500">{day.dateStr}</span>
            {isToday && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/40 font-medium">TODAY</span>}
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {cats.map(c => <CatBadge key={c} category={c} small />)}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500">{done}/{total}</div>
            <div className={`text-xs font-bold ${pct===100?"text-emerald-400":"text-slate-500"}`}>{pct}%</div>
          </div>
          <div className="w-14 hidden sm:block">
            <ProgressBar value={pct} colorClass={pct===100?"bg-emerald-500":"bg-blue-500"} />
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-3 pb-3 pt-2">
          <div className="flex items-center gap-3 mb-3 px-1">
            <Clock size={11} className="text-slate-600" />
            <span className="text-xs text-slate-600">Estimated: {(day.estimatedMinutes / 60).toFixed(1)}h</span>
            <ProgressBar value={pct} colorClass={pct===100?"bg-emerald-500":"bg-blue-500"} size="sm" />
            <span className="text-xs text-slate-600 flex-shrink-0">{pct}%</span>
          </div>
          {day.tasks.map(task => (
            <TaskGroup key={task.id} task={task} state={state} onToggle={onToggle} onNote={onNote} />
          ))}
          <div className="mt-2">
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors mb-1"
            >
              <FileText size={11} />{noteOpen ? "Hide" : "Day notes"}
            </button>
            {noteOpen && (
              <textarea
                className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-700 resize-none focus:outline-none focus:border-slate-600 font-mono"
                rows={3}
                placeholder="Daily reflection, blockers, key takeaways..."
                value={note}
                onChange={e => handleNoteChange(e.target.value)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// WEEK PAGE
// ════════════════════════════════════════════════════════════

function WeekPage({ weekNum, state, onToggle, onNote }) {
  const week = CURRICULUM[weekNum - 1];
  const done  = week.days.reduce((s,d) => s + d.tasks.reduce((ss,t) => ss + t.items.filter(i => state.completedTasks[i.id]).length, 0), 0);
  const total = week.totalItems;
  const pct   = total ? Math.round(done/total*100) : 0;
  const curWeek = getCurrentWeek();
  const wkDsa = DSA[weekNum];
  const wkHld = HLD[weekNum];
  const wkLld = LLD[weekNum];

  return (
    <div className="space-y-5">
      {/* Week Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-100">{week.label}</h2>
              {weekNum === curWeek && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/40 font-medium">CURRENT</span>
              )}
            </div>
            <p className="text-sm text-slate-400">{week.range}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-3xl font-bold ${pct===100?"text-emerald-400":"text-slate-100"}`}>{pct}%</div>
            <div className="text-xs text-slate-500">{done}/{total} tasks</div>
          </div>
        </div>
        <ProgressBar value={pct} colorClass={pct===100?"bg-emerald-500":"bg-blue-500"} size="lg" />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {week.goals.map((g,i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <Target size={10} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="bg-slate-900 border border-blue-800/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={13} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-300">DSA Pattern</span>
          </div>
          <div className="text-sm text-slate-200 font-medium mb-2">{wkDsa.pattern}</div>
          <div className="text-xs text-slate-500 leading-relaxed">{wkDsa.theory[0].slice(0,80)}…</div>
        </div>
        <div className="bg-slate-900 border border-purple-800/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={13} className="text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">HLD Topic</span>
          </div>
          <div className="text-sm text-slate-200 font-medium mb-2">{wkHld.topic.split(":")[0]}</div>
          <div className="text-xs text-slate-500">{wkHld.question}</div>
        </div>
        <div className="bg-slate-900 border border-orange-800/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={13} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">LLD Topic</span>
          </div>
          <div className="text-sm text-slate-200 font-medium mb-2">{wkLld.topic.split(":")[0].split(",")[0]}</div>
          <div className="text-xs text-slate-500">{wkLld.machineCode ? "Machine Coding" : "Design Question"}</div>
        </div>
      </div>

      {/* DSA Template */}
      <details className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-slate-800/20 text-sm font-medium text-blue-300">
          <Code2 size={13} />DSA Template — {wkDsa.pattern}
        </summary>
        <pre className="px-4 pb-4 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed bg-slate-950/50 border-t border-slate-800">
          {wkDsa.template}
        </pre>
      </details>

      {/* Days */}
      <div className="space-y-2">
        {week.days.map(day => (
          <DayCard
            key={day.dayKey}
            day={day}
            state={state}
            onToggle={onToggle}
            onNote={onNote}
            defaultOpen={day.date.toDateString() === TODAY.toDateString()}
          />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════

function Dashboard({ state, onNavigate }) {
  const prog     = useMemo(() => calcProgress(state), [state]);
  const readiness = calcReadiness(prog);
  const streak   = calcStreak(state);
  const daysLeft = daysRemaining();
  const curWeek  = getCurrentWeek();

  // Revision due today
  const revDue = useMemo(() => {
    const today = isoDate(TODAY);
    return CURRICULUM.flatMap(wk => wk.days.flatMap(day =>
      day.tasks.filter(t => t.category === "Revision")
        .flatMap(t => t.items.filter(i => !state.completedTasks[i.id]))
    )).slice(0, 5);
  }, [state]);

  const catStats = [
    { key:"DSA",      icon:Code2,    color:"blue",     pct:prog.DSA      },
    { key:"HLD",      icon:Brain,    color:"purple",   pct:prog.HLD      },
    { key:"LLD",      icon:Layers,   color:"orange",   pct:prog.LLD      },
    { key:"Java",     icon:Coffee,   color:"cyan",     pct:prog.Java     },
    { key:"Go",       icon:Zap,      color:"teal",     pct:prog.Go       },
    { key:"Backend",  icon:Server,   color:"sky",      pct:prog.Backend  },
    { key:"Behavioral",icon:Users,   color:"yellow",   pct:prog.Behavioral },
    { key:"Revision", icon:RotateCcw,color:"green",    pct:prog.Revision },
  ];

  const colorMap = { blue:"bg-blue-500", purple:"bg-purple-500", orange:"bg-orange-500", cyan:"bg-cyan-500", teal:"bg-teal-500", sky:"bg-sky-500", yellow:"bg-yellow-500", green:"bg-green-500", emerald:"bg-emerald-500" };
  const textColorMap = { blue:"text-blue-400", purple:"text-purple-400", orange:"text-orange-400", cyan:"text-cyan-400", teal:"text-teal-400", sky:"text-sky-400", yellow:"text-yellow-400", green:"text-green-400", emerald:"text-emerald-400" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Interview Prep OS</h1>
        <p className="text-sm text-slate-500 mt-1">
          Senior Backend Engineer · Jun 17 – Aug 31, 2026 ·{" "}
          <span className="text-slate-400">Google · Meta · Amazon · ByteDance · Grab · Uber · Stripe · Datadog · Cloudflare</span>
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Overall</div>
          <div className="text-3xl font-bold text-emerald-400">{prog.overall}%</div>
          <div className="text-xs text-slate-600 mb-2">{prog.done}/{prog.total} tasks</div>
          <ProgressBar value={prog.overall} colorClass="bg-emerald-500" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Streak</div>
          <div className="flex items-end gap-1">
            <div className="text-3xl font-bold text-orange-400">{streak}</div>
            <div className="text-sm text-slate-500 mb-0.5">days</div>
          </div>
          <div className="text-xs text-slate-600 mt-1 flex items-center gap-1"><Flame size={10} className="text-orange-500"/>Consecutive days</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Days Left</div>
          <div className="flex items-end gap-1">
            <div className="text-3xl font-bold text-blue-400">{daysLeft}</div>
            <div className="text-sm text-slate-500 mb-0.5">days</div>
          </div>
          <div className="text-xs text-slate-600 mt-1 flex items-center gap-1"><CalendarDays size={10}/>Until Aug 31</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <ReadinessGauge score={readiness} />
        </div>
      </div>

      {/* Category progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Category Breakdown</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {catStats.map(c => (
            <div key={c.key}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <c.icon size={11} className={textColorMap[c.color]} />
                  <span className="text-xs text-slate-400">{c.key}</span>
                </div>
                <span className={`text-xs font-bold ${textColorMap[c.color]}`}>{c.pct}%</span>
              </div>
              <ProgressBar value={c.pct} colorClass={colorMap[c.color]} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Week grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Weeks</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM.map(wk => {
            const done2  = wk.days.reduce((s,d) => s + d.tasks.reduce((ss,t) => ss + t.items.filter(i => state.completedTasks[i.id]).length, 0), 0);
            const total2 = wk.totalItems;
            const pct2   = total2 ? Math.round(done2/total2*100) : 0;
            const isCur  = wk.weekNum === curWeek;
            return (
              <button
                key={wk.weekNum}
                onClick={() => onNavigate(`week${wk.weekNum}`)}
                className={`bg-slate-900 border rounded-xl p-4 text-left hover:border-slate-600 transition-all group ${isCur ? "border-emerald-700/50 shadow-lg shadow-emerald-950/20" : "border-slate-800"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isCur ? "text-emerald-400" : "text-slate-200"}`}>{wk.label}</span>
                      {isCur && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-500 border border-emerald-700/40">NOW</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{wk.range}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${pct2===100?"text-emerald-400":"text-slate-300"}`}>{pct2}%</div>
                    <div className="text-xs text-slate-600">{done2}/{total2}</div>
                  </div>
                </div>
                <ProgressBar value={pct2} colorClass={pct2===100?"bg-emerald-500":isCur?"bg-emerald-500":"bg-blue-600"} size="sm" />
                <div className="mt-2 space-y-0.5">
                  {wk.goals.slice(0,2).map((g,i) => (
                    <div key={i} className="text-[10px] text-slate-600 truncate">{g}</div>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
                  Open week <ArrowRight size={10} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Mocks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Award size={13} className="text-pink-400"/>Mock Interview Schedule
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MOCKS.map(m => {
            const past = m.date < TODAY;
            return (
              <div key={m.date.toISOString()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${past ? "border-slate-800 opacity-50" : "border-pink-800/30 bg-pink-950/20"}`}>
                <Trophy size={13} className={past ? "text-slate-600" : "text-pink-400"} />
                <div>
                  <div className={`text-xs font-medium ${past ? "text-slate-500" : "text-slate-200"}`}>{m.label}</div>
                  <div className="text-xs text-slate-600">{m.date.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                </div>
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full border ${past ? "border-slate-700 text-slate-600" : m.type==="Full" ? "bg-pink-900/60 text-pink-300 border-pink-700/40" : "bg-purple-900/60 text-purple-300 border-purple-700/40"}`}>{m.type}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revision due */}
      {revDue.length > 0 && (
        <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
            <RotateCcw size={13}/>Revision Due
          </h3>
          <div className="space-y-1">
            {revDue.map(item => (
              <div key={item.id} className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"/>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STATISTICS PAGE
// ════════════════════════════════════════════════════════════

function Statistics({ state }) {
  const prog = useMemo(() => calcProgress(state), [state]);
  const readiness = calcReadiness(prog);

  const catRows = [
    { key:"DSA",color:"blue",pct:prog.DSA },
    { key:"HLD",color:"purple",pct:prog.HLD },
    { key:"LLD",color:"orange",pct:prog.LLD },
    { key:"Java",color:"cyan",pct:prog.Java },
    { key:"Go",color:"teal",pct:prog.Go },
    { key:"Backend",color:"sky",pct:prog.Backend },
    { key:"Behavioral",color:"yellow",pct:prog.Behavioral },
    { key:"Revision",color:"green",pct:prog.Revision },
    { key:"Mock",color:"pink",pct:prog.Mock },
  ];
  const colorMap = { blue:"bg-blue-500",purple:"bg-purple-500",orange:"bg-orange-500",cyan:"bg-cyan-500",teal:"bg-teal-500",sky:"bg-sky-500",yellow:"bg-yellow-500",green:"bg-green-500",pink:"bg-pink-500",emerald:"bg-emerald-500" };
  const textMap = { blue:"text-blue-400",purple:"text-purple-400",orange:"text-orange-400",cyan:"text-cyan-400",teal:"text-teal-400",sky:"text-sky-400",yellow:"text-yellow-400",green:"text-green-400",pink:"text-pink-400" };

  const weekStats = CURRICULUM.map(wk => {
    const d = wk.days.reduce((s,day) => s + day.tasks.reduce((ss,t) => ss + t.items.filter(i => state.completedTasks[i.id]).length, 0), 0);
    const t = wk.totalItems;
    return { wk: wk.weekNum, range: wk.range, done:d, total:t, pct: t ? Math.round(d/t*100) : 0 };
  });

  const strong = catRows.filter(c => c.pct >= 70).map(c => c.key);
  const weak   = catRows.filter(c => c.pct < 30 && prog.totals[c.key]?.total > 0).map(c => c.key);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-100">Statistics</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Overall</div>
          <div className="text-2xl font-bold text-emerald-400">{prog.overall}%</div>
          <div className="text-xs text-slate-600">{prog.done}/{prog.total}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Readiness</div>
          <div className={`text-2xl font-bold ${readiness>=80?"text-emerald-400":readiness>=50?"text-yellow-400":"text-red-400"}`}>{readiness}%</div>
          <div className="text-xs text-slate-600">Weighted score</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Strong</div>
          <div className="text-2xl font-bold text-emerald-400">{strong.length}</div>
          <div className="text-xs text-slate-600">Topics ≥70%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Needs Work</div>
          <div className="text-2xl font-bold text-red-400">{weak.length}</div>
          <div className="text-xs text-slate-600">Topics &lt;30%</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Category Progress</h3>
        <div className="space-y-3">
          {catRows.map(c => (
            <div key={c.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${textMap[c.color] || "text-slate-400"}`}>{c.key}</span>
                <span className="text-slate-400">{c.pct}% · {prog.totals[c.key]?.done || 0}/{prog.totals[c.key]?.total || 0}</span>
              </div>
              <ProgressBar value={c.pct} colorClass={colorMap[c.color]} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Weekly Completion</h3>
        <div className="space-y-2">
          {weekStats.map(w => (
            <div key={w.wk}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Week {w.wk} <span className="text-slate-600">({w.range})</span></span>
                <span className={w.pct===100?"text-emerald-400":"text-slate-400"}>{w.pct}% · {w.done}/{w.total}</span>
              </div>
              <ProgressBar value={w.pct} colorClass={w.pct===100?"bg-emerald-500":w.pct>60?"bg-blue-500":"bg-slate-700"} size="sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1"><CheckCheck size={13}/>Strong Areas</h3>
          {strong.length ? strong.map(s => <div key={s} className="text-sm text-slate-300 py-0.5 flex items-center gap-2"><span className="text-emerald-500">✓</span>{s}</div>) : <div className="text-xs text-slate-600">Complete more tasks to identify strengths</div>}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1"><AlertCircle size={13}/>Needs Attention</h3>
          {weak.length ? weak.map(s => <div key={s} className="text-sm text-slate-300 py-0.5 flex items-center gap-2"><span className="text-red-500">⚠</span>{s}</div>) : <div className="text-xs text-slate-600">No weak areas — keep going!</div>}
        </div>
      </div>

      {/* Mock Scores */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Trophy size={13} className="text-pink-400"/>Mock Interview Scores</h3>
        {MOCKS.map(m => {
          const key = `mock_${isoDate(m.date)}`;
          const score = state.mockScores[key] || "";
          const note  = state.notes[`${key}_note`] || "";
          return (
            <div key={key} className="border-b border-slate-800 last:border-0 py-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-300 font-medium">{m.label}</div>
                <div className="text-xs text-slate-500">{m.date.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
              </div>
              {score && <div className="text-xs text-emerald-400 mt-0.5">Score: {score}</div>}
              {note  && <div className="text-xs text-slate-500 mt-0.5">{note}</div>}
              {!score && !note && <div className="text-xs text-slate-700 mt-0.5">Not yet completed</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ════════════════════════════════════════════════════════════

function SettingsPage({ state, onReset, onImport, setState }) {
  const [confirm, setConfirm] = useState(false);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ipt-os-backup-${isoDate(TODAY)}.json`;
    a.click();
  };

  const handleImport = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { onImport(JSON.parse(ev.target.result)); alert("Progress restored!"); }
      catch { alert("Invalid backup file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const mockDateStr = isoDate(MOCKS[0].date);
  const [mockInput, setMockInput] = useState("");
  const [mockNote, setMockNote] = useState("");
  const [activeMock, setActiveMock] = useState(0);

  const saveScore = () => {
    const key = `mock_${isoDate(MOCKS[activeMock].date)}`;
    setState(prev => ({
      ...prev,
      mockScores: { ...prev.mockScores, [key]: mockInput },
      notes: { ...prev.notes, [`${key}_note`]: mockNote },
    }));
    setMockInput(""); setMockNote("");
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-100">Settings</h2>

      {/* Mock Score Entry */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Trophy size={13} className="text-pink-400"/>Log Mock Scores</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          {MOCKS.map((m,i) => (
            <button key={i} onClick={()=>setActiveMock(i)}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${activeMock===i?"border-pink-600 text-pink-300 bg-pink-950/30":"border-slate-700 text-slate-500 hover:border-slate-600"}`}>
              Mock {i+1}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 mb-2">{MOCKS[activeMock].label} — {MOCKS[activeMock].date.toLocaleDateString()}</div>
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 mb-2"
          placeholder="Score or rating (e.g. 7/10, Passed, Strong Hire)"
          value={mockInput}
          onChange={e => setMockInput(e.target.value)}
        />
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-slate-500 font-mono mb-2"
          rows={2}
          placeholder="Weak areas, notes, areas for improvement..."
          value={mockNote}
          onChange={e => setMockNote(e.target.value)}
        />
        <button onClick={saveScore} className="text-sm px-4 py-1.5 bg-pink-900/40 text-pink-300 border border-pink-700/40 rounded-lg hover:bg-pink-900/60 transition-colors">Save Score</button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-200">Export Progress</div>
            <div className="text-xs text-slate-500">Download complete JSON backup</div>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition-colors flex-shrink-0">
            <Download size={13}/>Export
          </button>
        </div>
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-200">Import Progress</div>
            <div className="text-xs text-slate-500">Restore from backup file</div>
          </div>
          <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition-colors cursor-pointer flex-shrink-0">
            <Upload size={13}/>Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport}/>
          </label>
        </div>
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-red-400">Reset All Progress</div>
            <div className="text-xs text-slate-500">Clears all checkboxes, notes & scores</div>
          </div>
          {confirm ? (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>{ onReset(); setConfirm(false); }} className="text-xs px-3 py-1.5 bg-red-900/60 text-red-300 border border-red-700 rounded-lg hover:bg-red-900 transition-colors">Confirm Reset</button>
              <button onClick={()=>setConfirm(false)} className="text-xs px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
            </div>
          ) : (
            <button onClick={()=>setConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-red-950/40 text-red-400 border border-red-800/50 rounded-lg hover:bg-red-950/60 text-sm transition-colors flex-shrink-0">
              <Trash2 size={13}/>Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <div className="text-slate-400 font-medium mb-2">About</div>
        <div>Interview Preparation OS — Senior Backend Engineer Track</div>
        <div>Timeline: June 17 – August 31, 2026 · 11 Weeks · 77 Days</div>
        <div>Targets: Google · Meta · Amazon · ByteDance · TikTok · Shopee · Grab · Uber · Stripe · Datadog · Cloudflare</div>
        {state.lastUpdated && <div className="pt-1">Last saved: {new Date(state.lastUpdated).toLocaleString()}</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════

function Sidebar({ active, onNavigate, state, open, onClose }) {
  const curWeek = getCurrentWeek();
  const prog = useMemo(() => calcProgress(state), [state]);

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
    ...CURRICULUM.map(wk => ({ id:`week${wk.weekNum}`, label:`Week ${wk.weekNum}`, sub:wk.range, icon:CalendarDays, weekNum:wk.weekNum })),
    { id:"statistics", label:"Statistics", icon:BarChart3 },
    { id:"settings",   label:"Settings",   icon:Settings   },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-30 lg:hidden" onClick={onClose}/>}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-slate-950 border-r border-slate-800/60 z-40 flex flex-col
        transition-transform duration-200 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-100 tracking-tight">IPT OS</div>
            <div className="text-[10px] text-slate-600">Jun 17 – Aug 31</div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-600 hover:text-slate-400 p-1"><X size={14}/></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isCurWk  = item.weekNum === curWeek;
            let wkPct = null;
            if (item.weekNum) {
              const wk = CURRICULUM[item.weekNum - 1];
              const d = wk.days.reduce((s,day) => s + day.tasks.reduce((ss,t) => ss + t.items.filter(i => state.completedTasks[i.id]).length, 0), 0);
              wkPct = wk.totalItems ? Math.round(d / wk.totalItems * 100) : 0;
            }
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                <Icon size={13} className={isActive ? "text-emerald-400" : isCurWk ? "text-emerald-600" : "text-slate-700"} />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${isCurWk && !isActive ? "text-emerald-500" : ""}`}>
                    {item.label}{isCurWk ? " ★" : ""}
                  </div>
                  {item.sub && <div className="text-[10px] text-slate-700 truncate">{item.sub}</div>}
                </div>
                {wkPct !== null && (
                  <span className={`text-[10px] flex-shrink-0 ${wkPct===100?"text-emerald-500":"text-slate-700"}`}>{wkPct}%</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800/60">
          <div className="text-[10px] text-slate-600 mb-1.5">Overall</div>
          <ProgressBar value={prog.overall} colorClass="bg-emerald-500" size="sm" />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-emerald-500">{prog.overall}%</span>
            <span className="text-[10px] text-slate-700">{daysRemaining()}d left</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// APP ROOT
// ════════════════════════════════════════════════════════════

export default function App() {
  const { state, toggleTask, setNote, setMockScore, resetAll, setState } = useLocalStorage();
  const [page, setPage]   = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);

  const weekNum = page.startsWith("week") ? parseInt(page.replace("week","")) : null;

  const pageTitle = page === "dashboard" ? "Dashboard"
    : page === "statistics" ? "Statistics"
    : page === "settings"   ? "Settings"
    : weekNum ? `Week ${weekNum}`
    : "Dashboard";

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar active={page} onNavigate={setPage} state={state} open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur sticky top-0 z-20 flex-shrink-0">
          <button onClick={() => setSideOpen(true)} className="text-slate-500 hover:text-slate-300">
            <Menu size={18}/>
          </button>
          <span className="text-sm font-semibold text-slate-200">{pageTitle}</span>
        </header>
        {/* Main scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
            {page === "dashboard"  && <Dashboard state={state} onNavigate={setPage} />}
            {page === "statistics" && <Statistics state={state} />}
            {page === "settings"   && <SettingsPage state={state} onReset={resetAll} onImport={s => setState(() => s)} setState={setState} />}
            {weekNum               && <WeekPage weekNum={weekNum} state={state} onToggle={toggleTask} onNote={setNote} />}
          </div>
        </main>
      </div>
    </div>
  );
}
