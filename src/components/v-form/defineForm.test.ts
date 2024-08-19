import { defineForm } from "./defineForm";

describe("VForm", () => {
  it("basic usage", () => {
    const form = defineForm({})

    expect(form.Component).toBeTruthy()
  });
});
