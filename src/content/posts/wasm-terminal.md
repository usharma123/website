---
title: "WASMTerminal: Running Linux in the Browser with WebAssembly"
description: "Building a client-side Linux terminal using WebAssembly, exploring memory isolation, persistence, and networking in the browser."
pubDate: "2026-01-11"
tags: ["webassembly", "linux", "systems-programming", "browser", "networking"]
---

I caught up with one of my friends this week over lunch and he was telling me how WASM (Web Assembly) is the future. Honestly, I didn't get it but he showed me how cool it could be where without pushing something to a server for a response, you can run it client-side. This made me wonder about whether someone can put an entire linux kernel onto the browser. Everyone says "Linux can run on everything" so I tried pushing that to it's limits.

**WASMTerminal** — a Linux terminal that runs entirely client-side using WebAssembly. No server-hosted VM, no Docker in the cloud, and no backend doing the compute. It's the browser running a Linux kernel and userland directly with low-level network capabilities.

This project builds on Joel Severin's work on a wasm-based Linux terminal. His project proved the core idea, and I wanted to push deeper into the parts I was most curious about, especially memory, persistence, and networking.

## Memory Isolation: One Process Per WASM Instance

One of the biggest hurdles is memory isolation. In the browser you don't get a real MMU, so instead of trying to fake it, my current approach is: each process runs in its own WebAssembly instance. Since Wasm memory is already sandboxed and well-scoped per instance, processes don't stomp on each other's memory the way they would if everything shared one linear heap. It's not "hardware MMU" isolation, but it's a practical browser-native way to prevent processes from clashing while keeping the system predictable. Still working on full memory isolation.

The Linux kernel itself runs in a single WebAssembly instance, but the key insight is that WebAssembly's linear memory model provides natural isolation boundaries. Each WASM module gets its own memory space that can't be directly accessed by other modules without explicit sharing. This is fundamentally different from a traditional OS where processes share physical memory but are separated by virtual memory mappings.

The actual implementation builds on top of Joel Severin's linux-wasm project, which compiles the Linux kernel to WebAssembly. The kernel runs in the browser's Web Worker, and syscalls are handled through a message-passing interface between the main thread and the worker. This architecture naturally provides process isolation because:

1. **WASM memory is per-instance** - Each WebAssembly module has its own linear memory space
2. **Worker isolation** - The kernel runs in a Web Worker, providing additional isolation from the main thread
3. **Syscall boundaries** - All interactions go through well-defined syscall interfaces

While this isn't a true hardware MMU, it provides practical isolation within browser constraints. The challenge is implementing full memory protection semantics (read-only pages, copy-on-write, etc.) which is still a work in progress.

## Persistence: IndexedDB-Backed Filesystem

On the persistence side, files survive refreshes via an IndexedDB-backed filesystem. This allows the terminal to maintain state across browser sessions. The implementation uses a `FilesystemPersist` class that stores files with their full paths as keys:

```javascript
class FilesystemPersist {
  constructor(dbName = 'linux-wasm-fs') {
    this.dbName = dbName;
    this.db = null;
    this.STORE_NAME = 'files';
    this.META_STORE = 'metadata';
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB: ' + request.error));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[FsPersist] Database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create files store if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { 
            keyPath: 'path' 
          });
          store.createIndex('directory', 'directory', { unique: false });
          store.createIndex('mtime', 'mtime', { unique: false });
        }

        // Create metadata store for filesystem stats
        if (!db.objectStoreNames.contains(this.META_STORE)) {
          db.createObjectStore(this.META_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  async saveFile(path, content, metadata = {}) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);

      // Convert string to Uint8Array if needed
      if (typeof content === 'string') {
        content = new TextEncoder().encode(content);
      }

      // Extract directory from path
      const lastSlash = path.lastIndexOf('/');
      const directory = lastSlash > 0 ? path.substring(0, lastSlash) : '/';

      const record = {
        path: path,
        directory: directory,
        content: content,
        size: content.length,
        mtime: Date.now(),
        mode: metadata.mode || 0o644,
        uid: metadata.uid || 0,
        gid: metadata.gid || 0,
      };

      const request = store.put(record);
      request.onerror = () => reject(new Error('Failed to save file: ' + request.error));
      request.onsuccess = () => resolve();
    });
  }

  async loadFile(path) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.get(path);

      request.onerror = () => reject(new Error('Failed to load file: ' + request.error));
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
            }
          });
        } else {
          resolve(null);
        }
      };
    });
  }

  async listFiles(prefix = '/') {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.openCursor();
      const files = [];

      request.onerror = () => reject(new Error('Failed to list files: ' + request.error));
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.path.startsWith(prefix)) {
            files.push({
              path: cursor.value.path,
              size: cursor.value.size,
              mtime: cursor.value.mtime,
              mode: cursor.value.mode,
            });
          }
          cursor.continue();
        } else {
          resolve(files);
        }
      };
    });
  }
}
```

