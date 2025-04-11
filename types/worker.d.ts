declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// 声明导入URL的模块
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

// 支持URL导入Web Worker
declare module '*/workers/*.ts' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
} 