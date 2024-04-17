import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface PressableProps {
  hovered?: boolean | undefined;
  pressed?: boolean | undefined;
  focused?: boolean | undefined;
  focusVisible?: boolean | undefined;
  disabled?: boolean | undefined;
}

export type NavigationStackScreenProps = NativeStackScreenProps<ParamListBase>;
