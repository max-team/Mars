

# UT(单元测试)

单元测试初步技术方案采用jest，配置简单

### 官网
https://jestjs.io/

### 用法

1. hello world

```shell
// add.js

function sum(a, b) {
    return a + b;
}
export default sum


// __test__/add.test.js
import sum from 'relative/path/sum';

test('add 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
})

```

2. 常见用法

```shell

// 判断相等 基本类型 toBe， 引用类型 toEqual
test('two plus tow is four', () => {
    expect(2 + 2).toBe(4);
});

test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
});


// 判断null undeinfed 
test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});


// 比较判断
test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

// 浮点比较判断
test('adding floating point', () => {
    const value = 0.1 + 0.2;
    expect(value).toBeCloseTo(0.3);
});

// 字符串  数组包含判断
test('there i not I in team', () => {
    expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
});

const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'beer',
];

test('the shopping list has beer on it', () => {
    expect(shoppingList).not.toContain('beer1');
});

// 异步

test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();  // 基于callback 记得调用done
  }

  fetchData(callback);
});

test('the data is peanut butter', () => {
  expect.assertions(1);
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

test('the data is peanut butter', async () => {
  expect.assertions(1);
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

```

3. 更多用法参照官方文档