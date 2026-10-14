"use client";

import { useEffect, useRef } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import { toast } from "@/components/ui/toast";
import dayjs from "dayjs";

type ReadingTrackerProps = {
  slug: string;
  topic: string;
  topicName: string;
  title: string;
};

export function ReadingTracker({ slug, topic, topicName, title }: ReadingTrackerProps) {
  const lastSavedRef = useRef<number>(0);

  useEffect(() => {
    // 1. Check if user arrived via "resume=true"
    const params = new URLSearchParams(window.location.search);
    if (params.get("resume") === "true") {
      try {
        const progressMap = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.readingProgress) || "{}"
        );
        const path = window.location.pathname;
        const saved = progressMap[path];
        if (saved && saved.scrollY > 100) {
          setTimeout(() => {
            window.scrollTo({ top: saved.scrollY, behavior: "smooth" });
          }, 300);
        }
      } catch (e) {}
    }

    // 2. Track reading streak for today
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const streakData = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.readingStreaks) || "{}"
      );
      const datesRead: string[] = streakData.datesRead || [];

      if (!datesRead.includes(today)) {
        datesRead.push(today);
        streakData.datesRead = datesRead;

        // Calculate current streak
        let streak = 0;
        let checkDate = dayjs();
        while (datesRead.includes(checkDate.format("YYYY-MM-DD"))) {
          streak++;
          checkDate = checkDate.subtract(1, "day");
        }
        streakData.currentStreak = streak;
        streakData.longestStreak = Math.max(streak, streakData.longestStreak || 0);
        streakData.lastReadDate = today;

        localStorage.setItem(STORAGE_KEYS.readingStreaks, JSON.stringify(streakData));
      }

      // Check Night Owl condition (reading between 11 PM and 5 AM)
      const currentHour = new Date().getHours();
      if (currentHour >= 23 || currentHour < 5) {
        const alreadyAwarded = localStorage.getItem("prahlad-night-owl") === "true";
        if (!alreadyAwarded) {
          localStorage.setItem("prahlad-night-owl", "true");
          toast.success("Night Owl badge unlocked! 🦉", { duration: 5000 });
        }
      }
    } catch (e) {}

    // 3. Track scroll progress
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSavedRef.current < 800) return; // Throttle to every 800ms
      lastSavedRef.current = now;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const scrollY = window.scrollY;
      const percent = Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100)));

      try {
        const path = window.location.pathname;
        const progressMap = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.readingProgress) || "{}"
        );

        progressMap[path] = {
          slug,
          topic,
          topicName,
          title,
          percent,
          scrollY,
          updatedAt: now,
        };

        localStorage.setItem(STORAGE_KEYS.readingProgress, JSON.stringify(progressMap));
      } catch (e) {}
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, topic, topicName, title]);

  return null;
}
