'use client';

import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';

interface CursorContextType {
  pos: { x: number; y: number };
  isActive: boolean;
  isVisible: boolean;
  setIsActive: (val: boolean) => void;
  setPos: (val: { x: number; y: number }) => void;
  sensitivity: number;
  registerSpot: (id: string, ref: React.RefObject<HTMLElement>) => void;
  unregisterSpot: (id: string) => void;
  triggerA: () => void;
  triggerB: () => void;
  hoveredState: { id: string } | null;
  carried: any;
}

export const CursorContext = createContext<CursorContextType>({
  pos: { x: 0, y: 0 },
  isActive: false,
  isVisible: false,
  setIsActive: () => {},
  setPos: () => {},
  sensitivity: 0.3,
  registerSpot: () => {},
  unregisterSpot: () => {},
  triggerA: () => {},
  triggerB: () => {},
  hoveredState: null,
  carried: null
});

export function VirtualControllerProvider({ children, sensitivity = 0.3 }: { children: React.ReactNode; sensitivity?: number }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredState, setHoveredState] = useState<{ id: string } | null>(null);
  const [carried, setCarried] = useState<any>(null);

  const posRef = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  
  const spotsRef = useRef(new Map<string, React.RefObject<HTMLElement>>());
  const hoveredRef = useRef<any>(null);
  const carriedRef = useRef<any>(null);
  const physicsItems = useRef<any[]>([]);
  const lastMoved = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(false);
  
  const trailRef = useRef<SVGPolylineElement>(null);
  const trailHistory = useRef<{x: number, y: number}[]>([]);

  const addPhysicsItem = (el: HTMLElement, x: number, y: number, startVx: number, startVy: number, width: number, height: number, originalEl: HTMLElement | null = null, vRot = 0, origX?: number, origY?: number) => {
    let isMouseDragging = false;
    el.style.cursor = 'grab';
    el.style.touchAction = 'none';
    
    const startX = origX !== undefined ? origX : x;
    const startY = origY !== undefined ? origY : y;
    
    el.addEventListener('pointerdown', (e) => {
      isMouseDragging = true;
      el.style.cursor = 'grabbing';
      el.style.zIndex = '99990';
      el.setPointerCapture(e.pointerId);
    });
    
    el.addEventListener('pointermove', (e) => {
      if (!isMouseDragging) return;
      const p = physicsItems.current.find(pi => pi.el === el);
      if (p) {
        p.x += e.movementX;
        p.y += e.movementY;
        p.vx = e.movementX;
        p.vy = e.movementY;
      }
    });
    
    el.addEventListener('pointerup', (e) => {
      isMouseDragging = false;
      el.style.cursor = 'grab';
      el.style.zIndex = '99980';
      el.releasePointerCapture(e.pointerId);
    });

    physicsItems.current.push({ 
      el, x, y, vx: startVx, vy: startVy, w: width, h: height, 
      startX, startY, createdAt: Date.now(), isMouseDragging: () => isMouseDragging, originalEl, returned: false,
      rot: 0, vRot
    });
  };

  useEffect(() => {
    targetPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    posRef.current = { ...targetPos.current };
    setPos(targetPos.current);

    let frame: number;
    const loop = () => {
      const dx = targetPos.current.x - posRef.current.x;
      const dy = targetPos.current.y - posRef.current.y;
      posRef.current.x += dx * 0.18;
      posRef.current.y += dy * 0.18;
      velRef.current.vx = dx * 0.18;
      velRef.current.vy = dy * 0.18;

      setPos({ x: posRef.current.x, y: posRef.current.y });

      const speed = Math.abs(dx) + Math.abs(dy);
      if (speed > 0.5) {
        lastMoved.current = Date.now();
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      } else {
        if (isVisibleRef.current && Date.now() - lastMoved.current > 2000) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
      }

      if (isActive && isVisibleRef.current) {
        trailHistory.current.push({ x: posRef.current.x, y: posRef.current.y });
        if (trailHistory.current.length > 40) trailHistory.current.shift();
        if (trailRef.current) {
          trailRef.current.setAttribute('points', trailHistory.current.map(p => `${p.x},${p.y}`).join(' '));
        }
      } else {
        if (trailHistory.current.length > 0) {
          trailHistory.current.shift();
          if (trailRef.current) trailRef.current.setAttribute('points', trailHistory.current.map(p => `${p.x},${p.y}`).join(' '));
        }
      }

      if (isActive && !carriedRef.current) {
        let foundHover: any = null;
        spotsRef.current.forEach((ref, id) => {
          if (!ref.current || foundHover || ref.current.dataset.exploded) return;
          const rect = ref.current.getBoundingClientRect();
          const p = 36;
          if (
            posRef.current.x >= rect.left - p &&
            posRef.current.x <= rect.right + p &&
            posRef.current.y >= rect.top - p &&
            posRef.current.y <= rect.bottom + p
          ) {
            foundHover = { id, el: ref.current };
          }
        });
        if (foundHover?.id !== hoveredRef.current?.id) {
          hoveredRef.current = foundHover;
          setHoveredState(foundHover);
        }
      } else if (hoveredRef.current) {
        hoveredRef.current = null;
        setHoveredState(null);
      }

      for (let i = 0; i < physicsItems.current.length; i++) {
        for (let j = i + 1; j < physicsItems.current.length; j++) {
          const p1 = physicsItems.current[i];
          const p2 = physicsItems.current[j];
          if (p1.isMouseDragging() || p2.isMouseDragging() || Date.now() - p1.createdAt > 3000 || Date.now() - p2.createdAt > 3000) continue;

          const cx = (p1.x + p1.w / 2) - (p2.x + p2.w / 2);
          const cy = (p1.y + p1.h / 2) - (p2.y + p2.h / 2);
          const aw = (p1.w + p2.w) / 2;
          const ah = (p1.h + p2.h) / 2;

          if (Math.abs(cx) < aw && Math.abs(cy) < ah) {
            const ox = aw - Math.abs(cx);
            const oy = ah - Math.abs(cy);
            if (ox < oy) {
              if (cx > 0) { p1.x += ox / 2; p2.x -= ox / 2; p1.vx += 0.2; p2.vx -= 0.2; }
              else { p1.x -= ox / 2; p2.x += ox / 2; p1.vx -= 0.2; p2.vx += 0.2; }
            } else {
              if (cy > 0) { p1.y += oy / 2; p2.y -= oy / 2; p1.vy += 0.2; p2.vy -= 0.2; }
              else { p1.y -= oy / 2; p2.y += oy / 2; p1.vy -= 0.2; p2.vy += 0.2; }
            }
            p1.vRot += (Math.random() - 0.5) * 15;
            p2.vRot += (Math.random() - 0.5) * 15;
          }
        }
      }

      const groups = new Map();

      physicsItems.current.forEach((p) => {
        const timeAlive = Date.now() - p.createdAt;
        const returning = p.originalEl && timeAlive > 3000;

        if (returning) {
          if (p.el.style.pointerEvents !== 'none') {
            p.el.style.pointerEvents = 'none';
          }
          p.x += (p.startX - p.x) * 0.12;
          p.y += (p.startY - p.y) * 0.12;
          p.rot += (0 - p.rot) * 0.12;
          p.vx = 0;
          p.vy = 0;
          p.vRot = 0;
          p.el.style.boxShadow = 'none';
          p.el.style.border = 'none';

          if (Math.abs(p.startX - p.x) < 1 && Math.abs(p.startY - p.y) < 1 && Math.abs(p.rot) < 1) {
            p.x = p.startX;
            p.y = p.startY;
            p.rot = 0;
            p.returned = true;
          } else {
            p.returned = false;
          }
        } else if (!p.isMouseDragging()) {
          p.vy += 0.6;
          p.y += p.vy;
          p.x += p.vx;
          p.rot += p.vRot;
          
          if (p.y + p.h > window.innerHeight - 2) {
            p.y = window.innerHeight - p.h - 2;
            p.vy *= -0.3;
            p.vx *= 0.7;
            p.vRot *= 0.7;
          }
          if (p.x < 2) {
            p.x = 2;
            p.vx *= -0.5;
            p.vRot *= 0.8;
          }
          if (p.x + p.w > window.innerWidth - 2) {
            p.x = window.innerWidth - p.w - 2;
            p.vx *= -0.5;
            p.vRot *= 0.8;
          }
          p.returned = false;
        } else {
          p.returned = false;
        }
        
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;

        if (p.originalEl) {
          if (!groups.has(p.originalEl)) groups.set(p.originalEl, { total: 0, returned: 0 });
          const g = groups.get(p.originalEl);
          g.total++;
          if (p.returned) g.returned++;
        }
      });

      const originalElsToRestore = new Set();
      groups.forEach((g, el) => {
        if (g.total > 0 && g.returned === g.total) {
          el.style.opacity = '';
          el.removeAttribute('data-exploded');
          originalElsToRestore.add(el);
        }
      });

      if (originalElsToRestore.size > 0) {
        physicsItems.current = physicsItems.current.filter(p => {
          if (originalElsToRestore.has(p.originalEl)) {
            p.el.remove();
            return false;
          }
          return true;
        });
      }

      frame = requestAnimationFrame(loop);
    };
    
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isActive]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      physicsItems.current.forEach(p => {
        if (!p.isMouseDragging() && (!p.originalEl || Date.now() - p.createdAt <= 3000)) {
          p.vy -= Math.max(-6, Math.min(6, dy * 0.05));
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const triggerA = () => {
    lastMoved.current = Date.now();
    if (!isVisibleRef.current) {
      isVisibleRef.current = true;
      setIsVisible(true);
    }

    if (carriedRef.current) {
      const el = document.createElement('div');
      el.innerHTML = carriedRef.current.html;
      el.className = 'fixed top-0 left-0 z-[99980] scale-[1.02] bg-fd-background/50 rounded-md ring-2 ring-brand ring-offset-2 ring-offset-fd-background shadow-xl';
      
      const contentDiv = el.firstElementChild as HTMLElement;
      if (contentDiv) {
        contentDiv.style.margin = '0';
      }

      document.body.appendChild(el);
      
      addPhysicsItem(
        el,
        posRef.current.x - carriedRef.current.w / 2,
        posRef.current.y - carriedRef.current.h / 2,
        velRef.current.vx * 1.5,
        Math.max(velRef.current.vy * 1.5, -15),
        carriedRef.current.w,
        carriedRef.current.h,
        carriedRef.current.originalEl,
        (Math.random() - 0.5) * 20,
        carriedRef.current.origX,
        carriedRef.current.origY
      );
      
      carriedRef.current = null;
      setCarried(null);
    } else if (hoveredRef.current) {
      const el = hoveredRef.current.el;
      const rect = el.getBoundingClientRect();
      const cloneData = {
        html: el.innerHTML,
        w: rect.width,
        h: rect.height,
        originalEl: el,
        origX: rect.left,
        origY: rect.top
      };
      carriedRef.current = cloneData;
      setCarried(cloneData);

      el.dataset.exploded = 'true';
      el.style.opacity = '0';
      
      hoveredRef.current = null;
      setHoveredState(null);
    } else {
      const ripple = document.createElement('div');
      ripple.className = 'fixed z-[99990] rounded-full border border-brand pointer-events-none';
      ripple.style.left = `${posRef.current.x}px`;
      ripple.style.top = `${posRef.current.y}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
      ripple.style.opacity = '0.8';
      ripple.style.transition = 'all 0.5s ease-out';
      document.body.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(2.5)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 500);
    }
  };

  const triggerB = () => {
    lastMoved.current = Date.now();
    if (!isVisibleRef.current) {
      isVisibleRef.current = true;
      setIsVisible(true);
    }

    if (hoveredRef.current) {
      const el = hoveredRef.current.el;
      const rect = el.getBoundingClientRect();
      
      el.dataset.exploded = 'true';
      el.style.opacity = '0';
      
      const cols = Math.max(1, Math.min(4, Math.ceil(rect.width / 80)));
      const rows = Math.max(1, Math.min(4, Math.ceil(rect.height / 40)));
      const w = rect.width / cols;
      const h = rect.height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const piece = document.createElement('div');
          piece.style.position = 'fixed';
          piece.style.top = '0';
          piece.style.left = '0';
          piece.style.width = `${w}px`;
          piece.style.height = `${h}px`;
          piece.style.overflow = 'hidden';
          piece.style.zIndex = '99980';
          piece.style.borderRadius = '4px';
          piece.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
          piece.style.background = getComputedStyle(el).background !== 'rgba(0, 0, 0, 0)' 
            ? getComputedStyle(el).background 
            : 'var(--fd-background)';
          
          const inner = document.createElement('div');
          inner.innerHTML = el.innerHTML;
          inner.style.width = `${rect.width}px`;
          inner.style.height = `${rect.height}px`;
          inner.style.transform = `translate(-${i * w}px, -${j * h}px)`;
          inner.style.color = getComputedStyle(el).color;
          inner.className = el.className;
          
          piece.appendChild(inner);
          document.body.appendChild(piece);

          const cx = (i + 0.5) * w - rect.width / 2;
          const cy = (j + 0.5) * h - rect.height / 2;
          const dist = Math.sqrt(cx * cx + cy * cy) || 1;
          
          const vx = (cx / dist) * (Math.random() * 15 + 8);
          const vy = (cy / dist) * (Math.random() * 15 + 8) - 5;
          const vRot = (Math.random() - 0.5) * 40;

          addPhysicsItem(piece, rect.left + i * w, rect.top + j * h, vx, vy, w, h, el, vRot);
        }
      }
      
      hoveredRef.current = null;
      setHoveredState(null);
    } else {
      const ripple = document.createElement('div');
      ripple.className = 'fixed z-[99990] rounded-full border border-brand pointer-events-none';
      ripple.style.left = `${posRef.current.x}px`;
      ripple.style.top = `${posRef.current.y}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
      ripple.style.opacity = '0.8';
      ripple.style.transition = 'all 0.5s ease-out';
      document.body.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(2.5)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 500);
    }
  };

  const updateTarget = (newPos: { x: number; y: number }) => {
    targetPos.current = newPos;
  };

  const registerSpot = (id: string, ref: React.RefObject<HTMLElement>) => spotsRef.current.set(id, ref);
  const unregisterSpot = (id: string) => spotsRef.current.delete(id);

  return (
    <CursorContext.Provider value={{ 
      pos, setPos: updateTarget, isActive, isVisible, setIsActive, sensitivity,
      registerSpot, unregisterSpot, triggerA, triggerB, hoveredState, carried
    }}>
      {children}
      <svg className="pointer-events-none fixed inset-0 z-[99998] h-full w-full transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <polyline ref={trailRef} fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" className="opacity-80" />
      </svg>
      <VirtualPointer />
      <FloatingController />
    </CursorContext.Provider>
  );
}

function VirtualPointer() {
  const { pos, carried, hoveredState, isVisible } = useContext(CursorContext);

  return (
    <div
      className="pointer-events-none fixed z-[99999] transition-opacity duration-500"
      style={{ left: pos.x, top: pos.y, opacity: isVisible ? 1 : 0 }}
    >
      <div className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_15px_var(--brand)]">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand opacity-75" />
      </div>

      {(hoveredState || carried) && (
        <div className="absolute top-5 left-5 bg-fd-background/90 text-brand border border-brand/50 text-[8px] font-mono px-1 py-0.5 rounded shadow-lg font-bold tracking-widest whitespace-nowrap animate-in fade-in">
          {carried ? 'A: DROP' : 'A: GRAB | B: EXPLODE'}
        </div>
      )}

      {carried && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 opacity-90 scale-[1.02] bg-fd-background/50 rounded-md ring-2 ring-brand ring-offset-2 ring-offset-fd-background"
          style={{ width: carried.w, height: carried.h }}
          dangerouslySetInnerHTML={{ __html: carried.html }}
        />
      )}
    </div>
  );
}

