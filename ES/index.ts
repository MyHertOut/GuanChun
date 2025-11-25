/**
 * ECMAScript (ES6+) Features Showcase
 *
 * 这个文件包含了 ES6+ 核心特性的代码示例和使用场景说明。
 * 运行方式: 使用 ts-node 运行或编译后在浏览器/Node环境中执行。
 */

// ==========================================
// 1. 变量声明 (Let & Const)
// ==========================================
function variableDemo() {
  console.log("--- 1. Let & Const ---");
  // const 用于常量
  const API_URL = "https://api.example.com";

  // let 用于块级作用域变量
  let count = 0;
  for (let i = 0; i < 3; i++) {
    count += i;
    // i 只在这里有效
  }
  // console.log(i); // Error: i is not defined
  console.log(`Count: ${count}`);
}

// ==========================================
// 2. 箭头函数 (Arrow Functions)
// ==========================================
function arrowFunctionDemo() {
  console.log("\n--- 2. Arrow Functions ---");
  const numbers = [1, 2, 3];

  // 简洁语法
  const doubled = numbers.map((n) => n * 2);
  console.log(`Doubled: ${doubled}`);

  // Lexical 'this' (在对象方法中通常不使用箭头函数，除非为了捕获外层 this)
  class Counter {
    count = 0;
    increment = () => {
      // 箭头函数自动绑定实例的 this
      this.count++;
      console.log(`Counter: ${this.count}`);
    };
  }
  const c = new Counter();
  const inc = c.increment;
  inc(); // Works correctly
}

// ==========================================
// 3. 模板字符串 (Template Literals)
// ==========================================
function templateStringDemo() {
  console.log("\n--- 3. Template Literals ---");
  const user = "Alice";
  const age = 25;

  // 多行与插值
  const greeting = `
    Hello, ${user}!
    Next year you will be ${age + 1}.
    `;
  console.log(greeting.trim());
}

// ==========================================
// 4. 解构赋值 (Destructuring)
// ==========================================
function destructuringDemo() {
  console.log("\n--- 4. Destructuring ---");
  // 对象解构
  const person = { name: "Bob", age: 30, role: "Dev" };
  const { name, role } = person;
  console.log(`Name: ${name}, Role: ${role}`);

  // 数组解构
  const coords = [10, 20];
  const [x, y] = coords;
  console.log(`X: ${x}, Y: ${y}`);
}

// ==========================================
// 5. 默认参数 (Default Parameters)
// ==========================================
function defaultParamsDemo(user: string = "Guest", isActive: boolean = true) {
  console.log("\n--- 5. Default Parameters ---");
  console.log(`User: ${user}, Active: ${isActive}`);
}

// ==========================================
// 6. 扩展与剩余 (Spread & Rest)
// ==========================================
function spreadRestDemo() {
  console.log("\n--- 6. Spread & Rest ---");
  // Spread (数组合并)
  const arr1 = [1, 2];
  const arr2 = [...arr1, 3, 4];
  console.log(`Merged: ${arr2}`);

  // Spread (对象合并/浅拷贝)
  const obj1 = { a: 1 };
  const obj2 = { ...obj1, b: 2 };
  console.log("Merged Obj:", obj2);

  // Rest (收集参数)
  const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
  console.log(`Sum: ${sum(1, 2, 3, 4)}`);
}

// ==========================================
// 7. Async / Await
// ==========================================
async function asyncDemo() {
  console.log("\n--- 7. Async/Await ---");

  const simulateFetch = () =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve("Data loaded"), 500);
    });

  try {
    console.log("Fetching...");
    const result = await simulateFetch();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// 8. 可选链与空值合并 (Optional Chaining & Nullish Coalescing)
// ==========================================
function modernOperatorsDemo() {
  console.log("\n--- 8. Modern Operators ---");
  const response: any = {
    data: {
      user: null,
    },
  };

  // Optional Chaining (?.)
  // 安全访问深层属性，如果中间为 null/undefined 则返回 undefined
  const userName = response.data?.user?.name;
  console.log(`User Name: ${userName}`); // undefined

  // Nullish Coalescing (??)
  // 只有在左侧为 null 或 undefined 时才返回右侧 (区别于 || 会处理 0 或 false)
  const displayName = userName ?? "Anonymous";
  console.log(`Display Name: ${displayName}`);
}

// ==========================================
// 9. Map & Set
// ==========================================
function mapSetDemo() {
  console.log("\n--- 9. Map & Set ---");
  // Set 去重
  const numbers = [1, 1, 2, 3, 3];
  const unique = [...new Set(numbers)];
  console.log(`Unique: ${unique}`);

  // Map 键值对
  const map = new Map();
  const keyObj = { id: 1 };
  map.set(keyObj, "Object Value");
  console.log(map.get(keyObj));
}

// ==========================================
// Main Execution
// ==========================================
async function main() {
  variableDemo();
  arrowFunctionDemo();
  templateStringDemo();
  destructuringDemo();
  defaultParamsDemo();
  spreadRestDemo();
  modernOperatorsDemo();
  mapSetDemo();
  await asyncDemo();
}

main();
