export function flyToCart(sourceEl: HTMLElement | null) {
  if (!sourceEl) return;

  const cartBtn = document.querySelector('[data-cart-icon]');
  if (!cartBtn) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    position: fixed;
    top: ${sourceRect.top}px;
    left: ${sourceRect.left}px;
    width: ${sourceRect.width}px;
    height: ${sourceRect.height}px;
    border-radius: 16px;
    object-fit: cover;
    z-index: 9999;
    pointer-events: none;
    transition: all 0.8s cubic-bezier(0.5, -0.2, 0.7, 1);
  `;
  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.top = `${targetRect.top + targetRect.height / 2 - 10}px`;
    clone.style.left = `${targetRect.left + targetRect.width / 2 - 10}px`;
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.3';
    clone.style.borderRadius = '50%';
  });

  setTimeout(() => clone.remove(), 850);
}