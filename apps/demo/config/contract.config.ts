import type { UnifiedContract } from "@w3docs/ui"

export const sampleContract: UnifiedContract = {
  name: "TrezoTodo",
  description:
    "Interactive documentation generated from the contract ABI. Inspect read methods, simulate writes, and listen to events — all from one place.",
  address: "0x2ad9172920b27074476EB7ae1963B84CE55ea1f1",
  chain: "11155420",
  verified: true,
  functions: [
    {
      name: "MAX_CONTENT_LENGTH",
      type: "read",
      description: "",
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      name: "addTask",
      type: "write",
      description: "",
      inputs: [
        {
          name: "content",
          type: "string",
          description: "",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "fetchAllTasks",
      type: "read",
      description: "",
      inputs: [],
      outputs: [
        {
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
    },
    {
      name: "fetchTaskById",
      type: "read",
      description: "",
      inputs: [
        {
          name: "id",
          type: "uint256",
          description: "",
        },
      ],
      outputs: [
        {
          type: "tuple",
        },
      ],
      stateMutability: "view",
    },
    {
      name: "getGlobalMessages",
      type: "read",
      description: "",
      inputs: [],
      outputs: [
        {
          type: "string[]",
        },
      ],
      stateMutability: "view",
    },
    {
      name: "getTaskCount",
      type: "read",
      description: "",
      inputs: [],
      outputs: [
        {
          type: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      name: "removeTask",
      type: "write",
      description: "",
      inputs: [
        {
          name: "id",
          type: "uint256",
          description: "",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "toggleTaskComplete",
      type: "write",
      description: "",
      inputs: [
        {
          name: "id",
          type: "uint256",
          description: "",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      name: "updateTaskContent",
      type: "write",
      description: "",
      inputs: [
        {
          name: "id",
          type: "uint256",
          description: "",
        },
        {
          name: "newContent",
          type: "string",
          description: "",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],
  events: [
    {
      name: "TaskAdded",
      signature: "TaskAdded(address,uint256,string)",
      description: "",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
        },
        {
          name: "taskId",
          type: "uint256",
          indexed: true,
        },
        {
          name: "content",
          type: "string",
          indexed: false,
        },
      ],
    },
    {
      name: "TaskRemoved",
      signature: "TaskRemoved(address,uint256)",
      description: "",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
        },
        {
          name: "taskId",
          type: "uint256",
          indexed: true,
        },
      ],
    },
    {
      name: "TaskToggled",
      signature: "TaskToggled(address,uint256,bool)",
      description: "",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
        },
        {
          name: "taskId",
          type: "uint256",
          indexed: true,
        },
        {
          name: "completed",
          type: "bool",
          indexed: false,
        },
      ],
    },
    {
      name: "TaskUpdated",
      signature: "TaskUpdated(address,uint256,string)",
      description: "",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
        },
        {
          name: "taskId",
          type: "uint256",
          indexed: true,
        },
        {
          name: "newContent",
          type: "string",
          indexed: false,
        },
      ],
    },
  ],
}

export const sampleABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "EmptyTaskContent",
    type: "error",
    inputs: [],
  },
  {
    name: "TaskContentTooLong",
    type: "error",
    inputs: [],
  },
  {
    name: "TaskDoesNotExist",
    type: "error",
    inputs: [],
  },
  {
    name: "TaskAdded",
    type: "event",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "content",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    name: "TaskRemoved",
    type: "event",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    name: "TaskToggled",
    type: "event",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "completed",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    name: "TaskUpdated",
    type: "event",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "taskId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newContent",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    name: "MAX_CONTENT_LENGTH",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "addTask",
    type: "function",
    inputs: [
      {
        name: "content",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "fetchAllTasks",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "content",
            type: "string",
            internalType: "string",
          },
          {
            name: "completed",
            type: "bool",
            internalType: "bool",
          },
        ],
        internalType: "struct TrezoTodo.Task[]",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "fetchTaskById",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "content",
            type: "string",
            internalType: "string",
          },
          {
            name: "completed",
            type: "bool",
            internalType: "bool",
          },
        ],
        internalType: "struct TrezoTodo.Task",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getGlobalMessages",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string[]",
        internalType: "string[]",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getTaskCount",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "removeTask",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "toggleTaskComplete",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "updateTaskContent",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newContent",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
]
