import { skipToContent } from "../utils/accessibility";
import "../styles/skip-to-content.css";

function SkipToContent() {
  return (
    <a href="#main-content" className="skip-to-content" onClick={skipToContent}>
      Ana İçeriğe Geç
    </a>
  );
}

export default SkipToContent;
