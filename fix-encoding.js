import fs from "fs";
import path from "path";

const TARGET_EXTENSIONS = [".js", ".jsx", ".css", ".html"];
const ROOT_DIR = process.cwd();

// Bozuk → Doğru karakter eşleşmeleri
const replacements = {
  "ç": "ç",
  "Ç": "Ç",
  "ı": "ı",
  "İ": "İ",
  "ö": "ö",
  "Ö": "Ö",
  "ü": "ü",
  Ü: "Ü",
  ş: "ş",
  Ş: "Ş",
  ğ: "ğ",
  Ğ: "Ğ",
};

function fixEncoding(content) {
  let fixed = content;
  for (const [broken, correct] of Object.entries(replacements)) {
    fixed = fixed.split(broken).join(correct);
  }
  return fixed;
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (file === "node_modules" || file === ".git") return;

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (TARGET_EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(fullPath, "utf8");
        const fixedContent = fixEncoding(content);

        if (content !== fixedContent) {
          fs.writeFileSync(fullPath, fixedContent, "utf8");
          console.log(`✔ Düzeltildi: ${fullPath}`);
        }
      }
    }
  });
}

console.log("🔧 UTF-8 encoding düzeltmesi başlatıldı...");
walk(ROOT_DIR);
console.log("✅ Encoding düzeltmesi tamamlandı!");
