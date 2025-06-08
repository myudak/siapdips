// src/draggable.ts

export interface DraggableOptions {
  element: HTMLElement;
  handle: HTMLElement;
}

export class Draggable {
  private isDragging = false;
  private currentX = 0;
  private currentY = 0;
  private initialX = 0;
  private initialY = 0;
  private xOffset = 0;
  private yOffset = 0;
  private element: HTMLElement;
  private handle: HTMLElement;

  constructor({ element, handle }: DraggableOptions) {
    this.element = element;
    this.handle = handle;

    // Mouse events
    this.handle.addEventListener("mousedown", this.dragStart);
    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.dragEnd);

    // Touch events for mobile
    this.handle.addEventListener("touchstart", this.touchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", this.touchMove, { passive: false });
    document.addEventListener("touchend", this.touchEnd);
  }

  private dragStart = (e: MouseEvent) => {
    if (this.handle.contains(e.target as Node)) {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
      this.isDragging = true;
      this.element.classList.add("dragging");
    }
  };

  private drag = (e: MouseEvent) => {
    if (this.isDragging) {
      e.preventDefault();

      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;

      this.constrainAndSetPosition();
    }
  };

  private dragEnd = () => {
    if (this.isDragging) {
      this.initialX = this.currentX;
      this.initialY = this.currentY;
      this.isDragging = false;
      this.element.classList.remove("dragging");
    }
  };

  // Touch event handlers for mobile support
  private touchStart = (e: TouchEvent) => {
    if (this.handle.contains(e.target as Node)) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      this.initialX = touch.clientX - this.xOffset;
      this.initialY = touch.clientY - this.yOffset;
      this.isDragging = true;
      this.element.classList.add("dragging");
    }
  };

  private touchMove = (e: TouchEvent) => {
    if (this.isDragging) {
      e.preventDefault(); // Prevent scrolling

      const touch = e.touches[0];
      this.currentX = touch.clientX - this.initialX;
      this.currentY = touch.clientY - this.initialY;

      this.constrainAndSetPosition();
    }
  };

  private touchEnd = () => {
    if (this.isDragging) {
      this.initialX = this.currentX;
      this.initialY = this.currentY;
      this.isDragging = false;
      this.element.classList.remove("dragging");
    }
  };

  // Shared constraint logic for both mouse and touch
  private constrainAndSetPosition() {
    // Constrain movement within the viewport.
    const helperRect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (this.currentX < -(viewportWidth - helperRect.width)) {
      this.currentX = -(viewportWidth - helperRect.width);
    }
    if (this.currentX > 0) {
      this.currentX = 0;
    }
    if (this.currentY < 0) {
      this.currentY = 0;
    }
    if (this.currentY > viewportHeight - helperRect.height) {
      this.currentY = viewportHeight - helperRect.height;
    }

    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    this.setTranslate(this.currentX, this.currentY);
  }

  private setTranslate(xPos: number, yPos: number) {
    this.element.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }
}
