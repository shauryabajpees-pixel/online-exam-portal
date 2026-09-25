import { Exam } from '../types/exam';

export const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'js-core-advanced',
    title: 'JavaScript Core & Modern ESNext Certification',
    category: 'Core JavaScript',
    description: 'Comprehensive assessment of closures, execution context, prototype chain, event loop scheduling, and ESNext paradigms.',
    durationMinutes: 25,
    passingScorePercent: 70,
    totalMarks: 50,
    negativeMarking: true,
    allowCalculator: false,
    badgeTitle: 'Certified JavaScript Specialist',
    createdAt: '2026-03-01T10:00:00Z',
    questions: [
      {
        id: 'q1',
        topic: 'Execution Context & TDZ',
        type: 'code_snippet',
        difficulty: 'Intermediate',
        prompt: 'What will be logged to the console when the following code is executed?',
        codeSnippet: `var x = 10;
function test() {
  console.log(x);
  let x = 20;
}
test();`,
        options: [
          '10',
          '20',
          'undefined',
          'ReferenceError: Cannot access "x" before initialization'
        ],
        correctAnswers: [3],
        explanation: 'Variables declared with let and const are hoisted to the top of their enclosing lexical block, but remain uninitialized in the "Temporal Dead Zone" (TDZ) until the declaration statement is evaluated. Accessing x before initialization throws a ReferenceError, shadowing the outer var x.',
        points: 4,
      },
      {
        id: 'q2',
        topic: 'Event Loop & Microtasks',
        type: 'code_snippet',
        difficulty: 'Advanced',
        prompt: 'What is the exact output sequence of the following asynchronous code block?',
        codeSnippet: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3');
    return Promise.resolve('4');
  })
  .then((res) => {
    console.log(res);
  });

queueMicrotask(() => {
  console.log('5');
});

