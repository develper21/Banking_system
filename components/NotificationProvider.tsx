"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

const FALLBACK_DURATION = 4000;

type NotificationType = "success" | "error" | "info";

type NotificationInput = {
  title: string;
  message?: string;
  type?: NotificationType;
  durationMs?: number;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  durationMs: number;
};

type NotificationContextType = {
  notify: (notification: NotificationInput) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return ctx;
};

const getId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const typeStyles: Record<NotificationType, string> = {
  success: "border-green-500/40 bg-green-50 text-green-900",
  error: "border-red-500/40 bg-red-50 text-red-900",
  info: "border-blue-500/40 bg-blue-50 text-blue-900",
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));

    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const notify = useCallback(
    ({ title, message = "", type = "info", durationMs = FALLBACK_DURATION }: NotificationInput) => {
      const id = getId();
      setNotifications((prev) => [...prev, { id, title, message, type, durationMs }]);

      if (durationMs) {
        timers.current[id] = setTimeout(() => dismiss(id), durationMs);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-sm flex-col gap-3">
        {notifications.map(({ id, title, message, type }) => (
          <div
            key={id}
            className={`pointer-events-auto flex flex-col gap-1 rounded-xl border px-4 py-3 shadow-lg transition-all ${typeStyles[type]}`}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold leading-tight">{title}</p>
                {message ? (
                  <p className="text-sm opacity-80">{message}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="text-current/70 transition hover:text-current"
                onClick={() => dismiss(id)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
