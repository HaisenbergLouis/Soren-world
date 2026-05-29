export default function HeisenbergLogo() {
  return (
    <svg
      width="1000"
      height="600"
      viewBox="0 0 420 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 黑蓝渐变 — 与站点强调色统一 */}
        <linearGradient id="heisenbergGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#111111" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        {/* 蓝光发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="210"
        y="70"
        fontFamily="Impact, sans-serif"
        fontSize="76"
        fontWeight="normal"
        textAnchor="middle"
        fill="url(#heisenbergGrad)"
      >
        <tspan opacity={0}>
          S
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.2s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.2s"
          />
        </tspan>
        <tspan opacity={0}>
          o
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.3s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.3s"
          />
        </tspan>
        <tspan opacity={0}>
          r
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.4s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.4s"
          />
        </tspan>
        <tspan opacity={0}>
          e
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.5s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.5s"
          />
        </tspan>
        <tspan opacity={0}>
          n
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.6s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.6s"
          />
        </tspan>
        <tspan opacity={0}>&nbsp;</tspan>
        <tspan opacity={0}>
          L
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.7s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.7s"
          />
        </tspan>
        <tspan opacity={0}>
          u
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="0.8s"
            dur="1s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="3s"
            repeatCount="indefinite"
            begin="1.8s"
          />
        </tspan>
      </text>
    </svg>
  );
}
