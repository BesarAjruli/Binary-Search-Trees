class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = array;
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const buildBST = (array, start, end) => {
      if (start > end) {
        return null;
      }

      const mid = Math.floor((start + end) / 2);
      const node = new Node(array[mid]);

      node.left = buildBST(array, start, mid - 1);
      node.right = buildBST(array, mid + 1, end);

      return node;
    };

    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    return buildBST(sortedArray, 0, sortedArray.length - 1);
  }

  insert(value) {
    const node = new Node(value);

    const insertNode = (currentNode, newNode) => {
      if (currentNode.value > newNode.value) {
        if (!newNode.left) {
          currentNode.left = newNode;
        } else {
          insertNode(currentNode.left, newNode);
        }
      } else {
        if (!newNode.right) {
          currentNode.right = newNode;
        } else {
          insertNode(currentNode.right, newNode);
        }
      }
    };

    if (!this.root) {
      this.root = node;
    } else {
      insertNode(this.root, node);
    }
  }
  deleteItem(value) {
    const findMinNode = (node) => {
      while (node.left !== null) {
        node = node.left;
      }
      return node;
    };

    const deleteItem = (currentNode, value) => {
      if (!currentNode) return null;

      if (currentNode.value > value) {
        currentNode.left = deleteItem(currentNode.left, value);
      } else if (currentNode.value < value) {
        currentNode.right = deleteItem(currentNode.right, value);
      } else {
        if (!currentNode.left && !currentNode.right) return null;

        if (!currentNode.left) {
          return currentNode.right;
        } else if (!currentNode.right) {
          return currentNode.left;
        }

        const minNode = findMinNode(currentNode.right);
        currentNode.value = minNode.value;
        currentNode.right = deleteItem(currentNode.right, minNode.value);
      }
      return currentNode;
    };

    this.root = deleteItem(this.root, value);
  }
  find(value) {
    const currentNode = this.root;
    return currentNode;
    if (!this.root) {
      return null;
    }
    while (currentNode) {
      if (value === currentNode.value) {
        if (value > this.root.data) {
          return `Item found in right node: ${currentNode.value}, item ${value}`;
        } else if (value < this.root.data) {
          return `Item found in left node: ${currentNode.value}, item ${value}`;
        } else {
          return `Item found in root: ${currentNode.value}, item ${value}`;
        }
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
    }

    return `${value} is not found`;
  }
  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    if (!this.root) return;

    const queue = [this.root];

    while (queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode);

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }

      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
    }
  }
  inOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    if (!this.root) return;

    const inOrder = (node) => {
      if (!node) {
        return null;
      }

      inOrder(node.left);
      callback(node);
      inOrder(node.right);
    };
    inOrder(this.root);
  }
  preOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    if (!this.root) return;

    const preOrder = (node) => {
      if (!node) return null;

      callback(node);
      preOrder(node.left);
      preOrder(node.right);
    };
    preOrder(this.root);
  }
  postOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }

    if (!this.root) return;

    const postOrder = (node) => {
      if (!node) return null;

      postOrder(node.left);
      postOrder(node.right);
      callback(node);
    };
    postOrder(this.root);
  }
  height(node) {
    if (!node) return -1;

    const leftH = this.height(node.left);
    const rightH = this.height(node.right);

    return Math.max(leftH, rightH) + 1;
  }
  depth(node) {
    if (!node) return -1;

    const findDepth = (currentNode, targetNode, level = 0) => {
      if (!currentNode) return -1;

      if (currentNode.data > targetNode.data) {
        return findDepth(currentNode.left, targetNode, level++);
      }

      if (currentNode.data < targetNode.data) {
        return findDepth(currentNode.right, targetNode, level++);
      }
    };
    findDepth(this.root, node);
  }
  isBalanced() {
    const checkBalance = (node) => {
      if (node === null) return true;

      const leftHeight = this.height(node.left);
      const rightHeight = this.height(node.right);

      return (
        Math.abs(leftHeight - rightHeight) <= 1 &&
        checkBalance(node.left) &&
        checkBalance(node.right)
      );
    };
    return checkBalance(this.root);
  }
  rebalance() {
    const values = [];
    this.inOrder((node) => values.push(node.data));

    this.root = this.buildTree(values);
  }
}
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function generateRandomArray(size, max) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

// Helper function to print all traversals
function printTraversals(tree) {
  console.log("\nLevel Order:");
  tree.levelOrder((node) => process.stdout.write(node.data + " "));

  console.log("\n\nPre Order:");
  tree.preOrder((node) => process.stdout.write(node.data + " "));

  console.log("\n\nPost Order:");
  tree.postOrder((node) => process.stdout.write(node.data + " "));

  console.log("\n\nIn Order:");
  tree.inOrder((node) => process.stdout.write(node.data + " "));
  console.log("\n");
}

console.log("1. Creating a Binary Search Tree from random numbers...");
const randomArray = generateRandomArray(10, 100);
const tree = new Tree(randomArray);

console.log("Initial array:", randomArray);
console.log("\nTree structure:");
prettyPrint(tree.root);

console.log("\n2. Checking if tree is balanced...");
console.log("Is balanced:", tree.isBalanced());

console.log("\n3. Printing all elements:");
printTraversals(tree);

console.log("4. Unbalancing tree by adding numbers > 100...");
tree.insert(100);
tree.insert(500);
tree.insert(600);
tree.insert(700);
tree.insert(800);
console.log("\nTree structure after adding large numbers:");
prettyPrint(tree.root);

console.log("\n5. Checking if tree is now unbalanced...");
console.log("Is balanced:", tree.isBalanced());

console.log("\n6. Rebalancing tree...");
tree.rebalance();
console.log("\nTree structure after rebalancing:");
prettyPrint(tree.root);

console.log("\n7. Confirming tree is balanced again...");
console.log("Is balanced:", tree.isBalanced());

console.log("\n8. Printing all elements of the balanced tree:");
printTraversals(tree);
