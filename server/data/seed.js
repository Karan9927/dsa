const mongoose = require('mongoose');
require('dotenv').config();

const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

const topics = [
  { name: 'Arrays', slug: 'arrays', description: 'Array manipulation, searching, and sorting techniques', order: 1 },
  { name: 'Strings', slug: 'strings', description: 'String manipulation, pattern matching, and parsing', order: 2 },
  { name: 'Linked Lists', slug: 'linked-lists', description: 'Singly, doubly linked lists and their operations', order: 3 },
  { name: 'Stacks & Queues', slug: 'stacks-queues', description: 'Stack and queue based problem solving', order: 4 },
  { name: 'Trees', slug: 'trees', description: 'Binary trees, BST, and tree traversals', order: 5 },
  { name: 'Graphs', slug: 'graphs', description: 'Graph traversal, shortest path, and connectivity', order: 6 },
  { name: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Memoization, tabulation, and optimization problems', order: 7 },
  { name: 'Greedy', slug: 'greedy', description: 'Greedy algorithms and optimization', order: 8 },
  { name: 'Backtracking', slug: 'backtracking', description: 'Recursive backtracking and constraint satisfaction', order: 9 },
  { name: 'Bit Manipulation', slug: 'bit-manipulation', description: 'Bitwise operations and tricks', order: 10 },
];

const problemsByTopic = {
  arrays: [
    { title: 'Two Sum', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', articleUrl: 'https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/', order: 1 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=1pkOgXD63yU', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', articleUrl: 'https://www.geeksforgeeks.org/best-time-to-buy-and-sell-stock/', order: 2 },
    { title: 'Contains Duplicate', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=3OamzN90kPg', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', articleUrl: 'https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/', order: 3 },
    { title: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', articleUrl: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', order: 4 },
    { title: 'Product of Array Except Self', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=bNvIQI2wAjk', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', articleUrl: 'https://www.geeksforgeeks.org/a-product-array-puzzle/', order: 5 },
    { title: 'Maximum Product Subarray', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=lXVy6YWFcRM', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', articleUrl: 'https://www.geeksforgeeks.org/maximum-product-subarray/', order: 6 },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=nIVW4P8b1VA', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', articleUrl: 'https://www.geeksforgeeks.org/find-minimum-element-in-a-sorted-and-rotated-array/', order: 7 },
    { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=U8XENwh8Oy8', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', articleUrl: 'https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/', order: 8 },
    { title: '3Sum', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=jzZsG8n2R9A', leetcodeUrl: 'https://leetcode.com/problems/3sum/', articleUrl: 'https://www.geeksforgeeks.org/find-a-triplet-that-sum-to-a-given-value/', order: 9 },
    { title: 'Container With Most Water', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=UuiTKBwPgAo', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', articleUrl: 'https://www.geeksforgeeks.org/container-with-most-water/', order: 10 },
  ],
  strings: [
    { title: 'Valid Anagram', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=9UtInBqnCgA', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', articleUrl: 'https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/', order: 1 },
    { title: 'Valid Palindrome', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=jJXJ16kPFWg', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', articleUrl: 'https://www.geeksforgeeks.org/check-if-a-given-string-is-palindrome/', order: 2 },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=wiGpQwVHdE0', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', articleUrl: 'https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/', order: 3 },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=XYQecbcd6_c', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', articleUrl: 'https://www.geeksforgeeks.org/longest-palindromic-substring/', order: 4 },
    { title: 'Group Anagrams', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=vzdNOK2oB2E', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', articleUrl: 'https://www.geeksforgeeks.org/given-a-sequence-of-words-print-all-anagrams-together/', order: 5 },
    { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=gqXU1UyA8pk', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', articleUrl: 'https://www.geeksforgeeks.org/longest-repeating-character-replacement/', order: 6 },
    { title: 'Minimum Window Substring', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=jSto0O4AJbM', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', articleUrl: 'https://www.geeksforgeeks.org/find-the-smallest-window-in-a-string-containing-all-characters-of-another-string/', order: 7 },
    { title: 'Valid Parentheses', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=WTzjTskDFMg', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', articleUrl: 'https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/', order: 8 },
  ],
  'linked-lists': [
    { title: 'Reverse Linked List', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=G0_I-ZF0S38', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', articleUrl: 'https://www.geeksforgeeks.org/reverse-a-linked-list/', order: 1 },
    { title: 'Linked List Cycle', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=gBTe7lFR3vc', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', articleUrl: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/', order: 2 },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=XIdigk956u0', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', articleUrl: 'https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/', order: 3 },
    { title: 'Remove Nth Node From End', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=XVuQxVej6y8', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', articleUrl: 'https://www.geeksforgeeks.org/delete-nth-node-from-the-end-of-the-given-linked-list/', order: 4 },
    { title: 'Reorder List', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=S5bfdUTrKLM', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', articleUrl: 'https://www.geeksforgeeks.org/rearrange-a-given-linked-list-in-place/', order: 5 },
    { title: 'Add Two Numbers', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=wgFPrzTjm7s', leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/', articleUrl: 'https://www.geeksforgeeks.org/add-two-numbers-represented-by-linked-lists/', order: 6 },
    { title: 'Merge K Sorted Lists', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=q5a5OiGbT6Q', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', articleUrl: 'https://www.geeksforgeeks.org/merge-k-sorted-linked-lists/', order: 7 },
  ],
  'stacks-queues': [
    { title: 'Valid Parentheses', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=WTzjTskDFMg', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', articleUrl: 'https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/', order: 1 },
    { title: 'Min Stack', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=qkLl7nAwDPo', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', articleUrl: 'https://www.geeksforgeeks.org/design-and-implement-special-stack-data-structure/', order: 2 },
    { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=iu0082c4HDE', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', articleUrl: 'https://www.geeksforgeeks.org/evaluation-of-postfix-expression/', order: 3 },
    { title: 'Daily Temperatures', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=cTBiBSnjO3c', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', articleUrl: 'https://www.geeksforgeeks.org/next-greater-element/', order: 4 },
    { title: 'Next Greater Element I', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=68a1Dc_qVq4', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/', articleUrl: 'https://www.geeksforgeeks.org/next-greater-element/', order: 5 },
    { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=zx5Sw9130L0', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', articleUrl: 'https://www.geeksforgeeks.org/largest-rectangle-under-histogram/', order: 6 },
  ],
  trees: [
    { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=hTM3phVI6YQ', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', articleUrl: 'https://www.geeksforgeeks.org/find-the-maximum-depth-or-height-of-a-tree/', order: 1 },
    { title: 'Invert Binary Tree', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', articleUrl: 'https://www.geeksforgeeks.org/write-an-efficient-c-function-to-convert-a-tree-into-its-mirror-tree/', order: 2 },
    { title: 'Same Tree', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=vRbbcKXCxOw', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', articleUrl: 'https://www.geeksforgeeks.org/write-c-code-to-determine-if-two-trees-are-identical/', order: 3 },
    { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=6ZnyEApgFYg', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', articleUrl: 'https://www.geeksforgeeks.org/level-order-tree-traversal/', order: 4 },
    { title: 'Validate Binary Search Tree', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=s6ATEkipzow', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', articleUrl: 'https://www.geeksforgeeks.org/a-program-to-check-if-a-binary-tree-is-bst-or-not/', order: 5 },
    { title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=gs2LMfuOR9k', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', articleUrl: 'https://www.geeksforgeeks.org/lowest-common-ancestor-in-a-binary-search-tree/', order: 6 },
    { title: 'Kth Smallest Element in BST', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=5LUXSvjmGCw', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', articleUrl: 'https://www.geeksforgeeks.org/find-k-th-smallest-element-in-bst-order-statistics-in-bst/', order: 7 },
    { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=Hr5cWUld4vU', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', articleUrl: 'https://www.geeksforgeeks.org/find-maximum-path-sum-in-a-binary-tree/', order: 8 },
    { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=u4JAi2JJhI8', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', articleUrl: 'https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/', order: 9 },
  ],
  graphs: [
    { title: 'Number of Islands', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=pV2kpPD66nE', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', articleUrl: 'https://www.geeksforgeeks.org/find-number-of-islands/', order: 1 },
    { title: 'Clone Graph', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=mQeF6bN8hMk', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', articleUrl: 'https://www.geeksforgeeks.org/clone-an-undirected-graph/', order: 2 },
    { title: 'Course Schedule', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=EgI5nU9etnU', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', articleUrl: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/', order: 3 },
    { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=s-VkcjHqkGI', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', articleUrl: 'https://www.geeksforgeeks.org/pacific-atlantic-water-flow/', order: 4 },
    { title: 'Graph Valid Tree', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=bXsUuownnoQ', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/', articleUrl: 'https://www.geeksforgeeks.org/check-given-graph-tree/', order: 5 },
    { title: 'Number of Connected Components', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=8f1XPm4WOUc', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', articleUrl: 'https://www.geeksforgeeks.org/connected-components-in-an-undirected-graph/', order: 6 },
    { title: 'Word Ladder', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=h9iTnkgv05E', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', articleUrl: 'https://www.geeksforgeeks.org/word-ladder-length-of-shortest-chain-to-reach-a-target-word/', order: 7 },
  ],
  'dynamic-programming': [
    { title: 'Climbing Stairs', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', articleUrl: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/', order: 1 },
    { title: 'House Robber', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=73r3KWiEvyk', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', articleUrl: 'https://www.geeksforgeeks.org/find-maximum-possible-stolen-value-houses/', order: 2 },
    { title: 'Coin Change', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=H9bfqozjoqs', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', articleUrl: 'https://www.geeksforgeeks.org/find-minimum-number-of-coins-that-make-a-change/', order: 3 },
    { title: 'Longest Increasing Subsequence', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=cjWnW0hdF1Y', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', articleUrl: 'https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/', order: 4 },
    { title: 'Longest Common Subsequence', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=Ua0GhsJSlWM', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', articleUrl: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/', order: 5 },
    { title: 'Word Break', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=Sx9NNgInc3A', leetcodeUrl: 'https://leetcode.com/problems/word-break/', articleUrl: 'https://www.geeksforgeeks.org/word-break-problem-dp-32/', order: 6 },
    { title: '0/1 Knapsack', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=8LusJS5-AGo', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', articleUrl: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', order: 7 },
    { title: 'Unique Paths', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=IlEsdxuD4lY', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', articleUrl: 'https://www.geeksforgeeks.org/count-possible-paths-top-left-bottom-right-nxm-matrix/', order: 8 },
    { title: 'Decode Ways', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=6aEyTjOwlJU', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/', articleUrl: 'https://www.geeksforgeeks.org/count-possible-decodings-given-digit-sequence/', order: 9 },
    { title: 'Edit Distance', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=XYi2-LPrwm4', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/', articleUrl: 'https://www.geeksforgeeks.org/edit-distance-dp-5/', order: 10 },
  ],
  greedy: [
    { title: 'Maximum Subarray', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', articleUrl: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', order: 1 },
    { title: 'Jump Game', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=Yan0cv2cLy8', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', articleUrl: 'https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-a-given-array/', order: 2 },
    { title: 'Jump Game II', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=dJ7sWiOoK7g', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/', articleUrl: 'https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-a-given-array/', order: 3 },
    { title: 'Gas Station', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=lJwbPZGo05A', leetcodeUrl: 'https://leetcode.com/problems/gas-station/', articleUrl: 'https://www.geeksforgeeks.org/find-a-tour-that-visits-all-stations/', order: 4 },
    { title: 'Activity Selection', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=poWB2UCuozA', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', articleUrl: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/', order: 5 },
    { title: 'Merge Intervals', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=44H3cEC2fFM', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', articleUrl: 'https://www.geeksforgeeks.org/merging-intervals/', order: 6 },
  ],
  backtracking: [
    { title: 'Subsets', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=REOH22Xwdkk', leetcodeUrl: 'https://leetcode.com/problems/subsets/', articleUrl: 'https://www.geeksforgeeks.org/backtracking-to-find-all-subsets/', order: 1 },
    { title: 'Combination Sum', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=GBKI9VSKdGg', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', articleUrl: 'https://www.geeksforgeeks.org/combinational-sum/', order: 2 },
    { title: 'Permutations', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=s7AvT7cGdSo', leetcodeUrl: 'https://leetcode.com/problems/permutations/', articleUrl: 'https://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/', order: 3 },
    { title: 'Word Search', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=pfiQ_PS1g8E', leetcodeUrl: 'https://leetcode.com/problems/word-search/', articleUrl: 'https://www.geeksforgeeks.org/search-a-word-in-a-2d-grid-of-characters/', order: 4 },
    { title: 'Palindrome Partitioning', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=3jvWodd7ht0', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/', articleUrl: 'https://www.geeksforgeeks.org/given-a-string-print-all-possible-palindromic-partition/', order: 5 },
    { title: 'N-Queens', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=Ph95IHmRp5M', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', articleUrl: 'https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/', order: 6 },
    { title: 'Sudoku Solver', difficulty: 'Hard', youtubeUrl: 'https://www.youtube.com/watch?v=FWAIf_EVUKE', leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/', articleUrl: 'https://www.geeksforgeeks.org/sudoku-backtracking-7/', order: 7 },
  ],
  'bit-manipulation': [
    { title: 'Single Number', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=qMPX1AOa83k', leetcodeUrl: 'https://leetcode.com/problems/single-number/', articleUrl: 'https://www.geeksforgeeks.org/find-the-number-occurring-odd-number-of-times/', order: 1 },
    { title: 'Number of 1 Bits', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=5Km3utixwZs', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/', articleUrl: 'https://www.geeksforgeeks.org/count-set-bits-in-an-integer/', order: 2 },
    { title: 'Counting Bits', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=RyBM56RIWrM', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/', articleUrl: 'https://www.geeksforgeeks.org/count-total-set-bits-in-all-numbers-from-1-to-n/', order: 3 },
    { title: 'Reverse Bits', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=UcoN6UjAI64', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/', articleUrl: 'https://www.geeksforgeeks.org/write-an-efficient-c-program-to-reverse-bits-of-a-number/', order: 4 },
    { title: 'Missing Number', difficulty: 'Easy', youtubeUrl: 'https://www.youtube.com/watch?v=WnPLSRLSANE', leetcodeUrl: 'https://leetcode.com/problems/missing-number/', articleUrl: 'https://www.geeksforgeeks.org/find-the-missing-number/', order: 5 },
    { title: 'Sum of Two Integers', difficulty: 'Medium', youtubeUrl: 'https://www.youtube.com/watch?v=gVUrDV4tZfY', leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/', articleUrl: 'https://www.geeksforgeeks.org/add-two-numbers-without-using-arithmetic-operators/', order: 6 },
  ],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Topic.deleteMany({});
    await Problem.deleteMany({});
    console.log('Cleared existing data');

    const createdTopics = await Topic.insertMany(topics);
    console.log(`Inserted ${createdTopics.length} topics`);

    const topicMap = {};
    createdTopics.forEach((t) => {
      topicMap[t.slug] = t._id;
    });

    let totalProblems = 0;
    for (const [slug, problems] of Object.entries(problemsByTopic)) {
      const topicId = topicMap[slug];
      if (!topicId) {
        console.warn(`No topic found for slug: ${slug}`);
        continue;
      }
      const problemDocs = problems.map((p) => ({ ...p, topicId }));
      await Problem.insertMany(problemDocs);
      totalProblems += problemDocs.length;
    }

    console.log(`Inserted ${totalProblems} problems`);
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
