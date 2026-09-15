import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { createReadinessSubmission } from "./db";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  createReadinessSubmission: vi.fn().mockResolvedValue({ id: 42 }),
}));

const mockedCreateReadinessSubmission = vi.mocked(createReadinessSubmission);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("readiness.submit", () => {
  beforeEach(() => {
    mockedCreateReadinessSubmission.mockClear();
  });

  it("serializes a completed check-in for persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.readiness.submit({
      language: "en",
      answers: { payments: "sometimes", presence: "rarely" },
      categoryScores: [{ category: "payments", score: 2, max: 3, percent: 67 }],
      totalScore: 2,
      maxScore: 3,
      percent: 67,
    });

    expect(result).toEqual({ id: 42 });
    expect(mockedCreateReadinessSubmission).toHaveBeenCalledWith({
      language: "en",
      answersJson: JSON.stringify({ payments: "sometimes", presence: "rarely" }),
      categoryScoresJson: JSON.stringify([{ category: "payments", score: 2, max: 3, percent: 67 }]),
      totalScore: 2,
      maxScore: 3,
      percent: 67,
    });
  });

  it("rejects unsupported languages before touching the database", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.readiness.submit({
      language: "fr" as "en",
      answers: {},
      categoryScores: [],
      totalScore: 0,
      maxScore: 0,
      percent: 0,
    })).rejects.toThrow();

    expect(mockedCreateReadinessSubmission).not.toHaveBeenCalled();
  });
});
