import { EventArg } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFormikContext } from "@uplift-ltd/formik";
import { useEffect, useRef } from "react";

type BeforeRemoveEvent = EventArg<
  "beforeRemove",
  true,
  {
    action: Readonly<{
      type: string;
      // This type is a copy from react-navigation
      // eslint-disable-next-line @typescript-eslint/ban-types
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>;
  }
>;

export interface SaveOnNavigateBackProps {
  formSuccessful: React.RefObject<boolean>;
}

export function SaveOnNavigateBack<
  FormValues,
  StackParamList extends Record<string, Record<string, unknown>>
>({ formSuccessful }: SaveOnNavigateBackProps) {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const { dirty, isSubmitting, submitForm } = useFormikContext<FormValues>();

  // when the user tries to go back to the previous screen, we'll
  // ensure that we've saved the user's profile. If not, we'll fire
  // the form submission fn and if successful -> navigate back
  useEffect(() => {
    const onBeforeRemove = async (evt: BeforeRemoveEvent) => {
      if (!dirty || formSuccessful.current) {
        // no changes, allow default behavior
        return;
      }

      evt.preventDefault();

      if (!isSubmitting) {
        submitForm();
      }
    };

    navigation.addListener("beforeRemove", onBeforeRemove);

    return () => navigation.removeListener("beforeRemove", onBeforeRemove);
    // omitting formSuccessful because it's a ref object and we need
    // access to it's value without this effect calling it's clean-up callback
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, isSubmitting, navigation, submitForm]);

  // nothing to render
  return null;
}

export type UseSaveOnNavigateBackResult = [
  typeof SaveOnNavigateBack,
  React.RefObject<boolean>,
  (successful: boolean) => void
];

// returns the component, the ref you need to pass to it as a prop and a fn to help update the status
export const useSaveOnNavigateBack = (): UseSaveOnNavigateBackResult => {
  const formSuccessful = useRef(false);

  const setFormSuccessful = (success: boolean) => {
    formSuccessful.current = success;
  };

  return [SaveOnNavigateBack, formSuccessful, setFormSuccessful];
};
