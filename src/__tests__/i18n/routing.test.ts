import { describe, it, expect } from "vitest";
import { locales, rtlLocales, routing } from "@/i18n/routing";

describe("i18n Routing", () => {
  it("should have English as default locale", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("should include all major languages", () => {
    const requiredLocales = ["en", "es", "fr", "de", "zh", "ja", "ko", "ar"];
    for (const locale of requiredLocales) {
      expect(locales).toContain(locale);
    }
  });

  it("should define RTL locales", () => {
    expect(rtlLocales).toContain("ar");
    expect(rtlLocales).toContain("he");
    expect(rtlLocales).toContain("fa");
    expect(rtlLocales).toContain("ur");
  });

  it("should not include LTR languages in RTL list", () => {
    expect(rtlLocales).not.toContain("en");
    expect(rtlLocales).not.toContain("es");
    expect(rtlLocales).not.toContain("fr");
  });

  it("should have more than 20 locales", () => {
    expect(locales.length).toBeGreaterThan(20);
  });
});
