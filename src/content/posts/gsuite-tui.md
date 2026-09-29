---
title: 'GSuiteTUI: Google Workspace in the terminal'
description: 'A Rust terminal interface for Calendar, Gmail, and Drive, with shared authentication and asynchronous API requests.'
pubDate: '2026-02-02'
tags: ['rust', 'terminal-ui', 'google-api', 'productivity', 'cli']
---

I wanted to check my next meeting or triage an email from the terminal. Those are small tasks, but I kept opening a browser and losing my place among its tabs.

GSuiteTUI is a Rust terminal interface for Google Calendar, Gmail, and Drive. It uses the Google APIs while keeping service selection, lists, and common actions in one keyboard-driven interface.

## The event loop

I used `ratatui` for rendering, `crossterm` for terminal events, `tokio` for asynchronous work, and `reqwest` for HTTP requests.

1. Read an input event.
2. Update the application state.
3. Render the active service from that state.
4. Return to the loop for the next input or API response.

Calendar, Gmail, and Drive each have their own state and share authentication and rendering code.

## Authentication and API data

The browser-based OAuth flow returns to a temporary local HTTP server. Refresh tokens allow later sessions to renew access without asking for consent every time.

API responses still need to be shaped for the terminal. This Calendar example formats an event's start time and duration:

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

The Gmail view focuses on inbox triage: marking messages as read, archiving, and starring. Longer interactions can still go through the browser.

## Fitting the interface into a terminal

The layout has a service selector, a content pane, and a footer with the available keys:

| Region    | Contents                                            |
| --------- | --------------------------------------------------- |
| Header    | GSuiteTUI and the signed-in account                 |
| Left pane | Calendar, Gmail, and Drive selection                |
| Main pane | Events, messages, or files for the selected service |
| Footer    | Available keys, such as `j/k`, `Enter`, and `q`     |

The Calendar view groups events by day. For example:

| Day      | Time  | Duration | Event         |
| -------- | ----- | -------- | ------------- |
| Today    | 09:00 | 30 min   | Team Standup  |
| Today    | 11:00 | 60 min   | Design Review |
| Today    | 14:00 | 45 min   | 1:1 with PM   |
| Tomorrow | 10:00 | 90 min   | Sprint Plan   |

Terminal size limits how much context fits on screen. Status colors and bold text help distinguish events and unread messages, while the footer keeps the current controls visible.

## Keeping requests out of the input loop

Google API requests can take longer than a keystroke should. The application uses messages to update state as data arrives. These are the relevant message shapes and state changes:

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

The sketch omits the task dispatch. The request must run outside the input/render loop for navigation to remain responsive. A loading indicator shows when work is pending.

## Problems I ran into

Authentication is awkward over SSH because the consent page opens in a browser. I explored a device-code fallback for that case, but which flow works depends on the Google client and requested permissions.

Time zones were another source of mistakes. Events need to display in local time, including across daylight-saving transitions. I used `chrono` for date and time handling.

I also added batching and caching to reduce repeated API calls. Calendar data refreshes on request or after five minutes. Terminal differences still need attention, particularly color and mouse support across iTerm2, Alacritty, and Windows Terminal.

## What's unfinished

I want to add quick event creation, basic Gmail composition through `$EDITOR`, meeting notifications, account switching, and offline viewing. The current focus is checking information and taking small actions without leaving the terminal.

## Running it

```bash
git clone https://github.com/usharma123/GSuiteTUI
cd GSuiteTUI/tui-suite
cargo run
```

The README covers Google API credentials and the initial authorization step.

[Source code](https://github.com/usharma123/GSuiteTUI)