function FloatingController() {
  const { setPos, setIsActive, sensitivity, triggerA, triggerB } = useContext(CursorContext);
  const [joyPos, setJoyPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);

  const updatePos = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const maxR = Math.min(140, 45 / Math.max(0.01, sensitivity));
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    
    setJoyPos({ x: dx, y: dy });

    const reachMap = 1.3;
    const screenX = (window.innerWidth / 2) + (dx / maxR) * (window.innerWidth / 2) * reachMap;
    const screenY = (window.innerHeight / 2) + (dy / maxR) * (window.innerHeight / 2) * reachMap;

    setPos({ 
      x: Math.max(0, Math.min(window.innerWidth, screenX)), 
      y: Math.max(0, Math.min(window.innerHeight, screenY)) 
    });
  };

  const handleDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsActive(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePos(e);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePos(e);
  };

  const handleUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setJoyPos({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99990] flex items-center gap-3 sm:gap-4 rounded-full border border-fd-border bg-fd-background/80 p-2 sm:p-3 shadow-xl backdrop-blur-md">
      <div
        ref={padRef}
        className="relative h-14 w-14 sm:h-16 sm:w-16 touch-none rounded-full bg-fd-muted shadow-inner cursor-pointer"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full bg-brand shadow-md transition-transform duration-75 ease-out"
          style={{
            width: `26px`,
            height: `26px`,
            transform: `translate(calc(-50% + ${joyPos.x}px), calc(-50% + ${joyPos.y}px)) ${isDragging ? 'scale(0.9)' : 'scale(1)'}`,
          }}
        />
      </div>
      <div className="flex gap-2 sm:gap-3 pr-1 sm:pr-2 select-none touch-none">
        <button 
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); triggerA(); setIsActive(true); }}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-fd-muted border border-fd-border font-mono text-[10px] sm:text-xs font-bold text-fd-foreground hover:bg-fd-muted-foreground/20 hover:border-brand active:scale-90 active:bg-brand active:text-[color:var(--brand-fg)] transition-all"
        >
          A
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); triggerB(); setIsActive(true); }}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-fd-muted border border-fd-border font-mono text-[10px] sm:text-xs font-bold text-fd-foreground hover:bg-fd-muted-foreground/20 hover:border-brand active:scale-90 active:bg-brand active:text-[color:var(--brand-fg)] transition-all"
        >
          B
        </button>
      </div>
    </div>
  );
}

