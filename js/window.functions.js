
/**
 * Init IndexedDB
 * @type {IDBFactory | *}
 */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/**
 * Init IDBTransaction
 * @type {IDBFactory | *}
 */
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

/**
 * Init IDBKeyRange
 * @type {IDBFactory | *}
 */
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
