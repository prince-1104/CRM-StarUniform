import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";

type NotesTermsProps = {
  notes?: string;
  terms?: string;
};

export function NotesTerms({ notes, terms }: NotesTermsProps) {
  if (!notes && !terms) return null;
  return (
    <View style={docStyles.notesTerms}>
      {notes && (
        <View style={{ marginBottom: 8 }}>
          <Text style={docStyles.notesTermsLabel}>Notes</Text>
          <Text>{notes}</Text>
        </View>
      )}
      {terms && (
        <View>
          <Text style={docStyles.notesTermsLabel}>Terms & conditions</Text>
          <Text>{terms}</Text>
        </View>
      )}
    </View>
  );
}
