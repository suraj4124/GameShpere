import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
    label,
    icon,
    inputType,
    keyboardType,
    value,
    onChangeText,
    secureTextEntry,
    placeholder,
    multiline,
    numberOfLines
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
                {icon && <Ionicons name={icon} size={20} color={COLORS.textSecondary} style={styles.icon} />}
                <TextInput
                    placeholder={placeholder || label}
                    placeholderTextColor="#9ca3af"
                    keyboardType={keyboardType}
                    style={[styles.input, multiline && styles.multilineInput]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={inputType === 'password' || secureTextEntry}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                />
                {inputType === 'password' && (
                    <Ionicons name="eye-off-outline" size={20} color={COLORS.textSecondary} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '600'
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface, // Light gray background
        borderRadius: 12,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 55,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    multilineContainer: {
        height: 'auto',
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        height: '100%',
    },
    multilineInput: {
        textAlignVertical: 'top',
        minHeight: 80,
    }
});

export default InputField;
