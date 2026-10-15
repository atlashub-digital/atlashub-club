import { expect, test } from "@playwright/test";
import { deriveSignupOutcome } from "@/lib/adesao/status";

// Modelo de estados da adesão: lógica pura, basta um projeto.
test.beforeEach(({ isMobile }) => test.skip(isMobile, "lógica pura: basta um projeto"));

test("revisões de responsável e de estudante são independentes", () => {
  expect(deriveSignupOutcome({ plan: "club", student: false, age: "adult" })).toMatchObject({
    status: "club_free",
    reviews: { guardian: false, student: false },
    onHold: [],
  });
  expect(deriveSignupOutcome({ plan: "genesis", student: false, age: "adult" }).status).toBe("genesis_interest");
  expect(deriveSignupOutcome({ plan: "genesis", student: true, age: "adult" })).toMatchObject({
    status: "student_pending",
    reviews: { guardian: false, student: true },
  });
  const teenStudent = deriveSignupOutcome({ plan: "genesis", student: true, age: "teen" });
  expect(teenStudent).toMatchObject({ status: "pending_guardian_review", reviews: { guardian: true, student: true } });
  expect(teenStudent.onHold.join(" ")).toMatch(/qualquer cobrança/);
});

test("menor no Club grátis também fica em revisão do responsável, sem cobrança envolvida", () => {
  const child = deriveSignupOutcome({ plan: "club", student: false, age: "child" });
  expect(child.status).toBe("pending_guardian_review");
  expect(child.onHold.join(" ")).not.toMatch(/cobrança/);
});

test("pedido de estudante no Club é ignorado (só existe no Genesis)", () => {
  expect(deriveSignupOutcome({ plan: "club", student: true, age: "adult" }).reviews.student).toBe(false);
});
