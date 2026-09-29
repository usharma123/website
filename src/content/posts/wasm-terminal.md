---
title: 'WASMTerminal: running Linux in the browser'
description: 'Experimenting with a Linux kernel in WebAssembly, IndexedDB persistence, and a WebSocket-to-TCP network proxy.'
pubDate: '2026-01-11'
tags: ['webassembly', 'linux', 'systems-programming', 'browser', 'networking']
---

A friend showed me a WebAssembly demo over lunch, and I started wondering how much of a Linux environment could fit in a browser. That became WASMTerminal, built on Joel Severin's linux-wasm work.

The kernel and userland run in the browser. File persistence uses IndexedDB, while outbound networking goes through a server-side WebSocket-to-TCP proxy. The compute runs locally, but networking still needs that external service.

## Memory isolation is still work in progress

I'm exploring one WebAssembly instance per process. Separate linear memories provide a useful starting point, but an instance can also import memory supplied by its host. Creating instances alone doesn't establish all the guarantees of process isolation.

The kernel runs in a Web Worker and communicates with the main thread through messages. That separates kernel work from the interface, but it doesn't supply a hardware MMU or implement read-only pages and copy-on-write by itself.

Full memory-protection semantics remain unfinished. The distinction matters because a demo that runs programs successfully hasn't necessarily handled hostile or malformed programs correctly.

## Persisting files in IndexedDB

`FilesystemPersist` stores file contents and metadata under their full paths. Directory and modification-time indexes support lookup. This is the implementation sketch:

```javascript
class FilesystemPersist {
  constructor(dbName = 'linux-wasm-fs') {
    this.dbName = dbName
    this.db = null
    this.STORE_NAME = 'files'
    this.META_STORE = 'metadata'
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB: ' + request.error))
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('[FsPersist] Database initialized')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create files store if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'path',
          })
          store.createIndex('directory', 'directory', { unique: false })
          store.createIndex('mtime', 'mtime', { unique: false })
        }

        // Create metadata store for filesystem stats
        if (!db.objectStoreNames.contains(this.META_STORE)) {
          db.createObjectStore(this.META_STORE, { keyPath: 'key' })
        }
      }
    })
  }

  async saveFile(path, content, metadata = {}) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readwrite')
      const store = tx.objectStore(this.STORE_NAME)

      // Convert string to Uint8Array if needed
      if (typeof content === 'string') {
        content = new TextEncoder().encode(content)
      }

      // Extract directory from path
      const lastSlash = path.lastIndexOf('/')
      const directory = lastSlash > 0 ? path.substring(0, lastSlash) : '/'

      const record = {
        path: path,
        directory: directory,
        content: content,
        size: content.length,
        mtime: Date.now(),
        mode: metadata.mode || 0o644,
        uid: metadata.uid || 0,
        gid: metadata.gid || 0,
      }

      const request = store.put(record)
      request.onerror = () =>
        reject(new Error('Failed to save file: ' + request.error))
      request.onsuccess = () => resolve()
    })
  }

  async loadFile(path) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readonly')
      const store = tx.objectStore(this.STORE_NAME)
      const request = store.get(path)

      request.onerror = () =>
        reject(new Error('Failed to load file: ' + request.error))
      request.onsuccess = () => {
        if (request.result) {
          resolve({
            content: request.result.content,
            metadata: {
              size: request.result.size,
              mtime: request.result.mtime,
              mode: request.result.mode,
              uid: request.result.uid,
              gid: request.result.gid,
            },
          })
        } else {
          resolve(null)
        }
      }
    })
  }

  async listFiles(prefix = '/') {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readonly')
      const store = tx.objectStore(this.STORE_NAME)
      const request = store.openCursor()
      const files = []

      request.onerror = () =>
        reject(new Error('Failed to list files: ' + request.error))
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.value.path.startsWith(prefix)) {
            files.push({
              path: cursor.value.path,
              size: cursor.value.size,
              mtime: cursor.value.mtime,
              mode: cursor.value.mode,
            })
          }
          cursor.continue()
        } else {
          resolve(files)
        }
      }
    })
  }
}
```

Files under `/home`, `/root`, and `/opt` are persisted and restored in later sessions. Records include bytes, permissions, ownership fields, and timestamps.

There is a detail I'd tighten in this sketch: `saveFile` resolves on the request's success event. A completed write transaction is the stronger signal that the write committed, since a transaction can still abort after an individual request succeeds.

## Bridging browser networking to TCP

The proxy has a browser client and a Node.js server:

| Component            | Job                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `site/net-proxy.js`  | Translate guest networking requests into WebSocket messages and route responses to file descriptors |
| `server/ws-proxy.js` | Accept WebSocket connections and forward traffic to TCP destinations                                |

The proxy implementation includes JWT authentication, private-address filtering, rate limits, DNS-rebinding checks, and a port allowlist that defaults to 80 and 443. I used Railway for the server deployment.

This makes network access a separate trust boundary from the browser compute. The proxy's destination checks need to hold for the connection actually opened, including after DNS resolution.

## Loading packages on demand

I added the pieces for fetching WASM packages when needed:

| Piece             | Responsibility                                          |
| ----------------- | ------------------------------------------------------- |
| `pkghelper`       | Install and cache packages inside the guest environment |
| `pkg-registry.js` | Track package metadata                                  |
| `pkg-download.js` | Download binaries and report progress                   |
| IndexedDB         | Keep downloaded packages for later boots                |

That path isn't integrated into the main flow yet. I was considering Cloudflare R2 for distribution, and tools such as Node.js would need compatible WASM builds. The download plumbing doesn't make those packages available by itself.

## What still needs work

This version runs on laptops and desktops; mobile failures still need investigation. Memory protection, package compatibility, and proxy security also need more work.

Getting a shell running was enough to keep me interested. The next challenge is making its behavior predictable across refreshes, failed downloads, and constrained devices.

[Try WASMTerminal](https://head.wasmterminal.pages.dev/) · [Source code](https://github.com/usharma123/wasmterminal)
