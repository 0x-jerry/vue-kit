import { defineComponent } from "vue";
import { defineForm } from "./defineForm";
import { mount } from "@vue/test-utils";
import { registerComponent } from "./configs";

registerComponent(
  "Input",
  defineComponent(() => {
    return () => <input></input>;
  })
);

describe("VForm", () => {
  it("basic usage", () => {
    const form = defineForm({});

    expect(form.Component).toBeTruthy();

    const Comp = defineComponent(() => {
      const form = defineForm({
        layout: {
          type: "flex-col",
        },
        fields: [
          {
            label: "F 1",
            field: "key1",
            compoennt: "Input",
            componentProps: {
              max: 10,
            },
          },
        ],
      });

      return () => <form.Component />;
    });

    const app = mount(Comp);

    expect(app.get("form")).toBeTruthy();
  });
});