This filesystem implementation stores files directly in IndexedDB with their content, metadata (permissions, timestamps), and directory structure. Files in `/home`, `/root`, and `/opt` are automatically persisted and restored on the next browser session, making it feel more like a real Linux environment.

## Networking: WebSocket Proxy to TCP

For networking I use a secure WebSocket proxy that bridges WebSocket traffic to TCP so browser code can still talk to the outside world in a controlled way. The implementation consists of two parts:

**Server-side (`server/ws-proxy.js`)**: A Node.js WebSocket proxy server that:
- Accepts WebSocket connections from the browser
- Bridges WebSocket messages to real TCP connections
- Implements security features like JWT authentication, IP address filtering (blocks private/internal ranges), rate limiting, DNS rebinding protection, and port allowlists (80, 443 by default)
- Deployed on Railway for production use

**Client-side (`site/net-proxy.js`)**: A browser client that:
- Connects to the WebSocket proxy server
- Translates Linux network syscalls (like `connect`, `send`, `recv`) into WebSocket messages
- Routes incoming TCP data back to the appropriate file descriptors in the Linux kernel

The proxy acts as a bridge between the browser's WebSocket API and real TCP connections, enabling network capabilities while maintaining security boundaries. This allows the Linux terminal to make HTTP requests, connect to APIs, and perform other network operations that would normally be impossible from pure browser JavaScript.

## Package System: On-Demand WASM Binaries

I've also added the plumbing for an on-demand package system to download Wasm binaries when needed (e.g., Node), but I haven't started using it in the main flow yet. Most likely will need to use a CloudFlareCDN to accomplish this and also realized that I would need to write a custom NodeJS binary in WASM so that this tool can have access to package managers.

The package system includes:

- **`pkghelper`** (`linux-wasm/patches/initramfs/pkghelper.c`): A C binary that manages package installation and caching within the Linux environment
- **`pkg-registry.js`**: Browser-side registry that tracks available packages and their metadata
- **`pkg-download.js`**: Handles downloading large WASM binaries (like Node.js ~50MB) with progress reporting and terminal progress bars
- **IndexedDB caching**: Packages are cached in IndexedDB and automatically restored on boot

The system is designed to fetch packages from a CDN (likely Cloudflare R2) and install them on-demand. The challenge is that most Linux binaries need to be compiled to WebAssembly, which means creating custom WASM builds of tools like Node.js. This is still a work in progress, but the infrastructure is in place.

## Current Limitations and Future Work

There are still browser constraints, WASM constraints, and rough edges, but it's been a useful exploration of how far you can push systems software inside a tab. Currently this only runs on laptops and desktops, trying to see why it isn't running on phones yet.

The main challenges I'm still working through:

- **Full memory isolation** - While process isolation works, true MMU-like behavior is still a work in progress
- **Mobile compatibility** - Performance and memory constraints on mobile devices need investigation
- **Package ecosystem** - Building out the on-demand package system and custom Node.js WASM binary
- **Network security** - Ensuring the WebSocket proxy maintains proper security boundaries

## Conclusion

If anyone wants to help/contribute, lets talk. I think this has been very funny to build. Who would have thought about having a semi-functional Linux kernel in your browser.

WASMTerminal demonstrates that with WebAssembly, we can push the boundaries of what's possible in the browser. While it's not a replacement for a real Linux system, it's a fascinating exploration of systems programming within browser constraints. The project shows that "Linux can run on everything" might just include your web browser.

---

**Try it out:** [https://head.wasmterminal.pages.dev/](https://head.wasmterminal.pages.dev/)

**Source code:** [github.com/usharma123/wasmterminal](https://github.com/usharma123/wasmterminal)
