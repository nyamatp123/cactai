/*
 * PLACEHOLDER brand mark — swap the <svg> below for the real Cactai logo.
 * If the real logo is a file, drop it in src/assets/ and replace the body with:
 *   import logo from "../../assets/logo.svg";
 *   return <img src={logo} alt="" width={size} height={size} />;
 * Everything else in the sidebar sizes off this one component.
 */
export default function CactaiLogo({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M12 21V6.5a2.5 2.5 0 0 1 5 0V10a2 2 0 0 1-2 2h-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15H9a2.5 2.5 0 0 1-2.5-2.5V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
