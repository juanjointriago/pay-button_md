import { Text, View, StyleSheet } from "@react-pdf/renderer";

import { FC } from "react";

interface Props {
  fieldName?: string;
  value?: string;
}
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  container: {
    flexDirection: "row",
  },
});

export const FieldPDF: FC<Props> = ({ fieldName, value }) => {
  return (
    <div style={styles.container}>
      <View style={styles.section}>
        <Text>{fieldName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ width: "100px", fontSize: 10 }}>{value}</Text>
      </View>
    </div>
  );
};
