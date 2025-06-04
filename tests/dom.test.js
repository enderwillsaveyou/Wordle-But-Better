class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.textContent = '';
    this.className = '';
    this.style = {};
    this._id = '';
    this.ownerDocument = null;
  }
  appendChild(child) {
    this.children.push(child);
    child.ownerDocument = this.ownerDocument;
  }
  set id(value) {
    this._id = value;
    if (this.ownerDocument) {
      this.ownerDocument._elements[value] = this;
    }
  }
  get id() {
    return this._id;
  }
}

class Document {
  constructor() {
    this.body = new Element('body');
    this.body.ownerDocument = this;
    this._elements = {};
  }
  createElement(tagName) {
    const el = new Element(tagName);
    el.ownerDocument = this;
    return el;
  }
  getElementById(id) {
    return this._elements[id] || null;
  }
  addEventListener() {
    // no-op for tests
  }
}

global.document = new Document();

const board = document.createElement('div');
board.id = 'board';
document.body.appendChild(board);

require('../script.js');

const rows = board.children.length;
const cols = rows > 0 ? board.children[0].children.length : 0;

if (rows === 6 && cols === 5) {
  console.log('✅ DOM test passed');
} else {
  console.error('❌ DOM test failed');
  process.exit(1);
}
