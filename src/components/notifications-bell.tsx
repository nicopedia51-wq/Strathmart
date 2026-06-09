import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, ShoppingBag, MessageCircle, Utensils, Heart, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNotifications, notificationsStore, type NotifKind } from "@/lib/notifications-store";

const iconFor: Record<NotifKind, React.ComponentType<{ className?: string }>> = {
  order: ShoppingBag,
  pickup: Utensils,
  message: MessageCircle,
  like: Heart,
  system: Info,
};

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function NotificationsBell() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-ping rounded-full bg-accent opacity-75" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[90vw] origin-top-right animate-scale-in rounded-2xl border border-border bg-card/95 shadow-hover backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="font-display text-sm font-bold">Notifications</div>
              <div className="text-[11px] text-muted-foreground">
                {unread > 0 ? `${unread} unread` : "You're all caught up"}
              </div>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => notificationsStore.markAllRead()}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {items.length === 0 && (
              <div className="grid place-items-center px-4 py-10 text-center text-sm text-muted-foreground">
                <Bell className="mb-2 h-6 w-6 opacity-30" />
                No notifications yet.
              </div>
            )}
            {items.map((n) => {
              const Icon = iconFor[n.kind];
              const inner = (
                <div className="flex items-start gap-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${n.read ? "bg-secondary text-muted-foreground" : "gradient-accent text-accent-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-semibold text-foreground">{n.title}</div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(n.at)}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{n.body}</div>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </div>
              );
              const cls = `block px-4 py-3 transition hover:bg-secondary/60 ${!n.read ? "bg-accent/5" : ""}`;
              return n.href ? (
                <Link
                  key={n.id}
                  to={n.href}
                  onClick={() => {
                    notificationsStore.markRead(n.id);
                    setOpen(false);
                  }}
                  className={cls}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={n.id}
                  onClick={() => notificationsStore.markRead(n.id)}
                  className={`w-full text-left ${cls}`}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
