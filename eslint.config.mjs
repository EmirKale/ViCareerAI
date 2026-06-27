import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // ⚠️ GEÇİCİ: Bu dosyalar mevcut lint borcu nedeniyle muaf. Yeni 
    // dosya EKLEME bu listeye. Temizlendiğinde dosyayı listeden çıkar.
    files: [
      "app/[locale]/(dashboard)/cover-letter/new/page.tsx",
      "app/[locale]/(dashboard)/cv/[id]/edit/page.tsx",
      "app/[locale]/(dashboard)/cv/new/page.tsx",
      "app/[locale]/(dashboard)/interview/page.tsx",
      "app/[locale]/(dashboard)/jobs/discover/page.tsx",
      "app/[locale]/(dashboard)/jobs/tracker/page.tsx",
      "app/[locale]/(dashboard)/profile/page.tsx",
      "app/[locale]/(dashboard)/roadmap/RoadmapClient.tsx",
      "app/[locale]/(dashboard)/skills/SkillsClient.tsx",
      "app/[locale]/page.tsx",
      "components/dashboard/CVHistoryClient.tsx",
      "components/dashboard/DashboardClient.tsx",
      "components/dashboard/LetterHistoryClient.tsx",
      "components/layout/LanguageSwitcher.tsx",
      "components/layout/Sidebar.tsx",
      "components/ui/electric-card.tsx",
      "i18n/request.ts"
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off"
    }
  },
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"]
  }
];

export default eslintConfig;
