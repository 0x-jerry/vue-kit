import { useInstanceRef } from "src/hooks";
import { defineComponent, h, type Component } from "vue";
import VForm from "./VForm.vue";
import type { IFromActions } from "./hooks/useForm";
import type { VFormFieldProps, VFormProps } from "./types";

export interface IFormContext extends Partial<IFromActions> {
  Component: Component;
}

/**
 * todo, support reactive data
 */
export interface IDefineFormConfig extends Omit<VFormProps, "fields"> {
  fields?: IFormFieldConfig[];
}

interface IFormFieldConfig extends VFormFieldProps {
  slot?: string;
  compoennt?: string;
  componentProps?: unknown;
}

/**
 *
 * @param option todo, make this reactive
 * @returns
 */
export function defineForm(option: Partial<IDefineFormConfig>): IFormContext {
  const Component = createForm();
  const instance = useInstanceRef(VForm);

  const result = new Proxy(
    {},
    {
      get(_target, p, _receiver) {
        if (p === "Component") {
          return Component;
        }

        const formCtx = instance.value?.formContext as any;

        return formCtx?.[p];
      },
    }
  );

  return result as IFormContext;

  function createForm() {
    return defineComponent({
      name: "FormWrapper",
      setup(_, ctx) {
        return () => {
          const formProps: any = {
            ...ctx.attrs,
            ref: instance,
          };

          return <VForm {...formProps}>{ctx.slots}</VForm>;
        };
      },
    });
  }
}
