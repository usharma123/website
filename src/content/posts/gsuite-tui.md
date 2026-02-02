---
title: "GSuiteTUI: Managing Google Workspace from Your Terminal"
description: "Building a terminal user interface in Rust for Google Calendar, Gmail, and Drive—because sometimes the browser is just too much."
pubDate: "2026-02-02"
tags: ["rust", "terminal-ui", "google-api", "productivity", "cli"]
---

I spend a lot of time in the terminal. Between coding, git operations, and server management, context-switching to a browser tab for calendar events or emails always felt jarring. The browser is great for rich interactions, but for quick lookups—"when's my next meeting?" or "did that email come through?"—it's overkill. I wanted something faster, something that stayed in my workflow.

That's how **GSuiteTUI** was born—a terminal user interface built in Rust that brings Google Calendar, Gmail, and Drive directly into the terminal. No browser tabs, no Electron apps, just your terminal and the Google APIs.

## Why a Terminal UI?

Modern productivity tools are feature-rich but often bloated. Google Calendar in a browser means:

- Opening a new tab
- Waiting for JavaScript to load
- Getting distracted by other tabs
- Losing your mental context

A terminal UI inverts this. It's instant, focused, and stays where you're already working. For developers who live in the terminal, this means:

1. **Zero context switching** - Check your calendar without leaving vim/neovim
2. **Keyboard-first navigation** - No mouse needed
3. **Resource efficiency** - TUIs use a fraction of browser memory
4. **SSH-friendly** - Works over remote connections

## Architecture: Rust + ratatui

I chose Rust for this project for a few reasons: performance, memory safety, and the excellent ecosystem around terminal UIs. The stack consists of:

- **ratatui** - The Rust TUI framework (successor to tui-rs)
- **tokio** - Async runtime for handling API calls
- **reqwest** - HTTP client for Google API requests
- **crossterm** - Cross-platform terminal manipulation

The architecture follows a standard event-driven TUI pattern:

```
Input Events → App State → UI Rendering
     ↑                          ↓
     └──────── Event Loop ──────┘
```

Each Google service (Calendar, Gmail, Drive) is implemented as a separate module with its own state management, while sharing common authentication and rendering infrastructure.

## Google API Integration

Working with Google's APIs from a CLI context presented some interesting challenges. The OAuth2 flow, designed for browsers, needed adaptation:

1. **Local callback server** - Spin up a temporary HTTP server to catch the OAuth redirect
2. **Token persistence** - Store refresh tokens securely for future sessions
3. **Automatic refresh** - Handle token expiration transparently

For Calendar, the API returns events in a rich JSON format that needed mapping to a terminal-friendly representation:

```rust
struct CalendarEvent {
    summary: String,
    start: DateTime<Local>,
    end: DateTime<Local>,
    location: Option<String>,
    attendees: Vec<String>,
}

impl CalendarEvent {
    fn format_for_display(&self) -> String {
        let time_str = self.start.format("%H:%M").to_string();
        let duration = self.end - self.start;
        format!(
            "{} ({} min) - {}",
            time_str,
            duration.num_minutes(),
            self.summary
        )
    }
}
```

Gmail integration focuses on inbox overview and quick triage—marking as read, archiving, starring—rather than full email composition. For anything complex, you can still jump to the browser.

## Terminal UI Design

Designing for the terminal has unique constraints. You're working with:

- Fixed-width characters
- Limited colors (though modern terminals support 24-bit)
- No images (ASCII art aside)
- Variable terminal sizes

The interface uses a three-pane layout:

```
┌────────────────────────────────────────────────┐
│  GSuiteTUI                        user@gmail   │
├──────────────┬─────────────────────────────────┤
│              │                                 │
│  ▸ Calendar  │  Today - Feb 2, 2026            │
│    Gmail     │                                 │
│    Drive     │  09:00 (30 min) - Team Standup  │
│              │  11:00 (60 min) - Design Review │
│              │  14:00 (45 min) - 1:1 with PM   │
│              │                                 │
│              │  Tomorrow                       │
│              │  10:00 (90 min) - Sprint Plan   │
│              │                                 │
├──────────────┴─────────────────────────────────┤
│ [j/k] Navigate  [Enter] Details  [q] Quit      │
└────────────────────────────────────────────────┘
```

The left pane shows service selection, the main pane shows service content, and the footer displays context-sensitive keybindings. Colors indicate status—upcoming events in green, overdue in red, unread emails in bold.

## Handling Async Operations

Google API calls can be slow. Without careful handling, the UI would freeze during requests. I used Rust's async/await with a message-passing architecture:

```rust
enum Message {
    FetchCalendarEvents,
    CalendarEventsLoaded(Vec<CalendarEvent>),
    FetchEmails,
    EmailsLoaded(Vec<Email>),
    Error(String),
}

async fn handle_message(msg: Message, state: &mut AppState) {
    match msg {
        Message::FetchCalendarEvents => {
            state.loading = true;
            let events = fetch_events().await;
            // Send CalendarEventsLoaded back to main loop
        }
        Message::CalendarEventsLoaded(events) => {
            state.calendar_events = events;
            state.loading = false;
        }
        // ...
    }
}
```

This keeps the UI responsive—you can still navigate while data loads in the background. A small spinner in the status bar indicates pending operations.

## Challenges

**OAuth in the terminal**: The standard OAuth flow opens a browser for consent. In a pure terminal environment (like SSH), this is problematic. I implemented a device flow fallback where you get a code to enter at google.com/device from any browser.

**Timezone handling**: Calendar events come in UTC but users think in local time. The chrono crate handles this well, but edge cases around DST transitions required careful testing.

**Rate limiting**: Google APIs have quotas. I added request batching and caching to minimize API calls. Calendar events, for instance, are cached and only refreshed on explicit request or after 5 minutes.

**Terminal compatibility**: Different terminals (iTerm2, Alacritty, Windows Terminal) have varying support for features like true color and mouse input. crossterm abstracts most of this, but some edge cases remain.

## What's Next

The tool is functional for my daily use, but there's more I want to add:

- **Quick event creation** - Add events directly from the terminal
- **Gmail compose** - Basic email composition with $EDITOR integration
- **Notifications** - Desktop notifications for upcoming events
- **Multiple accounts** - Switch between work and personal Google accounts
- **Offline mode** - Cache data for viewing without network

## Try It

If you live in the terminal and use Google Workspace, give it a try:

```bash
git clone https://github.com/usharma123/GSuiteTUI
cd GSuiteTUI/tui-suite
cargo run
```

You'll need to set up Google API credentials (instructions in the README), but after that first OAuth dance, it's smooth sailing.

---

GSuiteTUI scratches a personal itch—staying in the terminal while still being able to check my calendar and emails. It's not trying to replace the full Google Workspace experience, just provide a faster path for the 80% of interactions that are simple lookups and quick actions. For those of us who measure productivity in keystrokes, that matters.

**Source code:** [github.com/usharma123/GSuiteTUI](https://github.com/usharma123/GSuiteTUI)