console.log('6');`,
        options: [
          '1, 6, 3, 5, 4, 2',
          '1, 6, 2, 3, 4, 5',
          '1, 6, 3, 4, 5, 2',
          '1, 3, 5, 6, 4, 2'
        ],
        correctAnswers: [0],
        explanation: 'Synchronous execution runs first: logs "1" then "6". Then all microtasks are drained in order of queuing: Promise then log "3" queues microtask for "4", queueMicrotask logs "5", resolved promise logs "4". Finally, macrotask queue runs: setTimeout logs "2". Hence: 1, 6, 3, 5, 4, 2.',
        points: 4,
      },
      {
        id: 'q3',
        topic: 'Closures & Scoping',
        type: 'code_snippet',
        difficulty: 'Beginner',
        prompt: 'What is printed by this classic closure snippet?',
        codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 10);
}`,
        options: [
          '0, 1, 2 followed by 0, 1, 2',
          '3, 3, 3 followed by 0, 1, 2',
          '3, 3, 3 followed by 3, 3, 3',
          'Undefined 3 times followed by 0, 1, 2'
        ],
        correctAnswers: [1],
        explanation: 'Variables declared with var have function/global scope; by the time the timeouts fire, the single shared i variable has incremented to 3 (printing 3, 3, 3). In contrast, let creates a fresh binding per iteration for j, so each callback captures its respective iteration value (0, 1, 2).',
        points: 4,
      },
      {
        id: 'q4',
        topic: 'Prototype & Inheritance',
        type: 'code_snippet',
        difficulty: 'Advanced',
        prompt: 'What is the boolean evaluation of the comparisons below?',
        codeSnippet: `function Animal() {}
const dog = new Animal();

const check1 = dog.__proto__ === Animal.prototype;
const check2 = Animal.__proto__ === Function.prototype;
const check3 = Animal.prototype.__proto__ === Object.prototype;
console.log(check1, check2, check3);`,
        options: [
          'true, true, true',
          'true, false, true',
          'false, true, true',
          'true, true, false'
        ],
        correctAnswers: [0],
        explanation: 'dog is an instance of Animal, so dog.__proto__ points to Animal.prototype. Animal is a constructor function (an instance of Function), so Animal.__proto__ points to Function.prototype. Animal.prototype is an ordinary object inheriting directly from Object.prototype, so all three assertions evaluate to true.',
        points: 4,
      },
      {
        id: 'q5',
        topic: 'this Binding Rules',
        type: 'code_snippet',
        difficulty: 'Intermediate',
        prompt: 'What will be output by invocation of the object methods?',
        codeSnippet: `const calculator = {
  value: 42,
  getValue: function() {
    return this.value;
  },
  getArrow: () => {
    return this ? this.value : undefined;
  }
};

const fn = calculator.getValue;
console.log(calculator.getValue(), fn(), calculator.getArrow());`,
        options: [
          '42, 42, 42',
          '42, undefined, undefined',
          '42, undefined, 42',
          '42, Error, 42'
        ],
        correctAnswers: [1],
        explanation: 'calculator.getValue() is invoked as a method of calculator, binding this to calculator (returns 42). fn() loses its implicit receiver context; in non-strict mode this is window/global where value is undefined (in strict mode it throws a TypeError). getArrow is an arrow function which retains this from its lexical enclosing scope at creation time (module/global scope), where value is undefined.',
        points: 4,
      },
      {
        id: 'q6',
        topic: 'Memory & Garbage Collection',
        type: 'multiple_choice',
        difficulty: 'Intermediate',
        prompt: 'Which of the following statements about JavaScript WeakMap and WeakSet are CORRECT? (Select all that apply)',
        options: [
          'Keys in a WeakMap must be objects or non-registered symbols.',
          'WeakMaps are enumerable using for...of or Object.keys().',
          'If no other references exist to a key object in a WeakMap, the entry can be garbage collected.',
          'WeakMaps provide a .clear() method to purge all keys at once.'
        ],
        correctAnswers: [0, 2],
        explanation: 'WeakMap keys must be garbage-collectable objects (or non-registered symbols in modern specs). Because entries can be collected non-deterministically by the garbage collector, WeakMaps cannot be enumerated (no size, keys(), values(), or for...of), and they do not have a .clear() method.',
        points: 5,
      },
      {
        id: 'q7',
        topic: 'Array Immutability & Methods',
        type: 'multiple_choice',
        difficulty: 'Intermediate',
        prompt: 'Which of the following Array methods MUTATE the original array in place? (Select all that apply)',
        options: [
          'Array.prototype.splice()',
          'Array.prototype.slice()',
          'Array.prototype.toSorted()',
          'Array.prototype.reverse()',
          'Array.prototype.concat()'
        ],
        correctAnswers: [0, 3],
        explanation: 'splice() and reverse() modify the array in place. slice() and concat() return new arrays. toSorted() was introduced in ECMAScript 2023 as the non-mutating copy-returning alternative to sort().',
        points: 5,
      },
      {
        id: 'q8',
        topic: 'Object Cloning & Serialization',
        type: 'single_choice',
        difficulty: 'Intermediate',
        prompt: 'Why might structuredClone() be preferred over JSON.parse(JSON.stringify(obj)) for cloning JavaScript data structures?',
        options: [
          'structuredClone() is synchronous while JSON methods are asynchronous.',
          'structuredClone() supports circular references, Dates, RegExp, Maps, and Sets without data loss.',
          'JSON.stringify can serialize functions and DOM nodes while structuredClone cannot.',
          'structuredClone creates shallow references while JSON methods create deep copies.'
        ],
        correctAnswers: [1],
        explanation: 'structuredClone uses the HTML structured clone algorithm, capable of deep-copying circular references, Date objects, RegExps, Map, Set, ArrayBuffers, and TypedArrays without dropping them or converting them to string representations like JSON does.',
        points: 4,
      },
      {
        id: 'q9',
        topic: 'Type Coercion & Equality',
        type: 'code_snippet',
        difficulty: 'Intermediate',
        prompt: 'What are the return values of Object.is(NaN, NaN) and Object.is(+0, -0)?',
        codeSnippet: `console.log(Object.is(NaN, NaN));
console.log(Object.is(+0, -0));
console.log(NaN === NaN);
console.log(+0 === -0);`,
        options: [
          'true, false, false, true',
          'false, true, false, true',
          'true, true, true, true',
          'false, false, false, false'
        ],
        correctAnswers: [0],
        explanation: 'Object.is implements the SameValue algorithm: Object.is(NaN, NaN) is true (unlike === which yields false), and Object.is(+0, -0) is false (unlike === which treats positive and negative zero as equal).',
        points: 4,
      },
      {
        id: 'q10',
        topic: 'Interactive Coding Challenge',
        type: 'coding_challenge',
        difficulty: 'Advanced',
        prompt: 'Implement a function deepClone(value) that creates a deep copy of nested objects and arrays. Primitives should be returned directly.',
        initialCode: `function deepClone(value) {
  // Write your implementation here
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // TODO: Handle Arrays and Objects recursively
  
}`,
        testCases: [
          {
            id: 'tc1',
            input: 'deepClone({ a: 1, b: { c: 2 } })',
            expected: '{"a":1,"b":{"c":2}}',
            description: 'Clones nested object and ensures reference independence',
            testFnBody: `
              const original = { a: 1, b: { c: 2 } };
              const cloned = deepClone(original);
              cloned.b.c = 99;
              return {
                passed: original.b.c === 2 && cloned.b.c === 99,
                actual: JSON.stringify(original)
              };
            `
          },
          {
            id: 'tc2',
            input: 'deepClone([1, [2, 3], { x: 4 }])',
            expected: '[1,[2,3],{"x":4}]',
            description: 'Clones arrays with mixed nested structures',
            testFnBody: `
              const arr = [1, [2, 3], { x: 4 }];
              const clonedArr = deepClone(arr);
              clonedArr[1][0] = 50;
              return {
                passed: arr[1][0] === 2 && Array.isArray(clonedArr[1]) && clonedArr[2].x === 4,
                actual: JSON.stringify(arr)
              };
            `
          },
          {
            id: 'tc3',
            input: 'deepClone(42)',
            expected: '42',
            description: 'Returns primitive values directly without modification',
            testFnBody: `
              return {
                passed: deepClone(42) === 42 && deepClone("eval") === "eval" && deepClone(null) === null,
                actual: 42
              };
            `
          }
        ],
        solutionCode: `function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }
  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = deepClone(value[key]);
  }
  return copy;
}`,
        explanation: 'A deep clone must recursively traverse nested objects and arrays. Primitive values are copied by value, while reference structures create newly allocated containers with cloned sub-properties.',
        points: 12,
      }
    ]
  },
  {
    id: 'js-async-webapis',
    title: 'Asynchronous JavaScript & Web Performance',
    category: 'Async & Browser',
    description: 'Mastery of Promises, async/await, AbortController, DOM event bubbling/capturing, and microtask queues.',
    durationMinutes: 20,
    passingScorePercent: 70,
    totalMarks: 40,
    negativeMarking: false,
    allowCalculator: false,
    badgeTitle: 'Asynchronous Systems Architect',
    createdAt: '2026-03-05T14:30:00Z',
    questions: [
      {
        id: 'qa1',
        topic: 'Promise Combinators',
        type: 'single_choice',
        difficulty: 'Intermediate',
        prompt: 'Which Promise combinator rejects as soon as ANY of the input promises rejects, but resolves with an array of all values if all succeed?',
        options: [
          'Promise.all()',
          'Promise.allSettled()',
          'Promise.race()',
          'Promise.any()'
        ],
        correctAnswers: [0],
        explanation: 'Promise.all() short-circuits on the first rejection, rejecting immediately with that reason. Promise.allSettled() waits for all promises regardless of outcome. Promise.race() settles on the first resolution or rejection. Promise.any() resolves on the first fulfillment.',
        points: 5,
      },
      {
        id: 'qa2',
        topic: 'DOM Event Propagation',
        type: 'single_choice',
        difficulty: 'Intermediate',
        prompt: 'What is the key difference between event.stopPropagation() and event.stopImmediatePropagation()?',
        options: [
          'stopPropagation prevents default browser actions; stopImmediatePropagation halts event dispatch completely.',
          'stopPropagation stops the event from propagating to ancestor elements, but allows other listeners on the same element to run; stopImmediatePropagation prevents all remaining listeners on the current element as well.',
          'stopPropagation only works during the capture phase; stopImmediatePropagation works in both bubble and capture phases.',
          'There is no difference; stopImmediatePropagation is an obsolete alias.'
        ],
        correctAnswers: [1],
        explanation: 'event.stopPropagation() halts traversal through the DOM tree (capturing/bubbling), but other listeners attached to the exact same element for that event type still execute. event.stopImmediatePropagation() immediately suppresses execution of any subsequent listeners on the current element as well.',
        points: 5,
      },
      {
        id: 'qa3',
        topic: 'Async Error Handling',
        type: 'code_snippet',
        difficulty: 'Intermediate',
        prompt: 'What will be output by this try...catch block?',
        codeSnippet: `async function fetchData() {
  try {
    Promise.reject(new Error('Failed network request'));
  } catch (err) {
    console.log('Caught in try-catch');
  }
}
fetchData();`,
        options: [
          'Caught in try-catch',
          'UnhandledPromiseRejection (the catch block does NOT catch it)',
          'undefined',
          'Silent failure with no console output'
        ],
        correctAnswers: [1],
        explanation: 'A try...catch block only catches synchronous exceptions or awaited promises. Since Promise.reject(...) is not preceded by the await keyword, the rejection is dispatched asynchronously to the unhandled rejection queue without triggering the local synchronous catch block.',
        points: 5,
      },
      {
        id: 'qa4',
        topic: 'Request Cancellation',
        type: 'single_choice',
        difficulty: 'Intermediate',
        prompt: 'Which standard Web API is used to programmatically abort an ongoing fetch() request or event listener?',
        options: [
          'WorkerPool.terminate()',
          'AbortController and its signal property',
          'window.cancelFetch()',
          'Promise.cancel()'
        ],
        correctAnswers: [1],
        explanation: 'AbortController provides an AbortSignal instance passed via the { signal } option of fetch(). Calling controller.abort() triggers cancellation and rejects the fetch promise with an AbortError DOMException.',
        points: 5,
      },
      {
        id: 'qa5',
        topic: 'Interactive Coding Challenge',
        type: 'coding_challenge',
        difficulty: 'Intermediate',
        prompt: 'Implement a debounce(fn, wait) higher-order function that delays invoking fn until after wait milliseconds have elapsed since the last time it was invoked.',
        initialCode: `function debounce(fn, wait) {
  let timerId = null;
  return function(...args) {
    // Write your debounce implementation here
    
  };
}`,
        testCases: [
          {
            id: 'tca1',
            input: 'Debounce cancels rapid calls and executes only the last call',
            expected: '1 call executed',
            description: 'Rapid invocations result in a single execution with latest arguments',
            testFnBody: `
              let count = 0;
              let lastArg = null;
              const debounced = debounce((val) => {
                count++;
                lastArg = val;
              }, 50);

              debounced('first');
              debounced('second');
              debounced('third');

              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    passed: count === 1 && lastArg === 'third',
                    actual: count === 1 ? '1 call executed' : count + ' calls executed'
                  });
                }, 100);
              });
            `
          },
          {
            id: 'tca2',
            input: 'Debounce preserves execution context and parameters',
            expected: 'Context preserved',
            description: 'Preserves "this" context and variable arguments',
            testFnBody: `
              const obj = {
                val: 100,
                calculate: debounce(function(multiplier) {
                  this.val *= multiplier;
                }, 30)
              };

              obj.calculate(2);

              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    passed: obj.val === 200,
                    actual: obj.val === 200 ? 'Context preserved' : 'val was ' + obj.val
                  });
                }, 80);
              });
            `
          }
        ],
        solutionCode: `function debounce(fn, wait) {
  let timerId = null;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}`,
        explanation: 'Debounce resets a timer on each invocation using clearTimeout. When calls pause for longer than the wait duration, the timeout callback executes with the captured this and arguments.',
        points: 15,
      },
      {
        id: 'qa6',
        topic: 'Browser Performance & Rendering',
        type: 'single_choice',
        difficulty: 'Advanced',
        prompt: 'Which browser API is specifically optimized for measuring when an element is visible in the viewport without causing layout thrashing?',
        options: [
          'window.onscroll with el.getBoundingClientRect()',
          'IntersectionObserver',
          'ResizeObserver',
          'requestAnimationFrame'
        ],
        correctAnswers: [1],
        explanation: 'IntersectionObserver asynchronously checks intersection of a target element with an ancestor element or the top-level document viewport off the main thread, avoiding synchronous layout calculations (layout thrashing) that occur when querying getBoundingClientRect on scroll.',
        points: 5,
      }
    ]
  },
  {
    id: 'js-dsa-algorithms',
    title: 'Data Structures & Algorithms in JavaScript',
    category: 'Algorithms & CS',
    description: 'Algorithmic efficiency, Big-O complexities, sliding window techniques, hash tables, and two-pointer solutions.',
    durationMinutes: 20,
    passingScorePercent: 65,
    totalMarks: 35,
    negativeMarking: true,
    allowCalculator: true,
    badgeTitle: 'JavaScript Algorithms Specialist',
    createdAt: '2026-03-10T09:00:00Z',
    questions: [
      {
        id: 'qd1',
        topic: 'Array Time Complexity',
        type: 'single_choice',
        difficulty: 'Beginner',
        prompt: 'What is the worst-case time complexity of Array.prototype.unshift() versus Array.prototype.push() in a standard JavaScript engine?',
        options: [
          'unshift() is O(1); push() is O(n)',
          'unshift() is O(n); push() is amortized O(1)',
          'Both are O(1)',
          'Both are O(n)'
        ],
        correctAnswers: [1],
        explanation: 'unshift() inserts elements at index 0, requiring shifting all existing n elements by one index to the right, which is O(n). push() appends to the end of the backing store array, which is amortized O(1).',
        points: 5,
      },
      {
        id: 'qd2',
        topic: 'Map vs Object Performance',
        type: 'single_choice',
        difficulty: 'Intermediate',
        prompt: 'Why is Map generally superior to an ordinary Object for frequent additions and removals of key-value pairs?',
        options: [
          'Map keys can only be strings, allowing hardware hashing.',
          'Map is optimized for frequent insertion and deletion, preserves insertion order, and does not carry prototype keys.',
          'Map is automatically stored in WebAssembly memory.',
          'Object properties are immutable once defined.'
        ],
        correctAnswers: [1],
        explanation: 'The ECMAScript specification optimizes Map specifically for frequent additions and deletions of entries with sub-linear lookup overhead, clean iteration, arbitrary key types (including objects and functions), and immunity to prototype pollution.',
        points: 5,
      },
      {
        id: 'qd3',
        topic: 'Interactive Coding Challenge',
        type: 'coding_challenge',
        difficulty: 'Intermediate',
        prompt: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Implement twoSum in O(n) time using a Map.',
        initialCode: `function twoSum(nums, target) {
  // Use a Map or object for O(n) lookup
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    // Write your solution here
    
  }
  return [];
}`,
        testCases: [
          {
            id: 'tcd1',
            input: 'twoSum([2, 7, 11, 15], 9)',
            expected: '[0, 1]',
            description: 'Finds basic complementary pair indices',
            testFnBody: `
              const res = twoSum([2, 7, 11, 15], 9);
              const isMatch = Array.isArray(res) && res.length === 2 && 
                ((res[0] === 0 && res[1] === 1) || (res[0] === 1 && res[1] === 0));
              return {
                passed: isMatch,
                actual: JSON.stringify(res)
              };
            `
          },
          {
            id: 'tcd2',
            input: 'twoSum([3, 2, 4], 6)',
            expected: '[1, 2]',
            description: 'Finds pair in unsorted array without using the same element twice',
            testFnBody: `
              const res = twoSum([3, 2, 4], 6);
              const isMatch = Array.isArray(res) && res.length === 2 && 
                ((res[0] === 1 && res[1] === 2) || (res[0] === 2 && res[1] === 1));
              return {
                passed: isMatch,
                actual: JSON.stringify(res)
              };
            `
          },
          {
            id: 'tcd3',
            input: 'twoSum([3, 3], 6)',
            expected: '[0, 1]',
            description: 'Handles duplicate numbers at distinct indices',
            testFnBody: `
              const res = twoSum([3, 3], 6);
              const isMatch = Array.isArray(res) && res.length === 2 && 
                ((res[0] === 0 && res[1] === 1) || (res[0] === 1 && res[1] === 0));
              return {
                passed: isMatch,
                actual: JSON.stringify(res)
              };
            `
          }
        ],
        solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        explanation: 'By storing each visited number and its index in a hash map, we can check if target - nums[i] was already encountered in O(1) time per element, achieving overall O(n) time and O(n) space complexity.',
        points: 15,
      },
      {
        id: 'qd4',
        topic: 'Recursion & Call Stack',
        type: 'code_snippet',
        difficulty: 'Intermediate',
        prompt: 'What happens when invoking this recursive function with n = 100000 in Node.js or modern browser engines?',
        codeSnippet: `function countdown(n) {
  if (n <= 0) return 'done';
  return countdown(n - 1);
}
countdown(100000);`,
        options: [
          'Returns "done" instantly due to automatic Tail Call Optimization (TCO)',
          'RangeError: Maximum call stack size exceeded',
          'Throws OutOfMemoryError',
          'Returns undefined'
        ],
        correctAnswers: [1],
        explanation: 'Although ES6 specifies proper tail calls in strict mode, almost all major engines (V8 in Chrome/Node, SpiderMonkey in Firefox) deliberately chose NOT to implement automatic TCO due to debugging and stack trace preservation concerns. Hence, deep recursion exceeds the call stack limit and throws RangeError.',
        points: 10,
      }
    ]
  }
];
