import { describe, it, expect } from "vitest";

describe("UI Components Exports", () => {
  it("should export Button component", async () => {
    const mod = await import("@/components/ui/button");
    expect(mod.Button).toBeDefined();
    expect(mod.buttonVariants).toBeDefined();
  });

  it("should export Card components", async () => {
    const mod = await import("@/components/ui/card");
    expect(mod.Card).toBeDefined();
    expect(mod.CardHeader).toBeDefined();
    expect(mod.CardTitle).toBeDefined();
    expect(mod.CardDescription).toBeDefined();
    expect(mod.CardContent).toBeDefined();
    expect(mod.CardFooter).toBeDefined();
  });

  it("should export Input component", async () => {
    const mod = await import("@/components/ui/input");
    expect(mod.Input).toBeDefined();
  });

  it("should export Badge component", async () => {
    const mod = await import("@/components/ui/badge");
    expect(mod.Badge).toBeDefined();
    expect(mod.badgeVariants).toBeDefined();
  });

  it("should export Tabs components", async () => {
    const mod = await import("@/components/ui/tabs");
    expect(mod.Tabs).toBeDefined();
    expect(mod.TabsList).toBeDefined();
    expect(mod.TabsTrigger).toBeDefined();
    expect(mod.TabsContent).toBeDefined();
  });

  it("should export Progress component", async () => {
    const mod = await import("@/components/ui/progress");
    expect(mod.Progress).toBeDefined();
  });

  it("should export Separator component", async () => {
    const mod = await import("@/components/ui/separator");
    expect(mod.Separator).toBeDefined();
  });

  it("should export Tooltip components", async () => {
    const mod = await import("@/components/ui/tooltip");
    expect(mod.Tooltip).toBeDefined();
    expect(mod.TooltipTrigger).toBeDefined();
    expect(mod.TooltipContent).toBeDefined();
    expect(mod.TooltipProvider).toBeDefined();
  });
});

describe("Button Variants", () => {
  it("should generate correct variant classes", async () => {
    const { buttonVariants } = await import("@/components/ui/button");

    const defaultBtn = buttonVariants({ variant: "default" });
    expect(defaultBtn).toContain("bg-gradient-to-r");
    expect(defaultBtn).toContain("text-white");

    const secondaryBtn = buttonVariants({ variant: "secondary" });
    expect(secondaryBtn).toContain("border");
    expect(secondaryBtn).toContain("bg-white/5");

    const ghostBtn = buttonVariants({ variant: "ghost" });
    expect(ghostBtn).toContain("hover:bg-white/5");
  });

  it("should generate correct size classes", async () => {
    const { buttonVariants } = await import("@/components/ui/button");

    const sm = buttonVariants({ size: "sm" });
    expect(sm).toContain("h-8");

    const lg = buttonVariants({ size: "lg" });
    expect(lg).toContain("h-12");

    const icon = buttonVariants({ size: "icon" });
    expect(icon).toContain("h-9");
    expect(icon).toContain("w-9");
  });
});

describe("Badge Variants", () => {
  it("should have correct variant styles", async () => {
    const { badgeVariants } = await import("@/components/ui/badge");

    const success = badgeVariants({ variant: "success" });
    expect(success).toContain("text-success");

    const destructive = badgeVariants({ variant: "destructive" });
    expect(destructive).toContain("text-error");
  });
});
