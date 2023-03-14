class A {
  constructor(log) {
    console.log("log", log);
    this.log = log;

    this.b = new B();
  }

  methodA() {
    console.log("methodA", this.log);
  }
}

class B {
  constructor() {}

  static sta(a) {
    console.log(a);
  }

  methodB() {
    console.log("Method B");
  }
}

const a = new A();
a.b.methodB();

// // class의 extends와 this.a = new A()의 차이는 뭘까?
// // 실험 1 : this.a = new A("이름", 32) 를 입력하면 어떻게 될까?
// // 실험 2 : constructor(name, age) {
// //     this.a = new A(name, age);
// //   }
// class C {
//   constructor() {
//     this.a = new A();
//   }
// }

// const c = new C();
// c.a.methodA(); // 출력 결과: Method A
// c.b.methodB(); // 출력 결과: Method B

// const Slack = require("slack-node");

// const token = "YOUR_SLACK_TOKEN_HERE";
// const slack = new Slack(token);

// slack.api(
//   "chat.postMessage",
//   {
//     channel: "#general",
//     text: "Hello from Node.js!",
//   },
//   function (err, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(response);
//     }
//   }
// );
