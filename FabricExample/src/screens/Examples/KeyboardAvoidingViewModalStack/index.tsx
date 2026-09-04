import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type RootParamList = {
  FullScreen: undefined;
  Modal: undefined;
};

type ModalParamList = {
  ModalRoot: undefined;
  Pushed: undefined;
};

const headerlessOptions: NativeStackNavigationOptions = { headerShown: false };
const modalOptions: NativeStackNavigationOptions = { presentation: "modal" };

type FormProps = {
  hint: string;
  keyboardVerticalOffset?: number;
  testID: string;
  title: string;
  children?: React.ReactNode;
};

const Form = ({
  children,
  hint,
  keyboardVerticalOffset,
  testID,
  title,
}: FormProps) => (
  <KeyboardAvoidingView
    automaticOffset
    behavior="padding"
    keyboardVerticalOffset={keyboardVerticalOffset}
    style={styles.screen}
  >
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.hint}>{hint}</Text>
    <TextInput
      placeholder="Focus me"
      placeholderTextColor="#7C7C7C"
      style={styles.input}
      testID={`${testID}_input`}
    />
    {children}
    <View style={styles.spacer} />
    <View style={styles.footer} testID={`${testID}_footer`}>
      <Text style={styles.footerText}>FOOTER — must touch the keyboard</Text>
    </View>
  </KeyboardAvoidingView>
);

const FullScreen = ({
  navigation,
}: NativeStackScreenProps<RootParamList, "FullScreen">) => {
  const openModal = useCallback(() => navigation.navigate("Modal"), []);
  const exit = useCallback(() => navigation.getParent()?.goBack(), []);

  return (
    <Form
      hint="✅ footer stops right above the keyboard"
      testID="kav_full_screen"
      title="Full screen"
    >
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Open pageSheet modal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={exit}>
        <Text style={styles.linkText}>← Back to examples</Text>
      </TouchableOpacity>
    </Form>
  );
};

const ModalRoot = ({
  navigation,
}: NativeStackScreenProps<ModalParamList, "ModalRoot">) => {
  const push = useCallback(() => navigation.navigate("Pushed"), []);

  return (
    <Form
      hint="✅ footer stops right above the keyboard"
      testID="kav_modal_root"
      title="Modal root"
    >
      <TouchableOpacity style={styles.button} onPress={push}>
        <Text style={styles.buttonText}>Push a screen inside the modal</Text>
      </TouchableOpacity>
    </Form>
  );
};

const Pushed = ({
  navigation,
}: NativeStackScreenProps<ModalParamList, "Pushed">) => {
  const insets = useSafeAreaInsets();
  const [compensated, setCompensated] = useState(false);
  const toggle = useCallback(() => setCompensated((value) => !value), []);
  const goBack = useCallback(() => navigation.goBack(), []);

  return (
    <Form
      hint="❌ footer lifts short — the gap equals the top inset"
      keyboardVerticalOffset={compensated ? insets.top : 0}
      testID="kav_pushed_in_modal"
      title="Pushed inside the modal"
    >
      <TouchableOpacity style={styles.button} onPress={toggle}>
        <Text style={styles.buttonText}>
          {compensated
            ? `keyboardVerticalOffset: insets.top (${Math.round(insets.top)})`
            : "keyboardVerticalOffset: 0"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={goBack}>
        <Text style={styles.linkText}>← Back to the modal root</Text>
      </TouchableOpacity>
    </Form>
  );
};

const ModalStack = createNativeStackNavigator<ModalParamList>();

const ModalStackScreen = () => (
  <ModalStack.Navigator screenOptions={headerlessOptions}>
    <ModalStack.Screen component={ModalRoot} name="ModalRoot" />
    <ModalStack.Screen component={Pushed} name="Pushed" />
  </ModalStack.Navigator>
);

const Stack = createNativeStackNavigator<RootParamList>();

export default function KeyboardAvoidingViewModalStack() {
  return (
    <Stack.Navigator screenOptions={headerlessOptions}>
      <Stack.Screen component={FullScreen} name="FullScreen" />
      <Stack.Screen
        component={ModalStackScreen}
        name="Modal"
        options={modalOptions}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  hint: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
    color: "#7C7C7C",
  },
  input: {
    height: 44,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 12,
  },
  button: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgb(40, 64, 147)",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    flex: 1,
  },
  footer: {
    height: 64,
    marginHorizontal: -24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B28AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 15,
    color: "rgb(40, 64, 147)",
  },
});
