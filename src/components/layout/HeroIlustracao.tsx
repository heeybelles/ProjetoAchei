/** Ilustração original: mesa de estudo na biblioteca com os objetos mais perdidos no campus. */
export default function HeroIlustracao() {
  return (
    <svg viewBox="0 0 520 440" role="img" aria-label="Ilustração de uma mesa de biblioteca com mochila, livros, garrafa, fone de ouvido, chave e uma lupa" className="h-auto w-full">
      <rect x="0" y="0" width="520" height="440" rx="32" fill="#E8EEF8" />
      {/* estante ao fundo */}
      <rect x="28" y="36" width="464" height="190" rx="14" fill="#DCE5F3" />
      {[0, 1].map((r) => (
        <g key={r} transform={`translate(0 ${r * 92})`}>
          <rect x="40" y="46" width="440" height="6" rx="3" fill="#B7C6DE" transform="translate(0 78)" />
          {[
            ['#142B4A', 34, 52], ['#2563EB', 26, 40], ['#14B8A6', 30, 56], ['#F5B942', 24, 46], ['#64748B', 32, 50],
            ['#142B4A', 26, 58], ['#2563EB', 34, 44], ['#14B8A6', 24, 54], ['#F5B942', 30, 42], ['#142B4A', 28, 56],
            ['#64748B', 26, 48], ['#2563EB', 32, 54],
          ].map(([c, w, h], i) => {
            const x = 52 + [0, 38, 68, 102, 130, 166, 196, 234, 262, 298, 330, 360][i];
            return <rect key={i} x={x} y={124 - (h as number) + 0} width={w as number} height={h as number} rx="3" fill={c as string} transform={`translate(${r === 1 ? 40 : 0} ${r === 1 ? -30 : -34})`} opacity={r === 1 ? 0.85 : 1} />;
          })}
        </g>
      ))}
      {/* mesa */}
      <rect x="0" y="318" width="520" height="122" fill="#C8A878" />
      <rect x="0" y="318" width="520" height="14" fill="#B4925F" />
      {/* mochila */}
      <g>
        <rect x="52" y="214" width="124" height="150" rx="40" fill="#142B4A" />
        <rect x="70" y="288" width="88" height="62" rx="16" fill="#2563EB" />
        <rect x="86" y="300" width="56" height="8" rx="4" fill="#F3F5F8" opacity=".85" />
        <path d="M92 214 q22 -34 44 0" fill="none" stroke="#142B4A" strokeWidth="9" strokeLinecap="round" />
        <rect x="104" y="236" width="20" height="30" rx="8" fill="#0E1F36" />
      </g>
      {/* livros */}
      <g>
        <rect x="204" y="324" width="150" height="26" rx="5" fill="#F5B942" />
        <rect x="214" y="298" width="132" height="26" rx="5" fill="#14B8A6" />
        <rect x="224" y="272" width="112" height="26" rx="5" fill="#FFFFFF" stroke="#142B4A" strokeWidth="3" />
        <rect x="236" y="282" width="52" height="6" rx="3" fill="#2563EB" />
      </g>
      {/* garrafa */}
      <g>
        <rect x="384" y="238" width="22" height="16" rx="4" fill="#142B4A" />
        <rect x="372" y="252" width="46" height="102" rx="16" fill="#14B8A6" />
        <rect x="372" y="290" width="46" height="18" fill="#0F766E" opacity=".45" />
        <rect x="380" y="262" width="8" height="60" rx="4" fill="#fff" opacity=".35" />
      </g>
      {/* fone de ouvido */}
      <g fill="none" stroke="#142B4A" strokeWidth="8" strokeLinecap="round">
        <path d="M430 368 v-26 a34 34 0 0 1 68 0 v26" />
      </g>
      <rect x="422" y="352" width="18" height="34" rx="9" fill="#2563EB" />
      <rect x="488" y="352" width="18" height="34" rx="9" fill="#2563EB" />
      {/* chave */}
      <g transform="translate(300 388) rotate(-12)">
        <circle cx="0" cy="0" r="16" fill="none" stroke="#F5B942" strokeWidth="7" />
        <rect x="14" y="-4" width="64" height="8" rx="4" fill="#F5B942" />
        <rect x="56" y="2" width="8" height="16" rx="3" fill="#F5B942" />
        <rect x="68" y="2" width="8" height="12" rx="3" fill="#F5B942" />
      </g>
      {/* lupa */}
      <g transform="translate(396 100)">
        <circle cx="0" cy="0" r="46" fill="#FFFFFF" fillOpacity=".55" stroke="#2563EB" strokeWidth="10" />
        <path d="M-24 -10 a28 28 0 0 1 22 -20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M33 33 L72 72" stroke="#142B4A" strokeWidth="14" strokeLinecap="round" />
      </g>
    </svg>
  );
}
