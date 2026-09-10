import { useEffect, useMemo, useState } from "react";
import { MapPin, PencilLine, PlusCircle, TriangleAlert } from "lucide-react";
import { useModal } from "../../Hooks/useModal";
import { Modal } from "../ui/model";
import Button from "../ui/button/Button";
import FormField, { ModalActions } from "./FormField";
import { ADDRESS_FIELDS, docPatchFromForm, formValuesFromDoc, validateFields } from "./profileSchema";
import useUserProfile from "../../Hooks/useUserProfile";

export default function UserAddressCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { data, loading, error, retry, saveFields } = useUserProfile();

    const [form, setForm] = useState(() => formValuesFromDoc(ADDRESS_FIELDS));
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Re-seed the form each time the modal opens (or the doc changes).
    useEffect(() => {
        if (isOpen) {
            setForm(formValuesFromDoc(ADDRESS_FIELDS, data));
            setErrors({});
            setSubmitted(false);
        }
    }, [isOpen, data]);

    const dirty = useMemo(() => {
        const seed = formValuesFromDoc(ADDRESS_FIELDS, data);
        return ADDRESS_FIELDS.some((f) => (form[f.name] || "").trim() !== (seed[f.name] || "").trim());
    }, [form, data]);

    const attemptClose = () => {
        if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
        closeModal();
    };

    const setField = (name, value) => {
        const next = { ...form, [name]: value };
        setForm(next);
        // Once the user has attempted a submit, re-validate live as they type.
        if (submitted) setErrors(validateFields(ADDRESS_FIELDS, next));
    };

    const handleBlur = (name) => {
        const def = ADDRESS_FIELDS.find((f) => f.name === name);
        const msg = def?.validate?.(form[name] || "") || undefined;
        setErrors((prev) => ({ ...prev, [name]: msg }));
    };

    const reset = () => {
        setForm(formValuesFromDoc(ADDRESS_FIELDS, data));
        setErrors({});
        setSubmitted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextErrors = validateFields(ADDRESS_FIELDS, form);
        setErrors(nextErrors);
        setSubmitted(true);
        if (Object.values(nextErrors).some(Boolean)) return;

        setSaving(true);
        const ok = await saveFields(docPatchFromForm(ADDRESS_FIELDS, form), "Address");
        setSaving(false);
        if (ok) closeModal();
    };

    if (loading) {
        return (
            <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
                <div className="h-5 w-32 animate-pulse rounded bg-[var(--glass-highlight-strong)]" />
                <div className="mt-6 flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[var(--glass-highlight)]" />
                    <div className="flex-1 space-y-2">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-4 w-48 animate-pulse rounded bg-[var(--glass-highlight)]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
                <div className="flex items-center gap-3 text-danger">
                    <TriangleAlert className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
                    Try again
                </Button>
            </div>
        );
    }

    const line1 = data?.addressline1 || "";
    const line2 = data?.addressline2 || "";
    const line3 = [data?.city, data?.state].filter(Boolean).join(", ");
    const line4 = [data?.postalcode, data?.country].filter(Boolean).join(", ");
    const addressLines = [line1, line2, line3, line4].filter(Boolean);
    const hasAddress = addressLines.length > 0;

    return (
        <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-strong">Address</h4>
                    <p className="mt-0.5 text-sm text-muted">Used for deliveries and faster checkout.</p>
                </div>
                {hasAddress && (
                    <Button variant="outline" size="sm" onClick={openModal} startIcon={<PencilLine className="h-4 w-4" />}>
                        Edit
                    </Button>
                )}
            </div>

            {hasAddress ? (
                <div className="mt-6 flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--glass-highlight)]">
                        <MapPin className="h-4 w-4 text-secondary" />
                    </div>
                    <address className="text-sm font-medium leading-6 not-italic text-strong">
                        {line1}
                        <br />
                        {line2 && (
                            <>
                                {line2}
                                <br />
                            </>
                        )}
                        {line3}
                        {line4 && (
                            <>
                                <br />
                                {line4}
                            </>
                        )}
                    </address>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openModal}
                    className="mt-6 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-subtle-strong px-4 py-8 text-center transition-colors hover:bg-[var(--glass-highlight)] cursor-pointer"
                >
                    <PlusCircle className="h-6 w-6 text-[var(--primary-color)]" />
                    <span className="text-sm font-semibold text-strong">No address saved yet</span>
                    <span className="text-xs text-muted">
                        Add one so checkout is quicker and deliveries reach the right place.
                    </span>
                </button>
            )}

            <Modal isOpen={isOpen} onClose={attemptClose} className="max-w-[640px] m-4">
                <form onSubmit={handleSubmit} className="w-full max-w-[640px] p-5 lg:p-8">
                    <h4 className="text-xl font-semibold text-strong">{hasAddress ? "Edit address" : "Add address"}</h4>
                    <p className="mt-1 text-sm text-secondary">
                        We use this for deliveries and to pre-fill checkout, so make sure it's up to date.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ADDRESS_FIELDS.map((f) => (
                            <FormField
                                key={f.name}
                                field={f}
                                value={form[f.name] || ""}
                                onChange={(e) => setField(f.name, e.target.value)}
                                onBlur={() => handleBlur(f.name)}
                                error={errors[f.name]}
                                disabled={saving}
                            />
                        ))}
                    </div>

                    <ModalActions
                        onCancel={attemptClose}
                        onReset={reset}
                        showReset={dirty}
                        saving={saving}
                        dirty={dirty}
                        label="Save address"
                    />
                </form>
            </Modal>
        </div>
    );
}
