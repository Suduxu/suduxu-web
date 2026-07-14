'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface EventLog {
  id: string;
  type: string;
  payload: string;
  time: string;
}

export interface HeroInteractiveDemoProps {
  className?: string;
  maxEvents?: number;
  tickRate?: number;
  joystickRadius?: number;
}

export function HeroInteractiveDemo({
  className = '',
  maxEvents = 10,
  tickRate = 100,
  joystickRadius = 40,
}: HeroInteractiveDemoProps) {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(pos);
  const draggingRef = useRef(isDragging);
  const lastLoggedPos = useRef<{ x: number; y: number } | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    draggingRef.current = isDragging;
  }, [isDragging]);

  const addEvent = useCallback((type: string, payload: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    setEvents((prev) => [{ id: Math.random().toString(36).substring(2, 9), type, payload, time }, ...prev].slice(0, maxEvents));
  }, [maxEvents]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (draggingRef.current) {
        const { x, y } = posRef.current;
        const last = lastLoggedPos.current;
        const changed = !last || Math.round(last.x) !== Math.round(x) || Math.round(last.y) !== Math.round(y);
        if (changed) {
          addEvent('JOYSTICK', `x: ${Math.round(posRef.current.x)}, y: ${Math.round(posRef.current.y)}`);
          lastLoggedPos.current = { x, y };
        }
      }
    }, tickRate);
    return () => clearInterval(timer);
  }, [addEvent, tickRate]);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    addEvent('SYSTEM', 'Suduxu initialized');
    addEvent('NETWORK', 'Listening 0.0.0.0:8080');
    addEvent('CLIENT', 'Connected (192.168.1.42)');
  }, [addEvent]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastLoggedPos.current = null;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePos(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePos(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setPos({ x: 0, y: 0 });
    addEvent('JOYSTICK', 'x: 0, y: 0');
    lastLoggedPos.current = { x: 0, y: 0 };
  };

  const updatePos = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    let dx = e.clientX - rect.left - centerX;
    let dy = e.clientY - rect.top - centerY;
    const maxR = rect.width / 2 - joystickRadius / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    setPos({ x: dx, y: dy });
  };

  const handleButtonDown = (label: string) => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    addEvent('BUTTON', `${label} Down`);
  };

  const handleButtonUp = (label: string) => (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.releasePointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const stillInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    addEvent('BUTTON', `${label} ${stillInside ? 'Released' : 'Cancelled'}`);
  };

  return (
    <div className={`flex w-full h-[380px] overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-md ${className}`}>
      <div className="flex w-2/5 flex-col items-center justify-center border-r border-fd-border bg-fd-muted/30 p-6 sm:p-8">
        <div className="relative flex h-64 w-32 flex-col justify-between rounded-[2.5rem] border-[6px] border-fd-border bg-fd-background p-2 shadow-inner">
          <div className="mx-auto mt-2 h-1.5 w-8 rounded-full bg-fd-border" />
          <div
            ref={padRef}
            className="relative mx-auto mt-2 h-24 w-24 touch-none rounded-full bg-fd-muted shadow-inner"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="absolute left-1/2 top-1/2 rounded-full bg-brand shadow-md transition-transform duration-75 ease-out"
              style={{
                width: `${joystickRadius}px`,
                height: `${joystickRadius}px`,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) ${isDragging ? 'scale(0.92)' : 'scale(1)'}`,
              }}
            />
          </div>
          <div className="mb-5 mt-auto flex justify-center gap-3">
            <button
              onPointerDown={handleButtonDown('Action A')}
              onPointerUp={handleButtonUp('Action A')}
              className="h-8 w-8 rounded-full bg-fd-border hover:bg-fd-muted-foreground transition-colors active:scale-90"
            />
            <button
              onPointerDown={handleButtonDown('Action B')}
              onPointerUp={handleButtonUp('Action B')}
              className="h-8 w-8 rounded-full bg-fd-border hover:bg-fd-muted-foreground transition-colors active:scale-90"
            />
          </div>
        </div>
      </div>
      <div className="flex w-3/5 flex-col bg-background p-5 text-left font-mono text-[12px] leading-relaxed text-zinc-300">
        <div className="mb-3 border-b border-zinc-800 pb-2 text-[10px] tracking-widest text-zinc-500 uppercase shrink-0">
          Live Event Stream
        </div>
        <div className="flex flex-col-reverse overflow-hidden h-[300px] text-[10px]">
          {events.map((ev, i) => (
            <div
              key={ev.id}
              className="flex gap-3 py-0.5 transition-all duration-300 ease-in-out h-6 items-center shrink-0"
              style={{ opacity: 1 - i * 0.1, transform: `translateY(${i === 0 ? '0' : '4px'})` }}
            >
              <span className="text-zinc-600 whitespace-nowrap">[{ev.time}]</span>
              <span className={
                ev.type == 'JOYSTICK' ? 'text-[#3b82f6]' : 
                ev.type == 'BUTTON' ? 'text-[#f59e0b]' : 
                'text-[#10b981]'
              }>
                {ev.payload}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}