import { RotateCcw } from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/switch/Label";

/**
 * One labeled, validated input row. `field` comes from profileSchema, so the
 * label, placeholder, width and error text stay in sync across all forms.
 */
export default function FormField({ field, value, onChange, onBlur, error, disabled }) {
    const hasError = Boolean(error);
    const hint = hasError ? error : field.hint || (field.required ? undefined : "Optional");

    return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
            <Label htmlFor={`pf-${field.name}`}>
                {field.label}
                {field.required ? <span className="text-danger"> *</span> : null}
            </Label>
            <Input
                id={`pf-${field.name}`}
                name={field.name}
                type="text"
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                maxLength={field.maxLength}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                error={hasError}
                hint={hint}
            />
        </div>
    );
}

/**
 * Shared modal footer: Reset (only when the form is dirty), Cancel, and the
 * primary submit button with a saving spinner. Save is disabled until the
 * form actually differs from the saved values, and while a save is running.
 */
export function ModalActions({ onCancel, onReset, showReset, saving, dirty, label = "Save changes" }) {
    return (
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:items-center sm:justify-end">
            {showReset && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    disabled={saving}
                    className="sm:mr-auto"
                    startIcon={<RotateCcw className="h-4 w-4" />}
                >
                    Reset
                </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={saving}>
                Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving || !dirty} className="min-w-[150px]">
                {saving && (
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3 3 3H4z" />
                    </svg>
                )}
                {saving ? "Saving…" : label}
            </Button>
        </div>
    );
}