export function HoverSpot({ children, infoText, block }: { children: React.ReactNode; infoText?: string; block?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { registerSpot, unregisterSpot, hoveredState, isVisible } = useContext(CursorContext);
  const [id] = useState(() => Math.random().toString(36).substring(7));
  const isHovered = hoveredState?.id === id;

  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (ref.current) registerSpot(id, ref);
    return () => unregisterSpot(id);
  }, [id, registerSpot, unregisterSpot]);

  useEffect(() => {
    if (isHovered && ref.current && infoText) {
      const updatePosition = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setTooltipStyle({
          position: 'fixed',
          top: rect.top - 48,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
          zIndex: 999999,
        });
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isHovered, infoText]);

  return (
    <div className={`relative z-10 transition-opacity duration-200 ${block ? 'block w-full' : 'inline-block'}`}>
      <div 
        ref={ref}
        data-hover-spot="true"
        className={`transition-all duration-300 ${isHovered && isVisible && !ref.current?.dataset.exploded ? 'ring-2 ring-brand ring-offset-2 ring-offset-fd-background rounded-md scale-[1.02] bg-fd-background/50 z-20 relative' : ''}`}
      >
        {children}
      </div>
      {mounted && isHovered && isVisible && infoText && !ref.current?.dataset.exploded && createPortal(
        <div 
          style={tooltipStyle}
          className="w-max rounded bg-fd-foreground px-2.5 py-1.5 text-[10px] font-medium text-fd-background shadow-lg animate-in fade-in zoom-in-95 pointer-events-none"
        >
          {infoText}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-fd-foreground" />
        </div>,
        document.body
      )}
    </div>
  );
}