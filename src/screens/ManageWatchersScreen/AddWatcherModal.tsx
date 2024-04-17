import { FC } from "react";
import useAddWatcherModal from "./useAddWatcherModal";
import {
  Button,
  ButtonText,
  ChevronDownIcon,
  CloseIcon,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@gluestack-ui/themed";
import { ISelectProps } from "native-base";
import { InterfaceFormControlProps } from "native-base/lib/typescript/components/composites/FormControl/types";

const MySelect: FC<
  {
    label: string;
    placeholder?: string;
    items: { label: string; value: string }[];
  } & Pick<ISelectProps, "selectedValue" | "onValueChange"> &
    Pick<InterfaceFormControlProps, "isDisabled" | "isRequired">
> = ({
  isDisabled = false,
  isRequired = false,
  items,
  label,
  onValueChange,
  placeholder,
  selectedValue,
}) => {
  return (
    <FormControl isDisabled={isDisabled} isRequired={isRequired}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Select selectedValue={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger variant="outline" size="sm">
          <SelectInput placeholder={placeholder} />
          <SelectIcon marginRight="$3">
            <Icon as={ChevronDownIcon} mr="$3" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {items.map(({ label, value }) => (
              <SelectItem key={value} label={label} value={value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </FormControl>
  );
};

const AddWatcherModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddWatcher: (type: string, term: string) => void;
}> = ({ isOpen, onClose, onAddWatcher }) => {
  const {
    selectedType,
    selectedTerm,
    onValueChangeType,
    onValueChangeTerm,
    tdTypeList,
    tdTermList,
    onSubmit,
  } = useAddWatcherModal(isOpen, onAddWatcher);

  return (
    <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Add watcher</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="lg" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <MySelect
            isRequired
            items={tdTypeList}
            label="Security type"
            onValueChange={onValueChangeType}
            placeholder="Choose security type"
            selectedValue={selectedType}
          />
          <MySelect
            isDisabled={!selectedType}
            isRequired
            items={tdTermList}
            label="Security term"
            onValueChange={onValueChangeTerm}
            placeholder="Choose security term"
            selectedValue={selectedTerm}
          />
        </ModalBody>
        <ModalFooter>
          <Button action="secondary" onPress={onClose} variant="outline">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="positive" ml="$3" onPress={onSubmit}>
            <ButtonText>Submit</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWatcherModal;
